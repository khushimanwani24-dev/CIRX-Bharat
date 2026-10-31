# CIRX Bharat (सर्क-भारत) — System Architecture Document
**Team UdyogSetu (उद्योग-सेतु) • Theme: Environment & Sustainability • Viksit Bharat 2047**

---

## 1. High-Level System Architecture Overview

CIRX Bharat is an enterprise-grade autonomous B2B circular industrial resource exchange engineered on a decoupled, deterministic 4-layer operational stack.

```
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                               CIRX BHARAT SYSTEM TOPOLOGY                                 │
└───────────────────────────────────────────────────────────────────────────────────────────┘
                                              │
 ┌────────────────────────────────────────────┴───────────────────────────────────────────┐
 │ Layer 4: REGULATORY COMPLIANCE & MANIFEST ENGINE (`/lib/manifestEngine.ts`)             │
 │  • Statutory CPCB Form 10 (Rule 19, Hazardous & Other Wastes Rules 2016)               │
 │  • 7-Color Slip Sequence Tracking: White ➔ Yellow ➔ Pink ➔ Orange ➔ Green ➔ Blue ➔ Grey│
 │  • GPCB Rule 20 Form 4 Annual Returns Automation (Mass-balance anti-bypass ledger)     │
 │  • Real-Time Chain-of-Custody Lifecycle: DRAFT ➔ DISPATCHED ➔ IN_TRANSIT ➔ DELIVERED   │
 │  • Pixel-Perfect `@media print` Gazette Compliant Layout                               │
 └────────────────────────────────────────────┬───────────────────────────────────────────┘
                                              │
 ┌────────────────────────────────────────────┴───────────────────────────────────────────┐
 │ Layer 3: ZERO-LEAKAGE PRIVACY & ANONYMIZATION ENGINE (`/lib/anonymizer.ts`)            │
 │  • Trade-Secret Shield: Pseudonymous facility masking (e.g. "GIDC-Vatva-Unit-09")      │
 │  • PII Redaction: GSTIN (`24AABCV•••••••ZT`), GPCB Consent & address masking           │
 │  • Spatial Jitter Blurring: Deterministic ±1.5 km geographic noise on public GIS map   │
 │  • Bilateral Consent Protocol: Mutual opt-in handshake required to lift identity shield│
 │  • Pre-contracted TSDF Fallback Protocol (Emergency gate rejection protection)         │
 └────────────────────────────────────────────┬───────────────────────────────────────────┘
                                              │
 ┌────────────────────────────────────────────┴───────────────────────────────────────────┐
 │ Layer 2: DETERMINISTIC MATCHING ENGINE (`/lib/matchingEngine.ts`)                      │
 │  • Multi-Parametric Feasibility: Chemical (50%) + Geospatial (35%) + Volume Ratio (15%)│
 │  • Chemical Matrix: CPCB Schedule compatibility, ΔpH windows, calorific AFR thresholds │
 │  • Non-Linear Distance Decay: Haversine distance with 150 km economic cutoff radius     │
 │  • Automated ESG & Cost Arbitrage: ₹ Savings/month & avoided CO₂e (0.82 MT/MT diverted) │
 └────────────────────────────────────────────┬───────────────────────────────────────────┘
                                              │
 ┌────────────────────────────────────────────┴───────────────────────────────────────────┐
 │ Layer 1: INDUSTRIAL LEDGER & DATA FOUNDATION (`/lib/store.ts`, `/data/seed.json`)      │
 │  • In-Memory Singleton Reactive Ledger with instantaneous state hydration & seed reset │
 │  • Structured Material Registry: CPCB Schedule I/II, physical state, assay lab metrics │
 │  • Certified Assay Stream Ingestion: pH, GCV (kcal/kg), moisture %, Chlorides, metals  │
 │  • Corridor GIS Nodes: Accurate coordinates, industrial zones, facility tax identifiers │
 └────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Core Architectural Layers

### Layer 1: Industrial Ledger & Data Foundation (`/lib/store.ts`, `/data/seed.json`)
* **Purpose:** Single source of truth for industrial facilities, byproduct streams, demand mandates, and bilateral agreements.
* **Entities:**
  * **Facilities:** Generators (chemical MSMEs), Offtakers (cement kilns, brick/AAC block manufacturers), and Carriers.
  * **Material Streams:** Certified NABL lab assays (purity, moisture %, chloride %, pH, GCV, physical state).
  * **Cluster Nodes:** Vatva GIDC Phase-III, Naroda GIDC, Kathwada GIDC, and Sanand Industrial Corridor.

### Layer 2: Deterministic Matching Engine (`/lib/matchingEngine.ts`)
* **Purpose:** Eliminates non-deterministic AI hallucinations when dealing with hazardous and sensitive industrial materials.
* **Scoring Formula:**
  $$\mathcal{S}_{\text{composite}} = \left( 0.50 \cdot \mathcal{S}_{\text{chem}} + 0.35 \cdot \mathcal{S}_{\text{dist}} + 0.15 \cdot \mathcal{S}_{\text{vol}} \right) \times 100$$
* **Parameters:**
  * **50% Chemical Feasibility ($\mathcal{S}_{\text{chem}}$):** CPCB waste schedule compatibility, pH tolerance window ($\Delta \text{pH} \le 1.5$), moisture limits ($\le 15\%$), and cement kiln AFR calorific thresholds ($\text{GCV} \ge 2,500\text{ kcal/kg}$).
  * **35% Geospatial Proximity ($\mathcal{S}_{\text{dist}}$):** Non-linear piecewise Haversine distance decay with a strict $150\text{ km}$ economic haulage cutoff.
  * **15% Volume Alignment ($\mathcal{S}_{\text{vol}}$):** Monthly supply generation vs. offtake batch intake capacity.

### Layer 3: Zero-Leakage Privacy & Anonymization Engine (`/lib/anonymizer.ts`)
* **Purpose:** Solves the primary adoption barrier in industrial symbiosis—competitor espionage and trade-secret paranoia.
* **Mechanisms:**
  * **Identity Masking:** Company names and GSTINs are obscured under pseudonymous node codes (e.g., `GIDC-Vatva-Unit-09`).
  * **Spatial Jittering:** Geographic coordinates on public GIS maps are perturbed by $\pm 1.5\text{ km}$ to prevent location triangulation.
  * **Bilateral Consent Handshake:** Both generator and offtaker must review economics and execute digital signatures before identity disclosure.
  * **Gate Fallback Protocol:** Pre-contracted diversion to authorized TSDF landfills (NEPL/GESCSL) under digital escrow if material fails gate quality testing.

### Layer 4: Regulatory Compliance & Manifest Engine (`/lib/manifestEngine.ts`)
* **Purpose:** Digitize statutory hazardous waste governance under the Ministry of Environment, Forest and Climate Change (MoEFCC).
* **Key Modules:**
  * **CPCB Rule 19 Form 10 Manifest:** Automates official 7-color copy tracking (White $\rightarrow$ Yellow $\rightarrow$ Pink $\rightarrow$ Orange $\rightarrow$ Green $\rightarrow$ Blue $\rightarrow$ Grey) with QR verification.
  * **GPCB Rule 20 Form 4 Annual Returns:** Automatically aggregates yearly mass-balance logs to eliminate manual filing effort and prevent platform bypass.
  * **FASTag & IoT Telemetry:** Geofences transport routes between industrial estates to trigger SPCB vigilance flags upon unauthorized deviation.

---

## 3. Technology Stack

| Layer | Technology | Key Function |
| :--- | :--- | :--- |
| **Framework** | Next.js 14 / React 19 | Server-side rendering, client hydration, and RESTful route handlers |
| **Language** | TypeScript 5 (Strict Mode) | End-to-end type safety across chemical assays, spatial coordinates, and forms |
| **Styling** | Tailwind CSS v4 & Lucide Icons | Responsive enterprise UI with high-contrast data visualization |
| **GIS & Mapping** | Leaflet.js with CartoDB Dark | Real-time industrial corridor visualization and flowlines |
| **State & Store** | In-Memory Singleton Reactive Ledger | Zero-latency instant state updates and demonstration fixtures |
| **Print Engine** | CSS `@media print` Engine | Gazette-compliant print formatting for statutory Form 10 manifests |

---

## 4. Verification & Testing

* **Type Safety:** 100% clean build via `npx tsc --noEmit` (Zero errors).
* **Sample Data:** Seeded with real-world Ahmedabad industrial corridor data (`data/seed.json`).
* **Interactive Views:** 18 fully implemented workspace tabs including Ingestion, Bilateral Deals, GIS Map, Form 10 Modal, and Audit Ledger.
