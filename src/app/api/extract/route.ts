import { NextResponse } from "next/server";
import { extractText, getDocumentProxy } from "unpdf";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  const form = await request.formData().catch(() => null);
  const file = form?.get("file");

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
  }

  const name = file.name || "upload";
  const buffer = new Uint8Array(await file.arrayBuffer());

  const isPdf =
    name.toLowerCase().endsWith(".pdf") || file.type === "application/pdf";

  try {
    if (isPdf) {
      const pdf = await getDocumentProxy(buffer);
      const { text } = await extractText(pdf, { mergePages: true });
      return NextResponse.json({ name, text: text.trim() });
    }
    // Treat everything else as UTF-8 text (.txt, .md, .tex, etc.).
    const text = new TextDecoder().decode(buffer).trim();
    return NextResponse.json({ name, text });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to extract text.";
    return NextResponse.json({ error: message }, { status: 422 });
  }
}
