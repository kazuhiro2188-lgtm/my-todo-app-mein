import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * API Route 用: リクエストごとに env を読み直して Supabase クライアントを返す。
 * リロード後も .env.local の値が確実に使われる。
 */
export function getSupabaseServer(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      'Missing env: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY'
    );
  }

  return createClient(url, key);
}
