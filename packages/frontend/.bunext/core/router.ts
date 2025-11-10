/**
 * .bunext/core/router.ts
 * Core routing utilities for the Bun + React framework
 * This file is part of the framework infrastructure (like Next.js's .next folder)
 */

import { FileSystemRouter } from "bun";

export interface RouteMatch {
  filePath: string;
  params: Record<string, string>;
  pathname: string;
  query: Record<string, string | string[]>;
  search: string;
  route: string;
}

/**
 * Create a file system router instance
 */
export function createRouter(pagesDir: string, origin: string) {
  return new FileSystemRouter({
    style: "nextjs",
    dir: pagesDir,
    origin,
  });
}

/**
 * Match a request to a route, handling trailing slashes automatically
 */
export function matchRoute(router: FileSystemRouter, req: globalThis.Request): RouteMatch | null {
  const url = new URL(req.url);
  const originalPathname = url.pathname;

  // Normalize pathname: ensure it ends with / for matching
  // FileSystemRouter expects paths like "/about/" to match "/about/index.tsx"
  let normalizedPathname = originalPathname;
  if (!normalizedPathname.endsWith("/")) {
    normalizedPathname = normalizedPathname + "/";
  }

  // Create a request with normalized pathname
  const normalizedUrl = new URL(req.url);
  normalizedUrl.pathname = normalizedPathname;
  const normalizedReq = new Request(normalizedUrl, req);

  // Try to match the route with normalized path
  const match = router.match(normalizedReq);

  if (!match) return null;

  // Extract route params
  const params = match.params || {};

  // Extract query params
  const query: Record<string, string | string[]> = {};
  url.searchParams.forEach((value, key) => {
    const existing = query[key];
    if (existing) {
      query[key] = Array.isArray(existing) ? [...existing, value] : [existing, value];
    } else {
      query[key] = value;
    }
  });

  // Calculate route path for client-side hydration
  // Always use the normalized path (with trailing slash) for consistency
  const routePath = normalizedPathname === "/" ? "/index" : normalizedPathname.replace(/\/$/, "/index");

  return {
    filePath: match.filePath,
    params,
    pathname: originalPathname, // Keep original pathname for client
    query,
    search: url.search,
    route: routePath,
  };
}

/**
 * Get router data for client-side hydration
 */
export function getRouterData(match: RouteMatch) {
  return {
    pathname: match.pathname,
    params: match.params,
    query: match.query,
    search: match.search,
    route: match.route,
  };
}
