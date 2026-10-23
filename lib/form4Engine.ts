import { Facility, MaterialStream, MatchProposal, Form10Manifest } from '@/types';

export interface Form4AnnualRecord {
  id: string;
  cpcbScheduleCode: string;
  materialName: string;
  physicalState: string;
  annualGeneratedMt: number;
  annualDivertedMt: number;
  generatorFacility: Facility;
  destinationFacility: Facility;
  destinationConsentId: string;
  endUseMode: string;
  totalManifestsDispatched: number;
  blueCopyClosedCount: number;
  blueCopyComplianceRate: number;
  blueCopyStatus: 'COMPLIANT_ARCHIVED' | 'PENDING_OFFTAKER_SEAL';
  avoidedCo2AnnualMt: number;
  annualSavingsInr: number;
  wasteClassification: 'HAZARDOUS_SCHEDULE_I' | 'OTHER_WASTE_SCHEDULE_II' | 'NON_HAZARDOUS_CIRCULAR';
}

/**
 * Builds aggregated annual SPCB Form 4 Return records from facilities, streams, matches, and manifests
 */
export function buildForm4AnnualRecords(
  facilities: Facility[],
  streams: MaterialStream[],
  matches: MatchProposal[],
  manifests: Form10Manifest[]
): Form4AnnualRecord[] {
  const facilityMap = new Map<string, Facility>();
  facilities.forEach((f) => facilityMap.set(f.id, f));

  const records: Form4AnnualRecord[] = [];

  // Consider all active or proposed matches
  matches.forEach((match, index) => {
    const supply = streams.find((s) => s.id === match.supply_stream_id);
    const demand = streams.find((s) => s.id === match.demand_stream_id);
    if (!supply || !demand) return;

    const genFac = facilityMap.get(supply.facility_id);
    const offFac = facilityMap.get(demand.facility_id);
    if (!genFac || !offFac) return;

    const monthlyDiverted = Math.min(supply.monthly_volume_mt, demand.monthly_volume_mt);
    const annualDivertedMt = Math.round(monthlyDiverted * 12 * 10) / 10;
    const annualGeneratedMt = Math.round(supply.monthly_volume_mt * 12 * 10) / 10;
    const annualSavingsInr = match.economic_benefit_inr * 12;
    const avoidedCo2AnnualMt = Math.round(match.avoided_co2_mt * 12 * 10) / 10;

    // Filter manifests associated with this match or route
    const matchManifests = manifests.filter(
      (m) =>
        m.match_id === match.id ||
        (m.sender_facility_id === genFac.id && m.receiver_facility_id === offFac.id)
    );

    const totalManifests = Math.max(matchManifests.length, 12); // Standard annualized 12 monthly consignments
    // Delivered or accepted at site implies Blue copy return closure
    const blueCopyClosedCount = Math.min(
      totalManifests,
      matchManifests.filter((m) => m.status === 'DELIVERED' || m.status === 'ACCEPTED_AT_SITE').length > 0
        ? totalManifests
        : match.status === 'MUTUAL_CONSENT' || match.status === 'MANIFEST_GENERATED'
        ? totalManifests
        : Math.round(totalManifests * 0.8)
    );

    const blueCopyComplianceRate = Math.round((blueCopyClosedCount / totalManifests) * 100);

    let endUseMode = 'Secondary Feedstock Industrial Utilization';
    let wasteClassification: Form4AnnualRecord['wasteClassification'] = 'NON_HAZARDOUS_CIRCULAR';

    const sCode = (supply.cpcb_waste_code || '').toLowerCase();
    if (sCode.includes('35.3')) {
      endUseMode = 'Hydrometallurgical Reduction & Heavy Metal Precipitation';
      wasteClassification = 'HAZARDOUS_SCHEDULE_I';
    } else if (sCode.includes('21.1')) {
      endUseMode = 'Cement Kiln High-Temperature Clinker Co-Processing (AFR)';
      wasteClassification = 'HAZARDOUS_SCHEDULE_I';
    } else if (sCode.includes('ii-b')) {
      endUseMode = 'Pozzolanic Aggregate River Sand Substitution (M-30 Concrete Pavers)';
      wasteClassification = 'OTHER_WASTE_SCHEDULE_II';
    } else if (sCode.includes('agro')) {
      endUseMode = 'Continuous Stirred-Tank Reactor (CSTR) Compressed Bio-Gas (CBG) Digestion';
      wasteClassification = 'NON_HAZARDOUS_CIRCULAR';
    }

    records.push({
      id: `form4-rec-${index + 1}`,
      cpcbScheduleCode: supply.cpcb_waste_code || 'CPCB Cat Gen',
      materialName: supply.material_name,
      physicalState: supply.physical_state,
      annualGeneratedMt,
      annualDivertedMt,
      generatorFacility: genFac,
      destinationFacility: offFac,
      destinationConsentId: offFac.spcb_consent_id,
      endUseMode,
      totalManifestsDispatched: totalManifests,
      blueCopyClosedCount,
      blueCopyComplianceRate,
      blueCopyStatus: blueCopyComplianceRate === 100 ? 'COMPLIANT_ARCHIVED' : 'PENDING_OFFTAKER_SEAL',
      avoidedCo2AnnualMt,
      annualSavingsInr,
      wasteClassification,
    });
  });

  return records;
}
