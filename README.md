# GlowMax

Scanna ditt ansikte och få en Glow Score med personliga tips — byggd med Expo (React Native), on-device ansiktsanalys via MediaPipe, och Supabase för konto/historik.

Detta är inte en kopia av någon specifik app — det är en egen implementation i samma genre (ansiktsscanning + estetiska tips), byggd från grunden.

## Hur det funkar

1. **Scan** – ta en selfie med frontkameran (`expo-camera`).
2. **Analys** – bilden körs genom Googles [MediaPipe FaceLandmarker](https://ai.google.dev/edge/mediapipe/solutions/vision/face_landmarker) (478 ansiktspunkter), som körs on-device i en dold WebView. Ingen bild skickas till någon AI-analys-server.
3. **Poängsättning** – en egen TypeScript-motor (`src/lib/scoring.ts`) beräknar symmetri, proportioner, käklinje och hudton från landmärkena och genererar konstruktiva tips.
4. **Historik** – resultat + foto sparas i Supabase (Postgres + Storage) kopplat till en anonym användarsession.

## Kom igång

```bash
npm install
cp .env.example .env   # fyll i din Supabase-URL och anon key
npm run ios            # eller npm run android / npm run web
```

## Supabase-setup

1. Skapa ett projekt på [supabase.com](https://supabase.com).
2. Under **Authentication → Sign In / Providers**, aktivera **Anonymous Sign-Ins**.
3. Kör SQL:en i [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql) i SQL-editorn — den skapar `scans`-tabellen, RLS-policys och en privat storage-bucket för foton.
4. Kopiera **Project URL** och **anon public key** från Project Settings → API till din `.env`.

## Teknikstack

- Expo SDK 57 / React Native / TypeScript
- React Navigation (native stack)
- `expo-camera`, `expo-image-manipulator`
- MediaPipe Tasks Vision (FaceLandmarker) via WebView
- Supabase (Auth, Postgres, Storage)

## Ansvarsfriskrivning

Poängen är en lekfull, geometrisk analys av symmetri och proportioner — inte ett vetenskapligt eller medicinskt mått på utseende eller värde.
