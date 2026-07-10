"use client";

import { CustomUser } from "@/app/api/auth/[...nextauth]/options";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import LoginModal from "../auth/LoginModal";
import ThemeToggle from "../common/ThemeToggle";
import UserAvatar from "../common/UserAvatar";
import ProfileDropdown from "../common/ProfileDropdown";

export default function Navbar({ user }: { user?: CustomUser }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/images/icon_192.png" alt="TubeBrief AI" width={32} height={32} className="block rounded-lg dark:hidden" />
          <Image src="/images/icon_194.png" alt="TubeBrief AI" width={32} height={32} className="hidden rounded-lg dark:block" />
          <span className="text-lg font-bold text-slate-900 dark:text-white">TubeBrief</span>
          <span className="text-lg font-bold text-violet-600 dark:text-violet-400">AI</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#home" className="text-sm font-medium text-slate-600 transition-colors hover:text-violet-600 dark:text-slate-400 dark:hover:text-violet-400">
            Home
          </a>
          <a href="#pricing" className="text-sm font-medium text-slate-600 transition-colors hover:text-violet-600 dark:text-slate-400 dark:hover:text-violet-400">
            Pricing
          </a>
          {user && (
            <Link href="/dashboard" className="text-sm font-medium text-slate-600 transition-colors hover:text-violet-600 dark:text-slate-400 dark:hover:text-violet-400">
              Dashboard
            </Link>
          )}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          {user ? (
            <ProfileDropdown user={user}>
              <button className="ml-1 flex items-center rounded-full transition-opacity hover:opacity-80">
                <UserAvatar image={user.image ?? undefined} name={user.name ?? "U"} />
              </button>
            </ProfileDropdown>
          ) : (
            <LoginModal>
              <button className="ml-1 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90">
                Get Started
              </button>
            </LoginModal>
          )}

          {/* Mobile hamburger — only when logged in */}
          {user && (
            <button
              className="rounded-md p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 md:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile menu — only when logged in */}
      {user && menuOpen && (
        <div className="border-t border-slate-100 bg-white px-4 pb-4 dark:border-slate-800 dark:bg-slate-950 md:hidden">
          <nav className="mt-3 flex flex-col gap-3">
            <a href="#home" className="text-sm font-medium text-slate-600 dark:text-slate-400" onClick={() => setMenuOpen(false)}>Home</a>
            <a href="#pricing" className="text-sm font-medium text-slate-600 dark:text-slate-400" onClick={() => setMenuOpen(false)}>Pricing</a>
            <Link href="/dashboard" className="text-sm font-medium text-slate-600 dark:text-slate-400" onClick={() => setMenuOpen(false)}>Dashboard</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
