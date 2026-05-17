'use client';

import { useState, useEffect, useCallback } from 'react';
import { Channel, Episode } from '@/types';
import { ChannelList } from '@/components/ChannelList';
import { EpisodeList } from '@/components/EpisodeList';
import { EpisodeForm } from '@/components/EpisodeForm';
import { ChannelForm } from '@/components/ChannelForm';
import { StatsCard } from '@/components/StatsCard';
import { TodayReview } from '@/components/TodayReview';
import { EpisodeDetail } from '@/components/EpisodeDetail';

const dateFields = new Set([
  'created_at', 'updated_at', 'listened_at', 'next_review_at',
]);

function reviveDates<T>(item: T): T {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(item as Record<string, unknown>)) {
    if (dateFields.has(key) && typeof value === 'string' && value) {
      result[key] = new Date(value);
    } else {
      result[key] = value;
    }
  }
  return result as T;
}

function calculateNextReview(level: Episode['level']): Date {
  const levelDays: Record<Episode['level'], number> = {
    A1: 14, A2: 10, B1: 7, B2: 5, C1: 3, C2: 3,
  };
  const next = new Date();
  next.setDate(next.getDate() + (levelDays[level] || 7));
  return next;
}

function makeEpisode(overrides: Partial<Episode>, channelId: string): Episode {
  return {
    id: crypto.randomUUID(),
    channel_id: overrides.channel_id || channelId,
    title: overrides.title || '',
    url: overrides.url || undefined,
    image: overrides.image || undefined,
    status: overrides.status || 'chua_nghe',
    level: overrides.level || 'B1',
    rating: overrides.rating || 3,
    tags: overrides.tags || [],
    notes: overrides.notes || '',
    vocabulary: overrides.vocabulary || [],
    listened_at: overrides.listened_at,
    next_review_at: overrides.next_review_at,
    created_at: overrides.created_at || new Date(),
    updated_at: new Date(),
  };
}

async function api(url: string, options?: RequestInit) {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

export default function Home() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [editingEpisode, setEditingEpisode] = useState<Episode | null>(null);
  const [viewingEpisode, setViewingEpisode] = useState<Episode | null>(null);
  const [showChannelForm, setShowChannelForm] = useState(false);
  const [showEpisodeForm, setShowEpisodeForm] = useState(false);
  const [urlError, setUrlError] = useState<{
    url: string;
    existingEpisode: Episode;
    pending: Partial<Episode>;
  } | null>(null);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [ch, ep] = await Promise.all([
          api('/api/channels'),
          api('/api/episodes'),
        ]);
        setChannels((ch as Channel[]).map(reviveDates));
        setEpisodes((ep as Episode[]).map(reviveDates));
      } catch (e) {
        console.error('Failed to load data:', e);
      }
      const saved = localStorage.getItem('podlog_theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const isDark = saved === 'dark' || (!saved && prefersDark);
      setDark(isDark);
      document.documentElement.classList.toggle('dark', isDark);
      setLoaded(true);
    }
    load();
  }, []);

  const toggleDark = useCallback(() => {
    setDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle('dark', next);
      localStorage.setItem('podlog_theme', next ? 'dark' : 'light');
      return next;
    });
  }, []);

  // --- channel ops ---
  const addChannel = async (ch: Channel) => {
    const saved = await api('/api/channels', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ch),
    });
    setChannels((prev) => [reviveDates(saved as Channel), ...prev]);
    setShowChannelForm(false);
  };

  const updateChannel = async (ch: Channel) => {
    const saved = await api(`/api/channels/${ch.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ch),
    });
    setChannels((prev) => prev.map((c) => (c.id === ch.id ? reviveDates(saved as Channel) : c)));
    setShowChannelForm(false);
  };

  const deleteChannel = async (id: string) => {
    await api(`/api/channels/${id}`, { method: 'DELETE' });
    setChannels((prev) => prev.filter((c) => c.id !== id));
    setEpisodes((prev) => prev.filter((e) => e.channel_id !== id));
    if (selectedChannel?.id === id) setSelectedChannel(null);
  };

  // --- episode ops ---
  const addEpisode = async (data: Partial<Episode>) => {
    const chId = data.channel_id || selectedChannel?.id || '';
    if (data.url && episodes.some((e) => e.channel_id === chId && e.url === data.url)) {
      const existing = episodes.find((e) => e.channel_id === chId && e.url === data.url)!;
      setUrlError({ url: data.url, existingEpisode: existing, pending: data });
      return;
    }
    const ep = makeEpisode(data, chId);
    if (ep.status === 'da_xong') {
      ep.listened_at = new Date();
      ep.next_review_at = calculateNextReview(ep.level);
    }
    const saved = await api('/api/episodes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ep),
    });
    const revived = reviveDates(saved as Episode);
    setEpisodes((prev) => [...prev, revived]);
    setShowEpisodeForm(false);
    setEditingEpisode(null);
  };

  const updateEpisode = async (ep: Episode) => {
    const saved = await api(`/api/episodes/${ep.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...ep, updated_at: new Date() }),
    });
    const revived = reviveDates(saved as Episode);
    setEpisodes((prev) => prev.map((e) => (e.id === ep.id ? revived : e)));
    setShowEpisodeForm(false);
    setEditingEpisode(null);
  };

  const updateEpisodeVocab = async (ep: Episode) => {
    const saved = await api(`/api/episodes/${ep.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ep),
    });
    const revived = reviveDates(saved as Episode);
    setEpisodes((prev) => prev.map((e) => (e.id === ep.id ? revived : e)));
    setViewingEpisode(revived);
  };

  const deleteEpisode = async (id: string) => {
    await api(`/api/episodes/${id}`, { method: 'DELETE' });
    setEpisodes((prev) => prev.filter((e) => e.id !== id));
  };

  const toggleStatus = async (id: string, status: Episode['status']) => {
    const ep = episodes.find((e) => e.id === id);
    if (!ep) return;
    const update: Partial<Episode> = { ...ep, status, updated_at: new Date() };
    if (status === 'da_xong' && !ep.listened_at) {
      update.listened_at = new Date();
      update.next_review_at = calculateNextReview(ep.level);
    }
    const saved = await api(`/api/episodes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(update),
    });
    setEpisodes((prev) => prev.map((e) => (e.id === id ? reviveDates(saved as Episode) : e)));
  };

  const forceAdd = async () => {
    if (!urlError) return;
    const ep = makeEpisode(urlError.pending, selectedChannel?.id || '');
    if (ep.status === 'da_xong') {
      ep.listened_at = new Date();
      ep.next_review_at = calculateNextReview(ep.level);
    }
    const saved = await api('/api/episodes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ep),
    });
    setEpisodes((prev) => [...prev, reviveDates(saved as Episode)]);
    setUrlError(null);
    setShowEpisodeForm(false);
    setEditingEpisode(null);
  };

  // --- derived ---
  const channelEpisodes = selectedChannel
    ? episodes.filter((e) => e.channel_id === selectedChannel.id)
    : episodes;

  const stats = {
    totalEpisodes: episodes.length,
    completed: episodes.filter((e) => e.status === 'da_xong').length,
    inProgress: episodes.filter((e) => e.status === 'dang_nghe').length,
    toReview: episodes.filter((e) => e.status === 'on_lai').length,
    totalVocab: episodes.reduce((s, e) => s + (e.vocabulary || []).length, 0),
  };

  const todayReviews = episodes.filter(
    (e) => e.next_review_at && new Date(e.next_review_at).toDateString() === new Date().toDateString(),
  );

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-neutral-400 text-sm">Đang tải...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors">
      <header className="sticky top-0 z-40 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-950/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                <path d="M19 10v1a7 7 0 0 1-14 0v-1"/>
                <line x1="12" y1="19" x2="12" y2="22"/>
                <line x1="9" y1="22" x2="15" y2="22"/>
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight leading-tight">PodLog</h1>
              <p className="text-[10px] text-neutral-400 dark:text-neutral-500 uppercase tracking-widest font-medium">
                English Learning Tracker
              </p>
            </div>
          </div>
          <button
            onClick={toggleDark}
            className="w-9 h-9 rounded-lg border border-neutral-200 dark:border-neutral-700 flex items-center justify-center bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
            title={dark ? 'Chế độ sáng' : 'Chế độ tối'}
          >
            {dark ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <StatsCard stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <aside className="lg:col-span-3 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                  Kênh học tập
                </h2>
                <button
                  onClick={() => setShowChannelForm(true)}
                  className="w-7 h-7 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                  title="Thêm kênh"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
              <ChannelList
                channels={channels}
                selectedChannelId={selectedChannel?.id || null}
                onSelectChannel={(id) => setSelectedChannel(channels.find((c) => c.id === id) || null)}
                onEditChannel={(ch) => {
                  setSelectedChannel(ch);
                  setShowChannelForm(true);
                }}
                onDeleteChannel={deleteChannel}
              />
            </div>
            <TodayReview episodes={todayReviews} />
          </aside>

          <section className="lg:col-span-9 space-y-6">
            {selectedChannel ? (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
                  <div className="flex items-center gap-3">
                    {selectedChannel.icon || selectedChannel.thumbnail ? (
                      <img
                        src={selectedChannel.icon || selectedChannel.thumbnail}
                        alt={selectedChannel.name}
                        className="w-12 h-12 rounded-lg object-cover border border-neutral-200 dark:border-neutral-700 shrink-0"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    ) : null}
                    <div
                      className={`w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center text-lg font-bold shrink-0 ${
                        selectedChannel.icon || selectedChannel.thumbnail ? 'hidden' : ''
                      }`}
                    >
                      {selectedChannel.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-lg font-bold truncate">{selectedChannel.name}</h2>
                      {selectedChannel.description && (
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 truncate">
                          {selectedChannel.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setShowEpisodeForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shrink-0"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Thêm bài học
                  </button>
                </div>

                <EpisodeList
                  episodes={channelEpisodes}
                  onEditEpisode={(ep) => {
                    setEditingEpisode(ep);
                    setShowEpisodeForm(true);
                  }}
                  onDeleteEpisode={deleteEpisode}
                  onChangeStatus={toggleStatus}
                  onViewEpisode={(ep) => setViewingEpisode(ep)}
                />
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl text-center">
                <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v9m0-9l-3-3m3 3l3-3m-7 9a7 7 0 01-7-7m14 0a7 7 0 01-7 7" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold mb-1">Bắt đầu học ngay</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-xs mb-4">
                  Chọn một kênh bên trái hoặc thêm kênh mới để bắt đầu theo dõi podcast.
                </p>
                <button
                  onClick={() => setShowChannelForm(true)}
                  className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline"
                >
                  Tạo kênh đầu tiên →
                </button>
              </div>
            )}

          </section>
        </div>
      </main>

      {showChannelForm && (
        <ChannelForm
          channel={selectedChannel || undefined}
          onClose={() => {
            setShowChannelForm(false);
            setEditingEpisode(null);
          }}
          onSave={selectedChannel ? updateChannel : addChannel}
          onDelete={
            selectedChannel && channels.some((c) => c.id === selectedChannel.id)
              ? deleteChannel
              : undefined
          }
        />
      )}

      {showEpisodeForm && selectedChannel && (
        <EpisodeForm
          episode={editingEpisode || undefined}
          channelId={selectedChannel.id}
          onClose={() => {
            setShowEpisodeForm(false);
            setEditingEpisode(null);
          }}
          onSave={editingEpisode ? updateEpisode : addEpisode}
          onDelete={
            editingEpisode
              ? () => {
                  deleteEpisode(editingEpisode.id);
                  setShowEpisodeForm(false);
                  setEditingEpisode(null);
                }
              : undefined
          }
        />
      )}

      {viewingEpisode && (
        <EpisodeDetail
          episode={viewingEpisode}
          onClose={() => setViewingEpisode(null)}
          onUpdateEpisode={updateEpisodeVocab}
        />
      )}

      {urlError && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 max-w-sm w-full shadow-xl border border-neutral-200 dark:border-neutral-800">
            <h3 className="text-base font-semibold mb-2">URL đã tồn tại</h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-5">
              URL này đã có trong kênh. Bạn muốn xem bài cũ hay vẫn thêm mới?
            </p>
            <div className="flex gap-2">
              <button
                onClick={forceAdd}
                className="flex-1 px-3 py-2 text-sm border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              >
                Vẫn thêm mới
              </button>
              <button
                onClick={() => {
                  const ep = urlError.existingEpisode;
                  setUrlError(null);
                  setEditingEpisode(ep);
                  setShowEpisodeForm(true);
                }}
                className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Xem bài cũ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
