"use client";
import { useState, useEffect } from "react";

export default function PageManager({ pageKey, pageTitle }: { pageKey: string; pageTitle: string }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [newContent, setNewContent] = useState("");

  useEffect(() => {
    fetch(`/api/pages/${pageKey}`)
      .then(async (res) => {
        if (!res.ok) return { content: "" };
        const text = await res.text();
        if (!text) return { content: "" };
        try {
          return JSON.parse(text);
        } catch {
          return { content: "" };
        }
      })
      .then((data) => {
        setContent(data.content || "");
        setLoading(false);
      });
  }, [pageKey]);

  function handleEdit() {
    setNewContent(content);
    setEditing(true);
  }

  function handleSave() {
    fetch(`/api/pages/${pageKey}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: newContent }),
    })
      .then(async (res) => {
        if (!res.ok) return { content: newContent };
        const text = await res.text();
        if (!text) return { content: newContent };
        try {
          return JSON.parse(text);
        } catch {
          return { content: newContent };
        }
      })
      .then((data) => {
        setContent(data.content);
        setEditing(false);
      });
  }

  function handleCancel() {
    setEditing(false);
  }

  if (loading) return <div>Loading...</div>;

  return (
    <section className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">{pageTitle}</h2>
      {!editing ? (
        <>
          <div className="mb-6 whitespace-pre-line text-gray-700">{content}</div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleEdit}>Edit</button>
        </>
      ) : (
        <>
          <textarea
            className="w-full border rounded p-2 mb-4"
            rows={10}
            value={newContent}
            onChange={e => setNewContent(e.target.value)}
          />
          <div className="flex gap-2">
            <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleSave}>Save</button>
            <button className="bg-gray-300 px-4 py-2 rounded" onClick={handleCancel}>Cancel</button>
          </div>
        </>
      )}
    </section>
  );
}
