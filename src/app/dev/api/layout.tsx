import Image from 'next/image'
import App from './app'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-8xl w-full items-center justify-between font-mono text-sm lg:flex flex-col space-y-2">
        <h1 className="text-4xl font-bold text-center lg:text-left mb-8">Development Site: API Testing</h1>
        {
          process.env.NODE_ENV === 'development' ? (
            children
          ) : (
            <p className="text-center lg:text-left text-red-600">Sorry! This page is only available in development mode.</p>
          )
        }
      </div>
    </main>
  )
}