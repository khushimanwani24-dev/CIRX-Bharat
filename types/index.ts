export type FacilityType = 'GENERATOR' | 'OFFTAKER' | 'RECOVERY_HUB';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Facility {
  id: string;
  legal_name: string;
  anonymous_label: string; // e.g., "MIDC-Ambad-Unit-14"
  gstin: string;
  spcb_consent_id: string;
  cluster_zone: string;
  coordinates: Coordinates;
  contact_person: string;
  contact_phone?: string;
  contact_email?: string;
  verified: boolean;
  facility_type: FacilityType;
  industry_sector?: string;
}

export type PhysicalState = 'LIQUID' | 'SOLID' | 'SLUDGE';
export type StreamType = 'SUPPLY' | 'DEMAND';

export interface MaterialStream {
  id: string;
  facility_id: string;
  stream_type: StreamType;
  cpcb_waste_code: string; // e.g. "Cat 35.3", "Cat 21.1", "Schedule II-B"
  material_name: string;
  physical_state: PhysicalState;
  monthly_volume_mt: number;
  ph_level?: number;
  calorific_value_kcal?: number;
  moisture_percent?: number;
  is_hazardous: boolean;
  price_per_mt: number; // positive for sale revenue, negative for disposal fee
  assay_report_url: string;
  chemical_assay_summary?: string;
  created_at?: string;
}

export type MatchStatus = 'PROPOSED' | 'MUTUAL_CONSENT' | 'MANIFEST_GENERATED' | 'COMPLETED';

export interface MatchScoreBreakdown {
  chemical_compatibility: number; // 0.0 - 1.0
  distance_score: number;          // 0.0 - 1.0
  volume_ratio: number;            // 0.0 - 1.0
  compatibility_notes: string[];
}

export interface MatchProposal {
  id: string;
  supply_stream_id: string;
  demand_stream_id: string;
  match_score: number; // 0 - 100
  transit_distance_km: number;
  avoided_co2_mt: number; // 0.82 kg CO2e per kg diverted
  economic_benefit_inr: number; // monthly savings in INR
  status: MatchStatus;
  generator_consent: boolean;
  offtaker_consent: boolean;
  unlocked_at?: string;
  breakdown: MatchScoreBreakdown;
  recommended_logistics_mode?: string;
}

export type ManifestStatus = 'DRAFT' | 'DISPATCHED' | 'IN_TRANSIT' | 'DELIVERED' | 'ACCEPTED_AT_SITE';

export type ManifestCopyColor = 'WHITE' | 'YELLOW' | 'PINK' | 'ORANGE' | 'GREEN' | 'BLUE' | 'GREY';

export interface ManifestCopyMeta {
  copy_number: number;
  color: ManifestCopyColor;
  title: string;
  recipient_role: string;
  regulatory_instruction: string;
}

export interface Form10Manifest {
  id: string;
  manifest_number: string; // e.g., "CPCB/MH/NSK/2026/F10-0942"
  match_id: string;
  sender_facility_id: string;
  receiver_facility_id: string;
  sender_facility?: Facility;
  receiver_facility?: Facility;
  transporter_name: string;
  vehicle_no: string;
  transporter_license: string;
  driver_name: string;
  driver_phone: string;
  waste_category: string;
  material_name: string;
  physical_state: PhysicalState;
  quantity_dispatched_mt: number;
  packaging_type: string;
  special_handling_instructions: string;
  emergency_contact: string;
  dispatch_date: string;
  expected_delivery_date: string;
  spcb_noc_reference: string;
  status: ManifestStatus;
  current_copy?: ManifestCopyColor;
  color_slip_distribution?: ManifestCopyMeta[];
}

export interface ClusterESGMetrics {
  total_diverted_mt: number;
  total_savings_inr: number;
  total_avoided_co2_mt: number;
  active_symbioses_count: number;
  hazardous_treated_mt: number;
}
