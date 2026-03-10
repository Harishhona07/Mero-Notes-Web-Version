'use client'

import type { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Navbar from '@/components/navigation/navbar'
import Link from 'next/link'
import { MdBolt, MdFolder, MdSync, MdShield, MdDevices, MdSearch, MdAndroid, MdNote, MdNotificationsActive, MdWifiOff, MdAllInclusive } from 'react-icons/md'
import { FcGoogle } from 'react-icons/fc'
import { motion } from 'framer-motion'

const fadeUp = (delay: number = 0) => ({
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' as const, delay },
  },
})

export default function Home() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 md:py-20">
        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-[2rem] sm:rounded-3xl border border-border bg-card px-5 py-8 sm:px-8 sm:py-10 md:px-12 md:py-16"
        >
          <div className="pointer-events-none absolute -top-32 -right-24 h-64 w-64 rounded-full bg-foreground/5 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 -left-20 h-56 w-56 rounded-full bg-foreground/10 blur-3xl" />

          <div className="relative flex flex-col md:flex-row items-center gap-10 md:gap-12">
            {/* Left: text + buttons */}
            <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left">
            <motion.div
              variants={fadeUp(0.1)}
              initial="hidden"
              animate="show"
              className="inline-flex w-fit max-w-full items-start sm:items-center gap-2 rounded-2xl sm:rounded-full border border-border bg-background px-4 py-2.5 sm:py-1.5 text-sm sm:text-base font-medium sm:font-semibold text-muted-foreground"
            >
              <MdBolt className="text-base sm:text-lg shrink-0 mt-0.5 sm:mt-0 text-foreground" />
              <span className="leading-snug text-foreground/80">Your Notes — Synced Everywhere.</span>
            </motion.div>

            <motion.h1
              variants={fadeUp(0.2)}
              initial="hidden"
              animate="show"
              className="mt-5 sm:mt-6 text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.1] sm:leading-[1.05]"
            >
              Simple & Minimal
              <br />
              Note Taking App
            </motion.h1>

            <motion.p
              variants={fadeUp(0.32)}
              initial="hidden"
              animate="show"
              className="mt-4 sm:mt-5 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed"
            >
              Mero Notes helps you capture ideas, organize by category, and find what matters in seconds. A calm workspace with speed where it counts.
            </motion.p>

            <motion.div
              variants={fadeUp(0.44)}
              initial="hidden"
              animate="show"
              className="mt-7 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center sm:justify-start gap-3 w-full sm:w-auto"
            >
              {isLoading ? (
                <div className="h-12 w-full sm:w-40 rounded-xl bg-muted animate-pulse" />
              ) : user ? (
                <button
                  onClick={() => router.push('/notes')}
                  className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 sm:py-3 text-[15px] sm:text-base rounded-xl bg-foreground text-background font-bold hover:opacity-90 transition-opacity cursor-pointer"
                >
                  <MdNote className="text-xl" />
                  Open My Notes
                </button>
              ) : (
                <button
                  onClick={() => router.push('/auth')}
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-6 py-3.5 sm:py-3 text-[15px] sm:text-base rounded-xl bg-foreground text-background font-bold hover:opacity-90 transition-opacity cursor-pointer"
                >
                  <FcGoogle className="text-xl" />
                  Sign In With Google
                </button>
              )}

              <Link
                href="/mero-notes-4.0.0.apk"
                download
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 sm:py-3 text-[15px] sm:text-base rounded-xl border border-border bg-background font-semibold text-foreground hover:bg-muted hover:border-foreground/30 transition-all cursor-pointer"
              >
                <MdAndroid className="text-lg shrink-0" />
                Download Android App
                <span className="ml-1 inline-flex items-center rounded-md border border-border bg-secondary/80 px-2 py-0.5 text-[10px] font-extrabold tracking-wide text-muted-foreground">
                  APK
                </span>
              </Link>
            </motion.div>
            </div>

            {/* Right: hero GIF */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut', delay: 0.3 }}
              className="shrink-0 w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-3xl overflow-hidden border border-border shadow-xl"
            >
              <img
                src="/hero-gif.gif"
                alt="Mero Notes preview"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </motion.section>

        {/* Features */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 sm:mt-14 md:mt-16"
        >
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">Built for focus, not friction</h2>
            <p className="mt-3 text-muted-foreground text-lg">
              Everything you need to keep notes tidy, searchable, and always available.
            </p>
          </div>

          <div className="mt-7 sm:mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {[
              { icon: <MdDevices className="text-2xl" />, title: 'Cross-Device Sync', description: 'Synced in both web and Android app, so your latest notes are always available on every device.' },
              { icon: <MdSearch className="text-2xl" />, title: 'Instant Search', description: 'Find notes by title, content, or category with responsive search built into every core screen.' },
              { icon: <MdSync className="text-2xl" />, title: 'Live Refetch', description: 'Fresh data on navigation and one-click refresh, with smooth skeleton states for zero-jank updates.' },
              { icon: <MdShield className="text-2xl" />, title: 'Google Sign-In', description: 'Simple and secure authentication flow powered by Supabase and Google OAuth.' },
              { icon: <MdFolder className="text-2xl" />, title: 'Smart Categories', description: 'Group your notes into meaningful buckets so your workspace stays clean and easy to browse.' },
              { icon: <MdBolt className="text-2xl" />, title: 'Fast Editing', description: 'Create, edit, and organize notes quickly with a clean editor and frictionless interactions.' },
              { icon: <MdNotificationsActive className="text-2xl" />, title: 'Set Reminders', description: 'Set customizable reminders directly in the mobile app so you never miss an important thought or task again.' },
              { icon: <MdWifiOff className="text-2xl" />, title: 'Works Offline', description: 'Access, edit, and create notes on your mobile device even without an internet connection.' },
              { icon: <MdAllInclusive className="text-2xl" />, title: 'Universal Platform', description: 'Seamlessly transition between the web app and Android app for a truly universal experience.' },
            ].map((card, i) => (
              <FeatureCard key={card.title} icon={card.icon} title={card.title} description={card.description} index={i} />
            ))}
          </div>
        </motion.section>

        {/* CTA */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 sm:mt-14 md:mt-16 rounded-3xl border border-dashed border-border bg-card px-4 sm:px-6 py-8 sm:py-10 md:px-10 text-center"
        >
          <h3 className="text-2xl md:text-3xl font-black tracking-tight">Keep Your Notes Organized Everywhere.</h3>
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
        </motion.section>
      </main>

      <footer className="border-t border-border mt-10 sm:mt-16 py-8 px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p>
            © {new Date().getFullYear()} Mero Notes. Developed by{' '}
            <a href="https://harishhona.com.np" target="_blank" rel="noopener noreferrer" className="font-medium hover:text-foreground transition-colors underline underline-offset-2">
              Harish Hona
            </a>.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-foreground transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description, index }: { icon: ReactNode; title: string; description: string; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: (index % 3) * 0.08 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="rounded-2xl border border-border bg-card p-5 sm:p-6 hover:shadow-md transition-shadow"
    >
      <div className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground">
        {icon}
      </div>
      <h3 className="mt-4 text-xl font-bold tracking-tight">{title}</h3>
      <p className="mt-2 text-muted-foreground leading-relaxed">{description}</p>
    </motion.article>
  )
}
