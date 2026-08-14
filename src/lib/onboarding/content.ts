import type { OnboardingStepConfig } from "./types";
import type { Locale } from "../i18n";

const en: OnboardingStepConfig[] = [
  {
    type: "intro",
    key: "welcome",
    emoji: "✨",
    title: "Analyze your face",
    subtitle: "Scan your face for symmetry, proportions, and skin — all analyzed privately on your device.",
  },
  {
    type: "multiSelect",
    key: "motivation",
    title: "What brings you to GlowMax?",
    subtitle: "Select as many as you like",
    options: [
      "Look better in photos",
      "Feel more confident",
      "Improve my skincare routine",
      "Just curious",
      "All of the above",
    ],
  },
  {
    type: "singleSelect",
    key: "confidence",
    title: "How would you rate your current confidence in your appearance?",
    options: [
      { label: "Not confident", sub: "I'm pretty self-conscious" },
      { label: "Somewhat confident", sub: "It depends on the day" },
      { label: "Neutral", sub: "I don't think about it much" },
      { label: "Confident", sub: "I generally feel good" },
      { label: "Very confident", sub: "I feel great about how I look" },
    ],
  },
  {
    type: "slider",
    key: "thinkFrequency",
    title: "How often do you think about your appearance?",
    minLabel: "Rarely",
    maxLabel: "Often",
  },
  {
    type: "multiSelect",
    key: "focusAreas",
    title: "Which areas would you like to focus on?",
    subtitle: "Select as many as you like",
    options: ["Jawline definition", "Skin clarity", "Facial symmetry", "Overall glow"],
  },
  {
    type: "info",
    key: "graph",
    variant: "graph",
    eyebrow: "Small steps, real progress",
    title: "Consistency compounds",
    subtitle:
      "Tracking your scans over weeks — alongside small habits like skincare and sleep — is how real, visible change happens. No shortcuts, just steady progress.",
  },
  {
    type: "slider",
    key: "skincareSatisfaction",
    title: "How satisfied are you with your current skincare routine?",
    minLabel: "Not satisfied",
    maxLabel: "Very satisfied",
  },
  {
    type: "info",
    key: "mission",
    variant: "mission",
    eyebrow: "Our mission",
    title: "Help you feel good about how you look",
    subtitle:
      "With honest, private tools — not filters, not comparisons to other people. Just a clear read on your own face, and constructive tips to work with.",
  },
  {
    type: "comparison",
    key: "comparison",
    title: "Without vs. with GlowMax",
    leftTitle: "WITHOUT GLOWMAX",
    leftItems: [
      "Guessing what to work on",
      "No way to track changes over time",
      "Generic advice that isn't about your face",
    ],
    rightTitle: "WITH GLOWMAX",
    rightItems: [
      "Clear, personalized feedback",
      "Progress tracked scan over scan",
      "Tips based on your actual measurements",
    ],
  },
  {
    type: "analyzing",
    key: "settingUp",
    items: [
      "Personalization saved",
      "Scan engine ready",
      "Tips personalized to your answers",
    ],
  },
  {
    type: "paywall",
    key: "paywall",
    title: "Your GlowMax Plan",
    subtitle: "Unlimited scans, full category breakdowns, and your private history.",
    features: [
      "Unlimited face scans",
      "Full 6-category breakdown",
      "Personalized advice per category",
      "Private scan history & progress tracking",
    ],
  },
];

const sv: OnboardingStepConfig[] = [
  {
    type: "intro",
    key: "welcome",
    emoji: "✨",
    title: "Analysera ditt ansikte",
    subtitle: "Scanna ditt ansikte för symmetri, proportioner och hud — allt analyserat privat på din enhet.",
  },
  {
    type: "multiSelect",
    key: "motivation",
    title: "Vad för dig till GlowMax?",
    subtitle: "Välj så många du vill",
    options: [
      "Se bättre ut på foton",
      "Känna mig mer självsäker",
      "Förbättra min hudvårdsrutin",
      "Bara nyfiken",
      "Allt ovanstående",
    ],
  },
  {
    type: "singleSelect",
    key: "confidence",
    title: "Hur skulle du skatta ditt nuvarande självförtroende kring ditt utseende?",
    options: [
      { label: "Inte självsäker", sub: "Jag är ganska osäker" },
      { label: "Något självsäker", sub: "Det beror på dagen" },
      { label: "Neutral", sub: "Jag tänker inte mycket på det" },
      { label: "Självsäker", sub: "Jag känner mig oftast bra" },
      { label: "Mycket självsäker", sub: "Jag känner mig jättebra" },
    ],
  },
  {
    type: "slider",
    key: "thinkFrequency",
    title: "Hur ofta tänker du på ditt utseende?",
    minLabel: "Sällan",
    maxLabel: "Ofta",
  },
  {
    type: "multiSelect",
    key: "focusAreas",
    title: "Vilka områden vill du fokusera på?",
    subtitle: "Välj så många du vill",
    options: ["Käklinjens definition", "Hudens klarhet", "Ansiktssymmetri", "Övergripande glow"],
  },
  {
    type: "info",
    key: "graph",
    variant: "graph",
    eyebrow: "Små steg, riktiga framsteg",
    title: "Konsekvens ger resultat",
    subtitle:
      "Att följa dina scans över veckor — tillsammans med små vanor som hudvård och sömn — är hur riktig, synlig förändring händer. Inga genvägar, bara stadiga framsteg.",
  },
  {
    type: "slider",
    key: "skincareSatisfaction",
    title: "Hur nöjd är du med din nuvarande hudvårdsrutin?",
    minLabel: "Inte nöjd",
    maxLabel: "Mycket nöjd",
  },
  {
    type: "info",
    key: "mission",
    variant: "mission",
    eyebrow: "Vårt uppdrag",
    title: "Hjälpa dig känna dig bra i ditt utseende",
    subtitle:
      "Med ärliga, privata verktyg — inga filter, inga jämförelser med andra. Bara en tydlig bild av ditt eget ansikte, och konstruktiva tips att jobba med.",
  },
  {
    type: "comparison",
    key: "comparison",
    title: "Utan vs. med GlowMax",
    leftTitle: "UTAN GLOWMAX",
    leftItems: [
      "Gissar vad du bör jobba på",
      "Inget sätt att följa förändring över tid",
      "Generiska råd som inte handlar om ditt ansikte",
    ],
    rightTitle: "MED GLOWMAX",
    rightItems: [
      "Tydlig, personlig feedback",
      "Framsteg spårade scan för scan",
      "Tips baserade på dina faktiska mått",
    ],
  },
  {
    type: "analyzing",
    key: "settingUp",
    items: [
      "Personalisering sparad",
      "Scan-motorn redo",
      "Tips anpassade efter dina svar",
    ],
  },
  {
    type: "paywall",
    key: "paywall",
    title: "Din GlowMax-plan",
    subtitle: "Obegränsade scans, fullständig kategori-genomgång och din privata historik.",
    features: [
      "Obegränsade ansiktsscans",
      "Full genomgång av 6 kategorier",
      "Personliga råd per kategori",
      "Privat historik & utvecklingsspårning",
    ],
  },
];

const content: Record<Locale, OnboardingStepConfig[]> = { en, sv };

export function getOnboardingSteps(locale: Locale): OnboardingStepConfig[] {
  return content[locale];
}
