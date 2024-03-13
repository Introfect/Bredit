import Navbar from '@/components/Navbar'
import Providers from '@/components/Providers'
import { Toaster } from '@/components/ui/toaster'
import { cn } from '@/lib/utils'
  import '@/styles/globals.css'

export const metadata = {
  title: 'BreadIt',
  description: 'A Reddit clone built with Next.js and TypeScript.',
}

export default function RootLayout({
  children,
  authModal,
}: {
  children: React.ReactNode,
  authModal: React.ReactNode
}) {
  return (
    <html lang='en' className={cn('bg-white text-slate-900 antialiased light ',)}>
      <body className='min-h-scree pt-12 bg-slate-50 antialiased '>
        <Providers>

        {/* @ts-expect-error  */}
        <Navbar/>
        {authModal}

        <div className='container max-w-7xl mx-auto h-full pt-12'>
        {children}
        </div>
        <Toaster/>
        </Providers>
        </body>
    </html>
  )
}
