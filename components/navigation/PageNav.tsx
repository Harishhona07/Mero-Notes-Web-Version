'use client'

import { useRouter, usePathname } from 'next/navigation'
import { MdNotes, MdCategory, MdSettings, MdSearch, MdRefresh } from 'react-icons/md'

const navItems = [
  { path: '/notes', label: 'Notes', icon: MdNotes },
  { path: '/categories', label: 'Categories', icon: MdCategory },
  { path: '/settings', label: 'Settings', icon: MdSettings },
]

interface PageNavProps {
  searchQuery?: string
  onSearchChange?: (query: string) => void
  showSearch?: boolean
  onRefresh?: () => void
  isRefreshing?: boolean
}

export default function PageNav({ searchQuery = '', onSearchChange, showSearch = true, onRefresh, isRefreshing = false }: PageNavProps) {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <div className="flex flex-wrap items-center gap-2 mb-8">
      {/* Nav Pills */}
      <div className="flex items-center gap-1 bg-input border border-border rounded-2xl p-1">
        {navItems.map(({ path, label, icon: Icon }) => {
          const isActive = pathname === path
          return (
            <button
              key={path}
              onClick={() => router.push(path)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-foreground text-background shadow-sm'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <Icon className="text-[1.2rem]" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          )
        })}
      </div>



      {/* Search Bar */}
      {showSearch && (
        <div className="flex-1 min-w-[180px] relative group">
          <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-muted-foreground group-focus-within:text-accent transition-colors" />
          <input
            type="text"
            placeholder="Search here..."
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-input border border-border rounded-2xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
          />
        </div>
      )}
            {/* Refresh Button */}
      {onRefresh && (
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          title="Refresh"
          className="flex p-3 rounded-2xl bg-input border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        ><MdRefresh className={`text-[1.3rem] mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
        </button>
      )}
    </div>
  )
}
