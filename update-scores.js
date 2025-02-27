import { NextResponse } from 'next/server';
import { get, set } from '@vercel/edge-config';

export const config = { runtime: 'edge' };

export async function POST(req) {
  try {
    const { name, score } = await req.json();
    const currentScores = (await get('scores')) || [];
    
    // Update scores
    const newScores = [...currentScores, { name, score }]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    await set('scores', newScores);
    
    return NextResponse.json(newScores);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update scores' },
      { status: 500 }
    );
  }
}
