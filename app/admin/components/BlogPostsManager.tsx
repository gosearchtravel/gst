"use client";
import { useEffect, useState } from "react";

type BlogPost = {
  id: number;
  city: string;
  image: string;
  excerpt: string;
  content: string;
};

export default function BlogPostsManager() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editPost, setEditPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    fetch("/api/blog")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      });
  }, []);

  function handleEdit(post: BlogPost) {
    setEditPost(post);
    setModalOpen(true);
  }

  function handleDelete(id: number) {
    if (!confirm("Delete this post?")) return;
    fetch(`/api/blog/${id}`, { method: "DELETE" })
      .then(() => setPosts((prev) => prev.filter((p) => p.id !== id)));
  }

  function handleCreate() {
    setEditPost(null);
    setModalOpen(true);
  }

  function handleModalSave(post: Partial<BlogPost>) {
    if (editPost) {
      // Edit
      fetch(`/api/blog/${editPost.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(post),
      })
        .then((res) => res.json())
        .then((updated) => {
          setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
          setModalOpen(false);
        });
    } else {
      // Create
      fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(post),
      })
        .then((res) => res.json())
        .then((created) => {
          setPosts((prev) => [...prev, created]);
          setModalOpen(false);
        });
    }
  }

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Manage Blog Posts</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleCreate}
        >
          + New Post
        </button>
      </div>
      <div className="bg-white rounded-lg shadow p-6 overflow-x-auto">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-2">City</th>
                <th className="text-left py-2 px-2">Image</th>
                <th className="text-left py-2 px-2">Excerpt</th>
                <th className="text-left py-2 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b">
                  <td className="py-2 px-2 font-semibold">{post.city}</td>
                  <td className="py-2 px-2">
                    <img src={post.image} alt={post.city} className="h-12 w-20 object-cover rounded" />
                  </td>
                  <td className="py-2 px-2 text-gray-600">{post.excerpt}</td>
                  <td className="py-2 px-2">
                    <button
                      className="text-blue-600 hover:underline mr-2"
                      onClick={() => handleEdit(post)}
                    >Edit</button>
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => handleDelete(post.id)}
                    >Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {modalOpen && (
        <BlogPostModal
          post={editPost}
          onSave={handleModalSave}
          onClose={() => setModalOpen(false)}
        />
      )}
    </section>
  );
}

function BlogPostModal({ post, onSave, onClose }: {
  post: BlogPost | null;
  onSave: (post: Partial<BlogPost>) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<Partial<BlogPost>>(
    post ? { ...post } : { city: "", image: "", excerpt: "", content: "" }
  );

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave(form);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <form
        className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg"
        onSubmit={handleSubmit}
      >
        <h3 className="text-xl font-bold mb-4">{post ? "Edit" : "Create"} Blog Post</h3>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">City</label>
          <input
            name="city"
            value={form.city || ""}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Image URL</label>
          <input
            name="image"
            value={form.image || ""}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Excerpt</label>
          <input
            name="excerpt"
            value={form.excerpt || ""}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Content</label>
          <textarea
            name="content"
            value={form.content || ""}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            rows={6}
            required
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            onClick={onClose}
          >Cancel</button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >Save</button>
        </div>
      </form>
    </div>
  );
}
