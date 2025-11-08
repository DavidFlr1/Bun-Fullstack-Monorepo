# buntest

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.3.1. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.

## Native Bun file sistem routing 
A lightweight setup that combines **Bun**, **React**, and **TailwindCSS** — using Bun’s native server and `FileSystemRouter` (Next.js–style routing).  
The app supports server-side rendering (SSR) with React and live Tailwind compilation.

### Routing File Structure
```bash
frontend/
├── src/ # React components routed by Bun’s FileSystemRouter
│ └── pages/ # React components routed by Bun’s FileSystemRouter
│ │ └── [id]
│ │ │ └── index.tsx # Dynamic route support
│ │ └── index.tsx 
│ └── styles/
│ │ └── global.css # Tailwind Global styles entrypoint
├── public/ # Public static assets (served directly)
│ └── output.css # Tailwind generated CSS (compiled file)
├── server.tsx # Bun SSR server using React and FileSystemRouter
├── tailwind.config.js # Tailwind configuration
├── postcss.config.js # Tailwind/PostCSS integration
├── tsconfig.json # TypeScript configuration
└── package.json # Scripts and dependencies
```
### How It Works

- **Bun server (`server.tsx`)**
  - Uses Bun’s built-in `serve()` and `FileSystemRouter` for routing.
  - Renders React components to HTML on the server with `renderToReadableStream()`.
  - Manually serves static files from `/public` (e.g. `/output.css`).
  
- **Tailwind**
  - Compiled by the Tailwind CLI (`tailwindcss`).
  - Watches `styles/tailwind.css` and outputs the compiled CSS to `public/output.css`.
  - The final CSS file is automatically linked in the rendered HTML.

- **React**
  - Pages are defined inside `pages/` as `.tsx` files.
  - Each page exports a default React component which the server renders.
  - You can easily extend this to add interactive hydration if needed.

### Frontend routing setup
1. Init project
```bash
bun init -y

bun add react react-dom @types/react @types/react-dom
bun add -d tailwindcss postcss autoprefixer
npx tailwindcss init -p # If allowed
```
2. Set `tailwind.config.js` and `postcss.config.js` files in the root directory.
3. Set `src/styles/global.css`
4. Set `src/pages/index.tsx`
5. Set `server.tsx` using `FileSystemRouter`, serve static files from `public/` and render React components to HTML on the server with `renderToReadableStream()`.
6. Add the scripts to `package.json` as `"dev": "concurrently \"bunx tailwindcss -i ./src/styles/global.css -o ./public/global.css --watch\" \"bun run server.tsx\"",`