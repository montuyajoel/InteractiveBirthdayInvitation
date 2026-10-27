import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

// Link previews (Facebook, Messenger, Viber, X) need absolute URLs for the
// page and its preview image. Set VITE_SITE_URL (e.g. https://my-event.vercel.app),
// or on Vercel the production domain is picked up automatically.
function siteUrl() {
  const explicit = process.env.VITE_SITE_URL;
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  return (explicit || (vercel ? `https://${vercel}` : "")).replace(/\/+$/, "");
}

const socialPreview = (): Plugin => ({
  name: "social-preview-url",
  transformIndexHtml: (html) => html.replaceAll("%SITE_URL%", siteUrl()),
});

export default defineConfig({
  plugins: [react(), socialPreview()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
