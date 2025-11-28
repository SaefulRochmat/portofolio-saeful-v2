
// src/app/dashboard/skills/page.tsx

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import SkillsManager from "@/app/dashboard/skills/components/FormSkills";

export default async function SkillsPage() {
    const supabase = await createClient();

    // Verify user session
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
        redirect('/login');
    }

    // ✅ INI DIA - profileId itu user.id dari authenticated user
    return (
        <div className="container mx-auto">
            <SkillsManager profileId={user.id} />
        </div>
    );
}