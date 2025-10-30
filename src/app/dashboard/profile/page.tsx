import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import DataProfile from "./components/ProfileForm";


export default async function ProfilePage() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/profile`, {
        cache: "no-store",
    });
    const data = await res.json();
    if (!data) {
        console.log("⚠️ Tidak ada data profil ditemukan, gunakan default kosong.");
    }

    const supabase = await createClient()

    // Verify user session
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
        redirect('/login')
    }
    return (
    <div className="min-h-screen bg-gray-50 py-10">
      <DataProfile />
    </div>
    );
}