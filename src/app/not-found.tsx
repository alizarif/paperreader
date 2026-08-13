import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="text-2xl font-bold">Paper not found</h1>
      <p className="mt-2 text-neutral-500">
        We couldn&apos;t find the paper you were looking for.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-lg bg-neutral-900 px-4 py-2 text-sm text-neutral-50 dark:bg-neutral-100 dark:text-neutral-900"
      >
        Back to library
      </Link>
    </div>
  );
}
