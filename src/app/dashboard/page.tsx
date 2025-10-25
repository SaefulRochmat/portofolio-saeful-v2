// src/app/dashboard/page.tsx
import LoginButton from "@/components/LoginLogoutButton";
import UserGreetText from "@/components/UserGreetText";
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
            <h1> Halaman Dashboard</h1>
            <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
                <UserGreetText />
                <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-linear-to-t from-white via-white dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none">
                <LoginButton />
                </div>
            </div>
        </>
    );
}