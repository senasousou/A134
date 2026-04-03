'use client';

import { useActionState, useState } from 'react';
import { createGenre, updateGenre } from '@/actions/genre';

export default function GenreForm({ initialData }: { initialData?: { id: string; code: string; name: string } }) {
  const isEdit = !!initialData;
  const initialState = { message: '', error: '' };

  const submitAction = async (prevState: any, formData: FormData) => {
    try {
      const code = formData.get('code') as string;
      const name = formData.get('name') as string;
      
      if (isEdit && initialData?.id) {
        await updateGenre(initialData.id, code, name);
        return { message: 'ジャンルを更新しました。', error: '' };
      } else {
        await createGenre(code, name);
        return { message: '新しいジャンルを登録しました。', error: '' };
      }
    } catch (e: any) {
      return { message: '', error: e.message || 'ジャンルの保存に失敗しました' };
    }
  };

  const [state, formAction, isPending] = useActionState(submitAction, initialState);

  return (
    <form action={formAction} className="border border-[var(--border)] p-6 bg-[var(--background)] max-w-xl">
      <h3 className="text-lg font-serif mb-6 tracking-widest border-b cosmic-border pb-2">
        {isEdit ? 'ジャンル編集' : '新規ジャンル登録'}
      </h3>
      
      {state.message && <p className="text-green-700 bg-green-50 p-3 mb-4 text-sm">{state.message}</p>}
      {state.error && <p className="text-red-700 bg-red-50 p-3 mb-4 text-sm">{state.error}</p>}

      <div className="space-y-4">
        <div>
          <label className="block text-sm mb-1 tracking-wide font-medium">ジャンルコード (例: 010, A01)</label>
          <input
            name="code"
            type="text"
            required
            pattern="[A-Za-z0-9]+"
            defaultValue={initialData?.code}
            className="w-full border border-[var(--border)] bg-transparent p-2 focus:outline-none focus:border-[var(--foreground)] transition-colors text-sm"
          />
        </div>
        <div>
          <label className="block text-sm mb-1 tracking-wide font-medium">ジャンル名称</label>
          <input
            name="name"
            type="text"
            required
            defaultValue={initialData?.name}
            className="w-full border border-[var(--border)] bg-transparent p-2 focus:outline-none focus:border-[var(--foreground)] transition-colors text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="mt-4 bg-[var(--foreground)] text-[var(--background)] px-6 py-2 hover:bg-black transition-colors tracking-widest w-full text-sm disabled:opacity-50"
        >
          {isPending ? '保存中...' : isEdit ? '更新する' : '登録'}
        </button>
      </div>
    </form>
  );
}
