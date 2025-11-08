import createClient from "openapi-fetch";
import type { paths as usersPaths } from "@/types/schemas/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL || "http://localhost:8000";
const API_PREFIX = process.env.NEXT_PUBLIC_API_PREFIX || process.env.API_PREFIX || "/api/v1";

// Unified paths type
type Paths = usersPaths;

// Create the openapi-fetch client with auth middleware
const client = createClient<Paths>({
  baseUrl: `${API_BASE_URL}${API_PREFIX}`,
});

// Add auth middleware
client.use({
  async onRequest({ request }) {
    try {
      // const user = auth.currentUser;
      // if (user) {
      //   const token = await user.getIdToken();
      //   request.headers.set("Authorization", `Bearer ${token}`);
      // }
    } catch (error) {
      console.error("Failed to get Firebase token:", error);
    }
    return request;
  },
});

export class ApiClient {
  private client = client;

  GET<P extends keyof Paths>(endpoint: P, init?: any) {
    return (this.client.GET as any)(endpoint, init);
  }

  POST<P extends keyof Paths>(endpoint: P, init?: any) {
    return (this.client.POST as any)(endpoint, init);
  }

  PUT<P extends keyof Paths>(endpoint: P, init?: any) {
    return (this.client.PUT as any)(endpoint, init);
  }

  DELETE<P extends keyof Paths>(endpoint: P, init?: any) {
    return (this.client.DELETE as any)(endpoint, init);
  }

  PATCH<P extends keyof Paths>(endpoint: P, init?: any) {
    return (this.client.PATCH as any)(endpoint, init);
  }
}

export const api = client;
