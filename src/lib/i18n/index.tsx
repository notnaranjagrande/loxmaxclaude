import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { en } from "./en";
import { sv } from "./sv";

export const translations = { en, sv };
export type Locale = keyof typeof translations;
export const localeTags: Record<Locale, string> = { en: "en-US", sv: "sv-SE" };

type LocaleState = {
  locale: Locale;
  localeTag: string;
  setLocale: (locale: Locale) => void;
  t: (path: string, vars?: Record<string, string | number>) => string;
};

function resolve(obj: any, path: string): unknown {
  return path.split(".").reduce((acc, key) => (acc == null ? undefined : acc[key]), obj);
}

function interpolate(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  return Object.keys(vars).reduce(
    (str, key) => str.replace(`{${key}}`, String(vars[key])),
    template
  );
}

const LocaleContext = createContext<LocaleState | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en");

  const t = useCallback(
    (path: string, vars?: Record<string, string | number>) => {
      const value = resolve(translations[locale], path) ?? resolve(translations.en, path);
      return typeof value === "string" ? interpolate(value, vars) : path;
    },
    [locale]
  );

  const value = useMemo(
    () => ({ locale, localeTag: localeTags[locale], setLocale, t }),
    [locale, t]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useTranslation() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useTranslation must be used within a LocaleProvider");
  return ctx;
}

export function tAnalyzingSteps(locale: Locale): readonly string[] {
  return translations[locale].analyzing.steps;
}
