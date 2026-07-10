import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <Image src="/images/icon_192.png" alt="TubeBrief AI" width={32} height={32} className="block rounded-lg dark:hidden" />
              <Image src="/images/icon_194.png" alt="TubeBrief AI" width={32} height={32} className="hidden rounded-lg dark:block" />
              <span className="text-lg font-bold text-slate-900 dark:text-white">TubeBrief AI</span>
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              AI-powered YouTube video summarizer. Save hours — get the key insights from any video in seconds.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">Product</h4>
            <ul className="space-y-3">
              {[
                { label: "Features", href: "#home" },
                { label: "Pricing", href: "#pricing" },
                { label: "Dashboard", href: "/dashboard" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-slate-500 transition-colors hover:text-violet-600 dark:text-slate-400 dark:hover:text-violet-400">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">Account</h4>
            <ul className="space-y-3">
              {[
                { label: "Coin History", href: "/coins-spend" },
                { label: "Transactions", href: "/transactions" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-slate-500 transition-colors hover:text-violet-600 dark:text-slate-400 dark:hover:text-violet-400">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-100 pt-6 text-center text-sm text-slate-400 dark:border-slate-800 dark:text-slate-600">
          © {new Date().getFullYear()} TubeBrief AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
