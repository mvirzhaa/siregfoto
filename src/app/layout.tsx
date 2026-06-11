import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: 'Studio BPPSI — Registrasi Foto Ijazah & Sidik Jari UIKA',
  description: 'Sistem Registrasi Foto Ijazah dan Scan Sidik Jari Universitas Ibn Khaldun Bogor',
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var originFetch = window.fetch;
                window.fetch = function(input, init) {
                  if (typeof input === 'string' && input.startsWith('/api/')) {
                    return originFetch('/studio' + input, init);
                  }
                  if (input && typeof input === 'object' && typeof input.url === 'string' && input.url.startsWith('/api/')) {
                    var newUrl = '/studio' + input.url;
                    return originFetch(newUrl, init);
                  }
                  return originFetch(input, init);
                };
              })();
            `
          }}
        />
      </head>
      <body className={`${poppins.variable} font-sans antialiased bg-slate-50`}>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              fontFamily: 'var(--font-poppins), sans-serif',
              fontSize: '14px',
            },
            success: {
              iconTheme: { primary: '#15803d', secondary: '#fff' },
            },
          }}
        />
        {children}
      </body>
    </html>
  )
}
