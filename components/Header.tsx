'use client';

import React from 'react';
import {
  RotateCw,
  ShieldCheck,
  Building2,
  TrendingUp,
  MapPin,
  FileCheck2,
  Cpu,
  Layers,
  Leaf,
  Sparkles,
} from 'lucide-react';
import { ClusterESGMetrics } from '@/types';
import { formatINR, formatNumber } from '@/lib/utils';

export type UserRole =
  | 'GEN_PRECISION'
  | 'GEN_AUTO'
  | 'OFF_CEMENT'
  | 'OFF_SAHYADRI'
  | 'REGULATOR_SPCB'
  | 'CLUSTER_ADMIN';

export type ActiveTab = 'MATCHES' | 'INGEST' | 'MAP' | 'MANIFESTS' | 'ARCHITECTURE';

interface HeaderProps {
  esgMetrics: ClusterESGMetrics;
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onResetData: () => void;
  manifestCount: number;
  matchCount: number;
}

export const ROLE_LABELS: Record<UserRole, { label: string; badge: string; color: string; entity: string }> = {
  GEN_PRECISION: {
    label: 'Generator: Precision Plating Works',
    badge: 'CPCB Cat 35.3',
    color: 'border-rose-500/50 bg-rose-950/40 text-rose-300',
    entity: 'Precision Plating Works Pvt. Ltd. (MIDC Ambad)',
  },
  GEN_AUTO: {
    label: 'Generator: Nashik Auto Stamping',
    badge: 'CPCB Cat 21.1',
    color: 'border-amber-500/50 bg-amber-950/40 text-amber-300',
    entity: 'Nashik Auto Stamping Ltd. (MIDC Ambad)',
  },
  OFF_CEMENT: {
    label: 'Offtaker: Western India Cement',
    badge: 'Kiln Co-Processing',
    color: 'border-emerald-500/50 bg-emerald-950/40 text-emerald-300',
    entity: 'Western India Cement Works (Sinnar)',
  },
  OFF_SAHYADRI: {
    label: 'Offtaker: Sahyadri Precious Metals',
    badge: 'Hydrometallurgy Hub',
    color: 'border-cyan-500/50 bg-cyan-950/40 text-cyan-300',
    entity: 'Sahyadri Precious Metals (MIDC Satpur)',
  },
  REGULATOR_SPCB: {
    label: 'Regulator: SPCB Regional Officer',
    badge: 'Statutory Inspector',
    color: 'border-purple-500/50 bg-purple-950/40 text-purple-300',
    entity: 'Maharashtra Pollution Control Board (Nashik Div)',
  },
  CLUSTER_ADMIN: {
    label: 'Administrator: MIDC Cluster Authority',
    badge: 'Platform Root',
    color: 'border-blue-500/50 bg-blue-950/40 text-blue-300',
    entity: 'MIDC Industrial Symbiosis Directorate',
  },
};

export const Header: React.FC<HeaderProps> = ({
  esgMetrics,
  activeRole,
  onRoleChange,
  activeTab,
  onTabChange,
  onResetData,
  manifestCount,
  matchCount,
}) => {
  const currentRoleMeta = ROLE_LABELS[activeRole];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      {/* Top Banner: Branding + Live ESG Counter + Role Switcher */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Brand & Tagline */}
        <div className="flex items-center gap-3 self-start lg:self-auto">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 border border-emerald-500/30 shadow-lg shadow-emerald-950/40">
            <RotateCw className="w-6 h-6 text-emerald-300 animate-[spin_12s_linear_infinite]" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5 font-sans">
                ReBharat
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 tracking-wider">
                  v2.4 Enterprise
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              The Closed-Loop Material Exchange for Indian Industry
            </p>
          </div>
        </div>

        {/* Live Cluster ESG Metrics Bar */}
        <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto w-full lg:w-auto py-1 px-3 bg-slate-900/80 border border-slate-800 rounded-xl">
          <div className="flex items-center gap-2 px-2 py-1">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Leaf className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Diverted</div>
              <div className="text-sm font-bold text-emerald-400 font-mono">
                {formatNumber(esgMetrics.total_diverted_mt)} <span className="text-xs text-slate-400">MT/mo</span>
              </div>
            </div>
          </div>

          <div className="h-6 w-px bg-slate-800" />

          <div className="flex items-center gap-2 px-2 py-1">
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Savings</div>
              <div className="text-sm font-bold text-cyan-300 font-mono">
                {formatINR(esgMetrics.total_savings_inr)}
              </div>
            </div>
          </div>

          <div className="h-6 w-px bg-slate-800" />

          <div className="flex items-center gap-2 px-2 py-1">
            <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Avoided CO₂e</div>
              <div className="text-sm font-bold text-teal-400 font-mono">
                {formatNumber(esgMetrics.total_avoided_co2_mt)} <span className="text-xs text-slate-400">MT</span>
              </div>
            </div>
          </div>

          <div className="h-6 w-px bg-slate-800" />

          <div className="flex items-center gap-2 px-2 py-1">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Haz Safe</div>
              <div className="text-sm font-bold text-amber-400 font-mono">
                {formatNumber(esgMetrics.hazardous_treated_mt)} <span className="text-xs text-slate-400">MT</span>
              </div>
            </div>
          </div>
        </div>

        {/* Role Switcher */}
        <div className="flex items-center gap-2 self-end lg:self-auto w-full sm:w-auto justify-end">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1">
              <Building2 className="w-3 h-3 text-slate-500" />
              Active Persona
            </span>
            <select
              value={activeRole}
              onChange={(e) => onRoleChange(e.target.value as UserRole)}
              className="mt-0.5 text-xs bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium cursor-pointer"
            >
              <option value="GEN_PRECISION">Generator: Precision Plating (Hazardous Cr)</option>
              <option value="GEN_AUTO">Generator: Nashik Auto Stamping (Paint Sludge)</option>
              <option value="OFF_CEMENT">Offtaker: Western India Cement (Kiln Co-proc)</option>
              <option value="OFF_SAHYADRI">Offtaker: Sahyadri Precious Metals (Metals)</option>
              <option value="REGULATOR_SPCB">Regulator: SPCB Nashik Officer (Audit View)</option>
              <option value="CLUSTER_ADMIN">MIDC Cluster Admin (Full Control)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Bar */}
      <div className="border-t border-slate-800/80 bg-slate-900/60 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto">
          <nav className="flex space-x-1 py-1.5">
            <button
              onClick={() => onTabChange('MATCHES')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'MATCHES'
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-900/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <RotateCw className="w-3.5 h-3.5" />
              Bilateral Exchange Center
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                activeTab === 'MATCHES' ? 'bg-emerald-700 text-emerald-100' : 'bg-slate-800 text-slate-400'
              }`}>
                {matchCount}
              </span>
            </button>

            <button
              onClick={() => onTabChange('INGEST')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'INGEST'
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-900/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Stream Ingestion Portal
            </button>

            <button
              onClick={() => onTabChange('MAP')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'MAP'
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-900/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              Industrial Corridor Map (GIS)
            </button>

            <button
              onClick={() => onTabChange('MANIFESTS')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'MANIFESTS'
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-900/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              SPCB Form 10 Manifests
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                activeTab === 'MANIFESTS' ? 'bg-emerald-700 text-emerald-100' : 'bg-slate-800 text-slate-400'
              }`}>
                {manifestCount}
              </span>
            </button>

            <button
              onClick={() => onTabChange('ARCHITECTURE')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'ARCHITECTURE'
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-900/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              System Specs & CPCB Rules
            </button>
          </nav>

          <div className="flex items-center gap-2 text-xs py-1">
            <span className={`px-2 py-0.5 rounded text-[11px] font-mono border ${currentRoleMeta.color}`}>
              {currentRoleMeta.badge}
            </span>
            <button
              onClick={onResetData}
              title="Reset data back to initial seed state"
              className="text-[11px] text-slate-400 hover:text-slate-200 bg-slate-800/50 hover:bg-slate-800 px-2 py-1 rounded border border-slate-700 transition"
            >
              Reset Fixtures
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
