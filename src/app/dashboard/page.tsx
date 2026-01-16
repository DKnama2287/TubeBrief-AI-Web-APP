import DashNav from '@/components/dashboard/DashNav'
import React from 'react'
import { authOptions, CustomSession } from '../api/auth/[...nextauth]/options'
import { getServerSession } from 'next-auth/next';
import { getUserCoins, getUserOldSummaries } from '@/actions/fetchActions';
import UrlInput from '@/components/dashboard/UrlInput';
import OldSummaryCard from '@/components/dashboard/OldSummaryCard';

// Make this page dynamic - no caching for instant coin updates
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function dashboard() {

    const session:CustomSession | null= await getServerSession(authOptions);
    const userCoins = await getUserCoins(session?.user?.id!);
    const oldSummaries = await getUserOldSummaries(Number(session?.user?.id!));
  

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-purple-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900'>
      <DashNav user={session?.user!} userCoins={userCoins} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-fadeInUp">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Welcome back, <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{session?.user?.name?.split(' ')[0]}</span>! 
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Create amazing podcast summaries with AI</p>
        </div>

        {/* URL Input Card */}
        <div className="animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
          <UrlInput user={session?.user!} userCoins={userCoins} />
        </div>

        {/* Summaries Section */}
        <div className="mt-16 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
          {oldSummaries.length > 0 ? (
            <>
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Your Summaries
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  You have created {oldSummaries.length} {oldSummaries.length === 1 ? 'summary' : 'summaries'}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {oldSummaries.map((item, index) => (
                  <div 
                    key={index} 
                    className="animate-fadeInUp" 
                    style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                  >
                    <OldSummaryCard summary={item} />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 mb-4 animate-float">
                  <span className="text-5xl">📝</span>
                </div>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                No Summaries Yet
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                Add a YouTube video URL above to create your first AI-powered podcast summary!
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-500">
                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
                <span>Ready to summarize any podcast in seconds</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
