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
  isRefetching: boolean
  refetch: () => Promise<void>
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
  const [isRefetching, setIsRefetching] = useState(false)
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
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notes' }, fetchData)
      .subscribe()

    const categoriesChannel = supabase
      .channel('categories-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, fetchData)
      .subscribe()

    return () => {
      supabase.removeChannel(notesChannel)
      supabase.removeChannel(categoriesChannel)
    }
  }, [user])

  const fetchData = async () => {
    if (!user) return

    setIsLoading(true)
    await fetchFromDB()
    setIsLoading(false)
  }

  const refetch = async () => {
    if (!user) return
    setIsRefetching(true)
    await fetchFromDB()
    setIsRefetching(false)
  }

  const fetchFromDB = async () => {
    if (!user) return
    // Fetch categories
    const { data: categoriesData } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })

    if (categoriesData) {
      setCategories(
        categoriesData.map((cat, index) => ({
          id: cat.id,
          name: cat.name,
          icon: cat.icon,
          createdAt: new Date(cat.created_at),
          sortOrder: index,
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

    await supabase.from('notes').update({
      title,
      content,
      category_id: dbCategoryId,
      updated_at: new Date().toISOString(),
    }).eq('id', id)
  }

  const deleteNote = async (id: string) => {
    await supabase.from('notes').delete().eq('id', id)
  }

  const getNote = (id: string) => notes.find((note) => note.id === id)

  const addCategory = async (name: string, icon: string): Promise<string> => {
    if (!user) return ''

    const { data } = await supabase
      .from('categories')
      .insert({
        user_id: user.id,
        name,
        icon,
      })
      .select()
      .single()

    return data?.id ?? ''
  }

  const updateCategory = async (id: string, name: string, icon: string) => {
    await supabase.from('categories').update({ name, icon }).eq('id', id)
  }

  const deleteCategory = async (id: string) => {
    // First, set all notes with this category to uncategorized
    await supabase
      .from('notes')
      .update({ category_id: DB_UNCATEGORIZED })
      .eq('category_id', id)

    // Then delete the category
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
        isRefetching,
        refetch,
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
