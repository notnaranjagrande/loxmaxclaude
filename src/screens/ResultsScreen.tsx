import React, { useState } from "react";
import { StyleSheet, Text, View, Image, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/RootNavigator";
import type { CategoryScore } from "../types/scan";
import { colors, radii } from "../lib/theme";
import { useTranslation } from "../lib/i18n";
import { getTier, getTierColor, getTopPercent } from "../lib/scoreTiers";
import { CATEGORY_TIP } from "../lib/scoring";
import { CategoryRing } from "../components/CategoryRing";

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

        <View style={styles.grid}>
          {scan.categories.map((c) => (
            <CategoryCard key={c.category} category={c} />
          ))}
        </View>

        <View style={styles.tipsSection}>
          <Text style={styles.tipsTitle}>{t("results.generalTipsTitle")}</Text>
          <View style={styles.tipCard}>
            <Text style={styles.tipText}>{t("tips.lightingTip")}</Text>
          </View>
          <View style={styles.tipCard}>
            <Text style={styles.tipText}>{t("tips.sleepWaterTip")}</Text>
          </View>
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

function CategoryCard({ category: c }: { category: CategoryScore }) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const tier = getTier(c.score);
  const tierColor = getTierColor(tier);
  const topPercent = getTopPercent(c.score);
  const tipKey = CATEGORY_TIP[c.category];

  return (
    <View style={styles.card}>
      <Text style={styles.cardLabel}>{t(`categories.${c.category}`)}</Text>
      <View style={[styles.tierPill, { backgroundColor: tierColor + "26", borderColor: tierColor }]}>
        <Text style={[styles.tierPillText, { color: tierColor }]}>{t(`tiers.${tier}`)}</Text>
      </View>
      <View style={styles.ringWrap}>
        <CategoryRing score={c.score} color={tierColor} />
      </View>
      <Text style={styles.topPercentText}>
        {t("results.topPercent", { n: topPercent })}
      </Text>
      <Pressable
        style={styles.adviceRow}
        onPress={() => setExpanded((e) => !e)}
        hitSlop={8}
      >
        <Text style={styles.adviceRowText}>
          {expanded ? t("results.hideAdvice") : t("results.showAdvice")}
        </Text>
        <Text style={styles.adviceChevron}>{expanded ? "︿" : "﹀"}</Text>
      </Pressable>
      {expanded && <Text style={styles.adviceText}>{t(`tips.${tipKey}`)}</Text>}
    </View>
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
  grid: {
    marginTop: 36,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  card: {
    width: "48%",
    backgroundColor: colors.card,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    alignItems: "center",
    marginBottom: 12,
  },
  cardLabel: { color: colors.text, fontSize: 14, fontWeight: "700", marginBottom: 8 },
  tierPill: {
    borderWidth: 1,
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginBottom: 10,
  },
  tierPillText: { fontSize: 11, fontWeight: "700" },
  ringWrap: { marginBottom: 8 },
  topPercentText: { color: colors.textMuted, fontSize: 11, marginBottom: 10 },
  adviceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 4,
  },
  adviceRowText: { color: colors.primary, fontSize: 12, fontWeight: "600" },
  adviceChevron: { color: colors.primary, fontSize: 12 },
  adviceText: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 8,
    textAlign: "center",
  },
  tipsSection: { marginTop: 8 },
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
