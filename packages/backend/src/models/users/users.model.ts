import { zod } from "@/lib/zod";

export const UserSchema = zod.object({
  id: zod.string().uuid().optional(),
  name: zod.string().min(1),
  email: zod.string().email(),
});

export const CreateUserSchema = UserSchema.omit({ id: true });

export const UpdateUserSchema = UserSchema.omit({ id: true }).partial();

// Convert to OpenAPI-compatible schema usage (we'll register these in openapi.ts)
// createZodOpenApiSchema(UserSchema, { name: 'User' }) // optional here

export * from "./users.model";
