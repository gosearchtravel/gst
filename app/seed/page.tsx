'use client'

import { useState } from 'react'

export default function SeedPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleSeed = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/blog/seed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ error: 'Failed to seed database', details: error })
    } finally {
      setLoading(false)
    }
  }

  const handleCheckPosts = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/blog')
      const data = await response.json()
      setResult({ posts: data, count: Array.isArray(data) ? data.length : 0 })
    } catch (error) {
      setResult({ error: 'Failed to fetch posts', details: error })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Database Seed Tool</h1>

      <div className="space-y-4 mb-6">
        <button
          onClick={handleSeed}
          disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Seeding...' : 'Seed Database'}
        </button>

        <button
          onClick={handleCheckPosts}
          disabled={loading}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 ml-4"
        >
          {loading ? 'Checking...' : 'Check Posts'}
        </button>
      </div>

      {result && (
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Result:</h2>
          <pre className="whitespace-pre-wrap text-sm overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}
