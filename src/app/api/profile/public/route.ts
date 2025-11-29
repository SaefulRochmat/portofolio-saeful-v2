// src/app/api/profile/public/route.ts

import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import type { Profile } from "../typeProfile";

// GET /api/profile/public?id=xxx or /api/profile/public (get first/default)
export async function GET(request: Request): Promise<NextResponse> {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const profileId = searchParams.get('id');

    let query = supabase
      .from("profile")
      .select("*");

    if (profileId) {
      // Get specific profile by ID
      query = query.eq('id', profileId);
    } else {
      // Get first profile (for single-user portfolio)
      query = query.limit(1);
    }

    const { data, error } = await supabase
      .from("profile")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('❌ Error fetching public profile:', error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json<Profile>(data);
  } catch (err) {
    console.error('❌ Server error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ===== ALTERNATIVE: Dengan username/slug =====
// Kalau lu mau pake username: /api/profile/public?username=johndoe
/*
export async function GET(request: Request): Promise<NextResponse> {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
      // Return first profile as default
      const { data, error } = await supabase
        .from("profile")
        .select("*")
        .limit(1)
        .single();

      if (error || !data) {
        return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
      }

      return NextResponse.json<Profile>(data);
    }

    // Get profile by username (assuming you have username field)
    const { data, error } = await supabase
      .from("profile")
      .select("*")
      .eq('username', username)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json<Profile>(data);
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
*/