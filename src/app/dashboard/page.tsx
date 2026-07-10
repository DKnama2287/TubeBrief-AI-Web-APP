import DashNav from "@/components/dashboard/DashNav";
import OldSummaryCard from "@/components/dashboard/OldSummaryCard";
import UrlInput from "@/components/dashboard/UrlInput";
import { authOptions, CustomSession } from "../api/auth/[...nextauth]/options";
import { getUserCoins, getUserOldSummaries } from "@/actions/fetchActions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session: CustomSession | null = await getServerSession(authOptions);
  if (!session?.user) redirect("/");

  const [coinsData, summaries] = await Promise.all([
    getUserCoins(session.user.id!),
    getUserOldSummaries(Number(session.user.id!)),
  ]);

  const coins = coinsData?.coins ?? 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <DashNav user={session.user} coins={coins} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Welcome back, {session.user.name?.split(" ")[0]} 👋
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Paste a YouTube URL below to generate a new summary.
          </p>
        </div>

        <div className="mb-10">
          <UrlInput user={session.user} />
        </div>

        <div>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Your Summaries</h2>
            <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700 dark:bg-violet-950/60 dark:text-violet-400">
              {summaries.length} total
            </span>
          </div>

          {summaries.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-200 py-20 text-center dark:border-slate-800">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl dark:bg-slate-800">
                🎬
              </div>
              <p className="font-medium text-slate-700 dark:text-slate-300">No summaries yet</p>
              <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">Paste a YouTube URL above to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {summaries.map((s) => (
                <OldSummaryCard key={s.id} id={s.id} title={s.title} url={s.url} created_at={s.created_at} response={s.response} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
