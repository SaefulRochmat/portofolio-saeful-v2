// src/app/api/documents/upload/route.ts

import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// 📤 POST - Upload dokumen ke storage + simpan record ke DB
export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized - Please login first" },
        { status: 401 }
      );
    }

    const formData = await req.formData();

    const file = formData.get("file") as File | null;
    const title = formData.get("title") as string | null;
    const issuer = formData.get("issuer") as string | null;
    const category = formData.get("category") as string | null;
    const issue_date = formData.get("issue_date") as string | null;
    const description = formData.get("description") as string | null;

    console.log("📝 Form data received:", { 
      title, 
      issuer, 
      category, 
      issue_date, 
      file: file?.name,
      fileSize: file?.size,
      fileType: file?.type,
      userId: user.id
    });

    if (!file || !title) {
      return NextResponse.json(
        { error: "File dan title wajib diisi!" },
        { status: 400 }
      );
    }

    // Check file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File terlalu besar! Maksimal 10MB" },
        { status: 400 }
      );
    }

    const fileName = `${user.id}/${Date.now()}_${file.name}`;
    console.log("📤 Uploading file:", fileName);

    // Upload file ke Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("documents")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("❌ Upload error:", uploadError);
      return NextResponse.json(
        { error: `Upload gagal: ${uploadError.message}` },
        { status: 500 }
      );
    }

    console.log("✅ File uploaded:", uploadData);

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from("documents")
      .getPublicUrl(fileName);

    const fileUrl = publicUrlData.publicUrl;
    console.log("🔗 Public URL:", fileUrl);

    // Insert record ke database dengan profile_id
    const { data: insertData, error: insertError } = await supabase
      .from("documents")
      .insert([
        {
          profile_id: user.id, // ✅ Tambah profile_id
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

    if (insertError) {
      console.error("❌ Insert error:", insertError);
      
      // Rollback: hapus file yang sudah diupload
      await supabase.storage.from("documents").remove([fileName]);
      
      return NextResponse.json({ 
        error: `Database insert gagal: ${insertError.message}` 
      }, { status: 500 });
    }

    console.log("✅ Document inserted:", insertData);

    return NextResponse.json({
      message: "Upload berhasil!",
      document: insertData,
    });
  } catch (err) {
    console.error("❌ Server error:", err);
    return NextResponse.json({ 
      error: "Server error",
      detail: err instanceof Error ? err.message : "Unknown error"
    }, { status: 500 });
  }
}

// 📄 GET - Ambil semua dokumen dari tabel
export async function GET() {
  try {
    const supabase = await createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get documents for current user only
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("profile_id", user.id) // ✅ Filter by user
      .order("created_at", { ascending: false });

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

// ❌ DELETE - Hapus file dari storage + record dari DB
export async function DELETE(req: Request) {
  try {
    const supabase = await createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const { id } = await req.json();

    if (!id)
      return NextResponse.json({ error: "ID dokumen wajib diisi!" }, { status: 400 });

    console.log("🗑️ Deleting document:", id);

    // Ambil data dokumen + verify ownership
    const { data: docData, error: fetchError } = await supabase
      .from("documents")
      .select("file_url, profile_id")
      .eq("id", id)
      .single();

    if (fetchError || !docData) {
      console.error("❌ Fetch error:", fetchError);
      return NextResponse.json({ error: "Dokumen tidak ditemukan!" }, { status: 404 });
    }

    // Check ownership
    if (docData.profile_id !== user.id) {
      return NextResponse.json({ 
        error: "Forbidden: Anda tidak memiliki akses untuk menghapus dokumen ini!" 
      }, { status: 403 });
    }

    // Ekstrak nama file dari URL
    const fileUrl = docData.file_url;
    const urlParts = fileUrl.split("/storage/v1/object/public/documents/");
    const filePath = urlParts[1] || fileUrl.split("/").slice(-2).join("/");

    if (!filePath)
      return NextResponse.json({ error: "File path tidak valid!" }, { status: 400 });

    console.log("🗑️ Deleting file:", filePath);

    // Hapus file dari bucket
    const { error: deleteFileError } = await supabase.storage
      .from("documents")
      .remove([filePath]);

    if (deleteFileError) {
      console.error("❌ Delete file error:", deleteFileError);
      // Continue anyway - file might already be deleted
    }

    // Hapus record dari tabel
    const { error: deleteRecordError } = await supabase
      .from("documents")
      .delete()
      .eq("id", id)
      .eq("profile_id", user.id); // ✅ Double check ownership

    if (deleteRecordError) {
      console.error("❌ Delete record error:", deleteRecordError);
      return NextResponse.json(
        { error: deleteRecordError.message },
        { status: 500 }
      );
    }

    console.log("✅ Document deleted successfully");

    return NextResponse.json({ message: "Dokumen berhasil dihapus!" });
  } catch (err) {
    console.error("❌ Server error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}