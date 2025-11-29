import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ExperienceManager from "@/app/dashboard/experience/components/ExperienceManager";

export default async function ExperiencePage() {
    const supabase = await createClient();

    // Verify user session
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
        redirect('/login');
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <ExperienceManager profileId={user.id} />
        </div>
    );
}