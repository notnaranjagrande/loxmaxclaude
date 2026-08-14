import React from "react";
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { colors, radii } from "../../lib/theme";
import type { SingleSelectStepConfig } from "../../lib/onboarding/types";

type Props = {
  config: SingleSelectStepConfig;
  selected: string | undefined;
  onSelect: (label: string) => void;
};

function SignalBars({ level, active }: { level: number; active: boolean }) {
  return (
    <View style={styles.bars}>
      {[0, 1, 2, 3, 4].map((i) => (
        <View
          key={i}
          style={[
            styles.bar,
            { height: 6 + i * 4 },
            i <= level && (active ? styles.barActiveOn : styles.barActiveOff),
          ]}
        />
      ))}
    </View>
  );
}

export function SingleSelectStep({ config, selected, onSelect }: Props) {
  return (
    <ScrollView contentContainerStyle={styles.wrap} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>{config.title}</Text>
      <View style={styles.options}>
        {config.options.map((option, i) => {
          const isSelected = selected === option.label;
          return (
            <Pressable
              key={option.label}
              onPress={() => onSelect(option.label)}
              style={[styles.option, isSelected && styles.optionSelected]}
            >
              <SignalBars level={i} active={isSelected} />
              <View style={styles.optionTextWrap}>
                <Text style={styles.optionLabel}>{option.label}</Text>
                <Text style={styles.optionSub}>{option.sub}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 24 },
  title: { color: colors.text, fontSize: 26, fontWeight: "800", marginBottom: 24 },
  options: { gap: 12 },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    backgroundColor: colors.card,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 16,
    paddingHorizontal: 18,
  },
  optionSelected: { borderColor: colors.primary, backgroundColor: colors.primary + "1A" },
  optionTextWrap: { flex: 1 },
  optionLabel: { color: colors.text, fontSize: 15, fontWeight: "700" },
  optionSub: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  bars: { flexDirection: "row", alignItems: "flex-end", gap: 3, width: 32 },
  bar: { width: 4, borderRadius: 2, backgroundColor: colors.border },
  barActiveOn: { backgroundColor: colors.primary },
  barActiveOff: { backgroundColor: colors.border },
});
