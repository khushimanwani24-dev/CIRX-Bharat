'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  Maximize,
  Minimize,
  Timer,
  FileText,
  RotateCw,
  ExternalLink,
  Shield,
  ShieldCheck,
  Scale,
  Sparkles,
  TrendingUp,
  Leaf,
  Printer,
  Layers,
  ArrowRight,
  Building2,
  Factory,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Unlock,
  MapPin,
  Cpu,
} from 'lucide-react';

interface Slide {
  id: number;
  badge: string;
  badgeColor: string;
  title: string;
  subtitle: string;
  content: React.ReactNode;
  speakerNotes: string;
}

export default function PresentationPage() {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [showNotes, setShowNotes] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const slides: Slide[] = [
    // Slide 1: Title & Hook
    {
      id: 1,
      badge: 'VBYLD Hackathon • Mission Viksit Bharat 2047',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      title: 'ReBharat (री-भारत)',
      subtitle: 'Next-Generation B2B Industrial Symbiosis & Secondary Feedstock Exchange',
      speakerNotes:
        "Respected judges, India is accelerating toward a $30 Trillion economy by 2047, where manufacturing will contribute over 25% of GDP. But Indian industrial clusters face a massive bottleneck: 62M MT of byproducts are buried in landfills yearly, while neighboring plants import the exact same raw materials. ReBharat is India's first enterprise industrial symbiosis grid that turns one factory's toxic liability into another factory's circular gold.",
      content: (
        <div className="flex flex-col items-center justify-center text-center py-8 space-y-8 max-w-4xl mx-auto">
          <div className="relative flex items-center justify-center w-24 h-24 rounded-3xl bg-emerald-600 text-white shadow-2xl shadow-emerald-600/40 ring-8 ring-emerald-500/20 animate-pulse">
            <RotateCw className="w-12 h-12 text-white animate-[spin_20s_linear_infinite]" />
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-white font-sans">
              ReBharat <span className="text-emerald-400 font-serif font-normal">(री-भारत)</span>
            </h1>
            <p className="text-xl sm:text-2xl text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed">
              Closed-Loop Secondary Feedstock Exchange & Statutory Compliance Engine for High-Density Indian Manufacturing Corridors.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full pt-4 text-left">
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md space-y-1">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Pilot Corridor</span>
              <p className="text-base font-bold text-white">Ahmedabad Industrial Belt</p>
              <p className="text-xs text-slate-400">Vatva Phase-III, Naroda & Sanand</p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md space-y-1">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">Core Innovation</span>
              <p className="text-base font-bold text-white">Zero-Leakage Privacy</p>
              <p className="text-xs text-slate-400">Trade secrets masked + spatial jitter</p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md space-y-1">
              <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">Statutory Integrity</span>
              <p className="text-base font-bold text-white">CPCB Form 10 Engine</p>
              <p className="text-xs text-slate-400">Rule 19 & 20 digital compliance</p>
            </div>
          </div>
        </div>
      ),
    },

    // Slide 2: The Core Problem
    {
      id: 2,
      badge: 'The Burning Problem in Indian Industry',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      title: 'The Indian Industrial Feedstock Crisis',
      subtitle: 'A structural linear trap bleeding MSME profits and degrading peri-urban ecosystems.',
      speakerNotes:
        'Consider the Ahmedabad Industrial Cluster: in Vatva GIDC, a specialty dye plant produces 45 tons of chemical gypsum sludge every month and pays over ₹1.35 Lakhs just to dump it in a toxic TSDF landfill. Just 28 km away in Sanand, a cement grinding terminal pays premium prices to buy mined gypsum from far away. Why haven’t they talked to each other? Because Indian industry is trapped in a linear disposal model with zero transparency.',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto py-4">
          <div className="p-6 rounded-2xl bg-rose-950/30 border border-rose-900/60 space-y-4">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm uppercase tracking-wider">
              <Factory className="w-5 h-5" />
              <span>Generator Side (Chemical MSMEs)</span>
            </div>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-start gap-2.5">
                <span className="text-rose-400 font-bold">•</span>
                <span><strong>Crippling TSDF Fees:</strong> MSMEs pay <strong>₹1,500 – ₹4,500/MT</strong> to Treatment, Storage & Disposal Facilities (TSDFs) to bury inert mineral byproducts.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-400 font-bold">•</span>
                <span><strong>62M MT Landfilled:</strong> Over 62M MT of industrial waste and 8M MT of hazardous sludge dumped into peri-urban river basins every year.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-400 font-bold">•</span>
                <span><strong>Regulatory Liability:</strong> Risk of factory sealing by GPCB/CPCB due to waste accumulation limits.</span>
              </li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-amber-950/30 border border-amber-900/60 space-y-4">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm uppercase tracking-wider">
              <Building2 className="w-5 h-5" />
              <span>Receiver Side (Cement, Smelters, Infra)</span>
            </div>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-start gap-2.5">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong>Expensive Virgin Imports:</strong> Cement kilns import costly fossil petcoke and virgin gypsum from distant desert mines.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong>Information Blindspot:</strong> Receivers have no scientific directory to verify nearby secondary assay specs within a 25 km radius.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong>Carbon Penalty:</strong> High embodied emissions from mining and hauling virgin materials across state lines.</span>
              </li>
            </ul>
          </div>
        </div>
      ),
    },

    // Slide 3: Why Existing Solutions Failed
    {
      id: 3,
      badge: 'Market Failure Analysis',
      badgeColor: 'bg-red-500/20 text-red-300 border-red-500/40',
      title: 'Why Has Nobody Solved This? (The 3 Bottlenecks)',
      subtitle: 'Factories did not fail to connect because they didn’t care—they failed because of 3 structural walls.',
      speakerNotes:
        'Factories refused to trade before because of three bottlenecks: First, commercial secrecy—no plant will openly advertise its chemical waste recipe. Second, scientific uncertainty—without automated assay validation and freight decay calculations, trucking costs exceed savings. Third, regulatory fear—moving hazardous waste without strict statutory compliance invites immediate criminal liability.',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto py-4">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">1. Trade-Secret Paranoia</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              If a plant discloses its exact waste composition publicly, competitors can reverse-engineer proprietary processes, yield rates, and production volumes.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Scale className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">2. Chemistry & Freight Mismatch</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Industrial byproducts are heavy. Beyond 100–150 km, diesel freight costs exceed the raw material savings. Pairing requires exact GCV (calorific) and pH balance.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">3. Carbon-Paper Manifest Fraud</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Statutory 7-copy Form 10 manifests (Rule 19) are printed on carbon paper. Records are lost or forged, enabling illegal midnight dumping into rivers.
            </p>
          </div>
        </div>
      ),
    },

    // Slide 4: ReBharat Solution Architecture
    {
      id: 4,
      badge: 'The Solution Architecture',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      title: 'ReBharat 4-Layer Operational Stack',
      subtitle: 'Deterministic, zero-leakage, and legally compliant by-design industrial digital twin.',
      speakerNotes:
        'ReBharat is built on a 4-layer architecture: Layer 1 is the Reactive Ledger that ingests lab assays; Layer 2 is the Deterministic Matching Engine running mathematical optimization; Layer 3 is the Zero-Leakage Privacy Engine providing spatial coordinate blurring and bilateral handshakes; and Layer 4 is the Statutory Compliance Engine managing CPCB Form 10 and Form 4 returns.',
      content: (
        <div className="space-y-3 max-w-4xl mx-auto py-2">
          <div className="p-4 rounded-xl bg-slate-900/90 border border-indigo-500/30 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-indigo-500/20 text-indigo-400 font-bold text-sm">Layer 4</div>
            <div>
              <h4 className="text-sm font-bold text-white">Statutory CPCB Form 10 & Compliance Engine (`/lib/manifestEngine.ts`)</h4>
              <p className="text-xs text-slate-400">Automates 7-color slip chain-of-custody tracking & one-click physical `@media print` formatting.</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/90 border border-teal-500/30 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-teal-500/20 text-teal-400 font-bold text-sm">Layer 3</div>
            <div>
              <h4 className="text-sm font-bold text-white">Zero-Leakage Privacy & Anonymization Engine (`/lib/anonymizer.ts`)</h4>
              <p className="text-xs text-slate-400">Masks GSTINs and plant names; applies deterministic ±1.5 km GIS spatial blur until mutual consent handshake.</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/30 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-sm">Layer 2</div>
            <div>
              <h4 className="text-sm font-bold text-white">Deterministic Matching Engine (`/lib/matchingEngine.ts`)</h4>
              <p className="text-xs text-slate-400">Scoring: 50% Chemical Compatibility + 35% Haversine Proximity + 15% Volumetric Balancing Ratio.</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-slate-800 text-slate-300 font-bold text-sm">Layer 1</div>
            <div>
              <h4 className="text-sm font-bold text-white">Industrial Ledger & Data Foundation (`/lib/store.ts`)</h4>
              <p className="text-xs text-slate-400">Certified laboratory assay ingestion: pH, Gross Calorific Value (GCV kcal/kg), moisture %, and heavy metals.</p>
            </div>
          </div>
        </div>
      ),
    },

    // Slide 5: The Math & Matching Engine
    {
      id: 5,
      badge: 'Core Algorithmic Innovation',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      title: 'Deterministic Matching Engine & Mathematical Model',
      subtitle: 'Eliminating subjective guesswork through transparent, multi-parametric feasibility scoring.',
      speakerNotes:
        'We do not rely on probabilistic AI hallucinations for hazardous waste. ReBharat runs a deterministic formula: 50% Chemical Compatibility validating CPCB schedule codes, pH neutralization windows, and cement kiln AFR thresholds of GCV >= 2500 kcal/kg; 35% Haversine geospatial proximity with a non-linear decay penalty and 150 km cutoff; and 15% batch volume fit.',
      content: (
        <div className="space-y-4 max-w-4xl mx-auto py-2">
          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center font-mono text-sm sm:text-base text-emerald-300 font-bold shadow-lg">
            CompositeScore = (0.50 × ChemScore + 0.35 × DistScore + 0.15 × VolRatio) × 100
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <span className="font-bold text-emerald-400 uppercase tracking-wider block">1. Chemical (50%)</span>
              <p className="text-slate-300 leading-relaxed">
                Evaluates CPCB schedules, ΔpH windows (±1.5 ideal), and Alternative Fuel & Raw Material (AFR) threshold: <code className="text-emerald-300">GCV ≥ 2,500 kcal/kg</code> for cement kilns.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <span className="font-bold text-emerald-400 uppercase tracking-wider block">2. Haversine Distance (35%)</span>
              <p className="text-slate-300 leading-relaxed">
                Calculates great-circle distance with quadratic decay penalties. <code className="text-emerald-300">d ≤ 5 km: 1.0</code>, with a hard economic viability cutoff at <code className="text-emerald-300">d &gt; 150 km: 0.0</code>.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <span className="font-bold text-emerald-400 uppercase tracking-wider block">3. Volume Ratio (15%)</span>
              <p className="text-slate-300 leading-relaxed">
                Balances monthly generation volume with offtaker batch throughput: <code className="text-emerald-300">min(S, D) / max(S, D)</code> to eliminate plant accumulation backlogs.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-teal-950/40 border border-teal-500/30 text-xs text-teal-300 flex items-center gap-3">
            <Leaf className="w-5 h-5 flex-shrink-0 text-teal-400" />
            <span>
              <strong>Avoided Carbon Factor:</strong> Standardized at <strong>0.82 MT CO₂e per 1 MT</strong> of secondary industrial feedstock diverted from virgin mining or TSDF landfilling.
            </span>
          </div>
        </div>
      ),
    },

    // Slide 6: Zero-Leakage Privacy Engine
    {
      id: 6,
      badge: 'Privacy & Commercial Trust',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      title: 'Zero-Leakage Privacy Engine & Bilateral Handshake',
      subtitle: 'Guarantees commercial secrecy while providing continuous unmasked audit bypass for regulators.',
      speakerNotes:
        'To overcome the commercial secrecy barrier, counterparties browse under pseudonyms like GIDC-Vatva-Unit-09. Coordinates on the public map are shifted by a deterministic 1.5 km hash blur. Only when both parties click mutual consent are legal identities revealed. Crucially, GPCB environmental officers have an automatic audit bypass to see all unmasked records continuously.',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto py-2">
          <div className="p-5 rounded-2xl bg-amber-950/30 border border-amber-500/40 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
              <Lock className="w-4 h-4" />
              <span>State A: Confidentiality Shield Active (Default)</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>• <strong>Entity Masking:</strong> Displayed as pseudonymous ID (e.g., <code className="text-amber-300">GIDC-Vatva-Unit-09</code>)</li>
              <li>• <strong>GSTIN & Consent Masking:</strong> Redacted as <code className="text-amber-300">24AABCV•••••••ZT</code></li>
              <li>• <strong>Spatial Coordinate Jitter:</strong> Deterministic ±1.5 km blur on GIS map</li>
              <li>• <strong>Contacts Locked:</strong> Executive phone and emails completely hidden</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
              <Unlock className="w-4 h-4" />
              <span>State B: Mutual Consent Bilateral Clearance</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>• <strong>Two-Party Handshake:</strong> Triggered ONLY when BOTH Generator & Offtaker authorize</li>
              <li>• <strong>Full Legal Unmasking:</strong> Registered company name & GSTIN revealed</li>
              <li>• <strong>Manifest Creation Unlocked:</strong> Authorizes generation of CPCB Form 10</li>
              <li>• <strong>Regulator Bypass:</strong> Verified GPCB inspectors always see full unmasked data</li>
            </ul>
          </div>
        </div>
      ),
    },

    // Slide 7: CPCB Form 10 Manifests
    {
      id: 7,
      badge: 'Statutory Environmental Compliance',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
      title: 'CPCB Form 10 & Form 4 Statutory Engine',
      subtitle: 'Eliminating carbon-paper forgery with digitized 7-color slip chain-of-custody tracking.',
      speakerNotes:
        'We bridge digital software with real-world law. Under Rule 19 of the Hazardous Waste Rules 2016, shipments require a 7-copy Form 10 manifest. ReBharat tracks all seven statutory copies from dispatch to delivery, with print-ready government formatting. For annual compliance, ReBharat auto-compiles the Rule 20 Form 4 return for instant GPCB XGN filing.',
      content: (
        <div className="space-y-4 max-w-4xl mx-auto py-2">
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
              Rule 19 Statutory 7-Color Slip Lifecycle:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-2 text-[11px] font-bold text-center">
              <div className="p-2 rounded-lg bg-white text-slate-900 border">Copy 1: White (Sender)</div>
              <div className="p-2 rounded-lg bg-amber-300 text-amber-950">Copy 2: Yellow (Driver)</div>
              <div className="p-2 rounded-lg bg-pink-300 text-pink-950">Copy 3: Pink (Receiver)</div>
              <div className="p-2 rounded-lg bg-orange-400 text-orange-950">Copy 4: Orange (SPCB)</div>
              <div className="p-2 rounded-lg bg-emerald-400 text-emerald-950">Copy 5: Green (Rec SPCB)</div>
              <div className="p-2 rounded-lg bg-blue-400 text-blue-950">Copy 6: Blue (Return)</div>
              <div className="p-2 rounded-lg bg-slate-400 text-slate-950">Copy 7: Grey (Audit)</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Printer className="w-4 h-4 text-emerald-400" />
                Single-Click `@media print` Formatting
              </span>
              <p className="text-slate-400">
                Official Indian statutory layout with driver endorsement, vehicle registration, and hazardous classification codes ready for physical dispatch.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <span className="font-bold text-white flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-purple-400" />
                Rule 20(1) Form 4 Annual Returns
              </span>
              <p className="text-slate-400">
                Auto-aggregated annual hazardous waste balances (recycled vs. co-processed vs. landfilled) for one-click compliance filing on GPCB XGN portal.
              </p>
            </div>
          </div>
        </div>
      ),
    },

    // Slide 8: Live Case Study (Vatva to Sanand)
    {
      id: 8,
      badge: 'Flagship Deployment Case Study',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      title: 'Flagship Deployment: Vatva to Sanand Corridor',
      subtitle: 'Real-world bilateral symbiosis between chemical dye-intermediate and cement grinding plants.',
      speakerNotes:
        'Here is our flagship deployment in Gujarat: Vatva Specialty Dye-Chem produces 45 MT/month of neutralized gypsum sludge. Gujarat Regional Cement in Sanand needs 50 MT/month as a retarder. Distance is 28.4 km. Match score is 94%. Vatva saves ₹54,000 in tipping fees, the cement plant saves ₹1,08,000 in virgin gypsum procurement, and 36.9 tons of CO2 is saved every month!',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto py-2">
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-rose-500/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">Generator</span>
              <span className="font-mono text-xs text-slate-400">GIDC-Vatva-Unit-09</span>
            </div>
            <h4 className="text-base font-bold text-white">Vatva Specialty Dye-Chem</h4>
            <div className="text-xs space-y-1 text-slate-300">
              <p>• Byproduct: Neutralized Gypsum Sludge</p>
              <p>• Volume: 45 MT / month</p>
              <p>• Assay: CaSO₄·2H₂O 82.4%, pH 6.8</p>
              <p>• Avoided TSDF Fee: ₹1,200 / MT</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/60 flex flex-col justify-between text-center space-y-3">
            <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs mx-auto">
              <Sparkles className="w-3.5 h-3.5" />
              94% Feasibility Score
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-black text-white">28.4 km</div>
              <div className="text-xs text-slate-400">Haversine Distance (Vatva → Sanand)</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1">
              <span className="text-emerald-400 font-bold">Total Net Savings:</span>
              <p className="text-white font-mono text-base font-bold">₹1,62,000 / month</p>
              <p className="text-[11px] text-teal-400 font-medium">36.9 MT CO₂e Avoided / month</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/90 border border-cyan-500/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Offtaker</span>
              <span className="font-mono text-xs text-slate-400">Sanand-Grinding-Sink-08</span>
            </div>
            <h4 className="text-base font-bold text-white">Gujarat Regional Cement</h4>
            <div className="text-xs space-y-1 text-slate-300">
              <p>• Intake: Mineral Cement Retarder</p>
              <p>• Capacity: 50 MT / month</p>
              <p>• Virgin Gypsum Cost: ₹4,500 / MT</p>
              <p>• Procure Price: Negative/Zero Cost</p>
            </div>
          </div>
        </div>
      ),
    },

    // Slide 9: Impact & National Scalability
    {
      id: 9,
      badge: 'Economic & Environmental Telemetry',
      badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
      title: 'Scalability Across 1,200+ Indian Industrial Clusters',
      subtitle: 'From local GIDC Ahmedabad estates to national circular supply chains.',
      speakerNotes:
        'In our Ahmedabad pilot across just 2 active symbioses, we divert 90 MT/month, save ₹1.62 Lakhs/month, and cut 73.8 MT of carbon emissions. When scaled across India’s 1,200 industrial estates in Gujarat GIDC, Maharashtra MIDC, and Tamil Nadu SIPCOT, ReBharat unlocks an ₹1,800 Crore circular economy arbitrage and diverts 12M MT of industrial waste yearly.',
      content: (
        <div className="space-y-6 max-w-4xl mx-auto py-2">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Monthly Diverted</span>
              <div className="text-3xl font-extrabold text-emerald-400">90 MT</div>
              <span className="text-[10px] text-slate-500">100% Landfill Avoidance</span>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Monthly Arbitrage</span>
              <div className="text-3xl font-extrabold text-amber-400">₹1.62 L</div>
              <span className="text-[10px] text-slate-500">Tipping + Virgin Offset</span>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Avoided CO₂e</span>
              <div className="text-3xl font-extrabold text-teal-400">73.8 MT</div>
              <span className="text-[10px] text-slate-500">0.82 MT / MT secondary</span>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Pairs</span>
              <div className="text-3xl font-extrabold text-indigo-400">2 Pairs</div>
              <span className="text-[10px] text-slate-500">Vatva & Naroda pilot</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/90 border border-emerald-500/30 space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              National Scale Potential (Viksit Bharat 2047 Opportunity):
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <strong className="text-white block mb-1">1,200+ Clusters</strong>
                <span>Expandable across Gujarat GIDC, Maharashtra MIDC, and Tamil Nadu SIPCOT estates.</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <strong className="text-white block mb-1">₹1,800+ Crores</strong>
                <span>Estimated annual tipping fee savings and raw material replacement value for MSMEs.</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <strong className="text-white block mb-1">12M+ MT / Year</strong>
                <span>Potential diversion of high-calorific sludges and mineral gypsum away from landfills.</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },

    // Slide 10: Vision 2047 & Conclusion
    {
      id: 10,
      badge: 'Vision 2047 & Conclusion',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      title: 'Powering a Circular, Self-Reliant India',
      subtitle: 'From linear waste dumping to national resource sovereignty.',
      speakerNotes:
        'As India strides toward Viksit Bharat 2047, we cannot build a $30 Trillion manufacturing powerhouse on a 19th-century linear landfill model. ReBharat empowers India’s 63 million MSMEs with the trust, chemistry, and compliance tools to build a zero-leakage, circular, and self-reliant nation. Thank you, and we welcome your questions!',
      content: (
        <div className="flex flex-col items-center justify-center text-center py-6 space-y-8 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full text-left">
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-emerald-500/30 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Atmanirbhar Bharat</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Replaces imported fossil petcoke and virgin mined rock with domestic industrial secondary feedstocks.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-teal-500/30 space-y-2">
              <div className="flex items-center gap-2 text-teal-400 font-bold text-xs uppercase tracking-wider">
                <Leaf className="w-4 h-4" />
                <span>Zero Effect, Zero Defect (ZED)</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Prevents midnight dumping into river basins and achieves 100% CPCB/SPCB statutory audit trail.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-amber-500/30 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                <TrendingUp className="w-4 h-4" />
                <span>MSME Competitiveness</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Transforms crippling waste disposal liability into negative-cost circular input procurement.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-amber-950/40 border border-slate-700 max-w-2xl w-full">
            <p className="text-base sm:text-lg font-bold text-white leading-relaxed">
              &quot;ReBharat is not just an application; it is the digital circulatory system for an industrialized, ecologically sovereign Viksit Bharat 2047.&quot;
            </p>
            <div className="pt-3 text-xs text-emerald-400 font-semibold">
              Thank You! Ready for Demonstration & Judges Q&A.
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg transition"
            >
              <span>Launch Live Prototype App (localhost:3000)</span>
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ),
    },
  ];

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev < slides.length - 1 ? prev + 1 : prev));
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'n' || e.key === 'N') {
        setShowNotes((prev) => !prev);
      } else if (e.key === 'f' || e.key === 'F') {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
          setIsFullscreen(true);
        } else {
          document.exitFullscreen().catch(() => {});
          setIsFullscreen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  const active = slides[currentSlide];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-slate-950 font-sans">
      {/* Top Bar: Progress, Brand, Timer & Controls */}
      <header className="no-print sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition"
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <RotateCw className="w-3.5 h-3.5" />
            </div>
            <span className="hidden sm:inline">Exit to ReBharat App</span>
          </Link>
          <span className="text-slate-600">|</span>
          <span className="text-xs font-semibold text-slate-300">
            Slide <span className="text-white font-mono">{currentSlide + 1}</span> of{' '}
            <span className="font-mono text-slate-400">{slides.length}</span>
          </span>
        </div>

        {/* Center Progress Bar */}
        <div className="hidden md:flex items-center gap-1.5 max-w-xs w-full">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1.5 flex-1 rounded-full transition-all duration-200 ${
                idx === currentSlide
                  ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50'
                  : idx < currentSlide
                  ? 'bg-emerald-800'
                  : 'bg-slate-800 hover:bg-slate-700'
              }`}
              title={`Jump to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Right Controls: Timer + Speaker Notes + Fullscreen + Print */}
        <div className="flex items-center gap-2">
          {/* Timer */}
          <div
            onClick={() => setIsTimerRunning((prev) => !prev)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono font-medium text-slate-300 cursor-pointer hover:border-slate-700 transition"
            title="Click to pause/resume timer"
          >
            <Timer className={`w-3.5 h-3.5 ${isTimerRunning ? 'text-emerald-400' : 'text-amber-400'}`} />
            <span>{formatTime(secondsElapsed)}</span>
          </div>

          {/* Speaker Notes Toggle */}
          <button
            onClick={() => setShowNotes((prev) => !prev)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition ${
              showNotes
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
            }`}
            title="Toggle Speaker Script Notes (Key: N)"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Notes</span>
          </button>

          {/* Print / Export to PDF */}
          <button
            onClick={() => window.print()}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition"
            title="Export deck to PDF (Print)"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={() => {
              if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(() => {});
                setIsFullscreen(true);
              } else {
                document.exitFullscreen().catch(() => {});
                setIsFullscreen(false);
              }
            }}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition"
            title="Fullscreen Mode (Key: F)"
          >
            {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
          </button>
        </div>
      </header>

      {/* Main Slide Presentation Stage */}
      <main className="flex-1 flex flex-col justify-center px-4 sm:px-8 py-6 max-w-6xl mx-auto w-full">
        {/* Slide Header */}
        <div className="mb-6 space-y-2">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${active.badgeColor}`}
            >
              <Sparkles className="w-3 h-3" />
              {active.badge}
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            {active.title}
          </h2>

          <p className="text-xs sm:text-sm text-slate-400 font-medium">
            {active.subtitle}
          </p>
        </div>

        {/* Slide Core Body */}
        <div className="flex-1 flex flex-col justify-center">
          {active.content}
        </div>
      </main>

      {/* Speaker Notes Overlay Drawer */}
      {showNotes && (
        <div className="no-print fixed bottom-16 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-50 bg-slate-900 border border-amber-500/50 rounded-2xl shadow-2xl p-4 text-xs space-y-2 animate-slide-up">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-1.5 font-bold text-amber-300">
              <FileText className="w-4 h-4" />
              <span>Speaker Script (Slide {active.id})</span>
            </div>
            <button
              onClick={() => setShowNotes(false)}
              className="text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          <p className="text-slate-200 leading-relaxed font-sans max-h-48 overflow-y-auto">
            {active.speakerNotes}
          </p>
          <div className="text-[10px] text-slate-500 font-mono pt-1">
            Tip: Press &quot;N&quot; on keyboard to toggle this drawer anytime.
          </div>
        </div>
      )}

      {/* Bottom Navigation Toolbar */}
      <footer className="no-print sticky bottom-0 z-40 bg-slate-950/80 backdrop-blur-md border-t border-slate-800/80 px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Previous Button */}
        <button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 disabled:opacity-30 disabled:pointer-events-none text-xs font-semibold text-slate-200 transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        {/* Slide Dots / Thumbnails */}
        <div className="flex items-center gap-1">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentSlide(idx)}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === currentSlide ? 'w-6 bg-emerald-500' : 'bg-slate-700 hover:bg-slate-600'
              }`}
              title={`Slide ${idx + 1}: ${s.title}`}
            />
          ))}
        </div>

        {/* Next / Live Demo Button */}
        {currentSlide === slides.length - 1 ? (
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition"
          >
            <span>Launch Live App</span>
            <ExternalLink className="w-4 h-4" />
          </Link>
        ) : (
          <button
            onClick={nextSlide}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition"
          >
            <span>Next Slide</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </footer>
    </div>
  );
}
