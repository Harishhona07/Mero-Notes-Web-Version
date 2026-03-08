'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useNotes } from '@/contexts/NotesContext'
import { MdEdit, MdDelete, MdWork, MdPerson, MdLightbulb, MdChecklist, MdFolder, MdLabel, MdStar, MdFavorite, MdHome, MdShoppingCart, MdReceipt, MdSchool, MdCategory, MdFitnessCenter, MdTravelExplore, MdRestaurant, MdMusicNote, MdSportsSoccer, MdVideogameAsset, MdPalette, MdCode } from 'react-icons/md'
import PageNav from '@/components/navigation/PageNav'
import PageContainer from '@/components/layout/PageContainer'
import PageHeader from '@/components/layout/PageHeader'
import PrimaryButton from '@/components/ui/PrimaryButton'
import AlertDialog from '@/components/ui/AlertDialog'
import CategoriesSkeleton from '@/components/skeletons/CategoriesSkeleton'

// Icon mapping
const iconMap: Record<string, any> = {
  work: MdWork,
  person: MdPerson,
  lightbulb: MdLightbulb,
  checklist: MdChecklist,
  folder: MdFolder,
  label: MdLabel,
  star: MdStar,
  favorite: MdFavorite,
  home: MdHome,
  'shopping-cart': MdShoppingCart,
  receipt: MdReceipt,
  school: MdSchool,
  'fitness-center': MdFitnessCenter,
  'travel-explore': MdTravelExplore,
  restaurant: MdRestaurant,
  'music-note': MdMusicNote,
  'sports-soccer': MdSportsSoccer,
  'videogame-asset': MdVideogameAsset,
  palette: MdPalette,
  code: MdCode,
  // Backward compatibility for older saved icon names
  fitness: MdFitnessCenter,
  travel: MdTravelExplore,
  music: MdMusicNote,
  gaming: MdVideogameAsset,
  art: MdPalette,
}

const iconOptions = [
  { name: 'work', Icon: MdWork },
  { name: 'person', Icon: MdPerson },
  { name: 'lightbulb', Icon: MdLightbulb },
  { name: 'checklist', Icon: MdChecklist },
  { name: 'folder', Icon: MdFolder },
  { name: 'label', Icon: MdLabel },
  { name: 'star', Icon: MdStar },
  { name: 'favorite', Icon: MdFavorite },
  { name: 'home', Icon: MdHome },
  { name: 'shopping-cart', Icon: MdShoppingCart },
  { name: 'receipt', Icon: MdReceipt },
  { name: 'school', Icon: MdSchool },
  { name: 'fitness-center', Icon: MdFitnessCenter },
  { name: 'travel-explore', Icon: MdTravelExplore },
  { name: 'restaurant', Icon: MdRestaurant },
  { name: 'music-note', Icon: MdMusicNote },
  { name: 'sports-soccer', Icon: MdSportsSoccer },
  { name: 'videogame-asset', Icon: MdVideogameAsset },
  { name: 'palette', Icon: MdPalette },
  { name: 'code', Icon: MdCode },
]

export default function CategoriesPage() {
  const router = useRouter()
  const { categories, notes, addCategory, updateCategory, deleteCategory, isLoading, isRefetching, refetch } = useNotes()
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('folder')
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; noteCount: number } | null>(null)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { refetch() }, [])

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
    await refetch()
  }

  const handleEdit = (cat: any) => {
    setEditingId(cat.id)
    setName(cat.name)
    setIcon(cat.icon)
    setShowModal(true)
  }

  if (isLoading) {
    return <PageContainer><CategoriesSkeleton /></PageContainer>
  }

  const handleDelete = (id: string) => {
    const noteCount = getCategoryNoteCount(id)
    setDeleteTarget({ id, noteCount })
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    await deleteCategory(deleteTarget.id)
    setDeleteTarget(null)
    await refetch()
  }

  return (
    <PageContainer>
      <AlertDialog
        open={!!deleteTarget}
        variant="confirm"
        title="Delete category?"
        description={
          deleteTarget?.noteCount
            ? `This category has ${deleteTarget.noteCount} ${deleteTarget.noteCount === 1 ? 'note' : 'notes'}. They will be moved to Uncategorized.`
            : 'This action cannot be undone.'
        }
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
      <PageHeader
        title="Categories"
        subtitle="Organize your notes strategically"
        buttonLabel="New Category"
        onButtonClick={() => {
          setShowModal(true)
          setEditingId(null)
          setName('')
          setIcon('folder')
        }}
      />
      <PageNav searchQuery={searchQuery} onSearchChange={setSearchQuery} onRefresh={refetch} isRefreshing={isRefetching} />


      {isRefetching ? (
        <CategoriesSkeleton contentOnly />
      ) : (<>
      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCategories.map((category) => {
          const IconComponent = iconMap[category.icon] || MdFolder
          const noteCount = getCategoryNoteCount(category.id)
          
          return (
            <div
              key={category.id}
              onClick={() => router.push(`/notes?category=${encodeURIComponent(category.id)}`)}
              className="group relative bg-card border border-border overflow-hidden rounded-2xl hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-full bg-secondary/80 flex items-center justify-center group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                    <IconComponent className="text-3xl" />
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEdit(category)
                      }}
                      className="p-2 rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
                      title="Edit Category"
                    >
                      <MdEdit className="text-xl" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(category.id)
                      }}
                      className="p-2 rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors cursor-pointer"
                      title="Delete Category"
                    >
                      <MdDelete className="text-xl" />
                    </button>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-foreground group-hover:to-foreground/70 transition-all">
                    {category.name}
                  </h3>
                  <p className="text-sm font-medium text-muted-foreground/80">
                    {noteCount} {noteCount === 1 ? 'note' : 'notes'}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Empty State */}
      {filteredCategories.length === 0 && (
        <div className="text-center py-20 px-4 mt-8 bg-card border border-dashed border-border rounded-3xl">
          <div className="w-20 h-20 mx-auto bg-secondary rounded-full flex items-center justify-center mb-6">
            <MdCategory className="text-4xl text-muted-foreground" />
          </div>
          {searchQuery ? (
            <>
              <h3 className="text-2xl font-bold text-foreground mb-2">No categories found</h3>
              <p className="text-muted-foreground text-lg max-w-sm mx-auto">
                No categories match &quot;{searchQuery}&quot;.
              </p>
            </>
          ) : (
            <>
              <h3 className="text-2xl font-bold text-foreground mb-2">No Categories Yet</h3>
              <p className="text-muted-foreground text-lg mb-8 max-w-sm mx-auto">
                Create groups to organize your notes efficiently and keep your workspace tidy.
              </p>
              <PrimaryButton
                label="Create First Category"
                onClick={() => {
                  setShowModal(true)
                  setEditingId(null)
                  setName('')
                  setIcon('folder')
                }}
              />
            </>
          )}
        </div>
      )}
      </>)}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-card border border-border shadow-xl rounded-3xl p-8 w-full max-w-md animate-in zoom-in-95 duration-200">
            <h2 className="text-3xl font-extrabold text-foreground mb-6">
              {editingId ? 'Edit Category' : 'New Category'}
            </h2>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Category name"
                className="w-full px-4 py-3 bg-secondary/30 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-colors"
              />
            </div>

            <div className="mb-8">
              <label className="block text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Icon
              </label>
              <div className="grid grid-cols-6 gap-3 max-h-50 overflow-y-auto scrollbar-thin p-2 pr-3">
                {iconOptions.map(({ name: iconName, Icon }) => (
                  <button
                    key={iconName}
                    onClick={() => setIcon(iconName)}
                    className={`aspect-square sm:p-3 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
                      icon === iconName
                        ? 'bg-foreground text-background scale-110 shadow-md'
                        : 'bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground hover:scale-105'
                    }`}
                  >
                    <Icon className="text-2xl" />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="flex-[0.4] px-6 py-3 bg-secondary text-foreground rounded-full font-bold hover:bg-secondary/80 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!name.trim()}
                className="flex-1 px-6 py-3 bg-foreground text-background rounded-full font-bold hover:bg-foreground/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 cursor-pointer"
              >
                {editingId ? 'Save Changes' : 'Create Category'}
              </button>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  )
}
