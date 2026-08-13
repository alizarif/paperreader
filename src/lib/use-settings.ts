"use client";

import { useCallback, useSyncExternalStore } from "react";

const KEY_STORAGE = "paperbrief:openrouter_key";
const MODEL_STORAGE = "paperbrief:model";
export const DEFAULT_MODEL = "openai/gpt-4o-mini";

type Listener = () => void;
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  const onStorage = () => listener();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function read(key: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  return window.localStorage.getItem(key) ?? fallback;
}

export function useSettings() {
  const apiKey = useSyncExternalStore(
    subscribe,
    () => read(KEY_STORAGE, ""),
    () => "",
  );
  const model = useSyncExternalStore(
    subscribe,
    () => read(MODEL_STORAGE, DEFAULT_MODEL),
    () => DEFAULT_MODEL,
  );

  const setApiKey = useCallback((value: string) => {
    window.localStorage.setItem(KEY_STORAGE, value);
    emit();
  }, []);

  const setModel = useCallback((value: string) => {
    window.localStorage.setItem(MODEL_STORAGE, value);
    emit();
  }, []);

  return { apiKey, model, setApiKey, setModel };
}

/** Avoids hydration mismatches: returns true only after mount. */
export function useMounted() {
  const mounted = useSyncExternalStore(
    (cb) => {
      cb();
      return () => {};
    },
    () => true,
    () => false,
  );
  return mounted;
}
