import React from "react";
import { authOptions, CustomSession } from "../api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import {
  getCoinsSpend,
  getUserCoins,
} from "@/actions/fetchActions";
import DashNav from "@/components/dashboard/DashNav";
import Link from "next/link";

export default async function CoinsSpend() {
  const session: CustomSession | null = await getServerSession(authOptions);
  const userCoins = await getUserCoins(session?.user?.id!);
  const coinsSpends = await getCoinsSpend(session?.user?.id!);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-pink-50/30 dark:from-gray-900 dark:via-purple-950/30 dark:to-pink-950/30">
      <DashNav user={session?.user!} userCoins={userCoins} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center animate-fadeInUp">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 mb-4">
              <span className="text-4xl">💰</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Coins Spend History
              </span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Track all your summary generations and coin usage
            </p>
          </div>

        {/* Stats Card */}
        {coinsSpends && coinsSpends.length > 0 && (
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-600 dark:to-pink-600 rounded-2xl shadow-lg p-6 mb-8 text-white animate-fadeInUp">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1">Total Summaries Generated</p>
                <p className="text-4xl font-bold">{coinsSpends.length}</p>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-90 mb-1">Total Coins Spent</p>
                <p className="text-4xl font-bold">{coinsSpends.length * 10}</p>
              </div>
              <div className="text-6xl opacity-80">📊</div>
            </div>
          </div>
        )}

        {/* Coins Spend List */}
        {coinsSpends && coinsSpends.length > 0 ? (
          <div className="space-y-4">
            {coinsSpends.map((item, index) => (
              <Link
                key={index}
                href={`/summarize?id=${item.summary_id}`}
                className="block"
              >
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border-l-4 border-purple-500 dark:border-purple-600 hover:border-purple-600 dark:hover:border-purple-500 cursor-pointer transform hover:-translate-y-1 animate-fadeInUp"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Summary Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">🎬</span>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 line-clamp-1">
                          {item.summary?.title || "Untitled Summary"}
                        </h3>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                        <p className="flex items-start gap-2">
                          <span className="font-medium min-w-[60px]">URL:</span>
                          <span className="break-all line-clamp-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                            {item.summary?.url}
                          </span>
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="font-medium">Generated:</span>
                          <span>{new Date(item.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}</span>
                        </p>
                      </div>
                    </div>

                    {/* Coins Badge */}
                    <div className="flex flex-col items-end gap-2">
                      <div className="bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200 px-4 py-2 rounded-full">
                        <span className="text-sm font-semibold">-10 Coins</span>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        Click to view
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 animate-fadeInUp">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 mb-4">
                <span className="text-6xl">📝</span>
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              No Summaries Generated Yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Start generating YouTube video summaries to see your history here.
            </p>
            <Link
              href="/dashboard"
              className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Generate Your First Summary
            </Link>
          </div>
        )}

        {/* Back to Dashboard */}
        {coinsSpends && coinsSpends.length > 0 && (
          <div className="mt-8 text-center animate-fadeInUp" style={{ animationDelay: `${coinsSpends.length * 0.1}s` }}>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 font-semibold transition-colors duration-200 group"
            >
              <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
              </svg>
              Back to Dashboard
            </Link>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}