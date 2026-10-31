'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  Leaf,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RotateCw,
  Building2,
  CheckCircle2,
  Lock,
  Unlock,
  MapPin,
  Scale,
  FileCheck2,
  Truck,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Layers,
  ArrowUpRight,
  BadgeAlert,
} from 'lucide-react';
import { ClusterESGMetrics, Facility, MaterialStream, MatchProposal } from '@/types';
import { formatINR, formatNumber } from '@/lib/utils';
import { UserRole } from './Header';
import { useAuth } from '@/lib/authContext';

interface DashboardOverviewProps {
  esgMetrics: ClusterESGMetrics;
  matches: MatchProposal[];
  facilities: Facility[];
  streams: MaterialStream[];
  activeRole: UserRole;
  onNavigate: (tab: 'MATCHES' | 'INGEST' | 'MAP' | 'COMPLIANCE') => void;
  onSelectMatch: (matchId: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  esgMetrics,
  matches,
  facilities,
  streams,
  activeRole,
  onNavigate,
  onSelectMatch,
}) => {
  const { isAuthenticated, openAuthModal } = useAuth();
  const [showHowItWorks, setShowHowItWorks] = useState<boolean>(true);

  // Operational pipeline metrics
  const proposedCount = matches.filter((m) => m.status === 'PROPOSED').length;
  const consentedCount = matches.filter((m) => m.status === 'MUTUAL_CONSENT').length;
  const transitCount = matches.filter(
    (m) => m.status === 'MANIFEST_GENERATED' || m.status === 'COMPLETED'
  ).length;

  const recentMatches = matches.slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* 1. Clean, Modern Enterprise Hero */}
      <div className="rounded-3xl bg-white border border-slate-200/90 p-7 sm:p-9 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Gujarat Industrial Belt • Vatva, Naroda & Kathwada Hubs
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-sans">
              Industrial Byproduct & Feedstock Exchange
            </h1>

            <p className="text-sm text-slate-600 leading-relaxed">
              Connect verified manufacturing, chemical, and building material plants. Turn industrial byproducts into profitable secondary raw materials while automating CPCB Form 10 compliance.
            </p>
          </div>

          {/* Quick Primary Actions */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 self-start md:self-center">
            <button
              onClick={() => {
                if (!isAuthenticated) {
                  openAuthModal('REGISTER');
                  return;
                }
                onNavigate('INGEST');
              }}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs hover:shadow transition flex items-center justify-center gap-2"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>List Byproduct Stream</span>
            </button>
            <button
              onClick={() => onNavigate('MATCHES')}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-xs transition flex items-center justify-center gap-2"
            >
              <span>Explore Active Deals</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Value Prop Micro-Highlights */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-6 text-xs text-slate-500">
          <span className="flex items-center gap-1.5 font-medium text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Rule 19 CPCB Form 10 Automation
          </span>
          <span className="flex items-center gap-1.5 font-medium text-slate-700">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Zero-Leakage Trade Secret Protection
          </span>
          <span className="flex items-center gap-1.5 font-medium text-slate-700">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            Arbitrage vs. Landfill Tipping Fees
          </span>
        </div>
      </div>

      {/* 2. OPERATIONAL WORKFLOW PIPELINE (Solves "I don't understand the operations") */}
      <div className="rounded-3xl bg-slate-900 text-white p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Core Operations
              </span>
              <h2 className="text-lg font-bold text-white">
                The 4-Step Symbiosis Deal Pipeline
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              How byproducts transition from factory waste into contracted secondary raw materials
            </p>
          </div>

          <button
            onClick={() => setShowHowItWorks(!showHowItWorks)}
            className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-medium self-start sm:self-auto transition"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{showHowItWorks ? 'Hide 60-Sec Primer' : 'Show 60-Sec Primer'}</span>
            {showHowItWorks ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Collapsible 60-Sec Explainer Primer */}
        {showHowItWorks && (
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-xs space-y-3">
            <div className="font-bold text-slate-200 flex items-center gap-2">
              <span className="text-emerald-400">💡 In Simple English:</span>
              <span>Why CIRX Bharat exists and who benefits (Team UdyogSetu)</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-slate-300">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/50 space-y-1">
                <div className="font-bold text-amber-400">1. Waste Generator (Factory A)</div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Produces chemical sludge or spent acid. Usually pays ₹1,500/MT to landfill it. Lists it on CIRX Bharat anonymously so competitors cannot spy on recipes.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/50 space-y-1">
                <div className="font-bold text-emerald-400">2. Raw Material Buyer (Factory B)</div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Cement kilns or block makers that need minerals or alternative fuel. Buys verified secondary feedstock at a 30–50% discount compared to virgin mined materials.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/50 space-y-1">
                <div className="font-bold text-sky-400">3. Legal Protection (Form 10)</div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Trucks transporting industrial waste require official CPCB Form 10 transit papers. CIRX Bharat automatically generates the 7-color slip manifests so trucks pass inspection.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 4 Interactive Visual Pipeline Stages */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Step 1 */}
          <div
            onClick={() => onNavigate('INGEST')}
            className="cursor-pointer p-4 rounded-2xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/50 transition flex flex-col justify-between space-y-3 group"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 rounded-full bg-slate-700 text-slate-300 text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <span className="text-xs font-bold text-slate-300 px-2 py-0.5 rounded-full bg-slate-700/60">
                  {streams.length} Streams
                </span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition">
                  Material Catalog
                </h3>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                  Byproducts listed anonymously with verified lab assay (pH, GCV, moisture).
                </p>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px] font-semibold text-emerald-400 group-hover:underline">
              <span>+ List New Stream</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Step 2 */}
          <div
            onClick={() => onNavigate('MATCHES')}
            className="cursor-pointer p-4 rounded-2xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/50 transition flex flex-col justify-between space-y-3 group"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 rounded-full bg-slate-700 text-slate-300 text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <span className="text-xs font-bold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-800/50">
                  {proposedCount} Proposed
                </span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition">
                  Algorithm Match
                </h3>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                  Chemical compatibility scored & haul distance capped at 150 km.
                </p>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px] font-semibold text-emerald-400 group-hover:underline">
              <span>Review Fits</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Step 3 */}
          <div
            onClick={() => onNavigate('MATCHES')}
            className="cursor-pointer p-4 rounded-2xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/50 transition flex flex-col justify-between space-y-3 group"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 rounded-full bg-slate-700 text-slate-300 text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <span className="text-xs font-bold text-amber-300 px-2 py-0.5 rounded-full bg-amber-950/60 border border-amber-800/50">
                  {consentedCount} Consented
                </span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition">
                  Mutual Consent
                </h3>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                  Both factories review ROI and approve deal. Real identities unlock.
                </p>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px] font-semibold text-emerald-400 group-hover:underline">
              <span>View Handshakes</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Step 4 */}
          <div
            onClick={() => onNavigate('COMPLIANCE')}
            className="cursor-pointer p-4 rounded-2xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/50 transition flex flex-col justify-between space-y-3 group"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 rounded-full bg-slate-700 text-slate-300 text-xs font-bold flex items-center justify-center">
                  4
                </span>
                <span className="text-xs font-bold text-sky-300 px-2 py-0.5 rounded-full bg-sky-950/60 border border-sky-800/50">
                  {transitCount} In Transit
                </span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition">
                  Form 10 Dispatch
                </h3>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                  Statutory CPCB 7-color manifest generated. Haulage dispatched with GPS tracking.
                </p>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px] font-semibold text-emerald-400 group-hover:underline">
              <span>Open Manifests</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. High-Level Metric Tiles (Simplified & Clean) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Cluster Telemetry & Commercial Arbitrage</h2>
            <p className="text-xs text-slate-500">Live operational impact across Gujarat manufacturing corridors</p>
          </div>
          <button
            onClick={() => onNavigate('MAP')}
            className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Open Logistics Map →</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Monthly Diverted
              </span>
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                <Leaf className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900">
              {formatNumber(esgMetrics.total_diverted_mt)} <span className="text-xs font-normal text-slate-500">MT/mo</span>
            </div>
            <div className="text-[11px] text-emerald-700 font-medium">
              100% diverted from landfill disposal
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Cost Arbitrage Saved
              </span>
              <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-amber-900">
              {formatINR(esgMetrics.total_savings_inr)}
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              Net savings across connected units
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Avoided Carbon
              </span>
              <div className="p-2 rounded-xl bg-teal-50 text-teal-700">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-teal-900">
              {formatNumber(esgMetrics.total_avoided_co2_mt)} <span className="text-xs font-normal text-slate-500">MT CO₂e</span>
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              0.82 kg CO₂e avoided per kg diverted
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Active Deals
              </span>
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900">
              {esgMetrics.active_symbioses_count} <span className="text-xs font-normal text-slate-500">Pairs</span>
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              {esgMetrics.hazardous_treated_mt} MT hazardous waste managed
            </div>
          </div>
        </div>
      </div>

      {/* 4. Active Bilateral Deals Preview */}
      <div className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Featured Secondary Material Deals</h2>
            <p className="text-xs text-slate-500">
              Algorithmic pairings based on chemical compatibility, transit distance, and volume match
            </p>
          </div>
          <button
            onClick={() => onNavigate('MATCHES')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold border border-emerald-200 transition self-start sm:self-auto"
          >
            <span>View All Deals ({matches.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recentMatches.map((match) => {
            const supply = streams.find((s) => s.id === match.supply_stream_id);
            const demand = streams.find((s) => s.id === match.demand_stream_id);
            const isUnlocked = match.generator_consent && match.offtaker_consent;

            return (
              <div
                key={match.id}
                onClick={() => {
                  onSelectMatch(match.id);
                  onNavigate('MATCHES');
                }}
                className="group cursor-pointer p-4 rounded-xl border border-slate-200 hover:border-emerald-500/80 transition bg-slate-50/40 hover:bg-white flex flex-col justify-between space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition">
                      {supply?.material_name || 'Industrial Stream'}
                    </span>
                    <div className="text-[11px] text-slate-500 font-medium">
                      Replaces: {demand?.material_name || 'Virgin Feedstock'}
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <span className="text-sm font-bold text-emerald-700">
                      {Math.round(match.match_score)}%
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase font-medium">Fit Score</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[11px] py-2 border-t border-b border-slate-200/60">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Distance</span>
                    <span className="font-semibold text-slate-800">{match.transit_distance_km} km</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Volume</span>
                    <span className="font-semibold text-slate-800">{supply?.monthly_volume_mt} MT/mo</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Net Value</span>
                    <span className="font-bold text-emerald-700">{formatINR(match.economic_benefit_inr)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1.5 text-[11px]">
                    {isUnlocked ? (
                      <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                        <Unlock className="w-3.5 h-3.5" />
                        Consent Complete (Unmasked)
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-slate-500 font-medium">
                        <Lock className="w-3.5 h-3.5 text-amber-600" />
                        Trade Secrets Shielded
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] font-bold text-emerald-700 group-hover:underline flex items-center gap-1">
                    Inspect Deal →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
