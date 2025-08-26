import Sidebar from "./components/Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Sidebar />
      <main className="bg-gray-100 min-h-screen ml-64 px-8 py-4">
        {children}
      </main>
    </>
  );
}
