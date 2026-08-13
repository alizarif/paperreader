"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BriefView } from "@/components/brief-view";
import type { PaperRecord } from "@/lib/brief";

export function PaperDetail({ paper }: { paper: PaperRecord }) {
  const router = useRouter();
  const [showOriginal, setShowOriginal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function remove() {
    if (!confirm("Delete this brief? This cannot be undone.")) return;
    setDeleting(true);
    const res = await fetch(`/api/papers/${paper.id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/");
      router.refresh();
    } else {
      setDeleting(false);
      alert("Failed to delete.");
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/"
          className="text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
        >
          ← Dashboard
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-400">
            {new Date(paper.createdAt).toLocaleString()} · {paper.model}
          </span>
          <button
            onClick={() => setShowOriginal((v) => !v)}
            className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
          >
            {showOriginal ? "Hide original" : "Show original"}
          </button>
          <button
            onClick={remove}
            disabled={deleting}
            className="rounded-lg border border-red-300 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50 dark:border-red-900 dark:hover:bg-red-950/40"
          >
            {deleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>

      <div className={showOriginal ? "grid gap-6 lg:grid-cols-2" : ""}>
        <BriefView brief={paper.brief} />
        {showOriginal ? (
          <div className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-500">
              Original text
            </h3>
            <pre className="max-h-[70vh] overflow-auto whitespace-pre-wrap font-mono text-xs leading-relaxed text-neutral-700 dark:text-neutral-300">
              {paper.sourceText || "No original text stored."}
            </pre>
          </div>
        ) : null}
      </div>
    </div>
  );
}
