"use client";

import { useState } from "react";
import { BRIEF_SECTIONS, type Brief } from "@/lib/brief";

const SECTION_ACCENT: Record<string, string> = {
  contribution: "border-l-indigo-500",
  identification: "border-l-emerald-500",
  data: "border-l-amber-500",
  results: "border-l-sky-500",
  caveats: "border-l-rose-500",
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      }}
      className="text-xs text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function briefToText(brief: Brief): string {
  const lines = [`${brief.title}`];
  if (brief.authors.length) lines.push(brief.authors.join(", "));
  if (brief.tldr) lines.push(`\nTL;DR: ${brief.tldr}`);
  for (const section of BRIEF_SECTIONS) {
    lines.push(`\n${section.label}:`);
    for (const item of brief[section.key]) lines.push(`- ${item}`);
  }
  return lines.join("\n");
}

export function BriefView({ brief }: { brief: Brief }) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold leading-snug">{brief.title}</h2>
            <p className="mt-1 text-sm text-neutral-500">
              {[brief.authors.join(", "), brief.year]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </div>
          <CopyButton text={briefToText(brief)} />
        </div>
        {brief.tldr ? (
          <p className="mt-3 rounded-lg bg-indigo-50 px-3 py-2 text-sm text-indigo-900 dark:bg-indigo-950/50 dark:text-indigo-200">
            <span className="font-semibold">TL;DR </span>
            {brief.tldr}
          </p>
        ) : null}
        {brief.methodTags.length ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {brief.methodTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      <div className="grid gap-4">
        {BRIEF_SECTIONS.map((section) => {
          const items = brief[section.key];
          return (
            <section
              key={section.key}
              className={`rounded-xl border border-l-4 border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900 ${
                SECTION_ACCENT[section.key] ?? ""
              }`}
            >
              <div className="mb-2 flex items-baseline justify-between gap-3">
                <h3 className="text-base font-semibold">{section.label}</h3>
                <span className="text-xs text-neutral-400">{section.hint}</span>
              </div>
              {items.length ? (
                <ul className="space-y-1.5">
                  {items.map((item, index) => (
                    <li
                      key={index}
                      className="flex gap-2 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-neutral-400">Not reported.</p>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
