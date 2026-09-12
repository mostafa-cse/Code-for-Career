"use client";

import {
  createContext,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";

type Language = "en" | "bn";

type LanguageContextValue = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: <T>(en: T, bn: T) => T;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "bd-software-prep:language";

const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

function getSnapshot(): Language {
  if (typeof window === "undefined") return "en";
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === "bn" ? "bn" : "en";
}

function getServerSnapshot(): Language {
  return "en";
}

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

type LanguageProviderProps = {
  children: ReactNode;
};

export function LanguageProvider({ children }: LanguageProviderProps) {
  const language = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  function setLanguage(lang: Language) {
    localStorage.setItem(STORAGE_KEY, lang);
    emitChange();
  }

  function t<T>(en: T, bn: T): T {
    return language === "bn" ? bn : en;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
