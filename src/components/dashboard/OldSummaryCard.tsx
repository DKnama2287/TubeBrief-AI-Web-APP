"use client";

import { ExternalLink } from "lucide-react";
import Link from "next/link";

interface OldSummaryCardProps {
  id: string;
  title: string;
  url: string;
  created_at: Date;
  response: string | null;
}

function extractVideoId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
  return match?.[1] ?? null;
}

function timeAgo(date: Date): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function OldSummaryCard({ id, title, url, created_at, response }: OldSummaryCardProps) {
  const videoId = extractVideoId(url);
  const thumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null;

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-all hover:border-violet-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-violet-700">
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-slate-100 dark:bg-slate-800">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-3xl">🎬</span>
          </div>
        )}
        {response && (
          <div className="absolute right-2 top-2 rounded-full bg-emerald-500 px-2 py-0.5 text-xs font-medium text-white shadow">
            Summarized
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-1 line-clamp-2 text-sm font-semibold leading-snug text-slate-900 dark:text-white">
          {title}
        </h3>
        <p className="mb-4 text-xs text-slate-400 dark:text-slate-500">{timeAgo(created_at)}</p>

        <div className="mt-auto flex gap-2">
          <Link
            href={`/summarize?id=${id}`}
            className="flex-1 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 py-2 text-center text-xs font-semibold text-white transition-opacity hover:opacity-90"
          >
            {response ? "View Summary" : "Generate Summary"}
          </Link>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center rounded-lg border border-slate-200 p-2 text-slate-500 transition-colors hover:border-violet-300 hover:text-violet-600 dark:border-slate-700 dark:text-slate-400 dark:hover:border-violet-600 dark:hover:text-violet-400"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
