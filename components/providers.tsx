'use client';

import { PrivyProvider } from '@privy-io/react-auth';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ''}
      config={{
        loginMethods: ['email', 'google', 'github'],
        appearance: {
          theme: 'light',
          accentColor: '#3B82F6',
          logo: '/logo.png',
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
} 