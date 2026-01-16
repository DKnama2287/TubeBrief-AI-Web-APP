"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { CustomUser } from "@/app/api/auth/[...nextauth]/options";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";

export default function Pricing({ user }: { user?: CustomUser }) {
  const [loading, setLoading] = useState(false);

  const initiatePayment = async (plan: string) => {
    if (!user) {
      toast.error("Please login first.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post("/api/stripe/session", { plan: plan });
      if (data?.url) {
        // Redirect to Stripe Checkout using the URL
        window.location.href = data.url;
      } else if (data?.id) {
        // Fallback: construct Stripe checkout URL manually
        window.location.href = `https://checkout.stripe.com/pay/${data.id}`;
      }
    } catch (error) {
      setLoading(false);
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data?.message);
      } else {
        toast.error("Something went wrong.please try again!");
      }
    }
  };

  return (
    <section className="py-24 bg-gradient-to-b from-white via-indigo-50/30 to-white dark:from-gray-900 dark:via-indigo-950/30 dark:to-gray-900">
      <div className="container mx-auto px-4">
        {/* Header with animation */}
        <div className="text-center mb-16 animate-fadeInUp">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-2xl text-indigo-600 dark:text-indigo-400 font-bold mb-2">
            1 coin = 1 ₹
          </p>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Choose the perfect plan for your needs. All plans include AI-powered insights and top questions highlight.
          </p>
        </div>

        {/* Pricing Cards with stagger animation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Starter Plan */}
          <Card className="shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-indigo-200 dark:hover:border-indigo-800 animate-fadeInUp bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm" style={{ animationDelay: '0.1s' }}>
            <CardHeader className="pb-8">
              <div className="flex justify-between items-start mb-4">
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">Starter</CardTitle>
                <span className="text-3xl">🚀</span>
              </div>
              <p className="text-sm text-muted-foreground dark:text-gray-400">
                Perfect for individuals getting started.
              </p>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="flex items-baseline mb-2">
                  <span className="text-5xl font-extrabold text-gray-900 dark:text-gray-100">100</span>
                  <span className="text-gray-500 dark:text-gray-400 ml-2">coins</span>
                </div>
                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">₹100</p>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="dark:text-gray-300">10 Podcast Summaries</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="dark:text-gray-300">Top Questions Highlight</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="dark:text-gray-300">AI-Powered Insights</span>
                </li>
              </ul>
              <Button
                className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold py-6 text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                onClick={() => initiatePayment("Starter")}
                disabled={loading}
              >
                {loading ? "Processing..." : "Get Started"}
              </Button>
            </CardContent>
          </Card>

          {/* Pro Plan - Popular */}
          <Card className="shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-3 border-4 border-indigo-500 dark:border-indigo-600 relative animate-fadeInUp bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm" style={{ animationDelay: '0.2s' }}>
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                🔥 MOST POPULAR
              </span>
            </div>
            <CardHeader className="pb-8 pt-8">
              <div className="flex justify-between items-start mb-4">
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">Pro</CardTitle>
                <span className="text-3xl">💎</span>
              </div>
              <p className="text-sm text-muted-foreground dark:text-gray-400">
                Best for professionals and content creators.
              </p>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="flex items-baseline mb-2">
                  <span className="text-5xl font-extrabold text-gray-900 dark:text-gray-100">510</span>
                  <span className="text-gray-500 dark:text-gray-400 ml-2">coins</span>
                </div>
                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">₹500</p>
                <p className="text-sm text-green-600 dark:text-green-400 font-semibold mt-1">Save 10 coins! 🎉</p>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="dark:text-gray-300">51 Podcast Summaries</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="dark:text-gray-300">Top Questions Highlight</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="dark:text-gray-300">AI-Powered Insights</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="font-semibold dark:text-gray-200">Priority Support</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">One Free Summary 🎁</span>
                </li>
              </ul>
              <Button
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-6 text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
                onClick={() => initiatePayment("Pro")}
                disabled={loading}
              >
                {loading ? "Processing..." : "Upgrade to Pro"}
              </Button>
            </CardContent>
          </Card>

          {/* Pro Plus Plan */}
          <Card className="shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-purple-200 dark:hover:border-purple-800 animate-fadeInUp bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm" style={{ animationDelay: '0.3s' }}>
            <CardHeader className="pb-8">
              <div className="flex justify-between items-start mb-4">
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">Pro Plus</CardTitle>
                <span className="text-3xl">👑</span>
              </div>
              <p className="text-sm text-muted-foreground dark:text-gray-400">
                Ideal for teams and power users.
              </p>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="flex items-baseline mb-2">
                  <span className="text-5xl font-extrabold text-gray-900 dark:text-gray-100">1020</span>
                  <span className="text-gray-500 dark:text-gray-400 ml-2">coins</span>
                </div>
                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">₹1000</p>
                <p className="text-sm text-green-600 dark:text-green-400 font-semibold mt-1">Save 20 coins! 🎉</p>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="dark:text-gray-300">102 Podcast Summaries</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="dark:text-gray-300">Top Questions Highlight</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="dark:text-gray-300">AI-Powered Insights</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="font-semibold dark:text-gray-200">Dedicated Support</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">Two Free Summaries 🎁</span>
                </li>
              </ul>
              <Button
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-6 text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                onClick={() => initiatePayment("Pro Plus")}
                disabled={loading}
              >
                {loading ? "Processing..." : "Go Pro Plus"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Trust badges */}
        <div className="mt-16 text-center animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Trusted by thousands of content creators</p>
          <div className="flex justify-center items-center gap-8 flex-wrap">
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span>Instant Delivery</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}