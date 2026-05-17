import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { rows } = await pool.query('SELECT * FROM channels WHERE id = $1', [params.id]);
    if (rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(rows[0]);
  } catch (e) {
    console.error('GET /api/channels/[id] error:', e);
    return NextResponse.json({ error: 'Failed to fetch channel' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { rows } = await pool.query(
      `UPDATE channels
       SET name = $1, icon = $2, thumbnail = $3, homepage_url = $4, description = $5
       WHERE id = $6
       RETURNING *`,
      [body.name, body.icon || null, body.thumbnail || null, body.homepage_url || null, body.description || null, params.id],
    );
    if (rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(rows[0]);
  } catch (e) {
    console.error('PUT /api/channels/[id] error:', e);
    return NextResponse.json({ error: 'Failed to update channel' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { rowCount } = await pool.query('DELETE FROM channels WHERE id = $1', [params.id]);
    if (rowCount === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('DELETE /api/channels/[id] error:', e);
    return NextResponse.json({ error: 'Failed to delete channel' }, { status: 500 });
  }
}
