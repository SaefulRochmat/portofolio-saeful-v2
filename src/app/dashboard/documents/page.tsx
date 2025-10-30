import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import DocumentsForm from "./components/DocumentForm";

export default async function DocumentsPage() {
    const supabase = await createClient()

    // Verify user session
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
        redirect('/login')
    }
    return (
        <>
            <DocumentsForm/>
        </>
    );
}