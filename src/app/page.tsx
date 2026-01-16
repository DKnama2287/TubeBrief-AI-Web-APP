import Footer from '@/components/landing/Footer'
import HeroSection from '@/components/landing/HeroSection'
import Navbar from '@/components/landing/Navbar'
import Pricing from '@/components/landing/pricing'
import React from 'react'
import { authOptions, CustomSession } from './api/auth/[...nextauth]/options'
import { getServerSession } from 'next-auth'

export default async function page() {

  const session:CustomSession | null = await getServerSession(authOptions)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Navbar user={session?.user} />
      <main>
        <section id="home">
          <HeroSection />
        </section>
        <section id="pricing">
          <Pricing user={session?.user} />
        </section>
      </main>
      <Footer />
    </div>
  )
}
