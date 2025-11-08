import { registry } from "@/core/config";
import { zod } from "@/lib/zod";
import { UserSchema, CreateUserSchema, UpdateUserSchema } from "../";

// Register schemas with proper names
registry.register("User", UserSchema);
registry.register("CreateUser", CreateUserSchema);
registry.register("UpdateUser", UpdateUserSchema);

// Register API routes - Users

// GET /api/users - Get all users
registry.registerPath({
  method: "get",
  path: "/api/users",
  summary: "Get all users",
  tags: ["Users"],
  responses: {
    200: {
      description: "List of users",
      content: {
        "application/json": {
          schema: zod.array(UserSchema),
        },
      },
    },
  },
});

// GET /api/users/:id - Get user by ID
registry.registerPath({
  method: "get",
  path: "/api/users/{id}",
  summary: "Get user by ID",
  tags: ["Users"],
  request: {
    params: zod.object({
      id: zod.string().uuid().openapi({ description: "User ID" }),
    }),
  },
  responses: {
    200: {
      description: "User found",
      content: {
        "application/json": {
          schema: UserSchema,
        },
      },
    },
    404: {
      description: "User not found",
      content: {
        "application/json": {
          schema: zod.object({ error: zod.string() }),
        },
      },
    },
  },
});

// POST /api/users - Create user
registry.registerPath({
  method: "post",
  path: "/api/users",
  summary: "Create user",
  tags: ["Users"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: CreateUserSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Created user",
      content: {
        "application/json": {
          schema: UserSchema,
        },
      },
    },
    400: {
      description: "Validation error",
      content: {
        "application/json": {
          schema: zod.object({ error: zod.any() }),
        },
      },
    },
  },
});

// PUT /api/users/:id - Update user (id in path)
registry.registerPath({
  method: "put",
  path: "/api/users/{id}",
  summary: "Update user",
  tags: ["Users"],
  request: {
    params: zod.object({
      id: zod.string().uuid().openapi({ description: "User ID" }),
    }),
    body: {
      content: {
        "application/json": {
          schema: UpdateUserSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Updated user",
      content: {
        "application/json": {
          schema: UserSchema,
        },
      },
    },
    400: {
      description: "Validation error",
      content: {
        "application/json": {
          schema: zod.object({ error: zod.any() }),
        },
      },
    },
    404: {
      description: "User not found",
      content: {
        "application/json": {
          schema: zod.object({ error: zod.string() }),
        },
      },
    },
  },
});

// DELETE /api/users - Delete user (id as query param)
registry.registerPath({
  method: "delete",
  path: "/api/users",
  summary: "Delete user",
  tags: ["Users"],
  request: {
    query: zod.object({
      id: zod.string().uuid().openapi({ description: "User ID to delete" }),
    }),
  },
  responses: {
    200: {
      description: "User deleted successfully",
      content: {
        "application/json": {
          schema: zod.object({ message: zod.string() }),
        },
      },
    },
    400: {
      description: "Missing id query parameter",
      content: {
        "application/json": {
          schema: zod.object({ error: zod.string() }),
        },
      },
    },
    404: {
      description: "User not found",
      content: {
        "application/json": {
          schema: zod.object({ error: zod.string() }),
        },
      },
    },
  },
});
