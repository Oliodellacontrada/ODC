import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { createServerClient } from '@/lib/supabase-server'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })
const siteUrl = 'https://www.oliodellacontrada.it'
const ogImage = 'https://res.cloudinary.com/dg1x0q7te/image/upload/v1773327006/0MGrsFMZTQSL17ohWQpJ3w-removebg-preview_hygpgc.png'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Olio della Contrada',
    template: '%s | Olio della Contrada',
  },
  description: 'Produttori artigianali di olio EVO biologico a Cleto, Cosenza',
  keywords: ['olio extravergine', 'olio biologico', 'Carolea', 'Calabria', 'Cleto', 'Cosenza', 'olio EVO', 'monocultivar'],
  authors: [{ name: 'Olio della Contrada' }],
  creator: 'Olio della Contrada',
  publisher: 'Olio della Contrada',
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    url: siteUrl,
    siteName: 'Olio della Contrada',
    title: 'Olio della Contrada',
    description: 'Produttori artigianali di olio EVO biologico a Cleto, Cosenza',
    images: [
      {
        url: ogImage,
        width: 800,
        height: 800,
        alt: 'Olio della Contrada - Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Olio della Contrada',
    description: 'Produttori artigianali di olio EVO biologico a Cleto, Cosenza',
    images: [ogImage],
  },
  alternates: {
    canonical: siteUrl,
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerClient()
  const { data } = await (supabase as any)
    .from('site_settings')
    .select('google_analytics_id')
    .single()
  const analyticsId = data?.google_analytics_id as string | null

  return (
    <html lang="it">
      <body className={inter.className}>
        {analyticsId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${analyticsId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${analyticsId}');
              `}
            </Script>
          </>
        )}
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
