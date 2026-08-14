import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { ScanResult } from "../types/scan";
import { WelcomeScreen } from "../screens/WelcomeScreen";
import { ScanScreen } from "../screens/ScanScreen";
import { AnalyzingScreen } from "../screens/AnalyzingScreen";
import { ResultsScreen } from "../screens/ResultsScreen";
import { HistoryScreen } from "../screens/HistoryScreen";
import { PaywallScreen } from "../screens/PaywallScreen";
import { colors } from "../lib/theme";

export type RootStackParamList = {
  Welcome: undefined;
  Scan: undefined;
  Analyzing: { photoUri: string };
  Results: { scan: ScanResult; isNew: boolean };
  History: undefined;
  Paywall: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <NavigationContainer
      theme={{
        dark: true,
        colors: {
          primary: colors.primary,
          background: colors.bg,
          card: colors.bg,
          text: colors.text,
          border: colors.border,
          notification: colors.accent,
        },
        fonts: {
          regular: { fontFamily: "System", fontWeight: "400" },
          medium: { fontFamily: "System", fontWeight: "500" },
          bold: { fontFamily: "System", fontWeight: "700" },
          heavy: { fontFamily: "System", fontWeight: "800" },
        },
      }}
    >
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bg },
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Scan" component={ScanScreen} />
        <Stack.Screen name="Analyzing" component={AnalyzingScreen} />
        <Stack.Screen name="Results" component={ResultsScreen} />
        <Stack.Screen name="History" component={HistoryScreen} />
        <Stack.Screen
          name="Paywall"
          component={PaywallScreen}
          options={{ presentation: "modal" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
