'use client';

import { useState } from 'react';
import { Episode } from '@/types';

interface EpisodeFormProps {
  episode?: Episode;
  channelId: string;
  onClose: () => void;
  onSave: (episode: Episode) => void;
  onDelete?: (id: string) => void;
}

const levels: Episode['level'][] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export function EpisodeForm({ episode, channelId, onClose, onSave, onDelete }: EpisodeFormProps) {
  const [title, setTitle] = useState(episode?.title || '');
  const [url, setUrl] = useState(episode?.url || '');
  const [imageUrl, setImageUrl] = useState(episode?.image || '');
  const [status, setStatus] = useState<Episode['status']>(episode?.status || 'chua_nghe');
  const [level, setLevel] = useState<Episode['level']>(episode?.level || 'B1');
  const [notes, setNotes] = useState(episode?.notes || '');
  const [durationMin, setDurationMin] = useState(
    episode?.duration_seconds ? String(Math.floor(episode.duration_seconds / 60)) : '',
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const durationSeconds = durationMin ? parseInt(durationMin, 10) * 60 : undefined;
    onSave({
      ...(episode || {} as Episode),
      id: episode?.id || crypto.randomUUID(),
      channel_id: episode?.channel_id || channelId,
      title: title.trim(),
      url: url.trim() || undefined,
      image: imageUrl.trim() || undefined,
      status,
      level,
      notes: notes.trim(),
      duration_seconds: durationSeconds ?? episode?.duration_seconds,
      updated_at: new Date(),
    } as Episode);
  };

  const inputClass = 'w-full px-3 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white dark:bg-neutral-900 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-xl border border-neutral-200 dark:border-neutral-800">
        <div className="p-5">
          <h2 className="text-lg font-semibold mb-4">{episode ? 'Sửa bài học' : 'Thêm bài học'}</h2>
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-sm font-medium mb-1 text-neutral-700 dark:text-neutral-300">Tiêu đề *</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} placeholder="Tên bài học..." required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-neutral-700 dark:text-neutral-300">URL Podcast</label>
              <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} className={inputClass} placeholder="https://..." />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-neutral-700 dark:text-neutral-300">Hình ảnh</label>
              <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className={inputClass} placeholder="https://... (url ảnh bìa)" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-neutral-700 dark:text-neutral-300">Thời lượng (phút)</label>
              <input type="number" value={durationMin} onChange={(e) => setDurationMin(e.target.value)} className={inputClass} placeholder="VD: 45" min="0" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1 text-neutral-700 dark:text-neutral-300">Trạng thái</label>
                <select value={status} onChange={(e) => setStatus(e.target.value as Episode['status'])} className={inputClass}>
                  <option value="chua_nghe">Chưa nghe</option>
                  <option value="dang_nghe">Đang nghe</option>
                  <option value="da_xong">Đã xong</option>
                  <option value="on_lai">Ôn lại</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-neutral-700 dark:text-neutral-300">Trình độ</label>
                <select value={level} onChange={(e) => setLevel(e.target.value as Episode['level'])} className={inputClass}>
                  {levels.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-neutral-700 dark:text-neutral-300">Ghi chú</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className={inputClass} rows={3} placeholder="Từ vựng, cấu trúc câu, nội dung nổi bật..." />
            </div>

            <div className="flex gap-2 pt-2">
              <button type="button" onClick={onClose} className="flex-1 px-4 py-2 text-sm border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-neutral-700 dark:text-neutral-300">
                Hủy
              </button>
              <button type="submit" className="flex-1 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                {episode ? 'Cập nhật' : 'Thêm'}
              </button>
            </div>
            {onDelete && episode && (
              <button
                type="button"
                onClick={() => {
                  if (confirm('Xóa bài học này?')) {
                    onDelete(episode.id);
                    onClose();
                  }
                }}
                className="w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                Xóa bài học
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
