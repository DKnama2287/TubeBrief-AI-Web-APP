"use server";
import {prisma} from "@/lib/db.config";

import { unstable_cache } from "next/cache";

export const getUserOldSummaries = unstable_cache(
  async (id: number) => {
    return await prisma.summary.findMany({
      where: {
        user_id: id,
      },
      select: {
        id: true,
        url: true,
        created_at: true,
        title: true,
        user_id: true,
        response: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });
  },
  ["oldSummaries"],
  { revalidate: 60 * 60, tags: ["oldSummaries"] }
);

// Get user coins - no cache for instant updates
export const getUserCoins = async (user_id: number | string) => {
  return await prisma.user.findUnique({
    where: { id: Number(user_id) },
    select: { coins: true },
  });
};

// Get coins spend history - no cache for instant updates
export const getCoinsSpend = async (user_id: number | string) => {
  return await prisma.coinSpend.findMany({
    where: {
      user_id: Number(user_id),
    },
    include: {
      summary: {
        select: {
          id: true,
          url: true,
          title: true,
        },
      },
    },
    orderBy: {
      id: "desc",
    },
  });
};

// export const getUserCoins = async (user_id: number | string) => {
//   const user = await prisma.user.findUnique({
//     where: { id: Number(user_id) },
//     select: { coins: true },
//   });
//   return user ? { coins: user.coins } : null;
// }

export const getSummary = async ( id : string) =>{
  const summary = await prisma.summary.findUnique({
    where: { id: id },
  });
  return summary;
}

// Get transactions - no cache for instant updates
export const getTransactions = async (user_id: number | string) => {
  return await prisma.transaction.findMany({
    where: {
      user_id: Number(user_id),
    },
    orderBy: {
      created_at: "desc",
    },
  });
};