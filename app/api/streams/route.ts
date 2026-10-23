import { NextResponse } from 'next/server';
import { dataStore } from '@/lib/store';
import { MaterialStream } from '@/types';

export async function GET() {
  const streams = dataStore.getStreams();
  return NextResponse.json({ streams });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.facility_id || !body.material_name || !body.monthly_volume_mt) {
      return NextResponse.json(
        { error: 'Missing required stream parameters (facility_id, material_name, monthly_volume_mt)' },
        { status: 400 }
      );
    }

    const newStream = dataStore.addStream({
      facility_id: body.facility_id,
      stream_type: body.stream_type || 'SUPPLY',
      cpcb_waste_code: body.cpcb_waste_code || 'Cat-Industrial',
      material_name: body.material_name,
      physical_state: body.physical_state || 'SOLID',
      monthly_volume_mt: Number(body.monthly_volume_mt),
      ph_level: body.ph_level !== undefined && body.ph_level !== '' ? Number(body.ph_level) : undefined,
      calorific_value_kcal: body.calorific_value_kcal ? Number(body.calorific_value_kcal) : undefined,
      moisture_percent: body.moisture_percent ? Number(body.moisture_percent) : undefined,
      is_hazardous: Boolean(body.is_hazardous),
      price_per_mt: Number(body.price_per_mt || 0),
      assay_report_url: body.assay_report_url || 'https://rebharat.in/reports/assay-pending.pdf',
      chemical_assay_summary: body.chemical_assay_summary || 'Standard laboratory assay verification in progress',
    });

    const matches = dataStore.getMatches();

    return NextResponse.json({
      success: true,
      stream: newStream,
      updated_matches: matches,
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to ingest stream' },
      { status: 500 }
    );
  }
}
