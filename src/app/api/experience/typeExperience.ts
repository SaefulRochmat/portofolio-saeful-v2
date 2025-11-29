// src/types/experience.ts

export interface Experience {
  id?: string;
  profile_id?: string;
  position: string;
  company: string;
  location?: string | null;
  start_date: string; // YYYY-MM-DD
  end_date?: string | null; // nullable for current jobs
  description?: string | null;
  created_at?: string;
}

export interface CreateExperienceDTO {
  position: string;
  company: string;
  location?: string;
  start_date: string;
  end_date?: string | null;
  description?: string;
}

export interface UpdateExperienceDTO {
  position?: string;
  company?: string;
  location?: string;
  start_date?: string;
  end_date?: string | null;
  description?: string;
}