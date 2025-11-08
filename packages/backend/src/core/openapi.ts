import { OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { registry } from "./config";

// Import all module registries to register their schemas and paths
// This ensures the side effects (registry.register calls) are executed
import "@/models/users";
// Add more module imports here as you create them
// import "@/models/posts";
// import "@/models/comments";

// Generate the OpenAPI document
const generator = new OpenApiGeneratorV3(registry.definitions);

export const openApiSpec = generator.generateDocument({
  openapi: "3.0.3",
  info: {
    title: "MyApp API",
    version: "0.1.0",
    description: "Auto-generated OpenAPI from Zod schemas",
  },
});
