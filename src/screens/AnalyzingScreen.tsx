import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { File } from "expo-file-system";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/RootNavigator";
import { useFaceMesh } from "../lib/FaceMeshContext";
import { computeScan } from "../lib/scoring";
import { uploadScan } from "../lib/scans";
import { useAuth } from "../lib/AuthContext";
import { colors, radii } from "../lib/theme";
import { useTranslation, tAnalyzingSteps } from "../lib/i18n";

type Props = NativeStackScreenProps<RootStackParamList, "Analyzing">;

export function AnalyzingScreen({ route, navigation }: Props) {
  const { photoUri } = route.params;
  const engineRef = useFaceMesh();
  const { session } = useAuth();
  const { t, locale } = useTranslation();
  const STEPS = tAnalyzingSteps(locale);
  const [stepIndex, setStepIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const ranRef = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
    }, 900);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;
    run();
  }, []);

  async function waitForEngine(timeoutMs = 20000) {
    const start = Date.now();
    while (!engineRef.current?.isReady()) {
      if (Date.now() - start > timeoutMs) throw new Error(t("analyzing.errors.engineStartFailed"));
      await new Promise((r) => setTimeout(r, 250));
    }
  }

  async function run() {
    try {
      await waitForEngine();
      const base64 = await new File(photoUri).base64();
      const dataUri = `data:image/jpeg;base64,${base64}`;

      const { landmarks, skin } = await engineRef.current!.analyze(dataUri);
      const { overallScore, categories, tips } = computeScan(landmarks, skin);

      if (session?.user?.id) {
        try {
          const saved = await uploadScan({
            userId: session.user.id,
            photoUri,
            overallScore,
            categories,
            tips,
          });
          navigation.replace("Results", { scan: saved, isNew: true });
          return;
        } catch (uploadErr) {
          console.warn("Could not save scan to Supabase:", uploadErr);
        }
      }

      navigation.replace("Results", {
        scan: {
          id: `local-${Date.now()}`,
          createdAt: new Date().toISOString(),
          photoUri,
          overallScore,
          categories,
          tips,
        },
        isNew: true,
      });
    } catch (err: any) {
      setError(err?.message ?? t("analyzing.errors.unknown"));
    }
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorTitle}>{t("analyzing.errorTitle")}</Text>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable style={styles.retryButton} onPress={() => navigation.replace("Scan")}>
          <Text style={styles.retryButtonText}>{t("common.tryAgain")}</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, styles.centerContent]}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.stepText}>{STEPS[stepIndex]}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  centerContent: { justifyContent: "center", alignItems: "center", paddingHorizontal: 32 },
  stepText: { color: colors.text, marginTop: 20, fontSize: 15 },
  errorTitle: { color: colors.text, fontSize: 22, fontWeight: "700", marginBottom: 12 },
  errorText: { color: colors.textMuted, fontSize: 15, textAlign: "center", marginBottom: 24 },
  retryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: radii.pill,
  },
  retryButtonText: { color: colors.bg, fontWeight: "700", fontSize: 16 },
});
