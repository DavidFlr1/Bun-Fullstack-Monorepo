/**
 * .bunext/client-entry.tsx
 * Client-side entry point
 *
 * Routes and layouts are AUTO-GENERATED from src/pages/
 * You don't need to manually add routes here!
 *
 * To add a new page:
 * 1. Create the file in src/pages/
 * 2. Run `bun .bunext/generate-routes.ts`
 * 3. Rebuild with `bun run build.ts`
 */

import { hydrate } from "./core/hydration";
import { Providers } from "../src/lib/providers";
import { routes, layouts } from "./routes.generated";

// Hydrate the application with auto-discovered routes
hydrate({ routes, layouts, Providers });
