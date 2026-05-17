'use client';

import { Channel } from '@/types';

interface ChannelListProps {
  channels: Channel[];
  selectedChannelId: string | null;
  onSelectChannel: (id: string) => void;
  onEditChannel: (channel: Channel) => void;
  onDeleteChannel: (id: string) => void;
}

export function ChannelList({ channels, selectedChannelId, onSelectChannel, onEditChannel, onDeleteChannel }: ChannelListProps) {
  return (
    <div className="space-y-1 max-h-[50vh] overflow-y-auto pr-1">
      {channels.length === 0 ? (
        <div className="text-center py-6 px-3 border border-dashed border-neutral-200 dark:border-neutral-700 rounded-xl">
          <p className="text-xs text-neutral-400 dark:text-neutral-500">Chưa có kênh nào</p>
        </div>
      ) : (
        channels.map((channel) => (
          <div
            key={channel.id}
            onClick={() => onSelectChannel(channel.id)}
            className={`group p-2.5 rounded-xl cursor-pointer transition-colors relative ${
              selectedChannelId === channel.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {channel.icon || channel.thumbnail ? (
                <img
                  src={channel.icon || channel.thumbnail}
                  alt={channel.name}
                  className="h-8 w-8 rounded-lg object-cover shrink-0"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : null}
              <div
                className={`h-8 w-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 ${
                  channel.icon || channel.thumbnail ? 'hidden' : ''
                } ${
                  selectedChannelId === channel.id
                    ? 'bg-white/20 text-white'
                    : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                }`}
              >
                {channel.name.charAt(0).toUpperCase()}
              </div>
              <h3 className="font-semibold text-sm truncate flex-1">{channel.name}</h3>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEditChannel(channel);
                }}
                className="p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/10"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
