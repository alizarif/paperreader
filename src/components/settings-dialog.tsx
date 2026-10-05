"use client";

import { useState } from "react";
import { ModelSelect } from "@/components/model-select";
import { useSettings } from "@/lib/use-settings";

type SettingsDialogProps = {
  onClose: () => void;
};

/** Rendered only while open, so state initializes fresh on each open. */
export function SettingsDialog({ onClose }: SettingsDialogProps) {
  const { apiKey, model, setApiKey, setModel } = useSettings();
  const [keyInput, setKeyInput] = useState(apiKey);
  const [reveal, setReveal] = useState(false);
  const [testState, setTestState] = useState<
    { status: "idle" | "testing" } | { status: "done"; ok: boolean; msg: string }
  >({ status: "idle" });

  async function testConnection() {
    setTestState({ status: "testing" });
    try {
      const res = await fetch("/api/test-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: keyInput }),
      });
      const json = await res.json();
      setTestState({
        status: "done",
        ok: !!json.ok,
        msg: json.ok
          ? `Connected${json.info?.label ? ` (${json.info.label})` : ""}.`
          : json.error ?? "Failed.",
      });
    } catch (err) {
      setTestState({
        status: "done",
        ok: false,
        msg: err instanceof Error ? err.message : "Failed.",
      });
    }
  }

  function save() {
    setApiKey(keyInput.trim());
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4"
      onMouseDown={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl dark:border-neutral-800 dark:bg-neutral-900"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Settings</h2>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <label className="block text-sm font-medium">OpenRouter API key</label>
        <p className="mb-2 mt-1 text-xs text-neutral-500">
          Stored only in this browser (localStorage). Get one at
          openrouter.ai/keys.
        </p>
        <div className="flex gap-2">
          <input
            type={reveal ? "text" : "password"}
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            placeholder="sk-or-v1-…"
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-neutral-700 dark:bg-neutral-900"
          />
          <button
            type="button"
            onClick={() => setReveal((r) => !r)}
            className="rounded-lg border border-neutral-300 px-3 text-xs dark:border-neutral-700"
          >
            {reveal ? "Hide" : "Show"}
          </button>
        </div>

        <div className="mt-3 flex items-center gap-3">
          <button
            type="button"
            onClick={testConnection}
            disabled={testState.status === "testing"}
            className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm disabled:opacity-50 dark:border-neutral-700"
          >
            {testState.status === "testing" ? "Testing…" : "Test connection"}
          </button>
          {testState.status === "done" ? (
            <span
              className={`text-sm ${
                testState.ok ? "text-emerald-600" : "text-red-500"
              }`}
            >
              {testState.ok ? "✓ " : "✕ "}
              {testState.msg}
            </span>
          ) : null}
        </div>

        <div className="mt-5">
          <label className="block text-sm font-medium">Default model</label>
          <p className="mb-2 mt-1 text-xs text-neutral-500">
            Any OpenRouter model. Current: <code>{model}</code>
          </p>
          <ModelSelect value={model} onChange={setModel} apiKey={keyInput} />
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm text-neutral-600 dark:text-neutral-300"
          >
            Cancel
          </button>
          <button
            onClick={save}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
