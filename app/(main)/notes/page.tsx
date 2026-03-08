'use client'

import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useNotes } from '@/contexts/NotesContext'
import { useAuth } from '@/contexts/AuthContext'
import { MdNote, MdSearch, MdWavingHand } from 'react-icons/md'
import { formatDate } from '@/lib/utils'
import { getCategoryIcon } from '@/lib/categoryIcons'
import PageNav from '@/components/navigation/PageNav'
import PageContainer from '@/components/layout/PageContainer'
import PageHeader from '@/components/layout/PageHeader'
import NotesSkeleton from '@/components/skeletons/NotesSkeleton'
import DailyQuoteCard from '@/components/DailyQuoteCard'

export default function NotesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { notes, isLoading, isRefetching, refetch, deleteNote, allCategories } = useNotes()
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const allChipRef = useRef<HTMLButtonElement | null>(null)
  const categoryChipRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { refetch() }, [])

  useEffect(() => {
    const categoryFromUrl = searchParams.get('category')

    // Keep manual chip selection untouched when URL has no category query.
    if (!categoryFromUrl) {
      return
    }

    const exists = allCategories.some((category) => category.id === categoryFromUrl)
    setSelectedCategoryId(exists ? categoryFromUrl : null)
  }, [searchParams, allCategories])

  useLayoutEffect(() => {
    const target = selectedCategoryId
      ? categoryChipRefs.current[selectedCategoryId]
      : allChipRef.current

    if (target) {
      requestAnimationFrame(() => {
        target.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
      })
    }
  }, [selectedCategoryId])

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] ?? 'there'

  // Filter notes
  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategoryId || note.categoryId === selectedCategoryId
    return matchesSearch && matchesCategory
  })

  const getPreview = (content: string) => {
    // Strip HTML tags and get plain text preview
    const stripped = content.replace(/<[^>]*>/g, '').replace(/\n/g, ' ').trim()
    return stripped.substring(0, 100) || 'No content'
  }

  if (isLoading) {
    return <PageContainer><NotesSkeleton /></PageContainer>
  }

  return (
    <PageContainer>
      <PageHeader
        title={<>Hello, {firstName}! <MdWavingHand className="inline-block ml-2 pb-2 text-3xl" /></>}
        subtitle={`You have ${notes.length} ${notes.length === 1 ? 'note' : 'notes'}`}
        buttonLabel="New Note"
        onButtonClick={() => router.push('/notes/new')}
      />

      <PageNav searchQuery={searchQuery} onSearchChange={setSearchQuery} onRefresh={refetch} isRefreshing={isRefetching} />

      {isRefetching ? (
        <NotesSkeleton contentOnly />
      ) : (<>
      {/* Category Filter */}
      <div className="flex gap-2 mb-8 overflow-x-auto scrollbar-thin pb-1">
        <button
          ref={allChipRef}
          onClick={() => setSelectedCategoryId(null)}
          className={`px-5 py-2.5 rounded-full font-semibold whitespace-nowrap transition-colors duration-100 cursor-pointer ${
            selectedCategoryId === null
              ? 'bg-foreground text-background shadow-md'
              : 'bg-input text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
        >
          All
        </button>
        {allCategories.map((category) => {
          const Icon = getCategoryIcon(category.icon)

          return (
            <button
              key={category.id}
              ref={(el) => {
                categoryChipRefs.current[category.id] = el
              }}
              onClick={() => setSelectedCategoryId(category.id)}
              className={`px-5 py-2.5 rounded-full font-semibold whitespace-nowrap transition-colors duration-100 cursor-pointer inline-flex items-center gap-2 ${
                selectedCategoryId === category.id
                  ? 'bg-foreground text-background shadow-md'
                  : 'bg-input text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <Icon className="text-base shrink-0" />
              {category.name}
            </button>
          )
        })}
      </div>

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-3xl border border-dashed border-border/60">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <MdNote className="text-4xl text-muted-foreground opacity-50" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">No notes found</h3>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
            {searchQuery ? "We couldn't find any notes matching your search." : "You haven't created any notes yet. Start capturing your thoughts!"}
          </p>
          {!searchQuery && (
            <button
              onClick={() => router.push('/notes/new')}
              className="px-6 py-2.5 bg-foreground text-background rounded-xl font-semibold hover:opacity-90 active:scale-95 transition-all cursor-pointer"
            >
              Create First Note
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Daily Quote Card */}
          <DailyQuoteCard />

          {/* User Notes */}
          {filteredNotes.map((note) => {
            const category = allCategories.find(c => c.id === note.categoryId)
            const CategoryIcon = category ? getCategoryIcon(category.icon) : null
            return (
              <div
                key={note.id}
                onClick={() => router.push(`/notes/${note.id}`)}
                className="group bg-card border border-card-border rounded-3xl p-6 cursor-pointer hover:shadow-lg hover:border-accent/30 transition-all duration-300 flex flex-col h-[220px]"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-foreground line-clamp-2 leading-tight group-hover:text-accent transition-colors">
                    {note.title || 'Untitled'}
                  </h3>
                </div>
                <p className="text-muted-foreground text-base line-clamp-3 mb-auto leading-relaxed">
                  {getPreview(note.content)}
                </p>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
                  <span className="text-sm font-medium text-muted-foreground/80">
                    {formatDate(note.updatedAt)}
                  </span>
                  {category && category.id !== 'uncategorized' && CategoryIcon && (
                    <span className="text-xs font-bold px-3 py-1.5 bg-muted text-foreground rounded-lg inline-flex items-center gap-1.5">
                      <CategoryIcon className="text-sm" />
                      {category.name}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
      </>)}
    </PageContainer>
  )
}
