import type { TranslationShape } from "./en";

export const sv: TranslationShape = {
  common: {
    close: "Stäng",
    back: "Tillbaka",
    tryAgain: "Försök igen",
    skip: "Hoppa över",
    continueLabel: "Fortsätt",
  },
  onboarding: {
    perWeek: "per vecka",
    perYear: "faktureras {price}/år",
    billedYearly: "Bäst värde",
    startTrial: "Starta gratis provperiod",
    subscribe: "Fortsätt",
    restorePurchases: "Återställ köp",
    terms: "Villkor",
    privacy: "Integritet",
    loadingPlans: "Laddar planer…",
    purchaseError: "Något gick fel. Försök igen.",
  },
  welcome: {
    title: "GlowMax",
    subtitle: "Scanna ditt ansikte, få din Glow Score och personliga tips för att lyfta din look.",
    feature1: "Symmetri & proportioner analyserat on-device",
    feature2: "Hudton-feedback och skötseltips",
    feature3: "Följ din utveckling över tid",
    startScan: "Starta scan",
    viewHistory: "Se historik",
    disclaimer: "Bara för skoj skull & självförbättringstips — inte ett vetenskapligt mått på ditt värde. 💜",
    privacyLink: "Integritetspolicy",
  },
  scan: {
    permissionTitle: "Kameraåtkomst behövs",
    permissionText:
      "GlowMax behöver kameran för att scanna ditt ansikte. Bilden analyseras direkt på din telefon och laddas bara upp om du väljer att spara resultatet.",
    grantAccess: "Ge kameraåtkomst",
    positionFace: "Positionera ditt ansikte",
    guideHint: "Titta rakt fram i jämnt ljus, utan glasögon",
  },
  analyzing: {
    steps: [
      "Läser av ansiktspunkter…",
      "Beräknar symmetri…",
      "Analyserar proportioner…",
      "Utvärderar hudton…",
      "Skapar dina tips…",
    ],
    errorTitle: "Hoppsan 😕",
    errors: {
      engineNotReady: "Ansiktsmotorn är inte redo än, försök igen om en stund.",
      engineStartFailed: "Ansiktsmotorn kunde inte starta. Kolla din internetanslutning.",
      analysisTimeout: "Analysen tog för lång tid.",
      noFace: "Kunde inte hitta något ansikte i bilden. Försök igen med bättre belysning.",
      captureFailed: "Kunde inte ta bilden.",
      unknown: "Något gick fel under analysen.",
    },
  },
  results: {
    title: "Din Glow Score",
    tipsTitle: "Dina tips ✨",
    scanAgain: "Scanna igen",
    viewHistory: "Se historik",
    topPercent: "Topp {n}%",
    showAdvice: "Visa råd",
    hideAdvice: "Dölj råd",
    generalTipsTitle: "Ett par till tips",
  },
  tiers: {
    high: "Hög",
    normal: "Normal",
    low: "Låg",
  },
  history: {
    title: "Historik",
    empty: "Inga scans än. Gör din första scan!",
    startScan: "Starta scan",
    deleteHint: "Tryck och håll för att ta bort",
    loadError: "Kunde inte hämta historik.",
  },
  categories: {
    symmetry: "Symmetri",
    proportions: "Proportioner",
    jawline: "Käklinje",
    skin: "Hudton",
    eyes: "Ögon",
    cheekbones: "Kindben",
  },
  tips: {
    symmetryHairstyle:
      "Din symmetri kan lyftas visuellt med en frisyr som balanserar ansiktets sidor, och genom att träna på att le/posera rakt mot kameran.",
    jawlineGrooming:
      "Käklinjen kan framhävas med skäggstyling eller mewing-övningar, samt en frisyr med volym vid tinningarna.",
    skincareRoutine:
      "En enkel hudvårdsrutin (rengöring, fuktkräm, SPF dagligen) gör stor skillnad för hudens jämnhet och lyster inom några veckor.",
    eyebrowsBalance:
      "Ögonbrynens form och lätt mascara/eyeliner kan förstärka din ögonform och förbättra den visuella balansen mellan ögonen.",
    thirdsProportions:
      "Frisyr och skägg kan användas för att visuellt jämna ut proportionerna mellan panna, näsa och haka.",
    cheekboneContour:
      "Subtil konturering, en frisyr med volym vid sidorna eller ansiktsövningar kan hjälpa till att framhäva kindbenen visuellt.",
    lightingTip: "Bra belysning framifrån och en avslappnad hållning gör mest skillnad på foton.",
    sleepWaterTip: "Sömn, vatten och regelbunden träning märks snabbt i hudton och ansiktskontur.",
  },
};
