import { Hono } from "hono";
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from "@/services/users.service";
import { CreateUserSchema, UpdateUserSchema } from "@/models/users/users.model";

const router = new Hono();

// GET /api/users - Get all users
router.get("/users", async (c) => {
  const users = await getAllUsers();
  return c.json(users);
});

// GET /api/users/:id - Get user by ID (path param)
router.get("/users/:id", async (c) => {
  const id = c.req.param("id");
  const user = await getUserById(id);

  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }

  return c.json(user);
});

// POST /api/users - Create user
router.post("/users", async (c) => {
  try {
    const body = await c.req.json();
    const parsed = CreateUserSchema.parse(body);
    const created = await createUser(parsed);

    return c.json(created, 201);
  } catch (err: any) {
    if (err?.name === "ZodError") {
      return c.json({ error: err.errors }, 400);
    }
    return c.json({ error: "Internal" }, 500);
  }
});

// PUT /api/users/:id - Update user (id in path)
router.put("/users/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const parsed = UpdateUserSchema.parse(body);
    const updated = await updateUser(id, parsed);

    if (!updated) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json(updated);
  } catch (err: any) {
    if (err?.name === "ZodError") {
      return c.json({ error: err.errors }, 400);
    }
    return c.json({ error: "Internal" }, 500);
  }
});

// DELETE /api/users - Delete user (id as query param)
router.delete("/users", async (c) => {
  const id = c.req.query("id");

  if (!id) {
    return c.json({ error: "Missing id query parameter" }, 400);
  }

  const deleted = await deleteUser(id);

  if (!deleted) {
    return c.json({ error: "User not found" }, 404);
  }

  return c.json({ message: "User deleted successfully" });
});

export default router;
