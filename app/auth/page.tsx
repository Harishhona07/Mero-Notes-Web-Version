'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { FcGoogle } from 'react-icons/fc'

export default function AuthPage() {
  const { user, isLoading, signInWithGoogle } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push('/notes')
    }
  }, [user, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-foreground animate-pulse font-medium">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md px-6 flex flex-col items-center">
        <div className="text-center mb-10">
          <div className="w-24 h-24 overflow-hidden rounded-3xl bg-black dark:bg-white flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-black/10 dark:shadow-white/10 ring-1 ring-border/50 transition-transform hover:scale-105 duration-300">
            <img 
              src="/mero-notes-logo.png" 
              alt="Mero Notes Logo" 
              className="w-full h-full object-cover dark:invert"
            />
          </div>
          <h1 className="text-4xl font-extrabold text-foreground tracking-tight mb-3">
            Mero Notes
          </h1>
          <p className="text-muted-foreground text-lg">
            Simple, elegant note-taking
          </p>
        </div>

        <div className="w-full bg-card border border-card-border rounded-3xl p-8 sm:p-10 shadow-sm">
          <button
            onClick={signInWithGoogle}
            className="cursor-pointer w-full flex items-center justify-center gap-3 bg-white text-black border border-gray-200 rounded-xl px-6 py-4 font-semibold text-base hover:bg-gray-50 focus:ring-4 focus:ring-gray-100 transition-all active:scale-[0.98]"
          >
            <FcGoogle className="text-2xl" />
            <span>Continue with Google</span>
          </button>

          <p className="text-center text-sm text-muted-foreground mt-8">
            By continuing, you confirm you are at least 13 years old and agree to our <br className="hidden sm:block"/>
            <a href="/terms-of-service" className="text-foreground font-medium underline hover:text-foreground/80 transition-colors">Terms of Service</a> and <a href="/privacy-policy" className="text-foreground font-medium underline hover:text-foreground/80 transition-colors">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  )
}
