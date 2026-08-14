import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors, radii } from "../../lib/theme";
import type { IntroStepConfig } from "../../lib/onboarding/types";

export function IntroStep({ config }: { config: IntroStepConfig }) {
  return (
    <View style={styles.wrap}>
      <LinearGradient
        colors={[colors.primaryDark, colors.accent]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.badge}
      >
        <Text style={styles.emoji}>{config.emoji}</Text>
      </LinearGradient>
      <Text style={styles.title}>{config.title}</Text>
      <Text style={styles.subtitle}>{config.subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 24 },
  badge: {
    width: 120,
    height: 120,
    borderRadius: radii.lg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
  },
  emoji: { fontSize: 54 },
  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 14,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 16,
    lineHeight: 22,
    textAlign: "center",
  },
});
