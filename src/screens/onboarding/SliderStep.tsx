import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";
import { colors } from "../../lib/theme";
import type { SliderStepConfig } from "../../lib/onboarding/types";

type Props = {
  config: SliderStepConfig;
  value: number;
  onChange: (value: number) => void;
};

export function SliderStep({ config, value, onChange }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{config.title}</Text>
      <View style={styles.sliderWrap}>
        <Slider
          style={styles.slider}
          value={value}
          onValueChange={onChange}
          minimumValue={0}
          maximumValue={1}
          minimumTrackTintColor={colors.primary}
          maximumTrackTintColor={colors.border}
          thumbTintColor={colors.primary}
        />
        <View style={styles.labelRow}>
          <Text style={styles.label}>{config.minLabel}</Text>
          <Text style={styles.label}>{config.maxLabel}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, paddingHorizontal: 24, paddingTop: 24 },
  title: { color: colors.text, fontSize: 26, fontWeight: "800", marginBottom: 60 },
  sliderWrap: { marginTop: 40 },
  slider: { width: "100%", height: 40 },
  labelRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  label: { color: colors.textMuted, fontSize: 13, fontWeight: "600" },
});
