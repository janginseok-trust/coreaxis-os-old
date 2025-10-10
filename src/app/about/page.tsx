'use client'

export default function About() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="h-14 bg-white shadow flex items-center justify-between px-6">
        <div className="font-bold text-blue-600 text-lg">🧬 Genome-OS</div>
        <div className="text-sm text-gray-500">About</div>
      </header>

      {/* Main */}
      <main className="flex-1 px-6 py-12 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">About Genome-OS</h1>
        <p className="max-w-2xl mx-auto text-gray-600 mb-10">
          Genome-OS is a failure-centric drug strategy console built to help researchers,
          pharmaceutical teams, and policy makers understand biomedical data faster and smarter.
        </p>

        {/* Images - One per row */}
        <div className="max-w-4xl mx-auto mb-10">
          <img src="/1.png" alt="About 1" className="w-full rounded-lg shadow mb-6" />
          <img src="/2.png" alt="About 2" className="w-full rounded-lg shadow mb-6" />
          <img src="/3.png" alt="About 3" className="w-full rounded-lg shadow" />
        </div>

        {/* Extra Introduction */}
        <div className="max-w-3xl mx-auto text-gray-700 text-base leading-relaxed text-left">
          <p className="mb-4">
            Our platform integrates millions of biomedical data points — including failures, 
            clinical trials, regulatory outcomes, and evidence links — into a unified strategy console.
          </p>
          <p>
            Genome-OS empowers decision makers with failure insights, proven strategies, and traceable evidence, 
            helping accelerate drug development while reducing costly risks.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="h-14 bg-gray-100 flex items-center justify-center text-sm text-gray-500">
        © 2025 <span className="font-semibold text-blue-600 mx-1">CoreaxisLab</span> — Contact:{' '}
        <a href="mailto:589second@gmail.com" className="underline">589second@gmail.com</a>
      </footer>
    </div>
  )
}
