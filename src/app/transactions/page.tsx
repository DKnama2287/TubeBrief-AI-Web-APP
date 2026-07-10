import React from "react";
import { authOptions, CustomSession } from "../api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { getTransactions, getUserCoins } from "@/actions/fetchActions";
import DashNav from "@/components/dashboard/DashNav";
import { Receipt } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function TransactionsPage() {
  const session: CustomSession | null = await getServerSession(authOptions);
  if (!session?.user) redirect("/");

  const [coinsData, transactions] = await Promise.all([
    getUserCoins(session.user.id!),
    getTransactions(session.user.id!),
  ]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <DashNav user={session.user} coins={coinsData?.coins ?? 0} />

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-950/60">
            <Receipt className="h-5 w-5 text-violet-600 dark:text-violet-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Transactions</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Your payment history</p>
          </div>
        </div>

        {transactions.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-slate-200 py-20 text-center dark:border-slate-800">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl dark:bg-slate-800">🧾</div>
            <p className="font-medium text-slate-700 dark:text-slate-300">No transactions yet</p>
            <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">Your purchase history will appear here</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-left dark:border-slate-800 dark:bg-slate-800/50">
                  <th className="px-6 py-3.5 font-semibold text-slate-700 dark:text-slate-300">Date</th>
                  <th className="px-6 py-3.5 font-semibold text-slate-700 dark:text-slate-300">Amount</th>
                  <th className="px-6 py-3.5 text-right font-semibold text-slate-700 dark:text-slate-300">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {transactions.map((txn) => (
                  <tr key={txn.id} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                      {new Date(txn.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">₹{txn.amount}</td>
                    <td className="px-6 py-4 text-right">
                      {txn.status === 1 ? (
                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                          Success
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
                          Pending
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
