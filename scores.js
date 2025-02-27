import { NextResponse } from 'next/server';
import { get } from '@vercel/edge-config';

export const config = { runtime: 'edge' };

export async function GET() {
  try {
    const scores = await get('scores');
    return NextResponse.json(scores || []);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load scores' },
      { status: 500 }
    );
  }
}
