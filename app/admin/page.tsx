import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';

export default function AdminPanel() {
  return (
    <>
      <Sidebar />
      <main className="bg-gray-100 min-h-screen pl-8 pr-8 pt-2">
        <Dashboard />
      </main>
    </>
  );
}
