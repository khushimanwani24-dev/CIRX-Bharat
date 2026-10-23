import { NextResponse } from 'next/server';
import { dataStore } from '@/lib/store';
import { ManifestStatus, ManifestCopyColor } from '@/types';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, current_copy } = body;

    const updated = dataStore.updateManifestStatus(
      id,
      status as ManifestStatus,
      current_copy as ManifestCopyColor
    );

    if (!updated) {
      return NextResponse.json({ error: 'Manifest not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      manifest: updated,
      all_manifests: dataStore.getManifests(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to update manifest' },
      { status: 500 }
    );
  }
}
