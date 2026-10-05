export type Brief = {
  title: string;
  authors: string[];
  year: string;
  tldr: string;
  methodTags: string[];
  contribution: string[];
  identification: string[];
  data: string[];
  results: string[];
  caveats: string[];
};

export type PaperRecord = {
  id: string;
  title: string;
  authors: string[];
  year: string;
  model: string;
  createdAt: number;
  brief: Brief;
  sourceText: string;
};

export type PaperSummary = Omit<PaperRecord, "sourceText" | "brief"> & {
  tldr: string;
  methodTags: string[];
};

export const BRIEF_SECTIONS: {
  key: keyof Pick<
    Brief,
    "contribution" | "identification" | "data" | "results" | "caveats"
  >;
  label: string;
  hint: string;
}[] = [
  {
    key: "contribution",
    label: "Contribution",
    hint: "What is new and why it matters",
  },
  {
    key: "identification",
    label: "Identification",
    hint: "Research design, identifying variation, key assumptions & threats",
  },
  {
    key: "data",
    label: "Data",
    hint: "Datasets, sample, period, unit of observation, key variables",
  },
  {
    key: "results",
    label: "Results",
    hint: "Main estimates with magnitudes, signs, significance, heterogeneity",
  },
  {
    key: "caveats",
    label: "Caveats",
    hint: "Limitations, external validity, robustness, potential confounds",
  },
];

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === "string" ? item : String(item)))
      .map((item) => item.trim())
      .filter(Boolean);
  }
  if (typeof value === "string" && value.trim()) {
    return value
      .split(/\n|•|^-\s|\s-\s/gm)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

function toText(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  return "";
}

/** Coerce arbitrary model JSON into a well-formed Brief. */
export function normalizeBrief(raw: unknown): Brief {
  const obj = (raw ?? {}) as Record<string, unknown>;
  return {
    title: toText(obj.title) || "Untitled paper",
    authors: toStringArray(obj.authors),
    year: toText(obj.year),
    tldr: toText(obj.tldr),
    methodTags: toStringArray(obj.methodTags ?? obj.method_tags),
    contribution: toStringArray(obj.contribution),
    identification: toStringArray(obj.identification ?? obj.id),
    data: toStringArray(obj.data),
    results: toStringArray(obj.results),
    caveats: toStringArray(obj.caveats),
  };
}
