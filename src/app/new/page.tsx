"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ModelSelect } from "@/components/model-select";
import { BriefView } from "@/components/brief-view";
import { useMounted, useSettings } from "@/lib/use-settings";
import type { Brief } from "@/lib/brief";

const SAMPLE = `We study the effect of a large-scale conditional cash transfer program on secondary school enrollment in rural districts. Exploiting the staggered rollout of the program across 214 districts between 2008 and 2014, we implement a difference-in-differences design with district and year fixed effects, using administrative enrollment records for 3.1 million students. We find that program exposure increased enrollment by 7.4 percentage points (SE 1.2), with effects roughly twice as large for girls. Event-study estimates show no differential pre-trends. Effects are concentrated among households near the eligibility threshold, and fade after program withdrawal, suggesting limited habit formation. A key caveat is that migration across district boundaries may bias estimates upward, and administrative records may undercount informal schooling.`;

export default function NewBriefPage() {
  const router = useRouter();
  const mounted = useMounted();
  const { apiKey, model: defaultModel } = useSettings();
  const [model, setModel] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [status, setStatus] = useState<
    "idle" | "extracting" | "analyzing" | "saving"
  >("idle");
  const [error, setError] = useState<string | null>(null);
  const [brief, setBrief] = useState<Brief | null>(null);
  const [truncated, setTruncated] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeModel = model ?? defaultModel;

  async function handleFile(file: File) {
    setError(null);
    setStatus("extracting");
    setFileName(file.name);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/extract", { method: "POST", body: form });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to read file.");
      setText(json.text);
      if (!json.text) setError("No extractable text found in that file.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to read file.");
    } finally {
      setStatus("idle");
    }
  }

  async function analyze() {
    setError(null);
    setBrief(null);
    if (text.trim().length < 40) {
      setError("Please paste or upload a paper first.");
      return;
    }
    setStatus("analyzing");
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, model: activeModel, apiKey }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Analysis failed.");
      setBrief(json.brief as Brief);
      setTruncated(!!json.truncated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed.");
    } finally {
      setStatus("idle");
    }
  }

  async function save() {
    if (!brief) return;
    setStatus("saving");
    setError(null);
    try {
      const res = await fetch("/api/papers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brief, model: activeModel, sourceText: text }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to save.");
      router.push(`/papers/${json.paper.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save.");
      setStatus("idle");
    }
  }

  const busy = status !== "idle";

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold tracking-tight">New brief</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Paste a paper or upload a PDF, pick a model, and generate a
        skim-ready brief.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
            >
              Upload PDF / text
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.txt,.md,.tex,application/pdf,text/plain"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
                e.target.value = "";
              }}
            />
            <button
              type="button"
              onClick={() => setText(SAMPLE)}
              className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
            >
              Load sample
            </button>
            {fileName ? (
              <span className="text-xs text-neutral-500">{fileName}</span>
            ) : null}
            <span className="ml-auto text-xs text-neutral-400">
              {text.length.toLocaleString()} chars
            </span>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste the paper text (abstract + body) here…"
            className="h-80 w-full resize-y rounded-xl border border-neutral-300 bg-white p-4 font-mono text-xs leading-relaxed outline-none focus:border-indigo-500 dark:border-neutral-700 dark:bg-neutral-900"
          />

          <div>
            <label className="mb-1 block text-sm font-medium">Model</label>
            <ModelSelect
              value={activeModel}
              onChange={setModel}
              apiKey={apiKey}
            />
          </div>

          {mounted && !apiKey ? (
            <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
              No API key set. Add your OpenRouter key in Settings (top right) —
              or the server env fallback will be used.
            </p>
          ) : null}

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={analyze}
              disabled={busy}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
            >
              {status === "analyzing" ? "Analyzing…" : "Analyze"}
            </button>
            {status === "extracting" ? (
              <span className="text-sm text-neutral-500">Reading file…</span>
            ) : null}
            {error ? (
              <span className="text-sm text-red-500">{error}</span>
            ) : null}
          </div>
        </div>

        <div>
          {brief ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={save}
                  disabled={busy}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50"
                >
                  {status === "saving" ? "Saving…" : "Save to dashboard"}
                </button>
                {truncated ? (
                  <span className="text-xs text-amber-600">
                    Input was truncated to fit context.
                  </span>
                ) : null}
              </div>
              <BriefView brief={brief} />
            </div>
          ) : (
            <div className="flex h-full min-h-80 items-center justify-center rounded-xl border border-dashed border-neutral-300 p-8 text-center text-sm text-neutral-400 dark:border-neutral-700">
              {status === "analyzing"
                ? "Analyzing the paper…"
                : "Your brief will appear here."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
