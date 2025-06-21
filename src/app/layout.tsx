import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Figma-to-Code Generator | Next.js',
  description: 'AI-powered Figma design to production-ready code generator built with Next.js',
  keywords: ['figma', 'code generator', 'react', 'nextjs', 'ai', 'design to code'],
  authors: [{ name: 'Figma-to-Code Team' }],
  openGraph: {
    title: 'Figma-to-Code Generator',
    description: 'Transform Figma designs into production-ready React components',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="hu" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}