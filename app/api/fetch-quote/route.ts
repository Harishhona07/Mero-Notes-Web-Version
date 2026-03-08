import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// This endpoint fetches a new quote from API Ninjas and updates the daily_quotes table
// Should be called via cron job or manually to refresh the quote
export async function GET() {
  try {
    // 1. Fetch quote from API Ninjas
    const response = await fetch('https://api.api-ninjas.com/v2/quoteoftheday', {
      headers: {
        'X-Api-Key': process.env.API_NINJAS_KEY || '',
      },
    });

    if (!response.ok) {
      throw new Error(`API Ninjas error: ${response.status} ${response.statusText}`);
    }

    const quotes = await response.json();
    
    if (!quotes || quotes.length === 0) {
      throw new Error('No quotes returned from API');
    }

    const { quote, author } = quotes[0];

    // 2. Initialize Supabase Admin Client (service role)
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // 3. Delete existing quote(s) - keep only one quote
    const { error: deleteError } = await supabaseAdmin
      .from('daily_quotes')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all rows

    if (deleteError) {
      console.error('Error deleting old quotes:', deleteError);
    }

    // 4. Insert new quote
    const { data, error: insertError } = await supabaseAdmin
      .from('daily_quotes')
      .insert({
        quote,
        author: author || 'Unknown',
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      throw new Error(`Supabase insert error: ${insertError.message}`);
    }

    return NextResponse.json({
      success: true,
      quote: data,
      message: 'Quote updated successfully',
    });
  } catch (error) {
    console.error('Error fetching quote:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch quote',
      },
      { status: 500 }
    );
  }
}
