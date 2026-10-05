"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { OpenRouterModel } from "@/lib/openrouter";

type ModelSelectProps = {
  value: string;
  onChange: (value: string) => void;
  apiKey?: string;
};

export function ModelSelect({ value, onChange, apiKey }: ModelSelectProps) {
  const [models, setModels] = useState<OpenRouterModel[]>([]);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      const headers: Record<string, string> = {};
      if (apiKey) headers.Authorization = `Bearer ${apiKey}`;
      try {
        const res = await fetch("/api/models", { headers });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Failed to load models.");
        if (!cancelled) setModels(json.models as OpenRouterModel[]);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load models.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [apiKey]);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = q
      ? models.filter(
          (m) =>
            m.id.toLowerCase().includes(q) ||
            m.name.toLowerCase().includes(q),
        )
      : models;
    return base.slice(0, 60);
  }, [models, query]);

  return (
    <div ref={containerRef} className="relative">
      <div className="flex items-center gap-2">
        <input
          value={open ? query : value}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => {
            setQuery("");
            setOpen(true);
          }}
          placeholder={loading ? "Loading models…" : "Search models…"}
          className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-neutral-700 dark:bg-neutral-900"
        />
      </div>
      {error ? (
        <p className="mt-1 text-xs text-red-500">
          {error} — you can still type a model id manually.
        </p>
      ) : null}
      {open ? (
        <ul className="absolute z-30 mt-1 max-h-72 w-full overflow-auto rounded-lg border border-neutral-200 bg-white py-1 text-sm shadow-lg dark:border-neutral-700 dark:bg-neutral-900">
          {filtered.length === 0 ? (
            <li className="px-3 py-2 text-neutral-500">
              {query ? `Use "${query}" as model id` : "No models"}
              {query ? (
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onChange(query.trim());
                    setOpen(false);
                  }}
                  className="ml-2 rounded bg-indigo-600 px-2 py-0.5 text-xs text-white"
                >
                  Select
                </button>
              ) : null}
            </li>
          ) : (
            filtered.map((m) => (
              <li key={m.id}>
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onChange(m.id);
                    setOpen(false);
                  }}
                  className={`flex w-full flex-col items-start px-3 py-1.5 text-left hover:bg-neutral-100 dark:hover:bg-neutral-800 ${
                    m.id === value ? "bg-neutral-100 dark:bg-neutral-800" : ""
                  }`}
                >
                  <span className="font-medium">{m.name}</span>
                  <span className="text-xs text-neutral-500">
                    {m.id}
                    {m.contextLength
                      ? ` · ${Math.round(m.contextLength / 1000)}k ctx`
                      : ""}
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      ) : null}
    </div>
  );
}
