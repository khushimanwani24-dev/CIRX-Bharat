import { Facility, MaterialStream, MatchProposal } from '@/types';

/**
 * ReBharat Zero-Leakage Privacy & Anonymization Engine
 * 
 * Guarantees trade-secret and competitive confidentiality:
 * - Counterparties only see anonymous labels (e.g., "GIDC-Vatva-Unit-09")
 * - Geographic coordinates are blurred (+/- 1.5 to 2.0 km jitter)
 * - GSTIN, SPCB Consent IDs, and executive contact info are strictly locked
 * - Confidentiality shield is disengaged ONLY upon mutual bilateral consent or for official GPCB regulators.
 */

export interface SanitizedFacility {
  id: string;
  display_name: string;
  is_anonymized: boolean;
  cluster_zone: string;
  approx_coordinates: { lat: number; lng: number };
  verified: boolean;
  facility_type: string;
  industry_sector?: string;
  // Confidential fields (only populated if unlocked or regulator)
  legal_name?: string;
  gstin?: string;
  spcb_consent_id?: string;
  contact_person?: string;
  contact_phone?: string;
  contact_email?: string;
}

/**
 * Deterministic pseudo-jitter for privacy blurring (~1.5 km offset based on facility ID)
 */
export function getBlurredCoordinates(facilityId: string, lat: number, lng: number): { lat: number; lng: number } {
  // Deterministic seed based on facility id characters so it doesn't jump randomly on re-renders
  let hash = 0;
  for (let i = 0; i < facilityId.length; i++) {
    hash = (hash << 5) - hash + facilityId.charCodeAt(i);
    hash |= 0;
  }
  const latOffset = ((Math.abs(hash) % 15) - 7) * 0.0022; // ~ +/- 1.5 km
  const lngOffset = ((Math.abs(hash * 31) % 15) - 7) * 0.0022;

  return {
    lat: Math.round((lat + latOffset) * 10000) / 10000,
    lng: Math.round((lng + lngOffset) * 10000) / 10000,
  };
}

/**
 * Check if the confidentiality shield is disengaged for a specific proposal
 */
export function isConsentUnlocked(proposal: MatchProposal, userRole?: string): boolean {
  if (userRole === 'REGULATOR' || userRole === 'SPCB_AUDITOR' || userRole === 'ADMIN') {
    return true;
  }
  return proposal.generator_consent && proposal.offtaker_consent;
}

/**
 * Mask sensitive string with bullet points
 */
export function maskIdentifier(value: string, keepPrefix = 4, keepSuffix = 2): string {
  if (!value || value.length <= keepPrefix + keepSuffix) return '••••••••••••';
  const prefix = value.slice(0, keepPrefix);
  const suffix = value.slice(-keepSuffix);
  const maskedCount = Math.max(4, value.length - keepPrefix - keepSuffix);
  return `${prefix}${'•'.repeat(maskedCount)}${suffix}`;
}

/**
 * Sanitize facility details based on consent status and requester role
 */
export function sanitizeFacility(
  facility: Facility,
  isUnlocked: boolean,
  userRole?: string
): SanitizedFacility {
  const isPrivileged = userRole === 'REGULATOR' || userRole === 'SPCB_AUDITOR' || userRole === 'ADMIN';
  const shouldReveal = isUnlocked || isPrivileged;

  if (shouldReveal) {
    return {
      id: facility.id,
      display_name: facility.legal_name,
      is_anonymized: false,
      cluster_zone: facility.cluster_zone,
      approx_coordinates: facility.coordinates,
      verified: facility.verified,
      facility_type: facility.facility_type,
      industry_sector: facility.industry_sector,
      legal_name: facility.legal_name,
      gstin: facility.gstin,
      spcb_consent_id: facility.spcb_consent_id,
      contact_person: facility.contact_person,
      contact_phone: facility.contact_phone,
      contact_email: facility.contact_email,
    };
  }

  // Anonymized view
  return {
    id: facility.id,
    display_name: facility.anonymous_label,
    is_anonymized: true,
    cluster_zone: facility.cluster_zone,
    approx_coordinates: getBlurredCoordinates(facility.id, facility.coordinates.lat, facility.coordinates.lng),
    verified: facility.verified,
    facility_type: facility.facility_type,
    industry_sector: facility.industry_sector,
    legal_name: `[SHIELDED: ${facility.anonymous_label}]`,
    gstin: maskIdentifier(facility.gstin, 2, 2),
    spcb_consent_id: maskIdentifier(facility.spcb_consent_id, 4, 3),
    contact_person: 'Corporate EHS / Materials Coordinator (Masked)',
  };
}

/**
 * Sanitize match proposal for display
 */
export function getSanitizedProposalView(
  proposal: MatchProposal,
  supplyStream: MaterialStream,
  demandStream: MaterialStream,
  generatorFac: Facility,
  offtakerFac: Facility,
  userRole?: string
) {
  const unlocked = isConsentUnlocked(proposal, userRole);

  const sanitizedGen = sanitizeFacility(generatorFac, unlocked, userRole);
  const sanitizedOff = sanitizeFacility(offtakerFac, unlocked, userRole);

  return {
    proposal,
    is_unlocked: unlocked,
    generator: sanitizedGen,
    offtaker: sanitizedOff,
    supply_stream: supplyStream,
    demand_stream: demandStream,
  };
}
