import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "./src/lib/AuthContext";
import { FaceMeshProvider } from "./src/lib/FaceMeshContext";
import { RootNavigator } from "./src/navigation/RootNavigator";

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <FaceMeshProvider>
          <StatusBar style="light" />
          <RootNavigator />
        </FaceMeshProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
