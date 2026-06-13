export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-white shadow-md">
        <nav className="p-4 space-y-2 mt-4">
          <a href="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md font-medium">Dashboard</a>
          <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md font-medium">Kategori</a>
          <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md font-medium">Tempat Wisata</a>
        </nav>
      </aside>
      <main className="flex-1 flex flex-col">
        {children}
      </main>
    </div>
  );
}
