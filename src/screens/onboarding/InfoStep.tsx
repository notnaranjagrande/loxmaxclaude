import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Path, Defs, LinearGradient as SvgGradient, Stop } from "react-native-svg";
import { colors, radii } from "../../lib/theme";
import { useTranslation } from "../../lib/i18n";
import type { InfoStepConfig } from "../../lib/onboarding/types";

function GrowthChart() {
  const w = 300;
  const h = 160;
  const linePath = `M 8 ${h - 12} C ${w * 0.35} ${h - 20}, ${w * 0.55} ${h * 0.35}, ${w - 8} 14`;
  const fillPath = `${linePath} L ${w - 8} ${h} L 8 ${h} Z`;

  return (
    <View style={styles.chartWrap}>
      <Svg width={w} height={h}>
        <Defs>
          <SvgGradient id="fillGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={colors.primary} stopOpacity={0.35} />
            <Stop offset="1" stopColor={colors.primary} stopOpacity={0} />
          </SvgGradient>
        </Defs>
        <Path d={fillPath} fill="url(#fillGrad)" />
        <Path d={linePath} stroke={colors.primary} strokeWidth={3} fill="none" strokeLinecap="round" />
      </Svg>
    </View>
  );
}

export function InfoStep({ config }: { config: InfoStepConfig }) {
  const { locale } = useTranslation();
  return (
    <View style={styles.wrap}>
      {config.variant === "graph" && (
        <>
          <GrowthChart />
          <View style={styles.chartLabels}>
            <Text style={styles.chartLabel}>{locale === "sv" ? "Nu" : "Now"}</Text>
            <Text style={styles.chartLabel}>
              {locale === "sv" ? "Veckor framåt" : "Weeks from now"}
            </Text>
          </View>
        </>
      )}
      {config.variant === "mission" && <Text style={styles.missionIcon}>💜</Text>}
      {config.eyebrow ? (
        <View style={styles.eyebrowPill}>
          <Text style={styles.eyebrowText}>{config.eyebrow}</Text>
        </View>
      ) : null}
      <Text style={styles.title}>{config.title}</Text>
      <Text style={styles.subtitle}>{config.subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 28 },
  chartWrap: { marginBottom: 4 },
  chartLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 300,
    marginBottom: 28,
    paddingHorizontal: 4,
  },
  chartLabel: { color: colors.textMuted, fontSize: 12, fontWeight: "600" },
  missionIcon: { fontSize: 44, marginBottom: 20 },
  eyebrowPill: {
    backgroundColor: colors.card,
    borderRadius: radii.pill,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  eyebrowText: { color: colors.primary, fontSize: 12, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5 },
  title: {
    color: colors.text,
    fontSize: 26,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 14,
  },
  subtitle: { color: colors.textMuted, fontSize: 15, lineHeight: 21, textAlign: "center" },
});
