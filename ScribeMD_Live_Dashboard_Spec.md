# ScribeMD™ - Live Visit Dashboard
## Cursor AI Development Specification

**Version:** 3.0  
**Last Updated:** January 2026  
**Status:** Ready for Development  

---

## The Vision

**ScribeMD is a Live Visit Dashboard that fills itself during the patient conversation.**

ScribeMD is the **core clinical interface** of the 4doctors.ai platform. It integrates with:

| Component | What It Does | How It Connects to ScribeMD |
|-----------|--------------|----------------------------|
| **ScribeMD** | Live Visit Dashboard | THE main screen during patient visits |
| **Care Coordination Network** | HIPAA-compliant sharing between providers | Routes referrals, shares records, sends updates |
| **Patient Dashboard** | Patient-facing app/portal | Shows patients their visit items, updates, appointments |
| **ClaimCoach** | Billing validation | Validates codes before claim submission |
| **RevenueRx** | Claims submission | Submits claims created by ScribeMD |
| **Prior Auth Engine** | PA workflow | Processes PA items created by ScribeMD |
| **E-Prescribing** | Surescripts integration | Sends Rx items to pharmacies |

**This spec covers ScribeMD + the Care Coordination Network as an integrated system.**

The AI listens and populates the dashboard in real-time:
- Symptoms appear as they're mentioned
- Prescriptions are created as they're discussed
- Prior auths are detected and pre-filled
- The claim codes itself
- Orders queue up automatically

**When the visit ends, the doctor reviews a complete dashboard, clicks approve, and is DONE.**

Everything routes to automated systems or back-office queues. The doctor goes home at 5.

---

## The Value Proposition

### Before ScribeMD (Today's Reality)
```
5:00 PM - Last patient leaves
5:00 PM - Start catching up on 8 incomplete charts
6:30 PM - Still entering orders, looking up codes
7:30 PM - Writing notes, filling PA forms
9:00 PM - Finally done. Burned out. Hate medicine.
```

### After ScribeMD
```
5:00 PM - Last patient leaves
5:00 PM - All charts complete. All orders sent. All claims coded.
5:05 PM - Go home. See family. Remember why you became a doctor.
```

---

## How It Works

### During the Visit

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  Doctor talks to patient naturally                                          │
│                           ↓                                                 │
│  AI LISTENS and EXTRACTS in real-time                                       │
│                           ↓                                                 │
│  Dashboard POPULATES as conversation flows                                  │
│                                                                             │
│  🎤 "...chest pain when climbing stairs..."                                 │
│      └→ Dashboard: + Symptom: "Chest pain on exertion"                      │
│      └→ Dashboard: + ICD-10: R07.9                                          │
│                                                                             │
│  🎤 "...going to start aspirin 81 daily..."                                 │
│      └→ Dashboard: + Rx: Aspirin 81mg, QD, #90, 3 refills                   │
│      └→ Dashboard: + Treatment: "Start aspirin therapy"                     │
│                                                                             │
│  🎤 "...order a stress echo..."                                             │
│      └→ Dashboard: + Order: Stress Echocardiogram                           │
│      └→ Dashboard: + PA Required (Aetna rule) → PA auto-created             │
│      └→ Dashboard: + CPT: 93350                                             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### End of Visit

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  Doctor ends recording                                                      │
│                           ↓                                                 │
│  Dashboard is COMPLETE                                                      │
│  - All symptoms/findings captured                                           │
│  - All treatments documented                                                │
│  - All Rx ready to send                                                     │
│  - All orders queued                                                        │
│  - Claim fully coded                                                        │
│  - PA forms pre-filled                                                      │
│  - Follow-up scheduled                                                      │
│                           ↓                                                 │
│  Doctor REVIEWS (60-90 seconds)                                             │
│  - Glance at each section                                                   │
│  - Add anything missed (rare)                                               │
│  - Fix any errors (rare)                                                    │
│                           ↓                                                 │
│  Doctor clicks [✅ APPROVE & SEND]                                          │
│                           ↓                                                 │
│  DONE. Next patient.                                                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### After Approval

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  AUTOMATIC ROUTING:                                                         │
│                                                                             │
│  💊 Prescriptions      ──→ E-Prescribe ──→ Pharmacy (automatic)             │
│  🔐 Prior Auths        ──→ PA Queue ──→ Auto-submit OR back office          │
│  🔬 Lab Orders         ──→ Lab Interface ──→ Quest/LabCorp (automatic)      │
│  🏥 Claim              ──→ Clearinghouse ──→ Payer (automatic)              │
│  📋 Note               ──→ EHR/Chart (automatic)                            │
│  📄 Patient Instructions ──→ Portal (automatic)                             │
│  📅 Follow-up          ──→ Scheduling Queue ──→ Front desk                  │
│                                                                             │
│  BACK OFFICE QUEUES (for items needing human touch):                        │
│                                                                             │
│  PA Team sees:     "3 new PAs to process"                                   │
│  Billing sees:     "2 claims flagged for review"                            │
│  Front Desk sees:  "5 follow-ups to schedule"                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Screen Specifications

### Main Screen: Live Visit Dashboard

This is THE screen. It's open during the entire patient visit and fills itself in real-time.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ScribeMD │ 👤 Robert Garcia, 58 M │ Aetna PPO        🔴 RECORDING  ⏱️ 4:32  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│ 🎤 "...follow up in about two weeks after we get the stress test results"  │
│                                                                             │
├───────────────────────────────────┬─────────────────────────────────────────┤
│                                   │                                         │
│  🩺 SYMPTOMS & FINDINGS           │  💉 ASSESSMENT & PLAN                   │
│  ══════════════════════════════   │  ══════════════════════════════         │
│                                   │                                         │
│  ✓ Chest pain on exertion         │  ✓ Exertional angina - evaluate for CAD │
│  ✓ 2 weeks duration               │  ✓ Start aspirin therapy                │
│  ✓ Pressure-like quality          │  ✓ Order cardiac stress test            │
│  ✓ Relieved with rest             │  ✓ Check lipids                         │
│  ✓ No radiation to arm/jaw        │  ✓ Continue current HTN regimen         │
│  ✓ No dyspnea, diaphoresis        │  ✓ ER precautions given                 │
│  ✓ BP 138/86, HR 78               │  ✨ Follow-up 2 weeks ← NEW             │
│  ✓ EKG: Normal sinus rhythm       │                                         │
│                                   │                                         │
│  [+ Add Finding]                  │  [+ Add Plan Item]                      │
│                                   │                                         │
├───────────────────────────────────┼─────────────────────────────────────────┤
│                                   │                                         │
│  💊 PRESCRIPTIONS                 │  🔬 ORDERS                              │
│  ══════════════════════════════   │  ══════════════════════════════         │
│                                   │                                         │
│  ┌─────────────────────────────┐  │  ┌─────────────────────────────────┐   │
│  │ Aspirin 81mg                │  │  │ Stress Echocardiogram           │   │
│  │ Take 1 tablet daily        │  │  │ ICD: R07.9                      │   │
│  │ Qty: 90 │ Refills: 3       │  │  │ ⚠️ PA REQUIRED (Aetna)           │   │
│  │ Pharmacy: CVS #4521        │  │  │ [PA Auto-Created ✓]             │   │
│  │ [Edit] [Remove]            │  │  └─────────────────────────────────┘   │
│  └─────────────────────────────┘  │                                         │
│                                   │  ┌─────────────────────────────────┐   │
│  [+ Add Prescription]             │  │ Lipid Panel                     │   │
│                                   │  │ ICD: E78.5                      │   │
│                                   │  │ Lab: Quest Diagnostics          │   │
│                                   │  └─────────────────────────────────┘   │
│                                   │                                         │
│                                   │  [+ Add Order]                          │
│                                   │                                         │
├───────────────────────────────────┴─────────────────────────────────────────┤
│                                                                             │
│  🔐 PRIOR AUTHORIZATIONS                                                    │
│  ═══════════════════════════════════════════════════════════════════════    │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ Stress Echocardiogram (93350)                          Status: READY  │  │
│  │ Payer: Aetna PPO │ Member ID: AET882991023                            │  │
│  │ Diagnosis: R07.9 - Chest pain, unspecified                            │  │
│  │                                                                       │  │
│  │ Clinical Justification:                                               │  │
│  │ ┌───────────────────────────────────────────────────────────────────┐ │  │
│  │ │ 58-year-old male with new-onset exertional chest pain for 2       │ │  │
│  │ │ weeks, pressure-like quality, relieved by rest. History of HTN    │ │  │
│  │ │ and hyperlipidemia. EKG normal but clinical presentation          │ │  │
│  │ │ concerning for angina. Stress echocardiogram indicated to         │ │  │
│  │ │ evaluate for coronary artery disease given cardiac risk factors.  │ │  │
│  │ └───────────────────────────────────────────────────────────────────┘ │  │
│  │ [Edit Justification]                                                  │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  🏥 CLAIM                                                                   │
│  ═══════════════════════════════════════════════════════════════════════    │
│                                                                             │
│  DIAGNOSES (ICD-10)                    │  PROCEDURES (CPT)                  │
│  ☑️ R07.9  Chest pain (PRIMARY)        │  ☑️ 99214  Office Visit E/M 4      │
│  ☑️ I10    Hypertension                │     └ MDM: Moderate complexity     │
│  ☑️ E78.5  Hyperlipidemia              │  ☑️ 93000  EKG w/ interpretation   │
│  [+ Add Dx]                            │  [+ Add CPT]                       │
│                                        │                                    │
│  ─────────────────────────────────────────────────────────────────────────  │
│  ✅ Documentation supports all codes │ Denial Risk: LOW (3%)               │
│  💰 Estimated Reimbursement: $187.50                                        │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  📅 FOLLOW-UP: 2 weeks │ Reason: Review stress echo results    [Edit]      │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐                      ┌─────────────────────────────┐   │
│  │ ⏹️ End Recording │                      │ ✅ APPROVE & SEND ALL       │   │
│  └─────────────────┘                      └─────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Visual States

**Item Just Added (Highlight Animation)**
```
┌─────────────────────────────────┐
│ ✨ Aspirin 81mg         ← NEW   │  ← Glows briefly, then settles
│    Take 1 tablet daily          │
└─────────────────────────────────┘
```

**Item with Warning**
```
┌─────────────────────────────────┐
│ ⚠️ Stress Echocardiogram        │  ← Orange indicator
│    PA REQUIRED (Aetna)          │
│    [PA Auto-Created ✓]          │
└─────────────────────────────────┘
```

**Manually Added Item**
```
┌─────────────────────────────────┐
│ 👤 Atorvastatin 20mg            │  ← Different icon shows manual
│    Take 1 tablet at bedtime     │
└─────────────────────────────────┘
```

### Recording States

**Recording Active**
```
┌─────────────────────────────────────────────────────────────────┐
│ ScribeMD │ 👤 Robert Garcia │ 🔴 RECORDING  ⏱️ 4:32             │
├─────────────────────────────────────────────────────────────────┤
│ 🎤 "...follow up in about two weeks after the stress test..."  │  ← Live transcript
└─────────────────────────────────────────────────────────────────┘
```

**Recording Paused**
```
┌─────────────────────────────────────────────────────────────────┐
│ ScribeMD │ 👤 Robert Garcia │ ⏸️ PAUSED  ⏱️ 4:32                │
├─────────────────────────────────────────────────────────────────┤
│ Recording paused. Tap to resume.                                │
└─────────────────────────────────────────────────────────────────┘
```

**Recording Ended - Review Mode**
```
┌─────────────────────────────────────────────────────────────────┐
│ ScribeMD │ 👤 Robert Garcia │ ✅ REVIEW MODE  │ Duration: 8:24  │
├─────────────────────────────────────────────────────────────────┤
│ Review the dashboard below. Make any changes, then approve.     │
└─────────────────────────────────────────────────────────────────┘
```

### Add Item UI (Inline)

When doctor clicks [+ Add Prescription]:

```
┌─────────────────────────────────────────────────────────────────┐
│  💊 PRESCRIPTIONS                                               │
│  ══════════════════════════════                                 │
│                                                                 │
│  ┌─────────────────────────────┐                                │
│  │ Aspirin 81mg                │                                │
│  │ Take 1 tablet daily         │                                │
│  └─────────────────────────────┘                                │
│                                                                 │
│  ┌─ ADD PRESCRIPTION ─────────────────────────────────────────┐ │
│  │                                                            │ │
│  │ Drug: [Atorvastatin________________] ← Autocomplete        │ │
│  │                                                            │ │
│  │ Strength: [20mg ▼]  Form: [Tablet ▼]                       │ │
│  │                                                            │ │
│  │ Sig: [Take 1 tablet by mouth at bedtime_______________]    │ │
│  │                                                            │ │
│  │ Qty: [30___]  Days Supply: [30__]  Refills: [3__]          │ │
│  │                                                            │ │
│  │ Pharmacy: [CVS #4521 (on file) ▼]                          │ │
│  │                                                            │ │
│  │              [Cancel]  [Add to Dashboard]                  │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Approval Confirmation

After clicking [✅ APPROVE & SEND ALL]:

```
┌─────────────────────────────────────────────────────────────────┐
│ ✅ Visit Complete - Robert Garcia                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  SENT AUTOMATICALLY:                                            │
│  ────────────────────                                           │
│  ✅ Aspirin 81mg → CVS Pharmacy #4521                           │
│  ✅ Lipid Panel → Quest Diagnostics                             │
│  ✅ Claim submitted → Availity Clearinghouse                    │
│  ✅ Note signed → Patient chart                                 │
│  ✅ Instructions → Patient portal                               │
│                                                                 │
│  QUEUED FOR PROCESSING:                                         │
│  ──────────────────────                                         │
│  📋 Prior Auth (Stress Echo) → PA Team queue                    │
│  📋 Follow-up (2 weeks) → Front desk scheduling                 │
│                                                                 │
│  ────────────────────────────────────────────────────────────── │
│                                                                 │
│  NEXT PATIENT: Linda Chen (10:00 AM - Diabetes follow-up)       │
│                                                                 │
│       [Start Next Patient]        [Back to Schedule]            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Real-Time AI Processing

### Event Stream Architecture

The AI processes audio in real-time and emits events to update the dashboard:

```typescript
// WebSocket event stream from AI
interface DashboardEvent {
  type: 'add_item' | 'update_item' | 'remove_item' | 'transcript_update';
  category: 'symptom' | 'finding' | 'assessment' | 'plan' | 
            'prescription' | 'order' | 'prior_auth' | 
            'diagnosis_code' | 'procedure_code' | 'follow_up';
  data: any;
  confidence: number;
  source_text: string;  // What triggered this extraction
  timestamp: number;
}

// Example events from a conversation:

{ type: 'transcript_update', 
  text: "Patient reports chest pain when climbing stairs" }

{ type: 'add_item', 
  category: 'symptom',
  data: { text: "Chest pain on exertion" },
  confidence: 0.95,
  source_text: "chest pain when climbing stairs" }

{ type: 'add_item', 
  category: 'diagnosis_code',
  data: { code: "R07.9", description: "Chest pain, unspecified", is_primary: true },
  confidence: 0.92,
  source_text: "chest pain when climbing stairs" }

{ type: 'transcript_update', 
  text: "I'm going to start you on aspirin 81 milligrams daily" }

{ type: 'add_item', 
  category: 'prescription',
  data: { 
    drug_name: "Aspirin", 
    strength: "81mg", 
    sig: "Take 1 tablet by mouth once daily",
    quantity: 90,
    refills: 3
  },
  confidence: 0.98,
  source_text: "start you on aspirin 81 milligrams daily" }

{ type: 'add_item', 
  category: 'plan',
  data: { text: "Start aspirin therapy" },
  confidence: 0.95,
  source_text: "start you on aspirin 81 milligrams daily" }
```

### AI Extraction Rules

The AI is trained to extract:

| Heard | Action |
|-------|--------|
| Symptom description | → Add to Symptoms + relevant ICD-10 |
| Vital signs mentioned | → Add to Findings |
| Exam findings | → Add to Findings |
| "I'm going to prescribe/start..." | → Create Prescription item |
| "Order a..." | → Create Order item + check PA rules |
| "Refer to..." | → Create Referral item |
| "Follow up in..." | → Create Follow-up item |
| Diagnosis discussed | → Add to Assessment + ICD-10 to claim |
| Procedure performed | → Add CPT to claim |
| Time spent | → Update E/M calculation |

### PA Detection Logic

When an order is created, the system checks:

```python
def check_pa_requirement(order, patient_insurance):
    """
    Check if prior authorization is required
    Returns: (required: bool, reason: str, auto_create: bool)
    """
    
    # Get payer rules for this procedure
    payer_rules = get_payer_rules(patient_insurance.payer_id)
    procedure_rule = payer_rules.get(order.cpt_code)
    
    if procedure_rule and procedure_rule.pa_required:
        return (
            True, 
            f"Payer policy requires PA for {order.procedure_name}",
            True  # Auto-create the PA
        )
    
    # Check against known PA-required procedures
    if order.cpt_code in PA_REQUIRED_PROCEDURES:
        return (
            True,
            f"{order.procedure_name} commonly requires PA",
            True
        )
    
    return (False, None, False)
```

---

## Database Schema

```sql
-- =====================================================
-- VISIT DASHBOARD SESSION
-- =====================================================

CREATE TABLE scribemd_visits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    provider_id UUID NOT NULL REFERENCES providers(id),
    patient_id UUID NOT NULL REFERENCES patients(id),
    appointment_id UUID REFERENCES appointments(id),
    encounter_id UUID REFERENCES encounters(id),
    
    -- Status
    status VARCHAR(20) NOT NULL DEFAULT 'in_progress',
    -- 'in_progress', 'review', 'approved', 'sent'
    
    -- Recording
    recording_started_at TIMESTAMPTZ,
    recording_ended_at TIMESTAMPTZ,
    duration_seconds INTEGER,
    
    -- Transcript
    full_transcript TEXT,
    
    -- Approval
    approved_at TIMESTAMPTZ,
    approved_by UUID REFERENCES users(id),
    
    -- Routing results
    routing_results JSONB,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- =====================================================
-- DASHBOARD ITEMS (All categories in one table)
-- =====================================================

CREATE TABLE scribemd_dashboard_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID NOT NULL REFERENCES scribemd_visits(id) ON DELETE CASCADE,
    
    -- Category
    category VARCHAR(30) NOT NULL,
    -- 'symptom', 'finding', 'assessment', 'plan',
    -- 'prescription', 'order', 'prior_auth',
    -- 'diagnosis_code', 'procedure_code', 'follow_up', 'instruction'
    
    -- Content (flexible JSON based on category)
    item_data JSONB NOT NULL,
    
    -- Source
    source VARCHAR(20) DEFAULT 'ai', -- 'ai' or 'manual'
    source_text TEXT, -- The transcript text that triggered this
    ai_confidence DECIMAL(3,2),
    
    -- Status
    is_accepted BOOLEAN DEFAULT true, -- Doctor can uncheck
    is_modified BOOLEAN DEFAULT false,
    
    -- Execution (for actionable items)
    execution_status VARCHAR(20), -- 'pending', 'sent', 'queued', 'completed', 'failed'
    executed_at TIMESTAMPTZ,
    execution_result JSONB,
    routed_to VARCHAR(50), -- 'pharmacy', 'lab', 'pa_queue', 'billing', etc.
    
    -- Linking
    linked_record_type VARCHAR(50),
    linked_record_id UUID,
    
    -- Ordering for display
    display_order INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_dashboard_items_visit ON scribemd_dashboard_items(visit_id);
CREATE INDEX idx_dashboard_items_category ON scribemd_dashboard_items(category);


-- =====================================================
-- CLAIM (Assembled from diagnosis_code + procedure_code items)
-- =====================================================

CREATE TABLE scribemd_claims (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID NOT NULL REFERENCES scribemd_visits(id),
    
    -- Claim data
    diagnoses JSONB NOT NULL DEFAULT '[]',
    procedures JSONB NOT NULL DEFAULT '[]',
    
    -- Calculated fields
    primary_diagnosis VARCHAR(10),
    em_level INTEGER,
    em_method VARCHAR(20), -- 'mdm' or 'time'
    total_units DECIMAL(5,2),
    estimated_reimbursement DECIMAL(10,2),
    
    -- Validation
    denial_risk_score DECIMAL(3,2),
    validation_flags JSONB DEFAULT '[]',
    documentation_complete BOOLEAN DEFAULT false,
    
    -- Submission
    submitted_at TIMESTAMPTZ,
    submitted_to VARCHAR(100), -- Clearinghouse
    submission_result JSONB,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- =====================================================
-- CLINICAL NOTE (Auto-generated from symptoms/findings/assessment/plan)
-- =====================================================

CREATE TABLE scribemd_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID NOT NULL REFERENCES scribemd_visits(id),
    
    -- Note content
    note_type VARCHAR(30) DEFAULT 'soap',
    subjective TEXT,
    objective TEXT,
    assessment TEXT,
    plan_text TEXT,
    full_note TEXT,
    
    -- Signature
    is_signed BOOLEAN DEFAULT false,
    signed_at TIMESTAMPTZ,
    signed_by UUID REFERENCES providers(id),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## API Endpoints

```typescript
// =====================================================
// VISIT SESSION
// =====================================================

// Start a new visit dashboard
POST /api/v1/scribemd/visits
{ "patient_id": "uuid", "appointment_id": "uuid" }
Response: { "visit_id": "uuid", "websocket_url": "wss://..." }

// Get visit with all dashboard items
GET /api/v1/scribemd/visits/:visit_id
Response: {
  visit: { ... },
  items: {
    symptoms: [...],
    findings: [...],
    assessment: [...],
    plan: [...],
    prescriptions: [...],
    orders: [...],
    prior_auths: [...],
  },
  claim: { diagnoses: [...], procedures: [...], ... },
  note: { ... }
}


// =====================================================
// REAL-TIME RECORDING (WebSocket)
// =====================================================

WS /api/v1/scribemd/visits/:visit_id/stream

// Client → Server
{ "type": "audio_chunk", "data": "base64..." }
{ "type": "pause" }
{ "type": "resume" }
{ "type": "end" }

// Server → Client (real-time dashboard updates)
{ "type": "transcript", "text": "...", "is_final": false }
{ "type": "item_added", "category": "prescription", "item": {...} }
{ "type": "item_updated", "item_id": "uuid", "changes": {...} }
{ "type": "claim_updated", "claim": {...} }


// =====================================================
// DASHBOARD ITEMS (Manual operations)
// =====================================================

// Add item manually
POST /api/v1/scribemd/visits/:visit_id/items
{ "category": "prescription", "item_data": {...} }

// Update item
PATCH /api/v1/scribemd/visits/:visit_id/items/:item_id
{ "item_data": {...}, "is_accepted": true }

// Remove item
DELETE /api/v1/scribemd/visits/:visit_id/items/:item_id

// Toggle item acceptance (checkbox)
POST /api/v1/scribemd/visits/:visit_id/items/:item_id/toggle


// =====================================================
// CLAIM
// =====================================================

// Get claim details
GET /api/v1/scribemd/visits/:visit_id/claim

// Update claim (add/remove codes)
PATCH /api/v1/scribemd/visits/:visit_id/claim
{ "add_diagnosis": "E11.9", "remove_procedure": "99213" }


// =====================================================
// APPROVE & SEND
// =====================================================

// Approve visit and route all items
POST /api/v1/scribemd/visits/:visit_id/approve
{
  "sign_note": true,
  "send_prescriptions": true,
  "send_orders": true,
  "submit_claim": true,
  "queue_prior_auths": true,
  "send_instructions": true,
  "create_followup_task": true
}

Response: {
  "status": "approved",
  "routing_results": {
    "prescriptions": { "sent": 1, "pharmacy": "CVS #4521" },
    "orders": { "sent": 1, "destination": "Quest Diagnostics" },
    "claim": { "submitted": true, "clearinghouse": "Availity" },
    "prior_auths": { "queued": 1, "queue": "PA Team" },
    "note": { "signed": true },
    "instructions": { "sent": true, "destination": "Patient Portal" },
    "followup": { "task_created": true, "assigned_to": "Front Desk" }
  }
}
```

---

## Vue Component Architecture

```
src/
├── views/
│   └── scribemd/
│       └── LiveDashboardView.vue      # THE main view
│
├── components/
│   └── scribemd/
│       ├── dashboard/
│       │   ├── DashboardHeader.vue         # Patient info, recording status
│       │   ├── LiveTranscript.vue          # Current speech display
│       │   ├── DashboardGrid.vue           # Main grid layout
│       │   │
│       │   ├── sections/
│       │   │   ├── SymptomsSection.vue
│       │   │   ├── FindingsSection.vue
│       │   │   ├── AssessmentSection.vue
│       │   │   ├── PlanSection.vue
│       │   │   ├── PrescriptionsSection.vue
│       │   │   ├── OrdersSection.vue
│       │   │   ├── PriorAuthSection.vue
│       │   │   ├── ClaimSection.vue
│       │   │   └── FollowUpSection.vue
│       │   │
│       │   ├── items/
│       │   │   ├── DashboardItem.vue       # Base item component
│       │   │   ├── PrescriptionCard.vue
│       │   │   ├── OrderCard.vue
│       │   │   ├── PriorAuthCard.vue
│       │   │   ├── DiagnosisChip.vue
│       │   │   └── ProcedureChip.vue
│       │   │
│       │   ├── forms/
│       │   │   ├── AddPrescriptionForm.vue
│       │   │   ├── AddOrderForm.vue
│       │   │   ├── AddDiagnosisForm.vue
│       │   │   └── AddProcedureForm.vue
│       │   │
│       │   └── ApprovalModal.vue
│       │
│       └── shared/
│           ├── DrugAutocomplete.vue
│           ├── CodeSearch.vue
│           └── PharmacySelector.vue
│
├── composables/
│   └── scribemd/
│       ├── useLiveDashboard.ts        # Main dashboard state
│       ├── useWebSocketStream.ts      # Real-time audio/events
│       ├── useDashboardItems.ts       # Item CRUD
│       └── useVisitApproval.ts        # Approval flow
│
└── stores/
    └── scribemd/
        └── dashboardStore.ts          # Pinia store for dashboard state
```

### Key Composable: useLiveDashboard.ts

```typescript
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useDashboardStore } from '@/stores/scribemd/dashboardStore';

export function useLiveDashboard(visitId: string) {
  const store = useDashboardStore();
  const ws = ref<WebSocket | null>(null);
  const isRecording = ref(false);
  const currentTranscript = ref('');
  
  // Connect to WebSocket for real-time updates
  function connect() {
    ws.value = new WebSocket(`${WS_URL}/visits/${visitId}/stream`);
    
    ws.value.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case 'transcript':
          currentTranscript.value = data.text;
          break;
          
        case 'item_added':
          // Add item to appropriate category with animation
          store.addItem(data.category, data.item, { animate: true });
          break;
          
        case 'item_updated':
          store.updateItem(data.item_id, data.changes);
          break;
          
        case 'claim_updated':
          store.updateClaim(data.claim);
          break;
      }
    };
  }
  
  // Grouped items for display
  const dashboardSections = computed(() => ({
    symptoms: store.items.filter(i => i.category === 'symptom'),
    findings: store.items.filter(i => i.category === 'finding'),
    assessment: store.items.filter(i => i.category === 'assessment'),
    plan: store.items.filter(i => i.category === 'plan'),
    prescriptions: store.items.filter(i => i.category === 'prescription'),
    orders: store.items.filter(i => i.category === 'order'),
    priorAuths: store.items.filter(i => i.category === 'prior_auth'),
    followUp: store.items.filter(i => i.category === 'follow_up'),
  }));
  
  // Claim assembled from code items
  const claim = computed(() => store.claim);
  
  // Can approve when required items are present
  const canApprove = computed(() => {
    return store.claim.diagnoses.length > 0 && 
           store.claim.procedures.length > 0;
  });
  
  async function approveAndSend() {
    return await api.post(`/visits/${visitId}/approve`, {
      sign_note: true,
      send_prescriptions: true,
      send_orders: true,
      submit_claim: true,
      queue_prior_auths: true,
      send_instructions: true,
      create_followup_task: true
    });
  }
  
  onMounted(() => connect());
  onUnmounted(() => ws.value?.close());
  
  return {
    isRecording,
    currentTranscript,
    dashboardSections,
    claim,
    canApprove,
    approveAndSend,
    // ... item manipulation methods
  };
}
```

---

## Routing Configuration

Define where each item type goes after approval:

```typescript
const ROUTING_CONFIG = {
  prescription: {
    automatic: true,
    destination: 'e_prescribe',
    handler: 'SurescriptsService.sendNewRx',
    fallback_queue: 'pharmacy_issues'
  },
  
  order_lab: {
    automatic: true,
    destination: 'lab_interface',
    handler: 'LabOrderService.submit',
    fallback_queue: 'lab_orders'
  },
  
  order_imaging: {
    automatic: false,  // Often needs PA first
    destination: 'imaging_orders',
    handler: 'ImagingOrderService.submit',
    fallback_queue: 'imaging_orders'
  },
  
  prior_auth: {
    automatic: false,  // Usually needs human review
    destination: 'pa_queue',
    handler: 'PriorAuthService.queue',
    assigned_to: 'pa_team'
  },
  
  claim: {
    automatic: true,
    destination: 'clearinghouse',
    handler: 'ClaimService.submit',
    fallback_queue: 'billing_review'
  },
  
  note: {
    automatic: true,
    destination: 'ehr',
    handler: 'EHRService.signAndFile'
  },
  
  patient_instructions: {
    automatic: true,
    destination: 'patient_portal',
    handler: 'PortalService.sendInstructions'
  },
  
  follow_up: {
    automatic: false,
    destination: 'scheduling_queue',
    handler: 'SchedulingService.createTask',
    assigned_to: 'front_desk'
  }
};
```

---

## Summary

**ScribeMD is a Live Visit Dashboard that:**

1. **Opens when patient visit starts**
2. **Listens to the conversation**
3. **Populates itself in real-time** - symptoms, findings, Rx, orders, codes, everything
4. **Auto-creates PA forms** when it detects a PA-required service
5. **Builds the claim** as diagnosis and procedures are discussed
6. **Lets doctor add items manually** via simple inline forms
7. **At end of visit** - doctor reviews, tweaks if needed, clicks APPROVE
8. **Routes everything** - Rx to pharmacy, orders to labs, claim to clearinghouse, PAs to back office

**Doctor is DONE when the patient leaves.**

---

## Development Phases

### Phase 1: Foundation (Week 1-2)
- [ ] Database schema
- [ ] Visit session API
- [ ] WebSocket infrastructure
- [ ] Basic dashboard UI shell

### Phase 2: Real-Time Extraction (Week 3-5)
- [ ] Audio streaming
- [ ] AI extraction pipeline
- [ ] Real-time event emission
- [ ] Dashboard live updates

### Phase 3: Dashboard Sections (Week 6-7)
- [ ] All section components
- [ ] Item cards
- [ ] Manual add forms
- [ ] Claim builder

### Phase 4: Routing & Execution (Week 8-9)
- [ ] Approval flow
- [ ] E-Prescribe integration
- [ ] Lab order integration
- [ ] Claim submission
- [ ] PA queue integration

### Phase 5: Polish (Week 10)
- [ ] Animations for new items
- [ ] Error handling
- [ ] Offline support
- [ ] Testing

---

---

## Patient Dashboard (Real-Time Updates)

While the doctor uses ScribeMD, the **patient sees their own dashboard** updating in real-time with information relevant to THEM.

### During the Visit

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 4doctors │ 👤 Robert Garcia                            Visit in Progress 🔵 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  📍 TODAY'S VISIT                                                           │
│  Dr. Michael Chen │ Internal Medicine │ Started 9:15 AM                     │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  💊 MEDICATIONS                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ ✨ NEW: Aspirin 81mg                                                  │  │
│  │ Take 1 tablet by mouth once daily                                     │  │
│  │ For: Heart health                                                     │  │
│  │ Status: Being sent to CVS on Main St...                               │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  🔬 TESTS ORDERED                                                           │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ ✨ NEW: Stress Echocardiogram                                         │  │
│  │ A test to check how your heart works during activity                  │  │
│  │ Status: Checking insurance coverage...                                │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ ✨ NEW: Lipid Panel (Cholesterol Test)                                │  │
│  │ Blood test to check your cholesterol levels                           │  │
│  │ Status: Order being sent to Quest Diagnostics                         │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  🏥 REFERRALS                                                               │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ ✨ NEW: Cardiology Referral                                           │  │
│  │ Dr. Chen is referring you to a heart specialist                       │  │
│  │ Status: Finding available cardiologists...                            │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  📅 FOLLOW-UP                                                               │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ ✨ Return visit in 2 weeks                                            │  │
│  │ To review your test results                                           │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### After Visit Approved (Immediate Updates)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 4doctors │ 👤 Robert Garcia                                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ✅ VISIT COMPLETE                                                          │
│  Dr. Michael Chen │ January 29, 2026                                        │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  📋 VISIT SUMMARY                                                           │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ What we discussed:                                                    │  │
│  │ You came in for chest pain that happens when you're active.          │  │
│  │ Dr. Chen examined you and did an EKG (heart tracing) which           │  │
│  │ looked normal. To learn more about your heart, we're ordering        │  │
│  │ a stress test and referring you to a cardiologist.                   │  │
│  │                                                                       │  │
│  │ [View Full Visit Summary]                                             │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  💊 YOUR MEDICATIONS                                                        │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ ✅ Aspirin 81mg - SENT TO PHARMACY                                    │  │
│  │    CVS Pharmacy #4521 │ 123 Main Street                               │  │
│  │    Ready for pickup in approximately 1 hour                           │  │
│  │                                                                       │  │
│  │    💊 Why am I taking this?                                           │  │
│  │    Aspirin helps prevent blood clots and protects your heart.         │  │
│  │                                                                       │  │
│  │    [Get Directions to Pharmacy]                                       │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  🔬 YOUR TESTS                                                              │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ ⏳ Stress Echocardiogram - INSURANCE REVIEW                           │  │
│  │    Your insurance (Aetna) requires approval for this test.            │  │
│  │    We've submitted the request - usually takes 24-48 hours.           │  │
│  │    We'll notify you when it's approved!                               │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ ✅ Lipid Panel - ORDER SENT                                           │  │
│  │    Quest Diagnostics │ Any location                                   │  │
│  │    No fasting required (but fasting gives best results)               │  │
│  │                                                                       │  │
│  │    [Find Quest Location Near Me]                                      │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  🏥 YOUR REFERRALS                                                          │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ 📤 Cardiology Referral - SENT                                         │  │
│  │                                                                       │  │
│  │ You've been referred to:                                              │  │
│  │ ┌─────────────────────────────────────────────────────────────────┐   │  │
│  │ │ 👩‍⚕️ Dr. Sarah Smith, MD, FACC                                    │   │  │
│  │ │ Cardiology │ ⭐ 4.9 (234 reviews)                                │   │  │
│  │ │ Heart & Vascular Institute                                      │   │  │
│  │ │ 456 Cardiac Blvd, Suite 100                                     │   │  │
│  │ │                                                                 │   │  │
│  │ │ ✅ Your records have been securely shared                       │   │  │
│  │ │ ✅ Your insurance is accepted                                   │   │  │
│  │ │ ✅ Next available: Tomorrow 2:30 PM                             │   │  │
│  │ │                                                                 │   │  │
│  │ │ [Book Appointment]  [View Profile]  [Get Directions]            │   │  │
│  │ └─────────────────────────────────────────────────────────────────┘   │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  📅 UPCOMING APPOINTMENTS                                                   │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ 📅 Follow-up with Dr. Chen                                            │  │
│  │    2 weeks from now │ To review test results                          │  │
│  │    [Schedule Now]                                                     │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ⚠️ IMPORTANT: WHEN TO SEEK EMERGENCY CARE                                  │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ Go to the ER or call 911 if you experience:                           │  │
│  │ • Chest pain at rest (not just with activity)                         │  │
│  │ • Chest pain lasting more than a few minutes                          │  │
│  │ • Pain spreading to arm, jaw, or back                                 │  │
│  │ • Shortness of breath, sweating, or nausea with chest pain            │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Days Later - Ongoing Updates

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 4doctors │ 👤 Robert Garcia │ 🔔 3 New Updates                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  🔔 RECENT UPDATES                                                          │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ ✅ Jan 30, 9:15 AM - INSURANCE APPROVED!                              │  │
│  │                                                                       │  │
│  │ Great news! Your stress echocardiogram has been approved by Aetna.   │  │
│  │                                                                       │  │
│  │ 📞 Cardiac Imaging Associates will call you to schedule.              │  │
│  │    Phone: (555) 123-4567                                              │  │
│  │    Hours: Mon-Fri 8am-5pm                                             │  │
│  │                                                                       │  │
│  │ [Call Now]  [Get Directions]                                          │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ 📋 Jan 30, 2:45 PM - LAB RESULTS READY                                │  │
│  │                                                                       │  │
│  │ Your lipid panel results are in!                                      │  │
│  │                                                                       │  │
│  │ Total Cholesterol: 245 mg/dL (⚠️ High)                                │  │
│  │ LDL ("Bad"): 165 mg/dL (⚠️ High)                                      │  │
│  │ HDL ("Good"): 42 mg/dL (⚠️ Low)                                       │  │
│  │ Triglycerides: 190 mg/dL (Borderline)                                 │  │
│  │                                                                       │  │
│  │ Dr. Chen has reviewed these results. These will be discussed          │  │
│  │ at your follow-up visit.                                              │  │
│  │                                                                       │  │
│  │ [View Full Results]  [Message Dr. Chen]                               │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ 👩‍⚕️ Feb 5, 3:30 PM - CARDIOLOGY VISIT COMPLETE                        │  │
│  │                                                                       │  │
│  │ You saw Dr. Sarah Smith (Cardiology) today.                           │  │
│  │                                                                       │  │
│  │ What Dr. Smith found:                                                 │  │
│  │ Your symptoms are consistent with stable angina - chest discomfort    │  │
│  │ from your heart working harder during activity. Your stress test      │  │
│  │ today will help us understand this better.                            │  │
│  │                                                                       │  │
│  │ New medication started:                                               │  │
│  │ 💊 Metoprolol 25mg - Take twice daily                                 │  │
│  │    → Sent to CVS on Main St                                           │  │
│  │                                                                       │  │
│  │ Next steps:                                                           │  │
│  │ • Stress test results in 2-3 days                                     │  │
│  │ • Follow-up with Dr. Smith: Feb 12                                    │  │
│  │                                                                       │  │
│  │ ✅ Dr. Chen has been notified of your visit                           │  │
│  │                                                                       │  │
│  │ [View Full Summary]  [Add to Calendar]                                │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  💊 CURRENT MEDICATIONS                                                     │
│                                                                             │
│  • Aspirin 81mg - 1 tablet daily (Dr. Chen)                                │
│  • Lisinopril 10mg - 1 tablet daily (Dr. Chen) - existing                  │
│  • Metoprolol 25mg - 1 tablet twice daily (Dr. Smith) ✨ NEW                │
│                                                                             │
│  [View All Medications]  [Request Refill]                                   │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  👥 YOUR CARE TEAM                                                          │
│                                                                             │
│  👨‍⚕️ Dr. Michael Chen - Primary Care (PCP)                                 │
│  👩‍⚕️ Dr. Sarah Smith - Cardiology                                          │
│                                                                             │
│  [Message Care Team]                                                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Non-4doctors Referral (The Old Way)

When the specialist is NOT on 4doctors, the patient experience degrades:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 4doctors │ 👤 Robert Garcia                                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  🏥 YOUR REFERRALS                                                          │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ 📤 Cardiology Referral                                                │  │
│  │                                                                       │  │
│  │ You've been referred to:                                              │  │
│  │ ┌─────────────────────────────────────────────────────────────────┐   │  │
│  │ │ 👨‍⚕️ Dr. Robert Johnson, MD                                       │   │  │
│  │ │ Cardiology                                                      │   │  │
│  │ │ Old School Medical Group                                        │   │  │
│  │ │ 789 Legacy Lane                                                 │   │  │
│  │ │ Phone: (555) 987-6543                                           │   │  │
│  │ │                                                                 │   │  │
│  │ │ ⚠️ This office is NOT on the 4doctors network                   │   │  │
│  │ │                                                                 │   │  │
│  │ │ You'll need to:                                                 │   │  │
│  │ │ 📞 Call to schedule your appointment                            │   │  │
│  │ │ 📋 Fill out their new patient paperwork                         │   │  │
│  │ │ 💳 Bring your insurance card                                    │   │  │
│  │ │ 📄 Your records have been faxed (may take 24-48 hrs)            │   │  │
│  │ │                                                                 │   │  │
│  │ │ [Download Your Records]  [Print Referral Letter]                │   │  │
│  │ └─────────────────────────────────────────────────────────────────┘   │  │
│  │                                                                       │  │
│  │ 💡 TIP: Ask Dr. Johnson's office if they use 4doctors!               │  │
│  │                                                                       │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  😔 With non-4doctors providers:                                            │
│  • No automatic record sharing                                              │
│  • No real-time updates to you or Dr. Chen                                  │
│  • No online booking                                                        │
│  • You become the messenger between doctors                                 │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Patient Dashboard Database Schema

```sql
-- =====================================================
-- PATIENT NOTIFICATIONS / UPDATES
-- =====================================================

CREATE TABLE patient_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id),
    
    -- Source
    source_type VARCHAR(30) NOT NULL,
    -- 'scribemd_visit', 'referral', 'lab_result', 'pa_status', 
    -- 'rx_status', 'appointment', 'care_coordination', 'message'
    
    source_id UUID, -- Reference to the source record
    source_provider_id UUID REFERENCES providers(id),
    
    -- Notification content
    title VARCHAR(200) NOT NULL,
    summary TEXT NOT NULL,
    details JSONB, -- Full structured data
    
    -- Patient-friendly content
    patient_friendly_title VARCHAR(200),
    patient_friendly_summary TEXT,
    
    -- Actions available
    actions JSONB DEFAULT '[]',
    -- [{ "label": "Book Appointment", "type": "book", "data": {...} }, ...]
    
    -- Priority/Type
    priority VARCHAR(20) DEFAULT 'normal', -- 'urgent', 'high', 'normal', 'low'
    notification_type VARCHAR(30), -- 'info', 'action_required', 'result', 'update'
    
    -- Status
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMPTZ,
    is_dismissed BOOLEAN DEFAULT false,
    dismissed_at TIMESTAMPTZ,
    
    -- Delivery
    delivered_via JSONB DEFAULT '{}',
    -- { "push": "2026-01-29T10:30:00Z", "email": "2026-01-29T10:31:00Z" }
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_patient_notif_patient ON patient_notifications(patient_id);
CREATE INDEX idx_patient_notif_unread ON patient_notifications(patient_id, is_read) 
    WHERE is_read = false;


-- =====================================================
-- PATIENT VISIT VIEW (What patient sees from ScribeMD)
-- =====================================================

CREATE TABLE patient_visit_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id),
    visit_id UUID NOT NULL REFERENCES scribemd_visits(id),
    
    -- Item type
    item_type VARCHAR(30) NOT NULL,
    -- 'medication', 'test', 'referral', 'follow_up', 'instruction', 'diagnosis_explained'
    
    -- Patient-friendly content
    title VARCHAR(200) NOT NULL,
    description TEXT,
    why_explanation TEXT, -- "Why am I taking this?"
    
    -- Status tracking (patient-visible)
    status VARCHAR(30) NOT NULL,
    -- 'pending', 'processing', 'sent', 'ready', 'approved', 'denied', 'completed'
    status_message TEXT, -- "Being sent to CVS..."
    
    -- Links to actual records
    linked_record_type VARCHAR(50),
    linked_record_id UUID,
    
    -- Actions
    available_actions JSONB DEFAULT '[]',
    
    -- Display
    display_order INTEGER DEFAULT 0,
    is_visible BOOLEAN DEFAULT true,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Care Coordination Network (HIPAA-Compliant)

### Overview

4doctors enables seamless, **HIPAA-compliant** bi-directional information sharing between providers. When Dr. Chen refers a patient to Dr. Smith:

1. Dr. Smith receives the complete patient package instantly
2. Dr. Chen receives real-time updates on what Dr. Smith finds and does
3. Patient sees updates from both doctors in their app
4. All sharing is authorized, audited, and revocable

### HIPAA Compliance Framework

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     HIPAA COMPLIANCE LAYERS                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  LAYER 1: TREATMENT EXCEPTION (45 CFR § 164.506)                            │
│  ───────────────────────────────────────────────                            │
│  HIPAA permits sharing PHI for treatment without authorization.             │
│  Referrals and care coordination qualify as "treatment."                    │
│                                                                             │
│  LAYER 2: MINIMUM NECESSARY RULE (45 CFR § 164.502(b))                      │
│  ───────────────────────────────────────────────                            │
│  Share only information necessary for the purpose.                          │
│  System auto-selects relevant records based on referral reason.             │
│                                                                             │
│  LAYER 3: PATIENT CONSENT (4doctors Best Practice)                          │
│  ───────────────────────────────────────────────                            │
│  Even though not required for treatment, we obtain consent because:         │
│  • Builds patient trust and engagement                                      │
│  • Covers state laws stricter than HIPAA                                    │
│  • Handles sensitive data categories properly                               │
│  • Gives patients control over their information                            │
│                                                                             │
│  LAYER 4: SENSITIVE DATA PROTECTIONS                                        │
│  ───────────────────────────────────────────────                            │
│  Stricter rules for special categories:                                     │
│  • Substance abuse (42 CFR Part 2) - Written consent REQUIRED               │
│  • Mental health - State-dependent, often requires consent                  │
│  • HIV/AIDS - State-dependent, often requires consent                       │
│  • Reproductive health - State-dependent                                    │
│  • Genetic information (GINA) - Special protections                         │
│                                                                             │
│  LAYER 5: AUDIT & ACCOUNTABILITY                                            │
│  ───────────────────────────────────────────────                            │
│  • Every access logged with who, what, when, why                            │
│  • Patient can view complete access history                                 │
│  • Breach notification procedures in place                                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Patient Consent Model

#### Initial Network Consent (One-Time at Onboarding)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│              AUTHORIZATION FOR HEALTH INFORMATION EXCHANGE                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  I, _________________________, authorize healthcare providers               │
│  participating in the 4doctors.ai network to share my health               │
│  information with each other for purposes of my medical treatment          │
│  and care coordination.                                                     │
│                                                                             │
│  INFORMATION THAT MAY BE SHARED:                                            │
│  ════════════════════════════════                                           │
│  ☑️ Medical history, diagnoses, and problem list                            │
│  ☑️ Medications, dosages, and pharmacy information                          │
│  ☑️ Allergies and adverse reactions                                         │
│  ☑️ Laboratory and diagnostic test results                                  │
│  ☑️ Imaging reports and studies                                             │
│  ☑️ Clinical notes and visit summaries                                      │
│  ☑️ Treatment plans and care instructions                                   │
│  ☑️ Insurance and coverage information                                      │
│  ☑️ Immunization records                                                    │
│  ☑️ Vital signs and measurements                                            │
│                                                                             │
│  SENSITIVE INFORMATION (Requires Separate Consent):                         │
│  ══════════════════════════════════════════════════                         │
│  The following categories require your EXPLICIT consent each time:          │
│  ☐ Mental health and psychotherapy records                                  │
│  ☐ Substance abuse treatment records (protected under 42 CFR Part 2)        │
│  ☐ HIV/AIDS testing and treatment records                                   │
│  ☐ Reproductive and sexual health records                                   │
│  ☐ Genetic testing and information                                          │
│                                                                             │
│  BI-DIRECTIONAL SHARING:                                                    │
│  ═══════════════════════                                                    │
│  ☑️ I authorize receiving providers (specialists) to share                  │
│     information BACK to my referring providers (e.g., my PCP)               │
│  ☑️ I want to receive updates about my care from all my providers           │
│                                                                             │
│  MY RIGHTS:                                                                 │
│  ══════════                                                                 │
│  • REVOKE: I can withdraw this authorization at any time                    │
│  • RESTRICT: I can limit sharing with specific providers                    │
│  • ACCESS: I can see who has viewed my information and when                 │
│  • COPY: I can request a copy of all information shared                     │
│  • AMEND: I can request corrections to my information                       │
│                                                                             │
│  Revocation will not affect information already shared.                     │
│                                                                             │
│  DURATION:                                                                  │
│  ══════════                                                                 │
│  This authorization remains in effect:                                      │
│  ◉ Until I revoke it                                                        │
│  ○ Until this date: __________                                              │
│                                                                             │
│  SIGNATURE:                                                                 │
│  ══════════                                                                 │
│  I have read and understand this authorization form.                        │
│                                                                             │
│  Electronic Signature: [Robert Garcia]                                      │
│  Date: [01/15/2026]                                                         │
│  IP Address: [Recorded for verification]                                    │
│                                                                             │
│  ☑️ I agree to the above terms                                              │
│                                                                             │
│                         [Sign Authorization]                                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Per-Referral Confirmation (With Sensitive Data Options)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                REFERRAL INFORMATION SHARING CONFIRMATION                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Dr. Chen is referring you to:                                              │
│  Dr. Sarah Smith, Cardiology                                                │
│  Heart & Vascular Institute                                                 │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  INFORMATION TO BE SHARED WITH DR. SMITH:                                   │
│                                                                             │
│  ☑️ Referral reason and clinical question                                   │
│  ☑️ Relevant medical history                                                │
│  ☑️ Current medications and allergies                                       │
│  ☑️ Recent lab results (cardiac panel, lipids, CBC)                         │
│  ☑️ Today's visit note and EKG                                              │
│  ☑️ Insurance information (Aetna PPO verified)                              │
│                                                                             │
│  [View Detailed List of Records]                                            │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  ⚠️  SENSITIVE RECORDS DETECTED:                                            │
│                                                                             │
│  Your record contains information that requires explicit consent:           │
│                                                                             │
│  ☐ Mental Health Records                                                    │
│    You have records from behavioral health visits (anxiety treatment).      │
│    These may be relevant to cardiac symptoms.                               │
│    [ ] Include   [ ] Exclude                                                │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  ☑️ AUTHORIZE DR. SMITH TO SHARE BACK TO DR. CHEN:                          │
│     Dr. Chen will receive updates about:                                    │
│     • Visit notes and findings                                              │
│     • Test results and interpretations                                      │
│     • New diagnoses and medications                                         │
│     • Recommendations for your ongoing care                                 │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│                [Approve & Send Referral]    [Cancel]                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 42 CFR Part 2 Compliance (Substance Abuse Records)

Substance abuse treatment records have the STRICTEST federal protections:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│         42 CFR PART 2 - SUBSTANCE ABUSE RECORDS CONSENT                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ⚠️ SPECIAL AUTHORIZATION REQUIRED                                          │
│                                                                             │
│  Your record contains substance abuse treatment information,                │
│  which is protected by federal law (42 CFR Part 2).                         │
│                                                                             │
│  This information CANNOT be shared without your written consent,            │
│  even for treatment purposes.                                               │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  I, _________________________, authorize:                                   │
│                                                                             │
│  FROM: Dr. Michael Chen / Internal Medicine Associates                      │
│  TO:   Dr. Sarah Smith / Heart & Vascular Institute                         │
│                                                                             │
│  To disclose the following substance abuse treatment information:           │
│  ☐ Diagnosis and treatment history                                          │
│  ☐ Medications (e.g., Suboxone, naltrexone)                                 │
│  ☐ Treatment progress notes                                                 │
│  ☐ Lab results related to treatment                                         │
│                                                                             │
│  PURPOSE: To coordinate medical care for cardiac evaluation                 │
│                                                                             │
│  DURATION: This consent expires on: __________ or upon revocation           │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  ⚠️ PROHIBITION ON RE-DISCLOSURE                                            │
│                                                                             │
│  This information has been disclosed from records protected by              │
│  federal confidentiality rules (42 CFR Part 2). Federal regulations         │
│  prohibit the recipient from making any further disclosure of               │
│  substance abuse treatment information unless further disclosure            │
│  is expressly permitted by the written consent of the individual            │
│  whose information is being disclosed or as otherwise permitted             │
│  by 42 CFR Part 2.                                                          │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  Signature: _________________________  Date: _______________                │
│                                                                             │
│                    [Sign & Authorize]    [Decline to Share]                 │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Patient Control Dashboard

Patients can manage their sharing preferences anytime:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  👤 Robert Garcia │ Privacy & Sharing Settings                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  NETWORK SHARING STATUS: ✅ ACTIVE                                          │
│                                                                             │
│  Your providers can share information for your care.                        │
│  [Revoke All Sharing]                                                       │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  👥 MY CARE TEAM (providers who can access my records):                     │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Dr. Michael Chen │ PCP │ Internal Medicine        │ ✅ Full Access  │   │
│  │ Last accessed: Today at 9:45 AM                   │ [Manage]       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Dr. Sarah Smith │ Cardiology │ Heart & Vascular    │ ✅ Full Access │   │
│  │ Last accessed: Feb 5, 2026 at 2:30 PM             │ [Manage]       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Dr. James Wilson │ Psychiatry │ Behavioral Health  │ ⚠️ Restricted  │   │
│  │ Sharing: Mental health records only               │ [Manage]       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  📋 ACCESS HISTORY (who viewed your records):                               │
│                                                                             │
│  │ Date       │ Who              │ What Accessed          │ Purpose       │
│  ├────────────┼──────────────────┼────────────────────────┼───────────────│
│  │ Today 9:45 │ Dr. Chen         │ Visit note, labs       │ Office visit  │
│  │ Feb 5 2:30 │ Dr. Smith        │ Full referral package  │ Cardio consult│
│  │ Feb 5 2:35 │ Dr. Smith        │ EKG, lipid panel       │ Cardio consult│
│  │ Feb 7 8:00 │ Dr. Smith        │ Stress echo results    │ Result review │
│  │ Feb 7 8:05 │ Dr. Chen         │ Stress echo results    │ Care coord.   │
│  │ Jan 29 ... │ ...              │ ...                    │ ...           │
│                                                                             │
│  [View Complete History]  [Download Access Report]                          │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  🔒 SENSITIVE RECORD SETTINGS:                                              │
│                                                                             │
│  Mental Health Records:        [Currently: Restricted - Ask Each Time]      │
│  Substance Abuse Records:      [Currently: Never Share Without Consent]     │
│  HIV/AIDS Records:             [Currently: Share with Care Team]            │
│  Reproductive Health:          [Currently: Share with Care Team]            │
│                                                                             │
│  [Manage Sensitive Records]                                                 │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Care Coordination Event Flow

When things happen, all authorized parties are notified:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CARE COORDINATION EVENT FLOW                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  EVENT: Dr. Smith completes cardiology visit (Feb 5)                        │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ SYSTEM CHECKS:                                                      │   │
│  │                                                                     │   │
│  │ ✅ Patient consented to bi-directional sharing                      │   │
│  │ ✅ Dr. Chen is authorized to receive updates                        │   │
│  │ ✅ No sensitive data requiring additional consent                   │   │
│  │ ✅ Minimum necessary: sending visit summary, not full note          │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│                              ↓ DISTRIBUTE ↓                                 │
│                                                                             │
│  ┌────────────────────┐ ┌────────────────────┐ ┌────────────────────┐      │
│  │ 🩺 DR. CHEN (PCP)  │ │ 👤 PATIENT         │ │ 📋 AUDIT LOG       │      │
│  │                    │ │                    │ │                    │      │
│  │ Receives:          │ │ Receives:          │ │ Records:           │      │
│  │ • Visit summary    │ │ • Visit summary    │ │ • Event ID         │      │
│  │ • New diagnosis    │ │   (plain language) │ │ • Source provider  │      │
│  │ • New medications  │ │ • New medications  │ │ • Recipients       │      │
│  │ • Recommendations  │ │ • Next steps       │ │ • Data shared      │      │
│  │ • Follow-up plan   │ │ • Appointments     │ │ • Consent ref      │      │
│  │                    │ │                    │ │ • Timestamp        │      │
│  │ [View Details]     │ │ [View in App]      │ │ [Immutable]        │      │
│  └────────────────────┘ └────────────────────┘ └────────────────────┘      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Database Schema - HIPAA Compliance

```sql
-- =====================================================
-- PATIENT CONSENTS (HIPAA-compliant authorization)
-- =====================================================

CREATE TABLE patient_consents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id),
    
    -- Consent type
    consent_type VARCHAR(30) NOT NULL,
    -- 'network_sharing' - General 4doctors network consent
    -- 'referral_specific' - Per-referral consent
    -- 'sensitive_42cfr' - 42 CFR Part 2 (substance abuse)
    -- 'sensitive_mental_health' - Mental health records
    -- 'sensitive_hiv' - HIV/AIDS records
    -- 'sensitive_reproductive' - Reproductive health
    -- 'sensitive_genetic' - Genetic information
    
    -- Scope
    consent_scope VARCHAR(20) DEFAULT 'network',
    -- 'network' - All 4doctors providers
    -- 'care_team' - Only assigned care team
    -- 'specific' - Specific providers only
    
    specific_providers UUID[], -- If scope is 'specific'
    
    -- What's consented
    share_history BOOLEAN DEFAULT true,
    share_medications BOOLEAN DEFAULT true,
    share_allergies BOOLEAN DEFAULT true,
    share_labs BOOLEAN DEFAULT true,
    share_imaging BOOLEAN DEFAULT true,
    share_notes BOOLEAN DEFAULT true,
    share_insurance BOOLEAN DEFAULT true,
    share_immunizations BOOLEAN DEFAULT true,
    
    -- Bi-directional
    allow_bidirectional BOOLEAN DEFAULT true, -- Specialists can share back
    receive_updates BOOLEAN DEFAULT true, -- Patient gets notifications
    
    -- Validity
    is_active BOOLEAN DEFAULT true,
    effective_date TIMESTAMPTZ DEFAULT NOW(),
    expiration_date TIMESTAMPTZ, -- NULL = no expiration
    revoked_at TIMESTAMPTZ,
    revoked_reason TEXT,
    
    -- For referral-specific consents
    referral_id UUID REFERENCES referrals(id),
    
    -- Signature capture
    signature_method VARCHAR(20) NOT NULL, -- 'electronic', 'paper', 'verbal'
    signature_data TEXT, -- Electronic signature
    signature_ip_address INET,
    signature_user_agent TEXT,
    signature_timestamp TIMESTAMPTZ DEFAULT NOW(),
    
    -- Witness (for paper/verbal)
    witness_name VARCHAR(200),
    witness_signature TEXT,
    
    -- Audit
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Ensure one active consent per type per patient
    UNIQUE (patient_id, consent_type, referral_id) 
        WHERE is_active = true AND revoked_at IS NULL
);

CREATE INDEX idx_consents_patient ON patient_consents(patient_id);
CREATE INDEX idx_consents_active ON patient_consents(patient_id, is_active) 
    WHERE is_active = true;


-- =====================================================
-- REFERRALS WITH ROI
-- =====================================================

CREATE TABLE referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Parties
    referring_provider_id UUID NOT NULL REFERENCES providers(id),
    referring_org_id UUID NOT NULL REFERENCES organizations(id),
    receiving_provider_id UUID REFERENCES providers(id),
    receiving_org_id UUID REFERENCES organizations(id),
    patient_id UUID NOT NULL REFERENCES patients(id),
    
    -- Referral details
    specialty VARCHAR(100) NOT NULL,
    reason TEXT NOT NULL,
    clinical_question TEXT,
    urgency VARCHAR(20) DEFAULT 'routine',
    
    -- Status tracking
    status VARCHAR(30) DEFAULT 'pending_consent',
    -- 'pending_consent', 'sent', 'received', 'scheduled', 
    -- 'in_progress', 'completed', 'cancelled'
    
    -- Consent linkage
    consent_id UUID REFERENCES patient_consents(id),
    consent_obtained_at TIMESTAMPTZ,
    
    -- What was shared (audit trail)
    shared_record_types TEXT[], -- ['history', 'medications', 'labs', ...]
    shared_record_ids UUID[], -- Specific record IDs shared
    shared_data_hash VARCHAR(64), -- SHA-256 of shared package for integrity
    
    -- Sensitive data handling
    includes_sensitive_data BOOLEAN DEFAULT false,
    sensitive_data_types TEXT[], -- ['mental_health', 'substance_abuse', ...]
    sensitive_consent_ids UUID[], -- Separate consents for sensitive data
    
    -- Bi-directional authorization
    bidirectional_authorized BOOLEAN DEFAULT true,
    bidirectional_consent_id UUID REFERENCES patient_consents(id),
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    sent_at TIMESTAMPTZ,
    received_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- =====================================================
-- CARE COORDINATION EVENTS (with consent verification)
-- =====================================================

CREATE TABLE care_coordination_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Context
    patient_id UUID NOT NULL REFERENCES patients(id),
    referral_id UUID REFERENCES referrals(id),
    
    -- Source
    source_provider_id UUID NOT NULL REFERENCES providers(id),
    source_org_id UUID NOT NULL REFERENCES organizations(id),
    source_visit_id UUID, -- If from a ScribeMD visit
    
    -- Event details
    event_type VARCHAR(50) NOT NULL,
    event_data JSONB NOT NULL,
    
    -- What's being shared
    shared_data_summary TEXT, -- Human-readable summary
    shared_record_types TEXT[],
    shared_record_ids UUID[],
    
    -- Consent verification (CRITICAL FOR HIPAA)
    consent_verified BOOLEAN NOT NULL DEFAULT false,
    consent_id UUID REFERENCES patient_consents(id),
    consent_verification_timestamp TIMESTAMPTZ,
    
    -- Recipients
    recipient_providers UUID[] NOT NULL,
    notify_patient BOOLEAN DEFAULT true,
    
    -- Delivery tracking
    delivered_to_providers JSONB DEFAULT '{}', 
    -- {"provider_id": {"delivered_at": "...", "viewed_at": "..."}}
    delivered_to_patient_at TIMESTAMPTZ,
    patient_viewed_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_care_events_patient ON care_coordination_events(patient_id);
CREATE INDEX idx_care_events_consent ON care_coordination_events(consent_id);


-- =====================================================
-- PHI ACCESS LOG (HIPAA Audit Requirement)
-- =====================================================

CREATE TABLE phi_access_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Who accessed
    user_id UUID NOT NULL REFERENCES users(id),
    provider_id UUID REFERENCES providers(id),
    organization_id UUID REFERENCES organizations(id),
    
    -- Session info
    session_id VARCHAR(100),
    ip_address INET,
    user_agent TEXT,
    
    -- What was accessed
    patient_id UUID NOT NULL REFERENCES patients(id),
    record_type VARCHAR(50) NOT NULL, -- 'note', 'lab', 'medication', 'referral', etc.
    record_id UUID,
    
    -- Access details
    access_type VARCHAR(20) NOT NULL, -- 'view', 'create', 'update', 'delete', 'export', 'share'
    access_purpose VARCHAR(50), -- 'treatment', 'payment', 'operations', 'referral', 'patient_request'
    
    -- Consent reference
    consent_id UUID REFERENCES patient_consents(id),
    
    -- Data accessed (for granular audit)
    fields_accessed TEXT[], -- Which specific fields were viewed
    
    -- Flags
    is_emergency_access BOOLEAN DEFAULT false, -- "Break the glass"
    emergency_reason TEXT,
    
    -- Timestamp (immutable)
    accessed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    -- This table is APPEND-ONLY - no updates or deletes allowed
    -- Enforced by application and database triggers
);

CREATE INDEX idx_phi_access_patient ON phi_access_log(patient_id);
CREATE INDEX idx_phi_access_user ON phi_access_log(user_id);
CREATE INDEX idx_phi_access_time ON phi_access_log(accessed_at);

-- Prevent modifications to audit log
CREATE OR REPLACE FUNCTION prevent_phi_log_modification()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'PHI access log records cannot be modified or deleted';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER phi_log_immutable
    BEFORE UPDATE OR DELETE ON phi_access_log
    FOR EACH ROW EXECUTE FUNCTION prevent_phi_log_modification();


-- =====================================================
-- CONSENT AUDIT TRAIL
-- =====================================================

CREATE TABLE consent_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    consent_id UUID NOT NULL REFERENCES patient_consents(id),
    patient_id UUID NOT NULL REFERENCES patients(id),
    
    action VARCHAR(30) NOT NULL, -- 'created', 'activated', 'modified', 'revoked', 'expired'
    action_by UUID REFERENCES users(id), -- NULL if system action
    
    previous_state JSONB, -- State before change
    new_state JSONB, -- State after change
    
    reason TEXT,
    
    ip_address INET,
    user_agent TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### API Endpoints - Consent Management

```typescript
// =====================================================
// PATIENT CONSENT MANAGEMENT
// =====================================================

// Get patient's consent status
GET /api/v1/patients/:patient_id/consents
Response: {
  network_consent: { ... },
  sensitive_consents: [...],
  active_referral_consents: [...],
  can_share_with_network: true
}

// Create/update network consent
POST /api/v1/patients/:patient_id/consents/network
{
  share_history: true,
  share_medications: true,
  share_labs: true,
  // ...
  allow_bidirectional: true,
  signature_data: "base64...",
  signature_method: "electronic"
}

// Create sensitive data consent
POST /api/v1/patients/:patient_id/consents/sensitive
{
  consent_type: "sensitive_42cfr",
  specific_providers: ["uuid1", "uuid2"],
  expiration_date: "2027-01-01",
  signature_data: "base64..."
}

// Revoke consent
POST /api/v1/patients/:patient_id/consents/:consent_id/revoke
{
  reason: "Patient request"
}

// Get access history (patient-facing)
GET /api/v1/patients/:patient_id/access-history
Response: {
  accesses: [
    { date, provider, what_accessed, purpose },
    ...
  ]
}


// =====================================================
// REFERRAL WITH CONSENT FLOW
// =====================================================

// Check if consent exists for referral
GET /api/v1/referrals/check-consent
{
  patient_id: "uuid",
  receiving_provider_id: "uuid",
  include_sensitive: false
}
Response: {
  has_network_consent: true,
  has_bidirectional_consent: true,
  sensitive_data_present: true,
  sensitive_types: ["mental_health"],
  needs_additional_consent: true
}

// Create referral (validates consent)
POST /api/v1/referrals
{
  patient_id: "uuid",
  receiving_provider_id: "uuid",
  specialty: "cardiology",
  reason: "...",
  include_sensitive_types: [], // Patient must have consented
  // System auto-attaches consent_id after verification
}

// Send care coordination update (validates consent)
POST /api/v1/care-coordination/events
{
  patient_id: "uuid",
  referral_id: "uuid",
  event_type: "visit_completed",
  event_data: { ... },
  recipient_providers: ["uuid1", "uuid2"]
  // System verifies bi-directional consent before sending
}
```

### Compliance Checklist

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    4doctors HIPAA COMPLIANCE CHECKLIST                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ADMINISTRATIVE SAFEGUARDS                                                  │
│  ☑️ Privacy Officer designated                                              │
│  ☑️ Security Officer designated                                             │
│  ☑️ Workforce training on HIPAA                                             │
│  ☑️ Sanctions policy for violations                                         │
│  ☑️ Risk analysis conducted annually                                        │
│                                                                             │
│  PHYSICAL SAFEGUARDS                                                        │
│  ☑️ Data center access controls (AWS/GCP SOC 2)                             │
│  ☑️ Workstation security policies                                           │
│  ☑️ Device encryption requirements                                          │
│                                                                             │
│  TECHNICAL SAFEGUARDS                                                       │
│  ☑️ Unique user identification (UUID per user)                              │
│  ☑️ Automatic logoff (session timeout)                                      │
│  ☑️ Encryption at rest (AES-256)                                            │
│  ☑️ Encryption in transit (TLS 1.3)                                         │
│  ☑️ Audit controls (PHI access logging)                                     │
│  ☑️ Integrity controls (data hashing)                                       │
│  ☑️ Access controls (RBAC + consent verification)                           │
│                                                                             │
│  BREACH NOTIFICATION                                                        │
│  ☑️ Breach detection monitoring                                             │
│  ☑️ 60-day notification to HHS                                              │
│  ☑️ Individual notification procedures                                      │
│  ☑️ Media notification (500+ individuals)                                   │
│                                                                             │
│  BUSINESS ASSOCIATES                                                        │
│  ☑️ BAA with all vendors (AWS, Twilio, etc.)                                │
│  ☑️ BAA template for customer organizations                                 │
│  ☑️ Subcontractor BAA chain                                                 │
│                                                                             │
│  PATIENT RIGHTS                                                             │
│  ☑️ Right to access (patient portal)                                        │
│  ☑️ Right to amend (request corrections)                                    │
│  ☑️ Right to accounting of disclosures (access log)                         │
│  ☑️ Right to restrict (consent management)                                  │
│  ☑️ Right to confidential communications                                    │
│                                                                             │
│  42 CFR PART 2 (Substance Abuse)                                            │
│  ☑️ Separate consent forms                                                  │
│  ☑️ Re-disclosure prohibition notice                                        │
│  ☑️ Qualified Service Organization Agreement (QSOA)                         │
│  ☑️ Audit trail for Part 2 records                                          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Platform Architecture & EHR Independence

### Strategic Positioning

4doctors.ai is architected with **strategic flexibility**: we can operate as an AI layer on top of existing EHRs OR become the complete practice system when the market or opportunity demands it.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     4doctors.ai STRATEGIC OPTIONS                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  OPTION A: AI Layer (Current Positioning)                                   │
│  ─────────────────────────────────────────                                  │
│  "We integrate with your EHR and make it smarter"                           │
│  • Fast adoption - no rip and replace                                       │
│  • No sales objection ("we already have an EHR")                            │
│  • Attractive acquisition target for EHR vendors                            │
│  • Less regulatory burden (EHR owns certification)                          │
│                                                                             │
│  OPTION B: Complete Practice System (Small Practices)                       │
│  ─────────────────────────────────────────────────────                      │
│  "You don't need an expensive EHR. 4doctors is your complete solution."     │
│  • Capture practices with NO EHR today                                      │
│  • $299/mo vs $500-800/mo for traditional EHRs                              │
│  • AI-native from day one (competitors retrofitting)                        │
│                                                                             │
│  OPTION C: EHR Replacement (Contract Renewals)                              │
│  ─────────────────────────────────────────────                              │
│  "Your EHR contract is up? Switch to 4doctors."                             │
│  • Practices already using 4doctors as AI layer                             │
│  • Migration is simple: stop pushing to old EHR                             │
│  • One vendor, one bill, better experience                                  │
│                                                                             │
│  OPTION D: Acquisition by EHR Vendor                                        │
│  ─────────────────────────────────────                                      │
│  "Epic/athena/Oracle - you need AI. We ARE AI. Buy us."                     │
│  • Our value: AI + workflow intelligence                                    │
│  • Their gap: Legacy systems can't innovate fast enough                     │
│                                                                             │
│  THE ARCHITECTURE SUPPORTS ALL OPTIONS.                                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### The Truth About EHRs

An EHR is fundamentally just:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        WHAT AN EHR ACTUALLY IS                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   📊 DATABASE                                                               │
│   ───────────                                                               │
│   • Patients, demographics, contacts                                        │
│   • Encounters/visits                                                       │
│   • Clinical notes                                                          │
│   • Problem list, medications, allergies                                    │
│   • Orders and results                                                      │
│   • Documents                                                               │
│                                                                             │
│   🖥️ USER INTERFACE                                                         │
│   ─────────────────                                                         │
│   • Screens to view and edit the above                                      │
│                                                                             │
│   🔌 INTEGRATIONS                                                           │
│   ──────────────                                                            │
│   • Surescripts (e-prescribing)                                             │
│   • Labs (LabCorp, Quest, hospital labs)                                    │
│   • Clearinghouses (claims)                                                 │
│   • Immunization registries                                                 │
│   • Health information exchanges                                            │
│                                                                             │
│   📜 CERTIFICATIONS                                                         │
│   ────────────────                                                          │
│   • ONC Health IT Certification                                             │
│   • MIPS/Quality reporting                                                  │
│                                                                             │
│   That's it. That's an EHR. It's not magic.                                 │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### What 4doctors.ai Is Already Building

```
┌─────────────────────────────────────────────────────────────────────────────┐
│              4doctors.ai vs. EHR COMPONENT CHECKLIST                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  EHR Component              │ 4doctors Building? │ Notes                    │
│  ───────────────────────────┼────────────────────┼───────────────────────── │
│                             │                    │                          │
│  PATIENT DATA               │                    │                          │
│  Patient demographics       │ ✅ YES             │ Core platform            │
│  Patient contacts           │ ✅ YES             │ Communication needs it   │
│  Insurance information      │ ✅ YES             │ Eligibility, claims      │
│  Patient portal             │ ✅ YES             │ Patient Dashboard        │
│                             │                    │                          │
│  CLINICAL DATA              │                    │                          │
│  Encounters/visits          │ ✅ YES             │ ScribeMD sessions        │
│  Clinical notes             │ ✅ YES             │ ScribeMD generates       │
│  Problem list               │ ✅ YES             │ Diagnoses from visits    │
│  Medication list            │ ✅ YES             │ Rx tracking              │
│  Allergy list               │ ✅ YES             │ Safety checks need it    │
│  Vital signs                │ ⚠️ PARTIAL         │ Captured in notes        │
│  Immunizations              │ ☐ NOT YET          │ Add when needed          │
│  Growth charts              │ ☐ NOT YET          │ Pediatrics module        │
│                             │                    │                          │
│  ORDERS & RESULTS           │                    │                          │
│  Lab orders                 │ ✅ YES             │ ScribeMD creates         │
│  Lab results                │ ✅ YES             │ Display + route          │
│  Imaging orders             │ ✅ YES             │ ScribeMD creates         │
│  Imaging results            │ ✅ YES             │ Display + route          │
│  Referrals                  │ ✅ YES             │ Care coordination        │
│                             │                    │                          │
│  PRESCRIBING                │                    │                          │
│  E-Prescribing              │ ✅ YES             │ Surescripts integration  │
│  EPCS (Controlled)          │ ✅ YES             │ DEA-compliant            │
│  Formulary checking         │ ✅ YES             │ Surescripts              │
│  Drug interactions          │ ✅ YES             │ Safety alerts            │
│  PDMP integration           │ ⚠️ PLANNED         │ State registries         │
│                             │                    │                          │
│  BILLING                    │                    │                          │
│  Charge capture             │ ✅ YES             │ ScribeMD codes           │
│  Claim generation           │ ✅ YES             │ RevenueRx                │
│  Claim submission           │ ✅ YES             │ Clearinghouse            │
│  ERA/Payment posting        │ ✅ YES             │ RevenueRx                │
│  Prior authorization        │ ✅ YES             │ PA Engine                │
│                             │                    │                          │
│  COMMUNICATION              │                    │                          │
│  Provider messaging         │ ✅ YES             │ Care coordination        │
│  Patient messaging          │ ✅ YES             │ Patient Dashboard        │
│  Appointment reminders      │ ✅ YES             │ 4CALLS integration       │
│                             │                    │                          │
│  COMPLIANCE                 │                    │                          │
│  Audit trail                │ ✅ YES             │ HIPAA requirement        │
│  Document storage           │ ✅ YES             │ Consents, records        │
│  HIPAA compliance           │ ✅ YES             │ Built-in                 │
│  ONC Certification          │ ☐ WHEN READY       │ $50-200K, 6-12 months    │
│  MIPS Reporting             │ ☐ WHEN READY       │ Quality measures         │
│                             │                    │                          │
│  ───────────────────────────┴────────────────────┴───────────────────────── │
│                                                                             │
│  VERDICT: You're building ~90% of an EHR. You're just not calling it that.  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Data Architecture: Flexibility Built In

The key architectural decision: **Data can flow TO external EHRs OR stay in 4doctors.**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLEXIBLE DATA ARCHITECTURE                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  MODE 1: AI Layer (Push to External EHR)                                    │
│  ───────────────────────────────────────                                    │
│                                                                             │
│  ┌─────────────┐      ┌─────────────┐      ┌─────────────┐                  │
│  │   ScribeMD  │      │  4doctors   │      │ External    │                  │
│  │   Creates:  │ ───► │  Validates  │ ───► │ EHR         │                  │
│  │   • Note    │      │  Routes     │ FHIR │ (athena,    │                  │
│  │   • Codes   │      │             │ Push │  eCW, Epic) │                  │
│  │   • Orders  │      │             │      │             │                  │
│  └─────────────┘      └─────────────┘      └─────────────┘                  │
│                              │                    │                          │
│                              │                    ▼                          │
│                              │              EHR is System                    │
│                              │              of Record                        │
│                              ▼                                               │
│                        4doctors keeps:                                       │
│                        • Session reference                                   │
│                        • Workflow state                                      │
│                        • Audit trail                                         │
│                        • Coordination data                                   │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  MODE 2: Complete System (4doctors IS the EHR)                              │
│  ─────────────────────────────────────────────                              │
│                                                                             │
│  ┌─────────────┐      ┌─────────────────────────────────────┐               │
│  │   ScribeMD  │      │            4doctors                 │               │
│  │   Creates:  │ ───► │                                     │               │
│  │   • Note    │      │   ┌─────────────────────────────┐   │               │
│  │   • Codes   │      │   │    4doctors Database        │   │               │
│  │   • Orders  │      │   │    (System of Record)       │   │               │
│  └─────────────┘      │   │                             │   │               │
│                       │   │  • Patients                 │   │               │
│                       │   │  • Encounters               │   │               │
│                       │   │  • Notes                    │   │               │
│                       │   │  • Problems                 │   │               │
│                       │   │  • Medications              │   │               │
│                       │   │  • Orders & Results         │   │               │
│                       │   └─────────────────────────────┘   │               │
│                       │                                     │               │
│                       └─────────────────────────────────────┘               │
│                              │                                              │
│                              ▼                                              │
│                        Direct integrations:                                 │
│                        • Surescripts (Rx)                                   │
│                        • Labs (orders/results)                              │
│                        • Clearinghouse (claims)                             │
│                        • Patient portal                                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Database Schema: EHR-Ready

The schema supports both modes with a simple configuration flag:

```sql
-- =====================================================
-- ORGANIZATION CONFIGURATION
-- =====================================================

CREATE TABLE organization_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    
    -- EHR MODE CONFIGURATION
    ehr_mode VARCHAR(20) NOT NULL DEFAULT 'integrated',
    -- 'integrated' = Push to external EHR (AI Layer mode)
    -- 'standalone' = 4doctors is the EHR (Complete System mode)
    
    -- External EHR Configuration (when mode = 'integrated')
    external_ehr_type VARCHAR(50), -- 'athena', 'ecw', 'epic', 'drchrono', etc.
    external_ehr_credentials JSONB, -- Encrypted API credentials
    external_ehr_facility_id VARCHAR(100),
    
    -- Data Retention (when mode = 'standalone')
    retain_clinical_data BOOLEAN DEFAULT true,
    retain_notes_days INTEGER DEFAULT 2555, -- 7 years (legal requirement)
    retain_audit_days INTEGER DEFAULT 2555,
    
    -- Feature Flags
    push_notes_to_ehr BOOLEAN DEFAULT true,
    push_orders_to_ehr BOOLEAN DEFAULT true,
    pull_patient_data_from_ehr BOOLEAN DEFAULT true,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- =====================================================
-- CLINICAL DATA TABLES (Support both modes)
-- =====================================================

-- PATIENTS (We own this in both modes)
CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    
    -- Demographics
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    sex VARCHAR(10),
    gender_identity VARCHAR(50),
    
    -- Contact
    email VARCHAR(200),
    phone VARCHAR(20),
    address JSONB,
    
    -- External EHR Reference (Mode: integrated)
    external_ehr_patient_id VARCHAR(100),
    external_ehr_mrn VARCHAR(50),
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- ENCOUNTERS (ScribeMD visits become encounters)
CREATE TABLE encounters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    patient_id UUID NOT NULL REFERENCES patients(id),
    provider_id UUID NOT NULL REFERENCES providers(id),
    
    -- Encounter details
    encounter_date DATE NOT NULL,
    encounter_type VARCHAR(50), -- 'office_visit', 'telehealth', 'procedure'
    status VARCHAR(20) DEFAULT 'in_progress',
    
    -- ScribeMD Reference
    scribemd_visit_id UUID REFERENCES scribemd_visits(id),
    
    -- External EHR Reference (Mode: integrated)
    external_ehr_encounter_id VARCHAR(100),
    pushed_to_ehr_at TIMESTAMPTZ,
    
    -- When standalone, this IS the encounter record
    -- When integrated, this is a reference + cache
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- CLINICAL NOTES
CREATE TABLE clinical_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    encounter_id UUID NOT NULL REFERENCES encounters(id),
    patient_id UUID NOT NULL REFERENCES patients(id),
    provider_id UUID NOT NULL REFERENCES providers(id),
    
    -- Note content
    note_type VARCHAR(30) DEFAULT 'progress_note',
    note_text TEXT NOT NULL,
    note_html TEXT,
    
    -- Structured sections (SOAP)
    sections JSONB,
    
    -- Signature
    is_signed BOOLEAN DEFAULT false,
    signed_at TIMESTAMPTZ,
    signed_by UUID REFERENCES providers(id),
    
    -- External EHR (Mode: integrated)
    external_ehr_note_id VARCHAR(100),
    pushed_to_ehr_at TIMESTAMPTZ,
    
    -- In 'standalone' mode: This IS the legal medical record
    -- In 'integrated' mode: This is pushed to EHR, we keep reference
    
    -- Data retention flag
    is_archived BOOLEAN DEFAULT false,
    archive_after DATE, -- When standalone, retain per legal requirements
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- PROBLEM LIST
CREATE TABLE problems (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id),
    
    -- Problem details
    icd10_code VARCHAR(10) NOT NULL,
    description TEXT NOT NULL,
    onset_date DATE,
    
    -- Status
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'resolved', 'inactive'
    resolved_date DATE,
    
    -- Source
    source_encounter_id UUID REFERENCES encounters(id),
    added_by UUID REFERENCES providers(id),
    
    -- External EHR
    external_ehr_problem_id VARCHAR(100),
    synced_from_ehr BOOLEAN DEFAULT false,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- MEDICATIONS
CREATE TABLE medications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id),
    
    -- Medication details
    drug_name VARCHAR(200) NOT NULL,
    strength VARCHAR(50),
    form VARCHAR(50),
    sig TEXT,
    quantity INTEGER,
    refills INTEGER,
    days_supply INTEGER,
    
    -- Prescriber
    prescribed_by UUID REFERENCES providers(id),
    prescribed_date DATE,
    
    -- Status
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'discontinued', 'completed'
    discontinued_date DATE,
    discontinued_reason TEXT,
    
    -- Prescription reference
    prescription_id UUID REFERENCES prescriptions(id),
    
    -- External EHR
    external_ehr_medication_id VARCHAR(100),
    synced_from_ehr BOOLEAN DEFAULT false,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- ALLERGIES
CREATE TABLE allergies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id),
    
    -- Allergy details
    allergen VARCHAR(200) NOT NULL,
    allergen_type VARCHAR(50), -- 'drug', 'food', 'environmental'
    reaction TEXT,
    severity VARCHAR(20), -- 'mild', 'moderate', 'severe'
    
    -- Status
    status VARCHAR(20) DEFAULT 'active',
    
    -- Source
    reported_date DATE,
    reported_by UUID REFERENCES users(id),
    
    -- External EHR
    external_ehr_allergy_id VARCHAR(100),
    synced_from_ehr BOOLEAN DEFAULT false,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- ORDERS (Labs, Imaging, Referrals)
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    encounter_id UUID REFERENCES encounters(id),
    patient_id UUID NOT NULL REFERENCES patients(id),
    ordering_provider_id UUID NOT NULL REFERENCES providers(id),
    
    -- Order type
    order_type VARCHAR(30) NOT NULL, -- 'lab', 'imaging', 'referral', 'procedure'
    
    -- Order details
    order_code VARCHAR(20),
    order_name VARCHAR(200) NOT NULL,
    order_details JSONB,
    diagnosis_codes TEXT[],
    
    -- Status
    status VARCHAR(30) DEFAULT 'ordered',
    -- 'draft', 'ordered', 'sent', 'in_progress', 'resulted', 'cancelled'
    
    -- Destination
    destination_type VARCHAR(50), -- 'lab', 'imaging_center', 'specialist'
    destination_id UUID,
    destination_name VARCHAR(200),
    
    -- External EHR
    external_ehr_order_id VARCHAR(100),
    pushed_to_ehr_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- RESULTS
CREATE TABLE results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id),
    patient_id UUID NOT NULL REFERENCES patients(id),
    
    -- Result type
    result_type VARCHAR(30) NOT NULL, -- 'lab', 'imaging', 'pathology'
    
    -- Result data
    result_date TIMESTAMPTZ,
    result_data JSONB NOT NULL,
    result_text TEXT,
    result_document_path VARCHAR(500),
    
    -- Interpretation
    abnormal_flags TEXT[],
    reviewed_by UUID REFERENCES providers(id),
    reviewed_at TIMESTAMPTZ,
    
    -- External source
    source_system VARCHAR(100), -- 'quest', 'labcorp', 'hospital_lab'
    external_result_id VARCHAR(100),
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### The "Flip the Switch" Migration

When a practice wants to move from "AI Layer" to "4doctors as EHR":

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    MIGRATION: AI Layer → Complete System                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  STEP 1: Data Migration (One-Time)                                          │
│  ─────────────────────────────────                                          │
│                                                                             │
│  From Old EHR, import:                                                      │
│  • Patient demographics ─────────────────► patients table                   │
│  • Historical encounters ─────────────────► encounters table                │
│  • Historical notes ─────────────────────► clinical_notes table             │
│  • Problem list ─────────────────────────► problems table                   │
│  • Medication history ───────────────────► medications table                │
│  • Allergies ────────────────────────────► allergies table                  │
│  • Documents ────────────────────────────► documents table                  │
│                                                                             │
│  Methods:                                                                   │
│  • FHIR Bulk Export (if supported)                                          │
│  • CCDA export/import                                                       │
│  • Direct database migration (with BAA)                                     │
│  • Manual entry (small practices)                                           │
│                                                                             │
│  STEP 2: Configuration Change                                               │
│  ────────────────────────────                                               │
│                                                                             │
│  UPDATE organization_settings                                               │
│  SET ehr_mode = 'standalone',                                               │
│      push_notes_to_ehr = false,                                             │
│      push_orders_to_ehr = false,                                            │
│      pull_patient_data_from_ehr = false,                                    │
│      retain_clinical_data = true                                            │
│  WHERE organization_id = 'xxx';                                             │
│                                                                             │
│  STEP 3: Verify Integrations                                                │
│  ───────────────────────────                                                │
│                                                                             │
│  Confirm direct connections work:                                           │
│  ✅ Surescripts (e-prescribing)                                             │
│  ✅ Labs (orders go directly to Quest/LabCorp)                              │
│  ✅ Labs (results come directly to 4doctors)                                │
│  ✅ Clearinghouse (claims from 4doctors)                                    │
│  ✅ Patient portal (4doctors native)                                        │
│                                                                             │
│  STEP 4: Done                                                               │
│  ──────────                                                                 │
│                                                                             │
│  • Doctor's experience: UNCHANGED (same ScribeMD interface)                 │
│  • Patient's experience: UNCHANGED (same Patient Dashboard)                 │
│  • Cost: One bill instead of two ($299 vs $299 + $600)                      │
│  • Old EHR: Cancel subscription                                             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Path to ONC Certification (When Ready)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    ONC CERTIFICATION ROADMAP                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  WHEN TO PURSUE:                                                            │
│  • When targeting larger practices that require it                          │
│  • When competing directly with certified EHRs                              │
│  • When MIPS reporting becomes a customer requirement                       │
│                                                                             │
│  WHAT'S REQUIRED (2015 Edition Cures Update):                               │
│  ─────────────────────────────────────────────                              │
│                                                                             │
│  CLINICAL:                                                                  │
│  ☐ CPOE for medications, labs, imaging                      ← You have     │
│  ☐ Drug-drug interaction checking                           ← You have     │
│  ☐ Demographics recording                                   ← You have     │
│  ☐ Problem list                                             ← You have     │
│  ☐ Medication list                                          ← You have     │
│  ☐ Medication allergy list                                  ← You have     │
│  ☐ Clinical decision support                                ← Partial      │
│  ☐ Implantable device list                                  ← Add          │
│  ☐ Smoking status                                           ← Add          │
│  ☐ Vital signs                                              ← Enhance      │
│                                                                             │
│  CARE COORDINATION:                                                         │
│  ☐ Transitions of care (CCDA)                               ← Add          │
│  ☐ Referral workflows                                       ← You have     │
│  ☐ Health information exchange                              ← Partial      │
│                                                                             │
│  API/INTEROPERABILITY:                                                      │
│  ☐ FHIR R4 API (Patient Access)                             ← You have     │
│  ☐ FHIR R4 API (Provider Directory)                         ← Add          │
│  ☐ Information blocking compliance                          ← Review       │
│                                                                             │
│  QUALITY:                                                                   │
│  ☐ Clinical quality measures (CQM)                          ← Add          │
│  ☐ MIPS reporting capability                                ← Add          │
│                                                                             │
│  CERTIFICATION PROCESS:                                                     │
│  ──────────────────────                                                     │
│  1. Gap analysis against criteria                      (2-4 weeks)          │
│  2. Development of missing features                    (2-4 months)         │
│  3. Internal testing against test procedures           (1-2 months)         │
│  4. Engage ONC-ACB (Drummond, SLI, ICSA)              (1 month)             │
│  5. Certification testing                              (1-2 months)         │
│  6. Certification issued                                                    │
│                                                                             │
│  ESTIMATED COST: $50,000 - $200,000                                         │
│  ESTIMATED TIME: 6-12 months                                                │
│                                                                             │
│  ROI: Access to larger practices, hospital systems, government contracts    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Market Segmentation Strategy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    MARKET APPROACH BY SEGMENT                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  SEGMENT 1: Solo/Small (1-3 providers, no EHR)                              │
│  ─────────────────────────────────────────────                              │
│  Positioning: "Complete Practice Solution"                                  │
│  Mode: Standalone (4doctors IS the EHR)                                     │
│  Price: $299/mo                                                             │
│  Pitch: "Why pay $600/mo for athena when 4doctors does it all with AI?"     │
│                                                                             │
│  SEGMENT 2: Small/Medium (3-10 providers, has EHR)                          │
│  ─────────────────────────────────────────────────                          │
│  Positioning: "AI Layer"                                                    │
│  Mode: Integrated (push to their EHR)                                       │
│  Price: $199/mo per provider                                                │
│  Pitch: "Keep your EHR. Add AI superpowers."                                │
│                                                                             │
│  Later: "Your EHR contract is up? Just switch to 4doctors standalone."      │
│                                                                             │
│  SEGMENT 3: Medium/Large (10-50 providers)                                  │
│  ─────────────────────────────────────────                                  │
│  Positioning: "AI Layer + Workflow Automation"                              │
│  Mode: Integrated (deeply embedded)                                         │
│  Price: Enterprise pricing                                                  │
│  Pitch: "Transform your practice efficiency. Your EHR can't do this."       │
│                                                                             │
│  SEGMENT 4: Health Systems (50+ providers)                                  │
│  ─────────────────────────────────────────                                  │
│  Positioning: "AI Platform"                                                 │
│  Mode: Integrated (API-first)                                               │
│  Price: Enterprise licensing                                                │
│  Pitch: "Epic/Cerner integration. AI documentation. Care coordination."     │
│                                                                             │
│  PATH: Start with Segments 1-2. Build volume. Move upmarket.                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Summary: Strategic Flexibility

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    THE BOTTOM LINE                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  TODAY'S POSITIONING:                                                       │
│  "We're the AI layer that makes your EHR smarter."                          │
│                                                                             │
│  THE TRUTH:                                                                 │
│  You're building 90% of an EHR. It's just a database.                       │
│  The AI is the hard part. You have the AI.                                  │
│                                                                             │
│  STRATEGIC OPTIONS (All Supported by Architecture):                         │
│                                                                             │
│  1. Stay "AI Layer" forever                                                 │
│     └─ Get acquired by EHR vendor who needs AI                              │
│                                                                             │
│  2. Be "Complete System" for small practices                                │
│     └─ Capture the no-EHR market at lower price point                       │
│                                                                             │
│  3. Migrate existing customers off their EHRs                               │
│     └─ They're already using 4doctors - easy switch                         │
│                                                                             │
│  4. Get ONC certified and compete directly                                  │
│     └─ When market timing is right                                          │
│                                                                             │
│  5. All of the above (different segments)                                   │
│     └─ Solo practices: Standalone                                           │
│     └─ Group practices: Integrated                                          │
│     └─ Enterprises: Platform/API                                            │
│                                                                             │
│  THE ARCHITECTURE SUPPORTS ALL OPTIONS.                                     │
│  BUILD NOW. DECIDE LATER.                                                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

*"See patient. Dashboard fills itself. Click approve. Go home."*
