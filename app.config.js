require("dotenv").config();

module.exports = {
  expo: {
    name: "GlowMax",
    slug: "petersdev",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    scheme: "glowmax",
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.petersdev.loxmax.pro",
      buildNumber: "6",
      infoPlist: {
        NSCameraUsageDescription:
          "GlowMax uses your camera to scan your face and give you personalized tips. Photos are analyzed on your device.",
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      package: "com.petersdev.loxmax.pro",
      versionCode: 1,
      adaptiveIcon: {
        backgroundColor: "#7C5CFF",
        foregroundImage: "./assets/android-icon-foreground.png",
        backgroundImage: "./assets/android-icon-background.png",
        monochromeImage: "./assets/android-icon-monochrome.png",
      },
      predictiveBackGestureEnabled: false,
      permissions: ["CAMERA"],
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    plugins: [
      [
        "expo-camera",
        {
          cameraPermission:
            "GlowMax uses your camera to scan your face and give you personalized tips. Photos are analyzed on your device.",
        },
      ],
      [
        "expo-splash-screen",
        {
          image: "./assets/splash-icon.png",
          imageWidth: 180,
          resizeMode: "contain",
          backgroundColor: "#0F0B1A",
        },
      ],
    ],
    extra: {
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
      eas: {
        projectId: "ee125e2c-d0ec-4291-861d-538bbdf31838",
      },
    },
  },
};
