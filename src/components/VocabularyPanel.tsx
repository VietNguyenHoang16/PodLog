'use client';

import { Vocabulary } from '@/types';

interface VocabularyPanelProps {
  vocabulary: Array<Vocabulary & { episode_title: string; channel_name: string }>;
}

export function VocabularyPanel({ vocabulary }: VocabularyPanelProps) {
  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">Từ vựng đã ghi nhận ({vocabulary.length})</h3>
        {vocabulary.length > 0 && (
          <button className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
            Chế độ ôn tập
          </button>
        )}
      </div>
      {vocabulary.length === 0 ? (
        <p className="text-sm text-neutral-400 dark:text-neutral-500">Chưa có từ vựng nào. Thêm vào ghi chú bài học!</p>
      ) : (
        <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
          {vocabulary.slice(0, 10).map((v) => (
            <div key={v.id} className="text-sm border-b border-neutral-100 dark:border-neutral-800 pb-2">
              <div className="font-medium text-neutral-800 dark:text-neutral-200">{v.word}</div>
              {v.definition && <div className="text-neutral-500 dark:text-neutral-400 text-xs mt-0.5">{v.definition}</div>}
              {v.example && <div className="text-xs italic text-neutral-400 dark:text-neutral-500 mt-0.5">&quot;{v.example}&quot;</div>}
              <div className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">{v.episode_title}</div>
            </div>
          ))}
          {vocabulary.length > 10 && (
            <p className="text-xs text-center text-neutral-400 dark:text-neutral-500">+{vocabulary.length - 10} từ khác</p>
          )}
        </div>
      )}
    </div>
  );
}
