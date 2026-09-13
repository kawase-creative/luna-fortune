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

Email delivery code is implemented in `server/mail-worker.mjs` using Resend, with a personalized sample monthly letter in `server/monthly-letter.mjs`. **It is not deployed or enabled:** no sender or sending service has been configured. `mail-config.js` is intentionally empty, and the public page states that delivery is being prepared. No address is transmitted in this state.

Follow [server/SETUP.md](server/SETUP.md) to configure the sender and deploy the endpoint. This sends one requested letter only, not a recurring subscription. Tests mock provider calls and do not send real email. Run `node --test server/mail-worker.test.mjs` to check validation and provider-response handling.

## Artwork
Created with the built-in image generation tool. Prompt: “Use case: stylized-concept. Asset type: background photograph for a refined Japanese lunar fortune website. Create a cinematic moonlit seascape, wide landscape 1536x1024. An enormous glowing detailed warm ivory full moon near the center rising above a tranquil deep navy ocean, golden reflection across gentle waves, distant dark rocky coastline left, tiny stars and wisps of dusty lavender clouds. Elegant dreamy photorealistic atmosphere, dark midnight blue edges allowing cream website text overlay. Horizon around 60 percent height, moon centered slightly right. No text, no lettering, no UI, no people, no watermark.”
