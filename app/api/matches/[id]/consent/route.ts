import { NextResponse } from 'next/server';
import { dataStore } from '@/lib/store';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const party = body.party as 'generator' | 'offtaker';

    if (!party || (party !== 'generator' && party !== 'offtaker')) {
      return NextResponse.json(
        { error: 'Invalid party specified. Must be generator or offtaker.' },
        { status: 400 }
      );
    }

    const updated = dataStore.toggleMatchConsent(id, party, body.consent);
    if (!updated) {
      return NextResponse.json({ error: 'Match proposal not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      match: updated,
      all_matches: dataStore.getMatches(),
      esg_metrics: dataStore.getESGMetrics(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to update consent' },
      { status: 500 }
    );
  }
}
