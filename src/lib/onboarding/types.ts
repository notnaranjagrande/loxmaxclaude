export type IntroStepConfig = {
  type: "intro";
  key: string;
  emoji: string;
  title: string;
  subtitle: string;
};

export type MultiSelectStepConfig = {
  type: "multiSelect";
  key: string;
  title: string;
  subtitle: string;
  options: string[];
};

export type SingleSelectStepConfig = {
  type: "singleSelect";
  key: string;
  title: string;
  options: { label: string; sub: string }[];
};

export type SliderStepConfig = {
  type: "slider";
  key: string;
  title: string;
  minLabel: string;
  maxLabel: string;
};

export type InfoStepConfig = {
  type: "info";
  key: string;
  variant: "graph" | "mission" | "encouragement";
  eyebrow?: string;
  title: string;
  subtitle: string;
};

export type AnalyzingStepConfig = {
  type: "analyzing";
  key: string;
  items: string[];
};

export type ComparisonStepConfig = {
  type: "comparison";
  key: string;
  title: string;
  leftTitle: string;
  leftItems: string[];
  leftImage?: number; // require()'d asset, optional
  rightTitle: string;
  rightItems: string[];
  rightImage?: number; // require()'d asset, optional
};

export type PaywallStepConfig = {
  type: "paywall";
  key: string;
  title: string;
  subtitle: string;
  features: string[];
};

export type OnboardingStepConfig =
  | IntroStepConfig
  | MultiSelectStepConfig
  | SingleSelectStepConfig
  | SliderStepConfig
  | InfoStepConfig
  | AnalyzingStepConfig
  | ComparisonStepConfig
  | PaywallStepConfig;

export type OnboardingAnswers = Record<string, string | string[] | number>;
