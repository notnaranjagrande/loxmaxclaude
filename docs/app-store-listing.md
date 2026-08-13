# App Store Connect listing — copy/paste reference

## App Information

- **Name** (30 char max): `GlowMax`
- **Subtitle** (30 char max): `Face Scan & Glow Score`
- **Bundle ID**: `com.glowmax.app`
- **Primary category**: Lifestyle
- **Secondary category** (optional): Photo & Video
- **Content rights**: You own/have rights to all content (no third-party copyrighted content).

## Privacy Policy URL

Use the published policy — pick ONE, whichever is live when you submit:
- Artifact (published now, share it first — see note below): the URL from this session
- Or once you enable GitHub Pages: `https://notnaranjagrande.github.io/loxmaxclaude/privacy.html`
  (source already committed at `docs/privacy.html`; enable via repo Settings → Pages → Deploy from branch → `main` /docs)

**Important**: the Artifact link is private until you click "Share" on it — Apple's reviewer must be able to open it without logging into Claude. Either share the Artifact publicly, or switch to GitHub Pages before submitting.

## Support URL

`https://github.com/notnaranjagrande/loxmaxclaude/issues`
(Apple requires a working support URL. A GitHub Issues page is acceptable; a dedicated page is nicer long-term but not required.)

## Promotional text (170 chars, editable anytime without review)

```
Scan your face, get a fun Glow Score built from real symmetry & proportion math, and personal tips to level up your look. Private, on-device analysis.
```

## Description (4000 char max)

```
GlowMax scans your face and turns it into a Glow Score — a playful, geometry-based read on facial symmetry and proportions, plus a handful of personal tips to help you look and feel your best.

HOW IT WORKS
• Take a selfie with the front camera
• GlowMax analyzes 478 facial landmarks entirely on your device — your photo never leaves your phone for the analysis itself
• Get a score breakdown across symmetry, proportions, jawline, and skin tone
• Receive personalized, constructive tips (hairstyle, grooming, skincare, lighting — never anything harsh)

PRIVATE BY DESIGN
The face-scanning engine runs locally using on-device machine learning. Nothing is sent to a third-party AI service to generate your score. If you choose to save your results, your photo and score are stored securely and privately, tied to an anonymous account — no email or sign-up required.

TRACK YOUR PROGRESS
Save scans to your private history and watch how small changes — a new haircut, a skincare routine, better lighting — shift your score over time.

A NOTE ON WHAT THIS IS
GlowMax is for fun and self-improvement inspiration. It's a geometric analysis, not a scientific or medical measure of attractiveness or self-worth. Take your Glow Score with a smile.

WHAT YOU GET
• Instant, on-device face scan
• Glow Score with a category breakdown
• Personalized, constructive tips
• Private scan history
• No account or email required
```

## Keywords (100 chars, comma-separated, no spaces after commas needed)

```
face scan,glow score,symmetry,facial analysis,beauty tips,skincare,selfie,looksmaxing,face rating
```

## Age rating questionnaire guidance

None of GlowMax's content triggers the usual flags (no violence, sexual content, gambling, alcohol/drugs, horror). Answer "No"/"None" to all standard categories. Expected result: **4+**.

If Apple's reviewer pushes back citing body-image concerns, point them to:
- The in-app disclaimer shown on every results screen ("not a scientific measure of your worth")
- The privacy policy's "Overview" section stating the same
- No comparison-to-others, ranking, or social/sharing features that could enable bullying

## App Privacy ("nutrition label") — Data collection questionnaire

Declare the following in App Store Connect → App Privacy:

| Data type | Collected? | Linked to user? | Used for | Tracking? |
|---|---|---|---|---|
| Photos or Videos | Yes | Yes (anonymous ID) | App Functionality | No |
| User ID | Yes (anonymous, auto-generated) | Yes | App Functionality | No |
| Other data (facial landmark coordinates, scores) | Yes | Yes | App Functionality | No |

Everything else (Contact Info, Financial Info, Location, Contacts, Browsing/Search History, Identifiers like IDFA, Usage Data, Diagnostics) → **Not Collected**.

Confirm "Data Not Linked to You" is **unchecked** where applicable (your data IS linked via the anonymous ID) and "Used for Tracking Purposes" is **No** throughout — GlowMax does not use IDFA, ad networks, or cross-app tracking.

## Screenshots

App Store requires screenshots for at least one 6.7" (or 6.9") iPhone size. Capture these from the simulator once a build is installed:
1. Welcome screen
2. Scan / camera guide screen
3. Results screen with score + tips
4. History screen

(Ask me to generate these once you have a build running in the simulator — I can drive it and capture the exact PNGs Apple wants.)
