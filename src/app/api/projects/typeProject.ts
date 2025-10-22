// Interface for api/projects
export interface Project {
    id: string;
    profile_id: string;
    title: string;
    description?: string;
    technologies?: string[];
    repo_url?: string;
    live_url?: string;
    thumbnail_url?: string;
    start_date?: string;
    end_date?: string;
    created_at?: string;
}