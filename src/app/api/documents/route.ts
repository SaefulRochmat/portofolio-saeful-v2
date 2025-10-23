import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabaseClient";
import { DocumentData } from "./typeDocument";

// === GET All Documents ===
export async function GET() {
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .order("issue_date", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json(data);
}

// === POST (Create Document Record) ===
export async function POST(req: Request) {
  const body: DocumentData = await req.json();
  const { title, issuer, category, issue_date, file_url, description } = body;

  if (!title)
    return NextResponse.json({ error: "Title is required" }, { status: 400 });

  const { data, error } = await supabase
    .from("documents")
    .insert([{ title, issuer, category, issue_date, file_url, description }])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json(data, { status: 201 });
}

// === PUT (Update Document Record) ===
export async function PUT(req: Request) {
  const body: DocumentData = await req.json();

  if (!body.id)
    return NextResponse.json({ error: "Missing document id" }, { status: 400 });

  const { data, error } = await supabase
    .from("documents")
    .update({
      title: body.title,
      issuer: body.issuer,
      category: body.category,
      issue_date: body.issue_date,
      file_url: body.file_url,
      description: body.description,
    })
    .eq("id", body.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json(data);
}

// === DELETE (Remove Document Record) ===
export async function DELETE(req: Request) {
  const { id } = await req.json();

  if (!id)
    return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const { error } = await supabase.from("documents").delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ message: "Document deleted successfully" });
}
