// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          user_id: string
          name: string
          icon: string
          created_at: string
        }
      }
      notes: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string
          category_id: string | null
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
