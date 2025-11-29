// src/app/api/profile/route.ts

import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import type { Profile } from "./typeProfile";

// GET /api/profile - Get current user's profile
export async function GET(): Promise<NextResponse> {
  try {
    const supabase = await createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get profile by user ID
    const { data, error } = await supabase
      .from("profile")
      .select("*")
      .eq('id', user.id)  // ✅ Filter by authenticated user ID
      .maybeSingle();      // Use maybeSingle() instead of single()

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

// PUT /api/profile - Update current user's profile
export async function PUT(request: Request): Promise<NextResponse> {
  try {
    const supabase = await createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: Partial<Profile> = await request.json();

    console.log("🔄 Updating profile for user:", user.id);

    // Build update object - only include fields that are provided
    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (body.name !== undefined) updateData.name = body.name;
    if (body.headline !== undefined) updateData.headline = body.headline;
    if (body.bio !== undefined) updateData.bio = body.bio;
    if (body.email !== undefined) updateData.email = body.email;
    if (body.phone !== undefined) updateData.phone = body.phone;
    if (body.location !== undefined) updateData.location = body.location;
    if (body.profile_image !== undefined) updateData.profile_image = body.profile_image;
    if (body.social_links !== undefined) updateData.social_links = body.social_links;

    // Update profile using authenticated user ID (ignore body.id)
    const { data, error } = await supabase
      .from("profile")
      .update(updateData)
      .eq("id", user.id)  // ✅ Always use authenticated user ID
      .select()
      .maybeSingle();     // ✅ Use maybeSingle() instead of single()

    if (error) {
      console.error('❌ Error updating profile:', error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (!data) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    console.log('✅ Profile updated successfully:', data.id);
    return NextResponse.json<Profile>(data);

  } catch (err) {
    console.error('❌ Server error:', err);
    return NextResponse.json({ error: "Invalid Request Body" }, { status: 400 });
  }
}

// POST /api/profile - Create new profile
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const supabase = await createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: Partial<Profile> = await request.json();

    // Basic validation
    if (!body.name) {
      return NextResponse.json({ error: 'Profile name is required' }, { status: 400 });
    }

    // Check if profile already exists
    const { data: existingProfile } = await supabase
      .from('profile')
      .select('id')
      .eq('id', user.id)
      .maybeSingle();

    if (existingProfile) {
      return NextResponse.json(
        { error: 'Profile already exists. Use PUT to update.' }, 
        { status: 409 }
      );
    }

    // Create profile with authenticated user ID
    const { data, error } = await supabase
      .from('profile')
      .insert([{
        id: user.id,  // ✅ Use authenticated user ID
        name: body.name,
        headline: body.headline || null,
        bio: body.bio || null,
        email: body.email || user.email,  // Default to auth email
        phone: body.phone || null,
        location: body.location || null,
        profile_image: body.profile_image || null,
        social_links: body.social_links || null,
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

// DELETE /api/profile - Delete current user's profile
export async function DELETE(): Promise<NextResponse> {
  try {
    const supabase = await createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { error } = await supabase
      .from('profile')
      .delete()
      .eq('id', user.id);

    if (error) {
      console.error('❌ Error deleting profile:', error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: 'Profile deleted successfully' });
  } catch (err) {
    console.error('❌ Server error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}