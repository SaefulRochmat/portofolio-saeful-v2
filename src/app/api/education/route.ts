import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseClient';
import type { Education } from './typeEducation';

// === GET All Education ===
export async function GET() {
  const { data, error } = await supabase
    .from("education")
    .select("*")
    .order("start_date", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json(data);
}

// === POST (Create Education Record) ===
export async function POST(req: Request) {
  const body: Education = await req.json();

  const { institution, degree, field_of_study, start_date, end_date, description } = body;

  const { data, error } = await supabase
    .from("education")
    .insert([{ institution, degree, field_of_study, start_date, end_date, description }])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json(data, { status: 201 });
}

// === PUT (Update Education Record) ===
export async function PUT(req: Request) {
  const body: Education = await req.json();

  if (!body.id)
    return NextResponse.json({ error: "Missing education id" }, { status: 400 });

  const { data, error } = await supabase
    .from("education")
    .update({
      institution: body.institution,
      degree: body.degree,
      field_of_study: body.field_of_study,
      start_date: body.start_date,
      end_date: body.end_date,
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
  const { id } = await req.json();

  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const { error } = await supabase.from("education").delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ message: "Education record deleted successfully" });
}
