import type { CategoryScore, Landmark, ScoreCategory } from "../types/scan";

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

export type SkinMetrics = {
  evenness: number; // 0-100, higher = more even tone, from WebView pixel sampling
  brightness: number; // 0-100
};

export function computeScan(
  landmarks: Landmark[],
  skin?: SkinMetrics
): { overallScore: number; categories: CategoryScore[]; tips: string[] } {
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

  // --- Proportions: classic facial-harmony ratios ---
  const lengthWidthRatio = faceHeight / faceWidth;
  const eyeWidthLeft = dist(p(IDX.eyeOuterLeft), p(IDX.eyeInnerLeft));
  const eyeWidthRight = dist(p(IDX.eyeOuterRight), p(IDX.eyeInnerRight));
  const avgEyeWidth = (eyeWidthLeft + eyeWidthRight) / 2;
  const interocular = dist(p(IDX.eyeInnerLeft), p(IDX.eyeInnerRight));
  const eyeSpacingRatio = interocular / avgEyeWidth;
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
      ratioScore(eyeSpacingRatio, 1.0, 0.22) +
      ratioScore(noseMouthRatio, 0.75, 0.22) +
      clamp(100 - thirdsVariance * 220)) /
      4
  );

  // --- Jawline: definition proxy from jaw width vs face width + angularity ---
  const jawWidth = dist(p(IDX.jawLeft), p(IDX.jawRight));
  const jawFaceRatio = jawWidth / faceWidth;
  const jawlineScore = clamp(ratioScore(jawFaceRatio, 0.78, 0.2));

  // --- Skin: from WebView pixel sampling, or a neutral fallback ---
  const skinScore = skin ? clamp((skin.evenness + skin.brightness) / 2) : 68;

  const categories: CategoryScore[] = [
    { category: "symmetry", label: "Symmetri", score: Math.round(symmetryScore) },
    { category: "proportions", label: "Proportioner", score: Math.round(proportionsScore) },
    { category: "jawline", label: "Käklinje", score: Math.round(jawlineScore) },
    { category: "skin", label: "Hudton", score: Math.round(skinScore) },
  ];

  const overallScore = Math.round(
    categories.reduce((sum, c) => sum + c.score, 0) / categories.length
  );

  const tips = buildTips({
    symmetryScore,
    proportionsScore,
    jawlineScore,
    skinScore,
    eyeSpacingRatio,
    noseMouthRatio,
    thirdsVariance,
  });

  return { overallScore, categories, tips };
}

function buildTips(m: {
  symmetryScore: number;
  proportionsScore: number;
  jawlineScore: number;
  skinScore: number;
  eyeSpacingRatio: number;
  noseMouthRatio: number;
  thirdsVariance: number;
}): string[] {
  const tips: string[] = [];

  if (m.symmetryScore < 75) {
    tips.push(
      "Din symmetri kan lyftas visuellt med en frisyr som balanserar ansiktets sidor, och genom att träna på att le/posera rakt mot kameran."
    );
  }
  if (m.jawlineScore < 70) {
    tips.push(
      "Käklinjen kan framhävas med skäggstyling eller mewing-övningar, samt en frisyr med volym vid tinningarna."
    );
  }
  if (m.skinScore < 70) {
    tips.push(
      "En enkel hudvårdsrutin (rengöring, fuktkräm, SPF dagligen) gör stor skillnad för hudens jämnhet och lyster inom några veckor."
    );
  }
  if (m.eyeSpacingRatio < 0.85 || m.eyeSpacingRatio > 1.15) {
    tips.push(
      "Ögonbrynens form kan justeras (trimning/tejp) för att skapa mer visuell balans mellan ögonen."
    );
  }
  if (m.thirdsVariance > 0.15) {
    tips.push(
      "Frisyr och skägg kan användas för att visuellt jämna ut proportionerna mellan panna, näsa och haka."
    );
  }
  tips.push("Bra belysning framifrån och en avslappnad hållning gör mest skillnad på foton.");
  tips.push("Sömn, vatten och regelbunden träning märks snabbt i hudton och ansiktskontur.");

  return tips.slice(0, 5);
}
