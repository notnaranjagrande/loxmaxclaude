export type Landmark = { x: number; y: number; z?: number };

export type ScoreCategory = "symmetry" | "proportions" | "skin" | "jawline";

export type CategoryScore = {
  category: ScoreCategory;
  score: number; // 0-100
};

export type TipKey =
  | "symmetryHairstyle"
  | "jawlineGrooming"
  | "skincareRoutine"
  | "eyebrowsBalance"
  | "thirdsProportions"
  | "lightingTip"
  | "sleepWaterTip";

export type ScanResult = {
  id: string;
  createdAt: string;
  photoUri: string;
  photoPath?: string;
  overallScore: number;
  categories: CategoryScore[];
  tips: TipKey[];
};

export type ScanRow = {
  id: string;
  user_id: string;
  photo_path: string;
  overall_score: number;
  categories: CategoryScore[];
  tips: TipKey[];
  created_at: string;
};
