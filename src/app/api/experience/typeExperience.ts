// Interface for api/experience
export interface Experience {
  id?: string;
  position: string;
  company: string;
  start_date: string; // YYYY-MM-DD
  end_date?: string; // nullable
  description?: string;
  created_at?: string;
}
