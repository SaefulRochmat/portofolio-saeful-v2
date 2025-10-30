// src/app/api/documents/route.ts

import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export interface DocumentData {
  id?: string;
  profile_id?: string;
  title: string;
  issuer: string | null;
  category: string | null;
  issue_date: string | null;
  description: string | null;
  file_url: string | null;
}

// === GET All Documents ===
export async function GET() {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("profile_id", user.id) // ✅ Filter by user
      .order("issue_date", { ascending: false });

    if (error) {
      console.error("❌ GET error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("❌ Server error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// === POST (Create Document Record) ===
export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: DocumentData = await req.json();
    const { title, issuer, category, issue_date, file_url, description } = body;

    if (!title)
      return NextResponse.json({ error: "Title is required" }, { status: 400 });

    const { data, error } = await supabase
      .from("documents")
      .insert([{ 
        profile_id: user.id, // ✅ Tambah profile_id
        title, 
        issuer, 
        category, 
        issue_date, 
        file_url, 
        description 
      }])
      .select()
      .single();

    if (error) {
      console.error("❌ POST error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error("❌ Server error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// === PUT (Update Document Record) ===
export async function PUT(req: Request) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
      .eq("profile_id", user.id) // ✅ Verify ownership
      .select()
      .single();

    if (error) {
      console.error("❌ PUT error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("❌ Server error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// === DELETE (Remove Document Record) ===
export async function DELETE(req: Request) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();

    if (!id)
      return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const { error } = await supabase
      .from("documents")
      .delete()
      .eq("id", id)
      .eq("profile_id", user.id); // ✅ Verify ownership

    if (error) {
      console.error("❌ DELETE error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: "Document deleted successfully" });
  } catch (err) {
    console.error("❌ Server error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}