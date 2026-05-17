import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const { rows } = await pool.query('SELECT * FROM channels ORDER BY created_at DESC');
    return NextResponse.json(rows);
  } catch (e) {
    console.error('GET /api/channels error:', e);
    return NextResponse.json({ error: 'Failed to fetch channels' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { rows } = await pool.query(
      `INSERT INTO channels (id, name, icon, thumbnail, homepage_url, description, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [body.id, body.name, body.icon || null, body.thumbnail || null, body.homepage_url || null, body.description || null, body.created_at || new Date().toISOString()],
    );
    return NextResponse.json(rows[0], { status: 201 });
  } catch (e) {
    console.error('POST /api/channels error:', e);
    return NextResponse.json({ error: 'Failed to create channel' }, { status: 500 });
  }
}
