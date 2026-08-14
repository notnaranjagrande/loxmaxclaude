import React from "react";
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { colors, radii } from "../../lib/theme";
import type { MultiSelectStepConfig } from "../../lib/onboarding/types";

type Props = {
  config: MultiSelectStepConfig;
  selected: string[];
  onToggle: (option: string) => void;
};

export function MultiSelectStep({ config, selected, onToggle }: Props) {
  return (
    <ScrollView contentContainerStyle={styles.wrap} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>{config.title}</Text>
      {config.subtitle ? <Text style={styles.subtitle}>{config.subtitle}</Text> : null}
      <View style={styles.options}>
        {config.options.map((option) => {
          const isSelected = selected.includes(option);
          return (
            <Pressable
              key={option}
              onPress={() => onToggle(option)}
              style={[styles.option, isSelected && styles.optionSelected]}
            >
              <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                {option}
              </Text>
              <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                {isSelected ? <Text style={styles.checkmark}>✓</Text> : null}
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
  title: { color: colors.text, fontSize: 26, fontWeight: "800", marginBottom: 8 },
  subtitle: { color: colors.textMuted, fontSize: 14, marginBottom: 24 },
  options: { gap: 12 },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.card,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 16,
    paddingHorizontal: 18,
  },
  optionSelected: { borderColor: colors.primary, backgroundColor: colors.primary + "1A" },
  optionText: { color: colors.text, fontSize: 15, fontWeight: "600", flex: 1, paddingRight: 12 },
  optionTextSelected: { color: colors.text },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  checkmark: { color: colors.bg, fontSize: 13, fontWeight: "800" },
});
