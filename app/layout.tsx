import type { Metadata } from 'next'
import './globals.css'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Travel Planner App',
  description: 'Created ',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        {/* Load Google Maps JS API */}
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyBLYS9AcbhRWdzdBc_rmKbbm-blo6o5OXAY&libraries=places`}
          strategy="beforeInteractive"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
