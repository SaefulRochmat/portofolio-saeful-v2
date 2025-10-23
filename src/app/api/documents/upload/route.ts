import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabaseClient";

// ============================================================
// 📤 POST - Upload dokumen ke storage + simpan record ke DB
// ============================================================
export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File | null;
    const title = formData.get("title") as string | null;
    const issuer = formData.get("issuer") as string | null;
    const category = formData.get("category") as string | null;
    const issue_date = formData.get("issue_date") as string | null;
    const description = formData.get("description") as string | null;

    if (!file || !title) {
      return NextResponse.json(
        { error: "File dan title wajib diisi!" },
        { status: 400 }
      );
    }

    const fileName = `${Date.now()}_${file.name}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("documents")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json(
        { error: uploadError.message },
        { status: 500 }
      );
    }

    const { data: publicUrlData } = supabase.storage
      .from("documents")
      .getPublicUrl(fileName);

    const fileUrl = publicUrlData.publicUrl;

    const { data: insertData, error: insertError } = await supabase
      .from("documents")
      .insert([
        {
          title,
          issuer,
          category,
          issue_date,
          description,
          file_url: fileUrl,
        },
      ])
      .select()
      .single();

    if (insertError)
      return NextResponse.json({ error: insertError.message }, { status: 500 });

    return NextResponse.json({
      message: "Upload berhasil!",
      document: insertData,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ============================================================
// 📄 GET - Ambil semua dokumen dari tabel
// ============================================================
export async function GET() {
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .order("created_at", { ascending: false });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json(data);
}

// ============================================================
// ❌ DELETE - Hapus file dari storage + record dari DB
// ============================================================
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id)
      return NextResponse.json({ error: "ID dokumen wajib diisi!" }, { status: 400 });

    // Ambil dulu data dokumennya
    const { data: docData, error: fetchError } = await supabase
      .from("documents")
      .select("file_url")
      .eq("id", id)
      .single();

    if (fetchError || !docData)
      return NextResponse.json({ error: "Dokumen tidak ditemukan!" }, { status: 404 });

    // Ekstrak nama file dari URL public Supabase
    const fileUrl = docData.file_url;
    const filePath = fileUrl.split("/").pop(); // ambil nama file dari URL

    if (!filePath)
      return NextResponse.json({ error: "File path tidak valid!" }, { status: 400 });

    // Hapus file dari bucket
    const { error: deleteFileError } = await supabase.storage
      .from("documents")
      .remove([filePath]);

    if (deleteFileError)
      return NextResponse.json(
        { error: "Gagal hapus file di storage", detail: deleteFileError.message },
        { status: 500 }
      );

    // Hapus record dari tabel
    const { error: deleteRecordError } = await supabase
      .from("documents")
      .delete()
      .eq("id", id);

    if (deleteRecordError)
      return NextResponse.json(
        { error: deleteRecordError.message },
        { status: 500 }
      );

    return NextResponse.json({ message: "Dokumen berhasil dihapus!" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
