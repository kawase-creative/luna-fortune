# LUNA — 願いを、月に訊く。

Mobile-first, responsive Japanese fortune-telling website for GitHub Pages. No build step or API key required. Serve the directory with any static HTTP server (for example `python3 -m http.server 4173`).

## Structure
- `index.html`: semantic page, accessible forms, result and newsletter CTA.
- `styles.css`: responsive navy/moonlight/gold design.
- `app.js`: input validation, result rendering, expandable details, demo email interaction.
- `fortune.js`: isolated asynchronous sample provider. The same name, birth date and local calendar date yield the same result. Valid dates and future birth dates are checked by the form.
- `assets/moonlit-sea.webp`: original generated artwork; `assets/favicon.svg`: brand favicon.

## Future AI integration
Replace `generateFortune({name, birthDate})` in `fortune.js` with a request to your own backend, preserving its returned object shape. The backend should call the selected supported OpenAI model. “Luna” is treated as this product's integration name, not an assumed API model identifier. GitHub Pages serves static files only; host the API separately. Never commit API keys or expose them in client-side JavaScript. Add server-side validation, consent, error handling and rate limiting when connecting a live service.

## Readings and email delivery
Fortune generation still uses no OpenAI API. The reading ritual lasts 4.4 seconds, with three messages and reduced-motion support. Navigation, category, moon and mail illustrations are original SVG assets.

The selected Gmail sender is connected through a dedicated Google Apps Script web app. The deployment runs as the owner with `ANYONE_ANONYMOUS` access; site visitors do not log in or authorize Google access. The owner completed initial authorization on 2026-09-14.

`mail-config.js` contains the public Apps Script `/exec` URL. A native POST carries reading inputs to Google; an embedded frame shows Google's server-rendered delivery response. One sample letter per address per day is allowed, with an initial overall cap of 20 per day. A logged-out browser sent a real test letter to the owner's address, and receipt was verified in the inbox. See [Gmail deployment notes](server/GMAIL-SETUP.md).

An alternative Resend/Cloudflare implementation remains in `server/mail-worker.mjs`; it is unused. Its setup and mocked tests are documented in [server/SETUP.md](server/SETUP.md). The alternative Resend backend has not been deployed.

## Artwork
Created with the built-in image generation tool. Prompt: “Use case: stylized-concept. Asset type: background photograph for a refined Japanese lunar fortune website. Create a cinematic moonlit seascape, wide landscape 1536x1024. An enormous glowing detailed warm ivory full moon near the center rising above a tranquil deep navy ocean, golden reflection across gentle waves, distant dark rocky coastline left, tiny stars and wisps of dusty lavender clouds. Elegant dreamy photorealistic atmosphere, dark midnight blue edges allowing cream website text overlay. Horizon around 60 percent height, moon centered slightly right. No text, no lettering, no UI, no people, no watermark.”
