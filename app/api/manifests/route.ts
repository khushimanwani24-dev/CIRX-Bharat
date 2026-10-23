import { NextResponse } from 'next/server';
import { dataStore } from '@/lib/store';

export async function GET() {
  const manifests = dataStore.getManifests();
  return NextResponse.json({ manifests });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { match_id, transporter_info } = body;

    if (!match_id) {
      return NextResponse.json({ error: 'match_id is required' }, { status: 400 });
    }

    const manifest = dataStore.createManifestForMatch(match_id, transporter_info);
    if (!manifest) {
      return NextResponse.json(
        { error: 'Could not generate manifest. Match or facilities not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      manifest,
      all_manifests: dataStore.getManifests(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to create manifest' },
      { status: 500 }
    );
  }
}
