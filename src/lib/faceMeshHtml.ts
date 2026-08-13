// Runs Google's MediaPipe FaceLandmarker fully on-device inside a hidden WebView.
// The WASM runtime + model are fetched from Google's CDN on first use and cached
// by the WebView, so no image data ever leaves the device.
export const FACE_MESH_HTML = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>html,body{margin:0;padding:0;background:transparent;}</style>
</head>
<body>
<canvas id="c" style="display:none"></canvas>
<script type="module">
  import { FilesetResolver, FaceLandmarker } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14";

  const post = (msg) => {
    const s = JSON.stringify(msg);
    if (window.ReactNativeWebView) window.ReactNativeWebView.postMessage(s);
  };

  let landmarker = null;
  let ready = false;

  async function init() {
    try {
      const fileset = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm"
      );
      landmarker = await FaceLandmarker.createFromOptions(fileset, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
          delegate: "GPU",
        },
        outputFaceBlendshapes: false,
        runningMode: "IMAGE",
        numFaces: 1,
      });
      ready = true;
      post({ type: "ready" });
    } catch (err) {
      post({ type: "error", message: "init_failed: " + String(err && err.message ? err.message : err) });
    }
  }

  function sampleSkin(img, landmarks) {
    const canvas = document.getElementById("c");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    // Sample small patches on both cheeks (landmarks 50 / 280 are stable cheek points).
    const points = [landmarks[50], landmarks[280], landmarks[120], landmarks[349]].filter(Boolean);
    const patch = 10;
    let rTotal = 0, gTotal = 0, bTotal = 0, n = 0;
    const samples = [];
    for (const pt of points) {
      const cx = Math.round(pt.x * canvas.width);
      const cy = Math.round(pt.y * canvas.height);
      const x0 = Math.max(0, cx - patch);
      const y0 = Math.max(0, cy - patch);
      const w = Math.min(patch * 2, canvas.width - x0);
      const h = Math.min(patch * 2, canvas.height - y0);
      if (w <= 0 || h <= 0) continue;
      const data = ctx.getImageData(x0, y0, w, h).data;
      for (let i = 0; i < data.length; i += 4) {
        rTotal += data[i]; gTotal += data[i + 1]; bTotal += data[i + 2];
        samples.push((data[i] + data[i + 1] + data[i + 2]) / 3);
        n++;
      }
    }
    if (n === 0) return { evenness: 68, brightness: 68 };
    const meanLum = samples.reduce((a, b) => a + b, 0) / samples.length;
    const variance = samples.reduce((a, b) => a + Math.pow(b - meanLum, 2), 0) / samples.length;
    const stdDev = Math.sqrt(variance);
    const evenness = Math.max(0, Math.min(100, 100 - stdDev * 1.8));
    const brightness = Math.max(0, Math.min(100, (meanLum / 255) * 100));
    return { evenness: Math.round(evenness), brightness: Math.round(brightness) };
  }

  async function analyze(dataUri) {
    if (!ready || !landmarker) {
      post({ type: "error", message: "not_ready" });
      return;
    }
    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = () => reject(new Error("image_load_failed"));
        img.src = dataUri;
      });

      const result = landmarker.detect(img);
      const faces = result && result.faceLandmarks ? result.faceLandmarks : [];
      if (!faces.length) {
        post({ type: "no_face" });
        return;
      }
      const landmarks = faces[0].map((p) => ({ x: p.x, y: p.y, z: p.z }));
      const skin = sampleSkin(img, landmarks);
      post({ type: "result", landmarks, skin });
    } catch (err) {
      post({ type: "error", message: "analyze_failed: " + String(err && err.message ? err.message : err) });
    }
  }

  function handleMessage(event) {
    try {
      const data = JSON.parse(event.data);
      if (data.type === "analyze") analyze(data.image);
    } catch (e) {}
  }
  window.addEventListener("message", handleMessage);
  document.addEventListener("message", handleMessage);

  init();
</script>
</body>
</html>`;
