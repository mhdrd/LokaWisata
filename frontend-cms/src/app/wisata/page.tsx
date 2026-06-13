"use client";

import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';

interface Kategori {
  id: number;
  name: string;
}

interface Wisata {
  id: number;
  name: string;
  kategori: Kategori;
}

export default function WisataPage() {
  const [wisatas, setWisatas] = useState<Wisata[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState<Kategori[]>([]);
  const [editingWisata, setEditingWisata] = useState<Wisata | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    contactWa: '',
    contactEmail: '',
    latitude: '',
    longitude: '',
    kategoriId: ''
  });

  const fetchWisatas = async () => {
    try {
      const response = await apiFetch('/wisata');
      const data = await response.json();
      setWisatas(data.data || []);
    } catch (error) {
      console.error('Gagal mengambil data wisata:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await apiFetch('/kategori');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Gagal mengambil data kategori:', error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchWisatas();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCategories();
  }, []);

  const handleSaveWisata = async () => {
    if (!formData.name || !formData.kategoriId) {
      alert("Nama dan Kategori wajib diisi");
      return;
    }
    
    try {
      setLoading(true);
      const payload = {
        name: formData.name,
        description: formData.description || undefined,
        contactWa: formData.contactWa || undefined,
        contactEmail: formData.contactEmail || undefined,
        latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
        longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
        kategoriId: parseInt(formData.kategoriId)
      };

      if (editingWisata) {
        await apiFetch(`/wisata/${editingWisata.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        console.log('Wisata berhasil diupdate');
      } else {
        await apiFetch('/wisata', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        console.log('Wisata berhasil disimpan');
      }
      
      fetchWisatas();
      setFormData({
        name: '',
        description: '',
        contactWa: '',
        contactEmail: '',
        latitude: '',
        longitude: '',
        kategoriId: ''
      });
      setEditingWisata(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Gagal menyimpan wisata:', error);
      setLoading(false);
    }
  };

  const handleEditClick = async (wisata: Wisata) => {
    try {
      // Fetch detail wisata to get all fields including description, contactWa, etc.
      // Since the list might not have full detail if the backend strips it, but actually the Prisma include returns full anyway.
      // But just to be safe, we'll try to fetch the detail or just use the object if it has everything.
      // In our case, the list returns full objects. Wait, the list has contactWa? Let's check `wisata` type.
      // We didn't define full fields in `interface Wisata`. We should use the object or fetch by ID.
      // Let's fetch detail by ID to get the full data for editing.
      const response = await apiFetch(`/wisata/${wisata.id}`);
      const detail = await response.json();
      
      setEditingWisata(detail);
      setFormData({
        name: detail.name || '',
        description: detail.description || '',
        contactWa: detail.contactWa || '',
        contactEmail: detail.contactEmail || '',
        latitude: detail.latitude ? detail.latitude.toString() : '',
        longitude: detail.longitude ? detail.longitude.toString() : '',
        kategoriId: detail.kategoriId ? detail.kategoriId.toString() : ''
      });
      setIsModalOpen(true);
    } catch (error) {
      console.error('Gagal mengambil detail wisata:', error);
    }
  };

  const handleDeleteWisata = async (wisata: Wisata) => {
    if (window.confirm(`Yakin ingin menghapus wisata "${wisata.name}"?`)) {
      try {
        setLoading(true);
        await apiFetch(`/wisata/${wisata.id}`, { method: 'DELETE' });
        console.log('Wisata berhasil dihapus');
        fetchWisatas();
      } catch (error) {
        console.error('Gagal menghapus wisata:', error);
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Tempat Wisata</h1>
        <button 
          type="button" 
          onClick={() => {
            setEditingWisata(null);
            setFormData({
              name: '',
              description: '',
              contactWa: '',
              contactEmail: '',
              latitude: '',
              longitude: '',
              kategoriId: ''
            });
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium"
        >
          Tambah Wisata
        </button>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center" colSpan={4}>
                  Memuat data wisata...
                </td>
              </tr>
            ) : wisatas.length > 0 ? (
              wisatas.map((wisata) => (
                <tr key={wisata.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{wisata.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{wisata.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{wisata.kategori?.name || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      type="button" 
                      onClick={() => handleEditClick(wisata)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </button>
                    <button 
                      type="button" 
                      onClick={() => handleDeleteWisata(wisata)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center" colSpan={4}>
                  Belum ada data wisata
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingWisata ? 'Edit Wisata' : 'Tambah Wisata'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Wisata *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan nama wisata"
                />
              </div>
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori *</label>
                <select
                  value={formData.kategoriId}
                  onChange={(e) => setFormData({ ...formData, kategoriId: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Pilih Kategori</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan deskripsi"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kontak WA</label>
                <input
                  type="text"
                  value={formData.contactWa}
                  onChange={(e) => setFormData({ ...formData, contactWa: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: 08123456789"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kontak Email</label>
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: info@wisata.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                <input
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="-6.200000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                <input
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="106.816666"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Batal
              </button>
              <button 
                type="button" 
                onClick={handleSaveWisata}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
