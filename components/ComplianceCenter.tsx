'use client';

import React, { useState } from 'react';
import {
  FileCheck2,
  FileSpreadsheet,
  ShieldCheck,
  Scale,
} from 'lucide-react';
import { Form10Manifest, ManifestStatus, ManifestCopyColor, Facility, MaterialStream, MatchProposal } from '@/types';
import { ManifestCenter } from './ManifestCenter';
import { Form4ComplianceCenter } from './Form4ComplianceCenter';
import { UserRole } from './Header';

interface ComplianceCenterProps {
  manifests: Form10Manifest[];
  facilities: Facility[];
  streams: MaterialStream[];
  matches: MatchProposal[];
  onOpenManifestModal: (manifest: Form10Manifest) => void;
  onUpdateStatus: (manifestId: string, status: ManifestStatus, currentCopy?: ManifestCopyColor) => Promise<void>;
  activeRole: UserRole;
}

export const ComplianceCenter: React.FC<ComplianceCenterProps> = ({
  manifests,
  facilities,
  streams,
  matches,
  onOpenManifestModal,
  onUpdateStatus,
  activeRole,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'MANIFESTS' | 'FORM4'>('MANIFESTS');

  return (
    <div className="space-y-6">
      {/* Sub-navigation bar */}
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Regulatory Compliance Center</h2>
              <p className="text-xs text-slate-500">
                Rule 19 Form 10 hazardous waste tracking and Rule 20 Form 4 statutory annual returns
              </p>
            </div>
          </div>

          {/* Sub-tab segmented pills */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold self-start sm:self-auto">
            <button
              onClick={() => setActiveSubTab('MANIFESTS')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition ${
                activeSubTab === 'MANIFESTS'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileCheck2 className="w-4 h-4 text-emerald-600" />
              <span>Form 10 Manifests</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200">
                {manifests.length}
              </span>
            </button>

            <button
              onClick={() => setActiveSubTab('FORM4')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition ${
                activeSubTab === 'FORM4'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4 text-purple-600" />
              <span>Form 4 Annual Return</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-purple-50 text-purple-800 border border-purple-200">
                FY 25-26
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Render selected view */}
      {activeSubTab === 'MANIFESTS' ? (
        <ManifestCenter
          manifests={manifests}
          onOpenManifestModal={onOpenManifestModal}
          onUpdateStatus={onUpdateStatus}
          activeRole={activeRole}
        />
      ) : (
        <Form4ComplianceCenter
          facilities={facilities}
          streams={streams}
          matches={matches}
          manifests={manifests}
          activeRole={activeRole}
        />
      )}
    </div>
  );
};
