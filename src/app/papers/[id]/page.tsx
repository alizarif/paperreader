import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPaper } from "@/lib/db";
import { PaperDetail } from "@/components/paper-detail";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/papers/[id]">): Promise<Metadata> {
  const { id } = await params;
  const paper = getPaper(id);
  return { title: paper?.title ?? "Brief not found" };
}

export default async function PaperPage({ params }: PageProps<"/papers/[id]">) {
  const { id } = await params;
  const paper = getPaper(id);
  if (!paper) notFound();
  return <PaperDetail paper={paper} />;
}
