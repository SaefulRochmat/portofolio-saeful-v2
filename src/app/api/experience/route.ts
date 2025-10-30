import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import type { Experience } from "./typeExperience";

// === GET All Experience ===
export async function GET() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("experience")
    .select("*")
    .order("start_date", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json(data);
}

// === POST (Create New Experience) ===
export async function POST(req: Request) {
  const supabase = createClient()
  const body: Experience = await req.json();

  const { position, company, start_date, end_date, description } = body;

  const { data, error } = await supabase
    .from("experience")
    .insert([{ position, company, start_date, end_date, description }])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json(data, { status: 201 });
}

// === PUT (Update Experience) ===
export async function PUT(req: Request) {
  const supabase = createClient()
  const body: Experience = await req.json();

  if (!body.id)
    return NextResponse.json({ error: "Missing experience id" }, { status: 400 });

  const { data, error } = await supabase
    .from("experience")
    .update({
      position: body.position,
      company: body.company,
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

// === DELETE Experience ===
export async function DELETE(req: Request) {
  const supabase = createClient()
  const { id } = await req.json();

  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const { error } = await supabase.from("experience").delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ message: "Experience deleted successfully" });
}
