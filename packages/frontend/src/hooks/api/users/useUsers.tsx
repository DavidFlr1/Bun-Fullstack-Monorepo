import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { components } from "@/types/schemas/api";

type UserBody = components["schemas"]["CreateUser"];

/**
 * Get all users
 * @returns Array of users - type inferred from OpenAPI spec
 */
export function useGetAllUsers(enabled: boolean = true) {
  return useQuery({
    queryKey: getAllUsersKey,
    queryFn: async () => {
      const { data } = await api.GET("/api/users");
      return data;
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
}
export const getAllUsersKey = ["getAllUsers"];

/**
 * Get a single user by ID
 * @param id - User ID
 * @returns User object - type inferred from OpenAPI spec
 */
export function useGetUser(id: string, enabled: boolean = true) {
  return useQuery({
    queryKey: getUserKey,
    queryFn: async () => {
      const { data } = await api.GET("/api/users/{id}", { params: { path: { id } } });
      return data;
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
}
export const getUserKey = ["getUser"];

/**
 * Create a new user
 * @returns Mutation hook with type-safe body parameter
 */
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: UserBody) => {
      const { data } = await api.POST("/api/users", { body });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getAllUsersKey });
    },
    onError: (error) => {
      console.error("Failed to create:", error);
    },
  });
}

/**
 * Update an existing user
 * @returns Mutation hook with type-safe body parameter
 */
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.DELETE("/api/users", { params: { query: { id } } });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getAllUsersKey });
    },
    onError: (error) => {
      console.error("Failed to delete:", error);
    },
  });
}
