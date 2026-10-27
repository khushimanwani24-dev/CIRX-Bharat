'use client';

import React from 'react';
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
  Layers,
  Scale,
  FileCheck2,
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
  // Take top 4 matches for recent matches preview
  const recentMatches = matches.slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* 1. Welcoming Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white p-7 sm:p-10 shadow-lg">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Ahmedabad Industrial Cluster • Vatva GIDC, Naroda GIDC & Kathwada Corridor
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white font-sans">
            Ahmedabad Industrial Symbiosis Grid
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            Autonomous secondary feedstock exchange enabling zero-leakage industrial circularity across Gujarat MSMEs. Connecting hazardous byproduct generators with licensed co-processors under GPCB XGN statutory tracking.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              100% GPCB XGN Form 10 Compliant
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              Zero-Leakage Trade Shield Active
            </span>
            <span>•</span>
            <span className="text-slate-400">Vatva & Naroda GIDC Units</span>
          </div>
        </div>

        {/* Decorative Graphic Element */}
        <div className="absolute -right-8 -bottom-10 opacity-10 pointer-events-none">
          <RotateCw className="w-96 h-96 text-white" />
        </div>
      </div>

      {/* 2. Two Prominent Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Action Card 1: Generator */}
        <div
          onClick={() => {
            if (!isAuthenticated) {
              openAuthModal('REGISTER');
              return;
            }
            onNavigate('INGEST');
          }}
          className="group cursor-pointer p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/90 hover:border-emerald-500 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between space-y-5"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200/80 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-amber-600" />
              </div>
              <span className="text-[11px] font-semibold uppercase px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                Generator Stream Intake
              </span>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition">
                Have Spent By-Products?
              </h2>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Register spent acids, paint sludges, foundry slag, or chemical effluents with verified assay parameters to identify licensed offtakers.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 group-hover:text-emerald-800 group-hover:translate-x-1 transition duration-200">
            <span>List Material Stream (3-Step Wizard)</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* Action Card 2: Offtaker */}
        <div
          onClick={() => onNavigate('MATCHES')}
          className="group cursor-pointer p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/90 hover:border-emerald-500 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between space-y-5"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200/80 flex items-center justify-center">
                <RotateCw className="w-6 h-6 text-emerald-600" />
              </div>
              <span className="text-[11px] font-semibold uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                Offtaker Procurement
              </span>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition">
                Seeking Secondary Raw Materials?
              </h2>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Explore algorithmic pairings for cement kiln co-processing (AFR), hydrometallurgical recovery, and circular mineral substitution.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 group-hover:text-emerald-800 group-hover:translate-x-1 transition duration-200">
            <span>Explore Matched Offtakers & Feedstocks</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* 3. High-Level Metric Tiles */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Corridor Telemetry & ESG Impact</h2>
            <p className="text-xs text-slate-500">Live aggregate metrics across the Ahmedabad Industrial Cluster</p>
          </div>
          <button
            onClick={() => onNavigate('MAP')}
            className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Open Corridor Map →</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Monthly Diverted
              </span>
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                <Leaf className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {formatNumber(esgMetrics.total_diverted_mt)} <span className="text-xs font-normal text-slate-500">MT/mo</span>
            </div>
            <div className="text-[11px] text-emerald-700 font-medium">
              100% TSDF Landfill Avoidance
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Economic Arbitrage
              </span>
              <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-800">
              {formatINR(esgMetrics.total_savings_inr)}
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              Tipping fee savings & raw material offset
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Avoided Carbon
              </span>
              <div className="p-2 rounded-xl bg-teal-50 text-teal-700">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-teal-800">
              {formatNumber(esgMetrics.total_avoided_co2_mt)} <span className="text-xs font-normal text-slate-500">MT CO₂e</span>
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              0.82 kg CO₂e / kg secondary diversion
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Active Symbioses
              </span>
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {esgMetrics.active_symbioses_count} <span className="text-xs font-normal text-slate-500">Pairs</span>
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              {esgMetrics.hazardous_treated_mt} MT hazardous waste managed
            </div>
          </div>
        </div>
      </div>

      {/* 4. Recent Active Matches Preview */}
      <div className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Bilateral Match Proposals</h2>
            <p className="text-xs text-slate-500">
              Calculated via pairwise chemistry, haversine transport distance, and batch volume fit.
            </p>
          </div>
          <button
            onClick={() => onNavigate('MATCHES')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold border border-emerald-200 transition self-start sm:self-auto"
          >
            <span>View All Matches ({matches.length})</span>
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
                className="group cursor-pointer p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-xs transition bg-slate-50/50 hover:bg-white flex flex-col justify-between space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition">
                        {supply?.material_name || 'Industrial Stream'}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">
                      Pairing: {demand?.material_name || 'Secondary Offtake'}
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <span className="text-sm font-extrabold text-emerald-700 font-sans">
                      {Math.round(match.match_score)}%
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium uppercase">Fit Score</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[11px] pt-2 border-t border-slate-200/70">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Distance</span>
                    <span className="font-bold text-slate-800">{match.transit_distance_km} km</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Monthly Vol</span>
                    <span className="font-bold text-slate-800">{supply?.monthly_volume_mt} MT</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Arbitrage</span>
                    <span className="font-bold text-emerald-700">{formatINR(match.economic_benefit_inr)}</span>
                  </div>
                </div>

                {/* ROI / Arbitrage Badges */}
                <div className="flex flex-col sm:flex-row gap-1.5 pt-1">
                  <span className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Savings vs. NEPL/TSDF Landfill Fees (₹1,500/MT saved)
                  </span>
                  <span className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-md bg-sky-50 text-sky-800 border border-sky-200">
                    Savings vs. Virgin Mineral Gypsum (₹1,050/MT saved)
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1.5 text-[11px]">
                    {isUnlocked ? (
                      <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                        <Unlock className="w-3.5 h-3.5" />
                        Mutual Consent Achieved
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-slate-500 font-medium">
                        <Lock className="w-3.5 h-3.5 text-amber-600" />
                        Confidentiality Shielded
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] font-bold text-emerald-700 group-hover:underline flex items-center gap-1">
                    Inspect Match →
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
