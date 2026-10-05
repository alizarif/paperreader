import { NextResponse } from "next/server";
import { listModels } from "@/lib/openrouter";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const auth = request.headers.get("authorization");
  const apiKey = auth?.toLowerCase().startsWith("bearer ")
    ? auth.slice(7)
    : null;
  try {
    const models = await listModels(apiKey);
    return NextResponse.json({ models });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load models.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
