// src/app/documents/components/DocumentsForm.tsx
"use client";

import { useState, useEffect } from "react";
import { Trash2, Edit, Plus, FileText, X, Upload, AlertCircle } from "lucide-react";

interface Document {
  id: string;
  title: string;
  issuer: string | null;
  category: string | null;
  issue_date: string | null;
  description: string | null;
  file_url: string | null;
  created_at: string;
}

interface FormData {
  id?: string;
  title: string;
  issuer: string;
  category: string;
  issue_date: string;
  description: string;
  file_url: string;
}

export default function DocumentsForm() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    issuer: "",
    category: "",
    issue_date: "",
    description: "",
    file_url: "",
  });

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/documents");
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Gagal memuat dokumen");
      }
      
      const data = await res.json();
      setDocuments(data);
    } catch (error) {
      console.error("Error fetching documents:", error);
      const errorMessage = error instanceof Error ? error.message : "Gagal memuat dokumen";
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setError(null);

    try {
      if (editMode && formData.id) {
        // Update existing document
        const res = await fetch("/api/documents", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const responseData = await res.json();

        if (!res.ok) {
          throw new Error(responseData.error || "Gagal update dokumen");
        }
        
        alert("Dokumen berhasil diupdate!");
      } else {
        // Validate file
        if (!selectedFile) {
          throw new Error("File dokumen wajib dipilih!");
        }

        // Check file size (10MB)
        const maxSize = 10 * 1024 * 1024;
        if (selectedFile.size > maxSize) {
          throw new Error("File terlalu besar! Maksimal 10MB");
        }

        // Create new document with file upload
        const uploadFormData = new FormData();
        uploadFormData.append("file", selectedFile);
        uploadFormData.append("title", formData.title);
        uploadFormData.append("issuer", formData.issuer);
        uploadFormData.append("category", formData.category);
        uploadFormData.append("issue_date", formData.issue_date);
        uploadFormData.append("description", formData.description);

        console.log("📤 Uploading document...", {
          fileName: selectedFile.name,
          fileSize: selectedFile.size,
          fileType: selectedFile.type,
        });

        const res = await fetch("/api/documents/upload", {
          method: "POST",
          body: uploadFormData,
        });

        const responseData = await res.json();
        console.log("📥 Response:", responseData);

        if (!res.ok) {
          throw new Error(responseData.error || responseData.detail || "Gagal upload dokumen");
        }
        
        alert("Dokumen berhasil diupload!");
      }

      fetchDocuments();
      closeModal();
    } catch (error) {
      console.error("❌ Submit error:", error);
      const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan";
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (doc: Document) => {
    setFormData({
      id: doc.id,
      title: doc.title,
      issuer: doc.issuer || "",
      category: doc.category || "",
      issue_date: doc.issue_date || "",
      description: doc.description || "",
      file_url: doc.file_url || "",
    });
    setEditMode(true);
    setShowModal(true);
    setError(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus dokumen ini?")) return;

    try {
      setError(null);
      const res = await fetch("/api/documents/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.error || "Gagal hapus dokumen");
      }
      
      alert("Dokumen berhasil dihapus!");
      fetchDocuments();
    } catch (error) {
      console.error("❌ Delete error:", error);
      const errorMessage = error instanceof Error ? error.message : "Gagal menghapus dokumen";
      setError(errorMessage);
      alert(errorMessage);
    }
  };

  const openModal = () => {
    setShowModal(true);
    setEditMode(false);
    setFormData({
      title: "",
      issuer: "",
      category: "",
      issue_date: "",
      description: "",
      file_url: "",
    });
    setSelectedFile(null);
    setError(null);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditMode(false);
    setFormData({
      title: "",
      issuer: "",
      category: "",
      issue_date: "",
      description: "",
      file_url: "",
    });
    setSelectedFile(null);
    setError(null);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dokumen Saya</h1>
          <button
            onClick={openModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
          >
            <Plus size={20} />
            Upload Dokumen
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="text-red-600 mt-0.5" size={20} />
            <div>
              <h3 className="text-red-800 font-medium">Error</h3>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat dokumen...</p>
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <FileText size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">Belum ada dokumen</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="bg-white p-6 rounded-lg shadow hover:shadow-md transition"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {doc.title}
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                      <div>
                        <span className="font-medium">Penerbit:</span>{" "}
                        {doc.issuer || "-"}
                      </div>
                      <div>
                        <span className="font-medium">Kategori:</span>{" "}
                        {doc.category || "-"}
                      </div>
                      <div>
                        <span className="font-medium">Tanggal Terbit:</span>{" "}
                        {formatDate(doc.issue_date)}
                      </div>
                      <div>
                        <span className="font-medium">Dibuat:</span>{" "}
                        {formatDate(doc.created_at)}
                      </div>
                    </div>
                    {doc.description && (
                      <p className="text-gray-700 text-sm mb-3">
                        {doc.description}
                      </p>
                    )}
                    {doc.file_url && (
                      <a
                        href={doc.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Lihat Dokumen →
                      </a>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(doc)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Hapus"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">
                {editMode ? "Edit Dokumen" : "Upload Dokumen Baru"}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
                disabled={uploading}
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                  <AlertCircle className="text-red-600 mt-0.5" size={20} />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {!editMode && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    File Dokumen * <span className="text-gray-500">(Maks 10MB)</span>
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition">
                    <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                    <input
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setSelectedFile(file);
                        setError(null);
                      }}
                      className="hidden"
                      id="file-upload"
                      required={!editMode}
                      disabled={uploading}
                    />
                    <label
                      htmlFor="file-upload"
                      className={`cursor-pointer text-blue-600 hover:text-blue-700 font-medium ${
                        uploading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {selectedFile ? (
                        <div>
                          <div>{selectedFile.name}</div>
                          <div className="text-sm text-gray-500 mt-1">
                            {formatFileSize(selectedFile.size)}
                          </div>
                        </div>
                      ) : (
                        "Pilih file"
                      )}
                    </label>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Judul Dokumen *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  disabled={uploading}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Penerbit
                  </label>
                  <input
                    type="text"
                    value={formData.issuer}
                    onChange={(e) =>
                      setFormData({ ...formData, issuer: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={uploading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kategori
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={uploading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal Terbit
                </label>
                <input
                  type="date"
                  value={formData.issue_date}
                  onChange={(e) =>
                    setFormData({ ...formData, issue_date: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={uploading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={uploading}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={uploading}
                  className={`flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition ${
                    uploading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {uploading ? "Mengunggah..." : editMode ? "Update" : "Upload"}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={uploading}
                  className={`px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition ${
                    uploading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}