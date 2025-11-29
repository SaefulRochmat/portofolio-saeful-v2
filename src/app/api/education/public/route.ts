// src/app/api/education/public/route.ts

import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import type { Education } from '../typeEducation';

// GET /api/education/public - Returns ALL education (for single-user portfolio)
export async function GET(request: Request): Promise<NextResponse> {
  try {
    const supabase = await createClient();

    // ✅ SIMPLE: Just return ALL education, no filter
    const { data, error } = await supabase
      .from("education")
      .select("*")
      .order("start_year", { ascending: false });

    if (error) {
      console.error('❌ Error fetching education:', error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.log('✅ Education data fetched:', data?.length || 0, 'records');
    
    return NextResponse.json<Education[]>(data || []);
  } catch (err) {
    console.error('❌ Server error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}