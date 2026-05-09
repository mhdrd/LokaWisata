import React from 'react';

// Ini komponen pembungkus buat halaman admin
// Nanti kita taruh sidebar di kiri dan kontennya di kanan biar gampang
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Tempat untuk Sidebar (Nanti dikerjain di commit selanjutnya) */}
      <div className="w-64 bg-white shadow-md hidden md:block">
        <div className="p-4 font-bold text-xl border-b">
          LokaWisata Admin
        </div>
      </div>

      {/* Bagian utama (Header + Konten) */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Tempat untuk Header */}
        <header className="bg-white shadow-sm p-4">
          Header Admin (sementara)
        </header>

        {/* Isi konten halamannya bakal masuk ke sini */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4">
          {children}
        </main>
      </div>
    </div>
  );
}
