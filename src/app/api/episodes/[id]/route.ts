import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { rows } = await pool.query('SELECT * FROM episodes WHERE id = $1', [params.id]);
    if (rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(rows[0]);
  } catch (e) {
    console.error('GET /api/episodes/[id] error:', e);
    return NextResponse.json({ error: 'Failed to fetch episode' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { rows } = await pool.query(
      `UPDATE episodes
       SET title = $1, url = $2, image = $3, status = $4, level = $5, rating = $6,
           tags = $7, notes = $8, vocabulary = $9,
           listened_at = $10, next_review_at = $11, updated_at = $12
       WHERE id = $13
       RETURNING *`,
      [
        body.title,
        body.url || null,
        body.image || null,
        body.status,
        body.level || 'B1',
        body.rating || 3,
        JSON.stringify(body.tags || []),
        body.notes || '',
        JSON.stringify(body.vocabulary || []),
        body.listened_at || null,
        body.next_review_at || null,
        new Date().toISOString(),
        params.id,
      ],
    );
    if (rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(rows[0]);
  } catch (e) {
    console.error('PUT /api/episodes/[id] error:', e);
    return NextResponse.json({ error: 'Failed to update episode' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { rowCount } = await pool.query('DELETE FROM episodes WHERE id = $1', [params.id]);
    if (rowCount === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('DELETE /api/episodes/[id] error:', e);
    return NextResponse.json({ error: 'Failed to delete episode' }, { status: 500 });
  }
}
