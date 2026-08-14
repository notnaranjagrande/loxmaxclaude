import React from "react";
import { StyleSheet, Text, View, Pressable, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/RootNavigator";
import { colors, radii } from "../lib/theme";
import { useTranslation } from "../lib/i18n";
import { PRIVACY_POLICY_URL } from "../lib/constants";
import { useEntitlement } from "../lib/EntitlementContext";

type Props = NativeStackScreenProps<RootStackParamList, "Welcome">;

export function WelcomeScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const { isSubscribed } = useEntitlement();

  function handleStartScan() {
    navigation.navigate(isSubscribed ? "Scan" : "Paywall");
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={[colors.bg, colors.bgAlt]} style={StyleSheet.absoluteFill} />

      <View style={styles.hero}>
        <LinearGradient
          colors={[colors.primaryDark, colors.accent]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.badge}
        >
          <Text style={styles.badgeEmoji}>✨</Text>
        </LinearGradient>
        <Text style={styles.title}>{t("welcome.title")}</Text>
        <Text style={styles.subtitle}>{t("welcome.subtitle")}</Text>
      </View>

      <View style={styles.features}>
        <Feature emoji="📐" text={t("welcome.feature1")} />
        <Feature emoji="🧴" text={t("welcome.feature2")} />
        <Feature emoji="📈" text={t("welcome.feature3")} />
      </View>

      <View style={styles.actions}>
        <Pressable style={styles.primaryButton} onPress={handleStartScan}>
          <Text style={styles.primaryButtonText}>{t("welcome.startScan")}</Text>
        </Pressable>
        <Pressable style={styles.secondaryButton} onPress={() => navigation.navigate("History")}>
          <Text style={styles.secondaryButtonText}>{t("welcome.viewHistory")}</Text>
        </Pressable>
        <Text style={styles.disclaimer}>{t("welcome.disclaimer")}</Text>
        <Pressable onPress={() => Linking.openURL(PRIVACY_POLICY_URL)}>
          <Text style={styles.privacyLink}>{t("welcome.privacyLink")}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function Feature({ emoji, text }: { emoji: string; text: string }) {
  return (
    <View style={styles.featureRow}>
      <Text style={styles.featureEmoji}>{emoji}</Text>
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "space-between",
    backgroundColor: colors.bg,
  },
  hero: { alignItems: "center", marginTop: 48 },
  badge: {
    width: 88,
    height: 88,
    borderRadius: radii.lg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  badgeEmoji: { fontSize: 40 },
  title: { fontSize: 34, fontWeight: "800", color: colors.text, marginBottom: 10 },
  subtitle: {
    fontSize: 16,
    color: colors.textMuted,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 8,
  },
  features: { gap: 16, marginVertical: 24 },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: radii.md,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  featureEmoji: { fontSize: 22 },
  featureText: { color: colors.text, fontSize: 15, flex: 1 },
  actions: { marginBottom: 24, gap: 12 },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: radii.pill,
    alignItems: "center",
  },
  primaryButtonText: { color: colors.bg, fontSize: 17, fontWeight: "700" },
  secondaryButton: {
    paddingVertical: 16,
    borderRadius: radii.pill,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryButtonText: { color: colors.text, fontSize: 16, fontWeight: "600" },
  disclaimer: {
    color: colors.textMuted,
    fontSize: 12,
    textAlign: "center",
    marginTop: 4,
    paddingHorizontal: 12,
  },
  privacyLink: {
    color: colors.primary,
    fontSize: 12,
    textAlign: "center",
    marginTop: 10,
    textDecorationLine: "underline",
  },
});
