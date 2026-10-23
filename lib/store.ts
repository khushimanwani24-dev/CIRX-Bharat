import seedData from '@/data/seed.json';
import {
  Facility,
  MaterialStream,
  MatchProposal,
  Form10Manifest,
  ClusterESGMetrics,
  ManifestStatus,
  ManifestCopyColor,
} from '@/types';
import { runMatchingEngine } from './matchingEngine';
import { generateForm10Manifest } from './manifestEngine';

// In-memory runtime state for serverless API routes with seed fallback
class ReBharatDataStore {
  private facilities: Facility[];
  private streams: MaterialStream[];
  private matches: MatchProposal[];
  private manifests: Form10Manifest[];

  constructor() {
    this.facilities = JSON.parse(JSON.stringify(seedData.facilities)) as Facility[];
    this.streams = JSON.parse(JSON.stringify(seedData.material_streams)) as MaterialStream[];
    this.matches = JSON.parse(JSON.stringify(seedData.match_proposals)) as MatchProposal[];
    this.manifests = JSON.parse(JSON.stringify(seedData.manifests)) as Form10Manifest[];

    // Ensure facilities are hydrated on manifests
    this.hydrateManifests();
  }

  private hydrateManifests() {
    for (const m of this.manifests) {
      if (!m.sender_facility) {
        m.sender_facility = this.facilities.find((f) => f.id === m.sender_facility_id);
      }
      if (!m.receiver_facility) {
        m.receiver_facility = this.facilities.find((f) => f.id === m.receiver_facility_id);
      }
    }
  }

  public getFacilities(): Facility[] {
    return this.facilities;
  }

  public getFacilityById(id: string): Facility | undefined {
    return this.facilities.find((f) => f.id === id);
  }

  public getStreams(): MaterialStream[] {
    return this.streams;
  }

  public getStreamById(id: string): MaterialStream | undefined {
    return this.streams.find((s) => s.id === id);
  }

  public getMatches(): MatchProposal[] {
    // Re-run matching engine to pick up any dynamic streams added
    const computed = runMatchingEngine(this.facilities, this.streams, this.matches);
    this.matches = computed;
    return this.matches;
  }

  public getManifests(): Form10Manifest[] {
    this.hydrateManifests();
    return this.manifests;
  }

  public addStream(streamData: Omit<MaterialStream, 'id' | 'created_at'>): MaterialStream {
    const id = `stream-${Date.now().toString().slice(-6)}`;
    const newStream: MaterialStream = {
      ...streamData,
      id,
      created_at: new Date().toISOString(),
    };
    this.streams.push(newStream);

    // Refresh matches with new stream
    this.getMatches();
    return newStream;
  }

  public toggleMatchConsent(
    matchId: string,
    party: 'generator' | 'offtaker',
    consentValue?: boolean
  ): MatchProposal | null {
    const match = this.matches.find((m) => m.id === matchId);
    if (!match) return null;

    if (party === 'generator') {
      match.generator_consent = consentValue !== undefined ? consentValue : !match.generator_consent;
    } else {
      match.offtaker_consent = consentValue !== undefined ? consentValue : !match.offtaker_consent;
    }

    if (match.generator_consent && match.offtaker_consent) {
      if (match.status === 'PROPOSED') {
        match.status = 'MUTUAL_CONSENT';
      }
      if (!match.unlocked_at) {
        match.unlocked_at = new Date().toISOString();
      }
    } else {
      if (match.status === 'MUTUAL_CONSENT') {
        match.status = 'PROPOSED';
      }
    }

    return match;
  }

  public createManifestForMatch(
    matchId: string,
    transporterInfo?: {
      transporter_name?: string;
      vehicle_no?: string;
      driver_name?: string;
      driver_phone?: string;
      packaging_type?: string;
    }
  ): Form10Manifest | null {
    const match = this.matches.find((m) => m.id === matchId);
    if (!match) return null;

    const supply = this.streams.find((s) => s.id === match.supply_stream_id);
    if (!supply) return null;

    const sender = this.facilities.find((f) => f.id === supply.facility_id);
    const demand = this.streams.find((s) => s.id === match.demand_stream_id);
    const receiver = demand ? this.facilities.find((f) => f.id === demand.facility_id) : undefined;

    if (!sender || !receiver) return null;

    const manifest = generateForm10Manifest(match, supply, sender, receiver, transporterInfo);
    this.manifests.unshift(manifest);

    match.status = 'MANIFEST_GENERATED';
    return manifest;
  }

  public updateManifestStatus(
    manifestId: string,
    status: ManifestStatus,
    currentCopy?: ManifestCopyColor
  ): Form10Manifest | null {
    const manifest = this.manifests.find((m) => m.id === manifestId);
    if (!manifest) return null;

    manifest.status = status;
    if (currentCopy) {
      manifest.current_copy = currentCopy;
    }
    return manifest;
  }

  public getESGMetrics(): ClusterESGMetrics {
    // Calculate aggregate ESG metrics across all active/consented exchanges
    const activeMatches = this.matches.filter(
      (m) => m.status === 'MUTUAL_CONSENT' || m.status === 'MANIFEST_GENERATED' || m.status === 'COMPLETED'
    );

    let totalDivertedMt = 0;
    let totalSavingsInr = 0;
    let totalAvoidedCo2Mt = 0;
    let hazardousTreatedMt = 0;

    for (const match of activeMatches) {
      const supply = this.streams.find((s) => s.id === match.supply_stream_id);
      const demand = this.streams.find((s) => s.id === match.demand_stream_id);
      if (supply && demand) {
        const vol = Math.min(supply.monthly_volume_mt, demand.monthly_volume_mt);
        totalDivertedMt += vol;
        totalSavingsInr += match.economic_benefit_inr;
        totalAvoidedCo2Mt += match.avoided_co2_mt;
        if (supply.is_hazardous) {
          hazardousTreatedMt += vol;
        }
      }
    }

    return {
      total_diverted_mt: totalDivertedMt,
      total_savings_inr: totalSavingsInr,
      total_avoided_co2_mt: Math.round(totalAvoidedCo2Mt * 10) / 10,
      active_symbioses_count: activeMatches.length,
      hazardous_treated_mt: hazardousTreatedMt,
    };
  }

  public reset(): void {
    this.facilities = JSON.parse(JSON.stringify(seedData.facilities)) as Facility[];
    this.streams = JSON.parse(JSON.stringify(seedData.material_streams)) as MaterialStream[];
    this.matches = JSON.parse(JSON.stringify(seedData.match_proposals)) as MatchProposal[];
    this.manifests = JSON.parse(JSON.stringify(seedData.manifests)) as Form10Manifest[];
    this.hydrateManifests();
  }
}

// Global singleton instance for hot-reloading in dev
declare global {
  // eslint-disable-next-line no-var
  var __rebharatStore: ReBharatDataStore | undefined;
}

export const dataStore = global.__rebharatStore || new ReBharatDataStore();
if (process.env.NODE_ENV !== 'production') {
  global.__rebharatStore = dataStore;
}
