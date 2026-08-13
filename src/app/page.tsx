import { getAllPapers, getCategories } from "@/data/papers";
import { PaperLibrary } from "@/components/paper-library";

export default function Home() {
  const papers = getAllPapers();
  const categories = getCategories();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <section className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Read the classics.
        </h1>
        <p className="mt-2 max-w-2xl text-neutral-600 dark:text-neutral-300">
          A curated, distraction-free library of foundational computer science
          and machine learning papers. Search, filter, and dive into a clean
          reading view.
        </p>
      </section>
      <PaperLibrary papers={papers} categories={categories} />
    </div>
  );
}
