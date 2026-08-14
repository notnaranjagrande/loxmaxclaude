import { colors } from "./theme";

export type Tier = "high" | "normal" | "low";

export function getTier(score: number): Tier {
  if (score >= 80) return "high";
  if (score >= 60) return "normal";
  return "low";
}

export function getTierColor(tier: Tier): string {
  if (tier === "high") return colors.success;
  if (tier === "normal") return colors.warning;
  return colors.low;
}

// A playful, score-derived estimate — not a real population statistic.
// Clamped so it never reads as "you're in the bottom X%".
export function getTopPercent(score: number): number {
  return Math.round(Math.max(5, Math.min(90, 100 - score)));
}
