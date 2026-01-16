import prisma from "@/lib/db.config";
import Image from "next/image";
import { notFound } from "next/navigation";
import React from "react";

// Make this page dynamic - no caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function CancelTxn({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const txnId = params["txnId"];

  if (!txnId) {
    return notFound();
  }

  // Use findUnique with only the id
  const transaction = await prisma.transaction.findUnique({
    where: {
      id: txnId,
    },
  });

  console.log("The transaction is", transaction);
  
  if (!transaction) {
    return notFound();
  }

  // Check if transaction is still pending (status = 2)
  if (transaction.status !== 2) {
    // Transaction already processed
    return (
      <div className="min-h-screen flex justify-center items-center flex-col bg-gradient-to-br from-gray-50 via-slate-50 to-zinc-50 p-4">
        <div className="max-w-xl w-full bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 text-center animate-fadeInUp">
          <div className="mb-6">
            <Image 
              src="/images/cancel.png" 
              width={150} 
              height={150} 
              alt="cancel" 
              className="mx-auto drop-shadow-xl"
            />
          </div>
          <h1 className="text-3xl font-bold mb-4">
            <span className="bg-gradient-to-r from-gray-600 to-slate-600 bg-clip-text text-transparent">
              Transaction Already Processed!
            </span>
          </h1>
          <p className="text-gray-600 mb-8">
            This transaction has already been completed or cancelled.
          </p>
          <a 
            href="/dashboard" 
            className="inline-block px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            Back to Dashboard
          </a>
        </div>
      </div>
    );
  }

  // Update transaction status to cancelled (0)
  await prisma.transaction.update({
    data: {
      status: 0,
    },
    where: {
      id: txnId,
    },
  });

  return (
    <div className="min-h-screen flex justify-center items-center flex-col bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 p-4">
      <div className="max-w-2xl w-full bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 text-center animate-fadeInUp">
        {/* Cancel Icon */}
        <div className="mb-6 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-red-400 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
          </div>
          <div className="relative">
            <Image 
              src="/images/cancel.png" 
              width={180} 
              height={180} 
              alt="cancel" 
              className="mx-auto drop-shadow-2xl"
            />
          </div>
        </div>

        {/* Cancel Message */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            <span className="bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
              Payment Cancelled
            </span>
          </h1>
          <p className="text-gray-600 text-lg mb-2">
            Your payment was cancelled. No charges were made.
          </p>
          <p className="text-gray-500">
            You can try again anytime! 💪
          </p>
        </div>

        {/* Info Card */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 border border-indigo-100">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div className="text-left flex-1">
              <h3 className="font-bold text-gray-900 mb-2">Why was my payment cancelled?</h3>
              <p className="text-sm text-gray-600">
                Payments can be cancelled if you clicked the back button, closed the payment window, or chose to cancel during checkout. Your account is safe and no money was deducted.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <a 
            href="/#pricing" 
            className="flex-1 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
            </svg>
            Try Again
          </a>
          <a 
            href="/dashboard" 
            className="flex-1 px-8 py-4 bg-white border-2 border-gray-300 hover:border-indigo-500 text-gray-700 hover:text-indigo-700 font-semibold rounded-xl shadow hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
            Back to Dashboard
          </a>
        </div>

        {/* Transaction ID */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Transaction ID: <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono text-gray-700">{txnId.slice(0, 20)}...</code>
          </p>
        </div>
      </div>
    </div>
  );
}