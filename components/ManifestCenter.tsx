'use client';

import React, { useState } from 'react';
import {
  FileCheck2,
  Printer,
  Truck,
  ShieldCheck,
  AlertTriangle,
  Building,
  CheckCircle2,
  Clock,
  Layers,
  Search,
  ExternalLink,
  MapPin,
  Calendar,
} from 'lucide-react';
import { Form10Manifest, ManifestStatus, ManifestCopyColor } from '@/types';
import { COPY_COLOR_THEMES } from '@/lib/manifestEngine';
import { UserRole } from './Header';

interface ManifestCenterProps {
  manifests: Form10Manifest[];
  onOpenManifestModal: (manifest: Form10Manifest) => void;
  onUpdateStatus: (manifestId: string, status: ManifestStatus, currentCopy?: ManifestCopyColor) => Promise<void>;
  activeRole: UserRole;
}

export const ManifestCenter: React.FC<ManifestCenterProps> = ({
  manifests,
  onOpenManifestModal,
  onUpdateStatus,
  activeRole,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const filtered = manifests.filter((m) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      m.manifest_number.toLowerCase().includes(term) ||
      m.material_name.toLowerCase().includes(term) ||
      m.vehicle_no.toLowerCase().includes(term) ||
      (m.sender_facility?.legal_name || '').toLowerCase().includes(term) ||
      (m.receiver_facility?.legal_name || '').toLowerCase().includes(term);

    const matchesStatus = filterStatus === 'ALL' || m.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalInTransit = manifests.filter((m) => m.status === 'IN_TRANSIT').length;
  const totalDelivered = manifests.filter((m) => m.status === 'DELIVERED').length;
  const totalVolume = manifests.reduce((sum, m) => sum + m.quantity_dispatched_mt, 0);

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 space-y-6">
      {/* Center Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white font-mono flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-emerald-400" />
              SPCB Regulatory & Form 10 Manifest Center
            </h2>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Statutory Compliance Registry
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Official 7-color tracking under Rule 19 of the Hazardous and Other Wastes (Management and Transboundary Movement) Rules, 2016.
          </p>
        </div>

        {activeRole === 'REGULATOR_SPCB' && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-950/70 border border-purple-500/40 text-purple-200 text-xs font-mono">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <span>Auditor Level: Unrestricted SPCB Access</span>
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
            Total Manifests Active
          </div>
          <div className="text-2xl font-bold font-mono text-white mt-1">
            {manifests.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Electronic CPCB Registry</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-amber-500/30">
          <div className="text-[10px] font-mono text-amber-400 uppercase tracking-wider">
            Consignments In Transit
          </div>
          <div className="text-2xl font-bold font-mono text-amber-300 mt-1">
            {totalInTransit}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">GPS HazTrans Telemetry Active</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-emerald-500/30">
          <div className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">
            Delivered & Closed
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-300 mt-1">
            {totalDelivered}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Green / Blue Copies Returned</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-500/30">
          <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
            Total Dispatched Volume
          </div>
          <div className="text-2xl font-bold font-mono text-cyan-300 mt-1">
            {totalVolume.toFixed(1)} <span className="text-sm font-normal text-slate-400">MT</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Verified Weighbridge Records</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-slate-900/60 rounded-xl border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search manifest no, vehicle, company..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto text-xs">
          {['ALL', 'IN_TRANSIT', 'DELIVERED', 'ACCEPTED_AT_SITE'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg font-medium transition text-xs whitespace-nowrap ${
                filterStatus === status
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              {status === 'ALL' ? 'All Manifests' : status.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Manifests Table / Grid */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-400 text-xs">
            No Form 10 manifests match the selected filter. Generate a manifest by achieving mutual consent in the Bilateral Exchange Center!
          </div>
        ) : (
          filtered.map((manifest) => {
            const copyColor = manifest.current_copy || 'WHITE';
            const theme = COPY_COLOR_THEMES[copyColor];

            return (
              <div
                key={manifest.id}
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition space-y-4"
              >
                {/* Header row */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      <FileCheck2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-white">
                          {manifest.manifest_number}
                        </span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${theme.badge}`}>
                          Copy {copyColor}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        NOC Ref: {manifest.spcb_noc_reference} • Dispatched: {new Date(manifest.dispatch_date).toLocaleDateString('en-IN')}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg border ${
                      manifest.status === 'IN_TRANSIT'
                        ? 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                        : manifest.status === 'DELIVERED'
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}>
                      {manifest.status}
                    </span>

                    <button
                      onClick={() => onOpenManifestModal(manifest)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium text-xs shadow transition"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      View 7-Color Slip & Print
                    </button>
                  </div>
                </div>

                {/* Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
                  {/* Sender */}
                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase block mb-1">
                      Sender (Generator)
                    </span>
                    <div className="font-sans font-bold text-slate-200">
                      {manifest.sender_facility?.legal_name || 'Precision Plating Works Pvt. Ltd.'}
                    </div>
                    <div className="text-slate-400 text-[11px] mt-0.5">
                      Consent: {manifest.sender_facility?.spcb_consent_id}
                    </div>
                  </div>

                  {/* Receiver */}
                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase block mb-1">
                      Receiver (Offtaker)
                    </span>
                    <div className="font-sans font-bold text-slate-200">
                      {manifest.receiver_facility?.legal_name || 'Sahyadri Precious Metals'}
                    </div>
                    <div className="text-slate-400 text-[11px] mt-0.5">
                      Consent: {manifest.receiver_facility?.spcb_consent_id}
                    </div>
                  </div>

                  {/* Transporter & Vehicle */}
                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase block mb-1">
                      Transporter Fleet
                    </span>
                    <div className="font-sans font-bold text-slate-200 flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-cyan-400" />
                      {manifest.transporter_name}
                    </div>
                    <div className="text-amber-400 text-[11px] font-bold mt-0.5">
                      Vehicle: {manifest.vehicle_no}
                    </div>
                  </div>

                  {/* Consignment Specs */}
                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase block mb-1">
                      Waste Load
                    </span>
                    <div className="font-sans font-bold text-white">
                      {manifest.material_name}
                    </div>
                    <div className="text-emerald-400 font-bold text-[11px] mt-0.5">
                      {manifest.quantity_dispatched_mt} MT • {manifest.physical_state}
                    </div>
                  </div>
                </div>

                {/* Quick Status Advance Action */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs border-t border-slate-800/60">
                  <div className="text-slate-400 text-[11px]">
                    Packaging: <span className="text-slate-300">{manifest.packaging_type}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 font-mono text-[11px]">Advance Lifecycle:</span>
                    {manifest.status === 'IN_TRANSIT' && (
                      <button
                        onClick={() => onUpdateStatus(manifest.id, 'DELIVERED', 'GREEN')}
                        className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[11px] font-mono hover:bg-emerald-900 transition flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        Mark Delivered & Issue Green Copy
                      </button>
                    )}
                    {manifest.status === 'DELIVERED' && (
                      <button
                        onClick={() => onUpdateStatus(manifest.id, 'ACCEPTED_AT_SITE', 'BLUE')}
                        className="px-2.5 py-1 rounded bg-sky-950 text-sky-300 border border-sky-500/40 text-[11px] font-mono hover:bg-sky-900 transition flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3 h-3 text-sky-400" />
                        Return Blue Copy to Generator
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
