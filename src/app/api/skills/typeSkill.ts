// interface for Skills
export interface Skill {
    id: string;
    profile_id: string;
    name: string;
    level?: 'beginner' | 'intermediate' | 'expert';
    category?: string;
    icon_url?: string;
    created_at?: string;
}