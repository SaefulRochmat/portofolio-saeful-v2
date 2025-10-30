// Interface for Education entity
export interface Education {
  id?: string;
  institution: string;
  degree: string;
  field_of_study: string;
  start_year: string; // YYYY-MM-DD
  end_year?: string; // Nullable, kalo masih kuliah bisa kosong
  description?: string;
  created_at?: string;
}
