import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

// Link previews need the picture's full address (https://…/share.jpg), so
// %SITE_URL% in index.html becomes SITE_URL, else Vercel's production
// domain. Without either (local builds) the image path stays relative,
// which some apps still accept.
function siteUrl(): Plugin {
  const env = process.env;
  const url = (
    env.SITE_URL ||
    (env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${env.VERCEL_PROJECT_PRODUCTION_URL}` : "")
  ).replace(/\/$/, "");
  return {
    name: "site-url",
    transformIndexHtml: {
      order: "pre",
      handler: (html) =>
        url
          ? html.replaceAll("%SITE_URL%", url)
          : html.replace(/^.*property="og:url".*\n/m, "").replaceAll("%SITE_URL%", ""),
    },
  };
}

export default defineConfig({
  plugins: [react(), siteUrl()],
  // Two pages: the wedding (/) and the hidden hen party (/hen-party), each
  // with its own link-preview tags.
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
