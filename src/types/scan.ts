export type Landmark = { x: number; y: number; z?: number };

export type ScoreCategory = "symmetry" | "proportions" | "skin" | "jawline";

export type CategoryScore = {
  category: ScoreCategory;
  label: string;
  score: number; // 0-100
};

export type ScanResult = {
  id: string;
  createdAt: string;
  photoUri: string;
  photoPath?: string;
  overallScore: number;
  categories: CategoryScore[];
  tips: string[];
};

export type ScanRow = {
  id: string;
  user_id: string;
  photo_path: string;
  overall_score: number;
  categories: CategoryScore[];
  tips: string[];
  created_at: string;
};
