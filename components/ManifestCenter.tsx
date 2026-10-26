'use client';

import React, { useState } from 'react';
import {
  FileCheck2,
  Printer,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Search,
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-emerald-600" />
              GPCB Regulatory & Form 10 Manifest Center
            </h2>
            <span className="text-[11px] font-semibold uppercase px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
              GPCB XGN Registry
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Official 7-color tracking under Rule 19 via Gujarat Pollution Control Board Extended Green Node (XGN) System.
          </p>
        </div>

        {activeRole === 'REGULATOR_SPCB' && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-50 border border-purple-200 text-purple-800 text-xs font-medium">
            <ShieldCheck className="w-4 h-4 text-purple-600" />
            <span>Auditor Level: Unrestricted GPCB Access</span>
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Manifests Active
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {manifests.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Electronic GPCB / XGN Registry</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
            Consignments In Transit
          </div>
          <div className="text-2xl font-bold text-amber-800 mt-1">
            {totalInTransit}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">GPS HazTrans Telemetry Active</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
            Delivered & Closed
          </div>
          <div className="text-2xl font-bold text-emerald-800 mt-1">
            {totalDelivered}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Green / Blue Copies Returned</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="text-xs font-semibold text-teal-700 uppercase tracking-wider">
            Total Dispatched Volume
          </div>
          <div className="text-2xl font-bold text-teal-800 mt-1">
            {totalVolume.toFixed(1)} <span className="text-sm font-normal text-slate-500">MT</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Verified Weighbridge Records</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search manifest no, vehicle, company..."
            className="w-full bg-white border border-slate-200 hover:border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 font-medium transition shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto text-xs bg-slate-100 p-1 rounded-xl">
          {['ALL', 'IN_TRANSIT', 'DELIVERED', 'ACCEPTED_AT_SITE'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg font-medium transition text-xs whitespace-nowrap ${
                filterStatus === status
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
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
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200/80 text-slate-500 text-xs shadow-sm">
            No Form 10 manifests match the selected filter. Generate a manifest by achieving mutual consent in the Bilateral Exchange Center!
          </div>
        ) : (
          filtered.map((manifest) => {
            const copyColor = manifest.current_copy || 'WHITE';
            const theme = COPY_COLOR_THEMES[copyColor];

            return (
              <div
                key={manifest.id}
                className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 hover:border-slate-300 transition shadow-sm space-y-4"
              >
                {/* Header row */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <FileCheck2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-slate-900">
                          {manifest.manifest_number}
                        </span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${theme.badge}`}>
                          Copy {copyColor}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        NOC Ref: <span className="font-mono text-slate-700">{manifest.spcb_noc_reference}</span> • Dispatched: {new Date(manifest.dispatch_date).toLocaleDateString('en-IN')}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${
                      manifest.status === 'IN_TRANSIT'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : manifest.status === 'DELIVERED'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}>
                      {manifest.status.replace('_', ' ')}
                    </span>

                    <button
                      onClick={() => onOpenManifestModal(manifest)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      View 7-Color Slip & Print
                    </button>
                  </div>
                </div>

                {/* Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                  {/* Sender */}
                  <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/70">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase block mb-1">
                      Sender (Generator)
                    </span>
                    <div className="font-bold text-slate-900">
                      {manifest.sender_facility?.legal_name || 'Vatva Specialty Dye-Chem Industries Pvt. Ltd.'}
                    </div>
                    <div className="text-slate-500 text-[11px] mt-0.5 font-mono">
                      Consent: {manifest.sender_facility?.spcb_consent_id}
                    </div>
                  </div>

                  {/* Receiver */}
                  <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/70">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase block mb-1">
                      Receiver (Offtaker)
                    </span>
                    <div className="font-bold text-slate-900">
                      {manifest.receiver_facility?.legal_name || 'Kathwada Eco-Crete & AAC Block Infra'}
                    </div>
                    <div className="text-slate-500 text-[11px] mt-0.5 font-mono">
                      Consent: {manifest.receiver_facility?.spcb_consent_id}
                    </div>
                  </div>

                  {/* Transporter & Vehicle */}
                  <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/70">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase block mb-1">
                      Transporter Fleet
                    </span>
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-teal-600" />
                      {manifest.transporter_name}
                    </div>
                    <div className="text-amber-800 text-[11px] font-bold font-mono mt-0.5">
                      Vehicle: {manifest.vehicle_no}
                    </div>
                  </div>

                  {/* Consignment Specs */}
                  <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/70">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase block mb-1">
                      Waste Load
                    </span>
                    <div className="font-bold text-slate-900">
                      {manifest.material_name}
                    </div>
                    <div className="text-emerald-700 font-bold text-[11px] mt-0.5">
                      {manifest.quantity_dispatched_mt} MT • {manifest.physical_state}
                    </div>
                  </div>
                </div>

                {/* Quick Status Advance Action */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs border-t border-slate-100">
                  <div className="text-slate-500 text-[11px]">
                    Packaging: <span className="text-slate-700 font-medium">{manifest.packaging_type}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 text-[11px] font-medium">Advance Lifecycle:</span>
                    {manifest.status === 'IN_TRANSIT' && (
                      <button
                        onClick={() => onUpdateStatus(manifest.id, 'DELIVERED', 'GREEN')}
                        className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 font-semibold text-[11px] transition flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Mark Delivered & Issue Green Copy
                      </button>
                    )}
                    {manifest.status === 'DELIVERED' && (
                      <button
                        onClick={() => onUpdateStatus(manifest.id, 'ACCEPTED_AT_SITE', 'BLUE')}
                        className="px-2.5 py-1 rounded-md bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100 font-semibold text-[11px] transition flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3 h-3 text-sky-600" />
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
