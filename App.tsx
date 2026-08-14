import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthProvider } from "./src/lib/AuthContext";
import { FaceMeshProvider } from "./src/lib/FaceMeshContext";
import { LocaleProvider } from "./src/lib/i18n";
import { EntitlementProvider } from "./src/lib/EntitlementContext";
import { RootNavigator } from "./src/navigation/RootNavigator";
import { OnboardingScreen } from "./src/screens/OnboardingScreen";
import { colors } from "./src/lib/theme";
import { View } from "react-native";

const ONBOARDED_KEY = "glowmax_onboarded";

function AppGate() {
  const [ready, setReady] = useState(false);
  const [onboarded, setOnboarded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(ONBOARDED_KEY).then((v) => {
      setOnboarded(v === "true");
      setReady(true);
    });
  }, []);

  if (!ready) {
    return <View style={{ flex: 1, backgroundColor: colors.bg }} />;
  }

  if (!onboarded) {
    return (
      <OnboardingScreen
        onComplete={async () => {
          await AsyncStorage.setItem(ONBOARDED_KEY, "true");
          setOnboarded(true);
        }}
      />
    );
  }

  return <RootNavigator />;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <LocaleProvider>
        <EntitlementProvider>
          <AuthProvider>
            <FaceMeshProvider>
              <StatusBar style="light" />
              <AppGate />
            </FaceMeshProvider>
          </AuthProvider>
        </EntitlementProvider>
      </LocaleProvider>
    </SafeAreaProvider>
  );
}
