"use server";
import prisma from "@/lib/db.config";
import { revalidateTag, revalidatePath } from "next/cache";

export async function minusCoins (user_id: number | string) : Promise<void> {
    await prisma.user.update({
        where: { id: Number(user_id) },
        data: {
            coins: {
                decrement: 10,
            }
        }
    });
    // Revalidate cache to show updated coins immediately
    revalidatePath("/dashboard");
}

export async function addCoins (user_id: number | string, coins :number) : Promise<void> {
    await prisma.user.update({
        where: { id: Number(user_id) },
        data: {
            coins: {
                increment: coins,
            }
        }
    });
    // Pages are already force-dynamic, so they will fetch fresh data automatically
}

export async function coinsSpend (user_id :string | number , summary_id : string) : Promise<void> {
    await prisma.coinSpend.create({
        data: {
            user_id: Number(user_id),
            summary_id: summary_id,
        }
    });
    // Revalidate coins-spend page to show new entry
    revalidatePath("/coins-spend");
}

export async function updateSummary (data:string ,id : string) : Promise<void> {
    await prisma.summary.update({
        data: {
            response: data,
        },
        where: { 
            id: id
        },

    });
    // Revalidate cache to show new summary on dashboard
    revalidatePath("/dashboard");
}

export async function clearCache(key: string) {
  revalidatePath(key);
}
