// src/app/dashboard/page.tsx
import LoginButton from "@/components/LoginLogoutButton";
import UserGreetText from "@/components/UserGreetText";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

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
            </div>
            <div className="flex flex-col items-start gap-6 rounded-xl max-w-xl px-4 py-2 bg-sky-500 bg-linear-to-t via-yellow-200">
                <Link href="/dashboard/profile" className="transition duration-300 hover:scale-105 ease-in hover:text-white">Profile</Link>
                <Link href="/dashboard/documents"  className="transition duration-300 hover:scale-105 ease-in hover:text-white">Documents</Link>
                <Link href="/dashboard/experience"  className="transition duration-300 hover:scale-105 ease-in hover:text-white">Experience</Link>
                <Link href="/dashboard/education"  className="transition duration-300 hover:scale-105 ease-in hover:text-white">Education</Link>
                <Link href="/dashboard/projects"  className="transition duration-300 hover:scale-105 ease-in hover:text-white">Proyek</Link>
                <Link href="/dashboard/skills"  className="transition duration-300 hover:scale-105 ease-in hover:text-white">Skills</Link>

                <LoginButton />
            </div>
        </>
    );
}