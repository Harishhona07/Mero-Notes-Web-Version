'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { MdLogout, MdLightMode, MdDarkMode, MdDevices } from 'react-icons/md'

export default function Navbar() {
  const router = useRouter()
  const { user, signOut } = useAuth()
  const { themeMode, setThemeMode } = useTheme()

  const cycleTheme = () => {
    const modes: ('device' | 'light' | 'dark')[] = ['device', 'light', 'dark']
    const currentIndex = modes.indexOf(themeMode)
    const nextMode = modes[(currentIndex + 1) % modes.length]
    setThemeMode(nextMode)
  }

  const ThemeIcon = themeMode === 'light' ? MdLightMode : themeMode === 'dark' ? MdDarkMode : MdDevices

  const handleSignOut = async () => {
    await signOut()
    router.push('/auth')
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group" 
            onClick={() => router.push('/notes')}
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 overflow-hidden rounded-xl bg-black dark:bg-white flex items-center justify-center shadow-sm border border-border/50 group-hover:scale-105 transition-transform duration-200">
              <img 
                src="/mero-notes-logo.png" 
                alt="Mero Notes Logo" 
                className="w-full h-full object-cover dark:invert"
              />
            </div>
            <h1 className="text-xl font-extrabold text-card-foreground tracking-tight group-hover:opacity-80 transition-opacity hidden sm:block">
              Mero Notes
            </h1>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Theme Toggle */}
            <button
              onClick={cycleTheme}
              className="p-2 sm:p-2.5 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200 cursor-pointer"
              title={`Theme: ${themeMode}`}
            >
              <ThemeIcon className="text-xl" />
            </button>

            {/* User Menu */}
            {user && (
              <div className="flex items-center gap-3 ml-2 pl-2 border-l border-border">
                <div className="hidden lg:block text-right">
                  <div className="text-sm font-semibold text-card-foreground">
                    {user.user_metadata?.full_name ?? 'User'}
                  </div>
                  <div className="text-xs text-muted-foreground font-medium">
                    {user.email}
                  </div>
                </div>
                {user.user_metadata?.avatar_url ? (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt="Avatar"
                    className="w-9 h-9 rounded-full ring-2 ring-transparent hover:ring-accent transition-all cursor-pointer"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-bold">
                    {(user.user_metadata?.full_name?.[0] ?? 'U').toUpperCase()}
                  </div>
                )}
                <button
                  onClick={handleSignOut}
                  className="hidden sm:flex p-2.5 rounded-xl text-muted-foreground hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400 transition-all duration-200 cursor-pointer"
                  title="Sign out"
                >
                  <MdLogout className="text-xl" />
                </button>
              </div>
            )}

            {!user && (
              <button
                onClick={() => router.push('/auth')}
                className="ml-1 sm:ml-2 px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base rounded-xl bg-foreground text-background font-semibold hover:opacity-90 transition-all duration-200 cursor-pointer"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>


    </nav>
  )
}
