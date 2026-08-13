require("dotenv").config();

module.exports = {
  expo: {
    name: "GlowMax",
    slug: "glowmax",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    scheme: "glowmax",
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.glowmax.app",
      infoPlist: {
        NSCameraUsageDescription:
          "GlowMax behöver kameran för att scanna ditt ansikte och ge dig personliga tips.",
      },
    },
    android: {
      package: "com.glowmax.app",
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
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
            "GlowMax behöver kameran för att scanna ditt ansikte och ge dig personliga tips.",
        },
      ],
    ],
    extra: {
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    },
  },
};
