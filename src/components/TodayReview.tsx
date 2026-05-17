'use client';

import { Episode } from '@/types';

interface TodayReviewProps {
  episodes: Episode[];
}

export function TodayReview({ episodes }: TodayReviewProps) {
  return (
    <div className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
      <h3 className="font-semibold text-sm mb-3 flex items-center gap-2 text-blue-800 dark:text-blue-200">
        <span>📅</span>
        Ôn tập hôm nay ({episodes.length})
      </h3>
      {episodes.length === 0 ? (
        <p className="text-xs text-neutral-500 dark:text-neutral-400">Không có bài cần ôn hôm nay</p>
      ) : (
        <div className="space-y-1.5">
          {episodes.slice(0, 3).map((ep) => (
            <div key={ep.id} className="text-sm bg-white/70 dark:bg-neutral-800/50 p-2 rounded-lg truncate">
              {ep.title}
            </div>
          ))}
          {episodes.length > 3 && (
            <p className="text-xs text-neutral-400 dark:text-neutral-500">+{episodes.length - 3} bài khác...</p>
          )}
        </div>
      )}
    </div>
  );
}
