import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get a user's display name from their Privy user object
 * Tries different auth methods in order of preference
 */
export function getUserDisplayName(user: any): string {
  if (!user) return 'Guest';

  // Try to get name from Google
  if (user.google?.name) {
    return user.google.name;
  }

  // Try to get name from GitHub
  if (user.github?.username) {
    return user.github.username;
  }

  // Try to get name from email
  if (user.email?.address) {
    // Return the part before @ in the email
    return user.email.address.split('@')[0];
  }

  // Try to get a shortened wallet address
  if (user.wallet?.address) {
    const addr = user.wallet.address;
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  }

  // Fallback to user ID if available
  if (user.id) {
    return `User ${user.id.substring(0, 8)}`;
  }

  // Final fallback
  return 'Authenticated User';
}
