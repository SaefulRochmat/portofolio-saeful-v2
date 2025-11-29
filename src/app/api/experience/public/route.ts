// src/app/api/experience/public/route.ts

import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import type { Experience } from '../typeExperience';

// GET /api/experience/public - Returns ALL experience (for single-user portfolio)
export async function GET(request: Request): Promise<NextResponse> {
  try {
    const supabase = await createClient();

    console.log('🔍 Fetching all experience records');

    // ✅ SIMPLE: Return ALL experience, no filter (for single-user portfolio)
    const { data, error } = await supabase
      .from("experience")
      .select("*")
      .order("start_date", { ascending: false });

    if (error) {
      console.error('❌ Error fetching experience:', error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.log('✅ Experience data fetched:', data?.length || 0, 'records');
    
    return NextResponse.json<Experience[]>(data || []);
  } catch (err) {
    console.error('❌ Server error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ===== ALTERNATIVE: With profile_id filter (for multi-user) =====
/*
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
    } else {
      // Get first profile if no profileId specified
      const { data: profile } = await supabase
        .from("profile")
        .select("id")
        .limit(1)
        .maybeSingle();

      if (profile) {
        query = query.or(`profile_id.eq.${profile.id},profile_id.is.null`);
      }
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json<Experience[]>(data || []);
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
*/