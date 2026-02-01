'use client';

import { SWRConfig } from 'swr';

export function SWRProvider({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        revalidateOnFocus: false,
        dedupingInterval: 60 * 1000,
        fetcher: (url: string) => fetch(url, { credentials: 'include' }).then((res) => {
          if (!res.ok) throw new Error('Fetch failed');
          return res.json();
        }),
      }}
    >
      {children}
    </SWRConfig>
  );
}
