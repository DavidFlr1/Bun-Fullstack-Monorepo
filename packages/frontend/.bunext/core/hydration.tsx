/**
 * .bunext/core/hydration.tsx
 * Client-side hydration utilities
 * This file is part of the framework infrastructure (like Next.js's .next folder)
 */

import { hydrateRoot } from "react-dom/client";
import React from "react";
import type { RouterContextType } from "./router-context";

/**
 * Wrap a component with multiple layouts (from outermost to innermost)
 */
export function wrapWithLayouts(
  component: React.ReactNode,
  layoutComponents: React.ComponentType<{ children: React.ReactNode }>[]
): React.ReactNode {
  return layoutComponents.reduceRight((children, Layout) => {
    return <Layout>{children}</Layout>;
  }, component);
}

/**
 * Match a dynamic route pattern
 * Supports:
 * - [id] - single segment
 * - [...slug] - one or more segments (catch-all)
 * - [[...slug]] - zero or more segments (optional catch-all)
 */
export function matchDynamicRoute(
  pagePath: string,
  routes: Record<string, React.ComponentType>
): React.ComponentType | null {
  for (const [route, component] of Object.entries(routes)) {
    if (route.includes("[")) {
      let pattern = route;

      // Handle optional catch-all routes [[...param]] - matches zero or more segments
      // The /[[...slug]]/ part should match both "/" and "/a/b/c/"
      pattern = pattern.replace(/\/\[\[\.\.\.([^\]]+)\]\]\//g, "(?:/(.+)/|/)");

      // Handle catch-all routes [...param] - matches one or more segments
      pattern = pattern.replace(/\[\.\.\.([^\]]+)\]/g, "(.+)");

      // Handle regular dynamic routes [param] - matches single segment
      pattern = pattern.replace(/\[([^\]]+)\]/g, "([^/]+)");

      // Now escape special regex characters
      pattern = pattern.replace(/\//g, "\\/");

      const regex = new RegExp(`^${pattern}$`);
      if (regex.test(pagePath)) {
        return component;
      }
    }
  }
  return null;
}

export interface HydrationConfig {
  routes: Record<string, React.ComponentType>;
  layouts: Record<string, React.ComponentType<{ children: React.ReactNode }>>;
  Providers: React.ComponentType<{ children: React.ReactNode; routerData?: RouterContextType }>;
}

/**
 * Hydrate the server-rendered HTML with React
 */
export function hydrate(config: HydrationConfig) {
  const { routes, layouts, Providers } = config;

  // Get the root element
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error("Root element not found");
  }

  // Get the page path from data attribute
  const pagePath = rootElement.getAttribute("data-page");
  if (!pagePath) {
    throw new Error("Page path not found in root element");
  }

  // Get router data from data attribute
  const routerDataStr = rootElement.getAttribute("data-router");
  let routerData: RouterContextType | undefined;
  if (routerDataStr) {
    try {
      routerData = JSON.parse(routerDataStr);
    } catch (error) {
      console.error("Failed to parse router data:", error);
    }
  }

  // Get layout paths from data attribute
  const layoutPathsStr = rootElement.getAttribute("data-layouts");
  let layoutPaths: string[] = [];
  if (layoutPathsStr) {
    try {
      layoutPaths = JSON.parse(layoutPathsStr);
    } catch (error) {
      console.error("Failed to parse layout paths:", error);
    }
  }

  // Find the matching page component
  let Page = routes[pagePath];

  // If not found, try to match dynamic routes
  if (!Page) {
    const matched = matchDynamicRoute(pagePath, routes);
    if (matched) {
      Page = matched;
    }
  }

  if (!Page) {
    console.error(`No component found for route: ${pagePath}`);
    Page = () => <div>Page not found</div>;
  }

  // Load layout components
  const layoutComponents = layoutPaths
    .map((layoutPath) => layouts[layoutPath])
    .filter((layout): layout is React.ComponentType<{ children: React.ReactNode }> => Boolean(layout));

  // Wrap page with layouts
  const pageWithLayouts = wrapWithLayouts(<Page />, layoutComponents);

  // Hydrate the root
  hydrateRoot(rootElement, <Providers routerData={routerData}>{pageWithLayouts}</Providers>);
}
