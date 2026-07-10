"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { signOut } from "next-auth/react";
import { ReactNode } from "react";

export default function LogoutModal({ children }: { children: ReactNode }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-slate-900">Sign out?</AlertDialogTitle>
          <AlertDialogDescription className="text-slate-500">
            You will be signed out of TubeBrief AI. Your summaries and coins will be saved.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-lg border-slate-200 text-slate-700 hover:bg-slate-50">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => signOut({ callbackUrl: "/" })}
            className="rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:opacity-90"
          >
            Sign out
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
