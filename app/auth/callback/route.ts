import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  // Debug logging
  console.log('Callback received with code:', code ? 'present' : 'missing')
  console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
  console.log('Supabase Key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

  if (code) {
    try {
      const supabase = await createServerSupabaseClient()
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Error exchanging code for session:', error)
        return NextResponse.redirect(`${origin}/auth?error=${encodeURIComponent(error.message)}`)
      }

      console.log('Session exchange successful:', !!data.session)
    } catch (err) {
      console.error('Unexpected error in callback:', err)
      return NextResponse.redirect(`${origin}/auth?error=Authentication+failed`)
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(`${origin}/notes`)
}
