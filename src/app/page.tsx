"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { PaperSummary } from "@/lib/brief";

function formatDate(ms: number): string {
  return new Date(ms).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function Dashboard() {
  const [papers, setPapers] = useState<PaperSummary[] | null>(null);
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/papers")
      .then((res) => res.json())
      .then((json) => setPapers(json.papers ?? []))
      .catch(() => setError("Failed to load saved briefs."));
  }, []);

  const filtered = useMemo(() => {
    if (!papers) return [];
    const q = query.trim().toLowerCase();
    if (!q) return papers;
    return papers.filter((p) =>
      [p.title, p.tldr, p.methodTags.join(" "), p.authors.join(" "), p.model]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [papers, query]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Your saved paper briefs.
          </p>
        </div>
        <Link
          href="/new"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
        >
          + New brief
        </Link>
      </div>

      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search briefs by title, TL;DR, method, author…"
        className="mt-6 w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 dark:border-neutral-700 dark:bg-neutral-900"
      />

      <div className="mt-6">
        {error ? (
          <p className="text-sm text-red-500">{error}</p>
        ) : papers === null ? (
          <p className="text-sm text-neutral-400">Loading…</p>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-300 p-12 text-center dark:border-neutral-700">
            <p className="text-neutral-500">
              {papers.length === 0
                ? "No briefs yet."
                : "No briefs match your search."}
            </p>
            {papers.length === 0 ? (
              <Link
                href="/new"
                className="mt-4 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
              >
                Create your first brief
              </Link>
            ) : null}
          </div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2">
            {filtered.map((paper) => (
              <li key={paper.id}>
                <Link
                  href={`/papers/${paper.id}`}
                  className="group flex h-full flex-col rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:border-indigo-400 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
                >
                  <div className="mb-1 flex items-center justify-between gap-2 text-xs text-neutral-400">
                    <span>{formatDate(paper.createdAt)}</span>
                    <span className="truncate">{paper.model}</span>
                  </div>
                  <h2 className="font-semibold leading-snug group-hover:underline">
                    {paper.title}
                  </h2>
                  {paper.authors.length ? (
                    <p className="mt-0.5 text-xs text-neutral-500">
                      {paper.authors.join(", ")}
                    </p>
                  ) : null}
                  {paper.tldr ? (
                    <p className="mt-2 line-clamp-3 text-sm text-neutral-600 dark:text-neutral-300">
                      {paper.tldr}
                    </p>
                  ) : null}
                  {paper.methodTags.length ? (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {paper.methodTags.slice(0, 5).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
