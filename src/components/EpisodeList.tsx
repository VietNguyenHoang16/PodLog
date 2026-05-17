'use client';

import { useState } from 'react';
import { Episode } from '@/types';
import { ConfirmDelete } from '@/components/ConfirmDelete';

interface EpisodeListProps {
  episodes: Episode[];
  onEditEpisode: (episode: Episode) => void;
  onDeleteEpisode: (episodeId: string) => void;
  onChangeStatus: (episodeId: string, status: Episode['status']) => void;
  onViewEpisode: (episode: Episode) => void;
}

const statusConfig: Record<Episode['status'], { label: string; cls: string }> = {
  chua_nghe: { label: 'Chưa nghe', cls: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300' },
  dang_nghe: { label: 'Đang nghe', cls: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' },
  da_xong: { label: 'Đã xong', cls: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' },
  on_lai: { label: 'Ôn lại', cls: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300' },
};

const levelColors: Record<Episode['level'], string> = {
  A1: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  A2: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  B1: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  B2: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  C1: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  C2: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
};

export function EpisodeList({ episodes, onEditEpisode, onDeleteEpisode, onChangeStatus, onViewEpisode }: EpisodeListProps) {
  const [deleteEpisodeId, setDeleteEpisodeId] = useState<string | null>(null);

  if (episodes.length === 0) {
    return (
      <div className="text-center py-10 bg-neutral-100/50 dark:bg-neutral-800/50 rounded-xl">
        <p className="text-sm text-neutral-400 dark:text-neutral-500">Chưa có bài học nào</p>
      </div>
    );
  }

  const epToDelete = deleteEpisodeId ? episodes.find((e) => e.id === deleteEpisodeId) : null;

  return (
    <>
      <div className="space-y-3">
        {episodes.map((ep) => {
          const st = statusConfig[ep.status];
          const vocabCount = (ep.vocabulary || []).length;
          return (
            <div
              key={ep.id}
              onClick={() => onViewEpisode(ep)}
              className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-700 transition-all cursor-pointer group"
            >
              <div className="flex flex-col sm:flex-row">
                {ep.image ? (
                  <div className="sm:w-48 shrink-0">
                    <img
                      src={ep.image}
                      alt={ep.title}
                      className="w-full h-36 sm:h-full object-cover"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  </div>
                ) : (
                  <div className="sm:w-48 shrink-0 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center h-24 sm:h-auto">
                    <svg className="w-10 h-10 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                    </svg>
                  </div>
                )}

                <div className="flex-1 min-w-0 p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h3 className="font-semibold text-base leading-snug line-clamp-2">{ep.title}</h3>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {vocabCount > 0 && (
                          <span className="text-xs bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 px-2 py-0.5 rounded-full font-medium">
                            {vocabCount} từ
                          </span>
                        )}
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${st.cls}`}>
                          {st.label}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs mb-2">
                      <span className={`px-1.5 py-0.5 rounded font-semibold text-[11px] ${levelColors[ep.level]}`}>
                        {ep.level}
                      </span>
                      {ep.url && (
                        <a href={ep.url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-blue-600 dark:text-blue-400 hover:underline">
                          🔊 Nghe
                        </a>
                      )}
                    </div>

                    {ep.notes && (
                      <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed mb-3">
                        {ep.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-between items-center" onClick={(e) => e.stopPropagation()}>
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEditEpisode(ep)}
                        className="px-3 py-1.5 text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                      >
                        Chỉnh sửa
                      </button>
                      <button
                        onClick={() => setDeleteEpisodeId(ep.id)}
                        className="px-3 py-1.5 text-xs bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                      >
                        Xóa
                      </button>
                    </div>
                    <select
                      value={ep.status}
                      onChange={(e) => onChangeStatus(ep.id, e.target.value as Episode['status'])}
                      className="text-xs border border-neutral-200 dark:border-neutral-700 rounded-md px-2 py-1.5 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                    >
                      <option value="chua_nghe">Chưa nghe</option>
                      <option value="dang_nghe">Đang nghe</option>
                      <option value="da_xong">Đã xong</option>
                      <option value="on_lai">Ôn lại</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {epToDelete && (
        <ConfirmDelete
          title={`Xóa bài học "${epToDelete.title}"?`}
          message="Thao tác này không thể hoàn tác. Tất cả từ vựng trong bài sẽ bị xóa."
          onConfirm={() => {
            onDeleteEpisode(epToDelete.id);
            setDeleteEpisodeId(null);
          }}
          onCancel={() => setDeleteEpisodeId(null)}
        />
      )}
    </>
  );
}
