'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { MdFormatQuote } from 'react-icons/md'

interface DailyQuote {
  id: string
  quote: string
  author: string
  updated_at: string
}

export default function DailyQuoteCard() {
  const [dailyQuote, setDailyQuote] = useState<DailyQuote | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const fetchDailyQuote = async () => {
      const { data, error } = await supabase
        .from('daily_quotes')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1)
        .single()

      if (data && !error) {
        setDailyQuote(data)
      }
    }

    fetchDailyQuote()
  }, [supabase])

  if (!dailyQuote) return null

  return (
    <div className="group rounded-3xl p-[2px] bg-gradient-to-br from-accent/50 via-accent/30 to-accent/10 h-[220px]">
      <div className="bg-card rounded-3xl p-6 flex flex-col h-full relative overflow-hidden">
        <MdFormatQuote className="absolute -top-2 -left-2 text-8xl text-muted-foreground/10 rotate-180" />
        <div className="relative z-10 flex flex-col h-full">
          <p className="text-lg font-semibold leading-relaxed mb-auto line-clamp-4 bg-gradient-to-r from-foreground to-foreground/50 bg-clip-text text-transparent">
            &ldquo;{dailyQuote.quote}&rdquo;
          </p>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
            <span className="text-sm font-bold text-muted-foreground italic">
              — {dailyQuote.author}
            </span>
            <span className="text-xs font-bold px-3 py-1.5 bg-accent/10 text-accent rounded-lg">
              Quote of the Day
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
