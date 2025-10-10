'use client'

import { useState } from 'react'

type Disease = {
  disease_id: number
  name: string
  summary?: string
  description?: string
}

export default function Home() {
  const [query, setQuery] = useState<string>('')
  const [results, setResults] = useState<Disease[]>([])
  const [selected, setSelected] = useState<Disease | null>(null)
  const [showCompanyInfo, setShowCompanyInfo] = useState(false)

  async function search() {
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
    const data = await res.json()
    setResults(data)
    setSelected(null)
  }

  async function viewDetail(id: number) {
    const res = await fetch(`/api/detail?id=${id}`)
    const data = await res.json()
    setSelected(data)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="h-14 bg-white shadow flex items-center justify-between px-4 sm:px-6">
        <div className="font-bold text-blue-600 text-lg">🧬 Genome-OS</div>
        <nav className="hidden sm:flex gap-4 text-sm text-gray-500">
          <a href="/" className="hover:text-blue-600">Home</a>
          <a href="/about" className="hover:text-blue-600">About</a>
          <a href="/legal" className="hover:text-blue-600">Legal</a>
        </nav>
      </header>

      {/* Hero / Search Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-10 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3 text-gray-800">
          The biomedical intelligence console.
        </h1>
        <p className="text-gray-600 mb-2 max-w-xl">
          Search diseases, drugs, or genes to explore verified biomedical outcomes.
        </p>
        <p className="text-sm text-blue-600 mb-6">Try searching “Alzheimer”, “mRNA”, or “TP53”.</p>

        {/* Search bar */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 w-full max-w-md">
          <input
            className="p-2 rounded text-black flex-1 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter keyword..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            onClick={search}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full sm:w-auto"
          >
            Search
          </button>
        </div>

        {/* Search Results */}
        <div className="mt-8 w-full max-w-4xl px-2 sm:px-0">
          {selected ? (
            <div className="p-4 bg-gray-900 text-white rounded-lg text-left break-words">
              <h2 className="text-xl font-bold mb-2">{selected.name}</h2>
              <p className="leading-relaxed">{selected.description || 'No detailed description available.'}</p>
              <button
                onClick={() => setSelected(null)}
                className="mt-3 px-3 py-1 bg-gray-700 rounded w-full sm:w-auto"
              >
                ← Back
              </button>
            </div>
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {results.map((r) => (
                <li
                  key={r.disease_id}
                  className="p-3 bg-gray-800 text-left text-white rounded cursor-pointer hover:bg-gray-700 transition"
                  onClick={() => viewDetail(r.disease_id)}
                >
                  <strong className="block truncate">{r.name}</strong>
                  <p className="text-sm text-gray-400 line-clamp-2">{r.summary || 'No summary available.'}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 text-gray-700 text-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col items-center text-center">
          <div className="font-semibold text-gray-800 mb-2">CoreAxis Labs</div>
          <div className="text-gray-600 mb-3">© {new Date().getFullYear()} CoreAxis Labs. All rights reserved.</div>

          <button
            onClick={() => setShowCompanyInfo(!showCompanyInfo)}
            className="text-blue-600 hover:underline text-xs mb-2"
          >
            {showCompanyInfo ? 'Hide company details ▲' : 'Show company details ▼'}
          </button>

          {showCompanyInfo && (
            <div className="bg-white border border-gray-200 rounded-lg shadow p-4 text-left w-full max-w-3xl space-y-2 mt-2 text-xs sm:text-sm">
              <div><strong>Company:</strong> CoreAxis Labs (코어액시스랩스)</div>
              <div><strong>CEO:</strong> Insuk Jang (장인석)</div>
              <div><strong>Business Reg. No:</strong> 233-39-01443</div>
              <div><strong>Address:</strong> 105-C115, B1, Daemyung Vicencity Officetel, 196 Worldcup-ro, Mapo-gu, Seoul, Korea</div>
              <div><strong>Contact:</strong> <a href="mailto:589second@gmail.com" className="text-blue-600 hover:underline">589second@gmail.com</a></div>
              <div><strong>사업자등록번호:</strong> 233-39-01443</div>
              <div><strong>주소:</strong> 서울특별시 마포구 월드컵로 196, B동 1층 105-C115호 (성산동, 대명비첸시티오피스텔)</div>
            </div>
          )}

          <div className="flex flex-wrap gap-4 mt-4 justify-center text-xs text-gray-500">
            <a href="/legal" className="hover:text-gray-700">Privacy Policy</a>
            <a href="/legal#terms" className="hover:text-gray-700">Terms of Use</a>
            <a href="/legal#refund" className="hover:text-gray-700">Refund Policy</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
