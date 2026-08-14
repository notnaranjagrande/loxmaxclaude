import type { CategoryScore, Landmark, ScoreCategory, TipKey } from "../types/scan";

// Deterministic per-category advice, independent of which tips made the
// (capped) `tips` array on any given scan — always available in the UI.
export const CATEGORY_TIP: Record<ScoreCategory, TipKey> = {
  symmetry: "symmetryHairstyle",
  jawline: "jawlineGrooming",
  cheekbones: "cheekboneContour",
  eyes: "eyebrowsBalance",
  proportions: "thirdsProportions",
  skin: "skincareRoutine",
};

// MediaPipe FaceMesh (478 pt) landmark indices used for measurements.
const IDX = {
  faceTop: 10,
  chin: 152,
  cheekLeft: 234,
  cheekRight: 454,
  eyeOuterLeft: 33,
  eyeInnerLeft: 133,
  eyeOuterRight: 263,
  eyeInnerRight: 362,
  browLeft: 105,
  browRight: 334,
  noseBase: 2,
  nostrilLeft: 129,
  nostrilRight: 358,
  mouthLeft: 61,
  mouthRight: 291,
  jawLeft: 172,
  jawRight: 397,
  nasion: 168,
};

function dist(a: Landmark, b: Landmark) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function clamp(n: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, n));
}

// Converts a "closeness to ideal ratio" into a 0-100 score.
// tolerance = ratio deviation that still scores ~70.
function ratioScore(actual: number, ideal: number, tolerance: number) {
  const deviation = Math.abs(actual - ideal) / ideal;
  return clamp(100 - (deviation / tolerance) * 30);
}

// Same idea, but for values where an "ideal / tolerance" absolute
// comparison makes more sense than a ratio (e.g. small tilt angles).
function linearScore(actual: number, ideal: number, toleranceAbs: number) {
  const deviation = Math.abs(actual - ideal);
  return clamp(100 - (deviation / toleranceAbs) * 30);
}

export type SkinMetrics = {
  evenness: number; // 0-100, higher = more even tone, from WebView pixel sampling
  brightness: number; // 0-100
};

export function computeScan(
  landmarks: Landmark[],
  skin?: SkinMetrics
): { overallScore: number; categories: CategoryScore[]; tips: TipKey[] } {
  const p = (i: number) => landmarks[i];

  const faceWidth = dist(p(IDX.cheekLeft), p(IDX.cheekRight));
  const faceHeight = dist(p(IDX.faceTop), p(IDX.chin));
  const midlineX = (p(IDX.faceTop).x + p(IDX.chin).x) / 2;

  // --- Symmetry: compare mirrored landmark pairs' distance from the midline ---
  const mirrorPairs: [number, number][] = [
    [IDX.eyeOuterLeft, IDX.eyeOuterRight],
    [IDX.eyeInnerLeft, IDX.eyeInnerRight],
    [IDX.browLeft, IDX.browRight],
    [IDX.mouthLeft, IDX.mouthRight],
    [IDX.jawLeft, IDX.jawRight],
    [IDX.cheekLeft, IDX.cheekRight],
  ];
  let symmetryDeviation = 0;
  for (const [l, r] of mirrorPairs) {
    const dl = Math.abs(p(l).x - midlineX);
    const dr = Math.abs(p(r).x - midlineX);
    symmetryDeviation += Math.abs(dl - dr) / faceWidth;
  }
  symmetryDeviation /= mirrorPairs.length;
  const symmetryScore = clamp(100 - symmetryDeviation * 600);

  // --- Proportions: classic facial-harmony ratios (face shape + thirds) ---
  const lengthWidthRatio = faceHeight / faceWidth;
  const noseWidth = dist(p(IDX.nostrilLeft), p(IDX.nostrilRight));
  const mouthWidth = dist(p(IDX.mouthLeft), p(IDX.mouthRight));
  const noseMouthRatio = noseWidth / mouthWidth;

  const upperThird = dist(p(IDX.faceTop), p(IDX.nasion));
  const midThird = dist(p(IDX.nasion), p(IDX.noseBase));
  const lowerThird = dist(p(IDX.noseBase), p(IDX.chin));
  const thirds = [upperThird, midThird, lowerThird];
  const thirdsMean = thirds.reduce((a, b) => a + b, 0) / 3;
  const thirdsVariance =
    thirds.reduce((sum, t) => sum + Math.abs(t - thirdsMean), 0) / 3 / thirdsMean;

  const proportionsScore = clamp(
    (ratioScore(lengthWidthRatio, 1.5, 0.18) +
      ratioScore(noseMouthRatio, 0.75, 0.22) +
      clamp(100 - thirdsVariance * 220)) /
      3
  );

  // --- Jawline: definition proxy from jaw width vs face width ---
  const jawWidth = dist(p(IDX.jawLeft), p(IDX.jawRight));
  const jawFaceRatio = jawWidth / faceWidth;
  const jawlineScore = clamp(ratioScore(jawFaceRatio, 0.78, 0.2));

  // --- Eyes: spacing (one-eye-width apart) + canthal tilt ---
  const eyeWidthLeft = dist(p(IDX.eyeOuterLeft), p(IDX.eyeInnerLeft));
  const eyeWidthRight = dist(p(IDX.eyeOuterRight), p(IDX.eyeInnerRight));
  const avgEyeWidth = (eyeWidthLeft + eyeWidthRight) / 2;
  const interocular = dist(p(IDX.eyeInnerLeft), p(IDX.eyeInnerRight));
  const eyeSpacingRatio = interocular / avgEyeWidth;
  const eyeSpacingScore = ratioScore(eyeSpacingRatio, 1.0, 0.22);

  // Positive tilt = outer corner higher than inner corner (smaller y = higher on screen).
  const tiltLeft = (p(IDX.eyeInnerLeft).y - p(IDX.eyeOuterLeft).y) / eyeWidthLeft;
  const tiltRight = (p(IDX.eyeInnerRight).y - p(IDX.eyeOuterRight).y) / eyeWidthRight;
  const avgTilt = (tiltLeft + tiltRight) / 2;
  const tiltScore = linearScore(avgTilt, 0.1, 0.12);

  const eyesScore = clamp((eyeSpacingScore + tiltScore) / 2);

  // --- Cheekbones: cheekbone width vs jaw width (V-taper proxy) ---
  const cheekJawRatio = faceWidth / jawWidth;
  const cheekbonesScore = clamp(ratioScore(cheekJawRatio, 1.15, 0.18));

  // --- Skin: from WebView pixel sampling, or a neutral fallback ---
  const skinScore = skin ? clamp((skin.evenness + skin.brightness) / 2) : 68;

  const categories: CategoryScore[] = [
    { category: "symmetry", score: Math.round(symmetryScore) },
    { category: "jawline", score: Math.round(jawlineScore) },
    { category: "cheekbones", score: Math.round(cheekbonesScore) },
    { category: "eyes", score: Math.round(eyesScore) },
    { category: "proportions", score: Math.round(proportionsScore) },
    { category: "skin", score: Math.round(skinScore) },
  ];

  const overallScore = Math.round(
    categories.reduce((sum, c) => sum + c.score, 0) / categories.length
  );

  const tips = buildTips({
    symmetryScore,
    proportionsScore,
    jawlineScore,
    skinScore,
    eyesScore,
    cheekbonesScore,
    thirdsVariance,
  });

  return { overallScore, categories, tips };
}

function buildTips(m: {
  symmetryScore: number;
  proportionsScore: number;
  jawlineScore: number;
  skinScore: number;
  eyesScore: number;
  cheekbonesScore: number;
  thirdsVariance: number;
}): TipKey[] {
  const tips: TipKey[] = [];

  if (m.symmetryScore < 75) tips.push("symmetryHairstyle");
  if (m.jawlineScore < 70) tips.push("jawlineGrooming");
  if (m.skinScore < 70) tips.push("skincareRoutine");
  if (m.eyesScore < 70) tips.push("eyebrowsBalance");
  if (m.cheekbonesScore < 70) tips.push("cheekboneContour");
  if (m.thirdsVariance > 0.15) tips.push("thirdsProportions");
  tips.push("lightingTip");
  tips.push("sleepWaterTip");

  return tips.slice(0, 6);
}
