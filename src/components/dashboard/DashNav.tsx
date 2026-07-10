"use client";

import { CustomUser } from "@/app/api/auth/[...nextauth]/options";
import { Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ProfileDropdown from "../common/ProfileDropdown";
import ThemeToggle from "../common/ThemeToggle";
import UserAvatar from "../common/UserAvatar";

interface DashNavProps {
  user: CustomUser;
  coins: number;
}

export default function DashNav({ user, coins }: DashNavProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/images/icon_192.png" alt="TubeBrief AI" width={32} height={32} className="block rounded-lg dark:hidden" />
          <Image src="/images/icon_194.png" alt="TubeBrief AI" width={32} height={32} className="hidden rounded-lg dark:block" />
          <span className="text-lg font-bold text-slate-900 dark:text-white">TubeBrief</span>
          <span className="text-lg font-bold text-violet-600 dark:text-violet-400">AI</span>
        </Link>

        {/* Nav links */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/#home" className="text-sm font-medium text-slate-600 transition-colors hover:text-violet-600 dark:text-slate-400 dark:hover:text-violet-400">
            Home
          </Link>
          <Link href="/#pricing" className="text-sm font-medium text-slate-600 transition-colors hover:text-violet-600 dark:text-slate-400 dark:hover:text-violet-400">
            Pricing
          </Link>
        </nav>

        {/* Right */}
        <div className="flex items-center gap-3">
          {/* Coins */}
          <div className="flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 dark:border-violet-800 dark:bg-violet-950">
            <Zap className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
            <span className="text-sm font-semibold text-violet-700 dark:text-violet-400">{coins} coins</span>
          </div>

          <ThemeToggle />

          {/* Avatar */}
          <ProfileDropdown user={user}>
            <button className="flex items-center rounded-full transition-opacity hover:opacity-80">
              <UserAvatar image={user.image ?? undefined} name={user.name ?? "U"} />
            </button>
          </ProfileDropdown>
        </div>
      </div>
    </header>
  );
}
