# ReBharat (री-भारत)
### *The Closed-Loop Material Exchange for Indian Industry*

[![Next.js](https://img.shields.io/badge/Next.js-16_App_Router-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Leaflet GIS](https://img.shields.io/badge/GIS-Leaflet-10b981?style=flat&logo=leaflet)](https://leafletjs.com/)
[![Compliance](https://img.shields.io/badge/Compliance-CPCB_Form_10_Rule_19-emerald?style=flat)](https://cpcb.nic.in/)

**ReBharat** is an enterprise-grade B2B industrial symbiosis and secondary feedstock exchange platform engineered for Indian manufacturing corridors. It enables heavy industry, automotive plants, chemical processors, and foundries to divert hazardous and non-hazardous byproducts from landfills into circular supply chains.

The platform's initial deployment targets the **Nashik Manufacturing Corridor** in Maharashtra (spanning MIDC Ambad, MIDC Satpur, Sinnar Industrial Area, and Trimbak Road).

---

## 🌟 Executive Summary & Key Highlights

- ⚡ **Deterministic Matching Engine:** Eliminates guesswork with a weighted algorithmic matrix evaluating chemical compatibility ($50\%$), geospatial haul distance with decay penalties ($35\%$), and volume ratio alignment ($15\%$).
- 🛡️ **Zero-Leakage Privacy Engine:** Competitors and counterparties only view anonymous handles (e.g., `MIDC-Ambad-Unit-14`) and blurred GPS coordinates ($\pm 1.5\text{ km}$). Full legal identities, GSTIN, and SPCB consents remain cryptographically shielded until **both** parties grant mutual bilateral consent.
- 📜 **Statutory CPCB Form 10 Manifest Generator:** Fully compliant with Rule 19 of the *Hazardous and Other Wastes (Management and Transboundary Movement) Rules, 2016*. Features an interactive, printable layout covering all **7 statutory color copies** (White, Yellow, Pink, Orange, Green, Blue, Grey).
- 🗺️ **Interactive GIS Industrial Corridor Map:** Real-time Leaflet map rendering facilities with color-coded custom SVG pins (Red = Hazardous Generator, Green = Circular Offtaker, Blue = Recovery Hub) and dynamic, animated dashed symbiosis flowlines.
- 📥 **Certified Assay Stream Ingestion Portal:** Interactive laboratory assay input with visual pH gauges, calorific value thresholds ($\ge 2,500\text{ kcal/kg}$ for cement kiln AFR), moisture parameters, and real-time avoided $\text{CO}_2\text{e}$ estimations.
- 📊 **Live Cluster ESG & Carbon Counter:** Tracks live cumulative metrics using the standardized factor of **$0.82\text{ kg CO}_2\text{e}$ per kg** of secondary material diverted from virgin extraction or landfilling.

---

## 🏗️ Core Architectural Modules

### 1. Deterministic Matching Engine (`/lib/matchingEngine.ts`)
The matching engine evaluates supply and demand pairs through a multi-variable feasibility filter:

$$\text{Composite Match Score} = \left(\text{ChemScore} \times 0.50 + \text{DistanceScore} \times 0.35 + \text{VolumeRatio} \times 0.15\right) \times 100$$

- **Chemical Compatibility ($50\%$ weight):** Validates CPCB Schedule I/II waste categories, $\text{pH}$ compatibility windows ($\Delta \text{pH} \le 1.5$), physical state conversion feasibility, and minimum calorific thresholds ($\text{GCV} \ge 2,500\text{ kcal/kg}$ for clinker burning).
- **Geospatial Proximity ($35\%$ weight):** Evaluates Haversine great-circle distances across the industrial corridor. Maximum economic hauling radius is capped at $150\text{ km}$:
  - $\le 5\text{ km}$: Score $= 1.0$ (hyper-local cluster symbiosis)
  - $5\text{ km} - 20\text{ km}$: Score $= 1.0 - \left(\frac{d - 5}{15}\right) \times 0.10$
  - $20\text{ km} - 50\text{ km}$: Score $= 0.90 - \left(\frac{d - 20}{30}\right) \times 0.20$
  - $50\text{ km} - 150\text{ km}$: Scaled decay down to $0.10$
  - $> 150\text{ km}$: Disqualified ($0.0$ economic viability cutoff)
- **Volume Ratio ($15\%$ weight):** Ratio of generator monthly tonnage to consumer processing capacity: $\frac{\min(S, D)}{\max(S, D)}$.
- **Avoided Carbon Calculation:** Standardized at **$0.82\text{ MT CO}_2\text{e per MT}$** ($0.82\text{ kg CO}_2\text{e/kg}$) secondary material diverted.

---

### 2. Zero-Leakage Privacy & Anonymization Engine (`/lib/anonymizer.ts`)
Protects proprietary trade secrets, formulations, and commercial privacy:

```
[Default State: Confidentiality Shield Engaged]
  - Entity: Masked as Anonymous Label (e.g., "MIDC-Ambad-Unit-14")
  - GSTIN: Masked (e.g., "27AABCP•••••••ZV")
  - SPCB Consent: Masked (e.g., "MPCB/RO-NSK/••••/••••")
  - GPS Coordinates: Pseudo-jittered radius (+/- 1.5 km blur)
  - Commercial contacts strictly locked
                │
                ▼
  [Bilateral Connect Protocol]
  Generator Consents: [ ✔ ]
  Offtaker Consents:  [ ✔ ]
                │
                ▼
[Mutual Consent State: Shield Disengaged]
  - Full verified legal entities displayed ("Precision Plating Works Pvt. Ltd.")
  - Complete GSTIN, SPCB Consent ID, and executive contacts unlocked
  - "Generate CPCB Form 10 Manifest" button activated
  * Statutory SPCB Regulators maintain continuous unmasked audit visibility
```

---

### 3. CPCB Form 10 Regulatory Manifest Generator (`/lib/manifestEngine.ts`)
Implements the statutory 14-section Hazardous Waste Movement Manifest under Rule 19 of the *Hazardous and Other Wastes Rules, 2016*:

| Copy No. | Slip Color | Legal Recipient & Regulatory Mandate |
| :---: | :---: | :--- |
| **Copy 1** | **White** | **SPCB Regional Office:** Submitted by Sender within 3 days of dispatch. |
| **Copy 2** | **Yellow** | **Sender Archive:** Retained by Generator after transporter driver signs. |
| **Copy 3** | **Pink** | **Receiver Archive:** Retained by Offtaker/Co-processor upon delivery. |
| **Copy 4** | **Orange** | **Transporter Cab:** Accompanies vehicle in-transit with TREMCARD. |
| **Copy 5** | **Green** | **SPCB Regional Office:** Submitted by Receiver confirming safe delivery. |
| **Copy 6** | **Blue** | **Sender Closure:** Returned by Receiver to Sender with weighbridge seal. |
| **Copy 7** | **Grey** | **Transporter Clearance:** Retained by transporter fleet operator. |

Features a single-click `@media print` layout styled for clean, official physical printing.

---

## 🏭 Nashik Corridor Seed Ecosystem

The application comes pre-loaded with comprehensive seed fixtures (`/data/seed.json`) strictly modeled on the **Nashik / Ambad / Satpur / Sinnar** manufacturing corridor:

### Byproduct Generators
1. **Precision Plating Works Pvt. Ltd.** (MIDC Ambad)
   - *Stream:* 15 MT/month **Acidic Chromium Effluent** (CPCB Cat 35.3, pH 1.8, Hazardous).
2. **Nashik Auto Stamping Ltd.** (MIDC Ambad)
   - *Stream:* 25 MT/month **Automotive Paint Sludge** (CPCB Cat 21.1, GCV: 3,200 kcal/kg, Moisture: 28%, Hazardous).
3. **Godavari Alloys & Heavy Foundry Corp** (MIDC Satpur)
   - *Stream:* 120 MT/month **Granulated Blast Furnace Slag** (Schedule II-B Non-Hazardous Pozzolan).
4. **Panchavati Food Formulations Ltd.** (MIDC Ambad)
   - *Stream:* 40 MT/month **Organic Citrus Pomace & Puree Waste** (Non-Hazardous, COD 68,000 mg/L).

### Consented Offtakers & Recovery Hubs
1. **Sahyadri Precious Metals & Chemical Recovery** (MIDC Satpur, 8.4 km)
   - *Process:* Hydrometallurgical reduction & precipitation of hexavalent chromium into trivalent hydrate.
2. **Western India Cement Works** (Sinnar Industrial Estate, 38 km)
   - *Process:* High-temperature ($1450^\circ\text{C}$) kiln clinker co-processing of high-calorific alternative fuels (AFR).
3. **Nashik Green-Pavers & Infrastructure** (MIDC Ambad, 4.2 km)
   - *Process:* Blast furnace slag replacement of virgin river sand in M-30 interlocking paver blocks.
4. **Samarth Biogas & Energy Grid** (Trimbak Road, 18 km)
   - *Process:* Continuous stirred-tank reactor (CSTR) anaerobic digestion for Compressed Bio-Gas (CBG).

---

## 💻 Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Serverless Route Handlers)
- **Language:** TypeScript 5 (Strict Mode)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) (Enterprise Zinc/Slate dark theme, Emerald accents, Amber/Rose hazard tags)
- **Mapping & GIS:** [Leaflet.js](https://leafletjs.com/) with CartoDB Dark Matter tile layer & dynamic SVG pins
- **Icons:** [Lucide React](https://lucide.dev/)
- **Visual FX:** [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **State & Data Store:** In-memory singleton repository with seed fixtures (`/data/seed.json`) and instant reset capabilities

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js:** v18.17+ or v20+ (Node v24 supported)
- **npm:** v9+ or v10+

### 1. Installation
Clone or navigate to the repository directory:
```bash
cd /home/khushimanwani24/rebharat
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your web browser.

### 3. Build for Production
To create an optimized production build:
```bash
npm run build
npm start
```

---

## 🧭 Navigation & Screen Guide

When opening the web application, you can switch between 5 primary operational modules:

1. **🔄 Bilateral Exchange Center (`/`):**
   - Inspect auto-generated symbioses with percentage scores, haul distance, avoided $\text{CO}_2\text{e}$, and net savings in ₹.
   - Click **"Inspect Feasibility Logic"** to see the 3-tier mathematical breakdown.
   - Click **"Generator Consent"** and **"Offtaker Consent"** to simulate the bilateral connect flow and unlock legal company names.
   - Click **"Generate CPCB Form 10 Manifest"** to create a movement manifest.

2. **📥 Stream Ingestion Portal:**
   - Ingest new secondary streams or offtake mandates.
   - Use quick template pills (e.g., *Acidic Chromium Bath*, *Paint Sludge*, *Foundry Slag*) to test real-time validation.
   - Adjust the interactive $\text{pH}$ slider (0–14) and calorific value to observe kiln co-processing eligibility warnings.

3. **🗺️ Industrial Corridor Map (GIS):**
   - Explore the Nashik manufacturing corridor on an interactive dark-matter GIS map.
   - Click on facilities to inspect registered streams and SPCB consent numbers.
   - Click on any symbiosis match to draw an animated dashed flowline between the generator and offtaker with a midpoint distance badge.
   - Toggle between **"Exact GIS Coordinates"** and **"Privacy Radius (+/- 1.5 km Blurred)"**.

4. **📜 SPCB Regulatory & Form 10 Manifest Center:**
   - Audit all dispatched and in-transit hazardous shipments.
   - Click **"View 7-Color Slip & Print"** on any manifest to view the statutory Form 10 document.
   - Use the 7-color slip switcher (White $\rightarrow$ Yellow $\rightarrow$ Pink $\rightarrow$ Orange $\rightarrow$ Green $\rightarrow$ Blue $\rightarrow$ Grey) to inspect color-coded compliance text.
   - Click **"Print / Save PDF"** to trigger a clean, border-aligned printout.

5. **ℹ️ System Specs & CPCB Rules:**
   - Detailed technical architecture, mathematical proofs, and statutory legal citations.

---

## 👥 Persona / Role Switcher

Use the **Active Persona** dropdown in the top-right header to test the platform from different industrial perspectives:

- **Generator (Precision Plating):** View acidic chromium effluent and hazardous waste disposal liabilities.
- **Generator (Nashik Auto Stamping):** View high-solid paint sludge and clinker co-processing savings.
- **Offtaker (Western India Cement):** View kiln alternative fuel requirements.
- **Offtaker (Sahyadri Precious Metals):** View hydrometallurgical feedstock recovery.
- **Regulator (SPCB Nashik Officer):** Statutory inspection view — confidentiality shields are automatically bypassed for regulatory oversight.
- **MIDC Cluster Administrator:** Full administrative oversight over the Nashik corridor.

---

## 📡 API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/state` | Returns all facilities, streams, matches, manifests, and aggregated ESG metrics. Support `?reset=true` to restore default seed state. |
| `POST` | `/api/streams` | Ingests a new supply/demand stream and re-executes the deterministic matching engine. |
| `POST` | `/api/matches/[id]/consent` | Toggles bilateral consent (`party: 'generator' \| 'offtaker'`) and stamps mutual consent unlocks. |
| `GET` | `/api/manifests` | Retrieves all active Form 10 manifests. |
| `POST` | `/api/manifests` | Generates a new official CPCB Form 10 manifest from an approved match proposal. |
| `PATCH` | `/api/manifests/[id]` | Updates the movement status (`IN_TRANSIT`, `DELIVERED`, `ACCEPTED_AT_SITE`) and active copy color. |

---

## 📜 Regulatory Reference

- **Rule 19 (1):** *Hazardous and Other Wastes (Management and Transboundary Movement) Rules, 2016* (Ministry of Environment, Forest and Climate Change, Govt. of India).
- **Water (Prevention and Control of Pollution) Act, 1974** & **Air (Prevention and Control of Pollution) Act, 1981**.
- **Central Pollution Control Board (CPCB)** Guidelines on Co-processing of Hazardous Wastes in Cement Kilns.

---

Developed for **ReBharat** — Advancing India's Industrial Symbiosis & Circular Manufacturing Economy.
