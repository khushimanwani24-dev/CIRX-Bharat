'use client';

import React, { useEffect } from 'react';
import {
  MatchProposal,
  Facility,
  MaterialStream,
  Form10Manifest,
} from '@/types';
import { UserRole } from './Header';
import { isConsentUnlocked, sanitizeFacility } from '@/lib/anonymizer';
import { calculateUnitEconomics } from '@/lib/unitEconomics';
import { formatINR, formatNumber } from '@/lib/utils';
import {
  X,
  Scale,
  Sparkles,
  MapPin,
  TrendingUp,
  Leaf,
  Shield,
  Lock,
  Unlock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Truck,
  Droplets,
  Flame,
  FileCheck2,
  Layers,
  ChevronRight,
  Info,
} from 'lucide-react';

interface MatchExplanationDrawerProps {
  match: MatchProposal | null;
  facilities: Facility[];
  streams: MaterialStream[];
  manifests: Form10Manifest[];
  activeRole: UserRole;
  onClose: () => void;
  onToggleConsent: (matchId: string, party: 'generator' | 'offtaker') => Promise<void>;
  onGenerateManifest: (matchId: string) => void;
  onViewManifest: (manifestId: string) => void;
  onLocateOnMap: (matchId: string) => void;
}

export const MatchExplanationDrawer: React.FC<MatchExplanationDrawerProps> = ({
  match,
  facilities,
  streams,
  manifests,
  activeRole,
  onClose,
  onToggleConsent,
  onGenerateManifest,
  onViewManifest,
  onLocateOnMap,
}) => {
  // Close drawer on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!match) return null;

  const facilityMap = new Map<string, Facility>();
  facilities.forEach((f) => facilityMap.set(f.id, f));

  const streamMap = new Map<string, MaterialStream>();
  streams.forEach((s) => streamMap.set(s.id, s));

  const supply = streamMap.get(match.supply_stream_id);
  const demand = streamMap.get(match.demand_stream_id);
  if (!supply || !demand) return null;

  const genFac = facilityMap.get(supply.facility_id);
  const offFac = facilityMap.get(demand.facility_id);
  if (!genFac || !offFac) return null;

  const isUnlocked = isConsentUnlocked(match, activeRole);
  const sanitizedGen = sanitizeFacility(genFac, isUnlocked, activeRole);
  const sanitizedOff = sanitizeFacility(offFac, isUnlocked, activeRole);

  const unitEconomics = calculateUnitEconomics(supply, demand, match);
  const existingManifest = manifests.find((m) => m.match_id === match.id);

  // Score breakdowns
  const chemScorePercent = Math.round(match.breakdown.chemical_compatibility * 100);
  const distScorePercent = Math.round(match.breakdown.distance_score * 100);
  const volScorePercent = Math.round(match.breakdown.volume_ratio * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Slide-out Sheet / Drawer */}
      <div className="relative w-full max-w-2xl bg-white border-l border-slate-200 shadow-2xl flex flex-col h-full z-10 animate-in slide-in-from-right duration-300 overflow-hidden text-slate-900">
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 font-sans tracking-tight">
                  Symbiosis Engineering Breakdown
                </h3>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {match.match_score}% Score
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Deterministic algorithmic matrix & chemical validation for Match #{match.id.toUpperCase()}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            title="Close Drawer (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Pair Topology Summary Card */}
          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 uppercase tracking-wider text-[10px] font-semibold">
                Corridor Topology Pair
              </span>
              {isUnlocked ? (
                <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-700">
                  <Unlock className="w-3.5 h-3.5" /> Shield Disengaged
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[11px] font-medium text-indigo-700">
                  <Lock className="w-3.5 h-3.5" /> Confidentiality Shield Active
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Generator Side */}
              <div className="p-3.5 rounded-lg bg-white border border-slate-200/80 shadow-2xs space-y-1">
                <span className="text-[10px] uppercase font-semibold text-amber-700 block">
                  Byproduct Generator
                </span>
                <div className="font-bold text-slate-900 truncate">{sanitizedGen.display_name}</div>
                <div className="text-[11px] text-slate-500">{sanitizedGen.cluster_zone}</div>
                <div className="mt-2 text-[11px] text-emerald-700 font-semibold">
                  {supply.material_name}
                </div>
                <div className="text-[10px] text-slate-500">
                  {supply.monthly_volume_mt} MT/mo • {supply.physical_state} • {supply.cpcb_waste_code}
                </div>
              </div>

              {/* Offtaker Side */}
              <div className="p-3.5 rounded-lg bg-white border border-slate-200/80 shadow-2xs space-y-1">
                <span className="text-[10px] uppercase font-semibold text-sky-700 block">
                  Consented Offtaker
                </span>
                <div className="font-bold text-slate-900 truncate">{sanitizedOff.display_name}</div>
                <div className="text-[11px] text-slate-500">{sanitizedOff.cluster_zone}</div>
                <div className="mt-2 text-[11px] text-sky-700 font-semibold">
                  {demand.material_name}
                </div>
                <div className="text-[10px] text-slate-500">
                  {demand.monthly_volume_mt} MT/mo • {demand.physical_state} • {demand.cpcb_waste_code}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 1: Chemical Compatibility Progress Meter */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                  <Droplets className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 uppercase">
                    1. Chemical Compatibility
                  </span>
                  <span className="text-[10px] text-slate-500 ml-2">(50% Weight)</span>
                </div>
              </div>
              <span className="text-sm font-bold text-emerald-700 font-sans">
                {chemScorePercent}%
              </span>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-200">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-500 shadow-xs"
                style={{ width: `${chemScorePercent}%` }}
              />
            </div>

            {/* Parameters Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                <span className="text-slate-500 block text-[10px]">Supply pH</span>
                <span className="text-slate-900 font-bold">{supply.ph_level ?? 'Neutral / N/A'}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                <span className="text-slate-500 block text-[10px]">Calorific Value</span>
                <span className="text-slate-900 font-bold">
                  {supply.calorific_value_kcal ? `${supply.calorific_value_kcal} kcal` : 'Non-thermal'}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                <span className="text-slate-500 block text-[10px]">Hazard Status</span>
                <span className={supply.is_hazardous ? 'text-rose-700 font-bold' : 'text-emerald-700 font-bold'}>
                  {supply.is_hazardous ? 'Hazardous' : 'Circular Byproduct'}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                <span className="text-slate-500 block text-[10px]">Phase State</span>
                <span className="text-slate-900 font-bold">{supply.physical_state}</span>
              </div>
            </div>

            {/* Chemical Rationale Text */}
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1.5">
              <span className="text-[10px] uppercase text-slate-500 font-semibold block">
                Chemical & Thermodynamic Rationale:
              </span>
              {match.breakdown.compatibility_notes.map((note, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>{note}</span>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 2: Haversine Distance Decay Progress Meter */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-sky-50 text-sky-600">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 uppercase">
                    2. Haversine Distance Decay
                  </span>
                  <span className="text-[10px] text-slate-500 ml-2">(35% Weight)</span>
                </div>
              </div>
              <span className="text-sm font-bold text-sky-700 font-sans">
                {distScorePercent}%
              </span>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-200">
              <div
                className="bg-sky-600 h-full rounded-full transition-all duration-500 shadow-xs"
                style={{ width: `${distScorePercent}%` }}
              />
            </div>

            {/* Route Haul Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                <span className="text-slate-500 block text-[10px]">Great-Circle Haul</span>
                <span className="text-slate-900 font-bold text-sm">{match.transit_distance_km} km</span>
                <span className="text-[10px] text-sky-700 block mt-0.5 font-medium">
                  {match.transit_distance_km <= 5
                    ? 'Tier 1: Hyper-Local (Zero Decay)'
                    : match.transit_distance_km <= 20
                    ? 'Tier 2: Adjacent MIDC Zone'
                    : 'Tier 3: Sub-regional Corridor'}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                <span className="text-slate-500 block text-[10px]">Max Economic Haul</span>
                <span className="text-slate-900 font-bold text-sm">150 km Radius</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  {((match.transit_distance_km / 150) * 100).toFixed(0)}% of Max Haul Limit
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                <span className="text-slate-500 block text-[10px]">Estimated Freight Cost</span>
                <span className="text-slate-900 font-bold text-sm">
                  {formatINR(match.transit_distance_km * 4.5)}/MT
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">At standard ₹4.5/MT-km</span>
              </div>
            </div>

            {/* Fleet & Containment Recommendation */}
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center gap-2.5 text-xs text-slate-700">
              <Truck className="w-4 h-4 text-sky-600 flex-shrink-0" />
              <div>
                <span className="font-bold text-slate-900">Recommended Logistics: </span>
                <span>{match.recommended_logistics_mode}</span>
              </div>
            </div>
          </div>

          {/* SECTION 3: Volume Fulfillment % Progress Meter */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 uppercase">
                    3. Volume Fulfillment Ratio
                  </span>
                  <span className="text-[10px] text-slate-500 ml-2">(15% Weight)</span>
                </div>
              </div>
              <span className="text-sm font-bold text-amber-700 font-sans">
                {volScorePercent}%
              </span>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-200">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-500 shadow-xs"
                style={{ width: `${volScorePercent}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                <span className="text-slate-500 block text-[10px]">Supply Generation</span>
                <span className="text-slate-900 font-bold">{supply.monthly_volume_mt} MT / month</span>
                <span className="text-[10px] text-amber-700 block mt-0.5 font-medium">Continuous Production</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                <span className="text-slate-500 block text-[10px]">Offtaker Intake Capacity</span>
                <span className="text-slate-900 font-bold">{demand.monthly_volume_mt} MT / month</span>
                <span className="text-[10px] text-emerald-700 block mt-0.5 font-medium">Permitted Batch Volume</span>
              </div>
            </div>
          </div>

          {/* SECTION 4: Estimated Unit Economics Comparison Badge */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50/40 via-white to-slate-50 border border-emerald-200 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Virgin Raw Material Cost vs Secondary Recovered Stream Cost
                </span>
              </div>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                Save {unitEconomics.savingsPercentage}% vs Virgin
              </span>
            </div>

            {/* Side-by-Side Cost Comparison Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Virgin Raw Material Cost */}
              <div className="p-3.5 rounded-xl bg-white border border-rose-200 shadow-2xs space-y-1.5">
                <div className="text-[10px] text-rose-700 uppercase font-semibold">
                  Virgin Equivalent Raw Material
                </div>
                <div className="text-xs text-slate-700 font-medium truncate">
                  {unitEconomics.virginMaterialName}
                </div>
                <div className="text-lg font-bold font-sans text-rose-700">
                  {formatINR(unitEconomics.virginMarketCostPerMt)} <span className="text-xs font-normal text-slate-500">/ MT</span>
                </div>
                <p className="text-[10px] text-slate-500">
                  Market cost of virgin mined minerals, imported petcoke, or virgin chemicals.
                </p>
              </div>

              {/* Secondary Recovered Cost */}
              <div className="p-3.5 rounded-xl bg-white border border-emerald-200 shadow-2xs space-y-1.5">
                <div className="text-[10px] text-emerald-700 uppercase font-semibold">
                  Secondary Recovered Stream
                </div>
                <div className="text-xs text-slate-700 font-medium truncate">
                  CIRX Bharat Circular Feedstock (Ahmedabad Hub)
                </div>
                <div className="text-lg font-bold font-sans text-emerald-700">
                  {formatINR(unitEconomics.secondaryRecoveredCostPerMt)} <span className="text-xs font-normal text-slate-500">/ MT</span>
                </div>
                <p className="text-[10px] text-slate-500">
                  Net cost including freight transit + skip handling + secondary transfer price.
                </p>
              </div>
            </div>

            {/* ROI / Arbitrage Value Badges */}
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-300">
                Savings vs. NEPL/TSDF Landfill Fees (₹1,500/MT saved)
              </span>
              <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-lg bg-sky-50 text-sky-800 border border-sky-300">
                Savings vs. Virgin Mineral Gypsum (₹1,050/MT saved)
              </span>
            </div>

            {/* Net Arbitrage Metrics */}
            <div className="p-3 rounded-lg bg-white border border-emerald-200/80 shadow-2xs grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px]">Net Delta Savings</span>
                <span className="text-emerald-700 font-bold text-sm">
                  {formatINR(unitEconomics.costDeltaPerMt)} / MT
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Avoided TSDF Fee</span>
                <span className="text-sky-700 font-bold text-sm">
                  {formatINR(unitEconomics.savedTippingFeePerMt)} / MT
                </span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-slate-500 block text-[10px]">Monthly Net Value</span>
                <span className="text-emerald-800 font-bold text-sm">
                  {formatINR(unitEconomics.monthlyCorridorSavingsInr)} / mo
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-600 leading-relaxed italic bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
              💡 {unitEconomics.economicRationale}
            </p>
          </div>

          {/* SECTION 5: Avoided Carbon Footprint */}
          <div className="p-3.5 rounded-xl bg-teal-50/80 border border-teal-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <Leaf className="w-5 h-5 text-teal-600 flex-shrink-0" />
              <div>
                <div className="font-bold text-slate-900">Avoided Greenhouse Gas Emissions</div>
                <div className="text-[11px] text-slate-500">
                  Standardized CPCB diversion factor: 0.82 kg CO₂e / kg secondary material
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-base font-bold text-teal-700 font-sans">
                {match.avoided_co2_mt} MT CO₂e
              </div>
              <div className="text-[10px] text-slate-500">Per month</div>
            </div>
          </div>
        </div>

        {/* Drawer Sticky Footer with Quick Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => {
              onClose();
              onLocateOnMap(match.id);
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 shadow-2xs transition"
          >
            <MapPin className="w-3.5 h-3.5 text-sky-600" />
            <span>Locate on GIS Map</span>
          </button>

          <div className="flex items-center gap-2">
            {/* Generator Consent */}
            <button
              onClick={() => onToggleConsent(match.id, 'generator')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                match.generator_consent
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-2xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>{match.generator_consent ? '✓' : '○'} Generator</span>
            </button>

            {/* Offtaker Consent */}
            <button
              onClick={() => onToggleConsent(match.id, 'offtaker')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                match.offtaker_consent
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-2xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>{match.offtaker_consent ? '✓' : '○'} Offtaker</span>
            </button>

            {/* Manifest Trigger */}
            {existingManifest ? (
              <button
                onClick={() => {
                  onClose();
                  onViewManifest(existingManifest.id);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition"
              >
                <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
                View Manifest
              </button>
            ) : isUnlocked ? (
              <button
                onClick={() => {
                  onClose();
                  onGenerateManifest(match.id);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm"
              >
                <FileCheck2 className="w-3.5 h-3.5" />
                Generate Form 10
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
