'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  MatchProposal,
  Facility,
  MaterialStream,
  Form10Manifest,
} from '@/types';
import { UserRole } from './Header';
import {
  isConsentUnlocked,
  sanitizeFacility,
} from '@/lib/anonymizer';
import { formatINR, formatNumber } from '@/lib/utils';
import {
  RotateCw,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Lock,
  Unlock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Leaf,
  FileCheck2,
  Truck,
  Sparkles,
  ChevronDown,
  ChevronUp,
  MapPin,
  Flame,
  Droplets,
  Layers,
  Scale,
} from 'lucide-react';
import { MatchExplanationDrawer } from './MatchExplanationDrawer';

interface BilateralExchangeCenterProps {
  matches: MatchProposal[];
  facilities: Facility[];
  streams: MaterialStream[];
  activeRole: UserRole;
  onToggleConsent: (matchId: string, party: 'generator' | 'offtaker') => Promise<void>;
  onGenerateManifest: (matchId: string) => void;
  onViewManifest: (manifestId: string) => void;
  manifests: Form10Manifest[];
  selectedMatchId: string | null;
  onSelectMatch: (matchId: string) => void;
}

export const BilateralExchangeCenter: React.FC<BilateralExchangeCenterProps> = ({
  matches,
  facilities,
  streams,
  activeRole,
  onToggleConsent,
  onGenerateManifest,
  onViewManifest,
  manifests,
  selectedMatchId,
  onSelectMatch,
}) => {
  const [filterTier, setFilterTier] = useState<'ALL' | 'HAZARDOUS' | 'NON_HAZARDOUS'>('ALL');
  const [filterConsent, setFilterConsent] = useState<'ALL' | 'UNLOCKED' | 'PENDING'>('ALL');
  const [expandedBreakdown, setExpandedBreakdown] = useState<Record<string, boolean>>({});
  const [drawerMatchId, setDrawerMatchId] = useState<string | null>(null);

  const facilityMap = new Map<string, Facility>();
  facilities.forEach((f) => facilityMap.set(f.id, f));

  const streamMap = new Map<string, MaterialStream>();
  streams.forEach((s) => streamMap.set(s.id, s));

  const toggleExpand = (matchId: string) => {
    setExpandedBreakdown((prev) => ({
      ...prev,
      [matchId]: !prev[matchId],
    }));
  };

  const handleConsentClick = async (match: MatchProposal, party: 'generator' | 'offtaker') => {
    // If this click completes the mutual consent, trigger confetti!
    const willBeUnlocked =
      (party === 'generator' && match.offtaker_consent) ||
      (party === 'offtaker' && match.generator_consent);

    if (willBeUnlocked) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#06b6d4', '#f59e0b'],
        });
      } catch (e) {
        // canvas-confetti fallback
      }
    }

    await onToggleConsent(match.id, party);
  };

  // Filter matches
  const filteredMatches = matches.filter((match) => {
    const supply = streamMap.get(match.supply_stream_id);
    if (!supply) return false;

    if (filterTier === 'HAZARDOUS' && !supply.is_hazardous) return false;
    if (filterTier === 'NON_HAZARDOUS' && supply.is_hazardous) return false;

    const isUnlocked = isConsentUnlocked(match, activeRole);
    if (filterConsent === 'UNLOCKED' && !isUnlocked) return false;
    if (filterConsent === 'PENDING' && isUnlocked) return false;

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 space-y-6">
      {/* Exchange Banner & Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white font-mono flex items-center gap-2">
              <RotateCw className="w-5 h-5 text-emerald-400" />
              Bilateral Symbiosis Exchange Center
            </h2>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Zero-Leakage Privacy Engine
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Deterministic matching matrix pairing generator secondary streams with consented offtakers across the Nashik manufacturing corridor.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Hazard Tier Filter */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setFilterTier('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                filterTier === 'ALL'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Matches ({matches.length})
            </button>
            <button
              onClick={() => setFilterTier('HAZARDOUS')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                filterTier === 'HAZARDOUS'
                  ? 'bg-rose-950/80 text-rose-300 border border-rose-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Hazardous (Cat 35.3 / 21.1)
            </button>
            <button
              onClick={() => setFilterTier('NON_HAZARDOUS')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                filterTier === 'NON_HAZARDOUS'
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Circular Non-Haz
            </button>
          </div>

          {/* Privacy Consent Filter */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setFilterConsent('ALL')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                filterConsent === 'ALL' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All States
            </button>
            <button
              onClick={() => setFilterConsent('UNLOCKED')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1 ${
                filterConsent === 'UNLOCKED'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Unlock className="w-3 h-3 text-emerald-400" />
              Mutual Consent
            </button>
            <button
              onClick={() => setFilterConsent('PENDING')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1 ${
                filterConsent === 'PENDING'
                  ? 'bg-slate-800 text-slate-200 border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Lock className="w-3 h-3 text-slate-400" />
              Shielded
            </button>
          </div>
        </div>
      </div>

      {/* Match Cards List */}
      <div className="space-y-5">
        {filteredMatches.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800">
            <p className="text-slate-400 text-sm">No matches found for the selected filter criteria.</p>
          </div>
        ) : (
          filteredMatches.map((match) => {
            const supply = streamMap.get(match.supply_stream_id);
            const demand = streamMap.get(match.demand_stream_id);
            if (!supply || !demand) return null;

            const genFac = facilityMap.get(supply.facility_id);
            const offFac = facilityMap.get(demand.facility_id);
            if (!genFac || !offFac) return null;

            const isUnlocked = isConsentUnlocked(match, activeRole);
            const sanitizedGen = sanitizeFacility(genFac, isUnlocked, activeRole);
            const sanitizedOff = sanitizeFacility(offFac, isUnlocked, activeRole);

            // Existing manifest for this match if any
            const existingManifest = manifests.find((m) => m.match_id === match.id);
            const isExpanded = Boolean(expandedBreakdown[match.id]);
            const isSelected = selectedMatchId === match.id;

            return (
              <div
                key={match.id}
                className={`relative rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isSelected
                    ? 'border-emerald-500 shadow-xl shadow-emerald-950/40 bg-slate-900/90'
                    : 'border-slate-800 bg-slate-900/70 hover:border-slate-700'
                }`}
              >
                {/* Match Top Bar: Score Badge + Haul Distance + Carbon + Privacy Shield Status */}
                <div className="px-5 py-3.5 bg-slate-950/80 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {/* Score Badge */}
                    <button
                      onClick={() => setDrawerMatchId(match.id)}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-emerald-950 to-slate-900 border border-emerald-500/50 shadow-sm hover:border-emerald-400 transition cursor-pointer text-left"
                      title="Click to open Symbiosis Engineering Breakdown Drawer"
                    >
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <span className="text-sm font-black font-mono text-emerald-300">
                        {match.match_score}%
                      </span>
                      <span className="text-[10px] uppercase font-mono text-emerald-500 font-bold">
                        Optimal Symbiosis ↗
                      </span>
                    </button>

                    {/* Haul Distance */}
                    <div className="flex items-center gap-1.5 text-xs font-mono text-slate-300 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{match.transit_distance_km} km Haul</span>
                    </div>

                    {/* Avoided Carbon */}
                    <div className="flex items-center gap-1.5 text-xs font-mono text-teal-300 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                      <Leaf className="w-3.5 h-3.5 text-teal-400" />
                      <span>{match.avoided_co2_mt} MT CO₂e Avoided</span>
                    </div>

                    {/* Economic Benefit */}
                    <div className="flex items-center gap-1.5 text-xs font-mono text-amber-300 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                      <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                      <span>{formatINR(match.economic_benefit_inr)} / mo Net Value</span>
                    </div>
                  </div>

                  {/* Shield Status Indicator */}
                  <div className="flex items-center gap-2">
                    {isUnlocked ? (
                      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-medium">
                        <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                        Confidentiality Shield Disengaged
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950 text-slate-400 border border-slate-700 text-xs font-mono font-medium">
                        <Lock className="w-3.5 h-3.5 text-amber-400" />
                        Shield Active (Identities Masked)
                      </span>
                    )}

                    <button
                      onClick={() => onSelectMatch(match.id)}
                      className={`text-xs px-2.5 py-1 rounded-lg font-medium transition ${
                        isSelected
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {isSelected ? 'Focused' : 'Locate on GIS'}
                    </button>
                  </div>
                </div>

                {/* Main Content: Side-by-Side Generator vs Offtaker Feedstock */}
                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                  {/* Central Flow Arrow on Desktop */}
                  <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-slate-950 border border-slate-700 items-center justify-center text-emerald-400 shadow-md">
                    <ArrowRight className="w-4 h-4" />
                  </div>

                  {/* Left Column: Generator Secondary Feedstock */}
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/90 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                        Generator Secondary Stream
                      </span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                        supply.is_hazardous
                          ? 'bg-rose-950/60 text-rose-300 border-rose-500/40'
                          : 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                      }`}>
                        {supply.is_hazardous ? 'Hazardous (Rule 19)' : 'Non-Hazardous Byproduct'}
                      </span>
                    </div>

                    <div>
                      <div className="text-base font-bold text-white flex items-center gap-2">
                        {sanitizedGen.display_name}
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5 font-mono">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        {sanitizedGen.cluster_zone}
                      </div>
                    </div>

                    {/* Masked vs Unmasked Identity Data */}
                    <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs font-mono space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Legal Entity:</span>
                        <span className={isUnlocked ? 'text-slate-200 font-bold' : 'text-slate-400'}>
                          {sanitizedGen.legal_name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">GSTIN:</span>
                        <span className={isUnlocked ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                          {sanitizedGen.gstin}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">SPCB Consent:</span>
                        <span className={isUnlocked ? 'text-cyan-400 font-bold' : 'text-slate-500'}>
                          {sanitizedGen.spcb_consent_id}
                        </span>
                      </div>
                      {isUnlocked && sanitizedGen.contact_person && (
                        <div className="flex justify-between pt-1 border-t border-slate-800 text-[11px]">
                          <span className="text-slate-500">Contact:</span>
                          <span className="text-slate-300">{sanitizedGen.contact_person}</span>
                        </div>
                      )}
                    </div>

                    {/* Stream Parameters */}
                    <div className="space-y-1.5 text-xs">
                      <div className="font-semibold text-slate-200">
                        {supply.material_name}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-300">
                        <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                          Volume: <span className="font-bold text-white">{supply.monthly_volume_mt} MT/mo</span>
                        </div>
                        <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                          State: <span className="font-bold text-white">{supply.physical_state}</span>
                        </div>
                        <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                          pH: <span className="font-bold text-white">{supply.ph_level ?? 'N/A'}</span>
                        </div>
                        <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                          Calorific: <span className="font-bold text-white">{supply.calorific_value_kcal || 0} kcal</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Offtaker Feedstock Requirement */}
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/90 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                        Consented Offtaker Feedstock
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {demand.cpcb_waste_code}
                      </span>
                    </div>

                    <div>
                      <div className="text-base font-bold text-white flex items-center gap-2">
                        {sanitizedOff.display_name}
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5 font-mono">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        {sanitizedOff.cluster_zone}
                      </div>
                    </div>

                    {/* Masked vs Unmasked Identity Data */}
                    <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs font-mono space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Legal Entity:</span>
                        <span className={isUnlocked ? 'text-slate-200 font-bold' : 'text-slate-400'}>
                          {sanitizedOff.legal_name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">GSTIN:</span>
                        <span className={isUnlocked ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                          {sanitizedOff.gstin}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">SPCB Consent:</span>
                        <span className={isUnlocked ? 'text-cyan-400 font-bold' : 'text-slate-500'}>
                          {sanitizedOff.spcb_consent_id}
                        </span>
                      </div>
                      {isUnlocked && sanitizedOff.contact_person && (
                        <div className="flex justify-between pt-1 border-t border-slate-800 text-[11px]">
                          <span className="text-slate-500">Contact:</span>
                          <span className="text-slate-300">{sanitizedOff.contact_person}</span>
                        </div>
                      )}
                    </div>

                    {/* Demand Specifications */}
                    <div className="space-y-1.5 text-xs">
                      <div className="font-semibold text-slate-200">
                        {demand.material_name}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-300">
                        <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                          Capacity: <span className="font-bold text-white">{demand.monthly_volume_mt} MT/mo</span>
                        </div>
                        <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                          Target State: <span className="font-bold text-white">{demand.physical_state}</span>
                        </div>
                        <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                          Procure Price: <span className="font-bold text-white">₹{demand.price_per_mt}/MT</span>
                        </div>
                        <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                          Sector: <span className="font-bold text-white truncate">{sanitizedOff.facility_type}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bilateral Connect & Mutual Consent Trigger Area */}
                <div className="px-5 py-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  {/* Two-Sided Consent Checklist */}
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    {/* Generator Side Consent */}
                    <button
                      onClick={() => handleConsentClick(match, 'generator')}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition border ${
                        match.generator_consent
                          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50 shadow-sm'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                      }`}
                    >
                      <span className={`w-3 h-3 rounded-full flex items-center justify-center ${
                        match.generator_consent ? 'bg-emerald-500 text-black font-bold text-[9px]' : 'border border-slate-600'
                      }`}>
                        {match.generator_consent ? '✓' : ''}
                      </span>
                      <span>Generator Consent</span>
                    </button>

                    {/* Offtaker Side Consent */}
                    <button
                      onClick={() => handleConsentClick(match, 'offtaker')}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition border ${
                        match.offtaker_consent
                          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50 shadow-sm'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                      }`}
                    >
                      <span className={`w-3 h-3 rounded-full flex items-center justify-center ${
                        match.offtaker_consent ? 'bg-emerald-500 text-black font-bold text-[9px]' : 'border border-slate-600'
                      }`}>
                        {match.offtaker_consent ? '✓' : ''}
                      </span>
                      <span>Offtaker Consent</span>
                    </button>
                  </div>

                  {/* Manifest Generation & Action Buttons */}
                  <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    <button
                      onClick={() => setDrawerMatchId(match.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 font-mono text-xs font-bold border border-emerald-500/50 shadow-sm transition"
                      title="Open interactive Symbiosis Engineering Breakdown Drawer"
                    >
                      <Scale className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Symbiosis Breakdown</span>
                    </button>

                    <button
                      onClick={() => toggleExpand(match.id)}
                      className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 font-mono transition"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="w-3.5 h-3.5" />
                          Hide Engine Math
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-3.5 h-3.5" />
                          Inspect Math
                        </>
                      )}
                    </button>

                    {existingManifest ? (
                      <button
                        onClick={() => onViewManifest(existingManifest.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs border border-slate-700 transition"
                      >
                        <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
                        View Manifest #{existingManifest.id.toUpperCase()}
                      </button>
                    ) : isUnlocked ? (
                      <button
                        onClick={() => onGenerateManifest(match.id)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/50 transition animate-pulse"
                      >
                        <FileCheck2 className="w-4 h-4" />
                        Generate CPCB Form 10 Manifest
                      </button>
                    ) : (
                      <div className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5 text-amber-500/70" />
                        Awaiting Mutual Consent to Manifest
                      </div>
                    )}
                  </div>
                </div>

                {/* Expandable Engineering & Chemical Scoring Breakdown */}
                {isExpanded && (
                  <div className="p-5 bg-slate-950/90 border-t border-slate-800/80 space-y-3 text-xs">
                    <div className="font-mono font-bold text-slate-300 uppercase tracking-wider text-[11px]">
                      Deterministic Matching Engine Calculation & Rule Matrix:
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                        <div className="text-slate-400 text-[10px] font-mono">1. CHEMICAL COMPATIBILITY (50% WEIGHT)</div>
                        <div className="text-sm font-bold text-emerald-400 font-mono mt-1">
                          {(match.breakdown.chemical_compatibility * 100).toFixed(1)}% Score
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">
                          CPCB code alignment, pH tolerance, and calorific value feasibility.
                        </p>
                      </div>

                      <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                        <div className="text-slate-400 text-[10px] font-mono">2. GEOSPATIAL PROXIMITY (35% WEIGHT)</div>
                        <div className="text-sm font-bold text-cyan-400 font-mono mt-1">
                          {(match.breakdown.distance_score * 100).toFixed(1)}% Score
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Haversine decay across {match.transit_distance_km} km inside Nashik corridor (Max 150 km).
                        </p>
                      </div>

                      <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                        <div className="text-slate-400 text-[10px] font-mono">3. VOLUME RATIO (15% WEIGHT)</div>
                        <div className="text-sm font-bold text-amber-400 font-mono mt-1">
                          {(match.breakdown.volume_ratio * 100).toFixed(1)}% Ratio
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Monthly stream alignment: {supply.monthly_volume_mt} MT supply vs {demand.monthly_volume_mt} MT demand.
                        </p>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1">
                      <div className="text-[10px] font-mono text-slate-400 uppercase">Engineering Notes:</div>
                      {match.breakdown.compatibility_notes.map((note, idx) => (
                        <div key={idx} className="text-slate-300 text-xs flex items-start gap-1.5">
                          <span className="text-emerald-400 font-bold">•</span>
                          <span>{note}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Interactive Match Explanation Sheet / Drawer */}
      <MatchExplanationDrawer
        match={matches.find((m) => m.id === drawerMatchId) || null}
        facilities={facilities}
        streams={streams}
        manifests={manifests}
        activeRole={activeRole}
        onClose={() => setDrawerMatchId(null)}
        onToggleConsent={onToggleConsent}
        onGenerateManifest={onGenerateManifest}
        onViewManifest={onViewManifest}
        onLocateOnMap={(matchId) => {
          setDrawerMatchId(null);
          onSelectMatch(matchId);
        }}
      />
    </div>
  );
};
