'use client';

import React, { useState } from 'react';
import {
  X,
  LogIn,
  Building2,
  Factory,
  ShieldCheck,
  Scale,
  CheckCircle2,
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  Flame,
  RotateCw,
  Sparkles,
  FileText,
  BadgeCheck,
} from 'lucide-react';
import { useAuth, RegisterFacilityInput } from '@/lib/authContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'SIGN_IN' | 'REGISTER';
  onSuccessToast?: (msg: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'SIGN_IN',
  onSuccessToast,
}) => {
  const { loginWithEmail, quickLogin, registerFacility } = useAuth();
  const [activeTab, setActiveTab] = useState<'SIGN_IN' | 'REGISTER'>(defaultTab);

  // Sign In State
  const [email, setEmail] = useState<string>('operations@vatvadyechem.com');
  const [password, setPassword] = useState<string>('••••••••••••');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Register State
  const [legalName, setLegalName] = useState<string>('');
  const [corporateEmail, setCorporateEmail] = useState<string>('');
  const [clusterZone, setClusterZone] = useState<RegisterFacilityInput['clusterZone']>('GIDC Vatva Phase-III');
  const [gstin, setGstin] = useState<string>('24AAACT');
  const [gpcbConsentId, setGpcbConsentId] = useState<string>('GPCB/AHM-EAST/CCA-');
  const [facilityRole, setFacilityRole] = useState<'GENERATOR' | 'OFFTAKER'>('GENERATOR');
  const [regSubmitting, setRegSubmitting] = useState<boolean>(false);
  const [regSuccess, setRegSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!email.trim()) {
      setErrorMsg('Please enter your corporate email address.');
      return;
    }
    setIsSubmitting(true);
    try {
      const ok = await loginWithEmail(email, password);
      if (ok) {
        if (onSuccessToast) {
          onSuccessToast(`Authenticated as ${email.trim().toLowerCase()}`);
        }
        onClose();
      } else {
        setErrorMsg('Authentication failed. Please verify your credentials or choose sandbox login.');
      }
    } catch (err) {
      setErrorMsg('Unexpected error signing in. Try sandbox quick login.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickLogin = (key: 'VATVA' | 'CEMENT' | 'GPCB') => {
    quickLogin(key);
    const labels = {
      VATVA: 'Vatva Specialty Dye-Chem (Hazardous Generator)',
      CEMENT: 'Gujarat Regional Cement (Circular Offtaker)',
      GPCB: 'GPCB Regional Officer (Regulator)',
    };
    if (onSuccessToast) {
      onSuccessToast(`Authenticated via Sandbox: ${labels[key]}`);
    }
    onClose();
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!legalName.trim()) {
      setErrorMsg('Please enter your Legal Entity Name.');
      return;
    }
    if (!corporateEmail.trim() || !corporateEmail.includes('@')) {
      setErrorMsg('Please provide a valid corporate email.');
      return;
    }
    const cleanGstin = gstin.trim().toUpperCase();
    if (cleanGstin.length !== 15) {
      setErrorMsg('GSTIN must be exactly 15 alphanumeric characters (State code 24 for Gujarat).');
      return;
    }
    if (!gpcbConsentId.trim() || gpcbConsentId.trim().length < 8) {
      setErrorMsg('Please provide a valid GPCB Consent to Operate (CTO / CCA) number.');
      return;
    }

    setRegSubmitting(true);
    try {
      // Simulate statutory GPCB Registry call
      await new Promise((res) => setTimeout(res, 600));

      const newProfile = await registerFacility({
        legalName: legalName.trim(),
        corporateEmail: corporateEmail.trim(),
        clusterZone,
        gstin: cleanGstin,
        gpcbConsentId: gpcbConsentId.trim().toUpperCase(),
        role: facilityRole,
      });

      setRegSuccess(true);
      if (onSuccessToast) {
        onSuccessToast(
          `🎉 Facility "${newProfile.facilityName}" successfully onboarded with GPCB Registry ID: ${newProfile.maskedLabel}!`
        );
      }
      setTimeout(() => {
        onClose();
      }, 400);
    } catch (err) {
      setErrorMsg('Failed to complete onboarding. Please check values.');
    } finally {
      setRegSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200/90 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Top Header Banner */}
        <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-6 sm:p-7 text-white">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
            aria-label="Close Modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              GPCB Extended Green Node (XGN) Gate
            </span>
            <span className="text-slate-400 text-xs hidden sm:inline">• Rule 19 & 20 Compliant</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white font-sans">
            Industrial Facility Authentication & Onboarding
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-lg leading-relaxed">
            Secure, audit-ready authentication for chemical manufacturers, cement kilns, and GPCB regulatory officers.
          </p>

          {/* Segmented Tab Switcher */}
          <div className="flex items-center gap-2 mt-5 p-1 bg-slate-800/80 backdrop-blur-xs rounded-xl border border-slate-700/80 w-full sm:w-auto inline-flex">
            <button
              onClick={() => {
                setActiveTab('SIGN_IN');
                setErrorMsg(null);
              }}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
                activeTab === 'SIGN_IN'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('REGISTER');
                setErrorMsg(null);
              }}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
                activeTab === 'REGISTER'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Register Industrial Unit</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                Gate
              </span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 overflow-y-auto space-y-6">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* TAB A: SIGN IN */}
          {activeTab === 'SIGN_IN' && (
            <div className="space-y-6">
              {/* Form Input fields */}
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Corporate Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. operations@vatvadyechem.com"
                      required
                      className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 transition"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Use your registered plant EHS or corporate procurement email.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Facility Access Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter security token or password"
                      required
                      className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 transition font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-700 transition"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm hover:shadow transition disabled:opacity-50"
                >
                  <LogIn className="w-4 h-4 text-emerald-400" />
                  <span>{isSubmitting ? 'Verifying Facility Credentials...' : 'Access Industrial Exchange'}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </form>

              {/* Divider */}
              <div className="relative flex items-center justify-center">
                <div className="border-t border-slate-200 w-full" />
                <span className="bg-white px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider relative">
                  or one-click quick login (sandbox testing)
                </span>
              </div>

              {/* One-Click Sandbox Logins */}
              <div className="space-y-2.5">
                {/* 1. Vatva Dye-Chem */}
                <button
                  type="button"
                  onClick={() => handleQuickLogin('VATVA')}
                  className="w-full text-left p-3.5 rounded-2xl border border-rose-200 bg-rose-50/50 hover:bg-rose-50 hover:border-rose-300 transition duration-150 flex items-center justify-between group shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                      <Flame className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 group-hover:text-rose-900">
                          Vatva Specialty Dye-Chem
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                          Hazardous Generator
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        GIDC Vatva Phase-III • Spent H₂SO₄ & Gypsum Sludge (Cat 35.3)
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono font-medium text-slate-500 block">
                      GIDC-Vatva-Unit-09
                    </span>
                    <span className="text-[11px] font-bold text-rose-700 group-hover:translate-x-0.5 inline-flex items-center gap-1 transition">
                      Sign In →
                    </span>
                  </div>
                </button>

                {/* 2. Gujarat Cement */}
                <button
                  type="button"
                  onClick={() => handleQuickLogin('CEMENT')}
                  className="w-full text-left p-3.5 rounded-2xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 hover:border-emerald-300 transition duration-150 flex items-center justify-between group shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                      <RotateCw className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-900">
                          Gujarat Regional Cement
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                          Circular Offtaker
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Sanand Grinding Terminal • Cement Retarder & AFR Co-Processing
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono font-medium text-slate-500 block">
                      Sanand-Grinding-Sink-08
                    </span>
                    <span className="text-[11px] font-bold text-emerald-800 group-hover:translate-x-0.5 inline-flex items-center gap-1 transition">
                      Sign In →
                    </span>
                  </div>
                </button>

                {/* 3. GPCB Regional Officer */}
                <button
                  type="button"
                  onClick={() => handleQuickLogin('GPCB')}
                  className="w-full text-left p-3.5 rounded-2xl border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 hover:border-indigo-300 transition duration-150 flex items-center justify-between group shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                      <Scale className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-900">
                          GPCB Regional Officer
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                          Regulator
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Ahmedabad East / Vatva Office • Rule 19 & 20 Audit Bypass
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono font-medium text-slate-500 block">
                      GPCB-RO-AHM-01
                    </span>
                    <span className="text-[11px] font-bold text-indigo-700 group-hover:translate-x-0.5 inline-flex items-center gap-1 transition">
                      Sign In →
                    </span>
                  </div>
                </button>
              </div>

              {/* Footer Switcher */}
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setActiveTab('REGISTER')}
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition"
                >
                  New industrial unit in Ahmedabad? Register for the cluster registry →
                </button>
              </div>
            </div>
          )}

          {/* TAB B: REGISTER INDUSTRIAL FACILITY (ONBOARDING GATE) */}
          {activeTab === 'REGISTER' && (
            <form onSubmit={handleRegister} className="space-y-5">
              {/* Step 1: Legal Entity & Corporate Email */}
              <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[11px]">
                    1
                  </span>
                  <span>Legal Entity & Corporate Credentials</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Legal Entity Name *
                    </label>
                    <input
                      type="text"
                      value={legalName}
                      onChange={(e) => setLegalName(e.target.value)}
                      placeholder="e.g. Torrent Specialty Dyes Pvt. Ltd."
                      required
                      className="w-full bg-white border border-slate-200 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Corporate EHS Email *
                    </label>
                    <input
                      type="email"
                      value={corporateEmail}
                      onChange={(e) => setCorporateEmail(e.target.value)}
                      placeholder="e.g. ehs@torrentdyes.in"
                      required
                      className="w-full bg-white border border-slate-200 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 transition"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Industrial Estate Dropdown */}
              <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[11px]">
                    2
                  </span>
                  <span>Industrial Corridor Estate</span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Select Cluster Zone / GIDC Estate *
                  </label>
                  <select
                    value={clusterZone}
                    onChange={(e) => setClusterZone(e.target.value as RegisterFacilityInput['clusterZone'])}
                    className="w-full bg-white border border-slate-200 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 transition cursor-pointer"
                  >
                    <option value="GIDC Vatva Phase-III">GIDC Vatva Phase-III (Chemical & Dye Intermediates)</option>
                    <option value="GIDC Naroda">GIDC Naroda (Acid & Inorganic Pigments)</option>
                    <option value="GIDC Kathwada">GIDC Kathwada (Building Materials & AAC Blocks)</option>
                    <option value="Sanand / Sarkhej Corridor">Sanand / Sarkhej Corridor (Cement Grinding & Engineering)</option>
                  </select>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Pre-configures GIS coordinates and haversine freight decay formulas for your facility.
                  </p>
                </div>
              </div>

              {/* Step 3: Statutory Compliance Verification */}
              <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[11px]">
                      3
                    </span>
                    <span>Statutory Compliance Verification (GPCB / GST)</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    XGN Live Verification
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* GSTIN */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-bold text-slate-700">
                        GSTIN (15-Character) *
                      </label>
                      <span className="text-[10px] font-mono text-slate-400">
                        {gstin.length}/15
                      </span>
                    </div>
                    <input
                      type="text"
                      maxLength={15}
                      value={gstin}
                      onChange={(e) => setGstin(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                      placeholder="24AABCV5412K1ZT"
                      required
                      className="w-full bg-white border border-slate-200 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs font-mono uppercase text-slate-900 placeholder:text-slate-400 transition"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">
                      Must start with Gujarat State code <span className="font-bold text-slate-700">24</span>.
                    </p>
                  </div>

                  {/* GPCB CTO / CCA */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      GPCB Consent to Operate (CTO / CCA) *
                    </label>
                    <input
                      type="text"
                      value={gpcbConsentId}
                      onChange={(e) => setGpcbConsentId(e.target.value.toUpperCase())}
                      placeholder="GPCB/AHM-EAST/CCA-9012"
                      required
                      className="w-full bg-white border border-slate-200 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs font-mono uppercase text-slate-900 placeholder:text-slate-400 transition"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">
                      Statutory consent ID for Rule 19 manifest clearance.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 4: Facility Role Radio Buttons */}
              <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[11px]">
                    4
                  </span>
                  <span>Facility Symbiosis Role</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Radio 1: Generator */}
                  <label
                    className={`cursor-pointer p-3.5 rounded-xl border flex flex-col justify-between transition ${
                      facilityRole === 'GENERATOR'
                        ? 'bg-amber-50/70 border-amber-300 ring-1 ring-amber-400 shadow-2xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Factory className={`w-4 h-4 ${facilityRole === 'GENERATOR' ? 'text-amber-700' : 'text-slate-500'}`} />
                        <span className="text-xs font-bold text-slate-900">Waste Generator</span>
                      </div>
                      <input
                        type="radio"
                        name="facilityRole"
                        value="GENERATOR"
                        checked={facilityRole === 'GENERATOR'}
                        onChange={() => setFacilityRole('GENERATOR')}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                      Generates spent acids, sludge, chemical byproducts, or hazardous ETP residues.
                    </p>
                  </label>

                  {/* Radio 2: Offtaker */}
                  <label
                    className={`cursor-pointer p-3.5 rounded-xl border flex flex-col justify-between transition ${
                      facilityRole === 'OFFTAKER'
                        ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-400 shadow-2xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Building2 className={`w-4 h-4 ${facilityRole === 'OFFTAKER' ? 'text-emerald-700' : 'text-slate-500'}`} />
                        <span className="text-xs font-bold text-slate-900">Secondary Feedstock User</span>
                      </div>
                      <input
                        type="radio"
                        name="facilityRole"
                        value="OFFTAKER"
                        checked={facilityRole === 'OFFTAKER'}
                        onChange={() => setFacilityRole('OFFTAKER')}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                      Cement kilns, AAC block factories, brick plants, or hydrometallurgical recovery.
                    </p>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={regSubmitting || regSuccess}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition disabled:opacity-50"
              >
                <BadgeCheck className="w-4 h-4" />
                <span>
                  {regSubmitting
                    ? 'Validating with GPCB Cluster Registry...'
                    : regSuccess
                    ? 'Facility Verified & Enrolled!'
                    : 'Verify & Submit for GPCB Cluster Registry'}
                </span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setActiveTab('SIGN_IN')}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
                >
                  Already registered? Switch to Sign In →
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
