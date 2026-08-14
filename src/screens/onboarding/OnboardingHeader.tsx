import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { colors, radii } from "../../lib/theme";
import { useTranslation } from "../../lib/i18n";

type Props = {
  progress: number; // 0-1
  onBack?: () => void;
  onSkip?: () => void;
};

export function OnboardingHeader({ progress, onBack, onSkip }: Props) {
  const { t } = useTranslation();
  return (
    <View style={styles.row}>
      <Pressable onPress={onBack} disabled={!onBack} hitSlop={12} style={styles.backButton}>
        {onBack ? <Text style={styles.backText}>‹</Text> : null}
      </Pressable>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${Math.round(progress * 100)}%` }]} />
      </View>
      <Pressable onPress={onSkip} disabled={!onSkip} hitSlop={12} style={styles.skipButton}>
        {onSkip ? <Text style={styles.skipText}>{t("common.skip")}</Text> : null}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 16, paddingTop: 8 },
  backButton: { width: 32, alignItems: "flex-start" },
  backText: { color: colors.text, fontSize: 26, marginTop: -4 },
  track: {
    flex: 1,
    height: 4,
    borderRadius: radii.pill,
    backgroundColor: colors.border,
    overflow: "hidden",
  },
  fill: { height: 4, borderRadius: radii.pill, backgroundColor: colors.primary },
  skipButton: { width: 44, alignItems: "flex-end" },
  skipText: { color: colors.textMuted, fontSize: 14, fontWeight: "600" },
});
