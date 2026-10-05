import { NextResponse } from "next/server";
import { createPaper, listPapers } from "@/lib/db";
import { normalizeBrief } from "@/lib/brief";

export const runtime = "nodejs";

export function GET() {
  const papers = listPapers();
  return NextResponse.json({ count: papers.length, papers });
}

export async function POST(request: Request) {
  let body: { brief?: unknown; model?: string; sourceText?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body.brief || typeof body.brief !== "object") {
    return NextResponse.json({ error: "Missing brief." }, { status: 400 });
  }

  const record = createPaper({
    brief: normalizeBrief(body.brief),
    model: (body.model ?? "").trim(),
    sourceText: (body.sourceText ?? "").trim(),
  });

  return NextResponse.json({ paper: record }, { status: 201 });
}
