import { serve } from "bun";
import { FileSystemRouter } from "bun";
import { renderToReadableStream } from "react-dom/server";
import fs from "fs";
import path from "path";

import React from "react";

const router = new FileSystemRouter({
  style: "nextjs",
  dir: "./src/pages",
  origin: "http://localhost:3000",
});

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

    // Match route
    const match = router.match(req);
    if (!match) return new Response("Not found", { status: 404 });

    const Page = require(match.filePath).default;
    const stream = await renderToReadableStream(
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <title>Bun + Tailwind</title>
          <link rel="stylesheet" href="/global.css" />
        </head>
        <body>
          <Page />
        </body>
      </html>
    );

    return new Response(stream, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  },
});