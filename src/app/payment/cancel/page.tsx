import prisma from "@/lib/db.config";
import { XCircle } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function PaymentCancelPage({
  searchParams,
}: {
  searchParams: Promise<{ txnId?: string }>;
}) {
  const { txnId } = await searchParams;

  if (txnId) {
    try {
      await prisma.transaction.update({ where: { id: txnId }, data: { status: 2 } });
    } catch { /* silent */ }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
      <div className="w-full max-w-md text-center">
        <div className="rounded-2xl border border-slate-100 bg-white p-10 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/40">
            <XCircle className="h-10 w-10 text-red-400" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">Payment Cancelled</h1>
          <p className="mb-8 text-slate-500 dark:text-slate-400">
            Your payment was cancelled. No charge was made to your account.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/#pricing" className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 transition-all hover:border-violet-300 hover:text-violet-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-violet-600 dark:hover:text-violet-400">
              Try Again
            </Link>
            <Link href="/dashboard" className="flex-1 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90">
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
