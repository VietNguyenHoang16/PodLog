'use client';

import { useState } from 'react';
import { Episode, Vocabulary } from '@/types';

interface EpisodeDetailProps {
  episode: Episode;
  onClose: () => void;
  onUpdateEpisode: (episode: Episode) => void;
}

function formatTime(totalSeconds: number): string {
  if (totalSeconds <= 0) return '';
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function EpisodeDetail({ episode, onClose, onUpdateEpisode }: EpisodeDetailProps) {
  const [word, setWord] = useState('');
  const [definition, setDefinition] = useState('');
  const [example, setExample] = useState('');
  const [progressH, setProgressH] = useState(String(Math.floor((episode.progress_seconds || 0) / 3600)));
  const [progressM, setProgressM] = useState(String(Math.floor(((episode.progress_seconds || 0) % 3600) / 60)));
  const [progressS, setProgressS] = useState(String((episode.progress_seconds || 0) % 60));

  const vocab = episode.vocabulary || [];

  const saveProgress = () => {
    const h = parseInt(progressH, 10) || 0;
    const m = parseInt(progressM, 10) || 0;
    const s = parseInt(progressS, 10) || 0;
    const total = h * 3600 + m * 60 + s;
    onUpdateEpisode({
      ...episode,
      progress_seconds: total,
      updated_at: new Date(),
    });
  };

  const addVocab = () => {
    if (!word.trim()) return;
    const newVocab: Vocabulary = {
      id: crypto.randomUUID(),
      episode_id: episode.id,
      word: word.trim(),
      definition: definition.trim(),
      example: example.trim(),
      created_at: new Date(),
    };
    onUpdateEpisode({
      ...episode,
      vocabulary: [...vocab, newVocab],
      updated_at: new Date(),
    });
    setWord('');
    setDefinition('');
    setExample('');
  };

  const removeVocab = (id: string) => {
    onUpdateEpisode({
      ...episode,
      vocabulary: vocab.filter((v) => v.id !== id),
      updated_at: new Date(),
    });
  };

  const inputClass = 'w-full px-3 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 pt-[10vh]">
      <div className="bg-white dark:bg-neutral-900 rounded-xl max-w-2xl w-full max-h-[80vh] flex flex-col shadow-xl border border-neutral-200 dark:border-neutral-800">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-200 dark:border-neutral-800 shrink-0">
          <div>
            <h2 className="text-lg font-semibold">{episode.title}</h2>
            {episode.url && (
              <a
                href={episode.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-0.5 block"
              >
                🔊 Mở podcast
              </a>
            )}
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Notes */}
        {episode.notes && (
          <div className="px-5 pt-4 shrink-0">
            <div className="text-sm text-neutral-600 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-800 p-3 rounded-lg whitespace-pre-wrap">
              {episode.notes}
            </div>
          </div>
        )}

        {/* Progress */}
        <div className="px-5 pt-4 shrink-0">
          <h3 className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-2">
            Tiến độ nghe
          </h3>
          <div className="flex items-end gap-2 flex-wrap">
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={progressH}
                onChange={(e) => setProgressH(e.target.value)}
                className="w-14 px-2 py-1.5 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
                min="0"
              />
              <span className="text-xs text-neutral-400">giờ</span>
            </div>
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={progressM}
                onChange={(e) => setProgressM(e.target.value)}
                className="w-14 px-2 py-1.5 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
                min="0"
                max="59"
              />
              <span className="text-xs text-neutral-400">phút</span>
            </div>
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={progressS}
                onChange={(e) => setProgressS(e.target.value)}
                className="w-14 px-2 py-1.5 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
                min="0"
                max="59"
              />
              <span className="text-xs text-neutral-400">giây</span>
            </div>
            <button
              onClick={saveProgress}
              className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Lưu
            </button>
          </div>
          {episode.progress_seconds > 0 && (
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5">
              Đã nghe: {formatTime(episode.progress_seconds)}
              {episode.duration_seconds ? ` / ${formatTime(episode.duration_seconds)}` : ''}
            </p>
          )}
        </div>

        {/* Vocabulary list */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <h3 className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-3">
            Từ vựng ({vocab.length})
          </h3>
          {vocab.length === 0 ? (
            <p className="text-sm text-neutral-400 py-8 text-center border-2 border-dashed border-neutral-200 dark:border-neutral-700 rounded-xl">
              Chưa có từ vựng nào. Thêm từ bên dưới.
            </p>
          ) : (
            <div className="grid gap-2">
              {vocab.map((v) => (
                <div
                  key={v.id}
                  className="flex items-start gap-3 p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-100 dark:border-neutral-800 group hover:border-neutral-200 dark:hover:border-neutral-700 transition-colors"
                >
                  <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-12 gap-2">
                    <div className="sm:col-span-3">
                      <span className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 break-words">
                        {v.word}
                      </span>
                    </div>
                    <div className="sm:col-span-5">
                      {v.definition && (
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">
                          {v.definition}
                        </span>
                      )}
                    </div>
                    <div className="sm:col-span-4">
                      {v.example && (
                        <span className="text-xs italic text-neutral-400 dark:text-neutral-500">
                          &quot;{v.example}&quot;
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => removeVocab(v.id)}
                    className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5"
                    title="Xóa từ"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add vocabulary */}
        <div className="border-t border-neutral-200 dark:border-neutral-800 p-5 shrink-0 bg-neutral-50/50 dark:bg-neutral-900/50">
          <h3 className="text-sm font-semibold mb-3">Thêm từ mới</h3>
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 mb-2">
            <div className="sm:col-span-3">
              <input
                type="text"
                value={word}
                onChange={(e) => setWord(e.target.value)}
                className={inputClass}
                placeholder="Từ mới *"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && word.trim()) {
                    e.preventDefault();
                    addVocab();
                  }
                }}
              />
            </div>
            <div className="sm:col-span-5">
              <input
                type="text"
                value={definition}
                onChange={(e) => setDefinition(e.target.value)}
                className={inputClass}
                placeholder="Định nghĩa"
              />
            </div>
            <div className="sm:col-span-4">
              <input
                type="text"
                value={example}
                onChange={(e) => setExample(e.target.value)}
                className={inputClass}
                placeholder="Ví dụ"
              />
            </div>
          </div>
          <button
            onClick={addVocab}
            disabled={!word.trim()}
            className="w-full px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            + Thêm từ
          </button>
        </div>
      </div>
    </div>
  );
}
