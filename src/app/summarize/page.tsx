import { getSummary, getUserCoins } from "@/actions/fetchActions";
import { authOptions, CustomSession } from "../api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import DashNav from "@/components/dashboard/DashNav";
import SummaryBase from "@/components/summary/SummaryBase";
import SummarizeLoader from "@/components/summary/SummarizeLoader";

export const dynamic = "force-dynamic";

export default async function SummarizePage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const session: CustomSession | null = await getServerSession(authOptions);
  if (!session?.user) redirect("/");

  const { id } = await searchParams;
  if (!id) redirect("/dashboard");

  const [summary, coinsData] = await Promise.all([
    getSummary(id),
    getUserCoins(session.user.id!),
  ]);

  if (!summary) redirect("/dashboard");

  const coins = coinsData?.coins ?? 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <DashNav user={session.user} coins={coins} />
      <main className="py-8">
        {summary.response ? (
          <SummaryBase
            summary={summary.response}
            url={summary.url}
            title={summary.title}
          />
        ) : (
          <SummarizeLoader url={summary.url} id={summary.id} user={session.user} />
        )}
      </main>
    </div>
  );
}
