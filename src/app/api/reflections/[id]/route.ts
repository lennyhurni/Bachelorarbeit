   import { createClient } from '@/utils/supabase/server'
   import { NextRequest, NextResponse } from 'next/server'
   
   /* ─────────── Hilfsfunktionen ─────────── */
   
   async function assertAuth() {
     const supabase = await createClient()
     const {
       data: { user },
     } = await supabase.auth.getUser()
   
     if (!user) {
       throw new NextResponse(
         JSON.stringify({ error: 'Nicht authentifiziert' }),
         { status: 401, headers: { 'Content-Type': 'application/json' } },
       )
     }
     return { supabase, userId: user.id }
   }
   
   function json(data: unknown, status = 200) {
     return new NextResponse(JSON.stringify(data), {
       status,
       headers: { 'Content-Type': 'application/json' },
     })
   }
   
   /* ─────────── GET ─────────── */
   
   export async function GET(
     _req: NextRequest,
     { params }: { params: { id: string } },
   ): Promise<Response> {
     const id = params.id // zuerst lesen, dann await
   
     try {
       const { supabase, userId } = await assertAuth()
       if (!id) return json({ error: 'Keine ID angegeben' }, 400)
   
       const { data, error } = await supabase
         .from('reflections')
         .select('*')
         .eq('id', id)
         .eq('user_id', userId)
         .single()
   
       if (error) return json({ error: 'Reflexion nicht gefunden' }, 404)
       return json(data)
     } catch (err) {
       if (err instanceof NextResponse) return err
       console.error('GET /reflections/:id', err)
       return json({ error: 'Interner Serverfehler' }, 500)
     }
   }
   
   /* ─────────── PUT ─────────── */
   
   export async function PUT(
     req: NextRequest,
     { params }: { params: { id: string } },
   ): Promise<Response> {
     const id = params.id
   
     try {
       const { supabase, userId } = await assertAuth()
       if (!id) return json({ error: 'Keine ID angegeben' }, 400)
   
       const { title, content, category, is_public } = await req.json()
       if (!title || !content)
         return json({ error: 'Titel und Inhalt sind erforderlich' }, 400)
   
       // Eigentums-Check
       const { error: existsErr } = await supabase
         .from('reflections')
         .select('id')
         .eq('id', id)
         .eq('user_id', userId)
         .single()
       if (existsErr) return json({ error: 'Reflexion nicht gefunden' }, 404)
   
       const { data, error } = await supabase
         .from('reflections')
         .update({
           title,
           content,
           category,
           is_public,
           updated_at: new Date().toISOString(),
         })
         .eq('id', id)
         .eq('user_id', userId)
         .select()
         .single()
   
       if (error) return json({ error: 'Fehler beim Aktualisieren' }, 500)
       return json({ success: true, reflection: data })
     } catch (err) {
       if (err instanceof NextResponse) return err
       console.error('PUT /reflections/:id', err)
       return json({ error: 'Interner Serverfehler' }, 500)
     }
   }
   
   /* ─────────── DELETE ─────────── */
   
   export async function DELETE(
     _req: NextRequest,
     { params }: { params: { id: string } },
   ): Promise<Response> {
     const id = params.id
   
     try {
       const { supabase, userId } = await assertAuth()
       if (!id) return json({ error: 'Keine ID angegeben' }, 400)
   
       // Eigentums-Check
       const { error: existsErr } = await supabase
         .from('reflections')
         .select('id')
         .eq('id', id)
         .eq('user_id', userId)
         .single()
       if (existsErr) return json({ error: 'Reflexion nicht gefunden' }, 404)
   
       const { error } = await supabase
         .from('reflections')
         .delete()
         .eq('id', id)
         .eq('user_id', userId)
   
       if (error) return json({ error: 'Fehler beim Löschen' }, 500)
       return json({ success: true })
     } catch (err) {
       if (err instanceof NextResponse) return err
       console.error('DELETE /reflections/:id', err)
       return json({ error: 'Interner Serverfehler' }, 500)
     }
   }
   