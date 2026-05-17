export interface Channel {
  id: string;
  name: string;
  icon?: string;
  thumbnail?: string;
  homepage_url?: string;
  description?: string;
  created_at: Date;
}

export interface Episode {
  id: string;
  channel_id: string;
  title: string;
  url?: string;
  image?: string;
  status: 'chua_nghe' | 'dang_nghe' | 'da_xong' | 'on_lai';
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  rating: number; // 1-5
  tags: string[];
  notes: string;
  vocabulary: Vocabulary[];
  listened_at?: Date;
  next_review_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface Vocabulary {
  id: string;
  episode_id: string;
  word: string;
  definition: string;
  example: string;
  created_at: Date;
}
