import { NextResponse } from "next/server";
import { deletePaper, getPaper } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const paper = getPaper(id);
  if (!paper) {
    return NextResponse.json({ error: "Paper not found." }, { status: 404 });
  }
  return NextResponse.json({ paper });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const deleted = deletePaper(id);
  if (!deleted) {
    return NextResponse.json({ error: "Paper not found." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
