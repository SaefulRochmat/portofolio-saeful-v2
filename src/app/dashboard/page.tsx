import { createClient } from "@/utils/supabase/server"; // util server supabase
import { redirect } from "next/navigation";

export default async function Dashboard () {
    const supabase =  await createClient();

    // cek user login
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login"); // kalau belum login, tendang ke /login
    }
    return (
        <h1> Halaman Dashboard</h1>
    );
}