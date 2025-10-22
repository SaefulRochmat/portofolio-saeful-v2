
// For defining the structure of a user profile data
export interface Profile {
      id: string
        name: string
        headline?: string
        bio?: string
        email?: string
        phone?: string
        location?: string
        profile_image?: string
        social_links?: Record<string, string> // { github: "...", linkedin: "..." }
        created_at?: string
        updated_at?: string
}