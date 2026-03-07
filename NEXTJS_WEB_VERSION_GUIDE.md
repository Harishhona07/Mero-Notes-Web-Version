# Next.js Web Version Guide - Mero Notes

Complete guide for creating a web version of the Mero Notes mobile app using Next.js, with the exact same design theme, Supabase database, and Google OAuth authentication.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Design Theme Reference](#design-theme-reference)
3. [Project Setup](#project-setup)
4. [Supabase Integration](#supabase-integration)
5. [Project Structure](#project-structure)
6. [Implementation Guide](#implementation-guide)
7. [Build & Deploy](#build--deploy)

---

## Project Overview

### Features to Implement
- ✅ Google OAuth authentication (same Supabase auth)
- ✅ Notes CRUD (Create, Read, Update, Delete)
- ✅ Categories management with custom icons
- ✅ Dark/Light/Device theme switching
- ✅ Search functionality
- ✅ Batch operations (delete multiple notes/categories)
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Real-time sync with mobile app via shared Supabase database

### Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (existing database)
- **Auth**: Supabase Auth with Google OAuth
- **Icons**: React Icons (Material Icons)
- **State**: React Context API

---

## Design Theme Reference

### Color Palette (from Mobile App)

```typescript
// constants/theme.ts

export const Colors = {
  light: {
    text: '#11181C',           // Primary text
    background: '#fff',        // Main background
    tint: '#000000',          // Accent/primary color
    icon: '#687076',          // Secondary text/icons
    tabIconDefault: '#687076', // Inactive tab icons
    tabIconSelected: '#000000' // Active tab icons
  },
  dark: {
    text: '#ECEDEE',          // Primary text
    background: '#151718',     // Main background
    tint: '#fff',             // Accent/primary color
    icon: '#9BA1A6',          // Secondary text/icons
    tabIconDefault: '#9BA1A6', // Inactive tab icons
    tabIconSelected: '#fff'    // Active tab icons
  }
};

// Additional UI colors
export const UIColors = {
  light: {
    cardBackground: '#ffffff',
    cardBorder: '#e5e5e5',
    divider: '#e5e5e5',
    hover: '#f5f5f5',
    inputBackground: '#f9f9f9',
    inputBorder: '#e0e0e0'
  },
  dark: {
    cardBackground: '#1c1c1e',
    cardBorder: '#2c2c2e',
    divider: '#2c2c2e',
    hover: '#2c2c2e',
    inputBackground: '#1c1c1e',
    inputBorder: '#2c2c2e'
  }
};
```

### Typography

```typescript
// Font stack (system fonts for performance)
const fontFamily = {
  sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  mono: "ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, monospace"
};

// Font sizes
const fontSize = {
  xs: '0.75rem',    // 12px
  sm: '0.875rem',   // 14px
  base: '1rem',     // 16px
  lg: '1.125rem',   // 18px
  xl: '1.25rem',    // 20px
  '2xl': '1.5rem',  // 24px
  '3xl': '1.875rem' // 30px
};
```

### UI Component Styles

```css
/* Button styles */
.btn-primary {
  background: var(--tint);
  color: var(--background);
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 500;
}

/* Card styles */
.card {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 12px;
  padding: 16px;
}

/* Input styles */
.input {
  background: var(--input-bg);
  border: 1px solid var(--input-border);
  border-radius: 8px;
  padding: 12px 16px;
  color: var(--text);
}

/* Note preview */
.note-preview {
  min-height: 80px;
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s;
}
```

---

## Project Setup

### Step 1: Create Next.js Project

```bash
# Create new Next.js app with TypeScript and Tailwind
npx create-next-app@latest mero-notes-web --typescript --tailwind --app --no-src-dir

cd mero-notes-web
```

### Step 2: Install Dependencies

```bash
# Supabase client
npm install @supabase/supabase-js @supabase/ssr

# Icons
npm install react-icons

# Additional utilities
npm install clsx tailwind-merge
```

### Step 3: Environment Variables

Create `.env.local` in project root:

```env
# Supabase Configuration (SAME as mobile app)
NEXT_PUBLIC_SUPABASE_URL=https://tozxddnjsslljyastpgc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...MlQI

# Site URL (for OAuth redirects)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> ⚠️ **Important**: Use the EXACT same Supabase URL and anon key from your mobile app to share the database.

### Step 4: Update Supabase Redirect URLs

1. Go to: https://supabase.com/dashboard/project/tozxddnjsslljyastpgc/auth/url-configuration
2. Add these URLs to **Redirect URLs**:
   ```
   http://localhost:3000/auth/callback
   https://yourdomain.com/auth/callback
   ```

3. **Site URL**: `https://yourdomain.com` (or `http://localhost:3000` for dev)

---

## Supabase Integration

### Create Supabase Client

**File**: `lib/supabase/client.ts`

```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

**File**: `lib/supabase/server.ts`

```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createServerClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component - ignore
          }
        },
      },
    }
  )
}
```

**File**: `lib/supabase/middleware.ts`

```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session if expired
  await supabase.auth.getUser()

  return supabaseResponse
}
```

**File**: `middleware.ts` (in project root)

```typescript
import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

---

## Project Structure

```
mero-notes-web/
├── app/
│   ├── layout.tsx              # Root layout with ThemeProvider
│   ├── page.tsx                # Home page (redirects to /notes or /auth)
│   ├── globals.css             # Tailwind + theme CSS variables
│   ├── auth/
│   │   ├── callback/
│   │   │   └── route.ts        # OAuth callback handler
│   │   └── page.tsx            # Auth page (Google sign-in)
│   ├── notes/
│   │   ├── layout.tsx          # Protected layout (requires auth)
│   │   ├── page.tsx            # Notes list (main screen)
│   │   ├── new/
│   │   │   └── page.tsx        # New note editor
│   │   └── [id]/
│   │       └── page.tsx        # Edit note
│   ├── categories/
│   │   └── page.tsx            # Categories management
│   └── settings/
│       └── page.tsx            # Settings (theme, account)
├── components/
│   ├── ui/
│   │   ├── button.tsx          # Reusable button component
│   │   ├── card.tsx            # Card component
│   │   ├── dialog.tsx          # Modal dialog
│   │   ├── input.tsx           # Input field
│   │   └── icon.tsx            # Material icon wrapper
│   ├── notes/
│   │   ├── note-card.tsx       # Note preview card
│   │   ├── note-editor.tsx     # Note editor component
│   │   └── note-list.tsx       # Notes list with search/filter
│   ├── categories/
│   │   ├── category-badge.tsx  # Category pill/badge
│   │   ├── category-modal.tsx  # Add/edit category modal
│   │   └── icon-picker.tsx     # Icon selection grid
│   ├── navigation/
│   │   ├── navbar.tsx          # Top navigation bar
│   │   └── sidebar.tsx         # Desktop sidebar navigation
│   └── theme-toggle.tsx        # Theme switcher button
├── contexts/
│   ├── AuthContext.tsx         # Auth state management
│   ├── NotesContext.tsx        # Notes & categories state
│   └── ThemeContext.tsx        # Theme preference state
├── hooks/
│   ├── useAuth.ts              # Auth hook
│   ├── useNotes.ts             # Notes hook
│   └── useTheme.ts             # Theme hook
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # Browser Supabase client
│   │   ├── server.ts           # Server Supabase client
│   │   └── middleware.ts       # Session refresh middleware
│   ├── types.ts                # TypeScript types (Note, Category)
│   └── utils.ts                # Utility functions (cn, formatDate)
├── constants/
│   └── theme.ts                # Theme colors and constants
├── middleware.ts               # Next.js middleware
├── tailwind.config.ts          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
└── package.json
```

---

## Implementation Guide

### 1. Setup Tailwind with Theme

**File**: `tailwind.config.ts`

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Light mode
        'light-text': '#11181C',
        'light-bg': '#ffffff',
        'light-tint': '#000000',
        'light-icon': '#687076',
        'light-card-bg': '#ffffff',
        'light-card-border': '#e5e5e5',
        'light-divider': '#e5e5e5',
        'light-hover': '#f5f5f5',
        'light-input-bg': '#f9f9f9',
        'light-input-border': '#e0e0e0',
        
        // Dark mode
        'dark-text': '#ECEDEE',
        'dark-bg': '#151718',
        'dark-tint': '#ffffff',
        'dark-icon': '#9BA1A6',
        'dark-card-bg': '#1c1c1e',
        'dark-card-border': '#2c2c2e',
        'dark-divider': '#2c2c2e',
        'dark-hover': '#2c2c2e',
        'dark-input-bg': '#1c1c1e',
        'dark-input-border': '#2c2c2e',
      },
      fontFamily: {
        sans: ["system-ui", "-apple-system", "BlinkMacSystemFont", "'Segoe UI'", "Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
```

**File**: `app/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --text: #11181C;
    --background: #ffffff;
    --tint: #000000;
    --icon: #687076;
    --card-bg: #ffffff;
    --card-border: #e5e5e5;
    --divider: #e5e5e5;
    --hover: #f5f5f5;
    --input-bg: #f9f9f9;
    --input-border: #e0e0e0;
  }

  .dark {
    --text: #ECEDEE;
    --background: #151718;
    --tint: #ffffff;
    --icon: #9BA1A6;
    --card-bg: #1c1c1e;
    --card-border: #2c2c2e;
    --divider: #2c2c2e;
    --hover: #2c2c2e;
    --input-bg: #1c1c1e;
    --input-border: #2c2c2e;
  }

  body {
    background-color: var(--background);
    color: var(--text);
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}
```

### 2. TypeScript Types

**File**: `lib/types.ts`

```typescript
// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          display_name: string | null
          avatar_url: string | null
          created_at: string
        }
      }
      categories: {
        Row: {
          id: string
          user_id: string
          name: string
          icon: string
          sort_order: number
          created_at: string
        }
      }
      notes: {
        Row: {
          id: string
          user_id: string
          category_id: string | null
          title: string
          content: string
          created_at: string
          updated_at: string
        }
      }
    }
  }
}

// App types (camelCase for frontend)
export interface Category {
  id: string
  name: string
  icon: string
  createdAt: Date
  sortOrder: number
}

export interface Note {
  id: string
  title: string
  content: string
  categoryId: string // 'uncategorized' for null category_id
  createdAt: Date
  updatedAt: Date
}

export const UNCATEGORIZED_CATEGORY: Category = {
  id: 'uncategorized',
  name: 'Uncategorized',
  icon: 'question-mark',
  createdAt: new Date(0),
  sortOrder: -1,
}

export type ThemeMode = 'device' | 'light' | 'dark'

// Material icon names (same as mobile app)
export type IconName = 
  | 'work'
  | 'person'
  | 'lightbulb'
  | 'checklist'
  | 'folder'
  | 'label'
  | 'star'
  | 'favorite'
  | 'home'
  | 'shopping-cart'
  | 'receipt'
  | 'school'
  | 'fitness-center'
  | 'travel-explore'
  | 'restaurant'
  | 'music-note'
  | 'sports-soccer'
  | 'videogame-asset'
  | 'palette'
  | 'code'
```

### 3. Theme Context

**File**: `contexts/ThemeContext.tsx`

```typescript
'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

const THEME_STORAGE_KEY = 'theme_preference'

export type ThemeMode = 'device' | 'light' | 'dark'

interface ThemeContextType {
  themeMode: ThemeMode
  setThemeMode: (mode: ThemeMode) => void
  colorScheme: 'light' | 'dark'
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeMode, setThemeModeState] = useState<ThemeMode>('device')
  const [mounted, setMounted] = useState(false)

  // Load theme preference on mount
  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null
    if (stored) {
      setThemeModeState(stored)
    }
  }, [])

  const setThemeMode = (mode: ThemeMode) => {
    localStorage.setItem(THEME_STORAGE_KEY, mode)
    setThemeModeState(mode)
  }

  // Determine color scheme
  const colorScheme: 'light' | 'dark' = 
    themeMode === 'device'
      ? (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light')
      : themeMode === 'dark'
        ? 'dark'
        : 'light'

  // Apply theme to HTML element
  useEffect(() => {
    if (mounted) {
      document.documentElement.classList.toggle('dark', colorScheme === 'dark')
    }
  }, [colorScheme, mounted])

  return (
    <ThemeContext.Provider value={{ themeMode, setThemeMode, colorScheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
```

### 4. Auth Context

**File**: `contexts/AuthContext.tsx`

```typescript
'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      console.error('Error signing in:', error)
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
```

### 5. Notes Context

**File**: `contexts/NotesContext.tsx`

```typescript
'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from './AuthContext'
import type { Note, Category } from '@/lib/types'
import { UNCATEGORIZED_CATEGORY } from '@/lib/types'

// DB field mapping
const DB_UNCATEGORIZED = null
const APP_UNCATEGORIZED = 'uncategorized'

interface NotesContextType {
  notes: Note[]
  categories: Category[]
  allCategories: Category[]
  isLoading: boolean
  addNote: (title: string, content: string, categoryId?: string) => Promise<void>
  updateNote: (id: string, title: string, content: string, categoryId?: string) => Promise<void>
  deleteNote: (id: string) => Promise<void>
  getNote: (id: string) => Note | undefined
  addCategory: (name: string, icon: string) => Promise<string>
  updateCategory: (id: string, name: string, icon: string) => Promise<void>
  deleteCategory: (id: string) => Promise<void>
  getCategory: (id: string) => Category | undefined
}

const NotesContext = createContext<NotesContextType | undefined>(undefined)

export function NotesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [notes, setNotes] = useState<Note[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  // Computed property: all categories including uncategorized
  const allCategories = [UNCATEGORIZED_CATEGORY, ...categories]

  // Fetch notes and categories
  useEffect(() => {
    if (!user) {
      setNotes([])
      setCategories([])
      setIsLoading(false)
      return
    }

    fetchData()

    // Subscribe to real-time updates
    const notesChannel = supabase
      .channel('notes-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notes', filter: `user_id=eq.${user.id}` }, fetchData)
      .subscribe()

    const categoriesChannel = supabase
      .channel('categories-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'categories', filter: `user_id=eq.${user.id}` }, fetchData)
      .subscribe()

    return () => {
      supabase.removeChannel(notesChannel)
      supabase.removeChannel(categoriesChannel)
    }
  }, [user])

  const fetchData = async () => {
    if (!user) return

    setIsLoading(true)

    // Fetch categories
    const { data: categoriesData } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', user.id)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true })

    if (categoriesData) {
      setCategories(
        categoriesData.map((cat) => ({
          id: cat.id,
          name: cat.name,
          icon: cat.icon,
          createdAt: new Date(cat.created_at),
          sortOrder: cat.sort_order,
        }))
      )
    }

    // Fetch notes
    const { data: notesData } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })

    if (notesData) {
      setNotes(
        notesData.map((note) => ({
          id: note.id,
          title: note.title,
          content: note.content,
          categoryId: note.category_id ?? APP_UNCATEGORIZED,
          createdAt: new Date(note.created_at),
          updatedAt: new Date(note.updated_at),
        }))
      )
    }

    setIsLoading(false)
  }

  const addNote = async (title: string, content: string, categoryId: string = APP_UNCATEGORIZED) => {
    if (!user) return

    const dbCategoryId = categoryId === APP_UNCATEGORIZED ? DB_UNCATEGORIZED : categoryId

    await supabase.from('notes').insert({
      user_id: user.id,
      title,
      content,
      category_id: dbCategoryId,
    })
  }

  const updateNote = async (id: string, title: string, content: string, categoryId: string = APP_UNCATEGORIZED) => {
    const dbCategoryId = categoryId === APP_UNCATEGORIZED ? DB_UNCATEGORIZED : categoryId

    await supabase
      .from('notes')
      .update({
        title,
        content,
        category_id: dbCategoryId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
  }

  const deleteNote = async (id: string) => {
    await supabase.from('notes').delete().eq('id', id)
  }

  const getNote = (id: string) => notes.find((note) => note.id === id)

  const addCategory = async (name: string, icon: string): Promise<string> => {
    if (!user) return ''

    const maxSortOrder = categories.reduce((max, cat) => Math.max(max, cat.sortOrder), 0)

    const { data } = await supabase
      .from('categories')
      .insert({
        user_id: user.id,
        name,
        icon,
        sort_order: maxSortOrder + 1,
      })
      .select()
      .single()

    return data?.id ?? ''
  }

  const updateCategory = async (id: string, name: string, icon: string) => {
    await supabase.from('categories').update({ name, icon }).eq('id', id)
  }

  const deleteCategory = async (id: string) => {
    await supabase.from('categories').delete().eq('id', id)
  }

  const getCategory = (id: string) => allCategories.find((cat) => cat.id === id)

  return (
    <NotesContext.Provider
      value={{
        notes,
        categories,
        allCategories,
        isLoading,
        addNote,
        updateNote,
        deleteNote,
        getNote,
        addCategory,
        updateCategory,
        deleteCategory,
        getCategory,
      }}
    >
      {children}
    </NotesContext.Provider>
  )
}

export function useNotes() {
  const context = useContext(NotesContext)
  if (!context) {
    throw new Error('useNotes must be used within NotesProvider')
  }
  return context
}
```

### 6. Root Layout

**File**: `app/layout.tsx`

```typescript
import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotesProvider } from "@/contexts/NotesContext";

export const metadata: Metadata = {
  title: "Mero Notes",
  description: "Simple, elegant note-taking app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <AuthProvider>
            <NotesProvider>
              {children}
            </NotesProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### 7. Auth Page

**File**: `app/auth/page.tsx`

```typescript
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--tint)]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
      <div className="max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-[var(--tint)] rounded-2xl flex items-center justify-center">
            <span className="text-4xl">📝</span>
          </div>
          <h1 className="text-3xl font-bold text-[var(--text)] mb-2">Mero Notes</h1>
          <p className="text-[var(--icon)]">Simple, elegant note-taking</p>
        </div>

        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-8">
          <h2 className="text-xl font-semibold text-[var(--text)] mb-6 text-center">
            Sign in to continue
          </h2>

          <button
            onClick={signInWithGoogle}
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 border border-gray-300 rounded-lg px-6 py-3 font-medium hover:bg-gray-50 transition-colors"
          >
            <FcGoogle className="text-2xl" />
            Continue with Google
          </button>

          <p className="text-xs text-[var(--icon)] text-center mt-6">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  )
}
```

**File**: `app/auth/callback/route.ts`

```typescript
import { createServerClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  if (code) {
    const supabase = await createServerClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(`${origin}/notes`)
}
```

### 8. Notes Page

**File**: `app/notes/layout.tsx`

```typescript
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Navbar from '@/components/navigation/navbar'

export default function NotesLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth')
    }
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--tint)]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
```

**File**: `app/notes/page.tsx`

```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useNotes } from '@/contexts/NotesContext'
import { useAuth } from '@/contexts/AuthContext'
import { MdAdd, MdSearch } from 'react-icons/md'

export default function NotesPage() {
  const router = useRouter()
  const { notes, isLoading, deleteNote, allCategories } = useNotes()
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] ?? 'there'

  // Filter notes
  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategoryId || note.categoryId === selectedCategoryId
    return matchesSearch && matchesCategory
  })

  const formatDate = (date: Date) => {
    const now = new Date()
    const noteDate = new Date(date)
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const noteDateMidnight = new Date(noteDate.getFullYear(), noteDate.getMonth(), noteDate.getDate())

    if (noteDateMidnight.getTime() === today.getTime()) return 'Today'
    if (noteDateMidnight.getTime() === yesterday.getTime()) return 'Yesterday'
    return noteDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const getPreview = (content: string) => {
    return content.replace(/\n/g, ' ').trim() || 'No content'
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--tint)]"></div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text)] mb-2">
          Hey, {firstName} 👋
        </h1>
        <p className="text-[var(--icon)]">
          {notes.length} {notes.length === 1 ? 'note' : 'notes'}
        </p>
      </div>

      {/* Search and Category Filter */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--icon)] text-xl" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg text-[var(--text)] placeholder-[var(--icon)] focus:outline-none focus:ring-2 focus:ring-[var(--tint)]"
          />
        </div>

        {/* Category badges */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategoryId(null)}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
              selectedCategoryId === null
                ? 'bg-[var(--tint)] text-[var(--background)]'
                : 'bg-[var(--card-bg)] text-[var(--text)] border border-[var(--card-border)]'
            }`}
          >
            All
          </button>
          {allCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryId(cat.id)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                selectedCategoryId === cat.id
                  ? 'bg-[var(--tint)] text-[var(--background)]'
                  : 'bg-[var(--card-bg)] text-[var(--text)] border border-[var(--card-border)]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-[var(--icon)] mb-4">No notes found</p>
          <button
            onClick={() => router.push('/notes/new')}
            className="px-6 py-3 bg-[var(--tint)] text-[var(--background)] rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Create your first note
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              onClick={() => router.push(`/notes/${note.id}`)}
              className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-4 cursor-pointer hover:bg-[var(--hover)] transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-[var(--text)] line-clamp-1">
                  {note.title || 'Untitled'}
                </h3>
                <span className="text-xs text-[var(--icon)] whitespace-nowrap ml-2">
                  {formatDate(note.updatedAt)}
                </span>
              </div>
              <p className="text-sm text-[var(--icon)] line-clamp-2 mb-3">
                {getPreview(note.content)}
              </p>
              {note.categoryId !== 'uncategorized' && (
                <span className="inline-block px-2 py-1 bg-[var(--input-bg)] text-xs text-[var(--text)] rounded">
                  {allCategories.find((c) => c.id === note.categoryId)?.name}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => router.push('/notes/new')}
        className="fixed bottom-8 right-8 w-14 h-14 bg-[var(--tint)] text-[var(--background)] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
      >
        <MdAdd className="text-3xl" />
      </button>
    </div>
  )
}
```

### 9. Note Editor

**File**: `app/notes/new/page.tsx`

```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useNotes } from '@/contexts/NotesContext'
import { MdArrowBack, MdCheck } from 'react-icons/md'

export default function NewNotePage() {
  const router = useRouter()
  const { addNote, allCategories } = useNotes()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [categoryId, setCategoryId] = useState('uncategorized')
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    await addNote(title || 'Untitled', content, categoryId)
    router.push('/notes')
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-[var(--hover)] rounded-lg transition-colors"
        >
          <MdArrowBack className="text-2xl text-[var(--text)]" />
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2 bg-[var(--tint)] text-[var(--background)] rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          <MdCheck className="text-xl" />
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>

      {/* Category Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-[var(--icon)] mb-2">Category</label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full px-4 py-2 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--tint)]"
        >
          {allCategories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Title Input */}
      <input
        type="text"
        placeholder="Note title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full px-0 py-3 text-2xl font-bold bg-transparent border-none text-[var(--text)] placeholder-[var(--icon)] focus:outline-none mb-4"
      />

      {/* Content Textarea */}
      <textarea
        placeholder="Start writing..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full h-[calc(100vh-320px)] px-0 py-2 bg-transparent border-none text-[var(--text)] placeholder-[var(--icon)] focus:outline-none resize-none"
      />
    </div>
  )
}
```

**File**: `app/notes/[id]/page.tsx`

```typescript
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useNotes } from '@/contexts/NotesContext'
import { MdArrowBack, MdCheck, MdDelete } from 'react-icons/md'

export default function EditNotePage() {
  const router = useRouter()
  const params = useParams()
  const noteId = params.id as string
  const { getNote, updateNote, deleteNote, allCategories } = useNotes()
  
  const note = getNote(noteId)
  
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [categoryId, setCategoryId] = useState('uncategorized')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (note) {
      setTitle(note.title)
      setContent(note.content)
      setCategoryId(note.categoryId)
    }
  }, [note])

  const handleSave = async () => {
    if (!note) return
    setIsSaving(true)
    await updateNote(noteId, title || 'Untitled', content, categoryId)
    router.push('/notes')
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this note?')) return
    await deleteNote(noteId)
    router.push('/notes')
  }

  if (!note) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-[var(--icon)]">Note not found</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-[var(--hover)] rounded-lg transition-colors"
        >
          <MdArrowBack className="text-2xl text-[var(--text)]" />
        </button>
        <div className="flex gap-2">
          <button
            onClick={handleDelete}
            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <MdDelete className="text-2xl text-red-500" />
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2 bg-[var(--tint)] text-[var(--background)] rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <MdCheck className="text-xl" />
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* Category Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-[var(--icon)] mb-2">Category</label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full px-4 py-2 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--tint)]"
        >
          {allCategories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Title Input */}
      <input
        type="text"
        placeholder="Note title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full px-0 py-3 text-2xl font-bold bg-transparent border-none text-[var(--text)] placeholder-[var(--icon)] focus:outline-none mb-4"
      />

      {/* Content Textarea */}
      <textarea
        placeholder="Start writing..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full h-[calc(100vh-320px)] px-0 py-2 bg-transparent border-none text-[var(--text)] placeholder-[var(--icon)] focus:outline-none resize-none"
      />
    </div>
  )
}
```

### 10. Navigation Component

**File**: `components/navigation/navbar.tsx`

```typescript
'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { MdNotes, MdCategory, MdSettings, MdLogout, MdLightMode, MdDarkMode, MdDevices } from 'react-icons/md'

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const { themeMode, setThemeMode, colorScheme } = useTheme()

  const navItems = [
    { path: '/notes', label: 'Notes', icon: MdNotes },
    { path: '/categories', label: 'Categories', icon: MdCategory },
    { path: '/settings', label: 'Settings', icon: MdSettings },
  ]

  const cycleTheme = () => {
    const modes: ('device' | 'light' | 'dark')[] = ['device', 'light', 'dark']
    const currentIndex = modes.indexOf(themeMode)
    const nextMode = modes[(currentIndex + 1) % modes.length]
    setThemeMode(nextMode)
  }

  const ThemeIcon = themeMode === 'light' ? MdLightMode : themeMode === 'dark' ? MdDarkMode : MdDevices

  return (
    <nav className="border-b border-[var(--divider)] bg-[var(--card-bg)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/notes')}>
            <span className="text-2xl">📝</span>
            <span className="text-xl font-bold text-[var(--text)]">Mero Notes</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname.startsWith(item.path)
              return (
                <button
                  key={item.path}
                  onClick={() => router.push(item.path)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-[var(--tint)] text-[var(--background)]'
                      : 'text-[var(--icon)] hover:bg-[var(--hover)]'
                  }`}
                >
                  <Icon className="text-xl" />
                  <span className="font-medium">{item.label}</span>
                </button>
              )
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={cycleTheme}
              className="p-2 text-[var(--icon)] hover:bg-[var(--hover)] rounded-lg transition-colors"
              title={`Theme: ${themeMode}`}
            >
              <ThemeIcon className="text-xl" />
            </button>

            {/* User menu */}
            <div className="flex items-center gap-3 ml-2">
              {user?.user_metadata?.avatar_url ? (
                <img
                  src={user.user_metadata.avatar_url}
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[var(--tint)] text-[var(--background)] flex items-center justify-center font-medium">
                  {user?.user_metadata?.full_name?.charAt(0)?.toUpperCase() ?? 'U'}
                </div>
              )}
              <button
                onClick={async () => {
                  await signOut()
                  router.push('/auth')
                }}
                className="p-2 text-[var(--icon)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                title="Sign out"
              >
                <MdLogout className="text-xl" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex border-t border-[var(--divider)] -mx-4 px-4">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname.startsWith(item.path)
            return (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className={`flex-1 flex flex-col items-center gap-1 py-3 ${
                  isActive ? 'text-[var(--tint)]' : 'text-[var(--icon)]'
                }`}
              >
                <Icon className="text-2xl" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
```

### 11. Categories Page

**File**: `app/categories/page.tsx`

```typescript
'use client'

import { useState } from 'react'
import { useNotes } from '@/contexts/NotesContext'
import { MdAdd, MdEdit, MdDelete } from 'react-icons/md'

export default function CategoriesPage() {
  const { categories, notes, addCategory, updateCategory, deleteCategory } = useNotes()
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('folder')

  const iconOptions = [
    'work', 'person', 'lightbulb', 'checklist', 'folder', 'label',
    'star', 'favorite', 'home', 'shopping-cart', 'receipt', 'school',
    'fitness-center', 'travel-explore', 'restaurant', 'music-note',
    'sports-soccer', 'videogame-asset', 'palette', 'code',
  ]

  const getCategoryNoteCount = (categoryId: string) => {
    return notes.filter((note) => note.categoryId === categoryId).length
  }

  const handleSubmit = async () => {
    if (!name.trim()) return
    
    if (editingId) {
      await updateCategory(editingId, name, icon)
    } else {
      await addCategory(name, icon)
    }
    
    setShowModal(false)
    setEditingId(null)
    setName('')
    setIcon('folder')
  }

  const handleEdit = (cat: any) => {
    setEditingId(cat.id)
    setName(cat.name)
    setIcon(cat.icon)
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    const noteCount = getCategoryNoteCount(id)
    const message = noteCount > 0
      ? `This category has ${noteCount} note(s). They will be moved to Uncategorized. Continue?`
      : 'Are you sure you want to delete this category?'
    
    if (confirm(message)) {
      await deleteCategory(id)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text)] mb-2">Categories</h1>
          <p className="text-[var(--icon)]">{categories.length} categories</p>
        </div>
        <button
          onClick={() => {
            setEditingId(null)
            setName('')
            setIcon('folder')
            setShowModal(true)
          }}
          className="flex items-center gap-2 px-6 py-3 bg-[var(--tint)] text-[var(--background)] rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          <MdAdd className="text-xl" />
          New Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[var(--tint)] bg-opacity-10 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">{cat.icon === 'folder' ? '📁' : '📌'}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--text)]">{cat.name}</h3>
                  <p className="text-sm text-[var(--icon)]">
                    {getCategoryNoteCount(cat.id)} notes
                  </p>
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => handleEdit(cat)}
                  className="p-2 hover:bg-[var(--hover)] rounded-lg transition-colors"
                >
                  <MdEdit className="text-lg text-[var(--icon)]" />
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <MdDelete className="text-lg text-red-500" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--card-bg)] rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-[var(--text)] mb-4">
              {editingId ? 'Edit Category' : 'New Category'}
            </h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-[var(--icon)] mb-2">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Category name"
                className="w-full px-4 py-2 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--tint)]"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-[var(--icon)] mb-2">Icon</label>
              <div className="grid grid-cols-5 gap-2">
                {iconOptions.map((iconName) => (
                  <button
                    key={iconName}
                    onClick={() => setIcon(iconName)}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      icon === iconName
                        ? 'border-[var(--tint)] bg-[var(--tint)] bg-opacity-10'
                        : 'border-[var(--card-border)] hover:bg-[var(--hover)]'
                    }`}
                  >
                    <span className="text-xl">{iconName === 'folder' ? '📁' : '📌'}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-[var(--card-border)] text-[var(--text)] rounded-lg font-medium hover:bg-[var(--hover)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!name.trim()}
                className="flex-1 px-4 py-2 bg-[var(--tint)] text-[var(--background)] rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {editingId ? 'Save' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
```

### 12. Settings Page

**File**: `app/settings/page.tsx`

```typescript
'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { useRouter } from 'next/navigation'
import { MdLightMode, MdDarkMode, MdDevices, MdLogout } from 'react-icons/md'

export default function SettingsPage() {
  const { user, signOut } = useAuth()
  const { themeMode, setThemeMode } = useTheme()
  const router = useRouter()

  const displayName = user?.user_metadata?.full_name ?? 'User'
  const email = user?.email ?? ''
  const avatarUrl = user?.user_metadata?.avatar_url

  const handleSignOut = async () => {
    if (confirm('Are you sure you want to sign out?')) {
      await signOut()
      router.push('/auth')
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-[var(--text)] mb-8">Settings</h1>

      {/* Account Section */}
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-[var(--text)] mb-4">Account</h2>
        <div className="flex items-center gap-4">
          {avatarUrl ? (
            <img src={avatarUrl} alt="Profile" className="w-16 h-16 rounded-full" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-[var(--tint)] text-[var(--background)] flex items-center justify-center text-2xl font-medium">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p className="font-semibold text-[var(--text)]">{displayName}</p>
            <p className="text-sm text-[var(--icon)]">{email}</p>
          </div>
        </div>
      </div>

      {/* Theme Section */}
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-[var(--text)] mb-4">Theme</h2>
        <div className="space-y-3">
          {[
            { value: 'device' as const, label: 'Device Default', icon: MdDevices },
            { value: 'light' as const, label: 'Light', icon: MdLightMode },
            { value: 'dark' as const, label: 'Dark', icon: MdDarkMode },
          ].map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setThemeMode(value)}
              className="w-full flex items-center justify-between p-4 rounded-lg border border-[var(--card-border)] hover:bg-[var(--hover)] transition-colors"
            >
              <div className="flex items-center gap-3">
                <Icon className="text-xl text-[var(--icon)]" />
                <span className="text-[var(--text)]">{label}</span>
              </div>
              {themeMode === value && (
                <div className="w-5 h-5 bg-[var(--tint)] rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-[var(--background)] rounded-full"></div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* About Section */}
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-[var(--text)] mb-4">About</h2>
        <div className="space-y-2 text-sm text-[var(--icon)]">
          <p><strong className="text-[var(--text)]">App Name:</strong> Mero Notes</p>
          <p><strong className="text-[var(--text)]">Version:</strong> 1.0.0</p>
          <p><strong className="text-[var(--text)]">Platform:</strong> Web (Next.js)</p>
        </div>
      </div>

      {/* Sign Out Button */}
      <button
        onClick={handleSignOut}
        className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
      >
        <MdLogout className="text-xl" />
        Sign Out
      </button>
    </div>
  )
}
```

---

## Build & Deploy

### Development

```bash
# Start development server
npm run dev

# Open http://localhost:3000
```

### Build for Production

```bash
# Create optimized production build
npm run build

# Test production build locally
npm start
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - NEXT_PUBLIC_SITE_URL (your Vercel domain)

# Update Supabase redirect URLs with your Vercel domain
```

---

## Checklist

- ✅ Install Next.js with TypeScript and Tailwind
- ✅ Setup Supabase client (browser + server)
- ✅ Add environment variables
- ✅ Update Supabase redirect URLs
- ✅ Implement theme system (light/dark/device)
- ✅ Create auth flow (Google OAuth)
- ✅ Build notes CRUD
- ✅ Build categories management
- ✅ Add search and filtering
- ✅ Implement responsive navigation
- ✅ Test real-time sync with mobile app
- ✅ Deploy to Vercel

---

## Testing Real-Time Sync

1. **Mobile App**: Create a note on your phone
2. **Web App**: Refresh browser - note should appear
3. **Web App**: Edit the note
4. **Mobile App**: Pull to refresh - changes should appear

> The apps share the same Supabase database with real-time subscriptions, so changes sync automatically!

---

## Additional Enhancements (Optional)

### Rich Text Editor
```bash
npm install @tiptap/react @tiptap/starter-kit
```

### Drag & Drop Categories
```bash
npm install @dnd-kit/core @dnd-kit/sortable
```

### PWA Support
```bash
npm install next-pwa
```

### Offline Support
```bash
npm install dexie dexie-react-hooks
```

---

## Support

For issues or questions:
- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs
- Tailwind Docs: https://tailwindcss.com/docs

---

**Happy Coding! 🚀**

Your Next.js web version will have the exact same design, features, and database as your React Native mobile app.
