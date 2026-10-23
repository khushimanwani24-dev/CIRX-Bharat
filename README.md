# ReBharat (री-भारत)
### *Next-Generation B2B Industrial Symbiosis & Secondary Feedstock Exchange*

[![Next.js 14](https://img.shields.io/badge/Next.js-14_App_Router-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0_Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4_Modern_Design-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![CPCB Form 10 Compliant](https://img.shields.io/badge/CPCB_Form_10-Rule_19_Compliant-059669?style=for-the-badge&logo=shield&logoColor=white)](https://cpcb.nic.in/)
[![GIS Corridor Engine](https://img.shields.io/badge/GIS_Engine-Leaflet_Spatial-10B981?style=for-the-badge&logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![Viksit Bharat 2047](https://img.shields.io/badge/Mission-Viksit_Bharat_2047-FF9933?style=for-the-badge&logo=target&logoColor=white)](https://www.india.gov.in/)

---

## Executive Summary

**ReBharat (री-भारत)** is an enterprise-grade industrial symbiosis and secondary raw material exchange platform designed for India's high-density manufacturing corridors. It establishes a closed-loop digital twin across heavy manufacturing, chemical synthesis, electroplating, automotive stamping, and cement manufacturing clusters, diverting hazardous and industrial byproducts away from landfills into high-value circular supply chains.

The platform's flagship deployment model targets the **Nashik Manufacturing Corridor** in Maharashtra (encompassing MIDC Ambad, MIDC Satpur, Sinnar Industrial Area, and Trimbak Road), orchestrating algorithmic byproduct discovery, cryptographic trade-secret protection, automated logistics dispatch, and statutory regulatory compliance under the **Central Pollution Control Board (CPCB)**.

---

## 🚨 The Core Problem Statement

India is accelerating toward a **$30+ Trillion economy by 2047**, with manufacturing slated to contribute over 25% of GDP. However, India's industrial hubs face four structural bottlenecks that threaten environmental sustainability, resource security, and regulatory integrity:

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                    THE INDIAN INDUSTRIAL FEEDSTOCK CRISIS                    │
├───────────────────────┬────────────────────────┬─────────────────────────────┤
│ 1. THE LINEAR TRAP    │ 2. INFORMATION         │ 3. REGULATORY FORGERY &     │
│    & TIPPING FEES     │    ASYMMETRY           │    MIDNIGHT DUMPING         │
├───────────────────────┼────────────────────────┼─────────────────────────────┤
│ Over 62M MT of        │ Generators conceal     │ Rule 19 paper manifests     │
│ industrial waste and  │ byproducts to avoid    │ (CPCB Form 10) are          │
│ 8M MT of hazardous    │ competitor scrutiny and│ frequently lost or forged,  │
│ sludge are landfilled │ regulatory penalties;  │ enabling illicit midnight   │
│ or burned yearly at   │ offtakers cannot       │ dumping into river basins   │
│ crippling TSDF fees.  │ verify chemical assays.│ and peri-urban wastelands.  │
└───────────────────────┴────────────────────────┴─────────────────────────────┘
                                       │
                                       ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                      4. ECONOMIC & RESOURCE DEADWEIGHT                       │
│ Cement kilns and smelters import expensive fossil petcoke and virgin mined   │
│ minerals, unaware that neighboring industrial units within a 25 km radius    │
│ pay high disposal fees to discard identical high-calorific secondary fuels.  │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Key Dimensions of Failure
1. **Severe Information Asymmetry & Trade-Secret Paranoia:** Manufacturing plants fear disclosing waste composition publicly because competitors can reverse-engineer proprietary processes, yield rates, or production volumes.
2. **Economic Deadweight of Disposal (TSDF):** Hazardous generators pay high tipping fees (₹1,500–₹4,500/MT) to Treatment, Storage, and Disposal Facilities (TSDFs), while nearby cement plants pay premium prices for petcoke and coal.
3. **Paper Manifest Leakage:** The mandatory 7-copy Form 10 manifest mandated under Rule 19 of the *Hazardous and Other Wastes Rules, 2016* is executed via carbon paper. Records are routinely misplaced, transit tracking is nonexistent, and regulatory reporting has latency measured in months.
4. **Carbon Footprint Escalation:** Every ton of industrial waste landfilled represents both wasted embodied energy and fresh carbon emissions from mining virgin replacements.

---

## 🏛️ The 4-Layer Architecture Breakdown

ReBharat is architected around a resilient, high-throughput four-layer operational stack that enforces strict separation of concerns, deterministic reproducibility, trade-secret privacy, and regulatory auditability.

```
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                                REBHARAT SYSTEM TOPOLOGY                                   │
└───────────────────────────────────────────────────────────────────────────────────────────┘
                                              │
 ┌────────────────────────────────────────────┴───────────────────────────────────────────┐
 │ Layer 4: REGULATORY MANIFESTS & COMPLIANCE ENGINE (`/lib/manifestEngine.ts`)           │
 │  • Statutory CPCB Form 10 (Rule 19, Hazardous & Other Wastes Rules 2016)               │
 │  • 7-Color Slip Sequence Tracking: White ➔ Yellow ➔ Pink ➔ Orange ➔ Green ➔ Blue ➔ Grey│
 │  • Real-Time Chain-of-Custody Lifecycle: DRAFT ➔ DISPATCHED ➔ IN_TRANSIT ➔ DELIVERED   │
 │  • Single-Click Physical `@media print` Formatting & SPCB Regional Audit Dashboard     │
 └────────────────────────────────────────────┬───────────────────────────────────────────┘
                                              │
 ┌────────────────────────────────────────────┴───────────────────────────────────────────┐
 │ Layer 3: ZERO-LEAKAGE PRIVACY & ANONYMIZATION ENGINE (`/lib/anonymizer.ts`)            │
 │  • Trade-Secret Shield: Company masking (e.g., "MIDC-Ambad-Unit-14")                   │
 │  • Cryptographic PII Redaction: GSTIN (`27AABCP•••••••ZV`), SPCB Consent masking       │
 │  • Spatial Jitter Blurring: Deterministic ±1.5 km geographic noise on public GIS map   │
 │  • Bilateral Consent Protocol: Mutual opt-in handshake required to lift identity shield│
 │  • Regulatory Backdoor Bypass: Continuous unmasked audit visibility for verified SPCB   │
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
 │  • Certified Assay Stream Ingestion: pH, GCV (kcal/kg), moisture %, COD/BOD metrics    │
 │  • Corridor GIS Nodes: Accurate coordinates, industrial zones, facility tax identifiers │
 └────────────────────────────────────────────────────────────────────────────────────────┘
```

### Layer 1: Industrial Ledger & Data Foundation (`/lib/store.ts`)
- Serves as the single source of truth for all industrial nodes, material streams, match proposals, and active movement manifests.
- Maintains schema-compliant entities for **Generators**, **Offtakers**, and **Recovery Hubs** within defined MIDC industrial clusters.
- Ingests certified laboratory assays: pH levels (0.0–14.0), Gross Calorific Value (GCV, kcal/kg), moisture percentage, heavy metal concentrations, and physical state transitions (`LIQUID`, `SOLID`, `SLUDGE`).

### Layer 2: Deterministic Matching Engine (`/lib/matchingEngine.ts`)
- Eliminates subjective heuristics through a deterministic scoring matrix evaluating physical, chemical, geographic, and volumetric feasibility.
- Calculates exact Haversine great-circle distances and applies multi-tier transport decay penalties.
- Computes real-time economic net benefit (accounting for haulage costs at ₹4.5/MT-km, avoided TSDF tipping fees, and raw material replacement value) and avoided greenhouse gases at standard **$0.82\text{ MT CO}_2\text{e}$ per MT** of diverted material.

### Layer 3: Zero-Leakage Privacy & Anonymization Engine (`/lib/anonymizer.ts`)
- Solves the primary adoption hurdle in industrial symbiosis: **commercial and competitive secrecy**.
- Counterparties browse listings under pseudonymous node identifiers (e.g., `MIDC-Ambad-Unit-14`), with GSTINs and SPCB Consent IDs masked.
- Public GIS coordinates are shifted using a deterministic mathematical hash function generating a **$\pm 1.5\text{ km}$ spatial blur**, preventing competitors from locating facilities through triangulation.
- Legal names, executive contact details, and precise coordinates remain locked until **both** counterparties execute a cryptographically signed bilateral handshake (`MUTUAL_CONSENT`). State Pollution Control Board regulators maintain continuous oversight with full audit bypass.

### Layer 4: Regulatory Manifests & Compliance Engine (`/lib/manifestEngine.ts`)
- Implements statutory compliance under **Rule 19 of the Hazardous and Other Wastes (Management and Transboundary Movement) Rules, 2016**.
- Automates the generation and live lifecycle state machine of the official **CPCB Form 10 Manifest** across all **7 statutory color-coded copies**.
- Provides a clean, print-ready `@media print` interface replicating government document typography, official signature blocks, and carrier endorsement seals.

---

## 🧮 Mathematical Scoring Formulation

The ReBharat matching algorithm evaluates pairwise industrial symbiosis feasibility through a normalized composite scoring model bounded in the interval $[0, 100]$:

$$\mathcal{S}_{\text{composite}} = \left( 0.50 \cdot \mathcal{S}_{\text{chem}} + 0.35 \cdot \mathcal{S}_{\text{dist}} + 0.15 \cdot \mathcal{S}_{\text{vol}} \right) \times 100$$

### 1. Chemical & Process Feasibility ($\mathcal{S}_{\text{chem}}$ — 50% Weight)

The chemical compatibility score $\mathcal{S}_{\text{chem}} \in [0.0, 1.0]$ evaluates CPCB hazardous waste schedules, thermal recovery thresholds, and thermodynamic conversion feasibility:

$$\mathcal{S}_{\text{chem}} = \begin{cases} 
0.98 & \text{CPCB Cat 35.3 Heavy Metal Reduction (Hydrometallurgical Precipitation)} \\
0.95 - \delta_{\text{cal}} & \text{CPCB Cat 21.1 Paint Sludge to Cement Kiln AFR Co-processing} \\
0.97 & \text{Schedule II-B Blast Furnace Slag Pozzolanic Concrete Substitution} \\
0.94 & \text{High-COD Agro-waste to Continuous Stirred-Tank (CSTR) Biogas} \\
\mathcal{S}_{\text{heuristic}} & \text{Generic Pairing Fallback}
\end{cases}$$

#### Calorific Value Adjustment ($\delta_{\text{cal}}$) for Cement Kilns:
Cement kiln co-processing requires an Alternative Fuel & Raw Material (AFR) threshold of $\text{GCV} \ge 2,500\text{ kcal/kg}$:

$$\delta_{\text{cal}} = \begin{cases} 
0.00 & \text{if } \text{GCV}_{\text{supply}} \ge 2,500\text{ kcal/kg} \\
0.15 & \text{if } \text{GCV}_{\text{supply}} < 2,500\text{ kcal/kg (Borderline thermal penalty)}
\end{cases}$$

#### pH Compatibility Window Adjustment:
For generic streams, the difference between supply and demand pH ($\Delta \text{pH} = |\text{pH}_{\text{supply}} - \text{pH}_{\text{demand}}|$) modifies the base score:

$$\Delta \mathcal{S}_{\text{pH}} = \begin{cases} 
+0.15 & \text{if } \Delta \text{pH} \le 1.5 \quad (\text{Optimal neutralization window}) \\
0.00 & \text{if } 1.5 < \Delta \text{pH} \le 5.0 \\
-0.20 & \text{if } \Delta \text{pH} > 5.0 \quad (\text{Severe chemical incompatibility})
\end{cases}$$

#### Absolute Regulatory Cutoff:
If a waste stream is legally classified as **Hazardous** and the proposed receiver does not possess an SPCB hazardous authorization:

$$\mathcal{S}_{\text{chem}} = 0.10 \implies \text{Pairing Disqualified (Hard Cutoff if } \mathcal{S}_{\text{chem}} < 0.25\text{)}$$

---

### 2. Geospatial Haversine Distance & Decay Penalty ($\mathcal{S}_{\text{dist}}$ — 35% Weight)

Haulage distance is calculated via the Haversine great-circle formula over the Earth's mean radius ($R = 6,371\text{ km}$):

$$\Delta \phi = \frac{(\text{lat}_2 - \text{lat}_1) \cdot \pi}{180}, \quad \Delta \lambda = \frac{(\text{lng}_2 - \text{lng}_1) \cdot \pi}{180}$$

$$a = \sin^2\left(\frac{\Delta \phi}{2}\right) + \cos\left(\frac{\text{lat}_1 \cdot \pi}{180}\right) \cos\left(\frac{\text{lat}_2 \cdot \pi}{180}\right) \sin^2\left(\frac{\Delta \lambda}{2}\right)$$

$$d = 2 R \cdot \operatorname{atan2}\left(\sqrt{a}, \sqrt{1 - a}\right) \quad [\text{km}]$$

#### Non-Linear Piecewise Economic Haulage Decay Function:
Freight economics dictate that industrial byproduct exchange becomes economically unviable beyond $150\text{ km}$. The distance decay function applies tiered economic penalties:

$$\mathcal{S}_{\text{dist}}(d) = \begin{cases} 
1.00 & \text{for } d \le 5\text{ km} \quad (\text{Hyper-local intra-MIDC cluster}) \\
1.00 - \left(\dfrac{d - 5}{15}\right) \cdot 0.10 & \text{for } 5 < d \le 20\text{ km} \quad (\text{Adjacent industrial zone}) \\
0.90 - \left(\dfrac{d - 20}{30}\right) \cdot 0.20 & \text{for } 20 < d \le 50\text{ km} \quad (\text{Sub-regional corridor}) \\
\max\left(0.10, \, 0.70 - \left(\dfrac{d - 50}{100}\right) \cdot 0.55\right) & \text{for } 50 < d \le 150\text{ km} \quad (\text{Inter-district transport}) \\
0.00 & \text{for } d > 150\text{ km} \quad (\text{Viability Cutoff Disqualification})
\end{cases}$$

---

### 3. Volumetric Balancing Ratio ($\mathcal{S}_{\text{vol}}$ — 15% Weight)

To ensure that the generator's generation rate balances the offtaker's monthly processing capacity without causing accumulation backlogs or feedstock starvation:

$$\mathcal{S}_{\text{vol}} = \min\left(1.0, \, \max\left(0.10, \, \frac{\min(V_{\text{supply}}, V_{\text{demand}})}{\max(V_{\text{supply}}, V_{\text{demand}})}\right)\right)$$

Where $V_{\text{supply}}$ and $V_{\text{demand}}$ represent monthly volumes in Metric Tonnes (MT).

---

### 4. Carbon Footprint & Economic Arbitrage Quantification

#### Avoided Carbon Displacement:
Calibrated using standard CPCB and IPCC emission factors for diverted secondary feedstocks:

$$\Delta E_{\text{CO}_2} = \min(V_{\text{supply}}, V_{\text{demand}}) \times \kappa_{\text{avoided}} \quad [\text{MT CO}_2\text{e / month}]$$

$$\kappa_{\text{avoided}} = 0.82\text{ MT CO}_2\text{e per MT secondary feedstock diverted}$$

#### Monthly Economic Net Arbitrage ($\mathcal{B}_{\text{net}}$):

$$\mathcal{B}_{\text{net}} = \mathcal{S}_{\text{disposal}} + \mathcal{V}_{\text{replacement}} - \left(\min(V_{\text{supply}}, V_{\text{demand}}) \cdot d \cdot \mathcal{C}_{\text{freight}}\right)$$

Where:
- $\mathcal{S}_{\text{disposal}} = |P_{\text{supply}}| \cdot V_{\text{diverted}}$ (Saved TSDF tipping fee when $P_{\text{supply}} < 0$).
- $\mathcal{V}_{\text{replacement}} = \text{Virgin material substitution value}$ ($₹2,200/\text{MT}$ for hazardous AFR/metals; $₹600/\text{MT}$ for pozzolana).
- $\mathcal{C}_{\text{freight}} = ₹4.5\text{ per MT-km}$ freight transit cost.

---

## 📜 Regulatory Engine: CPCB Form 10 Manifest System

Under **Rule 19 (1)** of the *Hazardous and Other Wastes (Management and Transboundary Movement) Rules, 2016*, every hazardous byproduct shipment must follow a strict, color-coded 7-copy consignment manifest. ReBharat translates this physical workflow into a real-time digital custody chain:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                   CPCB FORM 10 STATUTORY 7-COLOR MANIFEST LIFECYCLE                    │
├──────┬─────────┬──────────────────────────────┬────────────────────────────────────────┤
│ Copy │ Color   │ Statutory Recipient          │ Legal Mandate & Timing                 │
├──────┼─────────┼──────────────────────────────┼────────────────────────────────────────┤
│  1   │ White   │ SPCB Regional Office (Nashik)│ Submitted by Sender within 3 days.     │
│  2   │ Yellow  │ Sender Archive (Generator)   │ Retained by Sender after driver signs. │
│  3   │ Pink    │ Receiver Archive (Offtaker)  │ Retained by Offtaker for audit trail.  │
│  4   │ Orange  │ Transporter Vehicle Cab      │ Accompanies truck in-transit w/ TREMCARD│
│  5   │ Green   │ SPCB Regional Office (Nashik)│ Sent by Receiver confirming delivery.  │
│  6   │ Blue    │ Sender Final Closure Proof   │ Returned to Sender with weight seal.   │
│  7   │ Grey    │ Transporter Clearance        │ Retained by fleet logistics operator.  │
└──────┴─────────┴──────────────────────────────┴────────────────────────────────────────┘
```

### Digital Manifest State Machine:
1. `DRAFT`: Initiated immediately upon mutual bilateral consent between verified parties.
2. `DISPATCHED`: Sender signs, vehicle registration (`MH-15-DC-9842`) and driver details are locked; Copy 1 (White) is dispatched to SPCB.
3. `IN_TRANSIT`: Transporter possesses Copy 4 (Orange); live GPS transit telemetry engaged.
4. `DELIVERED`: Vehicle arrives at offtaker gate; weighbridge verification stamps manifest.
5. `ACCEPTED_AT_SITE`: Consignment unloaded into kiln or chemical reactor; Copy 5 (Green) dispatched to SPCB and Copy 6 (Blue) returned to Generator to legally close the manifest liability.

---

## 🏭 Nashik Corridor Pilot Blueprint

The repository comes pre-loaded with comprehensive industrial fixtures (`/data/seed.json`) mapped to the **Nashik Manufacturing Hub**:

```
                                    [ Western India Cement ]
                                    (Sinnar Industrial - 38 km)
                                              ▲
                                              │ AFR Kiln Co-processing
                                              │ (Paint Sludge - Cat 21.1)
                                              │
    [ Precision Plating Works ] ──────────────┼──────────────► [ Sahyadri Precious Metals ]
    (MIDC Ambad - Cat 35.3 Effluent)          │                (MIDC Satpur - 8.4 km)
                                              │                Hydrometallurgical Recovery
                                              │
    [ Godavari Alloys Foundry ] ──────────────┴──────────────► [ Nashik Green-Pavers ]
    (MIDC Satpur - Slag Schedule II-B)                         (MIDC Ambad - 4.2 km)
                                                               Sand Replacement in Pavers
```

### Pre-Configured Facilities & Verified Streams:
1. **Precision Plating Works Pvt. Ltd.** (MIDC Ambad)
   - *Stream:* 15 MT/month **Acidic Chromium Effluent** (CPCB Cat 35.3, pH 1.8).
   - *Symbiosis Partner:* **Sahyadri Precious Metals** (MIDC Satpur, 8.4 km) for hydrometallurgical precipitation.
2. **Nashik Auto Stamping Ltd.** (MIDC Ambad)
   - *Stream:* 25 MT/month **Automotive Paint Sludge** (CPCB Cat 21.1, GCV 3,200 kcal/kg, 28% moisture).
   - *Symbiosis Partner:* **Western India Cement Works** (Sinnar, 38 km) for high-temperature ($1,450^\circ\text{C}$) clinker burning.
3. **Godavari Alloys & Heavy Foundry Corp** (MIDC Satpur)
   - *Stream:* 120 MT/month **Granulated Blast Furnace Slag** (Schedule II-B Pozzolana).
   - *Symbiosis Partner:* **Nashik Green-Pavers & Infrastructure** (MIDC Ambad, 4.2 km) for river-sand replacement in M-30 paver blocks.
4. **Panchavati Food Formulations Ltd.** (MIDC Ambad)
   - *Stream:* 40 MT/month **Citrus Pomace & Puree Waste** (High-COD Organic Slurry).
   - *Symbiosis Partner:* **Samarth Biogas & Energy Grid** (Trimbak Road, 18 km) for anaerobic CSTR digestion.

---

## 💻 Tech Stack & Architectural Decisions

| Layer / Domain | Technology | Rationale & Architectural Justification |
| :--- | :--- | :--- |
| **Framework** | **Next.js 14 / App Router** | Server-side rendering, optimized client components, and zero-cold-start route handlers. |
| **Language** | **TypeScript 5 (Strict Mode)** | Full end-to-end type safety across chemical assays, spatial coordinates, and statutory forms. |
| **Styling** | **Tailwind CSS v4** | Dark industrial enterprise theme with strict zinc/slate palettes, emerald success indicators, and amber hazard states. |
| **GIS & Mapping** | **Leaflet.js & CartoDB Dark** | Interactive geospatial mapping, dynamic animated flowlines, and deterministic coordinate jittering. |
| **Icons** | **Lucide React** | Clean, standardized iconography for industrial processes, states, and certifications. |
| **Data Layer** | **In-Memory Singleton Ledger** | Ultra-responsive state store with instantaneous seed hydration, dynamic stream injection, and reset capabilities. |
| **Print Engine** | **CSS `@media print` Engine** | Pixel-perfect A4 printing for CPCB Form 10 manifests matching official Central Government gazette formats. |

---

## 🛠️ Step-by-Step Local Installation

Follow these steps to set up and run ReBharat in your local development environment:

### 1. Prerequisites
Ensure your workstation meets the following runtime requirements:
- **Node.js:** `v18.17.0` or higher (Node v20.x or v22.x LTS strongly recommended)
- **npm:** `v9.x` or `v10.x`
- **Git:** `v2.30+`

Verify your installation:
```bash
node -v
npm -v
git --version
```

### 2. Clone the Repository
```bash
git clone https://github.com/khushimanwani24/rebharat.git
cd rebharat
```

### 3. Install Dependencies
Install all core and development dependencies:
```bash
npm install
```

### 4. Verify Project Configuration
Check that your `tsconfig.json` and Next.js configuration are validated:
```bash
npx tsc --noEmit
```

### 5. Launch the Development Server
Start the Next.js development server with Turbopack acceleration:
```bash
npm run dev
```

The application will spin up at:
```
  ▲ Next.js 14.x
  - Local:        http://localhost:3000
  - Network:      http://192.168.x.x:3000
```

Open your browser and navigate to **[http://localhost:3000](http://localhost:3000)**.

### 6. Production Build & Deployment Testing
To validate production compilation and tree-shaking:
```bash
npm run build
npm start
```

---

## 🧭 Operational Walkthrough & Navigation Guide

Upon launching ReBharat, you can test end-to-end industrial workflows across 5 primary modules:

```
[ Top Header: Live Cluster ESG & Carbon Counter (Diverted MT, ₹ Saved, Avoided CO₂e) ]
      │
      ├─► 1. 🔄 Bilateral Exchange Center (Match proposals, Feasibility inspect, Bilateral consent)
      ├─► 2. 📥 Stream Ingestion Portal (Laboratory assay input, pH slider, Kiln calorific warning)
      ├─► 3. 🗺️ Industrial Corridor Map (Leaflet dark GIS, Animated symbiosis flowlines, Privacy blur toggle)
      ├─► 4. 📜 SPCB Regulatory & Form 10 Center (Audit table, 7-Color manifest viewer, Print / Save PDF)
      └─► 5. ℹ️ System Specs & CPCB Rules (Detailed mathematical formulation, Rule 19 statutory mandates)
```

### Key Interactive Flows to Test:
- **Bilateral Consent Handshake:** Navigate to `/` (Bilateral Exchange Center). Observe that company names are masked as `MIDC-Ambad-Unit-14`. Click **"Generator Consent"**, then click **"Offtaker Consent"**. Watch the confetti animation trigger as verified corporate names and GSTINs unlock, enabling the **"Generate CPCB Form 10 Manifest"** button.
- **Privacy Jitter Inspection:** Switch to the **Industrial Corridor Map** (`tab=map`). Toggle between **"Exact Coordinates"** and **"Privacy Radius (±1.5 km)"** to observe the spatial perturbation protecting factory locations from competitor triangulation.
- **Statutory Manifest Printout:** In the **Manifest Center**, open any manifest and cycle through the **7-color slip switcher** (White ➔ Yellow ➔ Pink ➔ Orange ➔ Green ➔ Blue ➔ Grey). Click **"Print / Save PDF"** to inspect the clean, unbranded `@media print` compliance layout.
- **Active Persona Switcher:** Use the persona selector in the navigation bar to test the interface from the perspective of an **Automotive Generator**, a **Cement Offtaker**, or an **Official SPCB Regulatory Auditor** (which automatically bypasses privacy redactions).

---

## 📡 API Reference

The backend exposes RESTful route handlers to power industrial integrations and SPCB monitoring nodes:

| Method | Endpoint | Description | Payload / Parameters |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/state` | Retrieves facilities, streams, matches, manifests, and ESG metrics. | Optional: `?reset=true` (restores default seed state) |
| `POST` | `/api/streams` | Registers a new supply/demand stream and runs matching. | `{ facility_id, material_name, stream_type, cpcb_waste_code, physical_state, monthly_volume_mt, ph_level, calorific_value_kcal, price_per_mt }` |
| `POST` | `/api/matches/[id]/consent` | Records bilateral consent and evaluates identity unmasking. | `{ party: 'generator' \| 'offtaker', consent: boolean }` |
| `GET` | `/api/manifests` | Retrieves all active CPCB Form 10 manifests. | None |
| `POST` | `/api/manifests` | Generates a new official Form 10 manifest from an approved match. | `{ match_id, transporter_name, vehicle_no, driver_name, packaging_type, ... }` |
| `PATCH` | `/api/manifests/[id]` | Updates consignment movement status and active copy color. | `{ status: ManifestStatus, current_copy?: ManifestCopyColor }` |

---

## 🇮🇳 Vision for Viksit Bharat 2047 Alignment

ReBharat is built to advance the **Viksit Bharat 2047** national imperative—transforming India into a developed, self-reliant, high-value manufacturing powerhouse with Net-Zero emissions by 2070.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        VIKSIT BHARAT 2047 STRATEGIC PILLARS                            │
└────────────────────────────────────────────────────────────────────────────────────────┘
          │                              │                               │
          ▼                              ▼                               ▼
┌───────────────────┐          ┌───────────────────┐           ┌───────────────────┐
│ CIRCULAR ECONOMY  │          │ DIGITAL PUBLIC    │           │ ATMANIRBHAR       │
│ & NET-ZERO 2070   │          │ INFRASTRUCTURE    │           │ FEEDSTOCK (RAW    │
│                   │          │ FOR ENVIRONMENT   │           │ MATERIAL SECURITY)│
├───────────────────┤          ├───────────────────┤           ├───────────────────┤
│ Diverting heavy   │          │ Eliminates paper  │           │ Substitutes costly│
│ industrial waste  │          │ manifest forgery; │           │ imported petcoke, │
│ into secondary raw│          │ provides real-time│           │ virgin coal, and  │
│ materials achieves│          │ environmental     │           │ mined river sand  │
│ 0.82 MT avoided   │          │ oversight across  │           │ with indigenous   │
│ CO₂e per MT.      │          │ SPCB & CPCB hubs. │           │ secondary inputs. │
└───────────────────┘          └───────────────────┘           └───────────────────┘
```

### 1. Decoupling Industrial Growth from Virgin Resource Extraction
- By transforming industrial byproducts (such as slag, spent acids, and high-calorific sludges) into certified feedstocks, Indian heavy industries can decouple economic output from raw mineral extraction.
- Every million tonnes of foundry slag directed into paver infrastructure preserves riverbeds and agricultural soils from sand mining.

### 2. Digital Public Infrastructure (DPI) for Environmental Governance
- Following the transformative impact of UPI in payments and ONDC in commerce, ReBharat envisions an **Open Industrial Symbiosis Protocol (OISP)** as public digital infrastructure for India's 100+ industrial corridors.
- Regulators transition from backward-looking annual audits to real-time, telemetry-backed hazardous waste monitoring, ending the menace of illicit midnight dumping into river ecosystems like the Godavari.

### 3. Raw Material Sovereignty & Import Substitution
- Cement production consumes millions of tonnes of imported fossil petcoke. Co-processing paint sludges and non-recyclable polymers as Alternative Fuel and Raw Materials (AFR) reduces foreign exchange outflows and insulates domestic manufacturers from global commodity price volatility.

### 4. Scope 3 ESG Integrity & Sovereign Green Capital
- Indian MSMEs integrated into global supply chains face tightening European and international carbon border tariffs (CBAM). ReBharat provides verifiable, transaction-level avoided carbon certificates ($0.82\text{ kg CO}_2\text{e/kg}$), empowering Indian exporters to access low-cost sovereign green finance and ESG investment pools.

### 5. Corridor-Scale Replicability under PM Gati Shakti
- The Nashik Industrial Pilot serves as a reproducible blueprint designed for direct federation with the **PM Gati Shakti National Master Plan**.
- The same 4-layer architecture scales seamlessly across major Indian corridors: **Pune-Chakan Auto Hub**, **Ankleshwar-Vapi Chemical Belt**, **Sriperumbudur Electronics Corridor**, and the **Durgapur-Jamshedpur Steel Triangle**.

---

## ⚖️ Statutory & Legal Citations

- **CPCB Form 10 (Rule 19):** *Hazardous and Other Wastes (Management and Transboundary Movement) Rules, 2016*, Ministry of Environment, Forest and Climate Change (MoEFCC), Government of India.
- **The Water (Prevention and Control of Pollution) Act, 1974** & **The Air (Prevention and Control of Pollution) Act, 1981**.
- **Central Pollution Control Board (CPCB) Guidelines** for Co-processing of Hazardous Wastes in Cement Kilns (CPCB/AFR/Guidelines/2021).
- **Environment (Protection) Act, 1986** and State Pollution Control Board (SPCB) Consents to Operate (CTO) under Section 25/26.

---

## 👥 Contributors & Stewardship

Developed with pride for **ReBharat (री-भारत)** — *Powering Indian Industry through Closed-Loop Circular Symbiosis.*

For inquiries, pilot cluster deployments, or regulatory API integrations, please open an issue or submit a pull request through the official project repository.
