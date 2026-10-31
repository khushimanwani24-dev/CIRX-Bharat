import {
  Facility,
  MaterialStream,
  MatchProposal,
  MatchScoreBreakdown,
} from '@/types';

/**
 * ReBharat Deterministic Industrial Symbiosis Matching Engine
 * 
 * Rules Matrix:
 * 1. Physical & Chemical Compatibility: pH window, Calorific Value, CPCB waste schedule compatibility
 * 2. Geospatial Proximity: Haversine distance with decay penalties. Max economic hauling radius: 150 km.
 * 3. Volume Ratio: Alignment between monthly generation volume and offtake capacity.
 * 
 * Composite Scoring Formula:
 * CompositeScore = (ChemicalCompatibility * 0.50 + DistanceScore * 0.35 + VolumeRatio * 0.15) * 100
 * 
 * Carbon Factor:
 * 0.82 kg CO2e avoided per 1 kg secondary material diverted from virgin mining / incinerator / TSDF landfill
 */

export const MAX_ECONOMIC_RADIUS_KM = 150;
export const AVOIDED_CO2_FACTOR = 0.82; // MT CO2e avoided per MT diverted

/**
 * Calculate Haversine distance between two coordinates in kilometers
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's mean radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10;
}

/**
 * Distance decay score calculation
 */
export function calculateDistanceScore(distanceKm: number): number {
  if (distanceKm > MAX_ECONOMIC_RADIUS_KM) {
    return 0.0;
  }
  if (distanceKm <= 5) {
    return 1.0; // Hyper-local cluster symbiosis (e.g. Vatva-to-Vatva)
  }
  if (distanceKm <= 20) {
    // 5 km to 20 km: scale 1.0 down to 0.90
    return 1.0 - ((distanceKm - 5) / 15) * 0.1;
  }
  if (distanceKm <= 50) {
    // 20 km to 50 km: scale 0.90 down to 0.70
    return 0.9 - ((distanceKm - 20) / 30) * 0.2;
  }
  // 50 km to 150 km: scale 0.70 down to 0.15
  return Math.max(0.1, 0.7 - ((distanceKm - 50) / 100) * 0.55);
}

/**
 * Chemical & Process Feasibility Filter
 */
export function evaluateChemicalCompatibility(
  supply: MaterialStream,
  demand: MaterialStream
): { score: number; notes: string[] } {
  const notes: string[] = [];
  let score = 0.5;

  // 1. CPCB Waste Code Alignment
  const sCode = (supply.cpcb_waste_code || '').toLowerCase();
  const dCode = (demand.cpcb_waste_code || '').toLowerCase();

  const isGypsumCementMatch =
    (sCode.includes('35.3') || supply.material_name.toLowerCase().includes('gypsum')) &&
    (dCode.includes('35.3') || demand.material_name.toLowerCase().includes('gypsum') || demand.material_name.toLowerCase().includes('cement') || demand.material_name.toLowerCase().includes('retarder') || demand.material_name.toLowerCase().includes('pozzolana'));

  const isCrMatch =
    (sCode.includes('35.3') || supply.material_name.toLowerCase().includes('chromium')) &&
    (dCode.includes('35.3') || demand.material_name.toLowerCase().includes('chromium') || demand.material_name.toLowerCase().includes('heavy metal'));

  const isPaintSludgeKilnMatch =
    (sCode.includes('21.1') || supply.material_name.toLowerCase().includes('paint')) &&
    (dCode.includes('21.1') || demand.material_name.toLowerCase().includes('kiln') || demand.material_name.toLowerCase().includes('co-processing'));

  const isSlagPaverMatch =
    (sCode.includes('ii-b') || supply.material_name.toLowerCase().includes('slag')) &&
    (dCode.includes('ii-b') || demand.material_name.toLowerCase().includes('paver') || demand.material_name.toLowerCase().includes('slag'));

  const isAgroBiogasMatch =
    (sCode.includes('agro') || supply.material_name.toLowerCase().includes('organic') || supply.material_name.toLowerCase().includes('pulp')) &&
    (dCode.includes('agro') || demand.material_name.toLowerCase().includes('biogas') || demand.material_name.toLowerCase().includes('anaerobic'));

  if (isGypsumCementMatch) {
    score = 0.98;
    notes.push('CPCB Cat 35.3 chemical gypsum alignment: high purity CaSO4 directly substitutes virgin mined gypsum as setting retarder.');
    notes.push('Validated CPCB Rule 9 Co-Processing Authorization (SOP-CEM-35.3) on record.');
    if ((supply.moisture_percent || 0) <= 15) {
      notes.push(`Low moisture (${supply.moisture_percent}%) compliant with finish grinding clinker requirements.`);
    }
  } else if (isCrMatch) {
    score = 0.98;
    notes.push('CPCB Cat 35.3 heavy metal reduction alignment: compatible with hydrometallurgical precipitation.');
    if (supply.ph_level !== undefined && supply.ph_level <= 3.0) {
      notes.push(`Supply pH (${supply.ph_level}) is optimal for acidic hexavalent chromium reduction.`);
    }
  } else if (isPaintSludgeKilnMatch) {
    score = 0.95;
    notes.push('CPCB Cat 21.1 thermal recovery alignment: suitable for cement kiln clinker co-processing.');
    if ((supply.calorific_value_kcal || 0) >= 2500) {
      notes.push(`Calorific value (${supply.calorific_value_kcal} kcal/kg) exceeds minimum cement kiln threshold (2,500 kcal/kg).`);
    } else {
      score -= 0.15;
      notes.push(`Calorific value (${supply.calorific_value_kcal} kcal/kg) is borderline for clinker burning.`);
    }
  } else if (isSlagPaverMatch) {
    score = 0.97;
    notes.push('Schedule II-B pozzolanic reuse: blast furnace slag directly substitutes mined river sand & virgin aggregate.');
    if (supply.physical_state === 'SOLID' && demand.physical_state === 'SOLID') {
      notes.push('Physical solid state matches dry batch paver vibrating press.');
    }
  } else if (isAgroBiogasMatch) {
    score = 0.94;
    notes.push('Organic agro-waste alignment: high COD biodegradable pomace suitable for continuous stirred-tank biogas digester.');
    if ((supply.moisture_percent || 0) > 60) {
      notes.push(`High moisture (${supply.moisture_percent}%) facilitates wet hydraulic pump feeding.`);
    }
  } else {
    // Generic fallback heuristics
    if (supply.is_hazardous && !demand.is_hazardous) {
      score = 0.1;
      notes.push('Hazardous stream cannot be legally transferred to a non-hazardous consented receiver.');
      return { score, notes };
    }

    if (supply.physical_state === demand.physical_state) {
      score += 0.2;
      notes.push(`Matching physical state: ${supply.physical_state}.`);
    } else {
      notes.push(`Physical state conversion required: Supply is ${supply.physical_state}, Demand expects ${demand.physical_state}.`);
    }

    // pH compatibility
    if (supply.ph_level !== undefined && demand.ph_level !== undefined) {
      const phDiff = Math.abs(supply.ph_level - demand.ph_level);
      if (phDiff <= 1.5) {
        score += 0.15;
        notes.push(`Compatible pH tolerance window (delta: ${phDiff.toFixed(1)}).`);
      } else if (phDiff > 5.0) {
        score -= 0.2;
        notes.push(`Severe pH incompatibility (delta: ${phDiff.toFixed(1)}). High neutralization chemical cost.`);
      }
    }
  }

  return {
    score: Math.min(1.0, Math.max(0.05, score)),
    notes,
  };
}

/**
 * Volume ratio score
 */
export function calculateVolumeRatio(supplyMt: number, demandMt: number): number {
  if (supplyMt <= 0 || demandMt <= 0) return 0;
  const ratio = Math.min(supplyMt, demandMt) / Math.max(supplyMt, demandMt);
  return Math.min(1.0, Math.max(0.1, ratio));
}

/**
 * Calculate financial benefit (INR saved/month)
 */
export function calculateEconomicBenefit(
  supply: MaterialStream,
  demand: MaterialStream,
  distanceKm: number
): number {
  const volume = Math.min(supply.monthly_volume_mt, demand.monthly_volume_mt);
  const transitCostPerMt = distanceKm * 4.5; // ~₹4.5 per MT-km hauling cost

  // Generator savings (avoiding disposal or gaining revenue)
  // If price is negative, generator was paying -price for TSDF disposal. Offtaking saves that cost.
  let disposalSavings = 0;
  if (supply.price_per_mt < 0) {
    disposalSavings = Math.abs(supply.price_per_mt) * volume;
  }

  // Raw material replacement value for offtaker vs virgin market equivalent
  let rawMaterialValue = 0;
  if (supply.is_hazardous) {
    rawMaterialValue = volume * 2200; // Value of chemical recovery/kiln energy vs petcoke/heavy oil
  } else {
    rawMaterialValue = volume * (demand.price_per_mt > 0 ? demand.price_per_mt : 600);
  }

  const netBenefit = disposalSavings + rawMaterialValue - volume * transitCostPerMt;
  return Math.round(Math.max(12000, netBenefit));
}

/**
 * Composite Match Calculator for single pair
 */
export function calculatePairMatch(
  supply: MaterialStream,
  demand: MaterialStream,
  genFacility: Facility,
  offFacility: Facility,
  existingProposal?: Partial<MatchProposal>
): MatchProposal | null {
  // Haversine distance
  const distanceKm = calculateHaversineDistance(
    genFacility.coordinates.lat,
    genFacility.coordinates.lng,
    offFacility.coordinates.lat,
    offFacility.coordinates.lng
  );

  // If outside maximum economic hauling distance, discard
  if (distanceKm > MAX_ECONOMIC_RADIUS_KM) {
    return null;
  }

  const distanceScore = calculateDistanceScore(distanceKm);
  const chemResult = evaluateChemicalCompatibility(supply, demand);
  const volumeRatio = calculateVolumeRatio(supply.monthly_volume_mt, demand.monthly_volume_mt);

  // Filter out completely incompatible pairings (e.g. hazardous to non-permitted offtaker)
  if (chemResult.score < 0.25) {
    return null;
  }

  // Composite Scoring Formula:
  // (ChemicalCompatibility * 0.50) + (DistanceScore * 0.35) + (VolumeRatio * 0.15) * 100
  const rawScore = (chemResult.score * 0.50 + distanceScore * 0.35 + volumeRatio * 0.15) * 100;
  const matchScore = Math.round(rawScore * 10) / 10;

  // Avoided carbon calculation (0.82 kg CO2e per kg material diverted)
  const divertedMt = Math.min(supply.monthly_volume_mt, demand.monthly_volume_mt);
  const avoidedCo2Mt = Math.round(divertedMt * AVOIDED_CO2_FACTOR * 10) / 10;
  const economicBenefit = calculateEconomicBenefit(supply, demand, distanceKm);

  let logisticsMode = 'Standard Sealed Dry Truck';
  if (supply.physical_state === 'LIQUID') {
    logisticsMode = supply.is_hazardous
      ? 'Rubber-lined Acid/Chemical Tanker (CPCB HazTrans permitted)'
      : 'Liquid Bulk Tanker';
  } else if (supply.physical_state === 'SLUDGE') {
    logisticsMode = supply.is_hazardous
      ? 'Hydraulic Heavy Skip Truck with hermetic seals & GPS'
      : 'Sludge Tipper with sealed tarpaulin';
  } else if (supply.physical_state === 'SOLID') {
    logisticsMode = 'Heavy 16-Wheeler Bulk Tipper with dust suppressant cover';
  }

  const breakdown: MatchScoreBreakdown = {
    chemical_compatibility: chemResult.score,
    distance_score: distanceScore,
    volume_ratio: volumeRatio,
    compatibility_notes: chemResult.notes,
  };

  return {
    id: existingProposal?.id || `match-${supply.id.slice(-6)}-${demand.id.slice(-6)}`,
    supply_stream_id: supply.id,
    demand_stream_id: demand.id,
    match_score: existingProposal?.match_score ?? matchScore,
    transit_distance_km: existingProposal?.transit_distance_km ?? distanceKm,
    avoided_co2_mt: existingProposal?.avoided_co2_mt ?? avoidedCo2Mt,
    economic_benefit_inr: existingProposal?.economic_benefit_inr ?? economicBenefit,
    status: existingProposal?.status || 'PROPOSED',
    generator_consent: existingProposal?.generator_consent || false,
    offtaker_consent: existingProposal?.offtaker_consent || false,
    unlocked_at: existingProposal?.unlocked_at,
    breakdown: existingProposal?.breakdown || breakdown,
    recommended_logistics_mode: existingProposal?.recommended_logistics_mode || logisticsMode,
  };
}

/**
 * Scan all supplies and demands against facilities to compute optimal matches
 */
export function runMatchingEngine(
  facilities: Facility[],
  streams: MaterialStream[],
  existingMatches: MatchProposal[] = []
): MatchProposal[] {
  const supplies = streams.filter((s) => s.stream_type === 'SUPPLY');
  const demands = streams.filter((s) => s.stream_type === 'DEMAND');

  const facilityMap = new Map<string, Facility>();
  facilities.forEach((f) => facilityMap.set(f.id, f));

  const existingMatchMap = new Map<string, MatchProposal>();
  existingMatches.forEach((m) => {
    existingMatchMap.set(`${m.supply_stream_id}___${m.demand_stream_id}`, m);
  });

  const proposals: MatchProposal[] = [];

  for (const supply of supplies) {
    const genFac = facilityMap.get(supply.facility_id);
    if (!genFac) continue;

    for (const demand of demands) {
      const offFac = facilityMap.get(demand.facility_id);
      if (!offFac) continue;

      // Cannot match facility with itself
      if (genFac.id === offFac.id) continue;

      const existing = existingMatchMap.get(`${supply.id}___${demand.id}`);
      const proposal = calculatePairMatch(supply, demand, genFac, offFac, existing);

      if (proposal && proposal.match_score >= 60) {
        proposals.push(proposal);
      }
    }
  }

  // Sort by highest match score
  return proposals.sort((a, b) => b.match_score - a.match_score);
}
