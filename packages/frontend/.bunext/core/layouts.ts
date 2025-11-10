/**
 * .bunext/core/layouts.ts
 * Layout discovery and rendering utilities
 * This file is part of the framework infrastructure (like Next.js's .next folder)
 */

import fs from "fs";
import path from "path";
import React from "react";

/**
 * Find all layout files in the path hierarchy
 * For example, for path "/dashboard/settings/index.tsx", it will look for:
 * - src/pages/layout.tsx (root layout)
 * - src/pages/dashboard/layout.tsx
 * - src/pages/dashboard/settings/layout.tsx
 */
export function findLayouts(
  filePath: string,
  pagesDir: string
): React.ComponentType<{ children: React.ReactNode }>[] {
  const layouts: React.ComponentType<{ children: React.ReactNode }>[] = [];

  // Get the directory of the page file
  const pageDir = path.dirname(filePath);

  // Get all parent directories from pages root to the page directory
  const relativePath = path.relative(pagesDir, pageDir);
  const segments = relativePath === "." ? [] : relativePath.split(path.sep);

  // Check for layout.tsx in each directory level
  let currentPath = pagesDir;

  // Check root layout
  const rootLayoutPath = path.join(currentPath, "layout.tsx");
  if (fs.existsSync(rootLayoutPath)) {
    try {
      const layout = require(rootLayoutPath).default;
      if (layout) layouts.push(layout);
    } catch (e) {
      console.error(`Error loading layout at ${rootLayoutPath}:`, e);
    }
  }

  // Check nested layouts
  for (const segment of segments) {
    currentPath = path.join(currentPath, segment);
    const layoutPath = path.join(currentPath, "layout.tsx");
    if (fs.existsSync(layoutPath)) {
      try {
        const layout = require(layoutPath).default;
        if (layout) layouts.push(layout);
      } catch (e) {
        console.error(`Error loading layout at ${layoutPath}:`, e);
      }
    }
  }

  return layouts;
}

/**
 * Get layout paths for client-side hydration
 * Returns an array of layout paths like ["/layout", "/dashboard/layout"]
 */
export function getLayoutPaths(filePath: string, pagesDir: string): string[] {
  const layoutPaths: string[] = [];
  const pageDir = path.dirname(filePath);
  const relativePath = path.relative(pagesDir, pageDir);
  const segments = relativePath === "." ? [] : relativePath.split(path.sep);

  // Check root layout
  const rootLayoutPath = path.join(pagesDir, "layout.tsx");
  if (fs.existsSync(rootLayoutPath)) {
    layoutPaths.push("/layout");
  }

  // Check nested layouts
  for (let i = 0; i < segments.length; i++) {
    const layoutSegments = segments.slice(0, i + 1);
    const layoutPath = "/" + layoutSegments.join("/") + "/layout";
    const fullLayoutPath = path.join(pagesDir, ...layoutSegments, "layout.tsx");

    if (fs.existsSync(fullLayoutPath)) {
      layoutPaths.push(layoutPath);
    }
  }

  return layoutPaths;
}

/**
 * Wrap a component with multiple layouts (from outermost to innermost)
 */
export function wrapWithLayouts(
  component: React.ReactNode,
  layouts: React.ComponentType<{ children: React.ReactNode }>[]
): React.ReactNode {
  return layouts.reduceRight((children, Layout) => {
    return React.createElement(Layout, null, children);
  }, component);
}

