import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getCoinsFromAmount = (amount: number): number => {
  // Amount is stored in paise (1 rupee = 100 paise)
  // Convert to rupees and return corresponding coins
  switch (amount) {
    case 10000: // ₹100 in paise
      return 100; // 100 coins
    case 50000: // ₹500 in paise
      return 510; // 500 + 10 bonus coins
    case 100000: // ₹1000 in paise
      return 1020; // 1000 + 20 bonus coins
    default:
      // Fallback: 1 coin per rupee
      return Math.floor(amount / 100);
  }
};
