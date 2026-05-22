import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const channelId = req.nextUrl.searchParams.get('channel_id');
    if (channelId) {
      const { rows } = await pool.query(
        'SELECT * FROM episodes WHERE channel_id = $1 ORDER BY created_at DESC',
        [channelId],
      );
      return NextResponse.json(rows);
    }
    const { rows } = await pool.query('SELECT * FROM episodes ORDER BY created_at DESC');
    return NextResponse.json(rows);
  } catch (e) {
    console.error('GET /api/episodes error:', e);
    return NextResponse.json({ error: 'Failed to fetch episodes' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { rows } = await pool.query(
      `INSERT INTO episodes (id, channel_id, title, url, image, status, level, rating, tags, notes, vocabulary, progress_seconds, duration_seconds, listened_at, next_review_at, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
       RETURNING *`,
      [
        body.id,
        body.channel_id,
        body.title,
        body.url || null,
        body.image || null,
        body.status || 'chua_nghe',
        body.level || 'B1',
        body.rating || 3,
        JSON.stringify(body.tags || []),
        body.notes || '',
        JSON.stringify(body.vocabulary || []),
        body.progress_seconds ?? 0,
        body.duration_seconds ?? null,
        body.listened_at || null,
        body.next_review_at || null,
        body.created_at || new Date().toISOString(),
        body.updated_at || new Date().toISOString(),
      ],
    );
    return NextResponse.json(rows[0], { status: 201 });
  } catch (e) {
    console.error('POST /api/episodes error:', e);
    return NextResponse.json({ error: 'Failed to create episode' }, { status: 500 });
  }
}
