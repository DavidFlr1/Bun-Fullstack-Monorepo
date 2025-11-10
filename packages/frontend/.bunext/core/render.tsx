/**
 * .bunext/core/render.tsx
 * Server-side rendering utilities
 * This file is part of the framework infrastructure (like Next.js's .next folder)
 */

import { renderToReadableStream } from "react-dom/server";
import React from "react";
import type { RouteMatch } from "./router";
import { findLayouts, getLayoutPaths, wrapWithLayouts } from "./layouts";

export interface RenderOptions {
  match: RouteMatch;
  pagesDir: string;
  Providers: React.ComponentType<{ children: React.ReactNode; routerData?: any }>;
  title?: string;
  cssPath?: string;
  clientScriptPath?: string;
  enableHMR?: boolean;
}

/**
 * Render a page with layouts and providers to a readable stream
 */
export async function renderPage(options: RenderOptions) {
  const {
    match,
    pagesDir,
    Providers,
    title = "Bun + React",
    cssPath = "/global.css",
    clientScriptPath = "/.bunext/client.js",
    enableHMR = false,
  } = options;

  // Load the page component
  const Page = require(match.filePath).default;

  // Find all layouts in the path hierarchy
  const layouts = findLayouts(match.filePath, pagesDir);

  // Get layout paths for client-side hydration
  const layoutPaths = getLayoutPaths(match.filePath, pagesDir);

  // Wrap the page with layouts (innermost to outermost)
  const pageWithLayouts = wrapWithLayouts(<Page />, layouts);

  // Prepare router data for client (without navigation methods)
  const routerData = {
    pathname: match.pathname,
    params: match.params,
    query: match.query,
    search: match.search,
    route: match.route,
  };

  // HMR script for development
  const hmrScript = `
      (function() {
        const ws = new WebSocket('ws://localhost:3001/hmr');
        ws.onmessage = (event) => {
          if (event.data === 'reload') {
            console.log('> HMR: Reloading...');
            window.location.reload();
          }
        };
        ws.onopen = () => console.log('> HMR: Connected');
        ws.onclose = () => console.log('> HMR: Disconnected');
        ws.onerror = () => console.log('> HMR: Connection error');
      })();
  `;

  const stream = await renderToReadableStream(
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>{title}</title>
        <link rel="stylesheet" href={cssPath} />
        <link rel="icon" href="/favicon.ico" />
        {enableHMR && <script dangerouslySetInnerHTML={{ __html: hmrScript }} />}
      </head>
      <body>
        <div
          id="root"
          data-page={match.route}
          data-router={JSON.stringify(routerData)}
          data-layouts={JSON.stringify(layoutPaths)}
        >
          <Providers routerData={routerData}>{pageWithLayouts}</Providers>
        </div>
        <script type="module" src={clientScriptPath}></script>
      </body>
    </html>
  );

  return stream;
}
