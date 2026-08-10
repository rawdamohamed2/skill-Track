import React from "react";
import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";

const NotFound = () => {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-6">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10">
          <Compass className="h-8 w-8 text-primary" />
        </div>

        <p className="font-mono text-sm text-secondary">ERROR 404</p>

        <h1 className="mt-3 font-display text-4xl font-semibold text-foreground">
          Page not found
        </h1>

        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
          The page you’re looking for doesn’t exist or may have been moved.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>
      </div>
    </main>
  );
};
export default NotFound;
