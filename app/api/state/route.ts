import { NextResponse } from 'next/server';
import { dataStore } from '@/lib/store';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const reset = searchParams.get('reset');

  if (reset === 'true') {
    dataStore.reset();
  }

  const facilities = dataStore.getFacilities();
  const streams = dataStore.getStreams();
  const matches = dataStore.getMatches();
  const manifests = dataStore.getManifests();
  const esgMetrics = dataStore.getESGMetrics();

  return NextResponse.json({
    facilities,
    streams,
    matches,
    manifests,
    esg_metrics: esgMetrics,
  });
}
