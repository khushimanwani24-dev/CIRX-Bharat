'use client';

import React, { useState, useEffect } from 'react';
import seedData from '@/data/seed.json';
import {
  Facility,
  MaterialStream,
  MatchProposal,
  Form10Manifest,
  ClusterESGMetrics,
  ManifestStatus,
  ManifestCopyColor,
} from '@/types';
import { UserRole } from '@/components/Header';
import { Sidebar, MainNavTab } from '@/components/Sidebar';
import { TopHeader } from '@/components/TopHeader';
import { DashboardOverview } from '@/components/DashboardOverview';
import { BilateralExchangeCenter } from '@/components/BilateralExchangeCenter';
import { StreamIngestionPortal } from '@/components/StreamIngestionPortal';
import { IndustrialMap } from '@/components/IndustrialMap';
import { ComplianceCenter } from '@/components/ComplianceCenter';
import { TechnicalSpecsModal } from '@/components/TechnicalSpecsModal';
import { Form10Modal } from '@/components/Form10Modal';
import { runMatchingEngine } from '@/lib/matchingEngine';

export default function Home() {
  // Initialize immediately from seed fixture so initial page render is lightning fast
  const [facilities, setFacilities] = useState<Facility[]>(seedData.facilities as Facility[]);
  const [streams, setStreams] = useState<MaterialStream[]>(seedData.material_streams as MaterialStream[]);
  const [matches, setMatches] = useState<MatchProposal[]>(seedData.match_proposals as MatchProposal[]);
  const [manifests, setManifests] = useState<Form10Manifest[]>(() => {
    const list = seedData.manifests as Form10Manifest[];
    return list.map((m) => ({
      ...m,
      sender_facility: (seedData.facilities as Facility[]).find((f) => f.id === m.sender_facility_id),
      receiver_facility: (seedData.facilities as Facility[]).find((f) => f.id === m.receiver_facility_id),
    }));
  });

  const [esgMetrics, setEsgMetrics] = useState<ClusterESGMetrics>({
    total_diverted_mt: 90.0,
    total_savings_inr: 162000,
    total_avoided_co2_mt: 73.8,
    active_symbioses_count: 2,
    hazardous_treated_mt: 20.0,
  });

  // Default to DASHBOARD as the welcoming front door
  const [activeRole, setActiveRole] = useState<UserRole>('GEN_PRECISION');
  const [activeTab, setActiveTab] = useState<MainNavTab>('DASHBOARD');
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>('match-001');
  const [activeManifestModal, setActiveManifestModal] = useState<Form10Manifest | null>(null);
  const [isSpecsModalOpen, setIsSpecsModalOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 4500);
  };

  // Sync with API on mount
  useEffect(() => {
    async function loadRemoteState() {
      try {
        const res = await fetch('/api/state');
        if (res.ok) {
          const data = await res.json();
          if (data.facilities) setFacilities(data.facilities);
          if (data.streams) setStreams(data.streams);
          if (data.matches) setMatches(data.matches);
          if (data.manifests) setManifests(data.manifests);
          if (data.esg_metrics) setEsgMetrics(data.esg_metrics);
        }
      } catch (err) {
        console.warn('Using client-cached seed data:', err);
      }
    }
    loadRemoteState();
  }, []);

  // Recalculate ESG metrics dynamically on state change
  const recalculateESG = (currentMatches: MatchProposal[], currentStreams: MaterialStream[]) => {
    const active = currentMatches.filter(
      (m) => m.status === 'MUTUAL_CONSENT' || m.status === 'MANIFEST_GENERATED' || m.status === 'COMPLETED'
    );
    let totalDiverted = 0;
    let totalSavings = 0;
    let totalCo2 = 0;
    let hazTreated = 0;

    for (const match of active) {
      const supply = currentStreams.find((s) => s.id === match.supply_stream_id);
      const demand = currentStreams.find((s) => s.id === match.demand_stream_id);
      if (supply && demand) {
        const vol = Math.min(supply.monthly_volume_mt, demand.monthly_volume_mt);
        totalDiverted += vol;
        totalSavings += match.economic_benefit_inr;
        totalCo2 += match.avoided_co2_mt;
        if (supply.is_hazardous) hazTreated += vol;
      }
    }

    setEsgMetrics({
      total_diverted_mt: totalDiverted,
      total_savings_inr: totalSavings,
      total_avoided_co2_mt: Math.round(totalCo2 * 10) / 10,
      active_symbioses_count: active.length,
      hazardous_treated_mt: hazTreated,
    });
  };

  // Handle toggling generator or offtaker consent
  const handleToggleConsent = async (matchId: string, party: 'generator' | 'offtaker') => {
    try {
      const res = await fetch(`/api/matches/${matchId}/consent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ party }),
      });

      if (res.ok) {
        const data = await res.json();
        setMatches(data.all_matches);
        if (data.esg_metrics) setEsgMetrics(data.esg_metrics);

        const targetMatch = data.match as MatchProposal;
        if (targetMatch.generator_consent && targetMatch.offtaker_consent) {
          showToast(
            '🎉 Mutual Consent Achieved! Trade Confidentiality Shield Disengaged — Full Legal Identities and SPCB Consents Revealed!'
          );
        } else {
          showToast(`Bilateral Consent preference updated for ${party.toUpperCase()}.`);
        }
      } else {
        // Fallback local mutation
        setMatches((prev) => {
          const updated = prev.map((m) => {
            if (m.id === matchId) {
              const newGen = party === 'generator' ? !m.generator_consent : m.generator_consent;
              const newOff = party === 'offtaker' ? !m.offtaker_consent : m.offtaker_consent;
              const isBoth = newGen && newOff;
              return {
                ...m,
                generator_consent: newGen,
                offtaker_consent: newOff,
                status: isBoth ? ('MUTUAL_CONSENT' as const) : ('PROPOSED' as const),
                unlocked_at: isBoth ? new Date().toISOString() : undefined,
              };
            }
            return m;
          });
          recalculateESG(updated, streams);
          return updated;
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle stream created
  const handleStreamCreated = async (streamData: any) => {
    try {
      const res = await fetch('/api/streams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(streamData),
      });

      if (res.ok) {
        const data = await res.json();
        setStreams((prev) => [...prev, data.stream]);
        setMatches(data.updated_matches);
        recalculateESG(data.updated_matches, [...streams, data.stream]);
        showToast(`Stream "${data.stream.material_name}" ingested. New matches calculated!`);
      } else {
        // Client-side fallback
        const newStream: MaterialStream = {
          ...streamData,
          id: `stream-${Date.now().toString().slice(-6)}`,
          created_at: new Date().toISOString(),
        };
        const updatedStreams = [...streams, newStream];
        setStreams(updatedStreams);
        const updatedMatches = runMatchingEngine(facilities, updatedStreams, matches);
        setMatches(updatedMatches);
        recalculateESG(updatedMatches, updatedStreams);
        showToast(`Stream "${newStream.material_name}" registered!`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle generating Form 10 manifest
  const handleGenerateManifest = async (matchId: string) => {
    try {
      const res = await fetch('/api/manifests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ match_id: matchId }),
      });

      if (res.ok) {
        const data = await res.json();
        setManifests(data.all_manifests);
        // Find newly created manifest and open modal
        const created = data.manifest as Form10Manifest;
        setActiveManifestModal(created);
        showToast(`CPCB Form 10 Manifest generated: ${created.manifest_number}`);
      } else {
        showToast('Error generating manifest. Please try again.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Update manifest status
  const handleUpdateManifestStatus = async (
    manifestId: string,
    status: ManifestStatus,
    currentCopy?: ManifestCopyColor
  ) => {
    try {
      const res = await fetch(`/api/manifests/${manifestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, current_copy: currentCopy }),
      });

      if (res.ok) {
        const data = await res.json();
        setManifests(data.all_manifests);
        if (activeManifestModal && activeManifestModal.id === manifestId) {
          setActiveManifestModal(data.manifest);
        }
        showToast(`Manifest status updated: ${status} (Copy: ${currentCopy || 'Active'})`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Reset to seed fixtures
  const handleResetData = async () => {
    try {
      await fetch('/api/state?reset=true');
      setFacilities(seedData.facilities as Facility[]);
      setStreams(seedData.material_streams as MaterialStream[]);
      setMatches(seedData.match_proposals as MatchProposal[]);
      const list = seedData.manifests as Form10Manifest[];
      setManifests(
        list.map((m) => ({
          ...m,
          sender_facility: (seedData.facilities as Facility[]).find((f) => f.id === m.sender_facility_id),
          receiver_facility: (seedData.facilities as Facility[]).find((f) => f.id === m.receiver_facility_id),
        }))
      );
      setEsgMetrics({
        total_diverted_mt: 90.0,
        total_savings_inr: 162000,
        total_avoided_co2_mt: 73.8,
        active_symbioses_count: 2,
        hazardous_treated_mt: 20.0,
      });
      showToast('All corridor fixtures reset to default seed state.');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] text-slate-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 max-w-md bg-white border border-emerald-300 shadow-xl rounded-xl p-3.5 text-xs text-slate-900 flex items-center justify-between gap-3 animate-slide-up ring-1 ring-emerald-500/20">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
            </span>
            <span className="font-medium text-slate-800">{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-slate-700 text-xs px-1.5 py-0.5 rounded hover:bg-slate-100 transition"
          >
            ✕
          </button>
        </div>
      )}

      {/* 1. Left Vertical Fixed Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        activeRole={activeRole}
        onRoleChange={setActiveRole}
        onOpenSpecs={() => setIsSpecsModalOpen(true)}
        onResetData={handleResetData}
        matchCount={matches.length}
        manifestCount={manifests.length}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* 2. Main Workspace (shifted by sidebar width on desktop) */}
      <div className="flex-1 flex flex-col min-w-0 md:pl-64">
        {/* Top Header */}
        <TopHeader
          activeTab={activeTab}
          activeRole={activeRole}
          onRoleChange={setActiveRole}
          onToggleMobileMenu={() => setIsMobileMenuOpen((prev) => !prev)}
        />

        {/* Workspace Content Router */}
        <main className="flex-1 pb-16">
          {activeTab === 'DASHBOARD' && (
            <DashboardOverview
              esgMetrics={esgMetrics}
              matches={matches}
              facilities={facilities}
              streams={streams}
              activeRole={activeRole}
              onNavigate={(tab) => setActiveTab(tab)}
              onSelectMatch={(matchId) => {
                setSelectedMatchId(matchId);
                setActiveTab('MATCHES');
              }}
            />
          )}

          {activeTab === 'MATCHES' && (
            <BilateralExchangeCenter
              matches={matches}
              facilities={facilities}
              streams={streams}
              activeRole={activeRole}
              onToggleConsent={handleToggleConsent}
              onGenerateManifest={handleGenerateManifest}
              onViewManifest={(manifestId) => {
                const found = manifests.find((m) => m.id === manifestId);
                if (found) setActiveManifestModal(found);
              }}
              manifests={manifests}
              selectedMatchId={selectedMatchId}
              onSelectMatch={(matchId) => {
                setSelectedMatchId(matchId);
                setActiveTab('MAP');
              }}
            />
          )}

          {activeTab === 'INGEST' && (
            <StreamIngestionPortal
              facilities={facilities}
              onStreamCreated={handleStreamCreated}
              activeRole={activeRole}
              onNavigateToMatches={() => setActiveTab('MATCHES')}
            />
          )}

          {activeTab === 'MAP' && (
            <div className="max-w-7xl mx-auto py-6 px-4">
              <IndustrialMap
                facilities={facilities}
                streams={streams}
                matches={matches}
                selectedMatchId={selectedMatchId}
                onSelectMatch={(matchId) => {
                  setSelectedMatchId(matchId);
                  setActiveTab('MATCHES');
                }}
                activeRole={activeRole}
              />
            </div>
          )}

          {activeTab === 'COMPLIANCE' && (
            <ComplianceCenter
              manifests={manifests}
              facilities={facilities}
              streams={streams}
              matches={matches}
              onOpenManifestModal={(m) => setActiveManifestModal(m)}
              onUpdateStatus={handleUpdateManifestStatus}
              activeRole={activeRole}
            />
          )}
        </main>
      </div>

      {/* Technical Specs & Math Modal */}
      <TechnicalSpecsModal
        isOpen={isSpecsModalOpen}
        onClose={() => setIsSpecsModalOpen(false)}
      />

      {/* CPCB Form 10 Modal */}
      {activeManifestModal && (
        <Form10Modal
          manifest={activeManifestModal}
          onClose={() => setActiveManifestModal(null)}
          onStatusUpdate={(status, copy) => {
            handleUpdateManifestStatus(activeManifestModal.id, status, copy);
          }}
        />
      )}
    </div>
  );
}
