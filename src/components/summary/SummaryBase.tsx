"use client";

import { ArrowLeft, Check, Copy, Youtube } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

interface SummaryBaseProps {
  summary: string;
  url: string;
  title: string;
}

export default function SummaryBase({ summary, url, title }: SummaryBaseProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">

      {/* Back */}
      <Link
        href="/dashboard"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-violet-600 dark:text-slate-400 dark:hover:text-violet-400"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      {/* Title hero card */}
      <div className="mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 via-violet-600 to-indigo-600 p-6 shadow-lg shadow-violet-200/60 dark:shadow-violet-950/40 sm:p-8">
        <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white">
          ✨ AI Summary
        </span>
        <h1 className="text-lg font-bold leading-snug text-white sm:text-xl lg:text-2xl">
          {title}
        </h1>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-lg bg-white/20 px-4 py-2 text-xs font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/30 active:scale-95"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied!" : "Copy Summary"}
          </button>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg bg-white/20 px-4 py-2 text-xs font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/30 active:scale-95"
          >
            <Youtube className="h-3.5 w-3.5" />
            Watch Video
          </a>
        </div>
      </div>

      {/* Summary content */}
      <div className="rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

        {/* Content header strip */}
        <div className="flex items-center gap-2 border-b border-slate-100 px-6 py-3 dark:border-slate-800">
          <div className="h-2 w-2 rounded-full bg-violet-500" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Summary</span>
        </div>

        <div className="p-6 sm:p-8">
          <div className="
            prose prose-sm max-w-none
            sm:prose-base
            dark:prose-invert

            prose-headings:scroll-mt-6
            prose-headings:font-bold
            prose-headings:text-violet-700
            dark:prose-headings:text-violet-400
            prose-headings:mt-6
            prose-headings:mb-2

            prose-h1:text-xl
            prose-h2:text-lg
            prose-h3:text-base

            prose-p:text-slate-700
            prose-p:leading-relaxed
            dark:prose-p:text-slate-300

            prose-li:text-slate-700
            dark:prose-li:text-slate-300
            prose-li:my-0.5

            prose-ul:my-3
            prose-ol:my-3

            prose-strong:text-slate-900
            dark:prose-strong:text-white
            prose-strong:font-semibold

            prose-a:text-violet-600
            dark:prose-a:text-violet-400
            prose-a:no-underline
            hover:prose-a:underline

            prose-blockquote:border-l-violet-400
            prose-blockquote:bg-violet-50
            prose-blockquote:rounded-r-lg
            prose-blockquote:py-1
            prose-blockquote:px-4
            dark:prose-blockquote:bg-violet-950/30
            dark:prose-blockquote:border-l-violet-600
            prose-blockquote:text-slate-600
            dark:prose-blockquote:text-slate-400
            prose-blockquote:not-italic

            prose-code:rounded-md
            prose-code:bg-violet-50
            prose-code:px-1.5
            prose-code:py-0.5
            prose-code:text-violet-700
            prose-code:font-medium
            prose-code:text-sm
            dark:prose-code:bg-slate-800
            dark:prose-code:text-violet-300

            prose-hr:border-slate-100
            dark:prose-hr:border-slate-800
            prose-hr:my-6
          ">
            <ReactMarkdown>{summary}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
