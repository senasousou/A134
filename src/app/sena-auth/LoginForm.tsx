'use client';

import { useActionState } from 'react';
import { loginContent } from '@/actions/auth';

const initialState = {
  error: '',
};

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginContent, initialState);

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-2 tracking-wide text-[var(--foreground)]">
          認証キー (パスワード)
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="w-full px-4 py-2 border border-[var(--border)] bg-transparent text-[var(--foreground)] focus:outline-none focus:border-[var(--foreground)] transition-colors"
          placeholder="••••••••"
        />
      </div>

      {state?.error && (
        <p className="text-red-700 text-sm">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-[var(--foreground)] text-[var(--background)] py-3 px-4 hover:bg-black transition-colors disabled:opacity-50 tracking-widest"
      >
        {isPending ? '認証中...' : '入室'}
      </button>
    </form>
  );
}
