import { getSummary, getUserCoins } from '@/actions/fetchActions';
import DashNav from '@/components/dashboard/DashNav';
import { notFound } from 'next/navigation'
import React from 'react'
import { authOptions, CustomSession } from '../api/auth/[...nextauth]/options';
import { getServerSession } from 'next-auth';
import SummaryBase from '@/components/summary/SummaryBase';

export default async function Summarize({searchParams}: {searchParams: Promise<{[key:string]:string | undefined}>}) {

    const params = await searchParams;
    
    if(!params?.["id"]){
        return notFound();
    }
    const summary: SummaryType | null = await getSummary(params?.["id"]!);

    if(!summary){
        return notFound();
    }

    const session: CustomSession | null = await getServerSession(authOptions);
    const userCoins = await getUserCoins(session?.user?.id!);



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-purple-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      <DashNav user={session?.user!} userCoins={userCoins} />
      <div className="container mx-auto px-4 md:px-8 lg:px-12 py-8">
        <SummaryBase summary={summary} />
      </div>
    </div>
  )
}
