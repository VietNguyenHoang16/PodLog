'use client';

import { useState } from 'react';

interface ConfirmDeleteProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDelete({ title, message, onConfirm, onCancel }: ConfirmDeleteProps) {
  const [input, setInput] = useState('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white dark:bg-neutral-900 rounded-xl max-w-sm w-full shadow-xl border border-neutral-200 dark:border-neutral-800 p-5">
        <h3 className="text-base font-semibold text-red-600 dark:text-red-400 mb-2">{title}</h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">{message}</p>

        <label className="block text-xs text-neutral-500 dark:text-neutral-400 mb-1.5">
          Nhập <span className="font-bold text-red-600 dark:text-red-400">delete</span> để xác nhận
        </label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent mb-4"
          placeholder="delete"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter' && input === 'delete') onConfirm();
          }}
        />

        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 px-3 py-2 text-sm border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            disabled={input !== 'delete'}
            className="flex-1 px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
}
