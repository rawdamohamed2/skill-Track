import React from "react";

const Loading = () => {
  return (
    <main className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl animate-pulse space-y-8">
        <div className="space-y-3">
          <div className="h-8 w-48 rounded-md bg-muted" />
          <div className="h-4 w-72 rounded-md bg-muted" />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-28 rounded-lg border border-border bg-card"
            />
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="h-80 rounded-lg border border-border bg-card lg:col-span-2" />
          <div className="h-80 rounded-lg border border-border bg-card" />
        </div>
      </div>
    </main>
  );
};
export default Loading;
