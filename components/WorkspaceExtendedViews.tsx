'use client';

import React from 'react';
import {
  ClipboardList,
  MessageSquareQuote,
  Tags,
  FolderLock,
  MessageSquare,
  BarChart3,
  Settings,
  Building2,
  Tag,
  FileSearch,
  ClipboardCheck,
  Scroll,
  CheckCircle2,
  Lock,
  Download,
  ExternalLink,
  ShieldAlert,
  Send,
  Building,
  ArrowRight,
  TrendingUp,
  Leaf,
  FileText,
  Printer,
} from 'lucide-react';
import { MainNavTab } from './Sidebar';
import { Facility, MaterialStream, MatchProposal, Form10Manifest, ClusterESGMetrics } from '@/types';
import { formatINR, formatNumber } from '@/lib/utils';
import { useAuth } from '@/lib/authContext';

interface WorkspaceExtendedViewsProps {
  activeTab: MainNavTab;
  facilities: Facility[];
  streams: MaterialStream[];
  matches: MatchProposal[];
  manifests: Form10Manifest[];
  esgMetrics: ClusterESGMetrics;
  onNavigate: (tab: MainNavTab) => void;
  onSelectMatch: (matchId: string) => void;
  onOpenManifest: (manifest: Form10Manifest) => void;
}

export const WorkspaceExtendedViews: React.FC<WorkspaceExtendedViewsProps> = ({
  activeTab,
  facilities,
  streams,
  matches,
  manifests,
  esgMetrics,
  onNavigate,
  onSelectMatch,
  onOpenManifest,
}) => {
  const { user } = useAuth();
  const demandStreams = streams.filter((s) => s.stream_type === 'DEMAND');

  // 1. REQUIREMENTS VIEW
  if (activeTab === 'REQUIREMENTS') {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-emerald-600" />
              <h2 className="text-xl font-bold text-slate-900 font-sans">
                Offtaker Feedstock Requirements
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Active secondary raw material procurement mandates from Gujarat co-processing plants and building material manufacturers.
            </p>
          </div>
          <button
            onClick={() => onNavigate('EXCHANGE')}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition"
          >
            + Post Requirement Mandate
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {demandStreams.map((stream) => {
            const fac = facilities.find((f) => f.id === stream.facility_id);

            return (
              <div
                key={stream.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4 hover:border-emerald-500/80 transition"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                      Procurement Mandate
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-1.5">
                      {stream.material_name}
                    </h3>
                  </div>
                  <span className="font-mono text-xs font-bold text-emerald-700 bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg">
                    ₹{stream.price_per_mt}/MT
                  </span>
                </div>

                <div className="text-xs text-slate-500 space-y-1">
                  <div className="flex justify-between">
                    <span>Target Volume:</span>
                    <strong className="text-slate-800">{stream.monthly_volume_mt} MT / month</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Physical State:</span>
                    <strong className="text-slate-800">{stream.physical_state}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Facility Code:</span>
                    <strong className="text-slate-800">{fac?.anonymous_label || 'Consented Plant'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Corridor Zone:</span>
                    <strong className="text-slate-800">{fac?.cluster_zone || 'Ahmedabad Cluster'}</strong>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-mono">
                    {stream.cpcb_waste_code}
                  </span>
                  <button
                    onClick={() => onNavigate('MATCHES')}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                  >
                    <span>View Matches →</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // 2. ENQUIRIES & OFFERS VIEW
  if (activeTab === 'ENQUIRIES') {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-6">
        <div className="border-b border-slate-200 pb-5">
          <div className="flex items-center gap-2">
            <MessageSquareQuote className="w-5 h-5 text-emerald-600" />
            <h2 className="text-xl font-bold text-slate-900 font-sans">
              Enquiries & Bilateral Offers
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Bilateral offers pending counterparty consent or mutual trade-secret disclosure authorization.
          </p>
        </div>

        <div className="space-y-4">
          {matches.map((match) => {
            const supply = streams.find((s) => s.id === match.supply_stream_id);
            const demand = streams.find((s) => s.id === match.demand_stream_id);
            const isUnlocked = match.generator_consent && match.offtaker_consent;

            return (
              <div
                key={match.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm font-bold text-slate-900">
                      Offer Ref #{match.id.toUpperCase()}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isUnlocked
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {isUnlocked ? 'Handshake Finalized' : 'Bilateral Negotiation Pending'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600">
                    Pairing: <strong>{supply?.material_name}</strong> ➔ <strong>{demand?.material_name}</strong>
                  </div>
                  <div className="text-xs text-slate-500">
                    Avoided Cost: <strong className="text-emerald-700">{formatINR(match.economic_benefit_inr)} / mo</strong> • Distance: <strong>{match.transit_distance_km} km</strong>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onNavigate('MATCHES')}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition"
                  >
                    Open Deal Room →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // 3. TRANSACTIONS VIEW
  if (activeTab === 'TRANSACTIONS') {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-6">
        <div className="border-b border-slate-200 pb-5">
          <div className="flex items-center gap-2">
            <Tags className="w-5 h-5 text-emerald-600" />
            <h2 className="text-xl font-bold text-slate-900 font-sans">
              Circular Transaction Ledger
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Settled and active commercial symbiosis contracts with verified weighbridge and cost-arbitrage records.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3.5">Contract / Manifest</th>
                  <th className="px-5 py-3.5">Feedstock Stream</th>
                  <th className="px-5 py-3.5">Monthly Volume</th>
                  <th className="px-5 py-3.5">Commercial Arbitrage</th>
                  <th className="px-5 py-3.5">Avoided Carbon</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {manifests.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-5 py-4 font-mono font-bold text-slate-900">
                      {m.manifest_number}
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-800">
                      {m.material_name}
                    </td>
                    <td className="px-5 py-4 font-bold text-slate-900">
                      {m.quantity_dispatched_mt} MT
                    </td>
                    <td className="px-5 py-4 font-bold text-emerald-700">
                      ₹{(m.quantity_dispatched_mt * 1500).toLocaleString('en-IN')}
                    </td>
                    <td className="px-5 py-4 text-teal-700 font-bold">
                      {(m.quantity_dispatched_mt * 0.82).toFixed(1)} MT CO₂e
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {m.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => onOpenManifest(m)}
                        className="text-xs font-bold text-emerald-700 hover:text-emerald-800 underline"
                      >
                        View Slips
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // 4. DOCUMENTS VIEW
  if (activeTab === 'DOCUMENTS') {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-6">
        <div className="border-b border-slate-200 pb-5">
          <div className="flex items-center gap-2">
            <FolderLock className="w-5 h-5 text-emerald-600" />
            <h2 className="text-xl font-bold text-slate-900 font-sans">
              Statutory Documents & Lab Assays
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Official CPCB Form 10 manifests, NABL-accredited Certificates of Analysis (CoA), and GPCB consent orders.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {manifests.map((m) => (
            <div
              key={m.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-3 hover:border-slate-300 transition"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  CPCB Form 10 Slip
                </span>
                <span className="text-[10px] font-mono text-emerald-700 font-bold">
                  Rule 19 Compliant
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 truncate">
                  {m.manifest_number}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Consignment: {m.material_name} ({m.quantity_dispatched_mt} MT)
                </p>
              </div>

              <div className="text-[11px] text-slate-500 space-y-1 pt-2 border-t border-slate-100">
                <div>Vehicle: <strong className="text-slate-800">{m.vehicle_no}</strong></div>
                <div>Transporter: <strong className="text-slate-800">{m.transporter_name}</strong></div>
                <div>GPCB NOC: <strong className="text-slate-800">{m.spcb_noc_reference}</strong></div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => onOpenManifest(m)}
                  className="flex-1 py-1.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition flex items-center justify-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print 7-Color Copies</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 5. MESSAGES VIEW
  if (activeTab === 'MESSAGES') {
    return (
      <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-6">
        <div className="border-b border-slate-200 pb-5">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-600" />
            <h2 className="text-xl font-bold text-slate-900 font-sans">
              Encrypted Counterparty Messages
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Confidential bilateral exchange communications. Identities remain protected until mutual consent handshake.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden flex flex-col h-[520px]">
          {/* Thread header */}
          <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-900">
                Deal Room #MATCH-001 (Gypsum Sludge ➔ Paver Binder)
              </span>
            </div>
            <span className="text-[10px] font-semibold text-slate-500 uppercase">
              End-to-End Encrypted
            </span>
          </div>

          {/* Messages list */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 text-xs">
            <div className="flex flex-col items-start max-w-md">
              <div className="text-[10px] font-bold text-slate-400 mb-1">
                GIDC-Vatva-Unit-09 (Generator) • Yesterday
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-100 text-slate-800 leading-relaxed rounded-tl-xs">
                We have certified the moisture content at 18.2% and pH at 6.8 after neutralization. Can your kiln accept 45 MT in weekly consignments?
              </div>
            </div>

            <div className="flex flex-col items-end max-w-md ml-auto">
              <div className="text-[10px] font-bold text-slate-400 mb-1">
                Kathwada-Eco-Crete (Offtaker) • Today 10:15 AM
              </div>
              <div className="p-3.5 rounded-2xl bg-emerald-600 text-white leading-relaxed rounded-tr-xs">
                Yes, our paver block formulation can absorb 45 MT/month without pre-drying. We have approved the bilateral consent handshake on our dashboard.
              </div>
            </div>
          </div>

          {/* Input box */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center gap-3">
            <input
              type="text"
              placeholder="Type confidential enquiry to counterparty..."
              className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
            />
            <button className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-1.5 transition">
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 6. ANALYTICS VIEW
  if (activeTab === 'ANALYTICS') {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-6">
        <div className="border-b border-slate-200 pb-5">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-600" />
            <h2 className="text-xl font-bold text-slate-900 font-sans">
              Cluster ESG & Circular Economics Analytics
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time environmental and economic metrics calculated across the Ahmedabad manufacturing cluster.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Landfill Diversion Rate
            </div>
            <div className="text-3xl font-bold text-slate-900">
              {formatNumber(esgMetrics.total_diverted_mt)} <span className="text-sm font-normal text-slate-500">MT/month</span>
            </div>
            <p className="text-xs text-emerald-700 font-medium">
              100% avoided from NEPL / TSDF industrial landfills
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Avoided CO₂ Equivalent
            </div>
            <div className="text-3xl font-bold text-teal-800">
              {formatNumber(esgMetrics.total_avoided_co2_mt)} <span className="text-sm font-normal text-slate-500">MT CO₂e</span>
            </div>
            <p className="text-xs text-slate-500">
              Factor: 0.82 kg CO₂e saved per 1 kg secondary material reused
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Economic Arbitrage
            </div>
            <div className="text-3xl font-bold text-emerald-700">
              {formatINR(esgMetrics.total_savings_inr)}
            </div>
            <p className="text-xs text-slate-500">
              Net savings combining avoided disposal fees and virgin mineral substitution
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 7. SETTINGS VIEW
  if (activeTab === 'SETTINGS') {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-6">
        <div className="border-b border-slate-200 pb-5">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-emerald-600" />
            <h2 className="text-xl font-bold text-slate-900 font-sans">
              Organisation Settings & Privacy Shields
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Configure industrial facility profile, GSTIN verification, SPCB consent orders, and trade-secret masking parameters.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-6 text-xs">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Facility Identity & Compliance</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-500 font-medium block mb-1">Legal Company Name</label>
                <input
                  type="text"
                  readOnly
                  value={user?.facilityName || 'Demo Logistics Services Pvt. Ltd.'}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium text-slate-800"
                />
              </div>
              <div>
                <label className="text-slate-500 font-medium block mb-1">Pseudonym Masked Label</label>
                <input
                  type="text"
                  readOnly
                  value={user?.maskedLabel || 'GIDC-Vatva-Unit-09'}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono font-medium text-slate-800"
                />
              </div>
              <div>
                <label className="text-slate-500 font-medium block mb-1">GSTIN Number</label>
                <input
                  type="text"
                  readOnly
                  value={user?.gstin || '24AABCV5412K1ZT'}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono font-medium text-slate-800"
                />
              </div>
              <div>
                <label className="text-slate-500 font-medium block mb-1">GPCB Consent NOC Reference</label>
                <input
                  type="text"
                  readOnly
                  value="GPCB/AHM-EAST/CCA-5412"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono font-medium text-slate-800"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Trade-Secret Privacy Protections</h3>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">Spatial Jitter Blurring (±1.5 km)</div>
                  <div className="text-slate-500 text-[11px]">Prevent competitor triangulation by adding deterministic noise to public GIS maps.</div>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  Active
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">Bilateral Consent Gate</div>
                  <div className="text-slate-500 text-[11px]">Require two-sided cryptographically signed confirmation before disclosing company name or contact info.</div>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 8. PLATFORM ADMINISTRATION VIEWS
  if (
    activeTab === 'ADMIN_OVERVIEW' ||
    activeTab === 'ADMIN_ORGANISATIONS' ||
    activeTab === 'ADMIN_MODERATION' ||
    activeTab === 'ADMIN_REVIEW' ||
    activeTab === 'ADMIN_OVERSIGHT' ||
    activeTab === 'ADMIN_AUDIT'
  ) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-6">
        <div className="border-b border-slate-200 pb-5">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-600" />
            <h2 className="text-xl font-bold text-slate-900 font-sans">
              Platform Administration & State Regulatory Oversight
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            GPCB Extended Green Node (XGN) administrative cell for monitoring cluster compliance and waste diversion across Gujarat.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-3">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Registered Organisations</div>
            <div className="text-2xl font-bold text-slate-900">{facilities.length} Industrial Units</div>
            <p className="text-xs text-slate-500">Vatva, Naroda, Kathwada & Sanand belts</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-3">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Byproduct Streams</div>
            <div className="text-2xl font-bold text-slate-900">{streams.length} Verified Assays</div>
            <p className="text-xs text-slate-500">Covering CPCB Schedule I & II streams</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-3">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rule 19 Form 10 Manifests</div>
            <div className="text-2xl font-bold text-emerald-700">{manifests.length} Live Consignments</div>
            <p className="text-xs text-slate-500">Continuous chain-of-custody tracking active</p>
          </div>
        </div>

        {/* Facilities Directory Table */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs space-y-3 p-5">
          <h3 className="text-sm font-bold text-slate-900">Registered Industrial Facilities (Gujarat Hub)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Facility Name</th>
                  <th className="px-4 py-3">Cluster Zone</th>
                  <th className="px-4 py-3">Facility Type</th>
                  <th className="px-4 py-3">GSTIN</th>
                  <th className="px-4 py-3">GPCB Consent</th>
                  <th className="px-4 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {facilities.map((fac) => (
                  <tr key={fac.id} className="hover:bg-slate-50/60">
                    <td className="px-4 py-3 font-bold text-slate-900">{fac.legal_name}</td>
                    <td className="px-4 py-3 text-slate-600">{fac.cluster_zone}</td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-slate-700">{fac.facility_type}</span>
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-700">{fac.gstin}</td>
                    <td className="px-4 py-3 font-mono text-slate-700">{fac.spcb_consent_id}</td>
                    <td className="px-4 py-3 text-right">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        VERIFIED
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
