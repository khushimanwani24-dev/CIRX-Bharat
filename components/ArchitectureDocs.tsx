'use client';

import React from 'react';
import {
  Cpu,
  Layers,
  Shield,
  FileCheck2,
  Leaf,
  Scale,
  MapPin,
  Lock,
  Unlock,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import { FORM_10_COPIES } from '@/lib/manifestEngine';

export const ArchitectureDocs: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto py-6 px-4 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-white font-mono flex items-center gap-2">
            <Cpu className="w-5 h-5 text-emerald-400" />
            ReBharat Enterprise Architecture & Regulatory Specifications
          </h2>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Technical specifications of the deterministic matching engine, zero-leakage privacy state machine, and CPCB Form 10 compliance rules.
        </p>
      </div>

      {/* 1. Deterministic Scoring Formula */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-emerald-400 font-mono uppercase tracking-wider">
          <Scale className="w-4 h-4" />
          1. Deterministic Symbiosis Scoring Formula
        </div>
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-300 leading-relaxed">
          CompositeScore = (ChemicalCompatibility × 0.50 + DistanceScore × 0.35 + VolumeRatio × 0.15) × 100
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="font-bold text-white block mb-1">Chemical Compatibility (50%)</span>
            <p className="text-slate-400 leading-relaxed">
              Pairwise validation between CPCB Schedule codes, pH tolerance windows, calorific value thresholds (≥ 2,500 kcal/kg for cement kilns), and physical states.
            </p>
          </div>
          <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="font-bold text-white block mb-1">Geospatial Proximity (35%)</span>
            <p className="text-slate-400 leading-relaxed">
              Haversine great-circle distance with quadratic decay penalties. Max economic hauling radius: 150 km. Hyper-local (≤ 5 km) receives 1.0 maximum score.
            </p>
          </div>
          <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="font-bold text-white block mb-1">Volume Ratio (15%)</span>
            <p className="text-slate-400 leading-relaxed">
              Calculates ratio between monthly generation volume and receiver batch capacity: <code className="text-emerald-400">min(S, D) / max(S, D)</code>.
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-lg bg-teal-950/40 border border-teal-500/30 text-xs flex items-start gap-2.5">
          <Leaf className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
          <div className="text-teal-200">
            <span className="font-bold">Avoided Carbon Metric:</span> Standardized at <code className="font-mono font-bold text-teal-300">0.82 kg CO₂e per 1 kg</code> (0.82 MT CO₂e / MT) of industrial secondary material diverted from virgin mining, incinerator, or hazardous TSDF landfilling.
          </div>
        </div>
      </div>

      {/* 2. Zero-Leakage Privacy State Machine */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-amber-400 font-mono uppercase tracking-wider">
          <Shield className="w-4 h-4" />
          2. Zero-Leakage Privacy & Anonymization Engine
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Guarantees enterprise trade-secret protection. By default, competitors and market counterparties only inspect anonymous identifiers, chemical parameters, and jittered geographic coordinates.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold">
              <Lock className="w-4 h-4" />
              State A: Confidentiality Shield Active (Default)
            </div>
            <ul className="space-y-1 text-slate-400 list-disc list-inside text-[11px]">
              <li>Company Name: Masked as &quot;MIDC-Ambad-Unit-14&quot;</li>
              <li>GSTIN: Masked as &quot;27AABCP•••••••ZV&quot;</li>
              <li>SPCB Consent: Masked as &quot;MPCB/RO-NSK/••••/••••&quot;</li>
              <li>Map Location: Pseudo-jittered radius (+/- 1.5 km blur)</li>
              <li>Executive Contacts: Strictly hidden</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-2">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <Unlock className="w-4 h-4" />
              State B: Mutual Consent Bilateral Clearance
            </div>
            <ul className="space-y-1 text-emerald-300/90 list-disc list-inside text-[11px]">
              <li>Triggered ONLY when BOTH Generator and Offtaker approve</li>
              <li>Reveals verified legal entity names & registered addresses</li>
              <li>Unlocks full GSTIN, SPCB consent certificates, and phone contacts</li>
              <li>Permits generation of statutory CPCB Form 10 Manifest</li>
              <li>Statutory exception: SPCB State Regulators possess full audit access</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 3. CPCB Form 10 Manifest 7-Color Lifecycle */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-purple-400 font-mono uppercase tracking-wider">
          <FileCheck2 className="w-4 h-4" />
          3. CPCB Form 10 Official 7-Color Movement Manifest
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Rule 19 of the Hazardous and Other Wastes (Management and Transboundary Movement) Rules, 2016 prescribes a strictly sequenced 7-color copy tracking system:
        </p>

        <div className="space-y-2">
          {FORM_10_COPIES.map((copy) => (
            <div
              key={copy.color}
              className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-start gap-3 text-xs"
            >
              <div
                className={`w-4 h-4 rounded-full mt-0.5 flex-shrink-0 ${
                  copy.color === 'WHITE'
                    ? 'bg-white border border-slate-400'
                    : copy.color === 'YELLOW'
                    ? 'bg-amber-400'
                    : copy.color === 'PINK'
                    ? 'bg-pink-400'
                    : copy.color === 'ORANGE'
                    ? 'bg-orange-500'
                    : copy.color === 'GREEN'
                    ? 'bg-emerald-500'
                    : copy.color === 'BLUE'
                    ? 'bg-sky-400'
                    : 'bg-zinc-400'
                }`}
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white font-mono">{copy.title}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{copy.recipient_role}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {copy.regulatory_instruction}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
