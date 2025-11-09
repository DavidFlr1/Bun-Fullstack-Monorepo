"use client";

import type React from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CookiesProvider } from "react-cookie";
import { useState } from "react";
import { GlobalProvider } from "@/context/global-context";

export function Providers({ children }: { children: React.ReactNode }) {
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

  return (
    <CookiesProvider>
      <QueryClientProvider client={queryClient}>
        <GlobalProvider>
          {children}
        </GlobalProvider>
      </QueryClientProvider>
    </CookiesProvider>
  );
}
