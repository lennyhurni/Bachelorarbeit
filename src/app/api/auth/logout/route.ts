import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest): Promise<Response> {
  // Supabase Client mit Cookie-Unterstützung erstellen
  const supabase = await createClient();
  
  try {
    // Benutzer ausloggen
    await supabase.auth.signOut();
    return NextResponse.json({ message: 'Logout successful' });
  } catch (error: any) {
    console.error('Logout error:', { 
      errorName: error?.name, 
      errorMessage: error?.message 
    })
    return NextResponse.json({ error: 'Failed to log out' }, { status: 500 })
  }
} 