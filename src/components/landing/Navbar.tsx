"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import LoginModal from "../auth/LoginModal";
import { CustomUser } from "@/app/api/auth/[...nextauth]/options";
import Link from "next/link";

export default function Navbar({ user }: { user?: CustomUser }) {
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg"
          : "bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex justify-between items-center px-8 md:px-16 lg:px-24 xl:px-32 py-4">
        {/* Logo */}
        <Link 
          href="/" 
          className="flex items-center space-x-3 group cursor-pointer"
        >
          <div className="relative transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
            <Image 
              src={isDark ? "/images/icon_194.png" : "/images/icon_192.png"}
              width={60} 
              height={60} 
              alt="TubeBrief AI Logo"
              className="rounded-lg shadow-md"
            />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              TubeBrief AI
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 hidden md:block">Summarize YouTube Podcasts</p>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-2 md:space-x-4">
          <Button
            variant="ghost"
            onClick={() => scrollToSection("pricing")}
            className="hidden md:inline-flex font-semibold hover:bg-indigo-50 dark:hover:bg-gray-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors dark:text-gray-300"
          >
             Pricing
          </Button>

          {/* Theme Toggle Button */}
          <Button
            variant="ghost"
            onClick={toggleTheme}
            className="w-10 h-10 p-0 rounded-full hover:bg-indigo-50 dark:hover:bg-gray-800 transition-all duration-300"
            aria-label="Toggle theme"
          >
            {isDark ? (
              <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd"/>
              </svg>
            ) : (
              <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
              </svg>
            )}
          </Button>

          {user ? (
            <Link href="/dashboard">
              <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                <span className="hidden md:inline"> Dashboard</span>
                <span className="md:hidden">Dashboard</span>
              </Button>
            </Link>
          ) : (
            <LoginModal />
          )}
        </div>
      </div>
    </nav>
  );
}