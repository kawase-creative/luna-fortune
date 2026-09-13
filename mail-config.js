// Public configuration only. Never put API keys here.
export const mailConfig = {
  appsScriptEndpoint: 'https://script.google.com/macros/s/AKfycbxW3xHg2to_DJvqkrNNe742BrPfjA-20HQSbB9rqYTkaz2c4QnXBpLO8VFsZ6qnh7EL/exec', // Gmail: deployed Apps Script /exec URL; no secret needed here
  endpoint: '', // HTTPS URL of the deployed server/mail-worker.mjs, ending in /letter
  turnstileSiteKey: '', // Public Turnstile widget key
};
