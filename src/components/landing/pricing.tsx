"use client";

import { CustomUser } from "@/app/api/auth/[...nextauth]/options";
import { Check, Zap } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const plans = [
  {
    name: "Starter",
    price: 99,
    coins: 100,
    planKey: "starter",
    description: "Perfect to get started",
    features: ["100 AI summary coins", "10 video summaries", "Gemini AI powered", "Markdown output", "Email support"],
    popular: false,
  },
  {
    name: "Pro",
    price: 299,
    coins: 500,
    planKey: "pro",
    description: "Best value for regular use",
    features: ["500 AI summary coins", "50 video summaries", "Gemini AI powered", "Markdown output", "Priority support", "Longer videos"],
    popular: true,
  },
  {
    name: "Ultra",
    price: 599,
    coins: 1200,
    planKey: "ultra",
    description: "For power users & teams",
    features: ["1200 AI summary coins", "120 video summaries", "Gemini AI powered", "Markdown output", "Priority support", "Longest videos", "Early access features"],
    popular: false,
  },
];

export default function Pricing({ user }: { user?: CustomUser }) {
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  async function handlePurchase(planKey: string) {
    if (!user) { signIn("google"); return; }
    setLoading(planKey);
    try {
      const res = await fetch("/api/stripe/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planKey }),
      });
      const data = await res.json();
      if (data?.url) router.push(data.url);
    } catch {
      setLoading(null);
    }
  }

  return (
    <section id="pricing" className="bg-slate-50 py-20 dark:bg-slate-900 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-1.5 dark:border-violet-800 dark:bg-violet-950/60">
            <Zap className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
            <span className="text-xs font-semibold uppercase tracking-wide text-violet-700 dark:text-violet-400">Simple Pricing</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Buy coins, summarize videos
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            Each summary costs 10 coins. New accounts get <strong className="text-slate-900 dark:text-white">50 free coins</strong> — that&apos;s 5 free summaries.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl border bg-white p-8 shadow-sm transition-shadow hover:shadow-md dark:bg-slate-800 ${
                plan.popular
                  ? "border-violet-500 ring-2 ring-violet-500 ring-offset-2 dark:ring-offset-slate-900"
                  : "border-slate-200 dark:border-slate-700"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-1 text-xs font-bold text-white shadow">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{plan.name}</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{plan.description}</p>
                <div className="mt-4 flex items-end gap-1">
                  <span className="text-4xl font-extrabold text-slate-900 dark:text-white">₹{plan.price}</span>
                  <span className="mb-1 text-slate-400 dark:text-slate-500">/one-time</span>
                </div>
                <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1 dark:bg-violet-950/60">
                  <Zap className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
                  <span className="text-sm font-semibold text-violet-700 dark:text-violet-400">{plan.coins} coins</span>
                </div>
              </div>

              <ul className="mb-8 flex-1 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                    <Check className="h-4 w-4 shrink-0 text-emerald-500" />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePurchase(plan.planKey)}
                disabled={loading === plan.planKey}
                className={`w-full rounded-xl py-3 text-sm font-semibold transition-all disabled:opacity-60 ${
                  plan.popular
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-200 hover:opacity-90 dark:shadow-violet-950"
                    : "border border-slate-200 bg-white text-slate-700 hover:border-violet-400 hover:text-violet-600 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:border-violet-500 dark:hover:text-violet-400"
                }`}
              >
                {loading === plan.planKey ? "Redirecting…" : user ? "Buy Now" : "Sign in to Buy"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
