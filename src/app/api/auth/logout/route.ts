import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  // Supabase Client mit Cookie-Unterstützung erstellen
  const supabase = await createClient();
  
  try {
    // Benutzer ausloggen
    await supabase.auth.signOut();
    return NextResponse.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 