import { NextResponse } from "next/server";
import { getApiKey } from "@/lib/openrouter";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const key = getApiKey((body as { apiKey?: string }).apiKey);
  if (!key) {
    return NextResponse.json(
      { ok: false, error: "No API key provided." },
      { status: 400 },
    );
  }
  try {
    const res = await fetch("https://openrouter.ai/api/v1/auth/key", {
      headers: { Authorization: `Bearer ${key}` },
    });
    if (!res.ok) {
      return NextResponse.json(
        { ok: false, error: `Key rejected (${res.status}).` },
        { status: 200 },
      );
    }
    const json = (await res.json()) as {
      data?: { label?: string; usage?: number; limit?: number | null };
    };
    return NextResponse.json({ ok: true, info: json.data ?? null });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Connection failed.";
    return NextResponse.json({ ok: false, error: message }, { status: 200 });
  }
}
