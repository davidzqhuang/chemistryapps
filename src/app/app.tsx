'use client'

import Image from 'next/image'
import { useSession, signIn, signOut } from 'next-auth/react'
import { Session } from 'next-auth'

import { Button } from '@/components/ui/button'

export default function App() {
  return (
    <div className="max-w-6xl mx-auto py-10 px-4">

      <div className="space-y-2">
        <div className="p-4">
          <Button variant="outline" onClick={() => signOut()}>Sign out</Button>
        </div>
        <div>
          <a href="/rdkitrender">
            <div className="bg-slate-200 p-4 text-center rounded-md flex flex-col py-2 text-blue-500 hover:underline">
              RDKit Render
            </div>
          </a>
        </div>
        <div>
          <a href="/rdkitmoleculestructure">
            <div className="bg-slate-200 p-4 text-center rounded-md flex flex-col py-2 text-blue-500 hover:underline">
              RDKit using MoleculeStructure component
            </div>
          </a>
        </div>
        {
          process.env.NODE_ENV === 'development' ? (
            <div>
              <a href="/dev/api">
                <div className="bg-orange-200 p-4 text-center rounded-md flex flex-col py-2 text-blue-500 hover:underline">
                  API Testing
                </div>
              </a>
            </div>
          ) : null
        }
      </div>
    </div>
  )
}
