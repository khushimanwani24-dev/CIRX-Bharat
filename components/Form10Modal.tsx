'use client';

import React, { useState } from 'react';
import {
  X,
  Printer,
  FileCheck,
  Truck,
  Layers,
  QrCode,
  ShieldCheck,
} from 'lucide-react';
import { Form10Manifest, ManifestCopyColor } from '@/types';
import { FORM_10_COPIES, COPY_COLOR_THEMES } from '@/lib/manifestEngine';

interface Form10ModalProps {
  manifest: Form10Manifest;
  onClose: () => void;
  onStatusUpdate?: (status: any, copy: ManifestCopyColor) => void;
}

export const Form10Modal: React.FC<Form10ModalProps> = ({
  manifest,
  onClose,
  onStatusUpdate,
}) => {
  const [selectedColor, setSelectedColor] = useState<ManifestCopyColor>(
    manifest.current_copy || 'WHITE'
  );

  const activeCopyMeta =
    FORM_10_COPIES.find((c) => c.color === selectedColor) || FORM_10_COPIES[0];
  const theme = COPY_COLOR_THEMES[selectedColor];

  const handlePrint = () => {
    window.print();
  };

  const handleAdvanceCopy = (nextColor: ManifestCopyColor) => {
    setSelectedColor(nextColor);
    if (onStatusUpdate) {
      let newStatus = manifest.status;
      if (nextColor === 'ORANGE') newStatus = 'IN_TRANSIT';
      if (nextColor === 'GREEN' || nextColor === 'BLUE') newStatus = 'DELIVERED';
      onStatusUpdate(newStatus, nextColor);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-5xl my-auto bg-white border border-slate-200/90 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Control Header (Hidden when printing) */}
        <div className="no-print flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  CPCB Form 10 Manifest Generator
                </h3>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Rule 19 Compliance
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Manifest Ref: <span className="font-mono font-medium text-slate-800">{manifest.manifest_number}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 7-Color Slip Selector Tabs (Hidden when printing) */}
        <div className="no-print px-6 py-3.5 bg-slate-50 border-b border-slate-200 overflow-x-auto">
          <div className="flex items-center justify-between gap-4 min-w-[700px]">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider mr-2 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-emerald-600" />
                Select Copy:
              </span>
              {FORM_10_COPIES.map((copy) => {
                const isSelected = selectedColor === copy.color;
                return (
                  <button
                    key={copy.color}
                    onClick={() => handleAdvanceCopy(copy.color)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-white text-slate-900 font-semibold border border-slate-300 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                    }`}
                  >
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
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
                    Copy {copy.copy_number} ({copy.color.toLowerCase()})
                  </button>
                );
              })}
            </div>

            <div className="text-[11px] text-slate-500 font-medium">
              Current Dispatch Status: <span className="text-emerald-700 font-bold">{manifest.status.replace('_', ' ')}</span>
            </div>
          </div>
          <div className="mt-2 text-xs text-slate-700 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
            <span className="font-semibold text-emerald-700">
              {activeCopyMeta.title}:
            </span>
            <span className="text-slate-600">
              {activeCopyMeta.regulatory_instruction}
            </span>
          </div>
        </div>

        {/* Official Printable Form 10 Document Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100/70">
          <div
            className={`printable-manifest mx-auto max-w-4xl rounded-xl border-2 p-6 sm:p-8 transition-colors ${theme.bg} ${theme.border} text-slate-900 shadow-xl`}
          >
            {/* Top Official Watermark & Header */}
            <div className="border-b-2 border-slate-900 pb-4 mb-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded border-2 border-slate-900 flex flex-col items-center justify-center font-bold font-serif text-[10px] text-center leading-none bg-white">
                    <span>सत्यमेव</span>
                    <span>जयते</span>
                    <span className="text-[8px] mt-0.5">GOI</span>
                  </div>
                  <div>
                    <h2 className="text-lg font-black tracking-wider uppercase font-serif text-slate-950">
                      FORM 10
                    </h2>
                    <p className="text-[11px] font-semibold text-slate-700 tracking-wide">
                      [See Rule 19 (1)]
                    </p>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-900">
                      MANIFEST FOR HAZARDOUS AND OTHER WASTE
                    </p>
                    <p className="text-[10px] text-slate-600">
                      Hazardous and Other Wastes (Management and Transboundary Movement) Rules, 2016
                    </p>
                  </div>
                </div>

                <div className="text-right flex flex-col items-end">
                  <div className={`px-2.5 py-1 rounded text-xs font-bold border uppercase font-mono ${theme.badge}`}>
                    {activeCopyMeta.title}
                  </div>
                  <div className="mt-1.5 font-mono text-xs text-slate-800 font-bold">
                    Manifest No: <span className="underline">{manifest.manifest_number}</span>
                  </div>
                  <div className="text-[10px] text-slate-600 font-mono">
                    SPCB Ref: {manifest.spcb_noc_reference}
                  </div>
                </div>
              </div>
            </div>

            {/* Statutory Grid - 14 Numbered Clauses */}
            <div className="space-y-4 text-xs">
              {/* Clause 1 & 2: Sender Details & Authorization */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 rounded-lg border border-slate-300 bg-white/80">
                <div>
                  <span className="font-bold text-slate-950 block mb-1">
                    1. Sender&apos;s Name & Mailing Address (Generator):
                  </span>
                  <div className="font-semibold text-slate-900">
                    {manifest.sender_facility?.legal_name || 'Precision Plating Works Pvt. Ltd.'}
                  </div>
                  <div className="text-slate-700 text-[11px]">
                    {manifest.sender_facility?.cluster_zone || 'MIDC Ambad Industrial Area, Nashik - 422010'}
                  </div>
                  <div className="text-slate-700 text-[11px] mt-0.5 font-mono">
                    GSTIN: {manifest.sender_facility?.gstin || '27AABCP8841F1ZV'}
                  </div>
                  <div className="text-slate-700 text-[11px]">
                    Contact: {manifest.sender_facility?.contact_person || 'Rajesh Kulkarni'} ({manifest.sender_facility?.contact_phone || '+91 98220 41421'})
                  </div>
                </div>

                <div>
                  <span className="font-bold text-slate-950 block mb-1">
                    2. Sender&apos;s Authorization / Consent No:
                  </span>
                  <div className="font-mono font-bold text-slate-900 bg-slate-50 p-1.5 rounded border border-slate-200">
                    {manifest.sender_facility?.spcb_consent_id || 'MPCB/RO-NSK/CONSENT/2401000142'}
                  </div>
                  <div className="text-[10px] text-slate-600 mt-1">
                    Issued under Section 25 of Water Act & Section 21 of Air Act
                  </div>
                </div>
              </div>

              {/* Clause 3 & 4: Transporter & Vehicle */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 rounded-lg border border-slate-300 bg-white/80">
                <div>
                  <span className="font-bold text-slate-950 block mb-1">
                    3. Transporter Name & Address:
                  </span>
                  <div className="font-semibold text-slate-900">
                    {manifest.transporter_name}
                  </div>
                  <div className="text-[11px] text-slate-700">
                    Nashik Transport Hub, Pathardi Phata, Nashik - 422009
                  </div>
                  <div className="text-[11px] font-mono text-slate-700">
                    Reg No: {manifest.transporter_license}
                  </div>
                </div>

                <div>
                  <span className="font-bold text-slate-950 block mb-1">
                    4. Vehicle Registration & Driver:
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 text-sm bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {manifest.vehicle_no}
                    </span>
                    <Truck className="w-4 h-4 text-slate-700" />
                  </div>
                  <div className="text-[11px] text-slate-800 mt-1 font-medium">
                    Driver: {manifest.driver_name}
                  </div>
                  <div className="text-[11px] text-slate-700 font-mono">
                    Tel: {manifest.driver_phone}
                  </div>
                </div>

                <div>
                  <span className="font-bold text-slate-950 block mb-1">
                    5. Movement Authorization:
                  </span>
                  <div className="text-[11px] text-slate-800">
                    Valid for inter-MIDC transit within Maharashtra. Route tracking via onboard GPS active.
                  </div>
                  <div className="text-[10px] text-emerald-800 font-semibold mt-1 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    PESO / MPCB HazTrans Compliant
                  </div>
                </div>
              </div>

              {/* Clause 6 & 7: Receiver Details & Authorization */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 rounded-lg border border-slate-300 bg-white/80">
                <div>
                  <span className="font-bold text-slate-950 block mb-1">
                    6. Receiver&apos;s Name & Facility Address (Offtaker / Co-processor):
                  </span>
                  <div className="font-semibold text-slate-900">
                    {manifest.receiver_facility?.legal_name || 'Sahyadri Precious Metals & Chemical Recovery'}
                  </div>
                  <div className="text-slate-700 text-[11px]">
                    {manifest.receiver_facility?.cluster_zone || 'MIDC Satpur Industrial Estate, Nashik - 422007'}
                  </div>
                  <div className="text-slate-700 text-[11px] mt-0.5 font-mono">
                    GSTIN: {manifest.receiver_facility?.gstin || '27AASCS6542L1Z3'}
                  </div>
                  <div className="text-slate-700 text-[11px]">
                    Contact: {manifest.receiver_facility?.contact_person || 'Dr. Arvind Joshi'}
                  </div>
                </div>

                <div>
                  <span className="font-bold text-slate-950 block mb-1">
                    7. Receiver&apos;s SPCB Authorization No:
                  </span>
                  <div className="font-mono font-bold text-slate-900 bg-slate-50 p-1.5 rounded border border-slate-200">
                    {manifest.receiver_facility?.spcb_consent_id || 'MPCB/HW-RECOVERY/SAT/2023-88'}
                  </div>
                  <div className="text-[10px] text-slate-600 mt-1">
                    Authorized for Co-processing / Hydrometallurgical Raw Material Substitution
                  </div>
                </div>
              </div>

              {/* Clause 8 - 11: Waste Description & Quantity */}
              <div className="p-3 rounded-lg border border-slate-300 bg-white/80">
                <span className="font-bold text-slate-950 block mb-1.5">
                  8. Description of Hazardous / Other Waste:
                </span>
                <table className="w-full text-left border-collapse border border-slate-300 text-[11px]">
                  <thead>
                    <tr className="bg-slate-100 font-bold text-slate-900">
                      <th className="p-1.5 border border-slate-300">CPCB Category</th>
                      <th className="p-1.5 border border-slate-300">Commercial Name</th>
                      <th className="p-1.5 border border-slate-300">Physical State</th>
                      <th className="p-1.5 border border-slate-300">Quantity Dispatched</th>
                      <th className="p-1.5 border border-slate-300">Packaging Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-1.5 border border-slate-300 font-mono font-bold">
                        {manifest.waste_category}
                      </td>
                      <td className="p-1.5 border border-slate-300 font-medium">
                        {manifest.material_name}
                      </td>
                      <td className="p-1.5 border border-slate-300 font-mono">
                        {manifest.physical_state}
                      </td>
                      <td className="p-1.5 border border-slate-300 font-mono font-bold text-slate-950">
                        {manifest.quantity_dispatched_mt} Metric Tonnes
                      </td>
                      <td className="p-1.5 border border-slate-300">
                        {manifest.packaging_type}
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Clause 11: Special Handling & Emergency Instructions */}
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-slate-200">
                  <div>
                    <span className="font-bold text-slate-950 block text-[11px]">
                      9. Special Handling & Safety Instructions:
                    </span>
                    <p className="text-[10px] text-slate-800 mt-0.5 leading-relaxed font-sans">
                      {manifest.special_handling_instructions}
                    </p>
                  </div>
                  <div>
                    <span className="font-bold text-slate-950 block text-[11px]">
                      10. Emergency Response Contact & Protocol:
                    </span>
                    <p className="text-[10px] text-slate-800 mt-0.5 font-mono">
                      {manifest.emergency_contact}
                    </p>
                  </div>
                </div>
              </div>

              {/* Clause 12, 13, 14: Three Official Signature & Stamp Seals */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                {/* 1. Sender Cert */}
                <div className="p-3 rounded-lg border border-slate-300 bg-white flex flex-col justify-between h-40">
                  <div>
                    <span className="font-bold text-[11px] text-slate-950 block">
                      11. Sender&apos;s Certificate
                    </span>
                    <p className="text-[9px] text-slate-600 leading-tight mt-0.5">
                      I hereby declare that the contents of this consignment are fully and accurately described above.
                    </p>
                  </div>
                  <div className="text-center border-t border-dashed border-slate-300 pt-1">
                    <div className="font-serif italic font-bold text-slate-900 text-xs">
                      [Digital Signature Verified]
                    </div>
                    <div className="text-[10px] text-slate-700 font-medium">
                      Rajesh Kulkarni (Plant Head)
                    </div>
                    <div className="text-[9px] text-slate-500 font-mono">
                      Date: {new Date(manifest.dispatch_date).toLocaleDateString('en-IN')}
                    </div>
                  </div>
                </div>

                {/* 2. Transporter Ack */}
                <div className="p-3 rounded-lg border border-slate-300 bg-white flex flex-col justify-between h-40">
                  <div>
                    <span className="font-bold text-[11px] text-slate-950 block">
                      12. Transporter&apos;s Acknowledgment
                    </span>
                    <p className="text-[9px] text-slate-600 leading-tight mt-0.5">
                      Received the waste specified above in designated containers for transport to designated destination.
                    </p>
                  </div>
                  <div className="text-center border-t border-dashed border-slate-300 pt-1">
                    <div className="font-serif italic font-bold text-slate-900 text-xs">
                      [Vehicle Crew Verified]
                    </div>
                    <div className="text-[10px] text-slate-700 font-medium">
                      {manifest.driver_name}
                    </div>
                    <div className="text-[9px] text-slate-500 font-mono">
                      Vehicle: {manifest.vehicle_no}
                    </div>
                  </div>
                </div>

                {/* 3. Receiver Cert */}
                <div className="p-3 rounded-lg border border-slate-300 bg-white flex flex-col justify-between h-40">
                  <div>
                    <span className="font-bold text-[11px] text-slate-950 block">
                      13. Receiver&apos;s Certificate
                    </span>
                    <p className="text-[9px] text-slate-600 leading-tight mt-0.5">
                      Consignment received safely. Chemical assay matched manifest specification within tolerance.
                    </p>
                  </div>
                  <div className="text-center border-t border-dashed border-slate-300 pt-1">
                    <div className="font-serif italic font-bold text-slate-900 text-xs">
                      {manifest.status === 'DELIVERED' || manifest.status === 'ACCEPTED_AT_SITE'
                        ? '[Site Weighbridge Signed]'
                        : '[Pending Site Arrival]'}
                    </div>
                    <div className="text-[10px] text-slate-700 font-medium">
                      Materials Inward Superintendent
                    </div>
                    <div className="text-[9px] text-slate-500 font-mono">
                      Timestamp: {new Date(manifest.expected_delivery_date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Security Footer: QR Code & Verification Watermark */}
              <div className="pt-3 border-t border-slate-300 flex items-center justify-between text-[10px] text-slate-600 font-mono">
                <div className="flex items-center gap-2">
                  <QrCode className="w-8 h-8 text-slate-800" />
                  <div>
                    <div>ReBharat Circular Chain Verified #RB-{manifest.id.toUpperCase()}</div>
                    <div>SPCB Nashik Regional Office Electronic Hazardous Waste Registry</div>
                  </div>
                </div>
                <div className="text-right">
                  <div>Rule 19 (1) Form 10 Copy: {activeCopyMeta.color}</div>
                  <div className="text-slate-800 font-bold">Page 1 of 1 • Statutory Manifest</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
