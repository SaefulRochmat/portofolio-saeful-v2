// src/app/api/experience/route.ts

import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import type { Experience } from "./typeExperience";

// GET /api/experience - Get all experiences or filter by profile_id
export async function GET(request: Request): Promise<NextResponse> {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const profileId = searchParams.get('profile_id');

    let query = supabase
      .from("experience")
      .select("*")
      .order("start_date", { ascending: false });

    if (profileId) {
      query = query.eq('profile_id', profileId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('❌ Error fetching experiences:', error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json<Experience[]>(data || []);
  } catch (err) {
    console.error('❌ Server error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/experience - Create new experience
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const supabase = await createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Validation
    if (!body.position || !body.company || !body.start_date) {
      return NextResponse.json(
        { error: 'position, company, and start_date are required' },
        { status: 400 }
      );
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(body.start_date)) {
      return NextResponse.json(
        { error: 'start_date must be in YYYY-MM-DD format' },
        { status: 400 }
      );
    }

    if (body.end_date && !dateRegex.test(body.end_date)) {
      return NextResponse.json(
        { error: 'end_date must be in YYYY-MM-DD format' },
        { status: 400 }
      );
    }

    // Build insert data
    const insertData: any = {
      profile_id: user.id,  // ✅ Use authenticated user ID
      position: body.position,
      company: body.company,
      start_date: body.start_date,
      location: body.location || null,
      description: body.description || null
    };

    // Only add end_date if provided
    if (body.end_date && body.end_date.trim() !== '') {
      insertData.end_date = body.end_date;
    }

    const { data, error } = await supabase
      .from("experience")
      .insert([insertData])
      .select()
      .single();

    if (error) {
      console.error('❌ Error creating experience:', error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.log('✅ Experience created:', data.id);
    return NextResponse.json<Experience>(data, { status: 201 });
  } catch (err) {
    console.error('❌ Server error:', err);
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

// PUT /api/experience - Update experience (ID via query params)
export async function PUT(request: Request): Promise<NextResponse> {
  try {
    const supabase = await createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Experience ID is required in query params' },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Validate dates if provided
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (body.start_date && !dateRegex.test(body.start_date)) {
      return NextResponse.json(
        { error: 'start_date must be in YYYY-MM-DD format' },
        { status: 400 }
      );
    }

    if (body.end_date && body.end_date.trim() !== '' && !dateRegex.test(body.end_date)) {
      return NextResponse.json(
        { error: 'end_date must be in YYYY-MM-DD format' },
        { status: 400 }
      );
    }

    // Build update data
    const updateData: any = {};
    if (body.position !== undefined && body.position) updateData.position = body.position;
    if (body.company !== undefined && body.company) updateData.company = body.company;
    if (body.start_date !== undefined && body.start_date) updateData.start_date = body.start_date;
    if (body.location !== undefined) {
      updateData.location = body.location && body.location.trim() ? body.location : null;
    }
    if (body.description !== undefined) {
      updateData.description = body.description && body.description.trim() ? body.description : null;
    }
    
    // Handle end_date (allow setting to null for "Present")
    if (body.end_date !== undefined) {
      // Handle null, empty string, or valid date
      updateData.end_date = (!body.end_date || body.end_date.trim() === '') ? null : body.end_date;
    }

    // Update only user's own experience
    const { data, error } = await supabase
      .from("experience")
      .update(updateData)
      .eq("id", id)
      .eq("profile_id", user.id)  // ✅ Security: only update own experiences
      .select()
      .maybeSingle();

    if (error) {
      console.error('❌ Error updating experience:', error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Experience not found or unauthorized' },
        { status: 404 }
      );
    }

    console.log('✅ Experience updated:', data.id);
    return NextResponse.json<Experience>(data);
  } catch (err) {
    console.error('❌ Server error:', err);
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

// DELETE /api/experience - Delete experience (ID via query params)
export async function DELETE(request: Request): Promise<NextResponse> {
  try {
    const supabase = await createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Experience ID is required in query params' },
        { status: 400 }
      );
    }

    // Delete only user's own experience
    const { error } = await supabase
      .from("experience")
      .delete()
      .eq("id", id)
      .eq("profile_id", user.id);  // ✅ Security: only delete own experiences

    if (error) {
      console.error('❌ Error deleting experience:', error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.log('✅ Experience deleted:', id);
    return NextResponse.json({ 
      message: 'Experience deleted successfully',
      id 
    });
  } catch (err) {
    console.error('❌ Server error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}