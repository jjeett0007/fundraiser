 "use client";
import React from "react";
import { Button } from "@/components/ui/button";

interface GlobalErrorProps {
  error: Error & { digest?: string };
}

export default function GlobalError({ error }: GlobalErrorProps) {
  const handleReset = () => {
    window.location.reload();
  };

  return (
    <html>
      <body>
        <div className="min-h-screen bg-gradient-to-b from-[#0a1a2f] to-[#0c2240] text-white relative">
          <div className="absolute inset-0 w-full h-full opacity-[0.05] pointer-events-none">
            <div className="absolute inset-0 flex flex-col justify-between">
              {[...Array(24)].map((_, i) => (
                <div key={`h-${i}`} className="w-full h-px bg-white"></div>
              ))}
            </div>
            <div className="absolute inset-0 flex flex-row justify-between">
              {[...Array(24)].map((_: any, i: any) => (
                <div key={`v-${i}`} className="h-full w-px bg-white"></div>
              ))}
            </div>
          </div>
          <div className="min-h-screen flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="mb-4">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <svg
                    className="h-6 w-6 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                    />
                  </svg>
                </div>
              </div>

              <h1 className="text-xl font-rajdhani font-semibold text-gray-900 mb-2">
                Something went wrong!
              </h1>

              <p className="text-gray-600 mb-6">
                We apologize for the inconvenience. An unexpected error has
                occurred.
              </p>

              {process.env.NODE_ENV === "development" && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-left">
                  <h3 className="text-sm font-medium text-red-800 mb-2">
                    Error Details (Development Only):
                  </h3>
                  <pre className="text-xs text-red-700 whitespace-pre-wrap break-words">
                    {error.message}
                  </pre>
                  {error.digest && (
                    <p className="text-xs text-red-600 mt-2">
                      Error ID: {error.digest}
                    </p>
                  )}
                </div>
              )}

              <div className="space-y-3">
                <Button
                  onClick={handleReset}
                  className="w-full"
                  variant={"destructive"}
                >
                  Try again
                </Button>

                <button
                  onClick={() => (window.location.href = "/")}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-md transition-colors duration-200"
                >
                  Go to homepage
                </button>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  If this problem persists, please contact support.
                </p>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
