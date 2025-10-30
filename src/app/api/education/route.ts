//src/app/api/education/route.ts

import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import type { Education } from './typeEducation';

// === GET All Education ===
export async function GET() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("education")
    .select("*")
    .order("start_year", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json(data);
}

// === POST (Create Education Record) ===
export async function POST(req: Request) {
  const supabase = createClient()
  const body: Education = await req.json();

  console.log("Received body:", body); // Tambahkan ini

  const { institution, degree, field_of_study, start_year, end_year, description } = body;

  const { data, error } = await supabase
    .from("education")
    .insert([{ 
      institution, 
      degree, 
      field_of_study, 
      start_year, 
      end_year, 
      description }])
    .select()
    .single();

  if (error) {
    console.error("Supabase error:", error); // Tambahkan ini
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json(data, { status: 201 });
}

// === PUT (Update Education Record) ===
export async function PUT(req: Request) {
  const supabase = createClient()
  const body: Education = await req.json();

  if (!body.id)
    return NextResponse.json({ error: "Missing education id" }, { status: 400 });

  const { data, error } = await supabase
    .from("education")
    .update({
      institution: body.institution,
      degree: body.degree,
      field_of_study: body.field_of_study,
      start_year: body.start_year,
      end_year: body.end_year,
      description: body.description,
    })
    .eq("id", body.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json(data);
}

// === DELETE Education Record ===
export async function DELETE(req: Request) {
  const supabase = createClient()
  const { id } = await req.json();

  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const { error } = await supabase.from("education").delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ message: "Education record deleted successfully" });
}
