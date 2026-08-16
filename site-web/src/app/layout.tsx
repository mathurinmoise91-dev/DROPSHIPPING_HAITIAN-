import type { ReactNode } from "react";

/**
 * Next requires a root layout, but every route lives under `[locale]`, which is
 * where <html> and <body> are rendered — only there is the language known.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
