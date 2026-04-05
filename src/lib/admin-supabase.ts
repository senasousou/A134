import { createClient } from '@supabase/supabase-js';

// サーバーサイド専用：管理者権限 (Service Role Key) を使用したクライアント
// ※注意：このファイルはクライアントサイド（'use client'）では絶対に使用しないでください。
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseServiceRoleKey) {
  console.warn('SUPABASE_SERVICE_ROLE_KEY が設定されていません。サーバーサイドの管理者操作が制限される可能性があります。');
}

export const adminSupabase = createClient(supabaseUrl, supabaseServiceRoleKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
