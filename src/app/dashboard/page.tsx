// src/app/dashboard/page.tsx

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";


export default async function Dashboard () {
    const supabase = await createClient()

    // Verify user session
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
        redirect('/login')
    }
 
    return (
        <>
            <div className="z-10 w-full max-w-5xl items-center font-mono text-sm lg:flex">
                <h1>Dashbard</h1>
            </div>
        </>
    );
}