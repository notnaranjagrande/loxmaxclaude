import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "./src/lib/AuthContext";
import { FaceMeshProvider } from "./src/lib/FaceMeshContext";
import { LocaleProvider } from "./src/lib/i18n";
import { RootNavigator } from "./src/navigation/RootNavigator";

export default function App() {
  return (
    <SafeAreaProvider>
      <LocaleProvider>
        <AuthProvider>
          <FaceMeshProvider>
            <StatusBar style="light" />
            <RootNavigator />
          </FaceMeshProvider>
        </AuthProvider>
      </LocaleProvider>
    </SafeAreaProvider>
  );
}
