import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import DataProfile from "./components/GetDataProfile";


export default async function ProfilePage() {
    const supabase = await createClient()

    // Verify user session
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
        redirect('/login')
    }
    return (
        <>
            <DataProfile />
        </>
    );
}