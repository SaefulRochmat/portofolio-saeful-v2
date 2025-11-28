import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ProjectsWraper from "./components/WrapProjects";

export default async function ProjectsPage () {
    const supabase = await createClient()

    // Verify user session
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
        redirect('/login')
    }

    return (
        <ProjectsWraper/>
    )
}