'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useNotes } from '@/contexts/NotesContext'
import { useTheme } from '@/contexts/ThemeContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { MdLightMode, MdDarkMode, MdDevices, MdLogout, MdPerson } from 'react-icons/md'
import PageNav from '@/components/navigation/PageNav'
import PageContainer from '@/components/layout/PageContainer'
import PageHeader from '@/components/layout/PageHeader'
import SettingsSkeleton from '@/components/skeletons/SettingsSkeleton'
import AlertDialog from '@/components/ui/AlertDialog'

export default function SettingsPage() {
  const { user, signOut } = useAuth()
  const { isLoading, isRefetching, refetch } = useNotes()
  const { themeMode, setThemeMode } = useTheme()
  const router = useRouter()
  const [showSignOutDialog, setShowSignOutDialog] = useState(false)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { refetch() }, [])

  const displayName = user?.user_metadata?.full_name ?? 'User'
  const email = user?.email ?? ''
  const avatarUrl = user?.user_metadata?.avatar_url

  const confirmSignOut = async () => {
    await signOut()
    setShowSignOutDialog(false)
    router.push('/auth')
  }

  if (isLoading) {
    return <PageContainer><SettingsSkeleton /></PageContainer>
  }

  return (
    <PageContainer>
      <AlertDialog
        open={showSignOutDialog}
        variant="danger"
        title="Sign out from your account?"
        description="You can sign back in anytime with Google."
        confirmLabel="Sign Out"
        onConfirm={confirmSignOut}
        onCancel={() => setShowSignOutDialog(false)}
      />

      <PageHeader
        title="Settings"
        subtitle="Manage your account and preferences"
      />
      <PageNav showSearch={false} />

      {isRefetching ? (
        <SettingsSkeleton contentOnly />
      ) : (<>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Account Section */}
        <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
          <MdPerson className="text-3xl text-muted-foreground" />
          Account Profile
        </h2>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Avatar"
              className="w-24 h-24 rounded-full border-4 border-background shadow-md"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center border-4 border-background shadow-md">
              <MdPerson className="text-4xl text-muted-foreground" />
            </div>
          )}
          <div className="text-center sm:text-left mt-2 flex-1">
            <p className="text-2xl font-bold text-foreground">
              {displayName}
            </p>
            <p className="text-muted-foreground text-lg">
              {email}
            </p>
            {/* Google badge */}
            <div className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 bg-secondary/60 border border-border rounded-full">
              <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span className="text-xs font-semibold text-muted-foreground">Connected with Google</span>
            </div>
          </div>

        </div>
        <div className="pt-6 border-t border-border">
          <button
            onClick={() => setShowSignOutDialog(true)}
            className="w-full cursor-pointer bg-red-700 sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-destructive/10 text-destructive rounded-full font-bold hover:bg-destructive hover:text-destructive-foreground transition-colors active:scale-95"
          >
            <MdLogout className="text-xl text-white" />
            <span className="text-white">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Theme Section */}
      <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-3">
            <MdLightMode className="text-3xl text-muted-foreground" />
            Appearance
          </h2>
          <p className="text-muted-foreground">
            Customize how Mero Notes looks on your device
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { mode: 'device' as const, label: 'System Setup', Icon: MdDevices },
            { mode: 'light' as const, label: 'Light Mode', Icon: MdLightMode },
            { mode: 'dark' as const, label: 'Dark Mode', Icon: MdDarkMode },
          ].map(({ mode, label, Icon }) => (
            <button
              key={mode}
              onClick={() => setThemeMode(mode)}
              className={`flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 transition-all cursor-pointer ${
                themeMode === mode
                  ? 'bg-foreground text-background border-foreground shadow-md scale-[1.02]'
                  : 'bg-secondary/30 text-muted-foreground border-transparent hover:bg-secondary hover:text-foreground hover:scale-[1.02]'
              }`}
            >
              <Icon className="text-4xl mb-1" />
              <span className="font-bold">{label}</span>
            </button>
          ))}
        </div>
      </div>
      </div>

      {/* About Section — full width */}
      <div className="text-center py-6 bg-card border border-dashed border-border rounded-3xl">
        <p className="font-bold text-foreground text-lg">
          Mero Notes Web
        </p>
        <p className="text-muted-foreground mt-1">
          Crafted with Next.js, Tailwind, and Supabase
        </p>
        <div className="flex items-center justify-center gap-4 mt-5 text-sm text-foreground/80 font-medium">
          <Link href="/terms-of-service" className="hover:text-foreground hover:underline transition-all">
            Terms of Service
          </Link>
          <span className="text-border">&bull;</span>
          <Link href="/privacy-policy" className="hover:text-foreground hover:underline transition-all">
            Privacy Policy
          </Link>
        </div>
        <p className="text-muted-foreground/50 text-sm mt-5">
          Version 1.0.0
        </p>
      </div>
      </>)}
    </PageContainer>
  )
}
