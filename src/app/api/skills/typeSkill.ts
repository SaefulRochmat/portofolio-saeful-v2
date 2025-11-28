// src/types/skill.ts

export type SkillLevel = 'beginner' | 'intermediate' | 'expert';

export interface Skill {
    id: string;
    profile_id: string;
    name: string;
    level?: SkillLevel | null;
    category?: string | null;
    icon_url?: string | null;
    created_at?: string;
}

export interface CreateSkillDTO {
    profile_id: string;
    name: string;
    level?: SkillLevel;
    category?: string;
    icon_url?: string;
}

export interface UpdateSkillDTO {
    name?: string;
    level?: SkillLevel;
    category?: string;
    icon_url?: string;
}

export interface SkillsAPIResponse {
    data?: Skill[];
    error?: string;
}