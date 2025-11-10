/**
 * Build script for the frontend client bundle
 * This bundles .bunext/client-entry.tsx for browser execution
 * Output goes to public/.bunext/ (like Next.js's .next folder)
 *
 * This script automatically:
 * 1. Generates routes from src/pages/
 * 2. Bundles client code
 * 3. Watches for changes in watch mode
 * 4. Notifies browser to reload via WebSocket
 */

import path from "path";
import fs from "fs";
import { $ } from "bun";
import { watch } from "fs";

const __dirname = import.meta.dir;
const isWatch = process.argv.includes("--watch");

// WebSocket server for live reload
let wsClients: Set<any> = new Set();

if (isWatch) {
  Bun.serve({
    port: 3001,
    fetch(req, server) {
      const url = new URL(req.url);
      if (url.pathname === "/hmr") {
        const upgraded = server.upgrade(req);
        if (!upgraded) {
          return new Response("WebSocket upgrade failed", { status: 400 });
        }
        return undefined;
      }
      return new Response("HMR WebSocket Server", { status: 200 });
    },
    websocket: {
      open(ws) {
        wsClients.add(ws);
        console.log("> Hot refresh - connected to HMR");
      },
      close(ws) {
        wsClients.delete(ws);
        console.log("> Disconnected from HMR");
      },
      message() {},
    },
  });
  console.log("o HMR WebSocket server running on ws://localhost:3001/hmr");
}

function notifyClients() {
  wsClients.forEach((client) => {
    try {
      client.send("reload");
    } catch (e) {
      wsClients.delete(client);
    }
  });
}

// Ensure public/.bunext directory exists
const bunextPublicDir = path.join(__dirname, "../public", ".bunext");
if (!fs.existsSync(bunextPublicDir)) {
  fs.mkdirSync(bunextPublicDir, { recursive: true });
}

async function build() {
  // Step 1: Generate routes
  console.log("+ Generating routes from src/pages/...");
  await $`bun ${path.join(__dirname, "generate-routes.ts")}`.quiet();

  // Step 2: Build client bundle
  console.log("+ Building client bundle...");

  const result = await Bun.build({
    entrypoints: [path.join(__dirname, "client-entry.tsx")],
    outdir: bunextPublicDir,
    naming: "[dir]/[name].[ext]",
    minify: false,
    sourcemap: "external",
    splitting: true,
    target: "browser",
    define: {
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "development"),
    },
  });

  if (!result.success) {
    console.error("❌ Build failed");
    for (const message of result.logs) {
      console.error(message);
    }
    if (!isWatch) {
      process.exit(1);
    }
    return false;
  }

  console.log("+ Client bundle built successfully");
  console.log(`+ Output: public/.bunext/client-entry.js`);

  // Notify connected browsers to reload
  if (isWatch) {
    notifyClients();
  }

  return true;
}

// Initial build
await build();

// Watch mode
if (isWatch) {
  console.log("> Watching for changes...\n");

  const srcPagesDir = path.join(__dirname, "../src/pages");
  const bunextCoreDir = path.join(__dirname, "core");
  const clientEntryPath = path.join(__dirname, "client-entry.tsx");

  let debounceTimer: Timer | null = null;

  const rebuild = () => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    debounceTimer = setTimeout(async () => {
      console.log("\n- Changes detected, rebuilding...");
      await build();
    }, 100);
  };

  // Watch src/pages for new routes
  watch(srcPagesDir, { recursive: true }, rebuild);

  // Watch .bunext/core for framework changes
  watch(bunextCoreDir, { recursive: true }, rebuild);

  // Watch client-entry.tsx
  watch(clientEntryPath, rebuild);

  // Keep the process alive
  process.on("SIGINT", () => {
    console.log("\n👋 Stopping watch mode...");
    process.exit(0);
  });
}
