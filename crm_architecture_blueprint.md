# B2B CRM Transformation Blueprint

**Role:** Senior CRM Product Architect
**Goal:** Transform the basic lead-capture board into a high-performance B2B Enterprise CRM with full attribution, activity tracking, and sales efficiency features.

---

## 1. Database Changes (Schema Upgrade)

To support complex sales operations, the database structure must evolve from a single flat table into a relational model.

### Modified Table: `bookings` (Renaming to `leads` logically in the UI)

* `company_name` (VARCHAR): For B2B lead generation.
* `email` (VARCHAR): For formal quotes.
* `industry` (VARCHAR): Linked to the Industry Module.
* `lead_source` (VARCHAR): e.g., 'Organic Search', 'Google Ads', 'Direct'.
* `lead_value` (DECIMAL): Estimated deal size in SAR.
* `owner_id` (INT): Foreign Key to `admin` table (Assigned Sales Rep).
* `next_followup_date` (TIMESTAMP): For scheduled reminders.
* `status` (VARCHAR): Updated ENUM `['new', 'qualified', 'quoted', 'negotiation', 'won', 'lost']`.

### New Table: `lead_activities` (The Timeline Engine)

* `id` (SERIAL PRIMARY KEY)
* `lead_id` (INT FOREIGN KEY to `bookings`)
* `admin_id` (INT FOREIGN KEY to `admin` - who did the action)
* `activity_type` (VARCHAR): `['call_logged', 'whatsapp_sent', 'quote_sent', 'followup_scheduled', 'note_added']`
* `description` (TEXT): The actual note or outcome.
* `created_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)

---

## 2. API Changes (Backend Restructuring)

### Enhanced Endpoints (`server/routes/bookings.ts`)

* **`GET /api/bookings` (Enhanced):**
  * Add Server-Side **Pagination**: `?page=1&limit=50`
  * Add **Search & Filters**: `?search=Almarai&status=negotiation&owner_id=2`
  * Add **Sorting**: `?sort_by=created_at&order=desc`
* **`GET /api/bookings/export`:**
  * Generates and streams a CSV file of leads matching the current filters.
* **`PUT /api/bookings/:id`:**
  * Full payload update (Company Name, Value, Owner).
* **`POST /api/bookings/:id/activities`:**
  * Creates a new timeline event (e.g., logging a call).
* **`GET /api/bookings/:id/activities`:**
  * Fetches the chronological timeline for a specific lead.

---

## 3. UI Changes (Frontend Redesign)

### A. The Master Dashboard (`BookingsManager.tsx`)

* **Filter Bar:** A sticky top bar with global search, dropdowns for Status, Owner, and Date Range, and a prominent "Export CSV" button.
* **View Modes:** Toggle between "Kanban Pipeline" and "Data Table" (since Data Tables are better for bulk operations and pagination).
* **Pagination Controls:** Standard Next/Prev controls at the bottom of the table.

### B. The Lead Profile Modal (`LeadDetails.tsx` or Expanded Modal)

Instead of a simple popup, the modal expands into a two-column layout:

* **Left Column (Lead Intelligence):**
  * Editable fields for Company, Contact, Phone, Email, Value, and Source.
  * Pipeline visualizer (clickable chevrons for changing status).
* **Right Column (The Activity Timeline):**
  * **Action Hub:** A tabbed input box (Log Call | Send WhatsApp | Add Note | Schedule Follow-up).
  * **Activity Feed:** A vertical scrolling timeline showing the history of every interaction, stamped with the sales rep's name and exact time.

---

## 4. Migration Plan

A safe data transition strategy is critical to ensure no existing leads are lost.

1. **Schema Migration Script:**
   * Create a Node.js script using `ALTER TABLE` to add the new columns (`company_name`, `owner_id`, etc.) to the existing `bookings` table.
   * Map old statuses to the new pipeline (e.g., `in_progress` becomes `negotiation`).
1. **Create Activity Table:**
   * Run `CREATE TABLE IF NOT EXISTS lead_activities`.
1. **Deploy API Layer:**
   * Update Express controllers to support pagination without breaking the old Kanban board temporarily.
1. **Frontend Switchover:**
   * Deploy the new CRM UI.
   * The first load will fetch `page=1` with limit `50`.

---

## 5. Implementation Priority (Phasing)

To deliver value iteratively, we will execute the plan in 3 strict sprints:

### **Priority 1: Infrastructure & Data Safety (Critical)**

* Database `ALTER TABLE` and `lead_activities` creation.
* Implement Server-Side Pagination and Search APIs.
* Build the "Export to CSV" button.
* *(Why? Prevents browser crashing from large data loads and secures data).*

### **Priority 2: The Core Workflow & Activity Engine (High)**

* Update UI to support the new Pipeline (`New` -> `Won/Lost`).
* Build the Timeline API (`POST` and `GET` activities).
* Build the right-side Timeline UI in the Lead Profile.
* *(Why? Enables actual sales velocity and historic tracking).*

### **Priority 3: Advanced Lead Enrichment (Medium)**

* Add Lead Attribution logic (capturing UTM tags / Referrer from the public form).
* Add Lead Assignment (Owner) and Follow-up Date reminders (Dashboard alerts).
* *(Why? Optimizes marketing spend and improves sales accountability).*
