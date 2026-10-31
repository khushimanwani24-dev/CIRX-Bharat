'use client';

import React, { useState } from 'react';
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
  Search,
  Filter,
  Check,
  X,
  AlertTriangle,
  Eye,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  Truck,
  Scale,
  MapPin,
  Plus,
  Clock,
  RefreshCw,
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

interface ChatMessage {
  id: string;
  sender: string;
  senderRole: string;
  time: string;
  text: string;
  isSelf: boolean;
}

interface DocItem {
  id: string;
  title: string;
  type: string;
  category: string;
  date: string;
  facility: string;
  details: string;
  manifestObj?: Form10Manifest;
}

interface ChatThread {
  id: string;
  title: string;
  pairing: string;
  unread: boolean;
  status: string;
  messages: ChatMessage[];
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

  // Local interactive states
  const [demandList, setDemandList] = useState<MaterialStream[]>(() =>
    streams.filter((s) => s.stream_type === 'DEMAND')
  );
  const [isPostReqModalOpen, setIsPostReqModalOpen] = useState(false);
  const [newReqName, setNewReqName] = useState('');
  const [newReqVolume, setNewReqVolume] = useState('60');
  const [newReqPrice, setNewReqPrice] = useState('1200');
  const [newReqWasteCode, setNewReqWasteCode] = useState('Cat 35.3');
  const [newReqState, setNewReqState] = useState<'SOLID' | 'LIQUID' | 'SLUDGE'>('SOLID');

  // Messages interactive state
  const [chatThreads, setChatThreads] = useState<ChatThread[]>([
    {
      id: 'thread-1',
      title: 'Deal Room #MATCH-001',
      pairing: 'Neutralized Gypsum Sludge ➔ Paver Block Binder',
      unread: false,
      status: 'Handshake Approved',
      messages: [
        {
          id: 'm1',
          sender: 'Vatva Specialty Dye-Chem',
          senderRole: 'Generator',
          time: 'Yesterday 3:15 PM',
          text: 'We have certified the moisture content at 12.4% and chlorides at 0.04% via NABL Lab Report #ETL-2026-9021. Can your facility absorb 45 MT weekly?',
          isSelf: false,
        },
        {
          id: 'm2',
          sender: 'Gujarat Co-Processing Kilns',
          senderRole: 'Offtaker',
          time: 'Yesterday 5:40 PM',
          text: 'Assay parameters fall well within our CPCB Rule 9 kiln tolerances. We can take 45 MT every Tuesday. Have approved the bilateral consent handshake on our end.',
          isSelf: true,
        },
        {
          id: 'm3',
          sender: 'Vatva Specialty Dye-Chem',
          senderRole: 'Generator',
          time: 'Today 09:20 AM',
          text: 'Confirmed. Generating CPCB Form 10 transit manifest now. Carrier truck GJ-01-CZ-8821 will report for loading tomorrow at 8:00 AM.',
          isSelf: false,
        },
      ],
    },
    {
      id: 'thread-2',
      title: 'Deal Room #MATCH-002',
      pairing: 'Spent Sulfuric Acid (68%) ➔ Alum Sulfate Manufacturing',
      unread: true,
      status: 'Assay Reviewing',
      messages: [
        {
          id: 'm2-1',
          sender: 'Ankleshwar Synthetics MSME',
          senderRole: 'Generator',
          time: '2 days ago',
          text: 'Batch sample analysis shows iron contamination < 25 ppm and free acidity at 68.4%. Looking for long-term monthly offtake of 80 MT.',
          isSelf: false,
        },
        {
          id: 'm2-2',
          sender: 'Gujarat Co-Processing Kilns',
          senderRole: 'Offtaker',
          time: '1 day ago',
          text: 'Reviewing stoichiometry against our neutralization reactors. Please ensure rubber-lined tanker dispatch.',
          isSelf: true,
        },
      ],
    },
    {
      id: 'thread-3',
      title: 'Deal Room #MATCH-003',
      pairing: 'Foundry Induction Slag ➔ Road Sub-Base Aggregates',
      unread: false,
      status: 'Contract Drafted',
      messages: [
        {
          id: 'm3-1',
          sender: 'Sanand Castings Ltd',
          senderRole: 'Generator',
          time: '3 days ago',
          text: 'Crushed and screened 0-20mm grade slag ready at Sanand yard. Monthly volume approx 120 MT.',
          isSelf: false,
        },
      ],
    },
  ]);
  const [activeThreadId, setActiveThreadId] = useState<string>('thread-1');
  const [chatInput, setChatInput] = useState('');

  // Documents interactive filter & preview state
  const [docFilter, setDocFilter] = useState<'ALL' | 'MANIFEST' | 'ASSAY' | 'CONSENT' | 'MOU'>('ALL');
  const [selectedDocPreview, setSelectedDocPreview] = useState<any | null>(null);

  // Admin moderation queue state
  const [moderationItems, setModerationItems] = useState([
    {
      id: 'mod-1',
      streamName: 'Pre-treated ETP Bio-Sludge (Cat 35.3)',
      generator: 'Vatva Pharma Chem Unit-4',
      volume: '35 MT/mo',
      assayStatus: 'NABL Certified (Moisture 14.1%, pH 7.1)',
      cpcbCode: 'Cat 35.3',
      date: 'Today 10:14 AM',
      status: 'PENDING_APPROVAL',
    },
    {
      id: 'mod-2',
      streamName: 'Secondary Fly Ash (Low Carbon Class F)',
      generator: 'Sabarmati Thermal Aux',
      volume: '150 MT/mo',
      assayStatus: 'Silica > 72%, LOI 2.8%',
      cpcbCode: 'Non-Haz Circular',
      date: 'Yesterday',
      status: 'PENDING_APPROVAL',
    },
    {
      id: 'mod-3',
      streamName: 'Pickling Spent Hydrochloric Acid (14%)',
      generator: 'Naroda Steel Rolling Mills',
      volume: '50 MT/mo',
      assayStatus: 'Free Acid 14.2%, Iron 85 g/L',
      cpcbCode: 'Cat 28.1',
      date: '28 Oct 2026',
      status: 'APPROVED',
    },
  ]);

  // Settings state
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [spatialBlurActive, setSpatialBlurActive] = useState(true);
  const [bilateralGateActive, setBilateralGateActive] = useState(true);
  const [smsAlertsActive, setSmsAlertsActive] = useState(true);
  const [autoForm4Active, setAutoForm4Active] = useState(true);

  // Send message handler
  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const active = chatThreads.find((t) => t.id === activeThreadId);
    if (!active) return;

    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      sender: user?.facilityName || 'Current Organisation',
      senderRole: user?.role || 'Offtaker',
      time: 'Just now',
      text: chatInput.trim(),
      isSelf: true,
    };

    setChatThreads((prev) =>
      prev.map((t) => (t.id === activeThreadId ? { ...t, messages: [...t.messages, newMsg] } : t))
    );
    setChatInput('');
  };

  // Add new requirement handler
  const handleCreateRequirement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReqName.trim()) return;

    const createdStream: MaterialStream = {
      id: `req-${Date.now()}`,
      facility_id: user?.id || 'fac-cement-01',
      stream_type: 'DEMAND',
      material_name: newReqName.trim(),
      cpcb_waste_code: newReqWasteCode,
      monthly_volume_mt: parseFloat(newReqVolume) || 50,
      physical_state: newReqState,
      price_per_mt: parseFloat(newReqPrice) || 1000,
      is_hazardous: newReqWasteCode.toLowerCase().includes('cat'),
      assay_report_url: '',
    };

    setDemandList((prev) => [createdStream, ...prev]);
    setIsPostReqModalOpen(false);
    setNewReqName('');
  };

  // ==========================================
  // 1. REQUIREMENTS VIEW
  // ==========================================
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
              Active secondary raw material procurement mandates from Gujarat cement plants, AAC block makers, and road contractors.
            </p>
          </div>
          <button
            onClick={() => setIsPostReqModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs hover:shadow transition flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Post Requirement Mandate</span>
          </button>
        </div>

        {/* Requirements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {demandList.map((stream) => {
            const fac = facilities.find((f) => f.id === stream.facility_id);

            return (
              <div
                key={stream.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4 hover:border-emerald-500/80 transition flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                        Procurement Mandate
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 mt-1.5">
                        {stream.material_name}
                      </h3>
                    </div>
                    <span className="font-mono text-xs font-bold text-emerald-700 bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg shrink-0">
                      ₹{stream.price_per_mt}/MT
                    </span>
                  </div>

                  <div className="text-xs text-slate-500 space-y-1.5 p-3 rounded-xl bg-slate-50/70 border border-slate-100">
                    <div className="flex justify-between">
                      <span>Monthly Intake:</span>
                      <strong className="text-slate-800">{stream.monthly_volume_mt} MT / mo</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Physical Form:</span>
                      <strong className="text-slate-800">{stream.physical_state}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Buyer Cluster:</span>
                      <strong className="text-slate-800">{fac?.cluster_zone || 'Kathwada / Sanand Belt'}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Rule 9 SOP:</span>
                      <strong className="text-emerald-700 font-bold">Authorized</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-mono">
                    {stream.cpcb_waste_code}
                  </span>
                  <button
                    onClick={() => onNavigate('MATCHES')}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group"
                  >
                    <span>View Matched Generators</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal: Post New Mandate */}
        {isPostReqModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-base text-slate-900">Post Feedstock Requirement Mandate</h3>
                </div>
                <button
                  onClick={() => setIsPostReqModalOpen(false)}
                  className="text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateRequirement} className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Target Secondary Material / Mineral</label>
                  <input
                    type="text"
                    required
                    value={newReqName}
                    onChange={(e) => setNewReqName(e.target.value)}
                    placeholder="e.g. Neutralized Gypsum Sludge, Blast Furnace Slag, Spent Acid"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Monthly Intake Volume (MT)</label>
                    <input
                      type="number"
                      required
                      value={newReqVolume}
                      onChange={(e) => setNewReqVolume(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500 text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Target Purchase Price (₹/MT)</label>
                    <input
                      type="number"
                      required
                      value={newReqPrice}
                      onChange={(e) => setNewReqPrice(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">CPCB Waste Code</label>
                    <input
                      type="text"
                      value={newReqWasteCode}
                      onChange={(e) => setNewReqWasteCode(e.target.value)}
                      placeholder="e.g. Cat 35.3 or Non-Haz"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500 text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Required Physical State</label>
                    <select
                      value={newReqState}
                      onChange={(e) => setNewReqState(e.target.value as 'SOLID' | 'LIQUID' | 'SLUDGE')}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500 text-xs"
                    >
                      <option value="SOLID">Solid (Dry / Powder / Granular)</option>
                      <option value="SLUDGE">Sludge (Semi-solid / Filter Cake)</option>
                      <option value="LIQUID">Liquid (Aqueous / Spent Acid)</option>
                    </select>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-[11px] text-emerald-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Mandate will be automatically cross-referenced against NABL-certified generator streams in a 150 km corridor.</span>
                </div>

                <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsPostReqModalOpen(false)}
                    className="px-3.5 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs transition"
                  >
                    Publish Requirement Mandate
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // 2. ENQUIRIES & OFFERS VIEW
  // ==========================================
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
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-300 transition"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm font-bold text-slate-900">
                      Offer Ref #{match.id.toUpperCase()}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        isUnlocked
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {isUnlocked ? 'Handshake Finalized (Unmasked)' : 'Bilateral Negotiation Pending'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-700 flex items-center gap-2">
                    <strong className="text-slate-900">{supply?.material_name}</strong>
                    <span>➔ Replaces</span>
                    <strong className="text-slate-900">{demand?.material_name}</strong>
                  </div>
                  <div className="text-xs text-slate-500 flex flex-wrap items-center gap-4">
                    <span>Monthly Savings: <strong className="text-emerald-700">{formatINR(match.economic_benefit_inr)}</strong></span>
                    <span>•</span>
                    <span>Transit Distance: <strong>{match.transit_distance_km} km</strong> (Sub-150 km)</span>
                    <span>•</span>
                    <span>Avoided Carbon: <strong className="text-teal-700">{match.avoided_co2_mt} MT CO₂e</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      onSelectMatch(match.id);
                      onNavigate('MATCHES');
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition flex items-center gap-1.5"
                  >
                    <span>Open Deal Room</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ==========================================
  // 3. TRANSACTIONS VIEW
  // ==========================================
  if (activeTab === 'TRANSACTIONS') {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
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
          <div className="text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            Total Settled Value: <strong className="text-emerald-700 font-bold">{formatINR(esgMetrics.total_savings_inr)}</strong>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3.5">Contract / Manifest</th>
                  <th className="px-5 py-3.5">Feedstock Stream</th>
                  <th className="px-5 py-3.5">Tonnage Dispatched</th>
                  <th className="px-5 py-3.5">Arbitrage Saved</th>
                  <th className="px-5 py-3.5">Avoided Carbon</th>
                  <th className="px-5 py-3.5">GPCB Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {manifests.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-5 py-4">
                      <div className="font-mono font-bold text-slate-900">{m.manifest_number}</div>
                      <div className="text-[10px] text-slate-400">Truck: {m.vehicle_no}</div>
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-800">
                      <div>{m.material_name}</div>
                      <div className="text-[10px] text-slate-400">Transporter: {m.transporter_name}</div>
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
                        Inspect Form 10
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

  // ==========================================
  // 4. DOCUMENTS VIEW (VAULT)
  // ==========================================
  if (activeTab === 'DOCUMENTS') {
    const sampleDocs: DocItem[] = [
      {
        id: 'doc-nabl-1',
        title: 'NABL Certificate of Analysis (CoA) #ETL-2026-9021',
        type: 'ASSAY',
        category: 'Lab Report',
        date: '24 Oct 2026',
        facility: 'Vatva Specialty Dye-Chem',
        details: 'Assay verified: Purity 91.4%, Chlorides 0.04%, Fluorides 0.02%, Moisture 11.2%, pH 7.2. Certified under test method IS 1288.',
      },
      {
        id: 'doc-cto-1',
        title: 'GPCB Consolidated Consent to Operate (CC&A) #5412',
        type: 'CONSENT',
        category: 'Statutory Order',
        date: '15 Jan 2026',
        facility: 'Gujarat Co-Processing Kilns',
        details: 'Authorized under Hazardous Waste Rules 2016 for co-processing of Cat 35.3 gypsum and spent acids up to 1,200 MT/year.',
      },
      {
        id: 'doc-mou-1',
        title: 'Bilateral Industrial Symbiosis Agreement #MOU-2026-08',
        type: 'MOU',
        category: 'Legal Contract',
        date: '26 Oct 2026',
        facility: 'Vatva Dye-Chem ➔ Gujarat Cement',
        details: 'Mutual NDA and 12-month supply agreement with pre-contracted emergency TSDF fallback diversion clauses.',
      },
      ...manifests.map((m) => {
        const senderFac = facilities.find((f) => f.id === m.sender_facility_id);
        const receiverFac = facilities.find((f) => f.id === m.receiver_facility_id);
        const senderName = m.sender_facility?.legal_name || senderFac?.legal_name || 'Vatva Generator';
        const receiverName = m.receiver_facility?.legal_name || receiverFac?.legal_name || 'Gujarat Kilns';
        return {
          id: m.id,
          title: `CPCB Rule 19 Form 10 Manifest (${m.manifest_number})`,
          type: 'MANIFEST',
          category: 'Transit Manifest',
          date: m.dispatch_date || 'Active',
          facility: `${senderName} ➔ ${receiverName}`,
          details: `Official 7-color statutory manifest for ${m.quantity_dispatched_mt} MT ${m.material_name}. Vehicle ${m.vehicle_no}.`,
          manifestObj: m,
        };
      }),
    ];

    const filteredDocs = docFilter === 'ALL' ? sampleDocs : sampleDocs.filter((d) => d.type === docFilter);

    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <FolderLock className="w-5 h-5 text-emerald-600" />
              <h2 className="text-xl font-bold text-slate-900 font-sans">
                Statutory Documents & Lab Assays Vault
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Official CPCB Form 10 manifests, NABL-accredited Certificates of Analysis (CoA), and GPCB consent orders.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs text-xs">
            {(['ALL', 'MANIFEST', 'ASSAY', 'CONSENT', 'MOU'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setDocFilter(f)}
                className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition ${
                  docFilter === f ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {f === 'ALL' ? 'All Docs' : f}
              </button>
            ))}
          </div>
        </div>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-3 hover:border-slate-300 transition flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                    {doc.category}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-700 font-bold">
                    Verified Digital Seal
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {doc.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Facility: <strong className="text-slate-700">{doc.facility}</strong>
                  </p>
                </div>

                <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 leading-relaxed">
                  {doc.details}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="text-[10px] text-slate-400">{doc.date}</span>
                <button
                  onClick={() => {
                    if (doc.manifestObj) {
                      onOpenManifest(doc.manifestObj);
                    } else {
                      setSelectedDocPreview(doc);
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview Doc</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Generic Doc Preview Modal */}
        {selectedDocPreview && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-sm text-slate-900">{selectedDocPreview.title}</h3>
                </div>
                <button onClick={() => setSelectedDocPreview(null)} className="text-slate-400 hover:text-slate-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border text-xs space-y-3 font-mono">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500">Document Type:</span>
                  <span className="font-bold text-slate-900">{selectedDocPreview.category}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500">Issuer / Authority:</span>
                  <span className="font-bold text-slate-900">{selectedDocPreview.facility}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500">Digital Timestamp:</span>
                  <span className="text-slate-900">{selectedDocPreview.date}</span>
                </div>
                <div className="pt-1 text-slate-700 leading-relaxed font-sans text-xs">
                  {selectedDocPreview.details}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Document</span>
                </button>
                <button
                  onClick={() => setSelectedDocPreview(null)}
                  className="px-4 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // 5. MESSAGES VIEW (REAL-TIME INTERACTIVE)
  // ==========================================
  if (activeTab === 'MESSAGES') {
    const currentThread = chatThreads.find((t) => t.id === activeThreadId) || chatThreads[0];

    return (
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-6">
        <div className="border-b border-slate-200 pb-5">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-600" />
            <h2 className="text-xl font-bold text-slate-900 font-sans">
              Encrypted Counterparty B2B Messages
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            End-to-end encrypted deal negotiation rooms. Industrial identities remain protected until mutual consent handshake.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden flex flex-col md:flex-row h-[560px]">
          {/* Threads List Sidebar */}
          <div className="w-full md:w-80 border-r border-slate-200 bg-slate-50/50 flex flex-col">
            <div className="p-3.5 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Active Deal Rooms ({chatThreads.length})
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {chatThreads.map((thread) => {
                const isActive = thread.id === activeThreadId;
                return (
                  <button
                    key={thread.id}
                    onClick={() => setActiveThreadId(thread.id)}
                    className={`w-full text-left p-3.5 transition flex flex-col gap-1 ${
                      isActive ? 'bg-white border-l-3 border-emerald-600 shadow-2xs' : 'hover:bg-slate-100/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900 truncate">{thread.title}</span>
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                        {thread.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">{thread.pairing}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                      {thread.messages[thread.messages.length - 1]?.text}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Chat Conversation Area */}
          <div className="flex-1 flex flex-col bg-white">
            {/* Header */}
            <div className="px-5 py-3.5 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-slate-900">{currentThread.title}</span>
                </div>
                <div className="text-[11px] text-slate-500">{currentThread.pairing}</div>
              </div>
              <span className="text-[10px] font-semibold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-full">
                Zero-Knowledge Masked
              </span>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4 text-xs">
              {currentThread.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col max-w-md ${msg.isSelf ? 'items-end ml-auto' : 'items-start'}`}
                >
                  <div className="text-[10px] font-bold text-slate-400 mb-1 flex items-center gap-1.5">
                    <span>{msg.sender} ({msg.senderRole})</span>
                    <span>•</span>
                    <span>{msg.time}</span>
                  </div>
                  <div
                    className={`p-3.5 rounded-2xl leading-relaxed text-xs ${
                      msg.isSelf
                        ? 'bg-emerald-600 text-white rounded-tr-xs shadow-2xs'
                        : 'bg-slate-100 text-slate-800 rounded-tl-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Footer */}
            <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendMessage();
                }}
                placeholder="Type confidential negotiation message or assay enquiry..."
                className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={handleSendMessage}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-1.5 transition"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // 6. ANALYTICS VIEW
  // ==========================================
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

        {/* 3 Main KPIs */}
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

        {/* Visual Monthly Diversion Trend (Simulated SVG Bar Chart) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Cumulative Monthly Waste Diversion (MT)</h3>
              <p className="text-xs text-slate-500">Corridor throughput trajectory across Vatva, Naroda and Sanand</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              +42% Growth MoM
            </span>
          </div>

          <div className="grid grid-cols-6 gap-3 items-end h-44 pt-6 pb-2 border-b border-slate-100">
            {[
              { month: 'May', val: 32, h: '35%' },
              { month: 'Jun', val: 48, h: '50%' },
              { month: 'Jul', val: 62, h: '65%' },
              { month: 'Aug', val: 78, h: '80%' },
              { month: 'Sep', val: 86, h: '90%' },
              { month: 'Oct (Live)', val: 90, h: '100%', highlight: true },
            ].map((bar) => (
              <div key={bar.month} className="flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[10px] font-bold text-slate-700 group-hover:text-emerald-700">{bar.val} MT</span>
                <div
                  style={{ height: bar.h }}
                  className={`w-full max-w-[48px] rounded-t-xl transition-all duration-300 ${
                    bar.highlight ? 'bg-emerald-600 shadow-sm' : 'bg-slate-200 hover:bg-slate-300'
                  }`}
                />
                <span className="text-[11px] text-slate-500 font-medium">{bar.month}</span>
              </div>
            ))}
          </div>

          {/* Sector Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block text-[10px]">Cement Kiln Co-Processing</span>
              <strong className="text-slate-900 text-sm">54% of Volume</strong>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block text-[10px]">AAC Block & Paver Binding</span>
              <strong className="text-slate-900 text-sm">31% of Volume</strong>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block text-[10px]">Alum & Inorganic Recovery</span>
              <strong className="text-slate-900 text-sm">15% of Volume</strong>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // 7. SETTINGS VIEW
  // ==========================================
  if (activeTab === 'SETTINGS') {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-5">
          <div>
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
          {settingsSaved && (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 animate-in fade-in">
              Preferences Saved ✓
            </span>
          )}
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-6 text-xs">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Facility Identity & Compliance Profile</h3>
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
                <label className="text-slate-500 font-medium block mb-1">GSTIN Identifier</label>
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
            <h3 className="text-sm font-bold text-slate-900">Trade-Secret Privacy Protections & Telemetry</h3>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-800">Spatial Jitter Blurring (±1.5 km)</div>
                <div className="text-slate-500 text-[11px]">Prevent competitor triangulation by adding deterministic noise to public GIS maps.</div>
              </div>
              <button
                onClick={() => {
                  setSpatialBlurActive(!spatialBlurActive);
                  setSettingsSaved(true);
                  setTimeout(() => setSettingsSaved(false), 2500);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  spatialBlurActive ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {spatialBlurActive ? 'Active' : 'Disabled'}
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-800">Two-Sided Consent Handshake Gate</div>
                <div className="text-slate-500 text-[11px]">Require bilateral approval before disclosing company name or contact info.</div>
              </div>
              <button
                onClick={() => {
                  setBilateralGateActive(!bilateralGateActive);
                  setSettingsSaved(true);
                  setTimeout(() => setSettingsSaved(false), 2500);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  bilateralGateActive ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {bilateralGateActive ? 'Active' : 'Disabled'}
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-800">Automated GPCB Form 4 Annual Returns Sync</div>
                <div className="text-slate-500 text-[11px]">Compile live dispatches into pre-filled Rule 20 annual return packages.</div>
              </div>
              <button
                onClick={() => {
                  setAutoForm4Active(!autoForm4Active);
                  setSettingsSaved(true);
                  setTimeout(() => setSettingsSaved(false), 2500);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  autoForm4Active ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {autoForm4Active ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // 8. DEDICATED PLATFORM ADMINISTRATION VIEWS
  // ==========================================

  // 8A. ADMIN OVERVIEW
  if (activeTab === 'ADMIN_OVERVIEW') {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-6">
        <div className="border-b border-slate-200 pb-5">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-amber-600" />
            <h2 className="text-xl font-bold text-slate-900 font-sans">
              State Regulatory Administration & GPCB XGN Oversight
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Executive monitoring dashboard for Gujarat Pollution Control Board (GPCB) vigilance officers and platform administrators.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Registered Units</div>
            <div className="text-2xl font-bold text-slate-900">{facilities.length} Facilities</div>
            <div className="text-[11px] text-emerald-700 font-semibold">100% CTO Verified</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Listed Byproducts</div>
            <div className="text-2xl font-bold text-slate-900">{streams.length} Streams</div>
            <div className="text-[11px] text-slate-500">CPCB Cat 35.3, 28.1 & Non-Haz</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Live Form 10s</div>
            <div className="text-2xl font-bold text-emerald-700">{manifests.length} Active</div>
            <div className="text-[11px] text-slate-500">GPS geofence corridor tracked</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Audit Pass Rate</div>
            <div className="text-2xl font-bold text-slate-900">99.8%</div>
            <div className="text-[11px] text-emerald-700 font-semibold">Zero roadside dumps detected</div>
          </div>
        </div>

        {/* Quick Links for Admin */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => onNavigate('ADMIN_MODERATION')}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-amber-500/80 text-left space-y-2 shadow-2xs transition group"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900 group-hover:text-amber-700">Listing Moderation Queue</span>
              <span className="text-xs font-mono font-bold bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200">
                {moderationItems.filter((i) => i.status === 'PENDING_APPROVAL').length} Pending
              </span>
            </div>
            <p className="text-xs text-slate-500">Approve or reject newly registered hazardous byproduct streams before matching.</p>
          </button>

          <button
            onClick={() => onNavigate('ADMIN_OVERSIGHT')}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-amber-500/80 text-left space-y-2 shadow-2xs transition group"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900 group-hover:text-amber-700">Transaction Oversight</span>
              <Truck className="w-4 h-4 text-slate-400 group-hover:text-amber-600" />
            </div>
            <p className="text-xs text-slate-500">Inspect live truck telemetry, gross-tare weighbridge readings, and delivery confirmations.</p>
          </button>

          <button
            onClick={() => onNavigate('ADMIN_AUDIT')}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-amber-500/80 text-left space-y-2 shadow-2xs transition group"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900 group-hover:text-amber-700">Regulatory Audit Trail</span>
              <Scroll className="w-4 h-4 text-slate-400 group-hover:text-amber-600" />
            </div>
            <p className="text-xs text-slate-500">Cryptographically verifiable immutable ledger of all consent handshakes and dispatches.</p>
          </button>
        </div>
      </div>
    );
  }

  // 8B. ADMIN ORGANISATIONS DIRECTORY
  if (activeTab === 'ADMIN_ORGANISATIONS') {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amber-600" />
              <h2 className="text-xl font-bold text-slate-900 font-sans">
                Industrial Organisations Directory (GPCB Cell)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Complete registry of certified facilities across Gujarat with GPCB Consent-to-Operate (CTO) verification.
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700">
            {facilities.length} Verified Facilities
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3.5">Company Legal Name</th>
                  <th className="px-5 py-3.5">Industrial Zone</th>
                  <th className="px-5 py-3.5">Facility Classification</th>
                  <th className="px-5 py-3.5">GSTIN</th>
                  <th className="px-5 py-3.5">GPCB Consent NOC</th>
                  <th className="px-5 py-3.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {facilities.map((fac) => (
                  <tr key={fac.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-5 py-4 font-bold text-slate-900">{fac.legal_name}</td>
                    <td className="px-5 py-4 text-slate-600">{fac.cluster_zone}</td>
                    <td className="px-5 py-4">
                      <span className="font-semibold text-slate-700">{fac.facility_type}</span>
                    </td>
                    <td className="px-5 py-4 font-mono text-slate-700">{fac.gstin}</td>
                    <td className="px-5 py-4 font-mono text-slate-700">{fac.spcb_consent_id}</td>
                    <td className="px-5 py-4 text-right">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        ACTIVE CTO
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

  // 8C. ADMIN LISTING MODERATION
  if (activeTab === 'ADMIN_MODERATION') {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-6">
        <div className="border-b border-slate-200 pb-5">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-amber-600" />
            <h2 className="text-xl font-bold text-slate-900 font-sans">
              Stream Listing Moderation Queue
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            GPCB vetting desk: Verify hazardous waste categorization (Schedule I/II) and NABL chemical reports before approving for corridor matching.
          </p>
        </div>

        <div className="space-y-4">
          {moderationItems.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <span className="font-bold text-sm text-slate-900">{item.streamName}</span>
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                    {item.cpcbCode}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.status === 'APPROVED'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {item.status === 'APPROVED' ? 'Vetted & Approved' : 'Pending GPCB Inspection'}
                  </span>
                </div>
                <div className="text-xs text-slate-600">
                  Generator: <strong>{item.generator}</strong> • Monthly Volume: <strong>{item.volume}</strong>
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Lab Assay: {item.assayStatus}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {item.status === 'PENDING_APPROVAL' ? (
                  <>
                    <button
                      onClick={() => {
                        setModerationItems((prev) =>
                          prev.map((i) => (i.id === item.id ? { ...i, status: 'APPROVED' } : i))
                        );
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition"
                    >
                      Approve for Exchange
                    </button>
                    <button
                      onClick={() => {
                        setModerationItems((prev) => prev.filter((i) => i.id !== item.id));
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 font-semibold text-xs transition"
                    >
                      Flag Impurities
                    </button>
                  </>
                ) : (
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Listing Live on Grid</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 8D. ADMIN REVIEW QUEUE
  if (activeTab === 'ADMIN_REVIEW') {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-6">
        <div className="border-b border-slate-200 pb-5">
          <div className="flex items-center gap-2">
            <FileSearch className="w-5 h-5 text-amber-600" />
            <h2 className="text-xl font-bold text-slate-900 font-sans">
              Chemical Assay Review Queue (CPCB Rule 9 Gatekeeper)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Validate chemical impurity thresholds against cement rotary kiln tolerance criteria (Chlorides &lt; 0.1%, Fluorides &lt; 0.15%, Moisture &lt; 15%).
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <div className="font-bold text-sm text-slate-900">Vatva Chemical Gypsum vs Sanand Cement Rotary Kiln</div>
              <div className="text-xs text-slate-500">Pairing Ref #MATCH-001 • Test Lab: NABL-Accredited EnviroTech Labs</div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              Assay Passed (100% Fit)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-400 block text-[10px]">Chlorides (Cl⁻)</span>
              <strong className="text-slate-900 text-sm">0.04%</strong>
              <div className="text-[10px] text-emerald-700 font-medium">Safe (&lt; 0.10% Max)</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-400 block text-[10px]">Fluorides (F⁻)</span>
              <strong className="text-slate-900 text-sm">0.02%</strong>
              <div className="text-[10px] text-emerald-700 font-medium">Safe (&lt; 0.15% Max)</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-400 block text-[10px]">Moisture Content</span>
              <strong className="text-slate-900 text-sm">11.2%</strong>
              <div className="text-[10px] text-emerald-700 font-medium">Within Limit (&lt; 15% Max)</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-400 block text-[10px]">Heavy Metals (Pb, Cd, As)</span>
              <strong className="text-slate-900 text-sm">&lt; 5 ppm</strong>
              <div className="text-[10px] text-emerald-700 font-medium">Below TCLP Threshold</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Assay conforms to CPCB Guidelines for Co-Processing of Secondary Gypsum in Clinker Production.</span>
            </div>
            <span className="font-mono text-[11px] font-bold text-emerald-800">Rule 9 SOP Verified</span>
          </div>
        </div>
      </div>
    );
  }

  // 8E. ADMIN TRANSACTION OVERSIGHT
  if (activeTab === 'ADMIN_OVERSIGHT') {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-6">
        <div className="border-b border-slate-200 pb-5">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-amber-600" />
            <h2 className="text-xl font-bold text-slate-900 font-sans">
              Live Consignment Telemetry & Weighbridge Oversight
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time transit surveillance: Dual weighbridge gross-tare reconciliation, GPS device tracking, and FASTag toll verification.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3.5">Manifest No.</th>
                  <th className="px-5 py-3.5">Truck Reg / FASTag</th>
                  <th className="px-5 py-3.5">Consignment</th>
                  <th className="px-5 py-3.5">Origin Weight</th>
                  <th className="px-5 py-3.5">Receiver Weight</th>
                  <th className="px-5 py-3.5">Variance</th>
                  <th className="px-5 py-3.5 text-right">Route Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {manifests.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-5 py-4 font-mono font-bold text-slate-900">{m.manifest_number}</td>
                    <td className="px-5 py-4">
                      <div className="font-bold text-slate-800">{m.vehicle_no}</div>
                      <div className="text-[10px] text-slate-400 font-mono">FASTag Verified</div>
                    </td>
                    <td className="px-5 py-4">{m.material_name}</td>
                    <td className="px-5 py-4 font-mono font-semibold text-slate-700">{m.quantity_dispatched_mt}.00 MT</td>
                    <td className="px-5 py-4 font-mono font-semibold text-slate-700">{m.quantity_dispatched_mt - 0.05} MT</td>
                    <td className="px-5 py-4">
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        0.2% (Normal)
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-600 text-white">
                        Geofenced In-Corridor
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

  // 8F. ADMIN IMMUTABLE AUDIT LOG
  if (activeTab === 'ADMIN_AUDIT') {
    const auditEvents = [
      {
        id: 'aud-109',
        timestamp: 'Today 10:24:18 AM',
        action: 'MANIFEST_FORM10_MINTED',
        actor: 'GPCB Authorized System Token',
        entityId: 'MNF-GJ-2026-9021',
        hash: '7f9c2a1e84b035d...e29f',
        status: 'TAMPER_PROOF',
      },
      {
        id: 'aud-108',
        timestamp: 'Today 09:15:02 AM',
        action: 'MUTUAL_CONSENT_HANDSHAKE_EXECUTED',
        actor: 'Vatva Specialty Dye-Chem & Gujarat Kilns',
        entityId: 'MATCH-001',
        hash: 'a3d489b1c70e241...5f11',
        status: 'TAMPER_PROOF',
      },
      {
        id: 'aud-107',
        timestamp: 'Yesterday 04:32:11 PM',
        action: 'NABL_LAB_ASSAY_INGESTED',
        actor: 'EnviroTech LIMS API Gateway',
        entityId: 'STREAM-GYP-01',
        hash: 'c8812ef0934ab31...88c2',
        status: 'TAMPER_PROOF',
      },
      {
        id: 'aud-106',
        timestamp: '28 Oct 2026 11:20:45 AM',
        action: 'GPCB_CTO_CONSENT_REVALIDATED',
        actor: 'GPCB XGN Sync Bot',
        entityId: 'FAC-VATVA-01',
        hash: 'b1409ac3710fe91...33d0',
        status: 'TAMPER_PROOF',
      },
    ];

    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <Scroll className="w-5 h-5 text-amber-600" />
              <h2 className="text-xl font-bold text-slate-900 font-sans">
                Statutory Immutable Audit Trail
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Cryptographically chained audit ledger providing tamper-proof evidence for GPCB environmental courts and vigilance inspections.
            </p>
          </div>
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-1.5 transition self-start sm:self-auto"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Audit Certificate</span>
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3.5">Timestamp</th>
                  <th className="px-5 py-3.5">Event Signature</th>
                  <th className="px-5 py-3.5">Actor / Entity</th>
                  <th className="px-5 py-3.5 font-mono">Entity Ref</th>
                  <th className="px-5 py-3.5 font-mono">SHA-256 Ledger Hash</th>
                  <th className="px-5 py-3.5 text-right">Integrity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditEvents.map((evt) => (
                  <tr key={evt.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-5 py-4 text-slate-500 whitespace-nowrap">{evt.timestamp}</td>
                    <td className="px-5 py-4 font-bold text-slate-900 font-mono text-[11px]">{evt.action}</td>
                    <td className="px-5 py-4 text-slate-700">{evt.actor}</td>
                    <td className="px-5 py-4 font-mono font-semibold text-slate-800">{evt.entityId}</td>
                    <td className="px-5 py-4 font-mono text-[10px] text-slate-400">{evt.hash}</td>
                    <td className="px-5 py-4 text-right">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        VERIFIED ✓
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
