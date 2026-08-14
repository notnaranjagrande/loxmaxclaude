import React from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import { colors, radii } from "../../lib/theme";
import type { ComparisonStepConfig } from "../../lib/onboarding/types";

function Column({
  title,
  items,
  image,
  tone,
}: {
  title: string;
  items: string[];
  image?: number;
  tone: "muted" | "positive";
}) {
  const markColor = tone === "positive" ? colors.success : colors.low;
  const mark = tone === "positive" ? "✓" : "✕";
  return (
    <View style={[styles.column, tone === "positive" && styles.columnPositive]}>
      <Text style={[styles.columnTitle, tone === "positive" && styles.columnTitlePositive]}>
        {title}
      </Text>
      <View style={styles.itemList}>
        {items.map((item) => (
          <View key={item} style={styles.itemRow}>
            <Text style={[styles.mark, { color: markColor }]}>{mark}</Text>
            <Text style={styles.itemText}>{item}</Text>
          </View>
        ))}
      </View>
      <View style={styles.imageWrap}>
        {image ? (
          <Image source={image} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imagePlaceholderEmoji}>{tone === "positive" ? "✨" : "🙂"}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

export function ComparisonStep({ config }: { config: ComparisonStepConfig }) {
  return (
    <ScrollView contentContainerStyle={styles.wrap} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>{config.title}</Text>
      <View style={styles.row}>
        <Column
          title={config.leftTitle}
          items={config.leftItems}
          image={config.leftImage}
          tone="muted"
        />
        <Column
          title={config.rightTitle}
          items={config.rightItems}
          image={config.rightImage}
          tone="positive"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 24 },
  title: { color: colors.text, fontSize: 22, fontWeight: "800", marginBottom: 18 },
  row: { flexDirection: "row", gap: 12 },
  column: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
  },
  columnPositive: { borderColor: colors.primary, backgroundColor: colors.primary + "14" },
  columnTitle: { color: colors.textMuted, fontSize: 14, fontWeight: "700", marginBottom: 12 },
  columnTitlePositive: { color: colors.primary },
  itemList: { gap: 10, marginBottom: 14 },
  itemRow: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  mark: { fontSize: 13, fontWeight: "800", marginTop: 1 },
  itemText: { color: colors.text, fontSize: 12.5, flex: 1, lineHeight: 17 },
  imageWrap: { borderRadius: radii.sm, overflow: "hidden" },
  image: { width: "100%", aspectRatio: 3 / 4, borderRadius: radii.sm },
  imagePlaceholder: {
    width: "100%",
    aspectRatio: 3 / 4,
    borderRadius: radii.sm,
    backgroundColor: colors.bgAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  imagePlaceholderEmoji: { fontSize: 32, opacity: 0.5 },
});
