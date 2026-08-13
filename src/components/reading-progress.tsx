"use client";

import { useEffect, useState } from "react";

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function update() {
      const scrollTop = window.scrollY;
      const height =
        document.documentElement.scrollHeight - window.innerHeight;
      const pct = height > 0 ? Math.min(100, (scrollTop / height) * 100) : 0;
      setProgress(pct);
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-30 h-2 bg-neutral-200 shadow-sm dark:bg-neutral-800">
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
        aria-label="Reading progress"
        data-testid="reading-progress"
        className="h-full bg-indigo-600 transition-[width] duration-150 dark:bg-indigo-400"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
