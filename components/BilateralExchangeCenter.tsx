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
import { useAuth } from '@/lib/authContext';

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
  const { isAuthenticated, openAuthModal } = useAuth();
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
    // Check authentication requirement
    if (!isAuthenticated) {
      openAuthModal('SIGN_IN');
      return;
    }

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
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold text-slate-900 font-sans flex items-center gap-2">
              <RotateCw className="w-5 h-5 text-emerald-600" />
              Bilateral Material Exchange & Deals
            </h2>
            <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              Verified Pairings
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Review secondary feedstock matches. Industrial counterparties remain anonymous until both parties review economics and authorize identity disclosure.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Hazard Tier Filter */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs text-xs">
            <button
              onClick={() => setFilterTier('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                filterTier === 'ALL'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Deals ({matches.length})
            </button>
            <button
              onClick={() => setFilterTier('HAZARDOUS')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                filterTier === 'HAZARDOUS'
                  ? 'bg-rose-50 text-rose-800 border border-rose-200 font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Hazardous
            </button>
            <button
              onClick={() => setFilterTier('NON_HAZARDOUS')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                filterTier === 'NON_HAZARDOUS'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Non-Hazardous
            </button>
          </div>

          {/* Privacy Consent Filter */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs text-xs">
            <button
              onClick={() => setFilterConsent('ALL')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                filterConsent === 'ALL' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Statuses
            </button>
            <button
              onClick={() => setFilterConsent('UNLOCKED')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
                filterConsent === 'UNLOCKED'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Unlock className="w-3 h-3 text-emerald-600" />
              Consented
            </button>
            <button
              onClick={() => setFilterConsent('PENDING')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
                filterConsent === 'PENDING'
                  ? 'bg-slate-100 text-slate-800 font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Lock className="w-3 h-3 text-slate-500" />
              Pending Handshake
            </button>
          </div>
        </div>
      </div>

      {/* Match Cards List */}
      <div className="space-y-6">
        {filteredMatches.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-slate-500 text-sm">No matches found for the selected filter criteria.</p>
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
                className={`relative rounded-2xl border transition-all duration-200 overflow-hidden bg-white shadow-2xs ${
                  isSelected
                    ? 'border-emerald-500 ring-1 ring-emerald-500/30'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* 1. Clean Top Header: Material Flow + Score + Haul + Value */}
                <div className="px-6 py-4 bg-slate-50/70 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900 font-sans">
                        {supply.material_name}
                      </h3>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                      <span className="text-sm font-semibold text-slate-700">
                        Replaces {demand.material_name}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-2">
                      <span>{sanitizedGen.display_name} ({sanitizedGen.cluster_zone})</span>
                      <span>➔</span>
                      <span>{sanitizedOff.display_name} ({sanitizedOff.cluster_zone})</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-start md:self-center">
                    {/* Compatibility Score */}
                    <button
                      onClick={() => setDrawerMatchId(match.id)}
                      className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-500 transition text-left shadow-2xs flex items-center gap-2"
                      title="Inspect scoring breakdown"
                    >
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <div>
                        <div className="text-xs font-bold text-slate-900">{Math.round(match.match_score)}% Fit</div>
                        <div className="text-[9px] text-slate-400 uppercase font-medium">Algo Score</div>
                      </div>
                    </button>

                    {/* Haul Distance */}
                    <div className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs text-left">
                      <div className="text-xs font-bold text-slate-900">{match.transit_distance_km} km</div>
                      <div className="text-[9px] text-slate-400 uppercase font-medium">Haul Distance</div>
                    </div>

                    {/* Net Arbitrage */}
                    <div className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs text-left">
                      <div className="text-xs font-bold text-emerald-700">{formatINR(match.economic_benefit_inr)}</div>
                      <div className="text-[9px] text-slate-400 uppercase font-medium">Monthly Savings</div>
                    </div>

                    {/* Locate on Map button */}
                    <button
                      onClick={() => onSelectMatch(match.id)}
                      className={`text-xs px-3 py-2 rounded-xl font-medium transition ${
                        isSelected
                          ? 'bg-slate-900 text-white'
                          : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                      }`}
                    >
                      {isSelected ? 'Active Route' : 'Map View'}
                    </button>
                  </div>
                </div>

                {/* 2. Clear Operational Status Banner (Tells user EXACTLY what step this deal is in) */}
                <div className={`px-6 py-2.5 border-b text-xs flex items-center justify-between ${
                  isUnlocked
                    ? 'bg-emerald-50/80 border-emerald-200/80 text-emerald-900'
                    : match.generator_consent || match.offtaker_consent
                    ? 'bg-amber-50/80 border-amber-200/80 text-amber-900'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}>
                  <div className="flex items-center gap-2">
                    {isUnlocked ? (
                      <>
                        <Unlock className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span className="font-semibold">
                          Bilateral Consent Achieved: Confidential identities revealed. Statutory CPCB Form 10 manifest ready for road dispatch.
                        </span>
                      </>
                    ) : match.generator_consent || match.offtaker_consent ? (
                      <>
                        <RotateCw className="w-4 h-4 text-amber-600 animate-spin flex-shrink-0" />
                        <span className="font-medium">
                          Handshake in Progress: {match.generator_consent ? 'Generator' : 'Offtaker'} has signed off. Awaiting final consent from counterparty.
                        </span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <span className="font-medium">
                          Identities Protected: Review technical assay parameters below and authorize handshake to unlock full contact details.
                        </span>
                      </>
                    )}
                  </div>

                  <span className="text-[11px] font-semibold hidden sm:inline">
                    Avoids {match.avoided_co2_mt} MT CO₂e / mo
                  </span>
                </div>

                {/* Main Content: Side-by-Side Generator vs Offtaker Comparative Panels (Requirement 6) */}
                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                  {/* Central Flow Arrow on Desktop */}
                  <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white border border-slate-200/90 items-center justify-center text-emerald-600 shadow-md">
                    <ArrowRight className="w-4 h-4" />
                  </div>

                  {/* Left Column: Generator Secondary Feedstock (Soft neutral background) */}
                  <div className="p-4 rounded-xl bg-slate-50/60 border border-slate-200/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                        Generator Secondary Stream
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        supply.is_hazardous
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      }`}>
                        {supply.is_hazardous ? 'Hazardous (CPCB Rule 19)' : 'Circular Byproduct'}
                      </span>
                    </div>

                    <div>
                      <div className="text-base font-bold text-slate-900 flex items-center gap-2">
                        {sanitizedGen.display_name}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {sanitizedGen.cluster_zone}
                      </div>
                    </div>

                    {/* Masked vs Unmasked Identity Data */}
                    <div className="p-2.5 rounded-lg bg-white border border-slate-200/80 text-xs space-y-1 shadow-2xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-medium">Legal Entity:</span>
                        <span className={isUnlocked ? 'text-slate-900 font-semibold' : 'text-slate-600'}>
                          {sanitizedGen.legal_name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-medium">GSTIN:</span>
                        <span className={`font-mono ${isUnlocked ? 'text-emerald-700 font-bold' : 'text-slate-600'}`}>
                          {sanitizedGen.gstin}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-medium">SPCB Consent:</span>
                        <span className={`font-mono ${isUnlocked ? 'text-slate-900 font-semibold' : 'text-slate-600'}`}>
                          {sanitizedGen.spcb_consent_id}
                        </span>
                      </div>
                      {isUnlocked && sanitizedGen.contact_person && (
                        <div className="flex justify-between pt-1 border-t border-slate-100 text-[11px]">
                          <span className="text-slate-500 font-medium">Contact:</span>
                          <span className="text-slate-700">{sanitizedGen.contact_person}</span>
                        </div>
                      )}
                    </div>

                    {/* Stream Parameters */}
                    <div className="space-y-1.5 text-xs">
                      <div className="font-semibold text-slate-900 text-sm">
                        {supply.material_name}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-700">
                        <div className="p-2 rounded-lg bg-white border border-slate-200/80 shadow-2xs">
                          <span className="text-slate-500 block text-[10px]">Monthly Volume</span>
                          <span className="font-bold text-slate-900 text-xs">{supply.monthly_volume_mt} MT/mo</span>
                        </div>
                        <div className="p-2 rounded-lg bg-white border border-slate-200/80 shadow-2xs">
                          <span className="text-slate-500 block text-[10px]">Physical State</span>
                          <span className="font-bold text-slate-900 text-xs">{supply.physical_state}</span>
                        </div>
                        <div className="p-2 rounded-lg bg-white border border-slate-200/80 shadow-2xs">
                          <span className="text-slate-500 block text-[10px]">pH Value</span>
                          <span className="font-bold text-slate-900 text-xs">{supply.ph_level ?? 'Neutral / N/A'}</span>
                        </div>
                        <div className="p-2 rounded-lg bg-white border border-slate-200/80 shadow-2xs">
                          <span className="text-slate-500 block text-[10px]">Calorific Value</span>
                          <span className="font-bold text-slate-900 text-xs">{supply.calorific_value_kcal || 0} kcal</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Offtaker Feedstock Requirement (Soft emerald tint) */}
                  <div className="p-4 rounded-xl bg-emerald-50/30 border border-emerald-200/60 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                        Consented Offtaker Feedstock
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white text-slate-700 border border-slate-200">
                        {demand.cpcb_waste_code}
                      </span>
                    </div>

                    <div>
                      <div className="text-base font-bold text-slate-900 flex items-center gap-2">
                        {sanitizedOff.display_name}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {sanitizedOff.cluster_zone}
                      </div>
                    </div>

                    {/* Masked vs Unmasked Identity Data */}
                    <div className="p-2.5 rounded-lg bg-white border border-slate-200/80 text-xs space-y-1 shadow-2xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-medium">Legal Entity:</span>
                        <span className={isUnlocked ? 'text-slate-900 font-semibold' : 'text-slate-600'}>
                          {sanitizedOff.legal_name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-medium">GSTIN:</span>
                        <span className={`font-mono ${isUnlocked ? 'text-emerald-700 font-bold' : 'text-slate-600'}`}>
                          {sanitizedOff.gstin}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-medium">SPCB Consent:</span>
                        <span className={`font-mono ${isUnlocked ? 'text-slate-900 font-semibold' : 'text-slate-600'}`}>
                          {sanitizedOff.spcb_consent_id}
                        </span>
                      </div>
                      {isUnlocked && sanitizedOff.contact_person && (
                        <div className="flex justify-between pt-1 border-t border-slate-100 text-[11px]">
                          <span className="text-slate-500 font-medium">Contact:</span>
                          <span className="text-slate-700">{sanitizedOff.contact_person}</span>
                        </div>
                      )}
                    </div>

                    {/* Demand Specifications */}
                    <div className="space-y-1.5 text-xs">
                      <div className="font-semibold text-slate-900 text-sm">
                        {demand.material_name}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-700">
                        <div className="p-2 rounded-lg bg-white border border-slate-200/80 shadow-2xs">
                          <span className="text-slate-500 block text-[10px]">Intake Capacity</span>
                          <span className="font-bold text-slate-900 text-xs">{demand.monthly_volume_mt} MT/mo</span>
                        </div>
                        <div className="p-2 rounded-lg bg-white border border-slate-200/80 shadow-2xs">
                          <span className="text-slate-500 block text-[10px]">Target State</span>
                          <span className="font-bold text-slate-900 text-xs">{demand.physical_state}</span>
                        </div>
                        <div className="p-2 rounded-lg bg-white border border-slate-200/80 shadow-2xs">
                          <span className="text-slate-500 block text-[10px]">Procure Price</span>
                          <span className="font-bold text-slate-900 text-xs">₹{demand.price_per_mt}/MT</span>
                        </div>
                        <div className="p-2 rounded-lg bg-white border border-slate-200/80 shadow-2xs">
                          <span className="text-slate-500 block text-[10px]">Sector Mode</span>
                          <span className="font-bold text-slate-900 text-xs truncate">{sanitizedOff.facility_type}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bilateral Connect & Mutual Consent Trigger Area */}
                <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
                  {/* Two-Sided Consent Checklist */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full md:w-auto">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Bilateral Handshake:</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Generator Side Consent */}
                      <button
                        onClick={() => handleConsentClick(match, 'generator')}
                        title={isAuthenticated ? 'Authorize identity disclosure as Generator' : 'Sign In required to disclose identity'}
                        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition border ${
                          match.generator_consent
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs font-bold'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50 hover:border-slate-400'
                        }`}
                      >
                        <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] ${
                          match.generator_consent ? 'bg-white text-emerald-700 font-extrabold' : 'border border-slate-400'
                        }`}>
                          {match.generator_consent ? '✓' : ''}
                        </span>
                        <span>{match.generator_consent ? 'Generator Signed ✓' : 'Sign as Generator'}</span>
                      </button>

                      {/* Offtaker Side Consent */}
                      <button
                        onClick={() => handleConsentClick(match, 'offtaker')}
                        title={isAuthenticated ? 'Authorize identity disclosure as Offtaker' : 'Sign In required to disclose identity'}
                        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition border ${
                          match.offtaker_consent
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs font-bold'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50 hover:border-slate-400'
                        }`}
                      >
                        <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] ${
                          match.offtaker_consent ? 'bg-white text-emerald-700 font-extrabold' : 'border border-slate-400'
                        }`}>
                          {match.offtaker_consent ? '✓' : ''}
                        </span>
                        <span>{match.offtaker_consent ? 'Offtaker Signed ✓' : 'Sign as Offtaker'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Manifest Generation & Action Buttons */}
                  <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                    <button
                      onClick={() => setDrawerMatchId(match.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 shadow-2xs transition"
                      title="Open interactive Symbiosis Engineering Breakdown Drawer"
                    >
                      <Scale className="w-3.5 h-3.5 text-slate-500" />
                      <span>Assay Specs</span>
                    </button>

                    {existingManifest ? (
                      <button
                        onClick={() => onViewManifest(existingManifest.id)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-xs transition"
                      >
                        <FileCheck2 className="w-4 h-4 text-emerald-400" />
                        <span>View Form 10 Manifest</span>
                      </button>
                    ) : isUnlocked ? (
                      <button
                        onClick={() => {
                          if (!isAuthenticated) {
                            openAuthModal('SIGN_IN');
                            return;
                          }
                          onGenerateManifest(match.id);
                        }}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs hover:shadow transition"
                      >
                        <FileCheck2 className="w-4 h-4" />
                        <span>Generate Form 10 Transit Manifest →</span>
                      </button>
                    ) : (
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5 font-medium px-2 py-1 bg-white rounded-lg border border-slate-200">
                        <Lock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Sign both sides to unlock manifest</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Expandable Engineering & Chemical Scoring Breakdown */}
                {isExpanded && (
                  <div className="p-5 bg-slate-50/80 border-t border-slate-200 space-y-3 text-xs">
                    <div className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                      Deterministic Matching Engine Calculation & Rule Matrix:
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                        <div className="text-slate-500 text-[10px] uppercase font-semibold">1. CHEMICAL COMPATIBILITY (50% WEIGHT)</div>
                        <div className="text-base font-bold text-emerald-700 font-sans mt-1">
                          {(match.breakdown.chemical_compatibility * 100).toFixed(1)}% Score
                        </div>
                        <p className="text-[11px] text-slate-600 mt-1">
                          CPCB code alignment, pH tolerance, and calorific value feasibility.
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                        <div className="text-slate-500 text-[10px] uppercase font-semibold">2. GEOSPATIAL PROXIMITY (35% WEIGHT)</div>
                        <div className="text-base font-bold text-sky-700 font-sans mt-1">
                          {(match.breakdown.distance_score * 100).toFixed(1)}% Score
                        </div>
                        <p className="text-[11px] text-slate-600 mt-1">
                          Haversine decay across {match.transit_distance_km} km inside Ahmedabad corridor (Max 150 km).
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                        <div className="text-slate-500 text-[10px] uppercase font-semibold">3. VOLUME RATIO (15% WEIGHT)</div>
                        <div className="text-base font-bold text-amber-700 font-sans mt-1">
                          {(match.breakdown.volume_ratio * 100).toFixed(1)}% Ratio
                        </div>
                        <p className="text-[11px] text-slate-600 mt-1">
                          Monthly stream alignment: {supply.monthly_volume_mt} MT supply vs {demand.monthly_volume_mt} MT demand.
                        </p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
                      <div className="text-[10px] font-semibold text-slate-500 uppercase">Engineering Notes:</div>
                      {match.breakdown.compatibility_notes.map((note, idx) => (
                        <div key={idx} className="text-slate-700 text-xs flex items-start gap-1.5">
                          <span className="text-emerald-600 font-bold">•</span>
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
