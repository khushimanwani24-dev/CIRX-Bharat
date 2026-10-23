'use client';

import React, { useState } from 'react';
import {
  Layers,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  FileText,
  FlaskConical,
  Flame,
  Droplets,
  Scale,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { Facility, MaterialStream, PhysicalState, StreamType } from '@/types';
import { formatINR, formatNumber } from '@/lib/utils';
import { UserRole } from './Header';

interface StreamIngestionPortalProps {
  facilities: Facility[];
  onStreamCreated: (newStream: any) => Promise<void>;
  activeRole: UserRole;
  onNavigateToMatches: () => void;
}

export const StreamIngestionPortal: React.FC<StreamIngestionPortalProps> = ({
  facilities,
  onStreamCreated,
  activeRole,
  onNavigateToMatches,
}) => {
  // Select initial facility based on active role
  const defaultFacilityId =
    activeRole === 'GEN_PRECISION'
      ? 'fac-gen-01'
      : activeRole === 'GEN_AUTO'
      ? 'fac-gen-02'
      : activeRole === 'OFF_CEMENT'
      ? 'fac-off-02'
      : activeRole === 'OFF_SAHYADRI'
      ? 'fac-off-01'
      : facilities[0]?.id || 'fac-gen-01';

  const [streamType, setStreamType] = useState<StreamType>('SUPPLY');
  const [facilityId, setFacilityId] = useState<string>(defaultFacilityId);
  const [materialName, setMaterialName] = useState<string>('');
  const [cpcbCode, setCpcbCode] = useState<string>('Schedule I, Cat 35.3');
  const [physicalState, setPhysicalState] = useState<PhysicalState>('LIQUID');
  const [monthlyVolumeMt, setMonthlyVolumeMt] = useState<number>(20);
  const [phLevel, setPhLevel] = useState<number>(2.0);
  const [hasPh, setHasPh] = useState<boolean>(true);
  const [calorificValue, setCalorificValue] = useState<number>(0);
  const [moisturePercent, setMoisturePercent] = useState<number>(85);
  const [isHazardous, setIsHazardous] = useState<boolean>(true);
  const [pricePerMt, setPricePerMt] = useState<number>(-3500);
  const [assaySummary, setAssaySummary] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Quick preset loader
  const applyPreset = (preset: {
    type: StreamType;
    name: string;
    code: string;
    state: PhysicalState;
    volume: number;
    ph: number;
    cal: number;
    moist: number;
    haz: boolean;
    price: number;
    desc: string;
  }) => {
    setStreamType(preset.type);
    setMaterialName(preset.name);
    setCpcbCode(preset.code);
    setPhysicalState(preset.state);
    setMonthlyVolumeMt(preset.volume);
    setPhLevel(preset.ph);
    setHasPh(preset.ph !== 0);
    setCalorificValue(preset.cal);
    setMoisturePercent(preset.moist);
    setIsHazardous(preset.haz);
    setPricePerMt(preset.price);
    setAssaySummary(preset.desc);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!materialName.trim()) return;

    setIsSubmitting(true);
    setSuccessMessage(null);

    try {
      await onStreamCreated({
        facility_id: facilityId,
        stream_type: streamType,
        cpcb_waste_code: cpcbCode,
        material_name: materialName,
        physical_state: physicalState,
        monthly_volume_mt: Number(monthlyVolumeMt),
        ph_level: hasPh ? Number(phLevel) : undefined,
        calorific_value_kcal: calorificValue > 0 ? Number(calorificValue) : undefined,
        moisture_percent: Number(moisturePercent),
        is_hazardous: isHazardous,
        price_per_mt: Number(pricePerMt),
        chemical_assay_summary: assaySummary || 'Certified industrial lab assay report on record',
      });

      setSuccessMessage(`Stream "${materialName}" successfully registered. Deterministic matching engine triggered!`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const estimatedAvoidedCo2 = Math.round(monthlyVolumeMt * 0.82 * 10) / 10;
  const currentFac = facilities.find((f) => f.id === facilityId);

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white font-mono flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-400" />
              Stream Ingestion & Assay Portal
            </h2>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              CPCB Schedule I / II Ingestion
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Register industrial byproduct streams or feedstock procurement mandates with verified chemical assay parameters.
          </p>
        </div>

        <button
          type="button"
          onClick={onNavigateToMatches}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-md transition self-start sm:self-auto"
        >
          View Live Matches
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Quick Ingestion Presets */}
      <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800">
        <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Load Standard Industrial Template (Nashik Corridor Common Streams):
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          <button
            type="button"
            onClick={() =>
              applyPreset({
                type: 'SUPPLY',
                name: 'Spent Hexavalent Chromium Rinse Solution',
                code: 'Schedule I, Cat 35.3',
                state: 'LIQUID',
                volume: 18,
                ph: 1.5,
                cal: 0,
                moist: 92,
                haz: true,
                price: -4200,
                desc: 'Cr(VI): 2,850 ppm, H2SO4: 3.8%, Specific Gravity: 1.12',
              })
            }
            className="p-2.5 rounded-lg bg-slate-950/80 hover:bg-slate-900 border border-rose-500/30 text-left transition text-xs group"
          >
            <div className="font-semibold text-rose-300 group-hover:text-rose-200">
              Acidic Chromium Effluent
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-0.5">Cat 35.3 • pH 1.5 • 18 MT</div>
          </button>

          <button
            type="button"
            onClick={() =>
              applyPreset({
                type: 'SUPPLY',
                name: 'Automotive Primer & Enamel Sludge',
                code: 'Cat 21.1',
                state: 'SLUDGE',
                volume: 30,
                ph: 6.9,
                cal: 3400,
                moist: 26,
                haz: true,
                price: -2900,
                desc: 'High calorific (3,400 kcal/kg), volatiles 32%, kiln co-processing compliant',
              })
            }
            className="p-2.5 rounded-lg bg-slate-950/80 hover:bg-slate-900 border border-amber-500/30 text-left transition text-xs group"
          >
            <div className="font-semibold text-amber-300 group-hover:text-amber-200">
              Automotive Paint Sludge
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-0.5">Cat 21.1 • 3400 kcal • 30 MT</div>
          </button>

          <button
            type="button"
            onClick={() =>
              applyPreset({
                type: 'SUPPLY',
                name: 'Granulated Blast Furnace Slag (GGBS Grade)',
                code: 'Schedule II-B (Non-Haz)',
                state: 'SOLID',
                volume: 140,
                ph: 8.2,
                cal: 0,
                moist: 5,
                haz: false,
                price: 700,
                desc: 'CaO: 42%, SiO2: 35%, Al2O3: 14%, Glass content 94%',
              })
            }
            className="p-2.5 rounded-lg bg-slate-950/80 hover:bg-slate-900 border border-emerald-500/30 text-left transition text-xs group"
          >
            <div className="font-semibold text-emerald-300 group-hover:text-emerald-200">
              Blast Furnace Slag
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-0.5">Schedule II-B • 140 MT • ₹700/MT</div>
          </button>

          <button
            type="button"
            onClick={() =>
              applyPreset({
                type: 'DEMAND',
                name: 'Alternative Fuels & Raw Materials for Precalciner',
                code: 'Cat 21.1 / Solvents',
                state: 'SLUDGE',
                volume: 80,
                ph: 7.0,
                cal: 2600,
                moist: 30,
                haz: true,
                price: 0,
                desc: 'Accepting paint sludge & heavy organic residues for high-temperature cement co-processing',
              })
            }
            className="p-2.5 rounded-lg bg-slate-950/80 hover:bg-slate-900 border border-cyan-500/30 text-left transition text-xs group"
          >
            <div className="font-semibold text-cyan-300 group-hover:text-cyan-200">
              Cement Kiln Demand (AFR)
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-0.5">Offtake Demand • 80 MT/mo</div>
          </button>
        </div>
      </div>

      {/* Main Ingestion Form */}
      <form onSubmit={handleSubmit} className="p-6 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-6">
        {successMessage && (
          <div className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-500/50 flex items-center justify-between text-emerald-200 text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
            <button
              type="button"
              onClick={onNavigateToMatches}
              className="underline font-bold text-white hover:text-emerald-300 ml-4 whitespace-nowrap"
            >
              Go to Matchboard →
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Stream Type (Supply vs Demand) */}
          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2">
              1. Exchange Intent (Stream Type)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setStreamType('SUPPLY')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition ${
                  streamType === 'SUPPLY'
                    ? 'bg-amber-950/60 border-amber-500 text-amber-200 shadow-sm'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                SUPPLY (Generator Byproduct)
              </button>
              <button
                type="button"
                onClick={() => setStreamType('DEMAND')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition ${
                  streamType === 'DEMAND'
                    ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200 shadow-sm'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                DEMAND (Offtaker Feedstock)
              </button>
            </div>
          </div>

          {/* Facility Selector */}
          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2">
              2. Facility Ownership
            </label>
            <select
              value={facilityId}
              onChange={(e) => setFacilityId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
            >
              {facilities.map((fac) => (
                <option key={fac.id} value={fac.id}>
                  {fac.legal_name} ({fac.anonymous_label} - {fac.cluster_zone})
                </option>
              ))}
            </select>
            {currentFac && (
              <div className="text-[11px] text-slate-400 mt-1 font-mono">
                Consent: {currentFac.spcb_consent_id} • Cluster: {currentFac.cluster_zone}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Material Name */}
          <div className="md:col-span-2">
            <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2">
              3. Commercial Material Name
            </label>
            <input
              type="text"
              required
              value={materialName}
              onChange={(e) => setMaterialName(e.target.value)}
              placeholder="e.g. Acidic Chromium Effluent, Paint Sludge, Foundry Slag"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* CPCB Category Code */}
          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2">
              4. CPCB Category Code
            </label>
            <input
              type="text"
              required
              value={cpcbCode}
              onChange={(e) => setCpcbCode(e.target.value)}
              placeholder="e.g. Schedule I, Cat 35.3 or Cat 21.1"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Physical State */}
          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2">
              5. Physical State
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['LIQUID', 'SLUDGE', 'SOLID'] as PhysicalState[]).map((state) => (
                <button
                  key={state}
                  type="button"
                  onClick={() => setPhysicalState(state)}
                  className={`py-2 rounded-lg border text-xs font-mono font-medium transition ${
                    physicalState === state
                      ? 'bg-slate-800 border-emerald-500 text-emerald-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {state}
                </button>
              ))}
            </div>
          </div>

          {/* Monthly Volume */}
          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2">
              6. Monthly Volume (Metric Tonnes)
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                max="5000"
                value={monthlyVolumeMt}
                onChange={(e) => setMonthlyVolumeMt(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
              />
              <span className="absolute right-3 top-2 text-xs text-slate-500 font-mono">MT/mo</span>
            </div>
            <div className="text-[11px] text-teal-400 mt-1 font-mono flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Est. Avoided Carbon: ~{estimatedAvoidedCo2} MT CO₂e/mo
            </div>
          </div>

          {/* Pricing Model */}
          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2">
              7. Price / Gate Fee (₹ / MT)
            </label>
            <div className="relative">
              <input
                type="number"
                value={pricePerMt}
                onChange={(e) => setPricePerMt(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
              />
              <span className="absolute right-3 top-2 text-xs text-slate-500 font-mono">₹/MT</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              {pricePerMt < 0
                ? 'Negative value = Generator pays tipping fee (cost savings if offtaken)'
                : 'Positive value = Feedstock sale revenue'}
            </div>
          </div>
        </div>

        {/* Chemical Assay & Lab Parameters Panel */}
        <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <FlaskConical className="w-4 h-4 text-emerald-400" />
              Chemical Assay Parameters
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              Evaluated by Matching Engine (0.50 Weight)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* pH Level */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs text-slate-300 font-medium">pH Level</label>
                <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                  phLevel < 4
                    ? 'bg-rose-950 text-rose-300 border border-rose-500/30'
                    : phLevel > 9
                    ? 'bg-blue-950 text-blue-300 border border-blue-500/30'
                    : 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                }`}>
                  pH {phLevel.toFixed(1)} {phLevel < 4 ? '(Strong Acid)' : phLevel > 9 ? '(Alkaline)' : '(Neutral)'}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="14"
                step="0.1"
                value={phLevel}
                onChange={(e) => setPhLevel(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>0 (Acid)</span>
                <span>7 (Neutral)</span>
                <span>14 (Alkali)</span>
              </div>
            </div>

            {/* Calorific Value */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs text-slate-300 font-medium flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-orange-400" />
                  Calorific Value (GCV)
                </label>
                <span className="text-xs font-mono text-orange-300 font-bold">
                  {calorificValue} kcal/kg
                </span>
              </div>
              <input
                type="number"
                min="0"
                max="10000"
                step="50"
                value={calorificValue}
                onChange={(e) => setCalorificValue(Number(e.target.value))}
                placeholder="e.g. 3200 for paint sludge"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
              />
              <div className="text-[10px] text-slate-400 mt-1">
                {calorificValue >= 2500 ? (
                  <span className="text-emerald-400 font-semibold">✓ Meets cement kiln co-processing threshold</span>
                ) : (
                  <span>Threshold for kiln AFR is ≥ 2,500 kcal/kg</span>
                )}
              </div>
            </div>

            {/* Moisture Percent */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs text-slate-300 font-medium flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                  Moisture Content
                </label>
                <span className="text-xs font-mono text-cyan-300 font-bold">
                  {moisturePercent}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={moisturePercent}
                onChange={(e) => setMoisturePercent(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
              <div className="text-[10px] text-slate-400 mt-1">
                {moisturePercent > 70 ? 'High moisture suitable for wet digester' : 'Dry solid/sludge profile'}
              </div>
            </div>
          </div>

          {/* Assay Summary Text */}
          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
              Certified Laboratory Assay Breakdown (Spectroscopy / Chromatography)
            </label>
            <input
              type="text"
              value={assaySummary}
              onChange={(e) => setAssaySummary(e.target.value)}
              placeholder="e.g. Hexavalent Cr: 3,420 ppm, Free H2SO4: 4.2%, Ash: 24%, Heavy Metals < 50 ppm"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
            />
          </div>
        </div>

        {/* Hazard Classification Checkbox */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-3">
          <input
            type="checkbox"
            id="hazardous-toggle"
            checked={isHazardous}
            onChange={(e) => setIsHazardous(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-slate-700 text-rose-600 focus:ring-rose-500 accent-rose-500 cursor-pointer"
          />
          <div className="text-xs">
            <label htmlFor="hazardous-toggle" className="font-bold text-white cursor-pointer flex items-center gap-1.5">
              <AlertTriangle className={`w-4 h-4 ${isHazardous ? 'text-rose-400' : 'text-slate-500'}`} />
              Classify as CPCB Hazardous Waste (Rule 19 Mandate)
            </label>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Requires Form 10 7-copy movement manifest, GPS-enabled authorized carrier, and SPCB prior consent. ReBharat will automatically enforce regulatory containment protocols.
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/50 transition disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Calculating Pairwise Feasibility...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Register Stream & Run Matching Engine
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
