import React, { useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { colors, radii } from "../lib/theme";
import { useTranslation } from "../lib/i18n";
import { getOnboardingSteps } from "../lib/onboarding/content";
import type { OnboardingAnswers } from "../lib/onboarding/types";
import { OnboardingHeader } from "./onboarding/OnboardingHeader";
import { IntroStep } from "./onboarding/IntroStep";
import { MultiSelectStep } from "./onboarding/MultiSelectStep";
import { SingleSelectStep } from "./onboarding/SingleSelectStep";
import { SliderStep } from "./onboarding/SliderStep";
import { InfoStep } from "./onboarding/InfoStep";
import { AnalyzingStep } from "./onboarding/AnalyzingStep";
import { PaywallStep } from "./onboarding/PaywallStep";

export function OnboardingScreen({ onComplete }: { onComplete: () => void }) {
  const { locale, t } = useTranslation();
  const steps = useMemo(() => getOnboardingSteps(locale), [locale]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<OnboardingAnswers>({});

  const step = steps[index];
  const progress = (index + 1) / steps.length;

  function goNext() {
    if (index < steps.length - 1) setIndex((i) => i + 1);
  }
  function goBack() {
    if (index > 0) setIndex((i) => i - 1);
  }

  function setAnswer(value: OnboardingAnswers[string]) {
    setAnswers((prev) => ({ ...prev, [step.key]: value }));
  }

  const showsOwnFooter = step.type === "analyzing" || step.type === "paywall";
  const isSkippable = step.type === "multiSelect" || step.type === "singleSelect" || step.type === "slider";

  let canContinue = true;
  if (step.type === "singleSelect") canContinue = typeof answers[step.key] === "string";

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <OnboardingHeader
        progress={progress}
        onBack={index > 0 ? goBack : undefined}
        onSkip={isSkippable ? goNext : undefined}
      />

      <View style={styles.body}>
        {step.type === "intro" && <IntroStep config={step} />}

        {step.type === "multiSelect" && (
          <MultiSelectStep
            config={step}
            selected={(answers[step.key] as string[]) ?? []}
            onToggle={(option) => {
              const current = (answers[step.key] as string[]) ?? [];
              const next = current.includes(option)
                ? current.filter((o) => o !== option)
                : [...current, option];
              setAnswer(next);
            }}
          />
        )}

        {step.type === "singleSelect" && (
          <SingleSelectStep
            config={step}
            selected={answers[step.key] as string | undefined}
            onSelect={(label) => setAnswer(label)}
          />
        )}

        {step.type === "slider" && (
          <SliderStep
            config={step}
            value={typeof answers[step.key] === "number" ? (answers[step.key] as number) : 0.5}
            onChange={(v) => setAnswer(v)}
          />
        )}

        {step.type === "info" && <InfoStep config={step} />}

        {step.type === "analyzing" && <AnalyzingStep config={step} onDone={goNext} />}

        {step.type === "paywall" && <PaywallStep config={step} onSuccess={onComplete} />}
      </View>

      {!showsOwnFooter && (
        <View style={styles.footer}>
          <Pressable
            style={[styles.continueButton, !canContinue && styles.continueButtonDisabled]}
            onPress={goNext}
            disabled={!canContinue}
          >
            <Text style={styles.continueText}>{t("common.continueLabel")}</Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  body: { flex: 1 },
  footer: { paddingHorizontal: 24, paddingBottom: 16, paddingTop: 12 },
  continueButton: {
    backgroundColor: colors.primary,
    borderRadius: radii.pill,
    paddingVertical: 16,
    alignItems: "center",
  },
  continueButtonDisabled: { opacity: 0.4 },
  continueText: { color: colors.bg, fontSize: 16, fontWeight: "800" },
});
