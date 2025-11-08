import { v4 as uuidv4 } from "uuid";
import type { z } from "zod";
import type { UserSchema } from "@/models/users/users.model";

// in-memory store for demo
const users: Array<z.infer<typeof UserSchema>> = [{ id: uuidv4(), name: "Alice", email: "alice@example.com" }];

export async function getAllUsers() {
  return users;
}

export async function getUserById(id: string) {
  return users.find((user) => user.id === id);
}

export async function createUser(data: Omit<z.infer<typeof UserSchema>, "id">) {
  const newUser = { id: uuidv4(), ...data };
  users.push(newUser);
  return newUser;
}

export async function updateUser(id: string, data: Partial<Omit<z.infer<typeof UserSchema>, "id">>) {
  const index = users.findIndex((user) => user.id === id);
  if (index === -1) return null;

  users[index] = { ...users[index]!, ...data } as z.infer<typeof UserSchema>;
  return users[index];
}

export async function deleteUser(id: string) {
  const index = users.findIndex((user) => user.id === id);
  if (index === -1) return false;

  users.splice(index, 1);
  return true;
}
