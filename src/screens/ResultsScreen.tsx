import React from "react";
import { StyleSheet, Text, View, Image, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/RootNavigator";
import { colors, radii } from "../lib/theme";
import { useTranslation } from "../lib/i18n";

type Props = NativeStackScreenProps<RootStackParamList, "Results">;

function scoreColor(score: number) {
  if (score >= 80) return colors.success;
  if (score >= 60) return colors.primary;
  return colors.warning;
}

export function ResultsScreen({ route, navigation }: Props) {
  const { scan } = route.params;
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.navigate("Welcome")} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </Pressable>
          <Text style={styles.headerTitle}>{t("results.title")}</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.photoWrap}>
          <Image source={{ uri: scan.photoUri }} style={styles.photo} />
          <View style={[styles.scoreBadge, { borderColor: scoreColor(scan.overallScore) }]}>
            <Text style={[styles.scoreBadgeText, { color: scoreColor(scan.overallScore) }]}>
              {scan.overallScore}
            </Text>
          </View>
        </View>

        <View style={styles.categories}>
          {scan.categories.map((c) => (
            <View key={c.category} style={styles.categoryRow}>
              <Text style={styles.categoryLabel}>{t(`categories.${c.category}`)}</Text>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    { width: `${c.score}%`, backgroundColor: scoreColor(c.score) },
                  ]}
                />
              </View>
              <Text style={styles.categoryScore}>{c.score}</Text>
            </View>
          ))}
        </View>

        <View style={styles.tipsSection}>
          <Text style={styles.tipsTitle}>{t("results.tipsTitle")}</Text>
          {scan.tips.map((tip, i) => (
            <View key={i} style={styles.tipCard}>
              <Text style={styles.tipText}>{t(`tips.${tip}`)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.actions}>
          <Pressable style={styles.primaryButton} onPress={() => navigation.replace("Scan")}>
            <Text style={styles.primaryButtonText}>{t("results.scanAgain")}</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={() => navigation.navigate("History")}>
            <Text style={styles.secondaryButtonText}>{t("results.viewHistory")}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 32 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonText: { color: colors.text, fontSize: 16 },
  headerTitle: { color: colors.text, fontSize: 16, fontWeight: "700" },
  photoWrap: { alignItems: "center", marginVertical: 20 },
  photo: {
    width: 200,
    height: 260,
    borderRadius: radii.lg,
    backgroundColor: colors.card,
  },
  scoreBadge: {
    position: "absolute",
    bottom: -20,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.bg,
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  scoreBadgeText: { fontSize: 22, fontWeight: "800" },
  categories: {
    marginTop: 36,
    backgroundColor: colors.card,
    borderRadius: radii.md,
    padding: 18,
    gap: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  categoryLabel: { color: colors.text, width: 96, fontSize: 13, fontWeight: "600" },
  barTrack: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.bgAlt,
    overflow: "hidden",
  },
  barFill: { height: 8, borderRadius: 4 },
  categoryScore: { color: colors.textMuted, width: 28, textAlign: "right", fontSize: 13 },
  tipsSection: { marginTop: 24 },
  tipsTitle: { color: colors.text, fontSize: 18, fontWeight: "700", marginBottom: 12 },
  tipCard: {
    backgroundColor: colors.card,
    borderRadius: radii.md,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tipText: { color: colors.text, fontSize: 14, lineHeight: 20 },
  actions: { marginTop: 16, gap: 12 },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: radii.pill,
    alignItems: "center",
  },
  primaryButtonText: { color: colors.bg, fontSize: 16, fontWeight: "700" },
  secondaryButton: {
    paddingVertical: 16,
    borderRadius: radii.pill,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryButtonText: { color: colors.text, fontSize: 15, fontWeight: "600" },
});
