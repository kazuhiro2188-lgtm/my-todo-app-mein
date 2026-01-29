import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase-server';

type Params = { params: Promise<{ id: string }> };

// 3) 更新：id を指定して title を更新 / 4) 完了/未完了切替：is_done を更新
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const { title, is_done } = body as { title?: string; is_done?: boolean };

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }

    const updatePayload: Record<string, unknown> = { updated_at: new Date().toISOString() };

    if (typeof title === 'string') {
      updatePayload.title = title;
    }
    if (typeof is_done === 'boolean') {
      updatePayload.is_done = is_done;
    }

    if (Object.keys(updatePayload).length === 1) {
      return NextResponse.json({ error: 'no fields to update' }, { status: 400 });
    }

    const supabase = getSupabaseServer();
    const { data, error } = await supabase
      .from('todos')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Supabase env or server error';
    return NextResponse.json({ error: message }, { status: 503 });
  }
}

// 5) 削除：id を指定して削除
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }

    const supabase = getSupabaseServer();
    const { error } = await supabase.from('todos').delete().eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Supabase env or server error';
    return NextResponse.json({ error: message }, { status: 503 });
  }
}

