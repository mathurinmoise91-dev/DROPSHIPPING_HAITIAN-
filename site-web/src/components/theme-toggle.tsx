"use client";

import { useTranslations } from "next-intl";
import { useSyncExternalStore } from "react";

export type ThemeChoice = "light" | "dark" | "system";

export const THEME_STORAGE_KEY = "theme";

/**
 * A tiny external store rather than component state: the choice lives in
 * localStorage, which React cannot own, and reading it through
 * useSyncExternalStore keeps server and client renders consistent without
 * setting state from an effect.
 */
const listeners = new Set<() => void>();
let cached: ThemeChoice | null = null;

function readChoice(): ThemeChoice {
  if (cached === null) {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    cached =
      stored === "light" || stored === "dark" || stored === "system"
        ? stored
        : "system";
  }
  return cached;
}

function serverChoice(): ThemeChoice {
  return "system";
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

export function applyTheme(choice: ThemeChoice) {
  const root = document.documentElement;
  const dark =
    choice === "dark" ||
    (choice === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  root.classList.toggle("dark", dark);
  root.classList.toggle("light", choice === "light");
}

function chooseTheme(next: ThemeChoice) {
  cached = next;
  window.localStorage.setItem(THEME_STORAGE_KEY, next);
  applyTheme(next);
  for (const listener of listeners) listener();
}

const ORDER: ThemeChoice[] = ["light", "dark", "system"];

export function ThemeToggle() {
  const t = useTranslations("theme");
  const choice = useSyncExternalStore(subscribe, readChoice, serverChoice);

  return (
    <div
      role="group"
      aria-label={t("label")}
      className="inline-flex rounded-md border border-rule p-0.5"
    >
      {ORDER.map((value) => (
        <button
          key={value}
          type="button"
          onClick={() => chooseTheme(value)}
          aria-pressed={choice === value}
          className={`cursor-pointer rounded px-2 py-1 text-xs font-medium transition-colors ${
            choice === value
              ? "bg-indigo text-on-indigo"
              : "text-ink-soft hover:text-ink"
          }`}
        >
          {t(value)}
        </button>
      ))}
    </div>
  );
}
