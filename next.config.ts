import type { NextConfig } from "next";

// Statische Seite (GitHub Pages als Live-Vorschau). BASE_PATH setzt der Workflow auf "/<repo>".
const nextConfig: NextConfig = {
  output: "export",
  basePath: process.env.BASE_PATH ?? "",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
