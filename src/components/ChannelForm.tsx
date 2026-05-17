'use client';

import { useState } from 'react';
import { Channel } from '@/types';
import { ConfirmDelete } from '@/components/ConfirmDelete';

interface ChannelFormProps {
  channel?: Channel;
  onClose: () => void;
  onSave: (channel: Channel) => void;
  onDelete?: (id: string) => void;
}

export function ChannelForm({ channel, onClose, onSave, onDelete }: ChannelFormProps) {
  const [name, setName] = useState(channel?.name || '');
  const [description, setDescription] = useState(channel?.description || '');
  const [icon, setIcon] = useState(channel?.icon || '');
  const [homepageUrl, setHomepageUrl] = useState(channel?.homepage_url || '');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      id: channel?.id || crypto.randomUUID(),
      name: name.trim(),
      description: description.trim() || undefined,
      icon: icon.trim() || undefined,
      homepage_url: homepageUrl.trim() || undefined,
      created_at: channel?.created_at || new Date(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white dark:bg-neutral-900 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-xl border border-neutral-200 dark:border-neutral-800">
        <div className="p-5">
          <h2 className="text-lg font-semibold mb-4">{channel ? 'Sửa kênh' : 'Thêm kênh mới'}</h2>
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-sm font-medium mb-1 text-neutral-700 dark:text-neutral-300">Tên kênh *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="BBC Learning English..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-neutral-700 dark:text-neutral-300">Mô tả</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={2}
                placeholder="Mô tả ngắn về kênh..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-neutral-700 dark:text-neutral-300">Icon URL</label>
              <input
                type="url"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-neutral-700 dark:text-neutral-300">Homepage URL</label>
              <input
                type="url"
                value={homepageUrl}
                onChange={(e) => setHomepageUrl(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://..."
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 text-sm border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-neutral-700 dark:text-neutral-300"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                {channel ? 'Cập nhật' : 'Thêm'}
              </button>
            </div>
            {onDelete && channel && (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                Xóa kênh
              </button>
            )}
          </form>
        </div>

        {showDeleteConfirm && (
          <ConfirmDelete
            title={`Xóa kênh "${channel?.name}"?`}
            message="Tất cả bài học và từ vựng trong kênh này sẽ bị xóa vĩnh viễn. Thao tác này không thể hoàn tác."
            onConfirm={() => {
              if (channel) onDelete!(channel.id);
              onClose();
            }}
            onCancel={() => setShowDeleteConfirm(false)}
          />
        )}
      </div>
    </div>
  );
}
