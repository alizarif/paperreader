import { NextResponse } from "next/server";
import { analyzePaper } from "@/lib/openrouter";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(request: Request) {
  let body: { text?: string; model?: string; apiKey?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const text = (body.text ?? "").trim();
  if (text.length < 40) {
    return NextResponse.json(
      { error: "Paper text is too short to analyze (min ~40 characters)." },
      { status: 400 },
    );
  }

  try {
    const result = await analyzePaper({
      text,
      model: body.model ?? "",
      apiKey: body.apiKey,
    });
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Analysis failed.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
