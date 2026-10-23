import { MaterialStream, MatchProposal } from '@/types';

export interface UnitEconomics {
  virginMaterialName: string;
  virginMarketCostPerMt: number;
  secondaryRecoveredCostPerMt: number;
  savedTippingFeePerMt: number;
  costDeltaPerMt: number;
  savingsPercentage: number;
  monthlyCorridorSavingsInr: number;
  economicRationale: string;
}

/**
 * Calculates Unit Economics: Virgin Raw Material Cost vs Secondary Recovered Stream Cost
 */
export function calculateUnitEconomics(
  supply: MaterialStream,
  demand: MaterialStream,
  match: MatchProposal
): UnitEconomics {
  const volume = Math.min(supply.monthly_volume_mt, demand.monthly_volume_mt);
  const transitCostPerMt = Math.round(match.transit_distance_km * 4.5); // ₹4.5 per MT-km

  const sCode = (supply.cpcb_waste_code || '').toLowerCase();
  const matName = supply.material_name.toLowerCase();

  // Case 1: Hexavalent Chromium / Heavy Metal Effluent (Cat 35.3)
  if (sCode.includes('35.3') || matName.includes('chromium') || matName.includes('acidic')) {
    const virginMarketCostPerMt = 18500; // Virgin chromic acid / sodium dichromate equivalent
    const savedTippingFeePerMt = Math.abs(supply.price_per_mt < 0 ? supply.price_per_mt : -3800);
    const secondaryRecoveredCostPerMt = transitCostPerMt + 400; // freight + neutralization reagent
    const costDeltaPerMt = virginMarketCostPerMt - secondaryRecoveredCostPerMt;
    const savingsPercentage = Math.round((costDeltaPerMt / virginMarketCostPerMt) * 100);

    return {
      virginMaterialName: 'Virgin Chromic Acid & Sodium Dichromate Feedstock',
      virginMarketCostPerMt,
      secondaryRecoveredCostPerMt,
      savedTippingFeePerMt,
      costDeltaPerMt,
      savingsPercentage,
      monthlyCorridorSavingsInr: match.economic_benefit_inr,
      economicRationale:
        'Offtaker replaces imported chemical-grade chromium salts with hydrometallurgical acidic effluent. Generator eliminates ₹3,800/MT TSDF disposal fee.',
    };
  }

  // Case 2: Automotive Paint Sludge (Cat 21.1) to Cement Kiln AFR
  if (sCode.includes('21.1') || matName.includes('paint') || matName.includes('sludge')) {
    const virginMarketCostPerMt = 14200; // Virgin imported fossil petcoke / heavy furnace oil equivalent
    const savedTippingFeePerMt = Math.abs(supply.price_per_mt < 0 ? supply.price_per_mt : -3200);
    const secondaryRecoveredCostPerMt = transitCostPerMt + 650; // freight + skip handling
    const costDeltaPerMt = virginMarketCostPerMt - secondaryRecoveredCostPerMt;
    const savingsPercentage = Math.round((costDeltaPerMt / virginMarketCostPerMt) * 100);

    return {
      virginMaterialName: 'Virgin Fossil Petcoke & Heavy Fuel Oil (Kiln Fuel)',
      virginMarketCostPerMt,
      secondaryRecoveredCostPerMt,
      savedTippingFeePerMt,
      costDeltaPerMt,
      savingsPercentage,
      monthlyCorridorSavingsInr: match.economic_benefit_inr,
      economicRationale:
        'Cement kiln achieves high-temperature thermal substitution without petcoke imports. Auto stamping plant avoids hazardous incineration tipping fee.',
    };
  }

  // Case 3: Granulated Blast Furnace Slag (Schedule II-B) to Paver / Concrete
  if (sCode.includes('ii-b') || matName.includes('slag')) {
    const virginMarketCostPerMt = 1850; // Mined virgin river sand / quarry fine aggregate
    const savedTippingFeePerMt = 450; // Avoided storage and dumping yard handling
    const secondaryRecoveredCostPerMt = (demand.price_per_mt > 0 ? demand.price_per_mt : 600) + transitCostPerMt;
    const costDeltaPerMt = virginMarketCostPerMt - secondaryRecoveredCostPerMt;
    const savingsPercentage = Math.round((costDeltaPerMt / virginMarketCostPerMt) * 100);

    return {
      virginMaterialName: 'Virgin Mined River Sand & Crushed Basalt Aggregate',
      virginMarketCostPerMt,
      secondaryRecoveredCostPerMt,
      savedTippingFeePerMt,
      costDeltaPerMt,
      savingsPercentage,
      monthlyCorridorSavingsInr: match.economic_benefit_inr,
      economicRationale:
        'Paver manufacturer secures pozzolanic secondary aggregate at 59% discount. Foundry monetizes 120 MT/month slag discard as circular revenue.',
    };
  }

  // Case 4: Organic Pomace / Citrus Agro-waste to Compressed Bio-Gas (CBG)
  if (sCode.includes('agro') || matName.includes('organic') || matName.includes('pomace')) {
    const virginMarketCostPerMt = 5800; // Commercial LPG / diesel energy equivalent
    const savedTippingFeePerMt = 600; // Municipal organic landfill tipping surcharge
    const secondaryRecoveredCostPerMt = (demand.price_per_mt > 0 ? demand.price_per_mt : 200) + transitCostPerMt;
    const costDeltaPerMt = virginMarketCostPerMt - secondaryRecoveredCostPerMt;
    const savingsPercentage = Math.round((costDeltaPerMt / virginMarketCostPerMt) * 100);

    return {
      virginMaterialName: 'Commercial LPG / Industrial Heavy Diesel Equivalent',
      virginMarketCostPerMt,
      secondaryRecoveredCostPerMt,
      savedTippingFeePerMt,
      costDeltaPerMt,
      savingsPercentage,
      monthlyCorridorSavingsInr: match.economic_benefit_inr,
      economicRationale:
        'Anaerobic biogas digester gains high-COD slurry feed at fraction of biomass pellet cost. Food processor avoids perishable spoil accumulating on-site.',
    };
  }

  // Generic Fallback
  const virginMarketCostPerMt = 4500;
  const secondaryRecoveredCostPerMt = Math.max(250, (demand.price_per_mt || 500) + transitCostPerMt);
  const savedTippingFeePerMt = Math.abs(supply.price_per_mt < 0 ? supply.price_per_mt : 0);
  const costDeltaPerMt = Math.max(500, virginMarketCostPerMt - secondaryRecoveredCostPerMt);
  const savingsPercentage = Math.round((costDeltaPerMt / virginMarketCostPerMt) * 100);

  return {
    virginMaterialName: 'Virgin Commercial Chemical / Mineral Grade Raw Material',
    virginMarketCostPerMt,
    secondaryRecoveredCostPerMt,
    savedTippingFeePerMt,
    costDeltaPerMt,
    savingsPercentage,
    monthlyCorridorSavingsInr: match.economic_benefit_inr,
    economicRationale:
      'Direct industrial symbiosis substitution displaces primary virgin raw materials and eliminates disposal hauling costs.',
  };
}
