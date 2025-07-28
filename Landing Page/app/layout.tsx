import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"

export const metadata: Metadata = {
  title: "TransitTrack - Real-time Transit Project Monitoring",
  description:
    "Track and visualize transit infrastructure projects across the Greater Toronto Area with real-time data and interactive maps.",
  keywords: "transit, infrastructure, Toronto, GTA, Metrolinx, subway, LRT, GO Rail",
  authors: [{ name: "TransitTrack Team" }],
  openGraph: {
    title: "TransitTrack - Real-time Transit Project Monitoring",
    description:
      "Track and visualize transit infrastructure projects across the Greater Toronto Area with real-time data and interactive maps.",
    type: "website",
    url: "https://transittrack.ca",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "TransitTrack - Transit Project Monitoring",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TransitTrack - Real-time Transit Project Monitoring",
    description: "Track and visualize transit infrastructure projects across the Greater Toronto Area.",
    images: ["/images/og-image.png"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body className="antialiased">{children}</body>
    </html>
  )
}
