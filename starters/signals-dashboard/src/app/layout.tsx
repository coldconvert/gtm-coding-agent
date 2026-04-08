import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GTM Mission Control",
  description: "Go-to-market operations dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full bg-zinc-950 text-zinc-50">
        <header className="border-b border-zinc-800 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-lg font-semibold tracking-tight">
              GTM Mission Control
            </h1>
            <nav className="flex items-center gap-1 text-sm">
              <a href="/" className="px-3 py-1.5 rounded hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors">Campaigns</a>
              <a href="/database" className="px-3 py-1.5 rounded hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors">Database</a>
              <a href="/accounts" className="px-3 py-1.5 rounded hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors">Accounts</a>
              <a href="/signals" className="px-3 py-1.5 rounded hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors">Signals</a>
              <a href="/segments" className="px-3 py-1.5 rounded hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors">Segments</a>
            </nav>
          </div>
          <div className="flex items-center gap-4 text-sm text-zinc-400">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          </div>
        </header>
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}
