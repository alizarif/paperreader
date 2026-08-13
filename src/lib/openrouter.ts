import { normalizeBrief, type Brief } from "@/lib/brief";

const OPENROUTER_BASE = "https://openrouter.ai/api/v1";

/** Hard cap on characters sent to the model to bound cost / context usage. */
const MAX_INPUT_CHARS = 120_000;

export type OpenRouterModel = {
  id: string;
  name: string;
  contextLength: number | null;
  promptPrice: string | null;
  completionPrice: string | null;
};

const SYSTEM_PROMPT = `You are an expert research economist who triages empirical and theoretical papers for a busy professor. You produce fast, skimmable briefs.

You will be given the text of a paper (it may be truncated). Extract a structured brief and respond with ONLY a JSON object (no markdown, no prose) matching exactly this shape:

{
  "title": string,
  "authors": string[],
  "year": string,
  "tldr": string,               // one crisp sentence: the paper's punchline
  "methodTags": string[],       // short method labels, e.g. "RCT","DiD","IV","RDD","Event study","Structural","Panel FE","Theory","Meta-analysis"
  "contribution": string[],     // what is new and why it matters
  "identification": string[],   // research design, identifying variation, key assumptions, threats to identification
  "data": string[],             // datasets/sources, sample size, time period, unit of observation, key variables (treatment & outcome)
  "results": string[],          // main estimates with MAGNITUDES, signs, significance, and notable heterogeneity
  "caveats": string[]           // limitations, external validity, robustness, potential confounds
}

Rules:
- Every array item is a short, self-contained bullet (ideally under 25 words). Prefer specific numbers over vague statements.
- Be faithful to the paper; do not invent results. If something is not reported, use a single bullet "Not reported" for that section.
- For a purely theoretical paper, use "identification" to describe the modeling framework and key assumptions.
- Output valid minified JSON only.`;

export function getApiKey(explicit?: string | null): string | null {
  const key = (explicit ?? "").trim();
  if (key) return key;
  const env = (process.env.OPENROUTER_API_KEY ?? "").trim();
  return env || null;
}

function extractJson(content: string): unknown {
  const trimmed = content.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    // Model wrapped JSON in prose / code fences — grab the outermost object.
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start !== -1 && end !== -1 && end > start) {
      return JSON.parse(trimmed.slice(start, end + 1));
    }
    throw new Error("Model did not return valid JSON.");
  }
}

export async function listModels(apiKey?: string | null): Promise<OpenRouterModel[]> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const key = getApiKey(apiKey);
  if (key) headers.Authorization = `Bearer ${key}`;

  const res = await fetch(`${OPENROUTER_BASE}/models`, { headers });
  if (!res.ok) {
    throw new Error(`OpenRouter models request failed (${res.status}).`);
  }
  const json = (await res.json()) as {
    data?: Array<{
      id: string;
      name?: string;
      context_length?: number;
      pricing?: { prompt?: string; completion?: string };
    }>;
  };
  return (json.data ?? [])
    .map((m) => ({
      id: m.id,
      name: m.name ?? m.id,
      contextLength: m.context_length ?? null,
      promptPrice: m.pricing?.prompt ?? null,
      completionPrice: m.pricing?.completion ?? null,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export type AnalyzeResult = {
  brief: Brief;
  usage: unknown;
  truncated: boolean;
};

export async function analyzePaper(params: {
  text: string;
  model: string;
  apiKey?: string | null;
}): Promise<AnalyzeResult> {
  const key = getApiKey(params.apiKey);
  if (!key) {
    throw new Error(
      "Missing OpenRouter API key. Add it in Settings or set OPENROUTER_API_KEY.",
    );
  }
  const model = params.model?.trim();
  if (!model) throw new Error("No model selected.");

  const truncated = params.text.length > MAX_INPUT_CHARS;
  const text = truncated ? params.text.slice(0, MAX_INPUT_CHARS) : params.text;

  const res = await fetch(`${OPENROUTER_BASE}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://github.com/alizarif/paperreader",
      "X-Title": "PaperBrief",
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Analyze the following paper and return the JSON brief.${
            truncated ? " (NOTE: the text was truncated to fit context.)" : ""
          }\n\n===== PAPER TEXT =====\n${text}`,
        },
      ],
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(
      `OpenRouter request failed (${res.status}). ${detail.slice(0, 500)}`,
    );
  }

  const json = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
    usage?: unknown;
    error?: { message?: string };
  };
  if (json.error) {
    throw new Error(json.error.message ?? "OpenRouter returned an error.");
  }
  const content = json.choices?.[0]?.message?.content;
  if (!content) throw new Error("OpenRouter returned an empty response.");

  const brief = normalizeBrief(extractJson(content));
  return { brief, usage: json.usage ?? null, truncated };
}
