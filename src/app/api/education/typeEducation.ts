// Interface for Education entity
export interface Education {
  id?: string;
  institution: string;
  degree: string;
  field_of_study: string;
  start_date: string; // YYYY-MM-DD
  end_date?: string; // Nullable, kalo masih kuliah bisa kosong
  description?: string;
  created_at?: string;
}
