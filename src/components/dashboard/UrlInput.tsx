"use client";

import { CustomUser } from "@/app/api/auth/[...nextauth]/options";
import { ArrowRight, Youtube } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function UrlInput({ user }: { user: CustomUser }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/add-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim(), user_id: user.id }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data?.message || "Something went wrong."); return; }
      router.push(`/summarize?id=${data.data?.id}`);
    } catch {
      setError("Failed to process URL. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 dark:bg-red-950/60">
          <Youtube className="h-5 w-5 text-red-500 dark:text-red-400" />
        </div>
        <div>
          <h2 className="font-semibold text-slate-900 dark:text-white">Summarize a Video</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Paste any YouTube URL below · costs 10 coins</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://youtube.com/watch?v=..."
          className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 dark:focus:border-violet-500 dark:focus:bg-slate-800 dark:focus:ring-violet-900/30"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !url.trim()}
          className="group flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />Processing…</>
          ) : (
            <>Summarize<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></>
          )}
        </button>
      </form>

      {error && (
        <p className="mt-3 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
