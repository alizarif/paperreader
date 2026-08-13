import { NextResponse } from "next/server";
import { getAllPapers } from "@/data/papers";

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim().toLowerCase();
  const category = searchParams.get("category");

  let results = getAllPapers();

  if (category && category !== "All") {
    results = results.filter((paper) => paper.category === category);
  }

  if (query) {
    results = results.filter((paper) => {
      const haystack = [
        paper.title,
        paper.abstract,
        paper.venue,
        paper.authors.join(" "),
        paper.tags.join(" "),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });
  }

  return NextResponse.json({
    count: results.length,
    papers: results.map((paper) => ({
      id: paper.id,
      title: paper.title,
      authors: paper.authors,
      year: paper.year,
      venue: paper.venue,
      category: paper.category,
      tags: paper.tags,
      readingMinutes: paper.readingMinutes,
    })),
  });
}
