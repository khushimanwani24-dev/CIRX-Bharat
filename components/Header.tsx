'use client';

import React from 'react';
import {
  RotateCw,
  ShieldCheck,
  Building2,
  TrendingUp,
  MapPin,
  FileCheck2,
  FileSpreadsheet,
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

export type ActiveTab = 'MATCHES' | 'INGEST' | 'MAP' | 'MANIFESTS' | 'FORM4' | 'ARCHITECTURE';

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
    label: 'Generator: Vatva Specialty Dye-Chem',
    badge: 'GPCB Cat 35.3',
    color: 'border-rose-200 bg-rose-50 text-rose-700',
    entity: 'Vatva Specialty Dye-Chem Industries Pvt. Ltd. (GIDC Vatva)',
  },
  GEN_AUTO: {
    label: 'Generator: Sabarmati Pigments & Acid',
    badge: 'Spent H2SO4',
    color: 'border-amber-200 bg-amber-50 text-amber-800',
    entity: 'Sabarmati Pigments & Acid Corp (GIDC Naroda)',
  },
  OFF_CEMENT: {
    label: 'Offtaker: Gujarat Regional Cement',
    badge: 'Cement Retarder',
    color: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    entity: 'Gujarat Regional Cement & Grinding Terminal (Sanand)',
  },
  OFF_SAHYADRI: {
    label: 'Offtaker: Kathwada Eco-Crete',
    badge: 'AAC Blocks',
    color: 'border-cyan-200 bg-cyan-50 text-cyan-800',
    entity: 'Kathwada Eco-Crete & AAC Block Infra (GIDC Kathwada)',
  },
  REGULATOR_SPCB: {
    label: 'Regulator: GPCB Regional Officer',
    badge: 'GPCB Inspector',
    color: 'border-indigo-200 bg-indigo-50 text-indigo-700',
    entity: 'Gujarat Pollution Control Board (Ahmedabad East - Vatva)',
  },
  CLUSTER_ADMIN: {
    label: 'Administrator: GIDC Cluster Authority',
    badge: 'Platform Root',
    color: 'border-slate-200 bg-slate-100 text-slate-800',
    entity: 'GIDC Industrial Symbiosis Directorate (Ahmedabad)',
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
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md">
      {/* Top Banner: Branding + Live ESG Counter + Role Switcher */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Brand & Tagline */}
        <div className="flex items-center gap-3 self-start lg:self-auto">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-600 text-white shadow-sm shadow-emerald-600/20">
            <RotateCw className="w-5 h-5 text-white animate-[spin_16s_linear_infinite]" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2 font-sans">
                CIRX Bharat
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 tracking-wide">
                  v3.0 Enterprise
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Autonomous B2B Circular Feedstock Exchange • Team UdyogSetu
            </p>
          </div>
        </div>

        {/* Live Cluster ESG Metrics Bar */}
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto w-full lg:w-auto py-1">
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200/80 shadow-xs">
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <Leaf className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Diverted</div>
              <div className="text-sm font-bold text-slate-900 font-sans">
                {formatNumber(esgMetrics.total_diverted_mt)} <span className="text-xs font-normal text-slate-500">MT/mo</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200/80 shadow-xs">
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Savings</div>
              <div className="text-sm font-bold text-emerald-600 font-sans">
                {formatINR(esgMetrics.total_savings_inr)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200/80 shadow-xs">
            <div className="p-1.5 rounded-lg bg-teal-50 text-teal-600">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Avoided CO₂e</div>
              <div className="text-sm font-bold text-slate-900 font-sans">
                {formatNumber(esgMetrics.total_avoided_co2_mt)} <span className="text-xs font-normal text-slate-500">MT</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200/80 shadow-xs">
            <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Haz Diverted</div>
              <div className="text-sm font-bold text-slate-900 font-sans">
                {formatNumber(esgMetrics.hazardous_treated_mt)} <span className="text-xs font-normal text-slate-500">MT</span>
              </div>
            </div>
          </div>
        </div>

        {/* Role Switcher */}
        <div className="flex items-center gap-2 self-end lg:self-auto w-full sm:w-auto justify-end">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold flex items-center gap-1">
              <Building2 className="w-3 h-3 text-slate-400" />
              Active Persona
            </span>
            <select
              value={activeRole}
              onChange={(e) => onRoleChange(e.target.value as UserRole)}
              className="mt-0.5 text-xs bg-white border border-slate-200 hover:border-slate-300 text-slate-800 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs font-medium cursor-pointer"
            >
              <option value="GEN_PRECISION">Generator: Vatva Specialty Dye-Chem (Gypsum Sludge)</option>
              <option value="GEN_AUTO">Generator: Sabarmati Pigments & Acid (Spent H2SO4)</option>
              <option value="OFF_CEMENT">Offtaker: Gujarat Regional Cement (Setting Retarder)</option>
              <option value="OFF_SAHYADRI">Offtaker: Kathwada Eco-Crete (AAC Blocks)</option>
              <option value="REGULATOR_SPCB">Regulator: GPCB Regional Officer (Audit View)</option>
              <option value="CLUSTER_ADMIN">GIDC Ahmedabad Cluster Admin (Full Control)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Bar with Segmented Pill Container */}
      <div className="border-t border-slate-200/80 bg-slate-50/70 px-4 sm:px-6 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 overflow-x-auto">
          <nav className="flex items-center bg-slate-200/60 p-1 rounded-xl space-x-1">
            <button
              onClick={() => onTabChange('MATCHES')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all ${
                activeTab === 'MATCHES'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50 font-medium'
              }`}
            >
              <RotateCw className="w-3.5 h-3.5 text-emerald-600" />
              Bilateral Exchange
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                activeTab === 'MATCHES' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
              }`}>
                {matchCount}
              </span>
            </button>

            <button
              onClick={() => onTabChange('INGEST')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all ${
                activeTab === 'INGEST'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50 font-medium'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-emerald-600" />
              Stream Ingestion
            </button>

            <button
              onClick={() => onTabChange('MAP')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all ${
                activeTab === 'MAP'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50 font-medium'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              Industrial Map (GIS)
            </button>

            <button
              onClick={() => onTabChange('MANIFESTS')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all ${
                activeTab === 'MANIFESTS'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50 font-medium'
              }`}
            >
              <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
              Form 10 Manifests
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                activeTab === 'MANIFESTS' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
              }`}>
                {manifestCount}
              </span>
            </button>

            <button
              onClick={() => onTabChange('FORM4')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all ${
                activeTab === 'FORM4'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50 font-medium'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              Form 4 Annual Return
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-medium ${
                activeTab === 'FORM4' ? 'bg-emerald-100 text-emerald-800' : 'bg-purple-100 text-purple-700'
              }`}>
                Statutory
              </span>
            </button>

            <button
              onClick={() => onTabChange('ARCHITECTURE')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all ${
                activeTab === 'ARCHITECTURE'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50 font-medium'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-emerald-600" />
              System Specs
            </button>
          </nav>

          <div className="flex items-center gap-2 text-xs py-1">
            <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${currentRoleMeta.color}`}>
              {currentRoleMeta.badge}
            </span>
            <button
              onClick={onResetData}
              title="Reset data back to initial seed state"
              className="text-[11px] text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 shadow-xs transition font-medium"
            >
              Reset Fixtures
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
