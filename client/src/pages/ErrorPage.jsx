import React from "react";

export default function Error500() {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        {/* Error Number */}
        <div className="mb-8">
          <h1 className="text-[140px] font-bold text-blue-500 leading-none tracking-tighter">
            500
          </h1>
          <div className="w-16 h-1 bg-blue-400 mx-auto mt-4"></div>
        </div>

        {/* Message */}
        <div className="space-y-3 mb-10">
          <h2 className="text-2xl font-semibold text-gray-800">
            Internal Server Error
          </h2>
          <p className="text-neutral-500 text-base leading-relaxed">
            Something went wrong on our end. We're working to fix it.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={() => (window.location.href = "/")}
            className="px-6 py-3 bg-white text-blue-500 text-sm font-medium rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors"
          >
            Go Home
          </button>
        </div>

        {/* Error Code */}
        <p className="text-xs text-neutral-400 mt-12">Error Code: 500</p>
      </div>
    </div>
  );
}
