import { useSWRConfig } from 'swr';
import { useCallback, useState } from 'react';

export function useLogout() {
  const { cache, mutate } = useSWRConfig();
  const [isLoading, setIsLoading] = useState(false);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/googleDrive/auth/logout', {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Logout failed');
      const data = await response.json();

      // Clear all SWR cache
      if (cache instanceof Map) {
        cache.clear();
      }
      await mutate(() => true, undefined, { revalidate: false });

      return data;
    } finally {
      setIsLoading(false);
    }
  }, [cache, mutate]);

  return { logout, isLoading };
}
