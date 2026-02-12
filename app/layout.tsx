import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
// import { Toaster } from '@/components/ui/toaster'
import './globals.css'

const geistSans = Geist({ 
  subsets: ["latin"],
  variable: "--font-sans"
});
const geistMono = Geist_Mono({ 
  subsets: ["latin"],
  variable: "--font-mono"
});

export const metadata: Metadata = {
  title: 'Multi-Exchange Market Maker',
  description: 'Perpetuals market maker bot for FlowX Finance and Hyperliquid',
  generator: 'Blackbox AI',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-50">
        {children}
        {/* <Toaster /> */}
        <Analytics />
      </body>
    </html>
  )
}
