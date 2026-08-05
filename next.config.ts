import type { NextConfig } from "next";

/*
  Static export, because the site is published on GitHub Pages.

  Pages serves files; it does not run a server. That constraint is the reason
  the enquiry form posts to a hosted endpoint rather than to a route handler —
  see StartHere.tsx and server/assessment-route.ts.

  `trailingSlash` matters here: Pages resolves /about to /about/index.html, and
  without it every route past the homepage 404s.
*/
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
