# AutoFleet Pro — Next.js 14 App Router

**Πλήρες σύστημα διαχείρισης στόλου οχημάτων** για εταιρείες εμπορίας μεταχειρισμένων αυτοκινήτων & φορτηγών, με έδρες σε Γερμανία & Ελλάδα.

Trilingual: **Ελληνικά / English / Deutsch** — switch at any time, all labels & PDF reports follow.

---

## Quick Start

```bash
# 1. Unzip & enter
unzip autofleet-nextjs.zip
cd autofleet-nextjs

# 2. Install
npm install

# 3. (Optional) add your Anthropic key for AI extraction
cp .env.example .env.local
# edit .env.local and set ANTHROPIC_API_KEY=sk-ant-...

# 4. Run
npm run dev
# → http://localhost:3000
```

---

## Features

### Per-Vehicle File — 8 Tabs

| Tab | Contents |
|---|---|
| **Info** | VIN, make, model, year, color, fuel, gearbox, mileage, plate, COC, condition, **vehicle photo** |
| **Purchase** | Seller, invoice no., price net/gross, VAT type (Standard / Margin Scheme / None), extra costs |
| **Import Transport** | CMR no., carrier, truck plate, driver, origin→destination, dates, cost + **🖨 Print CMR** |
| **Storage** | DE/GR depot, cost/day (auto-calculates days × rate), work items with date & technician |
| **Sale** | Buyer, invoice no., price, VAT type |
| **Export Transport** | CMR, carrier, delivery details + **🖨 Print CMR** |
| **Documents** | Upload PDF/JPG/PNG via signed Supabase Storage URLs, **AI extraction** fills vehicle data automatically |
| **Financials** | Full P&L: all costs vs. sale price, profit/loss, margin % |

### AI Document Extraction
Upload any invoice, COC, registration document, CMR → click **🤖 Extract with AI** → Claude reads the document server-side and fills all matching fields across all tabs automatically.

### CMR Waybill Printing
Transport tab → **🖨 Print CMR** → opens a pre-filled, printable international CMR consignment note in a new tab. Print or save as PDF.

### PDF Reports
One click → professional PDF with all vehicle data, full cost breakdown, and P&L.

### CSV Export
Vehicles list → **📊 CSV** → exports current filtered list with all fields to Excel-compatible CSV (UTF-8 with BOM for Greek characters).

### Vehicle Photos
Info tab → click the photo zone → upload any image → appears in the vehicle header.

### Cloud-Backed Data
Vehicles use canonical UUIDs internally, human-friendly `VH-*` business references in the UI, and private Supabase Storage paths for document ingestion.

---

## Project Structure

```
autofleet-nextjs/
├── app/
│   ├── api/
│   │   ├── extract/route.ts    ← Server-side AI extraction (Anthropic API)
│   │   └── cmr/route.ts        ← CMR waybill HTML generator
│   ├── dashboard/page.tsx       ← Stats + recent vehicles + status overview
│   ├── vehicles/
│   │   ├── page.tsx             ← List with search, filter, CSV export
│   │   └── [id]/page.tsx        ← Vehicle detail — all 8 tabs
│   ├── settings/page.tsx        ← Company info, API key, language, data I/O
│   ├── error.tsx                ← Global error boundary
│   ├── loading.tsx              ← Loading skeleton
│   ├── not-found.tsx            ← 404 page
│   └── globals.css              ← CSS variables + utility classes
│
├── components/
│   ├── layout/
│   │   ├── AppShell.tsx         ← Root shell (init DB, layout)
│   │   ├── Sidebar.tsx          ← Nav + lang switcher + mobile slide-in
│   │   ├── Header.tsx           ← Title + new vehicle button + hamburger
│   │   └── Toast.tsx            ← Notification toasts
│   ├── tabs/
│   │   ├── InfoTab.tsx          ← Vehicle info + photo upload
│   │   ├── PurchaseTab.tsx      ← Purchase details + extra costs
│   │   ├── TransportTab.tsx     ← Transport + CMR print (import & export)
│   │   ├── StorageTab.tsx       ← Storage + work items
│   │   ├── SaleTab.tsx          ← Sale details
│   │   ├── DocumentsTab.tsx     ← File upload + AI extraction
│   │   └── FinancialsTab.tsx    ← P&L analysis + PDF export
│   ├── ui/
│   │   └── FormField.tsx        ← FormInput, FormSelect, FormTextarea, FormGrid
│   └── vehicles/
│       └── StatusBadge.tsx      ← Coloured status chip
│
├── hooks/
│   ├── useVehicle.ts            ← Reactive vehicle selector
│   └── useTranslation.ts       ← T() helper bound to current language
│
├── lib/
│   ├── types.ts                 ← All TypeScript interfaces
│   ├── i18n.ts                  ← EL / EN / DE translations
│   ├── supabase/                ← Supabase clients, DB mappers, activity log
│   ├── defaults.ts              ← createVehicle() factory
│   ├── financials.ts            ← computeFin() → P&L
│   ├── pdf.ts                   ← generateVehiclePDF() via jsPDF
│   ├── csvExport.ts             ← exportVehiclesCSV()
│   └── utils.ts                 ← fmtCur, fmtDate, catIcon, statusIcon, …
│
└── store/
    └── useFleetStore.ts         ← Zustand store: all state + Supabase-backed sync
```

---

## Vehicle Status Flow

```
purchased → transit_in → at_depot → for_sale → sold → transit_out → delivered
```

---

## VAT / Tax Handling

| Mode | German | Greek | Use case |
|---|---|---|---|
| **Standard VAT** | 19% MwSt | 24% ΦΠΑ | New vehicles, B2C domestic |
| **Margin Scheme** | Differenzbesteuerung | Καθεστώς Περιθωρίου | Used vehicles — tax on margin only |
| **No VAT** | Ohne MwSt | Χωρίς ΦΠΑ | Intra-EU B2B export |

---

## API Routes

| Route | Method | Description |
|---|---|---|
| `/api/create-upload-url` | POST | Create a signed upload URL for a vehicle document using canonical `vehicle.id` UUID |
| `/api/extract` | POST | AI document data extraction (server-side, key stays secret) |
| `/api/cmr` | GET | Generate printable CMR waybill HTML |

### Create upload URL body
```json
{
  "vehicleId": "uuid",
  "documentType": "invoice",
  "mimeType": "application/pdf"
}
```

### Extract endpoint body
```json
{
  "base64Data": "...",
  "mimeType": "application/pdf",
  "apiKey": "sk-ant-..." 
}
```
`apiKey` is optional if `ANTHROPIC_API_KEY` env var is set.

---

## Environment Variables

```bash
# .env.local
ANTHROPIC_API_KEY=sk-ant-...   # Optional — can also be set in app Settings
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 |
| State | Zustand 4 |
| Storage | Supabase Postgres + private Supabase Storage |
| PDF | jsPDF 2.5 |
| Styling | Tailwind CSS + custom CSS variables |
| AI | Anthropic Claude (`claude-sonnet-4-20250514`) |

---

## Data Management

- **Export JSON** — full backup of all vehicle data (Settings page)
- **Import JSON** — restore from backup  
- **Export CSV** — Excel-compatible spreadsheet of all vehicles with all financial fields
- User-facing exports keep `businessId` (`VH-*`) while routing, APIs, storage, and logs use canonical UUIDs internally
