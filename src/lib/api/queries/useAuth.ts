import useSWR from 'swr';

export function useAuthStatus() {
  return useSWR('/api/googleDrive/auth/status', async (url: string) => {
    const response = await fetch(url, { credentials: 'include' });
    if (!response.ok) return { connected: false, user: null };
    return response.json();
  }, {
    dedupingInterval: 5 * 60 * 1000,
    revalidateOnFocus: false,
  });
}
