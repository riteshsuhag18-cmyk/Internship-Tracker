# 🎯 Internship Tracker — VibeSprint 1.0 Submission

A fast, full-stack student application dashboard to track internship applications, monitor upcoming deadlines, and surface urgent follow-ups with zero external APIs or secrets.

---

## 📋 DOC-01: README & Quickstart

### Project Purpose & Core Features
**Internship Tracker** helps students manage their internship pipeline in one place without spreadsheets or external accounts.
* **Full CRUD + Inline Status Updates:** Add, edit, delete, and switch statuses (`Applied`, `Test`, `Interview`, `Offer`, `Rejected`) directly in the table.
* **Interactive Summary Cards & Search:** Clickable status counters (`Total`, `Applied`, `Test`, `Interview`, `Offer`, `Rejected`), live Company/Role search, and sorting by Deadline, Application Date, or Company.
* **Paired Twist (3-Day Warning & "Needs Action" Filter):** Automatically highlights active applications due within **0–3 days** (and flags past-due active items as `Overdue`) or missing a `Next Action`, with a 1-click **"Needs action"** filter and top **Urgent Attention Banner**.
* **Utilities:** Non-blocking toast notifications, local 1-click **CSV Export**, clear empty states, and **Reset Sample Data**.

### No-Secret Setup Steps (< 30 Seconds)
```bash
git clone https://github.com/riteshsuhag18-cmyk/Internship-Tracker.git
cd Internship-Tracker
npm install
npm start