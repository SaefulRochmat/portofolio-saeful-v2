import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export default async function EditProfilePage() {
    const supabase = await createClient()

    // Verify user session
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
        redirect('/login')
    }
    return (
        <h1>Edit Profile Page</h1>
    )
}