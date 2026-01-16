"use client";
import React, { useEffect, useState } from "react";
import SummarizeLoader from "./SummarizeLoader";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import Markdown from "react-markdown";
import { clearCache } from "@/actions/commonActions";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SummaryBase({ summary }: { summary: SummaryType | null }) {
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (summary?.response) {
      setResponse(summary?.response!);
      setLoading(false);
    } else {
      summarize();
    }
  }, [summary]);

  const summarize = async () => {
    try {
      if (response.length > 0) {
        setLoading(false);
        return true;
      }
      const { data } = await axios.post("/api/summarize", {
        url: summary?.url,
        id: summary?.id,
      });
      setLoading(false);
      const res = data?.data;
      if (res) {
        setResponse(res);
        clearCache("userCoins");
        clearCache("coinsSpend");
        // Refresh the dashboard to show new summary and updated coins
        router.refresh();
      }
    } catch (error) {
      setLoading(false);
      if (error instanceof AxiosError) {
        const errorData = error.response?.data;
        
        // Check if it's insufficient coins error
        if (error.response?.status === 403 && errorData?.insufficientCoins) {
          toast.error(
            `Insufficient Coins! You have ${errorData.currentCoins} coins. Need 10 coins to generate summary.`,
            {
              duration: 5000,
              action: {
                label: "Add Coins",
                onClick: () => router.push("/pricing"), // Change to your pricing/add coins page
              },
            }
          );
        } else if ([500, 401, 400].includes(error.response?.status!)) {
          toast.error(error.response?.data?.message);
        } else {
          toast.error("Something not right!");
        }
      }
    }
  };

  return (
    <div className="flex items-center flex-col w-full animate-fadeInUp">
      {/* Header Section */}
      <div className="w-full max-w-5xl mb-8">
        <div className="flex items-center justify-between mb-6">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-semibold transition-colors group"
          >
            <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
            </svg>
            Back to Dashboard
          </Link>

          {/* Status Badge */}
          {!loading && response && (
            <div className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full border border-green-200 dark:border-green-800">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span className="font-semibold">Summary Ready</span>
            </div>
          )}
        </div>

        {/* Title Card */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg flex-shrink-0">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                {summary?.title}
              </h1>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
                </svg>
                <a href={summary?.url} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors truncate max-w-md">
                  {summary?.url}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="w-full max-w-5xl">
          <SummarizeLoader />
        </div>
      )}

      {/* Summary Content */}
      {response && (
        <div className="w-full max-w-5xl animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Content Header */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                  <h2 className="text-2xl font-bold text-white">AI-Generated Summary</h2>
                </div>
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-semibold">
                  10 coins
                </span>
              </div>
            </div>

            {/* Markdown Content */}
            <div className="p-8 prose prose-lg dark:prose-invert max-w-none
              prose-headings:text-gray-900 dark:prose-headings:text-gray-100
              prose-headings:font-bold
              prose-h1:text-3xl prose-h1:mb-4 prose-h1:mt-8
              prose-h2:text-2xl prose-h2:mb-3 prose-h2:mt-6
              prose-h3:text-xl prose-h3:mb-2 prose-h3:mt-4
              prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-4
              prose-ul:my-4 prose-ul:list-disc prose-ul:list-inside
              prose-ol:my-4 prose-ol:list-decimal prose-ol:list-inside
              prose-li:text-gray-700 dark:prose-li:text-gray-300 prose-li:mb-2
              prose-strong:text-indigo-600 dark:prose-strong:text-indigo-400 prose-strong:font-bold
              prose-em:text-purple-600 dark:prose-em:text-purple-400
              prose-code:text-pink-600 dark:prose-code:text-pink-400 prose-code:bg-pink-50 dark:prose-code:bg-pink-900/30 prose-code:px-2 prose-code:py-1 prose-code:rounded
              prose-blockquote:border-l-4 prose-blockquote:border-indigo-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-400
              prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:underline
            ">
              <Markdown>{response}</Markdown>
            </div>

            {/* Footer Actions */}
            <div className="bg-gray-50 dark:bg-gray-900/50 px-8 py-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span>Summary generated successfully</span>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(response);
                    toast.success("Summary copied to clipboard!");
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                  </svg>
                  Copy Summary
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}