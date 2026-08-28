// The backend's base URL - read from Vite's env at build time (VITE_API_BASE_URL), so it's set
// per-environment via Vercel's dashboard (or a local .env file) instead of being hardcoded and
// committed to the repo. Falls back to the local dev backend when unset, so `npm run dev` keeps
// working out of the box with no setup required.
export const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5100";

// Google OAuth client IDs are inherently public (every client-side app using one embeds it in
// plain sight, by design) - this isn't a secret, just kept out of hardcoded source for the same
// no-copy-pasted-values-in-two-places reason as the API URL above.
export const GOOGLE_CLIENT_ID: string =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  "350212676070-7iflui6iruag475r9hla0hq0amtkqvk4.apps.googleusercontent.com";
