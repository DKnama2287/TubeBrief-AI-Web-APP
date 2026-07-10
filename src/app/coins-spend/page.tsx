import React from "react";
import { authOptions, CustomSession } from "../api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { getCoinsSpend, getUserCoins } from "@/actions/fetchActions";
import DashNav from "@/components/dashboard/DashNav";
import { Coins, ExternalLink } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function CoinsSpendPage() {
  const session: CustomSession | null = await getServerSession(authOptions);
  if (!session?.user) redirect("/");

  const [coinsData, spends] = await Promise.all([
    getUserCoins(session.user.id!),
    getCoinsSpend(session.user.id!),
  ]);

  const coins = coinsData?.coins ?? 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <DashNav user={session.user} coins={coins} />

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-950/60">
            <Coins className="h-5 w-5 text-violet-600 dark:text-violet-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Coin History</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Track how your coins were spent</p>
          </div>
          <div className="ml-auto rounded-full bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-700 dark:bg-violet-950/60 dark:text-violet-400">
            {coins} coins remaining
          </div>
        </div>

        {spends.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-slate-200 py-20 text-center dark:border-slate-800">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl dark:bg-slate-800">🪙</div>
            <p className="font-medium text-slate-700 dark:text-slate-300">No coins spent yet</p>
            <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">Your coin usage history will appear here</p>
          </div>
        ) : (
          <>
            {/* Mobile cards */}
            <div className="flex flex-col gap-3 md:hidden">
              {spends.map((spend) => (
                <div
                  key={spend.id}
                  className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                >
                  {/* Title row */}
                  <p className="mb-3 font-semibold leading-snug text-slate-900 dark:text-white">
                    {spend.summary?.title ?? "Untitled"}
                  </p>

                  {/* Meta row */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {new Date(spend.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>

                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600 dark:bg-red-950/40 dark:text-red-400">
                        −10 coins
                      </span>
                      {spend.summary?.id && (
                        <Link
                          href={`/summarize?id=${spend.summary.id}`}
                          className="inline-flex items-center gap-1 rounded-lg border border-violet-200 px-2.5 py-1 text-xs font-semibold text-violet-600 transition-colors hover:bg-violet-50 dark:border-violet-800 dark:text-violet-400 dark:hover:bg-violet-950/40"
                        >
                          View <ExternalLink className="h-3 w-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop table */}
            <div className="hidden overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 md:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 text-left dark:border-slate-800 dark:bg-slate-800/50">
                    <th className="px-6 py-3.5 font-semibold text-slate-700 dark:text-slate-300">Video</th>
                    <th className="px-6 py-3.5 font-semibold text-slate-700 dark:text-slate-300">Date</th>
                    <th className="px-6 py-3.5 text-right font-semibold text-slate-700 dark:text-slate-300">Coins</th>
                    <th className="px-6 py-3.5 text-right font-semibold text-slate-700 dark:text-slate-300">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                  {spends.map((spend) => (
                    <tr key={spend.id} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="px-6 py-4">
                        <p className="max-w-xs truncate font-medium text-slate-900 dark:text-white">
                          {spend.summary?.title ?? "Untitled"}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                        {new Date(spend.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600 dark:bg-red-950/40 dark:text-red-400">
                          −10 coins
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {spend.summary?.id && (
                          <Link
                            href={`/summarize?id=${spend.summary.id}`}
                            className="inline-flex items-center gap-1 text-xs font-medium text-violet-600 hover:underline dark:text-violet-400"
                          >
                            View <ExternalLink className="h-3 w-3" />
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
