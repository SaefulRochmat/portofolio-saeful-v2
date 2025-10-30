import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import EducationForm from "./components/EducationForm";

export default async function EducationPage () {
    const supabase = await createClient()

    // Verify user session
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
        redirect('/login')
    }
    return (
        <main>
            <EducationForm/>
        </main>
    );
} 