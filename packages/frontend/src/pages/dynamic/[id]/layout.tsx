/**
 * Example Layout for dynamic [id] routes
 * This layout wraps all pages under /[id]/*
 * 
 * Use this pattern for:
 * - Protected routes (authentication check)
 * - Shared UI (sidebars, navigation)
 * - Context providers specific to a section
 */

import type { ReactNode } from "react";

export default function DynamicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Example: Navigation bar for this section */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-purple-600">
              🔒 Protected Section Layout
            </h2>
            <div className="text-sm text-gray-600">
              This layout wraps all /[id] routes
            </div>
          </div>
        </div>
      </nav>

      {/* Main content area */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {children}
      </div>

      {/* Example: Footer for this section */}
      <footer className="mt-auto py-4 text-center text-sm text-gray-500">
        Dynamic Route Layout Footer
      </footer>
    </div>
  );
}

