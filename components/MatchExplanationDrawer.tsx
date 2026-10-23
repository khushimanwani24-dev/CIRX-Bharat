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
      {/* Dark Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Slide-out Sheet / Drawer */}
      <div className="relative w-full max-w-2xl bg-slate-950 border-l border-slate-800 shadow-2xl flex flex-col h-full z-10 animate-in slide-in-from-right duration-300 overflow-hidden">
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-mono tracking-tight">
                  Symbiosis Engineering Breakdown
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                  {match.match_score}% Score
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Deterministic algorithmic matrix & chemical validation for Match #{match.id.toUpperCase()}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title="Close Drawer (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Pair Topology Summary Card */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-slate-400 uppercase tracking-wider text-[10px]">
                Corridor Topology Pair
              </span>
              {isUnlocked ? (
                <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                  <Unlock className="w-3 h-3" /> Shield Disengaged
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[11px] font-mono text-amber-400">
                  <Lock className="w-3 h-3" /> Confidentiality Shield Active
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Generator Side */}
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80">
                <span className="text-[10px] uppercase font-mono text-amber-400 block mb-1">
                  Byproduct Generator
                </span>
                <div className="font-bold text-white truncate">{sanitizedGen.display_name}</div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">{sanitizedGen.cluster_zone}</div>
                <div className="mt-2 text-[11px] text-emerald-300 font-medium">
                  {supply.material_name}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  {supply.monthly_volume_mt} MT/mo • {supply.physical_state} • {supply.cpcb_waste_code}
                </div>
              </div>

              {/* Offtaker Side */}
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80">
                <span className="text-[10px] uppercase font-mono text-cyan-400 block mb-1">
                  Consented Offtaker
                </span>
                <div className="font-bold text-white truncate">{sanitizedOff.display_name}</div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">{sanitizedOff.cluster_zone}</div>
                <div className="mt-2 text-[11px] text-cyan-300 font-medium">
                  {demand.material_name}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  {demand.monthly_volume_mt} MT/mo • {demand.physical_state} • {demand.cpcb_waste_code}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 1: Chemical Compatibility Progress Meter */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Droplets className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white uppercase font-mono">
                    1. Chemical Compatibility
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono ml-2">(50% Weight)</span>
                </div>
              </div>
              <span className="text-sm font-bold font-mono text-emerald-400">
                {chemScorePercent}%
              </span>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <div
                className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full rounded-full transition-all duration-500 shadow-sm shadow-emerald-500/50"
                style={{ width: `${chemScorePercent}%` }}
              />
            </div>

            {/* Parameters Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Supply pH</span>
                <span className="text-white font-bold">{supply.ph_level ?? 'Neutral / N/A'}</span>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Calorific Value</span>
                <span className="text-white font-bold">
                  {supply.calorific_value_kcal ? `${supply.calorific_value_kcal} kcal/kg` : 'Non-thermal'}
                </span>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Hazard Status</span>
                <span className={supply.is_hazardous ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                  {supply.is_hazardous ? 'Hazardous' : 'Circular Byproduct'}
                </span>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Phase State</span>
                <span className="text-white font-bold">{supply.physical_state}</span>
              </div>
            </div>

            {/* Chemical Rationale Text */}
            <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1.5">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold block">
                Chemical & Thermodynamic Rationale:
              </span>
              {match.breakdown.compatibility_notes.map((note, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>{note}</span>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 2: Haversine Distance Decay Progress Meter */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white uppercase font-mono">
                    2. Haversine Distance Decay
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono ml-2">(35% Weight)</span>
                </div>
              </div>
              <span className="text-sm font-bold font-mono text-cyan-400">
                {distScorePercent}%
              </span>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <div
                className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full transition-all duration-500 shadow-sm shadow-cyan-500/50"
                style={{ width: `${distScorePercent}%` }}
              />
            </div>

            {/* Route Haul Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Great-Circle Haul</span>
                <span className="text-white font-bold text-sm">{match.transit_distance_km} km</span>
                <span className="text-[10px] text-cyan-400 block mt-0.5">
                  {match.transit_distance_km <= 5
                    ? 'Tier 1: Hyper-Local (Zero Decay)'
                    : match.transit_distance_km <= 20
                    ? 'Tier 2: Adjacent MIDC Zone'
                    : 'Tier 3: Sub-regional Corridor'}
                </span>
              </div>

              <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Max Economic Haul</span>
                <span className="text-white font-bold text-sm">150 km Radius</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  {((match.transit_distance_km / 150) * 100).toFixed(0)}% of Max Haul Limit
                </span>
              </div>

              <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Estimated Freight Cost</span>
                <span className="text-white font-bold text-sm">
                  {formatINR(match.transit_distance_km * 4.5)}/MT
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">At standard ₹4.5/MT-km</span>
              </div>
            </div>

            {/* Fleet & Containment Recommendation */}
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-2.5 text-xs text-slate-300">
              <Truck className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <div>
                <span className="font-bold text-white font-mono text-[11px]">Recommended Logistics: </span>
                <span>{match.recommended_logistics_mode}</span>
              </div>
            </div>
          </div>

          {/* SECTION 3: Volume Fulfillment % Progress Meter */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white uppercase font-mono">
                    3. Volume Fulfillment Ratio
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono ml-2">(15% Weight)</span>
                </div>
              </div>
              <span className="text-sm font-bold font-mono text-amber-400">
                {volScorePercent}%
              </span>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <div
                className="bg-gradient-to-r from-orange-500 to-amber-400 h-full rounded-full transition-all duration-500 shadow-sm shadow-amber-500/50"
                style={{ width: `${volScorePercent}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Supply Generation</span>
                <span className="text-white font-bold">{supply.monthly_volume_mt} MT / month</span>
                <span className="text-[10px] text-amber-400 block mt-0.5">Continuous Production</span>
              </div>
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Offtaker Intake Capacity</span>
                <span className="text-white font-bold">{demand.monthly_volume_mt} MT / month</span>
                <span className="text-[10px] text-emerald-400 block mt-0.5">Permitted Batch Volume</span>
              </div>
            </div>
          </div>

          {/* SECTION 4: Estimated Unit Economics Comparison Badge */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950/40 border border-emerald-500/40 space-y-4 shadow-lg">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white font-mono uppercase tracking-wide">
                  Virgin Raw Material Cost vs Secondary Recovered Stream Cost
                </span>
              </div>
              <span className="text-xs font-bold font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                Save {unitEconomics.savingsPercentage}% vs Virgin
              </span>
            </div>

            {/* Side-by-Side Cost Comparison Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Virgin Raw Material Cost */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-rose-500/30 space-y-1.5">
                <div className="text-[10px] font-mono text-rose-400 uppercase font-semibold">
                  Virgin Equivalent Raw Material
                </div>
                <div className="text-xs text-slate-300 font-medium truncate">
                  {unitEconomics.virginMaterialName}
                </div>
                <div className="text-lg font-black font-mono text-rose-300">
                  {formatINR(unitEconomics.virginMarketCostPerMt)} <span className="text-xs font-normal text-slate-400">/ MT</span>
                </div>
                <p className="text-[10px] text-slate-500">
                  Market cost of virgin mined minerals, imported petcoke, or virgin chemicals.
                </p>
              </div>

              {/* Secondary Recovered Cost */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-1.5">
                <div className="text-[10px] font-mono text-emerald-400 uppercase font-semibold">
                  Secondary Recovered Stream
                </div>
                <div className="text-xs text-slate-300 font-medium truncate">
                  ReBharat Circular Feedstock (Nashik Hub)
                </div>
                <div className="text-lg font-black font-mono text-emerald-300">
                  {formatINR(unitEconomics.secondaryRecoveredCostPerMt)} <span className="text-xs font-normal text-slate-400">/ MT</span>
                </div>
                <p className="text-[10px] text-slate-500">
                  Net cost including freight transit + skip handling + secondary transfer price.
                </p>
              </div>
            </div>

            {/* Net Arbitrage Metrics */}
            <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/30 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
              <div>
                <span className="text-slate-400 block text-[10px]">Net Delta Savings</span>
                <span className="text-emerald-400 font-bold">
                  {formatINR(unitEconomics.costDeltaPerMt)} / MT
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Avoided TSDF Fee</span>
                <span className="text-cyan-400 font-bold">
                  {formatINR(unitEconomics.savedTippingFeePerMt)} / MT
                </span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-slate-400 block text-[10px]">Monthly Net Value</span>
                <span className="text-amber-300 font-bold text-sm">
                  {formatINR(unitEconomics.monthlyCorridorSavingsInr)} / mo
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed italic bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
              💡 {unitEconomics.economicRationale}
            </p>
          </div>

          {/* SECTION 5: Avoided Carbon Footprint */}
          <div className="p-3.5 rounded-xl bg-teal-950/30 border border-teal-500/30 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2.5">
              <Leaf className="w-5 h-5 text-teal-400 flex-shrink-0" />
              <div>
                <div className="font-bold text-white">Avoided Greenhouse Gas Emissions</div>
                <div className="text-[11px] text-slate-400">
                  Standardized CPCB diversion factor: 0.82 kg CO₂e / kg secondary material
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-base font-bold text-teal-300 font-mono">
                {match.avoided_co2_mt} MT CO₂e
              </div>
              <div className="text-[10px] text-slate-400 font-mono">Per month</div>
            </div>
          </div>
        </div>

        {/* Drawer Sticky Footer with Quick Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => {
              onClose();
              onLocateOnMap(match.id);
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium border border-slate-800 transition"
          >
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span>Locate on GIS Map</span>
          </button>

          <div className="flex items-center gap-2">
            {/* Generator Consent */}
            <button
              onClick={() => onToggleConsent(match.id, 'generator')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono border transition ${
                match.generator_consent
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
                  : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
            >
              <span>{match.generator_consent ? '✓' : '○'} Generator</span>
            </button>

            {/* Offtaker Consent */}
            <button
              onClick={() => onToggleConsent(match.id, 'offtaker')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono border transition ${
                match.offtaker_consent
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
                  : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-slate-200'
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
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition"
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
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-lg shadow-emerald-950/50"
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
