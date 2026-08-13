import { File } from "expo-file-system";
import { decode } from "base64-arraybuffer";
import { supabase } from "./supabase";
import type { CategoryScore, ScanResult } from "../types/scan";

const BUCKET = "scan-photos";

export async function uploadScan(params: {
  userId: string;
  photoUri: string;
  overallScore: number;
  categories: CategoryScore[];
  tips: string[];
}): Promise<ScanResult> {
  const { userId, photoUri, overallScore, categories, tips } = params;

  const base64 = await new File(photoUri).base64();
  const scanId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const path = `${userId}/${scanId}.jpg`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, decode(base64), { contentType: "image/jpeg", upsert: false });
  if (uploadError) throw uploadError;

  const { data: row, error: insertError } = await supabase
    .from("scans")
    .insert({
      user_id: userId,
      photo_path: path,
      overall_score: overallScore,
      categories,
      tips,
    })
    .select()
    .single();
  if (insertError) throw insertError;

  const { data: signed } = await supabase.storage.from(BUCKET).createSignedUrl(path, 3600);

  return {
    id: row.id,
    createdAt: row.created_at,
    photoUri: signed?.signedUrl ?? photoUri,
    photoPath: row.photo_path,
    overallScore: row.overall_score,
    categories: row.categories,
    tips: row.tips,
  };
}

export async function fetchScans(userId: string): Promise<ScanResult[]> {
  const { data, error } = await supabase
    .from("scans")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  if (!data) return [];

  const results: ScanResult[] = [];
  for (const row of data) {
    const { data: signed } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(row.photo_path, 3600);
    results.push({
      id: row.id,
      createdAt: row.created_at,
      photoUri: signed?.signedUrl ?? "",
      photoPath: row.photo_path,
      overallScore: row.overall_score,
      categories: row.categories,
      tips: row.tips,
    });
  }
  return results;
}

export async function deleteScan(id: string, photoPath: string) {
  await supabase.storage.from(BUCKET).remove([photoPath]);
  const { error } = await supabase.from("scans").delete().eq("id", id);
  if (error) throw error;
}
