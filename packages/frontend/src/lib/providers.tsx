"use client";

import type React from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CookiesProvider } from "react-cookie";
import { useState } from "react";
import { GlobalProvider } from "@/context/global-context";
import { RouterProvider, type RouterContextType } from "@bunext/core/router-context";

export interface ProvidersProps {
  children: React.ReactNode;
  routerData?: RouterContextType;
}

export function Providers({ children, routerData }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  // Default router data for server-side rendering
  const defaultRouterData: Omit<RouterContextType, "push" | "replace" | "back" | "forward" | "refresh"> =
    routerData || {
      pathname: "/",
      params: {},
      query: {},
      search: "",
      route: "/index",
    };

  return (
    <CookiesProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider initialData={defaultRouterData}>
          <GlobalProvider>{children}</GlobalProvider>
        </RouterProvider>
      </QueryClientProvider>
    </CookiesProvider>
  );
}
