import { addCoins, clearCache } from "@/actions/commonActions";
import prisma from "@/lib/db.config";
import { CheckCircle, Zap } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ txnId?: string }>;
}) {
  const { txnId } = await searchParams;
  let coinsAdded = 0;

  if (txnId) {
    try {
      const txn = await prisma.transaction.findUnique({ where: { id: txnId } });
      if (txn && txn.status !== 1) {
        const product = await prisma.products.findFirst({ where: { amount: txn.amount } });
        if (product) {
          coinsAdded = product.coins;
          await prisma.transaction.update({ where: { id: txnId }, data: { status: 1 } });
          await addCoins(txn.user_id, product.coins);
          await clearCache("/dashboard");
        }
      } else if (txn?.status === 1) {
        const product = await prisma.products.findFirst({ where: { amount: txn.amount } });
        coinsAdded = product?.coins ?? 0;
      }
    } catch { /* silent */ }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
      <div className="w-full max-w-md text-center">
        <div className="rounded-2xl border border-slate-100 bg-white p-10 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/40">
            <CheckCircle className="h-10 w-10 text-emerald-500" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">Payment Successful!</h1>
          <p className="mb-6 text-slate-500 dark:text-slate-400">Your coins have been added to your account.</p>

          {coinsAdded > 0 && (
            <div className="mb-6 inline-flex items-center gap-2 rounded-xl bg-violet-50 px-5 py-3 dark:bg-violet-950/40">
              <Zap className="h-5 w-5 text-violet-600 dark:text-violet-400" />
              <span className="text-lg font-bold text-violet-700 dark:text-violet-400">+{coinsAdded} coins added</span>
            </div>
          )}

          <Link href="/dashboard" className="block w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90">
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
