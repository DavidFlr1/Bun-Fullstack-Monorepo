# .bunext Framework

This folder contains the **framework infrastructure** for the Bun + React application, similar to how Next.js uses the `.next` folder.

## 📁 Structure

```
.bunext/
├── core/                    # Core framework utilities
│   ├── router.ts           # Routing utilities (matchRoute, createRouter)
│   ├── layouts.ts          # Layout discovery and wrapping
│   ├── render.tsx          # Server-side rendering utilities
│   └── hydration.tsx       # Client-side hydration utilities
├── client-entry.tsx        # Client-side entry point (imports your pages/layouts)
└── README.md               # This file
```

## 🎯 Purpose

This folder centralizes all the framework code that makes the application work, keeping your source code clean and focused on business logic.

### What's in here:

1. **Routing** - File-based routing with automatic trailing slash handling
2. **Layouts** - Automatic layout discovery and nesting
3. **SSR** - Server-side rendering utilities
4. **Hydration** - Client-side hydration logic
5. **Client Entry** - The entry point that bundles all your pages and layouts

## 🔧 How It Works

### Server-Side (server.tsx)

Your `server.tsx` is now super simple:

```tsx
import { createRouter, matchRoute } from "./.bunext/core/router";
import { renderPage } from "./.bunext/core/render";

const router = createRouter("./src/pages", "http://localhost:3000");

serve({
  fetch: async (req) => {
    const match = matchRoute(router, req);
    const stream = await renderPage({ match, pagesDir, Providers });
    return new Response(stream);
  },
});
```

All the complex logic (layout discovery, route matching, rendering) is handled by `.bunext`.

### Client-Side (client-entry.tsx)

The `client-entry.tsx` file:

1. Imports all your pages and layouts
2. Maps them to routes
3. Calls the hydration utility

When you add a new page or layout, you update this file.

### Build Process (build.ts)

The build script:

1. Bundles `.bunext/client-entry.tsx`
2. Outputs to `public/.bunext/client-entry.js`
3. This file is loaded by the browser

## 📝 Adding New Pages

1. **Create the page:**

   ```tsx
   // src/pages/about/index.tsx
   export default function AboutPage() {
     return <div>About</div>;
   }
   ```

2. **Rebuild (routes are auto-generated!):**
   ```bash
   bun run build
   ```

That's it! Routes are automatically discovered from `src/pages/`.

No manual registration needed!

## 📝 Adding New Layouts

1. **Create the layout:**

   ```tsx
   // src/pages/dashboard/layout.tsx
   export default function DashboardLayout({ children }) {
     return <div>{children}</div>;
   }
   ```

2. **Rebuild (layouts are auto-generated!):**
   ```bash
   bun run build
   ```

That's it! Layouts are automatically discovered from `src/pages/`.

No manual registration needed!

## 🚀 Benefits

### Clean Separation

- **Your code** (`src/`) - Business logic, pages, components
- **Framework code** (`.bunext/`) - Routing, rendering, hydration

### Reusability

All framework utilities are reusable:

```tsx
import { matchRoute } from "./.bunext/core/router";
import { findLayouts } from "./.bunext/core/layouts";
import { renderPage } from "./.bunext/core/render";
```

### Maintainability

- Framework code is centralized
- Easy to update and improve
- Clear separation of concerns

### Performance

- Uses Bun's native APIs
- Minimal overhead
- Fast builds and hot reloading

## 🔄 Generated Files

The following files are **generated** and should be gitignored:

- `public/.bunext/client-entry.js` - Bundled client code
- `public/.bunext/client-entry.js.map` - Source map
- `public/.bunext/*.js` - Any other generated chunks

These are automatically added to `.gitignore`.

## 🛠️ Customization

You can customize the framework by editing files in `.bunext/core/`:

- **router.ts** - Modify routing behavior
- **layouts.ts** - Change layout discovery logic
- **render.tsx** - Customize server rendering
- **hydration.tsx** - Modify client hydration

## 📚 Comparison to Next.js

| Feature      | Next.js `.next/` | Our `.bunext/` |
| ------------ | ---------------- | -------------- |
| Purpose      | Framework code   | Framework code |
| Generated    | Fully automatic  | Semi-automatic |
| Customizable | No               | Yes            |
| Size         | Large (~100MB)   | Small (~50KB)  |
| Speed        | Slower           | Faster (Bun)   |

## 🎓 Learning

If you want to understand how Next.js works under the hood, studying `.bunext/` is a great way to learn! It's a simplified version of what Next.js does internally.

---

**Note:** This folder is part of your source code (not generated), so it's committed to git. Only `public/.bunext/` is generated and gitignored.
