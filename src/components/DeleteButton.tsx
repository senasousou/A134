'use client';

import React from 'react';

interface DeleteButtonProps {
  action: (id: string) => Promise<{ success?: boolean; error?: string } | void>;
  id: string;
  label?: string;
  confirmMessage?: string;
  className?: string;
}

export default function DeleteButton({
  action,
  id,
  label = '削除',
  confirmMessage = 'この項目を永久に抹消しますか？',
  className = 'text-red-700 hover:text-red-900 transition-colors underline underline-offset-4 decoration-red-200 hover:decoration-red-700'
}: DeleteButtonProps) {
  const handleDelete = async () => {
    if (window.confirm(confirmMessage)) {
      try {
        const result = await action(id);
        if (result && result.error) {
          alert(result.error);
        }
      } catch (error) {
        console.error('Delete error:', error);
        alert('削除中にエラーが発生しました。');
      }
    }
  };

  return (
    <button
      onClick={handleDelete}
      className={className}
      type="button"
    >
      {label}
    </button>
  );
}
