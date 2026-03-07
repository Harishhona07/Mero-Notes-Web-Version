'use client'

import type { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Navbar from '@/components/navigation/navbar'
import Link from 'next/link'
import { MdBolt, MdFolder, MdSync, MdShield, MdDevices, MdSearch, MdAndroid } from 'react-icons/md'
import { FcGoogle } from 'react-icons/fc'

export default function Home() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-10 sm:py-14 md:py-20">
        <section className="relative overflow-hidden rounded-3xl border border-border bg-card px-4 py-8 sm:px-6 sm:py-10 md:px-12 md:py-16 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-3 motion-safe:duration-500">
          <div className="pointer-events-none absolute -top-32 -right-24 h-64 w-64 rounded-full bg-foreground/5 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 -left-20 h-56 w-56 rounded-full bg-foreground/10 blur-3xl" />

          <div className="relative max-w-3xl">
            <p className="inline-flex w-full sm:w-fit items-center gap-2 rounded-full border border-border bg-background px-4 py-1.5 text-sm font-semibold text-muted-foreground motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-500 [animation-delay:80ms]">
              <MdBolt className="text-base" />
              Fast, focused synced note-taking for everyday work
            </p>
            <h1 className="mt-5 sm:mt-6 text-[2.1rem] sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.05] motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-500 [animation-delay:140ms]">
              Simple & Minimal
              <br />
              Note Taking App
            </h1>
            <p className="mt-4 sm:mt-5 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-500 [animation-delay:220ms]">
              Mero Notes helps you capture ideas, organize by category, and find what matters in seconds. A calm workspace with speed where it counts.
            </p>

            <div className="mt-7 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-500 [animation-delay:300ms]">
              {isLoading ? (
                <div className="h-12 w-full sm:w-40 rounded-xl bg-muted animate-pulse" />
              ) : user ? (
                <button
                  onClick={() => router.push('/notes')}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-foreground text-background font-bold hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Open My Notes
                </button>
              ) : (
                <button
                  onClick={() => router.push('/auth')}
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-foreground text-background font-bold hover:opacity-90 transition-opacity cursor-pointer"
                >
                  <FcGoogle className="text-xl" />
                  Sign In With Google
                </button>
              )}

              <Link
                href="#"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 rounded-xl border border-border bg-background font-semibold text-foreground hover:bg-muted hover:border-foreground/30 transition-all cursor-pointer"
              >
                <MdAndroid className="text-lg shrink-0" />
                Download Android App
                <span className="ml-1 inline-flex items-center rounded-md border border-border bg-secondary/80 px-2 py-0.5 text-[10px] font-extrabold tracking-wide text-muted-foreground">
                  APK
                </span>
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-12 sm:mt-14 md:mt-16 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-3 motion-safe:duration-500 [animation-delay:150ms]">
          <div className="max-w-2xl motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-500 [animation-delay:180ms]">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">Built for focus, not friction</h2>
            <p className="mt-3 text-muted-foreground text-lg">
              Everything you need to keep notes tidy, searchable, and always available.
            </p>
          </div>

          <div className="mt-7 sm:mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            <FeatureCard
              delay={220}
              icon={<MdFolder className="text-2xl" />}
              title="Smart Categories"
              description="Group your notes into meaningful buckets so your workspace stays clean and easy to browse."
            />
            <FeatureCard
              delay={280}
              icon={<MdSearch className="text-2xl" />}
              title="Instant Search"
              description="Find notes by title, content, or category with responsive search built into every core screen."
            />
            <FeatureCard
              delay={340}
              icon={<MdSync className="text-2xl" />}
              title="Live Refetch"
              description="Fresh data on navigation and one-click refresh, with smooth skeleton states for zero-jank updates."
            />
            <FeatureCard
              delay={400}
              icon={<MdDevices className="text-2xl" />}
              title="Cross-Device Sync"
              description="Synced in both web and Android app, so your latest notes are always available on every device."
            />
            <FeatureCard
              delay={460}
              icon={<MdShield className="text-2xl" />}
              title="Google Sign-In"
              description="Simple and secure authentication flow powered by Supabase and Google OAuth."
            />
            <FeatureCard
              delay={520}
              icon={<MdBolt className="text-2xl" />}
              title="Fast Editing"
              description="Create, edit, and organize notes quickly with a clean editor and frictionless interactions."
            />
          </div>
        </section>

        <section className="mt-12 sm:mt-14 md:mt-16 rounded-3xl border border-dashed border-border bg-card px-4 sm:px-6 py-8 sm:py-10 md:px-10 text-center motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-3 motion-safe:duration-500 [animation-delay:260ms]">
          <h3 className="text-2xl md:text-3xl font-black tracking-tight">Start writing in under a minute</h3>
          <p className="mt-3 text-muted-foreground text-lg max-w-2xl mx-auto">
            Sign in, create your first category, and keep your thoughts organized from day one.
          </p>
          {!isLoading && !user && (
            <button
              onClick={() => router.push('/auth')}
              className="mt-6 inline-flex w-full sm:w-auto items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-foreground text-background font-bold hover:opacity-90 transition-opacity cursor-pointer"
            >
              <FcGoogle className="text-xl" />
              Continue With Google
            </button>
          )}
        </section>
      </main>
    </div>
  )
}

function FeatureCard({ icon, title, description, delay = 0 }: { icon: ReactNode; title: string; description: string; delay?: number }) {
  return (
    <article
      className="rounded-2xl border border-border bg-card p-5 sm:p-6 hover:shadow-md transition-shadow motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-500"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground">
        {icon}
      </div>
      <h3 className="mt-4 text-xl font-bold tracking-tight">{title}</h3>
      <p className="mt-2 text-muted-foreground leading-relaxed">{description}</p>
    </article>
  )
}
