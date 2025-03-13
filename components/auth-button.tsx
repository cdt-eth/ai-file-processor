'use client';

import { usePrivy } from '@privy-io/react-auth';
import { getUserDisplayName } from '@/lib/utils';

export function AuthButton() {
  const { login, logout, authenticated, user } = usePrivy();
  console.log("Authenticated:", authenticated);
  console.log("User:", user);
  if (!authenticated) {
    return (
      <button
        onClick={login}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
      >
        Sign In
      </button>
    );
  }

  const displayName = getUserDisplayName(user);

  return (
    <div className="flex items-center gap-4">
      <div className="text-sm font-medium">
        {displayName}
      </div>
      <button
        onClick={logout}
        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
      >
        Sign Out
      </button>
    </div>
  );
} 