// src/app/api/profile/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server"; // PENTING: Gunakan server client!
import type { Profile } from "./typeProfile";

// Handler for GET requests to /api/profile
export async function GET(): Promise<NextResponse> {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from("profile")
      .select("*")
      .limit(1)
      .maybeSingle(); // Gunakan maybeSingle() untuk menghindari error jika tidak ada data

    if (error) {
      console.error('❌ Error fetching profile:', error.message);
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

// Handler for PUT requests to /api/profile
export async function PUT(request: Request): Promise<NextResponse> {
  try {
    const body: Partial<Profile> = await request.json();

    if (!body.id) {
      return NextResponse.json({ error: "Profile ID is required" }, { status: 400 });
    }

    console.log("🔄 Updating profile with ID:", body.id);

    const supabase = await createClient();

    // Cek dulu apakah profile dengan id tersebut ada
    const { data: existingProfile, error: checkError } = await supabase
      .from("profile")
      .select("id")
      .eq("id", body.id)
      .maybeSingle();

    if (checkError) {
      console.error('❌ Error checking profile:', checkError.message);
      return NextResponse.json({ error: checkError.message }, { status: 400 });
    }

    if (!existingProfile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Update profile
    const { data, error } = await supabase
      .from("profile")
      .update({
        name: body.name,
        headline: body.headline,
        bio: body.bio,
        email: body.email,
        phone: body.phone,
        location: body.location,
        profile_image: body.profile_image,
        social_links: body.social_links,
        updated_at: new Date().toISOString(),
      })
      .eq("id", body.id)
      .select()
      .single();

    if (error) {
      console.error('❌ Error updating profile:', error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.log('✅ Profile updated successfully:', data.id);
    return NextResponse.json<Profile>(data);

  } catch (err) {
    console.error('❌ Server error:', err);
    return NextResponse.json({ error: "Invalid Request Body" }, { status: 400 });
  }
}

// Handler for POST requests to /api/profile
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body: Partial<Profile> = await request.json();

    // Basic validation
    if (!body.name) {
      return NextResponse.json({ error: 'Profile name is required' }, { status: 400 });
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('profile')
      .insert([{
        name: body.name,
        headline: body.headline,
        bio: body.bio,
        email: body.email,
        phone: body.phone,
        location: body.location,
        profile_image: body.profile_image,
        social_links: body.social_links,
      }])
      .select()
      .single();

    if (error) {
      console.error('❌ Error creating profile:', error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.log('✅ Profile created successfully:', data.id);
    return NextResponse.json<Profile>(data, { status: 201 });

  } catch (err) {
    console.error('❌ Server error:', err);
    return NextResponse.json({ error: 'Invalid Request Body' }, { status: 400 });
  }
}