'use client';

import { SessionProvider } from './SessionProvider';
import { SWRProvider } from './SWRProvider';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SWRProvider>
        <>{children}</>
      </SWRProvider>
    </SessionProvider>
  );
}
