import {
  Form10Manifest,
  Facility,
  MaterialStream,
  MatchProposal,
  ManifestCopyMeta,
  ManifestCopyColor,
} from '@/types';

/**
 * CIRX Bharat Regulatory Compliance Engine: CPCB Form 10 Manifest Manager
 * Compliance with Rule 19 of Hazardous and Other Wastes (Management and Transboundary Movement) Rules, 2016.
 */

export const FORM_10_COPIES: ManifestCopyMeta[] = [
  {
    copy_number: 1,
    color: 'WHITE',
    title: 'Copy 1 (White) - GPCB Dispatch Notification',
    recipient_role: 'Gujarat Pollution Control Board (GPCB) - Regional Office Ahmedabad East (Paryavaran Bhavan, Vatva)',
    regulatory_instruction: 'To be forwarded by the Sender to GPCB (XGN) within 3 working days of dispatch.',
  },
  {
    copy_number: 2,
    color: 'YELLOW',
    title: 'Copy 2 (Yellow) - Sender Consignment Record',
    recipient_role: 'Sender / Generator Unit Archive',
    regulatory_instruction: 'To be retained by the Sender after obtaining the signature of the Transporter.',
  },
  {
    copy_number: 3,
    color: 'PINK',
    title: 'Copy 3 (Pink) - Receiver Offtake Archive',
    recipient_role: 'Receiver / Co-processor / Recipient Facility',
    regulatory_instruction: 'To be retained by the Receiver for environmental compliance records and audits.',
  },
  {
    copy_number: 4,
    color: 'ORANGE',
    title: 'Copy 4 (Orange) - Transporter In-Transit Escort',
    recipient_role: 'Authorized Transporter Vehicle Driver',
    regulatory_instruction: 'To be handed over to the Transporter by the Sender to accompany the waste shipment.',
  },
  {
    copy_number: 5,
    color: 'GREEN',
    title: 'Copy 5 (Green) - GPCB Delivery Acknowledgment',
    recipient_role: 'Gujarat Pollution Control Board (GPCB) - Regional Office Ahmedabad East (Paryavaran Bhavan, Vatva)',
    regulatory_instruction: 'To be sent by the Receiver to GPCB via XGN after receipt and weighbridge acceptance of waste.',
  },
  {
    copy_number: 6,
    color: 'BLUE',
    title: 'Copy 6 (Blue) - Sender Closure Certificate',
    recipient_role: 'Sender / Generator Unit Final Clearance',
    regulatory_instruction: 'To be forwarded by the Receiver back to the Sender with stamp as proof of safe delivery.',
  },
  {
    copy_number: 7,
    color: 'GREY',
    title: 'Copy 7 (Grey) - Transporter Clearance Voucher',
    recipient_role: 'Transporter Operations Records',
    regulatory_instruction: 'To be given to the Transporter by the Receiver after unloading of the consignment.',
  },
];

export const COPY_COLOR_THEMES: Record<
  ManifestCopyColor,
  { bg: string; border: string; badge: string; text: string; headerBg: string }
> = {
  WHITE: {
    bg: 'bg-white',
    border: 'border-slate-300',
    badge: 'bg-slate-100 text-slate-800 border-slate-300',
    text: 'text-slate-900',
    headerBg: 'bg-slate-50',
  },
  YELLOW: {
    bg: 'bg-amber-50/70',
    border: 'border-amber-300',
    badge: 'bg-amber-100 text-amber-900 border-amber-300',
    text: 'text-amber-950',
    headerBg: 'bg-amber-100/60',
  },
  PINK: {
    bg: 'bg-pink-50/70',
    border: 'border-pink-300',
    badge: 'bg-pink-100 text-pink-900 border-pink-300',
    text: 'text-pink-950',
    headerBg: 'bg-pink-100/60',
  },
  ORANGE: {
    bg: 'bg-orange-50/70',
    border: 'border-orange-300',
    badge: 'bg-orange-100 text-orange-900 border-orange-300',
    text: 'text-orange-950',
    headerBg: 'bg-orange-100/60',
  },
  GREEN: {
    bg: 'bg-emerald-50/70',
    border: 'border-emerald-300',
    badge: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    text: 'text-emerald-950',
    headerBg: 'bg-emerald-100/60',
  },
  BLUE: {
    bg: 'bg-sky-50/70',
    border: 'border-sky-300',
    badge: 'bg-sky-100 text-sky-900 border-sky-300',
    text: 'text-sky-950',
    headerBg: 'bg-sky-100/60',
  },
  GREY: {
    bg: 'bg-zinc-100/70',
    border: 'border-zinc-300',
    badge: 'bg-zinc-200 text-zinc-900 border-zinc-400',
    text: 'text-zinc-950',
    headerBg: 'bg-zinc-200/60',
  },
};

/**
 * Generate a new CPCB Form 10 Manifest from an approved match proposal
 */
export function generateForm10Manifest(
  match: MatchProposal,
  supplyStream: MaterialStream,
  sender: Facility,
  receiver: Facility,
  transporterInfo?: {
    transporter_name?: string;
    vehicle_no?: string;
    driver_name?: string;
    driver_phone?: string;
    packaging_type?: string;
  }
): Form10Manifest {
  const serial = Math.floor(1000 + Math.random() * 9000);
  const now = new Date();
  const deliveryEstimate = new Date(now.getTime() + 4 * 60 * 60 * 1000); // +4 hours

  const manifestNumber = `GPCB/XGN/AHM/${now.getFullYear()}/F10-${serial}`;

  let instructions = 'Comply with Rule 19 transport guidelines. Keep emergency TREMCARD in cab.';
  if (supplyStream.is_hazardous) {
    if (supplyStream.physical_state === 'LIQUID') {
      instructions = 'Corrosive chemical liquid (Spent H2SO4). Ensure spark-proof suction valves and neutralizer kit on board.';
    } else if (supplyStream.physical_state === 'SLUDGE') {
      instructions = 'Chemical gypsum sludge. Hermetically sealed MS skips with tarpaulin covers. Prevent spillage.';
    }
  }

  return {
    id: `mnf-${serial}`,
    manifest_number: manifestNumber,
    match_id: match.id,
    sender_facility_id: sender.id,
    receiver_facility_id: receiver.id,
    sender_facility: sender,
    receiver_facility: receiver,
    transporter_name: transporterInfo?.transporter_name || 'Gujarat CleanChem Logistics Pvt. Ltd.',
    vehicle_no: transporterInfo?.vehicle_no || 'GJ-27-AX-4821',
    transporter_license: 'GPCB/TRANS/HW/GJ-2024-891',
    driver_name: transporterInfo?.driver_name || 'Rameshbhai Patel',
    driver_phone: transporterInfo?.driver_phone || '+91 98251 43210',
    waste_category: `${supplyStream.cpcb_waste_code} - ${supplyStream.material_name}`,
    material_name: supplyStream.material_name,
    physical_state: supplyStream.physical_state,
    quantity_dispatched_mt: Math.min(supplyStream.monthly_volume_mt, 25),
    packaging_type: transporterInfo?.packaging_type || (supplyStream.physical_state === 'LIQUID' ? 'FRP Rubber-Lined Tanker' : 'Hermetic MS Skips'),
    special_handling_instructions: instructions,
    emergency_contact: 'GPCB Vatva Emergency Response & NEPL TSDF: +91 79 2583 1200 / 112',
    dispatch_date: now.toISOString(),
    expected_delivery_date: deliveryEstimate.toISOString(),
    spcb_noc_reference: `GPCB/RO-AHM/XGN/2026-${serial}`,
    status: 'IN_TRANSIT',
    current_copy: 'ORANGE',
    color_slip_distribution: FORM_10_COPIES,
  };
}
