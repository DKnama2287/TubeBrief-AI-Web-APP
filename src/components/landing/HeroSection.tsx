"use client";

import { ArrowRight, Youtube, Zap, Clock, Brain } from "lucide-react";
import Link from "next/link";
import LoginModal from "../auth/LoginModal";
import { CustomUser } from "@/app/api/auth/[...nextauth]/options";

export default function HeroSection({ user }: { user?: CustomUser }) {
  return (
    <section className="relative overflow-hidden bg-white py-20 dark:bg-slate-950 sm:py-28">
      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-50 opacity-60 blur-3xl dark:bg-violet-950 dark:opacity-30" />
        <div className="absolute right-0 top-1/4 h-[400px] w-[400px] rounded-full bg-indigo-50 opacity-50 blur-3xl dark:bg-indigo-950 dark:opacity-20" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="animate-fade-in mb-6 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-1.5 dark:border-violet-800 dark:bg-violet-950/60">
            <Zap className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
            <span className="text-xs font-semibold uppercase tracking-wide text-violet-700 dark:text-violet-400">
              AI-Powered YouTube Summarizer
            </span>
          </div>

          {/* Heading */}
          <h1 className="animate-fade-in-up text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
            Turn Hours of YouTube{" "}
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent dark:from-violet-400 dark:to-indigo-400">
              Into Minutes
            </span>{" "}
            of Insights
          </h1>

          <p className="animate-fade-in-up delay-100 mt-6 text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            Paste any YouTube URL and get a clear, structured AI summary in seconds.
            Stop wasting time scrubbing through long videos — get the key insights instantly.
          </p>

          {/* CTAs */}
          <div className="animate-fade-in-up delay-200 mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {user ? (
              <Link
                href="/dashboard"
                className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-violet-200 transition-all hover:opacity-90 hover:shadow-xl dark:shadow-violet-950"
              >
                Go to Dashboard
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            ) : (
              <LoginModal>
                <button className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-violet-200 transition-all hover:opacity-90 hover:shadow-xl dark:shadow-violet-950">
                  Start for Free
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </LoginModal>
            )}
            <a
              href="#pricing"
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-base font-semibold text-slate-700 shadow-sm transition-all hover:border-violet-300 hover:text-violet-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-violet-600 dark:hover:text-violet-400"
            >
              View Pricing
            </a>
          </div>

          <p className="animate-fade-in delay-300 mt-5 text-sm text-slate-400 dark:text-slate-600">
            50 free coins on sign-up · No credit card required
          </p>
        </div>

        {/* Feature cards */}
        <div className="animate-fade-in-up delay-300 mt-20 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {[
            {
              icon: Youtube,
              color: "bg-red-50 text-red-500 dark:bg-red-950/60 dark:text-red-400",
              title: "Any YouTube Video",
              desc: "Paste any public YouTube URL — tutorials, podcasts, lectures, interviews.",
            },
            {
              icon: Brain,
              color: "bg-violet-50 text-violet-600 dark:bg-violet-950/60 dark:text-violet-400",
              title: "Gemini AI Engine",
              desc: "Powered by Google Gemini 2.5 Flash for accurate, context-aware summaries.",
            },
            {
              icon: Clock,
              color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400",
              title: "Seconds, Not Hours",
              desc: "A 2-hour video summarized in under 60 seconds. Save your most valuable resource.",
            },
          ].map(({ icon: Icon, color, title, desc }) => (
            <div
              key={title}
              className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 font-semibold text-slate-900 dark:text-white">{title}</h3>
              <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
