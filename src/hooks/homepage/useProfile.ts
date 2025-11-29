// src/hooks/usePublicProfile.ts

import useSWR from 'swr';
import type { Profile } from '@/app/api/profile/typeProfile';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  
  if (res.status === 404) {
    return null;
  }
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to fetch profile');
  }
  
  return res.json();
};

interface UsePublicProfileOptions {
  profileId?: string;
}

interface UsePublicProfileReturn {
  profile: Profile | null | undefined;
  isLoading: boolean;
  isError: Error | undefined;
  mutate: () => void;
}

export function usePublicProfile(options?: UsePublicProfileOptions): UsePublicProfileReturn {
  const { profileId } = options || {};
  
  // Build URL with optional profile ID
  const url = profileId 
    ? `/api/profile/public?id=${profileId}`
    : '/api/profile/public';

  const { data, error, mutate } = useSWR<Profile | null>(
    url,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
      dedupingInterval: 60000, // Cache for 1 minute
    }
  );

  return {
    profile: data,
    isLoading: !error && data === undefined,
    isError: error,
    mutate,
  };
}