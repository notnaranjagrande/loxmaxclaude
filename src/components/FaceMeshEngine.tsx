import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import WebView from "react-native-webview";
import { FACE_MESH_HTML } from "../lib/faceMeshHtml";
import type { Landmark } from "../types/scan";
import type { SkinMetrics } from "../lib/scoring";

export type FaceMeshResult = { landmarks: Landmark[]; skin: SkinMetrics };

export type FaceMeshEngineHandle = {
  analyze: (base64JpegDataUri: string) => Promise<FaceMeshResult>;
  isReady: () => boolean;
};

type PendingResolver = {
  resolve: (r: FaceMeshResult) => void;
  reject: (e: Error) => void;
};

export const FaceMeshEngine = forwardRef<FaceMeshEngineHandle>((_props, ref) => {
  const webviewRef = useRef<WebView>(null);
  const readyRef = useRef(false);
  const pendingRef = useRef<PendingResolver | null>(null);
  const [, forceRender] = useState(0);

  useImperativeHandle(ref, () => ({
    isReady: () => readyRef.current,
    analyze: (base64JpegDataUri: string) =>
      new Promise<FaceMeshResult>((resolve, reject) => {
        if (!readyRef.current) {
          reject(new Error("Ansiktsmotorn är inte redo än, försök igen om en stund."));
          return;
        }
        pendingRef.current = { resolve, reject };
        webviewRef.current?.postMessage(
          JSON.stringify({ type: "analyze", image: base64JpegDataUri })
        );
        setTimeout(() => {
          if (pendingRef.current) {
            pendingRef.current.reject(new Error("Analysen tog för lång tid."));
            pendingRef.current = null;
          }
        }, 15000);
      }),
  }));

  const handleMessage = (event: { nativeEvent: { data: string } }) => {
    let data: any;
    try {
      data = JSON.parse(event.nativeEvent.data);
    } catch {
      return;
    }

    if (data.type === "ready") {
      readyRef.current = true;
      forceRender((n) => n + 1);
      return;
    }

    const pending = pendingRef.current;
    if (!pending) return;

    if (data.type === "result") {
      pending.resolve({ landmarks: data.landmarks, skin: data.skin });
      pendingRef.current = null;
    } else if (data.type === "no_face") {
      pending.reject(new Error("Kunde inte hitta något ansikte i bilden. Försök igen med bättre belysning."));
      pendingRef.current = null;
    } else if (data.type === "error") {
      pending.reject(new Error(data.message || "Okänt fel i ansiktsanalysen."));
      pendingRef.current = null;
    }
  };

  return (
    <View style={styles.clip} pointerEvents="none">
      <WebView
        ref={webviewRef}
        source={{ html: FACE_MESH_HTML }}
        style={styles.webview}
        onMessage={handleMessage}
        javaScriptEnabled
        domStorageEnabled
        originWhitelist={["*"]}
        mediaPlaybackRequiresUserAction={false}
      />
    </View>
  );
});

FaceMeshEngine.displayName = "FaceMeshEngine";

const styles = StyleSheet.create({
  clip: {
    position: "absolute",
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    overflow: "hidden",
  },
  webview: {
    width: 300,
    height: 300,
  },
});
