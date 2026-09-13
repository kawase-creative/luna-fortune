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

## Current demo behavior
No OpenAI API requests, analytics, personal-data storage or transmission. The email form validates format and explicitly reports that registration/delivery is not active; it does not falsely report a successful subscription. Connect a mailing service and privacy policy before enabling real registrations.

## Artwork
Created with the built-in image generation tool. Prompt: “Use case: stylized-concept. Asset type: background photograph for a refined Japanese lunar fortune website. Create a cinematic moonlit seascape, wide landscape 1536x1024. An enormous glowing detailed warm ivory full moon near the center rising above a tranquil deep navy ocean, golden reflection across gentle waves, distant dark rocky coastline left, tiny stars and wisps of dusty lavender clouds. Elegant dreamy photorealistic atmosphere, dark midnight blue edges allowing cream website text overlay. Horizon around 60 percent height, moon centered slightly right. No text, no lettering, no UI, no people, no watermark.”
