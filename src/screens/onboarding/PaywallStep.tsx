import React, { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet, ActivityIndicator, Platform, Linking } from "react-native";
import type { PurchasesOffering } from "react-native-purchases";
import { colors, radii } from "../../lib/theme";
import { useTranslation } from "../../lib/i18n";
import { PRIVACY_POLICY_URL } from "../../lib/constants";
import { getCurrentOffering, purchasePackage, restorePurchases } from "../../lib/purchases";
import type { PaywallStepConfig } from "../../lib/onboarding/types";

const APPLE_EULA_URL = "https://www.apple.com/legal/internet-services/itunes/dev/stdeula/";

type DisplayPackage = {
  identifier: string;
  packageType: string;
  product: { priceString: string; title: string };
};

// Only used so the paywall is visually testable outside a real iOS build (web preview, simulator).
const MOCK_PACKAGES: DisplayPackage[] = [
  { identifier: "weekly", packageType: "WEEKLY", product: { priceString: "199,00 kr", title: "Weekly" } },
  { identifier: "annual", packageType: "ANNUAL", product: { priceString: "599,00 kr", title: "Yearly" } },
];

export function PaywallStep({ config, onSuccess }: { config: PaywallStepConfig; onSuccess: () => void }) {
  const { t } = useTranslation();
  const [offering, setOffering] = useState<PurchasesOffering | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (Platform.OS !== "ios") {
        if (mounted) {
          setOffering(null);
          setSelectedId("annual");
          setLoading(false);
        }
        return;
      }
      try {
        const current = await getCurrentOffering();
        if (!mounted) return;
        setOffering(current);
        const preferred = current?.availablePackages.find((p) => p.packageType === "ANNUAL");
        setSelectedId(preferred?.identifier ?? current?.availablePackages[0]?.identifier ?? null);
      } catch (err) {
        if (mounted) setError(t("onboarding.purchaseError"));
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const packages: DisplayPackage[] =
    offering?.availablePackages ?? (Platform.OS !== "ios" ? MOCK_PACKAGES : []);

  async function handleContinue() {
    if (!selectedId) return;
    setBusy(true);
    setError(null);
    try {
      if (Platform.OS === "ios" && offering) {
        const pkg = offering.availablePackages.find((p) => p.identifier === selectedId);
        if (pkg) {
          const active = await purchasePackage(pkg);
          if (active) onSuccess();
          return;
        }
      }
      // Non-iOS / dev preview: skip real purchase, just proceed.
      onSuccess();
    } catch (err: any) {
      if (err?.userCancelled) return;
      setError(t("onboarding.purchaseError"));
    } finally {
      setBusy(false);
    }
  }

  async function handleRestore() {
    setBusy(true);
    setError(null);
    try {
      const active = Platform.OS === "ios" ? await restorePurchases() : true;
      if (active) onSuccess();
    } catch {
      setError(t("onboarding.purchaseError"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.content}>
        <Text style={styles.title}>{config.title}</Text>
        <Text style={styles.subtitle}>{config.subtitle}</Text>

        <View style={styles.features}>
          {config.features.map((f) => (
            <View key={f} style={styles.featureRow}>
              <Text style={styles.featureCheck}>✓</Text>
              <Text style={styles.featureText}>{f}</Text>
            </View>
          ))}
        </View>

        {loading ? (
          <ActivityIndicator color={colors.primary} style={{ marginTop: 24 }} />
        ) : (
          <View style={styles.plans}>
            {packages.map((pkg) => {
              const isAnnual = pkg.packageType === "ANNUAL";
              const isSelected = pkg.identifier === selectedId;
              return (
                <Pressable
                  key={pkg.identifier}
                  onPress={() => setSelectedId(pkg.identifier)}
                  style={[styles.plan, isSelected && styles.planSelected]}
                >
                  {isAnnual && (
                    <View style={styles.bestValueBadge}>
                      <Text style={styles.bestValueText}>{t("onboarding.billedYearly")}</Text>
                    </View>
                  )}
                  <Text style={styles.planTitle}>{pkg.product.title || pkg.packageType}</Text>
                  <Text style={styles.planPrice}>{pkg.product.priceString}</Text>
                  <Text style={styles.planUnit}>
                    {isAnnual ? "" : t("onboarding.perWeek")}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>

      <View style={styles.footer}>
        <Pressable
          style={[styles.continueButton, (busy || !selectedId) && styles.continueButtonDisabled]}
          onPress={handleContinue}
          disabled={busy || !selectedId}
        >
          {busy ? (
            <ActivityIndicator color={colors.bg} />
          ) : (
            <Text style={styles.continueText}>{t("onboarding.subscribe")}</Text>
          )}
        </Pressable>
        <View style={styles.linksRow}>
          <Pressable onPress={handleRestore} disabled={busy}>
            <Text style={styles.linkText}>{t("onboarding.restorePurchases")}</Text>
          </Pressable>
          <Pressable onPress={() => Linking.openURL(APPLE_EULA_URL)}>
            <Text style={styles.linkText}>{t("onboarding.terms")}</Text>
          </Pressable>
          <Pressable onPress={() => Linking.openURL(PRIVACY_POLICY_URL)}>
            <Text style={styles.linkText}>{t("onboarding.privacy")}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, justifyContent: "space-between" },
  content: { paddingHorizontal: 24, paddingTop: 16 },
  title: { color: colors.text, fontSize: 26, fontWeight: "800", marginBottom: 8 },
  subtitle: { color: colors.textMuted, fontSize: 14, lineHeight: 20, marginBottom: 20 },
  features: { gap: 10, marginBottom: 20 },
  featureRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  featureCheck: { color: colors.success, fontSize: 15, fontWeight: "800" },
  featureText: { color: colors.text, fontSize: 14, flex: 1 },
  plans: { flexDirection: "row", gap: 12 },
  plan: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radii.md,
    borderWidth: 2,
    borderColor: colors.border,
    padding: 16,
    alignItems: "center",
  },
  planSelected: { borderColor: colors.primary, backgroundColor: colors.primary + "1A" },
  bestValueBadge: {
    position: "absolute",
    top: -11,
    backgroundColor: colors.primary,
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  bestValueText: { color: colors.bg, fontSize: 10, fontWeight: "800" },
  planTitle: { color: colors.textMuted, fontSize: 12, fontWeight: "700", marginTop: 6, textTransform: "uppercase" },
  planPrice: { color: colors.text, fontSize: 20, fontWeight: "800", marginTop: 8 },
  planUnit: { color: colors.textMuted, fontSize: 11, marginTop: 2 },
  errorText: { color: colors.low, fontSize: 13, textAlign: "center", marginTop: 16 },
  footer: { paddingHorizontal: 24, paddingBottom: 20, paddingTop: 12 },
  continueButton: {
    backgroundColor: colors.primary,
    borderRadius: radii.pill,
    paddingVertical: 16,
    alignItems: "center",
  },
  continueButtonDisabled: { opacity: 0.6 },
  continueText: { color: colors.bg, fontSize: 16, fontWeight: "800" },
  linksRow: { flexDirection: "row", justifyContent: "center", gap: 20, marginTop: 16 },
  linkText: { color: colors.textMuted, fontSize: 12, fontWeight: "600" },
});
