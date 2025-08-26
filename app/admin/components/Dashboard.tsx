import Link from "next/link";

export default function Dashboard() {
  return (
    <section className="pl-2">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-2">
            <Link href="/admin/blog-posts" className="text-gray-700 hover:text-blue-600">Blog Posts</Link>
          </h2>
          <p>Manage, create, and edit blog posts.</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-2">
            <Link href="/admin/images" className="text-gray-700 hover:text-blue-600">Image Uploads</Link>
          </h2>
          <p>Upload and manage images for posts and sliders.</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-2">
            <Link href="/admin/sliders" className="text-gray-700 hover:text-blue-600">Sliders</Link>
          </h2>
          <p>Create and manage homepage sliders.</p>
        </div>
      </div>
    </section>
  );
}
