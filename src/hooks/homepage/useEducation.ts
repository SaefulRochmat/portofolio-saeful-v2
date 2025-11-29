// src/hooks/usePublicData.ts

import useSWR from 'swr';
import type { Education } from '@/app/api/education/typeEducation';

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

// ===== Public Education Hook =====
export function usePublicEducation(profileId?: string) {
  const url = profileId 
    ? `/api/education/public?profile_id=${profileId}`
    : '/api/education/public';

  const { data, error, mutate } = useSWR<Education[]>(url, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  });

  return {
    education: data || [],
    isLoading: !error && data === undefined,
    isError: error,
    mutate,
  };
}