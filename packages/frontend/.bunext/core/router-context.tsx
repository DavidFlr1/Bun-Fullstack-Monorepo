/**
 * Router Context - Provides routing information and navigation methods
 * Part of the .bunext framework infrastructure
 *
 * @example Basic Usage
 * ```tsx
 * import { useRouter, useParams, useSearchParams } from "@bunext/core/router-context";
 *
 * function MyComponent() {
 *   const router = useRouter();
 *   const id = useParams("id");
 *   const search = useSearchParams("search");
 *
 *   return (
 *     <div>
 *       <p>Current path: {router.pathname}</p>
 *       <p>ID param: {id}</p>
 *       <button onClick={() => router.push("/about")}>Go to About</button>
 *       <button onClick={() => router.back()}>Go Back</button>
 *     </div>
 *   );
 * }
 * ```
 *
 * @example Navigation Methods
 * ```tsx
 * // Navigate to a new page (adds to history)
 * router.push("/users/123");
 * router.push("/search?q=test");
 *
 * // Replace current page (doesn't add to history)
 * router.replace("/login");
 *
 * // Browser navigation
 * router.back();    // Go back
 * router.forward(); // Go forward
 * router.refresh(); // Reload page
 * ```
 */

import { createContext, useContext, type ReactNode } from "react";

export type RouteParams = Record<string, string>;
export type QueryParams = Record<string, string | string[]>;

export interface NavigationOptions {
  /** Replace current history entry instead of pushing a new one */
  replace?: boolean;
  /** Scroll to top after navigation (default: true) */
  scroll?: boolean;
}

export interface RouterContextType {
  /** Current pathname, e.g., "/users/123" */
  pathname: string;
  /** Route params from dynamic segments, e.g., { id: "123" } */
  params: RouteParams;
  /** Query string parameters, e.g., { search: "test", filter: ["a", "b"] } */
  query: QueryParams;
  /** Full URL search string, e.g., "?search=test&filter=a&filter=b" */
  search: string;
  /** Route pattern, e.g., "/[id]/index" */
  route: string;
  /** Navigate to a new URL */
  push: (url: string, options?: NavigationOptions) => void;
  /** Replace current URL without adding to history */
  replace: (url: string, options?: NavigationOptions) => void;
  /** Go back in history */
  back: () => void;
  /** Go forward in history */
  forward: () => void;
  /** Refresh the current page */
  refresh: () => void;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

export interface RouterProviderProps {
  children: ReactNode;
  /** Initial router data from server */
  initialData: Omit<RouterContextType, "push" | "replace" | "back" | "forward" | "refresh">;
}

export function RouterProvider({ children, initialData }: RouterProviderProps) {
  // Navigation functions
  const push = (url: string, options?: NavigationOptions) => {
    const shouldScroll = options?.scroll !== false;

    if (options?.replace) {
      window.location.replace(url);
    } else {
      window.location.href = url;
    }

    if (shouldScroll) {
      window.scrollTo(0, 0);
    }
  };

  const replace = (url: string, options?: NavigationOptions) => {
    push(url, { ...options, replace: true });
  };

  const back = () => {
    window.history.back();
  };

  const forward = () => {
    window.history.forward();
  };

  const refresh = () => {
    window.location.reload();
  };

  const routerValue: RouterContextType = {
    ...initialData,
    push,
    replace,
    back,
    forward,
    refresh,
  };

  return <RouterContext.Provider value={routerValue}>{children}</RouterContext.Provider>;
}

export function useRouter() {
  const context = useContext(RouterContext);
  if (context === undefined) {
    throw new Error("useRouter must be used within a RouterProvider");
  }
  return context;
}

/**
 * Hook to get route params
 * @example
 * const id = useParams("id"); // Get specific param
 * const allParams = useParams(); // Get all params
 */
export function useParams(): RouteParams;
export function useParams<T extends string = string>(key: string): T | undefined;
export function useParams<T extends string = string>(key?: string): T | undefined | RouteParams {
  const { params } = useRouter();
  if (key) {
    return params[key] as T | undefined;
  }
  return params;
}

/**
 * Hook to get query parameters
 * @example
 * const search = useSearchParams("search");
 * const filters = useSearchParams("filter"); // Can be string[]
 */
export function useSearchParams(key?: string): string | string[] | QueryParams | undefined {
  const { query } = useRouter();
  if (key) {
    return query[key];
  }
  return query;
}

/**
 * Hook to get the current pathname
 * @example
 * const pathname = usePathname(); // "/users/123"
 */
export function usePathname(): string {
  const { pathname } = useRouter();
  return pathname;
}
