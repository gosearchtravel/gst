"use client";
import { useEffect, useState } from 'react';

interface BlogPost {
  id: number;
  title: string;
  content: string;
  city: string;
  imagePath: string;
  image: string;
  excerpt: string;
  createdAt: string;
}

interface BlogForm {
  city: string;
  image: string;
  excerpt: string;
  content: string;
}

export default function BlogAdmin() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [form, setForm] = useState<BlogForm>({ city: '', image: '', excerpt: '', content: '' });
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/blog').then(res => res.json()).then(setPosts);
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (editingId) {
      await fetch(`/api/blog/${editingId}`, {
        method: 'PUT',
        body: JSON.stringify(form),
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      await fetch('/api/blog', {
        method: 'POST',
        body: JSON.stringify(form),
        headers: { 'Content-Type': 'application/json' },
      });
    }
    setForm({ city: '', image: '', excerpt: '', content: '' });
    setEditingId(null);
    fetch('/api/blog').then(res => res.json()).then(setPosts);
  }

  async function handleDelete(id: number) {
    await fetch(`/api/blog/${id}`, { method: 'DELETE' });
    fetch('/api/blog').then(res => res.json()).then(setPosts);
  }

  function handleEdit(post: BlogPost) {
    setForm(post);
    setEditingId(post.id);
  }

  return (
    <main className="max-w-3xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Blog Admin</h1>
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <input name="city" value={form.city} onChange={handleChange} placeholder="City" className="border p-2 w-full" />
        <input name="image" value={form.image} onChange={handleChange} placeholder="Image URL" className="border p-2 w-full" />
        <input name="excerpt" value={form.excerpt} onChange={handleChange} placeholder="Excerpt" className="border p-2 w-full" />
        <textarea name="content" value={form.content} onChange={handleChange} placeholder="Content" className="border p-2 w-full" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">{editingId ? 'Update' : 'Add'} Post</button>
      </form>
      <ul className="space-y-4">
        {posts.map((post) => (
          <li key={post.id} className="border p-4 rounded flex flex-col">
            <div className="font-bold">{post.city}</div>
            <div className="text-sm text-gray-600">{post.city}</div>
            <img src={post.image} alt={post.title} className="w-32 h-20 object-cover my-2" />
            <div className="mb-2 text-gray-700">{post.excerpt}</div>
            <div className="mb-2">{post.content}</div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(post)} className="bg-yellow-500 text-white px-2 py-1 rounded">Edit</button>
              <button onClick={() => handleDelete(post.id)} className="bg-red-600 text-white px-2 py-1 rounded">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
