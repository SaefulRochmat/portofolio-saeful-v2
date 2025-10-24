// app/auth/callback/route.js
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    
    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error("Exchange error:", error);
        return NextResponse.redirect(
          new URL(`/login?error=${encodeURIComponent(error.message)}`, request.url)
        );
      }

      return NextResponse.redirect(new URL("/dashboard", request.url));
      
    } catch (error) {
      console.error("Unexpected error:", error);
      return NextResponse.redirect(
        new URL("/login?error=unexpected_error", request.url)
      );
    }
  }

  return NextResponse.redirect(new URL("/login", request.url));
}