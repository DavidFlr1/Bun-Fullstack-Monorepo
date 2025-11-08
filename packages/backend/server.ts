// const server = Bun.serve({
//   port: 4000,
//   routes: {
//     "/api/hello": {
//       async GET(req) {
//         return Response.json({
//           message: "Hello, world!",
//           method: "GET",
//         });
//       },
//       async PUT(req) {
//         return Response.json({
//           message: "Hello, world!",
//           method: "PUT",
//         });
//       },
//     },

//     "/api/hello/:name": async req => {
//       const name = req.params.name;
//       return Response.json({
//         message: `Hello, ${name}!`,
//       });
//     },
//   },

//   development: process.env.NODE_ENV !== "production" && {
//     // Enable browser hot reloading in development
//     hmr: true,

//     // Echo console logs from the browser to the server
//     console: true,
//   },
// });

// console.log(`🚀 Server running at ${server.url}`);

import { Hono } from "hono";
import { swaggerUI } from "@hono/swagger-ui";
import { userRoutes } from "./src/api";
import { openApiSpec } from "@/core/openapi";

const app = new Hono();

// Mount routes
app.route("/api", userRoutes);

// Expose openapi.json so frontend/tools can fetch it
app.get("/openapi.json", (c) => c.json(openApiSpec));

// Swagger UI
app.get("/docs", swaggerUI({ url: "/openapi.json" }));

// Health check
app.get("/", (c) => c.text("OK - backend running"));

// Start server
Bun.serve({
  port: Number(process.env.API_PORT || 4000),
  fetch: app.fetch,
  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,
    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log(`🚀 Backend running on http://localhost:4000`);
