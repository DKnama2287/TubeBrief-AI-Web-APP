import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/providers/SessionProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TubeBrief AI",
  description: "Youtube Summarize APP",
  icons: {
    icon: [
      { url: "/images/icon_194.png", sizes: "32x32", type: "image/png" },
      { url: "/images/icon_194.png", sizes: "192x192", type: "image/png" },
    ],
    apple: { url: "/images/icon_194.png", sizes: "180x180", type: "image/png" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <SessionProvider>{children}</SessionProvider>
          <Toaster richColors duration={5000} />
        </ThemeProvider>
      </body>
    </html>
  );
}
