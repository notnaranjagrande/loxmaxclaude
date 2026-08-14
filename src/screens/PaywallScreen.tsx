import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/RootNavigator";
import { colors } from "../lib/theme";
import { useTranslation } from "../lib/i18n";
import { getOnboardingSteps } from "../lib/onboarding/content";
import { useEntitlement } from "../lib/EntitlementContext";
import { PaywallStep } from "./onboarding/PaywallStep";

type Props = NativeStackScreenProps<RootStackParamList, "Paywall">;

export function PaywallScreen({ navigation }: Props) {
  const { locale } = useTranslation();
  const { refresh } = useEntitlement();
  const paywallConfig = getOnboardingSteps(locale).find((s) => s.type === "paywall");
  if (!paywallConfig || paywallConfig.type !== "paywall") return null;

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.closeButton}>
          <Text style={styles.closeText}>✕</Text>
        </Pressable>
      </View>
      <PaywallStep
        config={paywallConfig}
        onSuccess={async () => {
          await refresh();
          navigation.replace("Scan");
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: 16, paddingTop: 8 },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
  },
  closeText: { color: colors.text, fontSize: 16 },
});
