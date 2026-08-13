import React, { useRef, useState } from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/RootNavigator";
import { colors, radii } from "../lib/theme";
import { useTranslation } from "../lib/i18n";

type Props = NativeStackScreenProps<RootStackParamList, "Scan">;

export function ScanScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [capturing, setCapturing] = useState(false);

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]}>
        <Text style={styles.permissionTitle}>{t("scan.permissionTitle")}</Text>
        <Text style={styles.permissionText}>{t("scan.permissionText")}</Text>
        <Pressable style={styles.primaryButton} onPress={requestPermission}>
          <Text style={styles.primaryButtonText}>{t("scan.grantAccess")}</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  async function handleCapture() {
    if (!cameraRef.current || capturing) return;
    setCapturing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.9 });
      if (!photo?.uri) throw new Error(t("analyzing.errors.captureFailed"));

      const manipulated = await ImageManipulator.manipulateAsync(
        photo.uri,
        [{ resize: { width: 720 } }],
        { compress: 0.85, format: ImageManipulator.SaveFormat.JPEG }
      );

      navigation.replace("Analyzing", { photoUri: manipulated.uri });
    } catch (err) {
      console.warn(err);
    } finally {
      setCapturing(false);
    }
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing="front" />

      <SafeAreaView style={styles.overlay}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>✕</Text>
          </Pressable>
          <Text style={styles.headerTitle}>{t("scan.positionFace")}</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.guideWrap}>
          <View style={styles.faceGuide} />
          <Text style={styles.guideHint}>{t("scan.guideHint")}</Text>
        </View>

        <View style={styles.footer}>
          <Pressable
            style={[styles.shutter, capturing && styles.shutterDisabled]}
            onPress={handleCapture}
            disabled={capturing}
          >
            <View style={styles.shutterInner} />
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  centerContent: { justifyContent: "center", paddingHorizontal: 32 },
  overlay: { flex: 1, justifyContent: "space-between" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonText: { color: "#fff", fontSize: 18 },
  headerTitle: { color: "#fff", fontSize: 15, fontWeight: "600" },
  guideWrap: { alignItems: "center", justifyContent: "center", flex: 1 },
  faceGuide: {
    width: 260,
    height: 340,
    borderRadius: 160,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.85)",
    borderStyle: "dashed",
  },
  guideHint: { color: "#fff", marginTop: 16, fontSize: 13, opacity: 0.85 },
  footer: { alignItems: "center", paddingBottom: 36 },
  shutter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  shutterDisabled: { opacity: 0.5 },
  shutterInner: { width: 64, height: 64, borderRadius: 32, backgroundColor: "#fff" },
  permissionTitle: { color: colors.text, fontSize: 22, fontWeight: "700", marginBottom: 12 },
  permissionText: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 21,
    textAlign: "center",
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: radii.pill,
  },
  primaryButtonText: { color: colors.bg, fontWeight: "700", fontSize: 16 },
});
