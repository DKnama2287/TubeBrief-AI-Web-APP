import { addCoins, clearCache } from "@/actions/commonActions";
import prisma from "@/lib/db.config";
import { notFound } from "next/navigation";
import React from "react";
import Image from "next/image";

// Make this page dynamic - no caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function SuccessTxn({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const txnId = params["txnId"];

  if (!txnId) {
    return notFound();
  }

  // Use findUnique with only the id, then check status
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
    // Transaction already processed or cancelled
    return (
      <div className="min-h-screen flex justify-center items-center flex-col bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50 p-4">
        <div className="max-w-xl w-full bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 text-center animate-fadeInUp">
          <div className="mb-6">
            <Image 
              src="/images/check.png" 
              width={150} 
              height={150} 
              alt="check" 
              className="mx-auto drop-shadow-xl"
            />
          </div>
          <h1 className="text-3xl font-bold mb-4">
            <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
              Transaction Already Processed!
            </span>
          </h1>
          <p className="text-gray-600 mb-8">
            This transaction has already been completed or cancelled.
          </p>
          <a 
            href="/dashboard" 
            className="inline-block px-8 py-4 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    );
  }

  // Get the product to know how many coins to add
  const product = await prisma.products.findFirst({
    where: {
      amount: transaction.amount,
    },
  });

  if (!product) {
    console.error("Product not found for amount:", transaction.amount);
    return notFound();
  }

  // Update transaction status to success (1)
  await prisma.transaction.update({
    data: {
      status: 1,
    },
    where: {
      id: txnId,
    },
  });

  // Add coins to user account using coins from product
  await addCoins(transaction.user_id, product.coins);

  return (
    <div className="min-h-screen flex justify-center items-center flex-col bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4">
      <div className="max-w-2xl w-full bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 text-center animate-fadeInUp">
        {/* Success Icon with Animation */}
        <div className="mb-6 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-green-400 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
          </div>
          <div className="relative animate-float">
            <Image 
              src="/images/check.png" 
              width={200} 
              height={200} 
              alt="success" 
              className="mx-auto drop-shadow-2xl"
            />
          </div>
        </div>

        {/* Success Message */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Payment Successful! 🎉
            </span>
          </h1>
          <p className="text-gray-600 text-lg">
            Your transaction has been processed successfully
          </p>
        </div>

        {/* Coins Added Card */}
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-2xl p-8 mb-6 shadow-xl transform hover:scale-105 transition-all duration-300">
          <div className="text-6xl mb-4 animate-bounce">💰</div>
          <p className="text-xl mb-2 opacity-90">Coins Added</p>
          <p className="text-5xl font-extrabold mb-2">{product.coins}</p>
          <p className="text-lg opacity-90">to your account</p>
        </div>

        {/* Transaction Details */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Amount Paid:</span>
            <span className="text-2xl font-bold text-gray-900">₹{product.amount / 100}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Transaction ID:</span>
            <code className="text-sm bg-white px-3 py-1 rounded font-mono text-indigo-600">{txnId.slice(0, 16)}...</code>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Status:</span>
            <span className="inline-flex items-center gap-2 bg-green-100 text-green-800 text-sm font-bold px-3 py-1 rounded-full">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              Completed
            </span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <a 
            href="/dashboard" 
            className="flex-1 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
            Go to Dashboard
          </a>
          <a 
            href="/transactions" 
            className="flex-1 px-8 py-4 bg-white border-2 border-gray-300 hover:border-green-500 text-gray-700 hover:text-green-700 font-semibold rounded-xl shadow hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
            View Transactions
          </a>
        </div>
      </div>

      {/* Confetti Effect */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 text-4xl animate-float" style={{ animationDelay: '0s' }}>🎉</div>
        <div className="absolute top-20 right-20 text-4xl animate-float" style={{ animationDelay: '0.5s' }}>🎊</div>
        <div className="absolute bottom-20 left-20 text-4xl animate-float" style={{ animationDelay: '1s' }}>✨</div>
        <div className="absolute bottom-10 right-10 text-4xl animate-float" style={{ animationDelay: '1.5s' }}>💎</div>
      </div>
    </div>
  );
}