import React from "react";

export default function Loading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="relative h-12 w-12">
        <div className="absolute inset-0 rounded-full border-4 border-violet-100" />
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-violet-600" />
      </div>
    </div>
  );
}
