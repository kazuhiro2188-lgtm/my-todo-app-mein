import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase-server';

// 2) 一覧取得：created_at の降順で全件取得
export async function GET() {
  try {
    const supabase = getSupabaseServer();
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data ?? []);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Supabase env or server error';
    return NextResponse.json({ error: message }, { status: 503 });
  }
}

// 1) 作成：title を受け取り、is_done は false で登録
export async function POST(req: NextRequest) {
  try {
    let body: { title?: unknown };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON or empty body' }, { status: 400 });
    }

    const title = body?.title;
    if (!title || typeof title !== 'string') {
      return NextResponse.json({ error: 'title is required (string)' }, { status: 400 });
    }

    const supabase = getSupabaseServer();
    const { data, error } = await supabase
      .from('todos')
      .insert({ title, is_done: false })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Supabase env or server error';
    return NextResponse.json({ error: message }, { status: 503 });
  }
}

