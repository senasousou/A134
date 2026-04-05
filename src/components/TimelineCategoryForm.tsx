'use client';

import { useActionState, useEffect, useRef } from 'react';
import { createTimelineCategory, updateTimelineCategory } from '@/actions/timeline';

export default function TimelineCategoryForm({ initialData }: { initialData?: { id: string; name: string } }) {
  const isEdit = !!initialData;
  const formRef = useRef<HTMLFormElement>(null);
  const initialState = { message: '', error: '', success: false };

  const submitAction = async (prevState: any, formData: FormData) => {
    try {
      const name = formData.get('name') as string;
      if (isEdit && initialData?.id) {
        await updateTimelineCategory(initialData.id, name);
        return { message: 'カテゴリを更新しました。', error: '', success: true };
      } else {
        await createTimelineCategory(name);
        return { message: '新しいカテゴリを登録しました。', error: '', success: true };
      }
    } catch (e: any) {
      return { message: '', error: e.message || '保存に失敗しました', success: false };
    }
  };

  const [state, formAction, isPending] = useActionState(submitAction, initialState);

  useEffect(() => {
    if (state.success && !isEdit) {
      formRef.current?.reset();
    }
  }, [state, isEdit]);

  return (
    <form ref={formRef} action={formAction} className="border border-[var(--border)] p-4 bg-[var(--background)] mb-4 w-full">
      <h3 className="text-sm font-serif mb-4 tracking-widest border-b cosmic-border pb-1">
        {isEdit ? 'カテゴリ編集' : '新規カテゴリ登録'}
      </h3>
      
      {state.message && <p className="text-green-700 bg-green-50 p-2 mb-4 text-xs">{state.message}</p>}
      {state.error && <p className="text-red-700 bg-red-50 p-2 mb-4 text-xs">{state.error}</p>}

      <div className="flex flex-col sm:flex-row gap-2 items-end">
        <div className="flex-1 w-full">
          <label className="block text-xs mb-1 tracking-wide">種類名称 (例: 環境, 現象)</label>
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
          className="bg-[var(--foreground)] text-[var(--background)] px-4 py-2 hover:bg-black transition-colors tracking-widest text-sm w-full sm:w-auto disabled:opacity-50"
        >
          {isPending ? '保存中...' : isEdit ? '更新' : '登録'}
        </button>
      </div>
    </form>
  );
}
