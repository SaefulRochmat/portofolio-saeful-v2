// src/hooks/usePublicExperience.ts

import useSWR from 'swr';
import type { Experience } from '@/app/api/experience/typeExperience';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  
  if (res.status === 404) {
    return null;
  }
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to fetch data');
  }
  
  return res.json();
};

// ===== Public Experience Hook =====
export function usePublicExperience(profileId?: string) {
  const url = profileId 
    ? `/api/experience/public?profile_id=${profileId}`
    : '/api/experience/public';

  const { data, error, mutate } = useSWR<Experience[]>(url, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  });

  return {
    experiences: data || [],
    isLoading: !error && data === undefined,
    isError: error,
    mutate,
  };
}