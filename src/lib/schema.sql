CREATE TABLE IF NOT EXISTS channels (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  icon        TEXT,
  thumbnail   TEXT,
  homepage_url TEXT,
  description TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS episodes (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id     UUID NOT NULL REFERENCES channels(id) ON DELETE CASCADE,
  title          TEXT NOT NULL,
  url            TEXT,
  image          TEXT,
  status         TEXT NOT NULL DEFAULT 'chua_nghe'
                 CHECK (status IN ('chua_nghe', 'dang_nghe', 'da_xong', 'on_lai')),
  level          TEXT NOT NULL DEFAULT 'B1'
                 CHECK (level IN ('A1','A2','B1','B2','C1','C2')),
  rating         INTEGER NOT NULL DEFAULT 3 CHECK (rating BETWEEN 1 AND 5),
  tags           JSONB NOT NULL DEFAULT '[]'::jsonb,
  notes          TEXT NOT NULL DEFAULT '',
  vocabulary     JSONB NOT NULL DEFAULT '[]'::jsonb,
  listened_at    TIMESTAMPTZ,
  next_review_at TIMESTAMPTZ,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_episodes_channel_id ON episodes(channel_id);
CREATE INDEX IF NOT EXISTS idx_episodes_next_review ON episodes(next_review_at)
  WHERE next_review_at IS NOT NULL;
