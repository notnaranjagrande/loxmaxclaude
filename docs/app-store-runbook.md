# App Store submission runbook

Everything Claude can prepare (config, icons, splash, privacy policy, listing copy) is done.
The steps below need YOUR Apple ID / Apple Developer / EAS account, so they have to be run by
you in your own terminal — an AI agent should not hold or enter your Apple credentials.

Run these from the `glowmax/` folder.

## 1. Log in to Expo (EAS)

```bash
npx eas login
```

Creates a free Expo account / logs into an existing one (opens a browser or prompts for
username+password in the terminal — this is Expo's own account, separate from Apple).

## 2. Link this project to EAS

```bash
npx eas init
```

This writes a `projectId` into `app.config.js` automatically (via `extra.eas.projectId`) — commit
that change afterward.

## 3. Build the iOS app in the cloud

```bash
npx eas build --platform ios --profile production
```

- First run will ask to log in to your **Apple Developer account** and will offer to
  auto-generate signing certificates & provisioning profiles for `com.glowmax.app` — let it
  manage credentials unless you already have your own.
- Takes ~15-20 minutes. You'll get a link to download the `.ipa` when done.

## 4. Create the app in App Store Connect

Go to [appstoreconnect.apple.com](https://appstoreconnect.apple.com) → **My Apps** → **+** → **New App**:

- Platform: iOS
- Name: `GlowMax` (or add a suffix if taken, e.g. `GlowMax: Face Scan`)
- Primary language: English (U.S.)
- Bundle ID: select `com.glowmax.app` (must already exist under your account — EAS creates it
  during step 3, or create it manually at developer.apple.com → Identifiers first)
- SKU: `glowmax-ios` (anything unique, not shown to users)

## 5. Fill in the listing

Copy everything from [`docs/app-store-listing.md`](./app-store-listing.md) into the relevant
App Store Connect fields (Description, Keywords, Subtitle, Promotional Text, Support URL,
Privacy Policy URL, App Privacy questionnaire).

**Before this step**: make the privacy policy publicly reachable —
either share the Claude Artifact from its share menu, or enable GitHub Pages
(repo → Settings → Pages → Deploy from branch → `main`, folder `/docs`) and use
`https://notnaranjagrande.github.io/loxmaxclaude/privacy.html` instead.

## 6. Add screenshots

Ask me (Claude) to generate them once you have a build running in the simulator — I can drive
the app and capture the exact sizes Apple requires.

## 7. Submit the build to App Store Connect

Either:

```bash
npx eas submit --platform ios --profile production
```

(fill your Apple ID, App Store Connect app ID, and Team ID into `eas.json`'s `submit.production.ios`
first — find the App ID in App Store Connect's app URL, and your Team ID at
developer.apple.com → Membership)

...or manually drag the downloaded `.ipa` into **Transporter** (free Mac App Store app) and hit
Deliver.

## 8. Attach the build & submit for review

In App Store Connect, once the build finishes processing (~15-60 min after upload):
- App page → **Build** → select your uploaded build
- Fill in **Age Rating** questionnaire (see guidance in `app-store-listing.md` — expect 4+)
- Add screenshots
- Click **Save**, then **Add for Review** / **Submit for Review**

This last click is yours to make — review the whole listing once more before submitting.

## Later: TestFlight (recommended before full review)

After step 3/7, the build also becomes available in **TestFlight** automatically. You can
install it on your own iPhone via the TestFlight app before ever submitting for public review —
a good way to catch anything odd on real hardware (real camera, real face!) first.
