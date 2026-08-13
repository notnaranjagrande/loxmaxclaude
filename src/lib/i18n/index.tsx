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
  t: (path: string) => string;
};

function resolve(obj: any, path: string): unknown {
  return path.split(".").reduce((acc, key) => (acc == null ? undefined : acc[key]), obj);
}

const LocaleContext = createContext<LocaleState | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en");

  const t = useCallback(
    (path: string) => {
      const value = resolve(translations[locale], path) ?? resolve(translations.en, path);
      return typeof value === "string" ? value : path;
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
