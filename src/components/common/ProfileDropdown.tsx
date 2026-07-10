import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CustomUser } from "@/app/api/auth/[...nextauth]/options";
import { LayoutDashboard, Coins, Receipt, LogOut } from "lucide-react";
import Link from "next/link";
import LogoutModal from "../auth/LogoutModal";

export default function ProfileDropdown({
  children,
  user,
}: {
  children: React.ReactNode;
  user: CustomUser;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52 rounded-xl border border-slate-100 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-900">
        <DropdownMenuLabel className="font-normal">
          <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{user?.name}</p>
          <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800" />

        <DropdownMenuItem asChild className="cursor-pointer gap-2 rounded-lg text-slate-700 hover:bg-violet-50 hover:text-violet-700 dark:text-slate-300 dark:hover:bg-violet-950/40 dark:hover:text-violet-400">
          <Link href="/dashboard"><LayoutDashboard className="h-4 w-4" />Dashboard</Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild className="cursor-pointer gap-2 rounded-lg text-slate-700 hover:bg-violet-50 hover:text-violet-700 dark:text-slate-300 dark:hover:bg-violet-950/40 dark:hover:text-violet-400">
          <Link href="/coins-spend"><Coins className="h-4 w-4" />Coin History</Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild className="cursor-pointer gap-2 rounded-lg text-slate-700 hover:bg-violet-50 hover:text-violet-700 dark:text-slate-300 dark:hover:bg-violet-950/40 dark:hover:text-violet-400">
          <Link href="/transactions"><Receipt className="h-4 w-4" />Transactions</Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800" />

        <LogoutModal>
          <DropdownMenuItem
            onSelect={(e) => e.preventDefault()}
            className="cursor-pointer gap-2 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/40 dark:hover:text-red-400"
          >
            <LogOut className="h-4 w-4" />Sign out
          </DropdownMenuItem>
        </LogoutModal>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
