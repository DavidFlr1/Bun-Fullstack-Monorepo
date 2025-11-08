import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

// Extend zod with OpenAPI methods
extendZodWithOpenApi(z);

// Export as 'zod' for easier auto-import
export const zod = z;
