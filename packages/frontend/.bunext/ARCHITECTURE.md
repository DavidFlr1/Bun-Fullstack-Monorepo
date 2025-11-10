# .bunext Architecture

## Overview

The `.bunext` folder is our framework infrastructure - similar to Next.js's `.next` folder, but **source code** instead of generated code. This gives us full control and transparency over how the framework works.

## Design Philosophy

### 1. Separation of Concerns

```
src/                    # Your application code
├── pages/             # Your pages and layouts
├── components/        # Your components
└── context/           # Your contexts

.bunext/               # Framework infrastructure
├── core/              # Core utilities
└── client-entry.tsx   # Client entry point
```

**Your code** focuses on business logic.  
**Framework code** handles routing, rendering, and hydration.

### 2. Explicit Over Implicit

Unlike Next.js which auto-generates everything, we make the framework code **visible and editable**:

- ✅ You can see exactly how routing works
- ✅ You can customize any part of the framework
- ✅ You understand what's happening under the hood
- ✅ No "magic" - everything is explicit

### 3. Reusability

All framework utilities are designed to be reusable:

```tsx
// In server.tsx
import { matchRoute } from "./.bunext/core/router";
import { renderPage } from "./.bunext/core/render";

// In a custom API route
import { findLayouts } from "./.bunext/core/layouts";
```

## Core Modules

### router.ts

**Purpose:** Handle file-based routing with automatic trailing slash handling.

**Key Functions:**
- `createRouter(pagesDir, origin)` - Create a FileSystemRouter instance
- `matchRoute(router, req)` - Match a request to a route (handles trailing slashes)
- `getRouterData(match)` - Extract router data for client hydration

**Why it exists:** Centralizes routing logic so `server.tsx` stays clean.

### layouts.ts

**Purpose:** Discover and manage layout files in the page hierarchy.

**Key Functions:**
- `findLayouts(filePath, pagesDir)` - Find all layouts for a page
- `getLayoutPaths(filePath, pagesDir)` - Get layout paths for client
- `wrapWithLayouts(component, layouts)` - Wrap a component with layouts

**Why it exists:** Implements Next.js-style nested layouts without the complexity.

### render.tsx

**Purpose:** Server-side rendering with layouts and providers.

**Key Functions:**
- `renderPage(options)` - Render a page with layouts to a stream

**Why it exists:** Encapsulates all SSR logic in one place.

### hydration.tsx

**Purpose:** Client-side hydration with layouts.

**Key Functions:**
- `hydrate(config)` - Hydrate server-rendered HTML
- `wrapWithLayouts(component, layouts)` - Client-side layout wrapping
- `matchDynamicRoute(pagePath, routes)` - Match dynamic routes

**Why it exists:** Mirrors server-side rendering on the client.

## Data Flow

### Server-Side Rendering

```
Request
  ↓
matchRoute() → Find page file
  ↓
findLayouts() → Discover layouts
  ↓
wrapWithLayouts() → Wrap page with layouts
  ↓
renderPage() → Render to HTML stream
  ↓
Response (HTML + data attributes)
```

### Client-Side Hydration

```
Browser loads HTML
  ↓
Read data attributes (page, router, layouts)
  ↓
Load page component from routes map
  ↓
Load layout components from layouts map
  ↓
wrapWithLayouts() → Wrap page with layouts
  ↓
hydrate() → Attach React to DOM
```

## File Structure

```
.bunext/
├── core/
│   ├── router.ts          # Routing utilities
│   │   └── matchRoute()   # Handles /123 and /123/
│   │
│   ├── layouts.ts         # Layout discovery
│   │   ├── findLayouts()  # Server-side
│   │   └── getLayoutPaths() # For client
│   │
│   ├── render.tsx         # SSR
│   │   └── renderPage()   # Renders with layouts
│   │
│   └── hydration.tsx      # Client hydration
│       └── hydrate()      # Hydrates with layouts
│
└── client-entry.tsx       # Client entry point
    ├── routes map         # Page components
    ├── layouts map        # Layout components
    └── hydrate() call     # Start the app
```

## Integration Points

### server.tsx

**Before .bunext:**
```tsx
// 200+ lines of routing, layout discovery, rendering logic
```

**After .bunext:**
```tsx
import { matchRoute, renderPage } from "./.bunext/core";

const match = matchRoute(router, req);
const stream = await renderPage({ match, Providers });
```

**Result:** Server code is now ~50 lines instead of 200+.

### client-entry.tsx

**Before .bunext:**
```tsx
// Embedded in src/client.tsx with page-specific logic
```

**After .bunext:**
```tsx
import { hydrate } from "./core/hydration";

hydrate({ routes, layouts, Providers });
```

**Result:** Client entry is declarative - just map routes and call hydrate.

## Benefits

### 1. Clean Application Code

Your `server.tsx` and application code stay focused on business logic:

```tsx
// server.tsx - Just configuration!
const stream = await renderPage({
  match,
  pagesDir,
  Providers,
  title: "My App",
});
```

### 2. Centralized Framework Logic

All framework code is in one place:
- Easy to find
- Easy to update
- Easy to understand

### 3. Reusable Utilities

Use framework utilities anywhere:

```tsx
// Custom API route
import { matchRoute } from "./.bunext/core/router";

// Custom renderer
import { findLayouts } from "./.bunext/core/layouts";
```

### 4. Transparent & Debuggable

No black box - you can:
- Read the source
- Add console.logs
- Modify behavior
- Understand exactly what's happening

### 5. Performance

- Uses Bun's native APIs
- No unnecessary abstractions
- Minimal overhead
- Fast builds

## Comparison to Next.js

| Aspect | Next.js `.next/` | Our `.bunext/` |
|--------|------------------|----------------|
| **Type** | Generated code | Source code |
| **Visibility** | Hidden | Visible |
| **Customizable** | No | Yes |
| **Size** | ~100MB | ~10KB |
| **Auto-updates** | Yes | Manual |
| **Learning** | Black box | Transparent |
| **Control** | Limited | Full |

## Future Enhancements

Potential additions to `.bunext`:

1. **Automatic route discovery** - Auto-generate routes map
2. **API routes** - Handle API endpoints
3. **Middleware** - Request/response middleware
4. **Static generation** - Pre-render pages at build time
5. **Image optimization** - Optimize images like Next.js
6. **Code splitting** - Automatic per-route splitting

## Philosophy

> "Make the framework code visible, understandable, and customizable."

We believe developers should understand their tools. By making the framework code part of your source, you:

- **Learn** how SSR and hydration work
- **Control** every aspect of the framework
- **Customize** behavior to your needs
- **Debug** with full visibility

This is the opposite of Next.js's "magic" approach, and that's intentional.

---

**Remember:** `.bunext` is **your code**. Feel free to modify it to fit your needs!

