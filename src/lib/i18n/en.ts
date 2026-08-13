export interface TranslationShape {
  common: {
    close: string;
    back: string;
    tryAgain: string;
  };
  welcome: {
    title: string;
    subtitle: string;
    feature1: string;
    feature2: string;
    feature3: string;
    startScan: string;
    viewHistory: string;
    disclaimer: string;
  };
  scan: {
    permissionTitle: string;
    permissionText: string;
    grantAccess: string;
    positionFace: string;
    guideHint: string;
  };
  analyzing: {
    steps: string[];
    errorTitle: string;
    errors: {
      engineNotReady: string;
      engineStartFailed: string;
      analysisTimeout: string;
      noFace: string;
      captureFailed: string;
      unknown: string;
    };
  };
  results: {
    title: string;
    tipsTitle: string;
    scanAgain: string;
    viewHistory: string;
  };
  history: {
    title: string;
    empty: string;
    startScan: string;
    deleteHint: string;
    loadError: string;
  };
  categories: {
    symmetry: string;
    proportions: string;
    jawline: string;
    skin: string;
  };
  tips: {
    symmetryHairstyle: string;
    jawlineGrooming: string;
    skincareRoutine: string;
    eyebrowsBalance: string;
    thirdsProportions: string;
    lightingTip: string;
    sleepWaterTip: string;
  };
}

export const en: TranslationShape = {
  common: {
    close: "Close",
    back: "Back",
    tryAgain: "Try again",
  },
  welcome: {
    title: "GlowMax",
    subtitle: "Scan your face, get your Glow Score, and personal tips to level up your look.",
    feature1: "Symmetry & proportions analyzed on-device",
    feature2: "Skin-tone feedback and care tips",
    feature3: "Track your progress over time",
    startScan: "Start scan",
    viewHistory: "View history",
    disclaimer: "Just for fun & self-improvement tips — not a scientific measure of your worth. 💜",
  },
  scan: {
    permissionTitle: "Camera access needed",
    permissionText:
      "GlowMax needs your camera to scan your face. The photo is analyzed right on your phone and only uploaded if you choose to save the result.",
    grantAccess: "Grant camera access",
    positionFace: "Position your face",
    guideHint: "Look straight ahead in even lighting, without glasses",
  },
  analyzing: {
    steps: [
      "Reading facial landmarks…",
      "Calculating symmetry…",
      "Analyzing proportions…",
      "Evaluating skin tone…",
      "Building your tips…",
    ],
    errorTitle: "Oops 😕",
    errors: {
      engineNotReady: "The analysis engine isn't ready yet, please try again in a moment.",
      engineStartFailed: "The analysis engine couldn't start. Check your internet connection.",
      analysisTimeout: "The analysis took too long.",
      noFace: "Couldn't find a face in the photo. Try again with better lighting.",
      captureFailed: "Couldn't take the photo.",
      unknown: "Something went wrong during the analysis.",
    },
  },
  results: {
    title: "Your Glow Score",
    tipsTitle: "Your tips ✨",
    scanAgain: "Scan again",
    viewHistory: "View history",
  },
  history: {
    title: "History",
    empty: "No scans yet. Do your first scan!",
    startScan: "Start scan",
    deleteHint: "Press and hold to delete",
    loadError: "Couldn't load history.",
  },
  categories: {
    symmetry: "Symmetry",
    proportions: "Proportions",
    jawline: "Jawline",
    skin: "Skin tone",
  },
  tips: {
    symmetryHairstyle:
      "Your symmetry can be lifted visually with a hairstyle that balances both sides of your face, and by practicing smiling/posing straight at the camera.",
    jawlineGrooming:
      "Your jawline can be emphasized with beard styling or mewing exercises, plus a hairstyle with volume at the temples.",
    skincareRoutine:
      "A simple skincare routine (cleanser, moisturizer, daily SPF) makes a big difference to skin evenness and glow within a few weeks.",
    eyebrowsBalance:
      "Eyebrow shape can be adjusted (trimming/threading) to create more visual balance between the eyes.",
    thirdsProportions:
      "Hairstyle and facial hair can be used to visually even out the proportions between forehead, nose, and chin.",
    lightingTip: "Good front-facing lighting and a relaxed posture make the biggest difference in photos.",
    sleepWaterTip: "Sleep, water, and regular exercise show up quickly in skin tone and facial contour.",
  },
};
