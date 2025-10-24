'use client'
import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
    const handleGoogleLogin = async () => {
        const supabase = createClient();
        
        const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: `${window.location.origin}/auth/callback`,
        },
        });
        
        if (error) {
        console.error("Login error:", error.message);
        }
    };
  return (
    <main className="flex flex-1 justify-center items-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-80 md:w-96 flex flex-col items-center text-center space-y-6">
            <button 
            onClick={handleGoogleLogin}
            className="flex items-center gap-3 bg-blue-500 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:bg-blue-600 transition-colors">
                Login With Gulugulu
            </button>
        </div>
    </main>
  )
}