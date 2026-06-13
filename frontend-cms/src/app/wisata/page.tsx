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

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchWisatas();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Tempat Wisata</h1>
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
                    {/* Placeholder untuk tombol aksi */}
                    <button type="button" className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                    <button type="button" className="text-red-600 hover:text-red-900">Hapus</button>
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
    </div>
  );
}
