"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Paper } from "@/data/papers";

type PaperLibraryProps = {
  papers: Paper[];
  categories: string[];
};

export function PaperLibrary({ papers, categories }: PaperLibraryProps) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return papers.filter((paper) => {
      const matchesCategory =
        activeCategory === "All" || paper.category === activeCategory;
      if (!matchesCategory) return false;
      if (!normalized) return true;
      const haystack = [
        paper.title,
        paper.abstract,
        paper.venue,
        paper.authors.join(" "),
        paper.tags.join(" "),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalized);
    });
  }, [papers, query, activeCategory]);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4">
        <label className="relative block">
          <span className="sr-only">Search papers</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by title, author, venue, or tag…"
            className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:focus:border-neutral-100"
          />
        </label>
        <div className="flex flex-wrap gap-2">
          {["All", ...categories].map((category) => {
            const isActive = category === activeCategory;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`rounded-full border px-3 py-1 text-sm transition ${
                  isActive
                    ? "border-neutral-900 bg-neutral-900 text-neutral-50 dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900"
                    : "border-neutral-300 text-neutral-600 hover:border-neutral-500 dark:border-neutral-700 dark:text-neutral-300"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      <p className="mb-4 text-sm text-neutral-500" data-testid="result-count">
        {filtered.length} paper{filtered.length === 1 ? "" : "s"}
      </p>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-300 p-10 text-center text-neutral-500 dark:border-neutral-700">
          No papers match your search.
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {filtered.map((paper) => (
            <li key={paper.id}>
              <Link
                href={`/papers/${paper.id}`}
                className="group flex h-full flex-col rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:border-neutral-400 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-600"
              >
                <div className="mb-2 flex items-center gap-2 text-xs text-neutral-500">
                  <span className="rounded-full bg-neutral-100 px-2 py-0.5 dark:bg-neutral-800">
                    {paper.category}
                  </span>
                  <span>
                    {paper.venue} · {paper.year}
                  </span>
                </div>
                <h2 className="text-base font-semibold leading-snug group-hover:underline">
                  {paper.title}
                </h2>
                <p className="mt-1 text-sm text-neutral-500">
                  {paper.authors.join(", ")}
                </p>
                <p className="mt-3 line-clamp-3 text-sm text-neutral-600 dark:text-neutral-300">
                  {paper.abstract}
                </p>
                <span className="mt-4 text-xs text-neutral-400">
                  {paper.readingMinutes} min read
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
