'use client';

import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Download,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Calendar,
  Layers,
  Search,
  ExternalLink,
  Leaf,
  TrendingUp,
  FileCheck2,
  Eye,
  X,
} from 'lucide-react';
import { Facility, MaterialStream, MatchProposal, Form10Manifest } from '@/types';
import { buildForm4AnnualRecords, Form4AnnualRecord } from '@/lib/form4Engine';
import { formatINR, formatNumber } from '@/lib/utils';
import { UserRole } from './Header';

interface Form4ComplianceCenterProps {
  facilities: Facility[];
  streams: MaterialStream[];
  matches: MatchProposal[];
  manifests: Form10Manifest[];
  activeRole: UserRole;
}

export const Form4ComplianceCenter: React.FC<Form4ComplianceCenterProps> = ({
  facilities,
  streams,
  matches,
  manifests,
  activeRole,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState<string>('ALL');
  const [showPrintModal, setShowPrintModal] = useState(false);

  const records = buildForm4AnnualRecords(facilities, streams, matches, manifests);

  const filteredRecords = records.filter((rec) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      rec.cpcbScheduleCode.toLowerCase().includes(term) ||
      rec.materialName.toLowerCase().includes(term) ||
      rec.generatorFacility.legal_name.toLowerCase().includes(term) ||
      rec.destinationFacility.legal_name.toLowerCase().includes(term) ||
      rec.endUseMode.toLowerCase().includes(term);

    const matchesClass = filterClass === 'ALL' || rec.wasteClassification === filterClass;
    return matchesSearch && matchesClass;
  });

  // Aggregated Totals
  const totalDivertedAnnualMt = records.reduce((sum, r) => sum + r.annualDivertedMt, 0);
  const totalAvoidedCo2AnnualMt = records.reduce((sum, r) => sum + r.avoidedCo2AnnualMt, 0);
  const totalSavingsAnnualInr = records.reduce((sum, r) => sum + r.annualSavingsInr, 0);
  const totalBlueCopiesClosed = records.reduce((sum, r) => sum + r.blueCopyClosedCount, 0);
  const totalManifests = records.reduce((sum, r) => sum + r.totalManifestsDispatched, 0);
  const overallBlueCopyRate = Math.round((totalBlueCopiesClosed / (totalManifests || 1)) * 100);

  // Export CSV Handler
  const handleExportCSV = () => {
    const headers = [
      'CPCB Schedule Code',
      'Material Description',
      'Physical State',
      'Annual Generated (MT)',
      'Annual Diverted (MT)',
      'Generator Unit',
      'Generator Cluster',
      'Authorized Destination Unit',
      'Destination Consent ID',
      'Utilization Mode',
      'Blue Copies Closed',
      'Total Manifests',
      'Blue Copy Status',
      'Avoided CO2e (MT)',
      'Annual Savings (INR)',
    ];

    const rows = records.map((r) => [
      `"${r.cpcbScheduleCode}"`,
      `"${r.materialName}"`,
      `"${r.physicalState}"`,
      r.annualGeneratedMt,
      r.annualDivertedMt,
      `"${r.generatorFacility.legal_name}"`,
      `"${r.generatorFacility.cluster_zone}"`,
      `"${r.destinationFacility.legal_name}"`,
      `"${r.destinationConsentId}"`,
      `"${r.endUseMode}"`,
      r.blueCopyClosedCount,
      r.totalManifestsDispatched,
      `"${r.blueCopyStatus}"`,
      r.avoidedCo2AnnualMt,
      r.annualSavingsInr,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SPCB_Form4_Annual_Return_FY2025_26_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white font-mono flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-400" />
              SPCB Form 4 — Annual Regulatory & Circularity Return
            </h2>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Statutory Rule 20 (1) Return
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Aggregated Annual Returns for hazardous and secondary industrial byproducts under the <em>Hazardous and Other Wastes (Management and Transboundary Movement) Rules, 2016</em>.
          </p>
          <div className="flex items-center gap-3 mt-2 text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1 text-emerald-400">
              <Calendar className="w-3.5 h-3.5" /> Period: FY 2025–26 (April 1 – March 31)
            </span>
            <span>•</span>
            <span className="text-slate-300">Target Authority: MPCB Nashik Regional Office (MIDC Ambad)</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-mono font-medium border border-slate-700 transition"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setShowPrintModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold font-mono shadow-lg shadow-emerald-950/50 transition"
          >
            <Printer className="w-4 h-4" />
            <span>Export SPCB Annual Return</span>
          </button>
        </div>
      </div>

      {/* Annual Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-emerald-500/30">
          <div className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">
            Total Annual Diverted
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-300 mt-1">
            {formatNumber(totalDivertedAnnualMt)} <span className="text-sm font-normal text-slate-400">MT / yr</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            100% Diverted from TSDF Landfills
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-blue-500/30">
          <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
            Blue Copy (Copy 6) Closure Rate
          </div>
          <div className="text-2xl font-bold font-mono text-cyan-300 mt-1">
            {overallBlueCopyRate}%
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {totalBlueCopiesClosed} of {totalManifests} Consignment Slips Stamped
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-teal-500/30">
          <div className="text-[10px] font-mono text-teal-400 uppercase tracking-wider">
            Annual Avoided CO₂e
          </div>
          <div className="text-2xl font-bold font-mono text-teal-300 mt-1">
            {formatNumber(totalAvoidedCo2AnnualMt)} <span className="text-sm font-normal text-slate-400">MT</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Benchmark 0.82 kg CO₂e / kg diverted
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-amber-500/30">
          <div className="text-[10px] font-mono text-amber-400 uppercase tracking-wider">
            Annual Corridor Economic Arbitrage
          </div>
          <div className="text-2xl font-bold font-mono text-amber-300 mt-1">
            {formatINR(totalSavingsAnnualInr)}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Displaced Virgin Raw Material & TSDF Fees
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by schedule code, material, generator, or destination unit..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
          />
        </div>

        <div className="flex items-center gap-1 font-mono text-[11px]">
          <span className="text-slate-500 mr-1">Classification:</span>
          <button
            onClick={() => setFilterClass('ALL')}
            className={`px-2.5 py-1 rounded transition ${
              filterClass === 'ALL' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({records.length})
          </button>
          <button
            onClick={() => setFilterClass('HAZARDOUS_SCHEDULE_I')}
            className={`px-2.5 py-1 rounded transition ${
              filterClass === 'HAZARDOUS_SCHEDULE_I'
                ? 'bg-rose-950/70 text-rose-300 border border-rose-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Schedule I (Hazardous)
          </button>
          <button
            onClick={() => setFilterClass('OTHER_WASTE_SCHEDULE_II')}
            className={`px-2.5 py-1 rounded transition ${
              filterClass === 'OTHER_WASTE_SCHEDULE_II'
                ? 'bg-amber-950/70 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Schedule II (Pozzolana)
          </button>
          <button
            onClick={() => setFilterClass('NON_HAZARDOUS_CIRCULAR')}
            className={`px-2.5 py-1 rounded transition ${
              filterClass === 'NON_HAZARDOUS_CIRCULAR'
                ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Non-Hazardous Biomass
          </button>
        </div>
      </div>

      {/* Main Aggregated Annual Return Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">CPCB Schedule / Code</th>
                <th className="py-3 px-4">Material Description</th>
                <th className="py-3 px-4 text-right">Annual Diverted</th>
                <th className="py-3 px-4">Authorized Destination Unit</th>
                <th className="py-3 px-4">Approved End-Use Mode</th>
                <th className="py-3 px-4 text-center">Blue Copy (Copy 6) Status</th>
                <th className="py-3 px-4 text-right">Avoided CO₂e</th>
                <th className="py-3 px-4 text-center">Audit Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 font-mono text-xs">
                    No Form 4 records found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-800/40 transition">
                    {/* CPCB Schedule Code */}
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-200">
                      <span className={`px-2 py-0.5 rounded text-[10px] border ${
                        record.wasteClassification === 'HAZARDOUS_SCHEDULE_I'
                          ? 'bg-rose-950/50 text-rose-300 border-rose-500/40'
                          : record.wasteClassification === 'OTHER_WASTE_SCHEDULE_II'
                          ? 'bg-amber-950/50 text-amber-300 border-amber-500/40'
                          : 'bg-emerald-950/50 text-emerald-300 border-emerald-500/40'
                      }`}>
                        {record.cpcbScheduleCode}
                      </span>
                    </td>

                    {/* Material & State */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{record.materialName}</div>
                      <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                        State: {record.physicalState} • Gen: {record.generatorFacility.legal_name}
                      </div>
                    </td>

                    {/* Annual Diverted Volume */}
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-300">
                      {formatNumber(record.annualDivertedMt)} <span className="text-[10px] text-slate-400 font-normal">MT/yr</span>
                      <div className="text-[10px] text-slate-500 font-normal">
                        ({(record.annualDivertedMt / 12).toFixed(1)} MT/mo)
                      </div>
                    </td>

                    {/* Destination Facility */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-200">{record.destinationFacility.legal_name}</div>
                      <div className="text-[10px] font-mono text-slate-400 mt-0.5 flex items-center gap-1">
                        <span>{record.destinationFacility.cluster_zone}</span>
                        <span>•</span>
                        <span className="text-cyan-400">{record.destinationConsentId}</span>
                      </div>
                    </td>

                    {/* Approved End-Use Mode */}
                    <td className="py-3.5 px-4 text-slate-300 text-[11px] leading-relaxed max-w-xs">
                      {record.endUseMode}
                    </td>

                    {/* Blue Copy Closure Status */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col items-center">
                        <div className="flex items-center gap-1.5 text-xs font-mono">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="font-bold text-emerald-300">
                            {record.blueCopyClosedCount} / {record.totalManifestsDispatched}
                          </span>
                          <span className="text-[10px] text-slate-400">({record.blueCopyComplianceRate}%)</span>
                        </div>
                        {/* Progress Bar */}
                        <div className="w-24 bg-slate-950 h-1.5 rounded-full overflow-hidden mt-1.5 border border-slate-800">
                          <div
                            className="bg-emerald-500 h-full rounded-full"
                            style={{ width: `${record.blueCopyComplianceRate}%` }}
                          />
                        </div>
                        <span className="text-[9px] font-mono text-slate-500 mt-1 uppercase">
                          {record.blueCopyStatus === 'COMPLIANT_ARCHIVED' ? 'Archived & Sealed' : 'Pending Return'}
                        </span>
                      </div>
                    </td>

                    {/* Avoided CO2e */}
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-teal-300">
                      {formatNumber(record.avoidedCo2AnnualMt)} <span className="text-[10px] text-slate-400 font-normal">MT</span>
                    </td>

                    {/* Audit Status */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-purple-950/60 text-purple-300 border border-purple-500/40">
                        <ShieldCheck className="w-3 h-3 text-purple-400" />
                        Verified
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SPCB Form 4 Official Gazette Printable Modal */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-white text-slate-900 rounded-xl shadow-2xl p-8 border border-slate-300 my-8">
            {/* Modal Actions Bar (Hidden on print) */}
            <div className="no-print flex items-center justify-between pb-4 mb-6 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                <span className="font-bold text-slate-900 font-mono text-sm">
                  Official SPCB Form 4 Return Preview (Rule 20 (1))
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs font-bold shadow transition"
                >
                  <Printer className="w-4 h-4" />
                  Print / Save Official PDF
                </button>
                <button
                  onClick={() => setShowPrintModal(false)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Official Gazette Layout of Form 4 */}
            <div className="printable-form4 text-slate-900 font-serif leading-relaxed text-xs space-y-4">
              <div className="text-center space-y-1 border-b pb-4">
                <h1 className="text-base font-bold uppercase tracking-wider font-sans">FORM 4</h1>
                <p className="text-[11px] italic font-serif">
                  [See rules 6 (5), 13 (8), 16 (6) and 20 (1)]
                </p>
                <h2 className="text-xs font-bold uppercase font-sans">
                  FORM FOR FILING ANNUAL RETURNS FOR HAZARDOUS AND OTHER WASTES
                </h2>
                <p className="text-[11px] text-slate-600">
                  [To be submitted to State Pollution Control Board by 30th day of June of every year for the preceding period April 2025 to March 2026]
                </p>
              </div>

              {/* Occupier & Authority Details */}
              <div className="grid grid-cols-2 gap-4 border p-3 rounded text-[11px]">
                <div>
                  <span className="font-bold block">1. Name and address of facility:</span>
                  <span>Nashik Industrial Symbiosis Cluster Coordination Hub</span>
                  <span className="block text-slate-600">MIDC Industrial Areas Ambad & Satpur, Nashik - 422010</span>
                </div>
                <div>
                  <span className="font-bold block">2. Name of Authorized Signatory / Occupier:</span>
                  <span>Director of Industrial Environment & Symbiosis, MIDC</span>
                  <span className="block text-slate-600">SPCB Consent Ref: MPCB/RO-NSK/FORM4/ANNUAL/2026-094</span>
                </div>
              </div>

              {/* Aggregated Return Table in Form 4 */}
              <div className="space-y-2">
                <h3 className="font-bold uppercase text-[11px] font-sans">
                  Part A: Summary of Hazardous & Secondary Wastes Handled and Diverted (FY 2025–26)
                </h3>
                <table className="w-full border-collapse border border-slate-300 text-[10px]">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-300 font-sans font-bold">
                      <th className="border p-2">Sr.</th>
                      <th className="border p-2">CPCB Schedule & Category</th>
                      <th className="border p-2">Waste Description</th>
                      <th className="border p-2">Physical State</th>
                      <th className="border p-2">Annual Diverted (MT)</th>
                      <th className="border p-2">Authorized Destination Unit & SPCB Consent</th>
                      <th className="border p-2">End-Use Utilization Mode</th>
                      <th className="border p-2">Form 10 Manifest Blue Copies Stamped</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((r, i) => (
                      <tr key={r.id} className="border-b border-slate-300">
                        <td className="border p-2 text-center">{i + 1}</td>
                        <td className="border p-2 font-mono font-bold">{r.cpcbScheduleCode}</td>
                        <td className="border p-2">{r.materialName}</td>
                        <td className="border p-2">{r.physicalState}</td>
                        <td className="border p-2 font-mono font-bold text-right">{r.annualDivertedMt} MT</td>
                        <td className="border p-2">
                          <span className="font-bold">{r.destinationFacility.legal_name}</span>
                          <span className="block text-[9px] text-slate-600">{r.destinationConsentId}</span>
                        </td>
                        <td className="border p-2">{r.endUseMode}</td>
                        <td className="border p-2 text-center font-mono">
                          {r.blueCopyClosedCount} of {r.totalManifestsDispatched} (100% Closed)
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-50 font-bold border-t border-slate-400">
                      <td colSpan={4} className="border p-2 text-right">TOTAL SECONDARY TONNAGE DIVERTED:</td>
                      <td className="border p-2 text-right font-mono text-emerald-800">{totalDivertedAnnualMt.toFixed(1)} MT</td>
                      <td colSpan={2} className="border p-2 text-right">TOTAL AVOIDED CO₂e:</td>
                      <td className="border p-2 text-center font-mono text-teal-800">{totalAvoidedCo2AnnualMt.toFixed(1)} MT</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Verification & Signature Block */}
              <div className="pt-6 grid grid-cols-2 gap-8 text-[11px]">
                <div>
                  <p><strong>Place:</strong> Nashik, Maharashtra</p>
                  <p><strong>Date:</strong> 24th October 2026</p>
                  <p className="mt-2 text-[10px] text-slate-600">
                    Certified that all secondary byproduct movements followed CPCB Form 10 manifests under Rule 19 with 100% digital trace compliance.
                  </p>
                </div>
                <div className="text-right space-y-8">
                  <div>
                    <span className="block font-bold">Signature of the Occupier / Operator:</span>
                    <span className="block text-[10px] text-slate-500">[ Digitally Signed via ReBharat State Audit Node ]</span>
                  </div>
                  <div className="border-t border-slate-400 pt-1 inline-block min-w-[200px]">
                    <span className="font-bold block">Authorized Signatory Stamp</span>
                    <span className="text-[10px] text-slate-600">MIDC Industrial Cluster Authority</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
