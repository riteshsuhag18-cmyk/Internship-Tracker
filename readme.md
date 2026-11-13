# Internship Tracker — VibeSprint 1.0 Submission

A fast, full-stack student application dashboard to track internship applications, monitor upcoming deadlines, and surface urgent follow-ups with zero external APIs or secrets.

---

## DOC-01: README & Quickstart

### Project Purpose & Core Features
Internship Tracker helps students manage their internship pipeline in one place without spreadsheets or external accounts.
* Full CRUD + Inline Status Updates: Add, edit, delete, and switch statuses (Applied, Test, Interview, Offer, Rejected) directly in the table.
* Interactive Summary Cards & Search: Clickable status counters (Total, Applied, Test, Interview, Offer, Rejected), live Company/Role search, and sorting by Deadline, Application Date, or Company.
* Paired Twist (3-Day Warning & "Needs Action" Filter): Automatically highlights active applications due within 0–3 days (and flags past-due active items as Overdue) or missing a Next Action, with a 1-click "Needs action" filter and top Urgent Attention Banner.
* Utilities: Non-blocking toast notifications, local 1-click CSV Export, clear empty states, and Reset Sample Data.

### No-Secret Setup Steps (< 30 Seconds)
1. Clone: git clone https://github.com/riteshsuhag18-cmyk/Internship-Tracker.git
2. Enter folder: cd Internship-Tracker
3. Install dependencies: npm install
4. Run server: npm start
5. Open http://localhost:3000 in any browser. No .env file, database setup, or API keys are required.

### Demo Data & Known Limitations
* Demo Data: Ships with 6 realistic sample records in data/sampleData.json covering all 5 statuses, a 1-day and 3-day upcoming deadline, and a record missing a Next Action.
* What to Click First (30-Second Overview): Click the "Needs action" button (top-right of the table) to immediately isolate urgent rows, then click any top status card (e.g., Interview) to filter by stage.
* Known Limitations: Uses local file-based JSON storage (data/applications.json) rather than a multi-user cloud database, and deadline notifications are visual in-app alerts rather than automated emails.

---

## DOC-02: Judge Runbook (60-Second Demo Script)

1. Starting State (0–10s): Open the dashboard (http://localhost:3000 or live Render link). Point out the 6 preloaded sample applications, live status summary cards at the top, and the Urgent Attention Banner showing active items needing review.
2. Add an Urgent Application — Triggering the Twist (10–25s):
   * In the Add New Application form, enter Company: Stripe, Role: Software Engineer Intern, Application Date: Today, Deadline: Tomorrow (within 3 days), Status: Applied, and leave Next Action empty (or type Complete coding challenge).
   * Click Add Application.
   * Expected Output: A toast confirms creation, Total and Applied counts increment by 1, and the Stripe row appears highlighted with an amber "1 day left" badge (plus "Missing next action" if left blank).
3. Verify the Paired Twist Filter (25–40s):
   * Click the "Needs action" toggle button (or click the top Urgent Attention Banner).
   * Expected Output: Non-urgent rows hide immediately; only active applications with deadlines within 3 days, overdue deadlines, or missing next actions remain visible. Click "Needs action" again to restore the full list.
4. Inline Status Update & Live Summary Sync (40–55s):
   * Change Stripe's status dropdown inline from Applied to Interview.
   * Expected Output: The badge turns amber, a toast confirms the update, Applied count decreases by 1, and Interview count increases by 1 immediately.
5. Reset Demo State (55–60s):
   * Click Reset Sample Data in the header to restore the clean 6-record baseline.
   * Note on Simulated Features: All preloaded companies/roles are simulated demo records, and CSV export generates a client-side file from the current view without backend email/API integrations.

---

## DOC-03: Five-Test Checklist

1. Invalid Input Test:
   * Steps: Leave Company or Role blank (or enter a Deadline earlier than Application Date) and click Add Application.
   * Expected Result: Form blocks submission, highlights validation error/message, and no corrupt record is saved.

2. Happy Path (Create & Update):
   * Steps: Fill all valid fields (Google, SWE Intern, valid dates, Applied, Prep DSA), click Add Application, then change status to Test.
   * Expected Result: Record is added to the table, toast notification appears, and Total / Test summary cards update live.

3. Twist Check (3-Day Warning & Filter):
   * Steps: Add an active application with a deadline 2 days from today, then click the "Needs action" button.
   * Expected Result: Row displays an amber "2 days left" badge, and "Needs action" filters out rows due >3 days away with valid next actions.

4. Reset / Refresh Check:
   * Steps: Delete a record, refresh the browser (F5), verify persistence, then click Reset Sample Data.
   * Expected Result: Refresh preserves the deletion (data/applications.json); Reset Sample Data restores all 6 original sample records.

5. Boundary Case (Deadline = Today / Completed Status):
   * Steps: Set an active application's deadline to today's exact date (0 days left), then change its status to Offer or Rejected.
   * Expected Result: While active, it triggers the urgent warning and appears in Needs action; once marked Offer or Rejected, deadline warnings disappear.

---

## DOC-04: User Quickstart (4-Step Guide)

1. What the App Does: Internship Tracker organizes your internship applications in one dashboard, automatically flagging deadlines within 3 days and tasks missing a next step so nothing slips through the cracks.
2. What Input to Provide: Enter the Company, Role, Application Date, Deadline, current Status (Applied, Test, Interview, Offer, or Rejected), and an optional Next Action in the top form, then click Add Application.
3. What Result to Expect: Your application appears in the sortable list with color-coded status badges, live summary counters update at the top, and any urgent deadline (<= 3 days) or blank next action is automatically flagged for Needs action filtering.
4. How to Recover from a Mistake:
   * Wrong text/date/status: Click Edit on that row to fix any field, or use the inline Status dropdown to switch stages immediately.
   * Accidental delete or messy test data: Click Reset Sample Data in the top-right header at any time to restore the clean default dataset.

---

## DOC-05: Data & Privacy Note

* Exact Fields Stored: id, company, role, applicationDate, deadline, status, and nextAction.
* Storage Mechanism: Uses local server-side JSON file storage (data/applications.json)—no browser third-party tracking or external cloud database is used.
* Demo / Fake Data: All 6 preloaded records (FinEdge Analytics, CloudScale Systems, GreenGrid Energy, PixelCraft Studio, DataPulse Labs, NovaPay Tech) are fictional demo records created solely for testing.
* No External Data Transmission: The application runs completely self-contained and never sends user data to any external server, analytics service, or third-party API.
* No Secrets or PII: Confirmed zero .env files, API keys, authentication tokens, passwords, or real personal identifiable information (PII) are included or stored.

---

## DOC-06: Handoff & Limitations

### Main Files & Where Core Logic Lives
* server.js — Express web server and REST API (GET, POST, PUT, DELETE /api/applications, plus POST /api/reset) handling local JSON file read/write operations and input validation.
* public/index.html — Complete responsive UI, CSS styling, live search/sorting, local date comparison logic (3-day warning & overdue detection), summary counter rendering, toast feedback, and CSV export.
* data/sampleData.json — Read-only seed template containing the 6 default demo applications.
* data/applications.json — Active local JSON datastore auto-generated from sampleData.json on startup.

### How Demo Data Is Reset
Clicking Reset Sample Data sends a POST /api/reset request to server.js, which overwrites data/applications.json with a fresh copy of data/sampleData.json and re-renders the UI immediately.

### What Is Deliberately Mocked
* Sample Companies & Dates: Preloaded records use fictional companies and relative demo dates.
* No Email / Calendar Sync: Deadlines and next actions are manually entered rather than scraped from Gmail or job portals, per hackathon no-external-API rules.

### Top Three Improvements Needed for Real Production Deployment
1. Persistent Cloud Database & Auth: Replace local JSON file storage (which resets on ephemeral cloud container restarts like Render's free tier) with PostgreSQL/MongoDB and user authentication so multiple students can maintain private accounts.
2. Automated Deadline Reminders: Integrate email or push notifications (e.g., via cron jobs + SendGrid/Web Push) to alert students 72 hours and 24 hours before test/interview deadlines.
3. Browser Extension / Resume Versioning: Add a Chrome extension to 1-click capture job postings from LinkedIn/Internshala along with tracking which resume version was submitted per role.
