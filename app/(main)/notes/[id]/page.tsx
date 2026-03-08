'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useNotes } from '@/contexts/NotesContext'
import { MdArrowBack, MdCheck, MdDelete } from 'react-icons/md'
import AlertDialog from '@/components/ui/AlertDialog'
import ThemedSelect from '@/components/ui/ThemedSelect'

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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

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
    await updateNote(note.id, title, content, categoryId)
    router.push('/notes')
  }

  const handleDelete = async () => {
    await deleteNote(noteId)
    router.push('/notes')
  }

  if (!note) {
    return (
      <div className="text-center py-12">
        <p className="text-[var(--icon)]">Note not found</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
      <AlertDialog
        open={showDeleteDialog}
        variant="confirm"
        title="Delete this note?"
        description="This action cannot be undone. The note will be permanently deleted."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteDialog(false)}
      />
      {/* Header */}
      <div className="flex items-center justify-between mb-8 sticky top-[5rem] z-10 bg-background/80 backdrop-blur-md py-4 -mx-4 px-4 sm:mx-0 sm:px-0">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200 cursor-pointer"
        >
          <MdArrowBack className="text-xl" />
          <span className="font-medium hidden sm:block">Back</span>
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowDeleteDialog(true)}
            title="Delete this note"
            className="p-2.5 rounded-xl text-red-500 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-900/50 transition-all active:scale-95 cursor-pointer"
          >
            <MdDelete className="text-xl" />
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 bg-accent text-accent-foreground rounded-xl font-semibold hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm"
          >
            <MdCheck className="text-xl" />
            <span>{isSaving ? 'Saving...' : 'Save Note'}</span>
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm">
        {/* Category Select */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
            Category
          </label>
          <ThemedSelect value={categoryId} onChange={setCategoryId} options={allCategories} />
        </div>

        {/* Title Input */}
        <input
          type="text"
          placeholder="Note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-0 py-4 mb-2 bg-transparent border-none text-4xl sm:text-5xl font-extrabold text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-0 transition-opacity"
        />

        {/* Content Textarea */}
        <textarea
          placeholder="Start writing..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-0 py-4 bg-transparent border-none text-lg text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-0 resize-none min-h-[60vh] leading-relaxed"
        />
      </div>
    </div>
  )
}
