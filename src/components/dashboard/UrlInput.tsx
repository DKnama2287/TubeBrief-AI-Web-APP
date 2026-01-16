"use client";
import React, { use, useState } from 'react'
import Loading from '../common/Loading';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import { CustomUser } from '@/app/api/auth/[...nextauth]/options';
import { useRouter } from 'next/navigation';

export default function UrlInput({user, userCoins}:{user:CustomUser, userCoins: CoinsType | null}) {

  const router = useRouter();
  const [url, setUrl] = useState("");
  const [errors, setErrors] = useState<AddUrlTypeError>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async  (e: React.FormEvent) => {
    try {

      e.preventDefault();
      
      // Check if user has enough coins before submitting
      if (!userCoins || userCoins.coins < 10) {
        toast.error(
          `Insufficient Coins! You have ${userCoins?.coins || 0} coins. Need 10 coins to generate summary.`,
          {
            duration: 5000,
            action: {
              label: "Add Coins",
              onClick: () => router.push("/pricing"),
            },
          }
        );
        return;
      }
      
      setLoading(true);
      const {data} = await axios.post('api/add-url', {
        url: url,
        user_id: user.id
      });
      const summary: SummaryType = data?.data;
      if(summary){
        toast.success("URL is added . Redirect you to summarize page ...");
        router.push(`/summarize/?id=${summary.id}`);
        setUrl("");
      }

      setLoading(false);
      
    } catch (error) {
       setLoading(false);
       if(error instanceof AxiosError){
         if(error.response?.status === 422){
            setErrors(error.response.data.errors);
         }else{
            toast.error(error.response?.data.message || "Something went wrong. Please try again later.");
         }
       }
    }
    // Handle URL submission logic here
  }

  return (
    <div className="w-full flex flex-col justify-center items-center">
      {/* Insufficient Coins Warning */}
      {userCoins && userCoins.coins < 10 && (
        <div className="w-full max-w-2xl mb-6 p-6 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/30 dark:to-amber-900/30 border-2 border-yellow-400 dark:border-yellow-600 rounded-2xl shadow-lg animate-fadeInUp">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-yellow-400 dark:bg-yellow-600 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-yellow-900 dark:text-yellow-200 mb-2">
                Insufficient Coins!
              </h3>
              <p className="text-yellow-800 dark:text-yellow-300 text-sm mb-4">
                You need 10 coins to generate a summary. You currently have <strong>{userCoins.coins}</strong> coins.
              </p>
              <button
                onClick={() => router.push("/#pricing")}
                className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white rounded-xl text-sm font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                </svg>
                Add More Coins
              </button>
            </div>
          </div>
        </div>
      )}

      {/* URL Input Form */}
      <div className="w-full max-w-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Generate Podcast Summary
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Paste your YouTube podcast URL below to get an AI-powered summary
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
              </svg>
            </div>
            <input  
              type='url' 
              className={`w-full h-14 pl-12 pr-4 rounded-xl bg-gray-50 dark:bg-gray-900 border-2 outline-none transition-all duration-200 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600 ${
                userCoins && userCoins.coins < 10 
                  ? 'border-yellow-400 dark:border-yellow-600 cursor-not-allowed opacity-60' 
                  : 'border-gray-300 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-600 focus:border-indigo-600 dark:focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/50'
              }`}
              placeholder='https://www.youtube.com/watch?v=...' 
              value={url} 
              onChange={(e) => setUrl(e.target.value)} 
              disabled={loading || (userCoins ? userCoins.coins < 10 : false)} 
            />
            {loading && (
              <div className='absolute right-4 top-1/2 -translate-y-1/2'>
                <Loading />
              </div>
            )}
          </div>
          {errors?.url && (
            <p className='text-red-500 text-sm flex items-center gap-2'>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
              {errors.url}
            </p>
          )}
          
          <button
            type="submit"
            disabled={loading || !url || (userCoins ? userCoins.coins < 10 : false)}
            className="w-full h-14 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loading />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
                <span>Generate Summary (10 coins)</span>
              </>
            )}
          </button>
        </form>

        {/* Info Section */}
        <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl border border-indigo-200 dark:border-indigo-800">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
            </svg>
            <div className="flex-1 text-sm text-indigo-900 dark:text-indigo-300">
              <p className="font-semibold mb-1">How it works:</p>
              <ul className="space-y-1 text-indigo-800 dark:text-indigo-400">
                <li>• Each summary costs 10 coins</li>
                <li>• Paste any YouTube podcast URL</li>
                <li>• Get AI-powered summary in seconds</li>
                <li>• Top questions are automatically highlighted</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
