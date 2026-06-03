import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Inter, JetBrains_Mono } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'react-hot-toast'
import '@/styles/globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'The Chronicle'
const siteDescription = process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'Breaking news and in-depth features'
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: ['news', 'journalism', 'features', 'opinion', 'breaking news'],
  authors: [{ name: siteName }],
  creator: siteName,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName,
    title: siteName,
    description: siteDescription,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteName,
    description: siteDescription,
    creator: process.env.NEXT_PUBLIC_SITE_TWITTER,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/icons/favicon.ico',
    apple: '/icons/apple-touch-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8f7f4' },
    { media: '(prefers-color-scheme: dark)', color: '#0c0b09' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${playfair.variable} ${inter.variable} ${jetbrains.variable}`}
    >
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#252019',
                color: '#f0ede6',
                border: '1px solid #64564b',
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
