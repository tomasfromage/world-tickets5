import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import MiniKitProvider from "@/components/Minikit-Provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TicketHub - Your Premier Ticketing Platform",
  description: "Discover, buy, and sell tickets for concerts, sports, theater, and more on TicketHub.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <MiniKitProvider>
        <body className={inter.className}>{children}</body>
      </MiniKitProvider>
    </html>
  )
}
