import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllPapers, getPaperById } from "@/data/papers";
import { ReadingProgress } from "@/components/reading-progress";

export function generateStaticParams() {
  return getAllPapers().map((paper) => ({ id: paper.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/papers/[id]">): Promise<Metadata> {
  const { id } = await params;
  const paper = getPaperById(id);
  if (!paper) {
    return { title: "Paper not found" };
  }
  return {
    title: paper.title,
    description: paper.abstract,
  };
}

export default async function PaperPage({ params }: PageProps<"/papers/[id]">) {
  const { id } = await params;
  const paper = getPaperById(id);

  if (!paper) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <ReadingProgress />

      <Link
        href="/"
        className="text-sm text-neutral-500 transition-colors hover:text-neutral-900 dark:hover:text-neutral-100"
      >
        ← Back to library
      </Link>

      <header className="mt-6 border-b border-neutral-200 pb-6 dark:border-neutral-800">
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-neutral-500">
          <span className="rounded-full bg-neutral-100 px-2 py-0.5 dark:bg-neutral-800">
            {paper.category}
          </span>
          <span>
            {paper.venue} · {paper.year}
          </span>
          <span>· {paper.readingMinutes} min read</span>
        </div>
        <h1 className="text-3xl font-bold leading-tight tracking-tight">
          {paper.title}
        </h1>
        <p className="mt-3 text-neutral-600 dark:text-neutral-300">
          {paper.authors.join(", ")}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {paper.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
            >
              #{tag}
            </span>
          ))}
        </div>
      </header>

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Abstract
        </h2>
        <p className="mt-2 text-lg leading-relaxed text-neutral-800 dark:text-neutral-200">
          {paper.abstract}
        </p>
      </section>

      <div className="mt-10 space-y-10">
        {paper.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-xl font-semibold tracking-tight">
              {section.heading}
            </h2>
            <div className="mt-3 space-y-4">
              {section.paragraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className="leading-relaxed text-neutral-700 dark:text-neutral-300"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <section className="mt-12 border-t border-neutral-200 pt-6 dark:border-neutral-800">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
          References
        </h2>
        <ul className="mt-3 space-y-2 text-sm text-neutral-600 dark:text-neutral-300">
          {paper.references.map((reference) => (
            <li key={reference} className="list-inside list-disc">
              {reference}
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
