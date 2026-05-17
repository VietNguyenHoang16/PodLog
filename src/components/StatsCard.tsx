'use client';

interface StatsCardProps {
  stats: {
    totalEpisodes: number;
    completed: number;
    inProgress: number;
    toReview: number;
    totalVocab: number;
  };
}

export function StatsCard({ stats }: StatsCardProps) {
  const rate = stats.totalEpisodes > 0
    ? Math.round((stats.completed / stats.totalEpisodes) * 100)
    : 0;

  const items = [
    { label: 'Tổng bài', value: stats.totalEpisodes, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { label: 'Hoàn thành', value: stats.completed, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
    { label: 'Đang học', value: stats.inProgress, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
    { label: 'Cần ôn', value: stats.toReview, color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-900/20' },
    { label: 'Từ vựng', value: stats.totalVocab, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-3 flex flex-col items-center justify-center transition-all hover:shadow-md hover:-translate-y-0.5"
        >
          <div className={`w-9 h-9 rounded-full flex items-center justify-center mb-1.5 font-bold text-sm ${item.bg} ${item.color}`}>
            {item.value}
          </div>
          <span className="text-[11px] font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-tight">
            {item.label}
          </span>
        </div>
      ))}
      <div className="bg-blue-600 text-white rounded-xl p-3 flex flex-col items-center justify-center shadow-sm transition-all hover:scale-[1.02]">
        <div className="text-xl font-extrabold">{rate}%</div>
        <span className="text-[11px] font-bold uppercase tracking-wider opacity-80">Tiến độ</span>
      </div>
    </div>
  );
}
