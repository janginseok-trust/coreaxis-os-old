// src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Coreaxis‑OS",
  description: "Biomedical & Risk Intelligence Database",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-gray-50 text-gray-900 antialiased">
        {/* Header */}
        <header className="h-14 bg-white shadow flex items-center justify-between px-6 sticky top-0 z-20">
          <div className="font-bold text-blue-600 text-lg">🌍 Coreaxis‑OS</div>
          <nav className="flex gap-6 text-sm text-gray-600">
            <a href="/" className="hover:text-blue-600 transition">
              Home
            </a>
            <a href="/about" className="hover:text-blue-600 transition">
              About
            </a>
            <a
              href="mailto:589second@gmail.com"
              className="hover:text-blue-600 transition"
            >
              Contact
            </a>
          </nav>
        </header>

        {/* Main content */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <footer className="h-16 bg-gray-100 flex flex-col items-center justify-center text-sm text-gray-500">
          <div>© 2025 CoreaxisLab. All rights reserved.</div>
          <div className="text-xs">Contact: 589second@gmail.com</div>
        </footer>
      </body>
    </html>
  );
}
