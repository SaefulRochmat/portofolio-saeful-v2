// src/app/dashboard/education/components/EducationForm.tsx

"use client";

import { useState, useEffect } from "react";
import type { Education } from "@/app/api/education/typeEducation";

export default function EducationPage() {
  const [educations, setEducations] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Education>>({
    institution: "",
    degree: "",
    field_of_study: "",
    start_year: "",
    end_year: "",
    description: "",
  });

  // Fetch all education records
  const fetchEducations = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/education");
      const data = await res.json();
      setEducations(data);
    } catch (error) {
      console.error("Error fetching educations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEducations();
  }, []);

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Create new education record
  const handleCreate = async () => {
    try {
      // Convert year strings to numbers
      const dataToSend = {
        ...formData,
        start_year: formData.start_year ? parseInt(formData.start_year as string) : null,
        end_year: formData.end_year ? parseInt(formData.end_year as string) : null,
      };
      
      console.log("Sending data:", dataToSend);
      const res = await fetch("/api/education", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });
      
      const result = await res.json();
      console.log("Response:", result);
      
      if (res.ok) {
        await fetchEducations();
        resetForm();
        alert("Data berhasil ditambahkan!");
      } else {
        alert(`Error: ${result.error || "Gagal menambahkan data"}`);
      }
    } catch (error) {
      console.error("Error creating education:", error);
      alert("Terjadi kesalahan saat menambahkan data");
    }
  };

  // Update existing education record
  const handleUpdate = async () => {
    try {
      // Convert year strings to numbers
      const dataToSend = {
        ...formData,
        id: editingId, // string UUID, bukan number
        start_year: formData.start_year ? parseInt(formData.start_year as string) : null,
        end_year: formData.end_year ? parseInt(formData.end_year as string) : null,
      };
      
      console.log("Updating data:", dataToSend);
      const res = await fetch("/api/education", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });
      
      const result = await res.json();
      console.log("Response:", result);
      
      if (res.ok) {
        await fetchEducations();
        resetForm();
        alert("Data berhasil diupdate!");
      } else {
        alert(`Error: ${result.error || "Gagal mengupdate data"}`);
      }
    } catch (error) {
      console.error("Error updating education:", error);
      alert("Terjadi kesalahan saat mengupdate data");
    }
  };

  // Delete education record
  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data ini?")) return;

    try {
      const res = await fetch("/api/education", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        await fetchEducations();
      } else {
        const result = await res.json();
        alert(`Error: ${result.error || "Gagal menghapus data"}`);
      }
    } catch (error) {
      console.error("Error deleting education:", error);
    }
  };


  // Open modal for editing
  const handleEdit = (edu: Education) => {
    setEditingId(edu.id || null);
    setFormData({
      institution: edu.institution,
      degree: edu.degree,
      field_of_study: edu.field_of_study,
      start_year: edu.start_year,
      end_year: edu.end_year,
      description: edu.description,
    });
    setIsModalOpen(true);
  };


  // Reset form and close modal
  const resetForm = () => {
    setFormData({
      institution: "",
      degree: "",
      field_of_study: "",
      start_year: "",
      end_year: "",
      description: "",
    });
    setEditingId(null);
    setIsModalOpen(false);
  };

  // Submit form (create or update)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      handleUpdate();
    } else {
      handleCreate();
    }
  };

  // Format date for display
  const formatYear = (year?: string | number | null) => {
    if (year === undefined || year === null || year === "") return "Sekarang";
    return year.toString();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Manajemen Pendidikan
          </h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            + Tambah Pendidikan
          </button>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat data...</p>
          </div>
        ) : (
          /* Education List */
          <div className="space-y-4">
            {educations.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-500">
                  Belum ada data pendidikan. Klik tombol Tambah Pendidikan
                  untuk menambahkan.
                </p>
              </div>
            ) : (
              educations.map((edu) => (
                <div
                  key={edu.id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {edu.degree}
                      </h3>
                      <p className="text-lg text-blue-600 mt-1">
                        {edu.institution}
                      </p>
                      <p className="text-gray-600 mt-1">
                        {edu.field_of_study}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        {formatYear(edu.start_year)} -{" "}
                        {formatYear(edu.end_year)}
                      </p>
                      {edu.description && (
                        <p className="text-gray-700 mt-3">{edu.description}</p>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEdit(edu)}
                        className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(edu.id!)}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Modal Form */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">
                  {editingId ? "Edit Pendidikan" : "Tambah Pendidikan"}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Institusi *
                    </label>
                    <input
                      type="text"
                      name="institution"
                      value={formData.institution}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Contoh: Universitas Indonesia"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gelar *
                    </label>
                    <input
                      type="text"
                      name="degree"
                      value={formData.degree}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Contoh: Sarjana Komputer"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bidang Studi *
                    </label>
                    <input
                      type="text"
                      name="field_of_study"
                      value={formData.field_of_study}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Contoh: Ilmu Komputer"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tahun Mulai *
                      </label>
                      <input
                        type="number"
                        name="start_year"
                        value={formData.start_year}
                        onChange={handleInputChange}
                        required
                        min="1900"
                        max="2100"
                        placeholder="2020"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tahun Selesai
                      </label>
                      <input
                        type="number"
                        name="end_year"
                        value={formData.end_year}
                        onChange={handleInputChange}
                        min="1900"
                        max="2100"
                        placeholder="2024 (kosongkan jika masih berlangsung)"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Deskripsi
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Aktivitas, prestasi, atau detail lainnya..."
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                    >
                      {editingId ? "Update" : "Simpan"}
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition font-medium"
                    >
                      Batal
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}