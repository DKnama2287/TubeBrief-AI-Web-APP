"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CustomUser } from "@/app/api/auth/[...nextauth]/options";

const steps = [
  { label: "Fetching transcript", detail: "Getting video captions…" },
  { label: "Processing content", detail: "Splitting into chunks…" },
  { label: "Generating summary", detail: "Gemini AI is summarizing…" },
];

interface SummarizeLoaderProps {
  url: string;
  id: string;
  user: CustomUser;
}

export default function SummarizeLoader({ url, id, user }: SummarizeLoaderProps) {
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 4000);
    const t2 = setTimeout(() => setStep(2), 12000);

    async function summarize() {
      try {
        const res = await fetch("/api/summarize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url, id }),
        });
        const data = await res.json();
        if (!res.ok) { setError(data?.message || "Failed to generate summary."); return; }
        router.refresh();
      } catch {
        setError("Something went wrong. Please try again.");
      }
    }

    summarize();
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [url, id, router]);

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm dark:border-red-900/40 dark:bg-slate-900">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/40">
            <span className="text-2xl">⚠️</span>
          </div>
          <h3 className="mb-2 font-semibold text-slate-900 dark:text-white">Summary Failed</h3>
          <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">{error}</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-100 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-8 flex justify-center">
          <div className="relative h-16 w-16">
            <div className="absolute inset-0 rounded-full border-4 border-violet-100 dark:border-violet-900" />
            <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-violet-600 dark:border-t-violet-400" />
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-950/40 dark:to-indigo-950/40" />
          </div>
        </div>

        <h2 className="mb-6 text-center text-lg font-bold text-slate-900 dark:text-white">
          Generating your summary…
        </h2>

        <div className="space-y-4">
          {steps.map((s, i) => (
            <div key={s.label} className="flex items-center gap-3">
              <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all ${
                i < step ? "bg-emerald-500 text-white"
                  : i === step ? "bg-violet-600 text-white"
                  : "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600"
              }`}>
                {i < step ? "✓" : i + 1}
              </div>
              <div>
                <p className={`text-sm font-medium ${i <= step ? "text-slate-900 dark:text-white" : "text-slate-400 dark:text-slate-600"}`}>
                  {s.label}
                </p>
                {i === step && <p className="text-xs text-slate-500 dark:text-slate-400">{s.detail}</p>}
              </div>
              {i === step && (
                <div className="ml-auto flex gap-1">
                  {[0, 1, 2].map((dot) => (
                    <div key={dot} className="h-1.5 w-1.5 animate-bounce rounded-full bg-violet-400" style={{ animationDelay: `${dot * 0.15}s` }} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-slate-400 dark:text-slate-600">
          This usually takes 30–60 seconds for longer videos
        </p>
      </div>
    </div>
  );
}
