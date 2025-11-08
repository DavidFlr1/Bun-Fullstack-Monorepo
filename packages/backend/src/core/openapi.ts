import { OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { registry } from "./config";
import type { OpenAPIObject } from "openapi3-ts/oas31";

// Import all module registries to register their schemas and paths
// This ensures the side effects (registry.register calls) are executed
import "@/models/users";
// Add more module imports here as you create them
// import "@/models/posts";
// import "@/models/comments";

// Map of service names to their tags
const SERVICE_TAGS: Record<string, string[]> = {
  users: ["Users"],
};

// Generate the full OpenAPI document
const generator = new OpenApiGeneratorV3(registry.definitions);

export const openApiSpec = generator.generateDocument({
  openapi: "3.0.3",
  info: {
    title: "MyApp API",
    version: "0.1.0",
    description: "Auto-generated OpenAPI from Zod schemas",
  },
});

/**
 * Generate OpenAPI spec filtered by service
 * @param serviceName - The service to filter by (e.g., "users", "posts")
 * @returns Filtered OpenAPI spec or null if service not found
 */
export function generateServiceSpec(serviceName: string): OpenAPIObject | null {
  const tags = SERVICE_TAGS[serviceName.toLowerCase()];

  if (!tags) {
    return null;
  }

  // Filter paths by tags
  const filteredPaths: Record<string, any> = {};
  const usedSchemas = new Set<string>();

  // Iterate through all paths in the full spec
  for (const [path, pathItem] of Object.entries(openApiSpec.paths || {})) {
    const filteredPathItem: Record<string, any> = {};

    // Check each HTTP method
    for (const [method, operation] of Object.entries(pathItem as any)) {
      if (operation && typeof operation === "object" && "tags" in operation && Array.isArray(operation.tags)) {
        // Check if operation has any of the service's tags
        const hasServiceTag = operation.tags.some((tag: string) => tags.includes(tag));

        if (hasServiceTag) {
          filteredPathItem[method] = operation;

          // Collect schema references used in this operation
          collectSchemaRefs(operation, usedSchemas);
        }
      }
    }

    if (Object.keys(filteredPathItem).length > 0) {
      filteredPaths[path] = filteredPathItem;
    }
  }

  // Filter schemas to only include used ones
  const filteredSchemas: Record<string, any> = {};
  if (openApiSpec.components?.schemas) {
    for (const schemaName of usedSchemas) {
      if (openApiSpec.components.schemas[schemaName]) {
        filteredSchemas[schemaName] = openApiSpec.components.schemas[schemaName];
      }
    }
  }

  // Return filtered spec
  return {
    openapi: openApiSpec.openapi,
    info: {
      ...openApiSpec.info,
      title: `${openApiSpec.info.title} - ${serviceName.charAt(0).toUpperCase() + serviceName.slice(1)} Service`,
      description: `OpenAPI specification for ${serviceName} service`,
    },
    paths: filteredPaths,
    components: {
      schemas: filteredSchemas,
    },
  } as OpenAPIObject;
}

/**
 * Recursively collect schema references from an operation
 */
function collectSchemaRefs(obj: any, refs: Set<string>): void {
  if (!obj || typeof obj !== "object") return;

  // Check for $ref
  if (obj.$ref && typeof obj.$ref === "string") {
    const match = obj.$ref.match(/#\/components\/schemas\/(.+)/);
    if (match) {
      refs.add(match[1]);
    }
  }

  // Recursively check nested objects
  for (const value of Object.values(obj)) {
    if (typeof value === "object") {
      collectSchemaRefs(value, refs);
    }
  }
}
