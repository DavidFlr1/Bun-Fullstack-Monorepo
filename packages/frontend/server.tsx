/**
 * Frontend Server
 * Simplified server using .bunext framework utilities
 */

import { serve } from "bun";
import fs from "fs";
import path from "path";
import { Providers } from "./src/components/Layout";
import { createRouter, matchRoute } from "./.bunext/core/router";
import { renderPage } from "./.bunext/core/render";

const isDev = process.env.NODE_ENV !== "production";
const pagesDir = path.join(import.meta.dir, "src/pages");

// Create the file system router
const router = createRouter("./src/pages", "http://localhost:3000");

serve({
  port: 3000,
  fetch: async (req) => {
    const url = new URL(req.url);

    // Serve static files from ./public
    const publicPath = path.join(import.meta.dir, "public", url.pathname);
    if (fs.existsSync(publicPath) && fs.statSync(publicPath).isFile()) {
      const file = Bun.file(publicPath);
      return new Response(file);
    }

    // Match the route using .bunext framework
    const match = matchRoute(router, req);
    if (!match) return new Response("Not found", { status: 404 });

    // Render the page using .bunext framework
    const stream = await renderPage({
      match,
      pagesDir,
      Providers,
      title: "Bun + React",
      cssPath: "/global.css",
      clientScriptPath: "/.bunext/client-entry.js",
      enableHMR: isDev,
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  },
  development: isDev && {
    hmr: true,
  },
});

console.log(`o Frontend server running on http://localhost:3000`);
