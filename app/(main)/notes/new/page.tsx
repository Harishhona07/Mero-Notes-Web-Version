'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useNotes } from '@/contexts/NotesContext'
import { MdArrowBack, MdCheck } from 'react-icons/md'
import ThemedSelect from '@/components/ui/ThemedSelect'
import TipTapEditor from '@/components/editor/TipTapEditor'

export default function NewNotePage() {
  const router = useRouter()
  const { addNote, allCategories } = useNotes()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [categoryId, setCategoryId] = useState('uncategorized')
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    await addNote(title, content, categoryId)
    router.push('/notes')
  }

  return (
    <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 sticky top-[5rem] z-10 bg-background/80 backdrop-blur-md py-4 -mx-4 px-4 sm:mx-0 sm:px-0">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200"
        >
          <MdArrowBack className="text-xl" />
          <span className="font-medium hidden sm:block">Back</span>
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving || (!title.trim() && !content.trim())}
          className="cursor-pointer flex items-center gap-2 px-6 py-2.5 bg-accent text-accent-foreground rounded-xl font-semibold hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          <MdCheck className="text-xl" />
          <span>{isSaving ? 'Saving...' : 'Save Note'}</span>
        </button>
      </div>

      <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm">
        {/* Category Select */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-muted-foreground mb-2">
            Category
          </label>
          <ThemedSelect value={categoryId} onChange={setCategoryId} options={allCategories} />
        </div>

        {/* Title Input */}
        <input
          type="text"
          placeholder="Note Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-transparent text-3xl sm:text-4xl font-extrabold text-foreground placeholder:text-muted-foreground/50 focus:outline-none mb-6 border-b border-transparent focus:border-border pb-2 transition-all"
        />

        {/* Rich Text Editor */}
        <TipTapEditor content={content} onChange={setContent} placeholder="Start writing your note..." />
      </div>
    </div>
  )
}
