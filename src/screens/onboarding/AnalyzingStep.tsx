import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { colors } from "../../lib/theme";
import type { AnalyzingStepConfig } from "../../lib/onboarding/types";

export function AnalyzingStep({
  config,
  onDone,
}: {
  config: AnalyzingStepConfig;
  onDone: () => void;
}) {
  const [doneCount, setDoneCount] = useState(0);

  useEffect(() => {
    if (doneCount >= config.items.length) {
      const t = setTimeout(onDone, 500);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setDoneCount((c) => c + 1), 700);
    return () => clearTimeout(t);
  }, [doneCount]);

  return (
    <View style={styles.wrap}>
      <ActivityIndicator size="large" color={colors.primary} style={{ marginBottom: 32 }} />
      <View style={styles.items}>
        {config.items.map((item, i) => {
          const isDone = i < doneCount;
          return (
            <View key={item} style={styles.itemRow}>
              <View style={[styles.check, isDone && styles.checkDone]}>
                {isDone ? <Text style={styles.checkmark}>✓</Text> : null}
              </View>
              <Text style={[styles.itemText, isDone && styles.itemTextDone]}>{item}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32 },
  items: { gap: 18, width: "100%", maxWidth: 320 },
  itemRow: { flexDirection: "row", alignItems: "center", gap: 14 },
  check: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  checkDone: { backgroundColor: colors.success, borderColor: colors.success },
  checkmark: { color: colors.bg, fontSize: 14, fontWeight: "800" },
  itemText: { color: colors.textMuted, fontSize: 15, fontWeight: "600", flex: 1 },
  itemTextDone: { color: colors.text },
});
