import Footer from "@/components/landing/Footer";
import HeroSection from "@/components/landing/HeroSection";
import Navbar from "@/components/landing/Navbar";
import Pricing from "@/components/landing/pricing";
import { authOptions, CustomSession } from "./api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";

export default async function Page({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const session: CustomSession | null = await getServerSession(authOptions);
  const { error } = await searchParams;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <Navbar user={session?.user} />
      {error === "DatabaseError" && (
        <div className="bg-red-50 border-b border-red-200 text-red-800 text-sm text-center px-4 py-3 dark:bg-red-950/40 dark:border-red-900 dark:text-red-400">
          Unable to connect to the database. Please try again in a moment.
        </div>
      )}
      <main>
        <section id="home">
          <HeroSection user={session?.user} />
        </section>
        <section id="pricing">
          <Pricing user={session?.user} />
        </section>
      </main>
      <Footer />
    </div>
  );
}
