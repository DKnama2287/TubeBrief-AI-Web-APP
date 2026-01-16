"use client";
import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";

export default function HeroSection() {
  return (
    <header className="relative py-32 md:py-40 text-center overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-4 py-18">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold mb-8 animate-fadeInUp shadow-lg">
          <span className="animate-pulse">✨</span>
          AI-Powered Podcast Summaries
          <span className="animate-pulse">✨</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
          <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Summarize Any
          </span>
          <br />
          <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Podcast Instantly
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-10 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
          Use cutting-edge AI to get concise summaries and extract top questions from your favorite podcasts in seconds.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
          <Link href="/dashboard">
            <Button 
              size="lg"
              className="px-8 py-6 text-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
            >
              Try it Now - It's Free! 🚀
            </Button>
          </Link>
          <Button 
            size="lg"
            variant="outline"
            onClick={() => {
              const pricingSection = document.getElementById('pricing');
              if (pricingSection) {
                pricingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
            className="px-8 py-6 text-lg border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            View Pricing 💎
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all duration-200">
            <div className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
              10K+
            </div>
            <div className="text-gray-600 font-medium">Summaries Generated</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all duration-200">
            <div className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              5K+
            </div>
            <div className="text-gray-600 font-medium">Happy Users</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all duration-200">
            <div className="text-4xl font-extrabold bg-gradient-to-r from-pink-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              99.9%
            </div>
            <div className="text-gray-600 font-medium">Accuracy Rate</div>
          </div>
        </div>
      </div>
    </header>
  );
}