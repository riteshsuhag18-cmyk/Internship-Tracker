'use strict';

const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'applications.json');
const SAMPLE_FILE = path.join(DATA_DIR, 'sampleData.json');
const STATUSES = ['Applied', 'Test', 'Interview', 'Offer', 'Rejected'];

// ---------- Storage helpers ----------
function pad(n) { return String(n).padStart(2, '0'); }
function dateFromOffset(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// sampleData.json stores relative offsets so the demo always has fresh
// "due soon" / "overdue" rows. They are converted to real dates here.
function buildSampleRecords() {
  const raw = JSON.parse(fs.readFileSync(SAMPLE_FILE, 'utf8'));
  return raw.map((s) => ({
    id: crypto.randomUUID(),
    company: s.company,
    role: s.role,
    applicationDate: dateFromOffset(-s.applicationDaysAgo),
    deadline: dateFromOffset(s.deadlineInDays),
    status: s.status,
    nextAction: s.nextAction
  }));
}

function readApplications() {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function writeApplications(list) {
  const tmp = DATA_FILE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(list, null, 2));
  fs.renameSync(tmp, DATA_FILE);
}

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) writeApplications(buildSampleRecords());
}

// ---------- Validation ----------
function isValidDate(s) {
  if (typeof s !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const [y, m, d] = s.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d;
}

function validate(body) {
  const errors = {};
  const company = typeof body.company === 'string' ? body.company.trim() : '';
  const role = typeof body.role === 'string' ? body.role.trim() : '';
  const nextAction = typeof body.nextAction === 'string' ? body.nextAction.trim() : '';
  const { applicationDate, deadline, status } = body;

  if (!company) errors.company = 'Company is required.';
  else if (company.length > 100) errors.company = 'Company must be 100 characters or fewer.';
  if (!role) errors.role = 'Role is required.';
  else if (role.length > 100) errors.role = 'Role must be 100 characters or fewer.';
  if (!isValidDate(applicationDate)) errors.applicationDate = 'Enter a valid application date.';
  if (!isValidDate(deadline)) errors.deadline = 'Enter a valid deadline.';
  else if (isValidDate(applicationDate) && deadline < applicationDate) {
    errors.deadline = 'Deadline cannot be before the application date.';
  }
  if (!STATUSES.includes(status)) errors.status = 'Choose a valid status.';
  if (nextAction.length > 200) errors.nextAction = 'Next action must be 200 characters or fewer.';

  return {
    errors,
    value: { company, role, applicationDate, deadline, status, nextAction }
  };
}

// ---------- App ----------
ensureDataFile();
const app = express();
app.use(express.json({ limit: '50kb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/applications', (req, res) => {
  try {
    res.json(readApplications());
  } catch (e) {
    res.status(500).json({ error: 'Could not read applications.' });
  }
});

app.post('/api/applications', (req, res) => {
  const { errors, value } = validate(req.body || {});
  if (Object.keys(errors).length) return res.status(400).json({ error: 'Validation failed.', errors });
  const record = { id: crypto.randomUUID(), ...value };
  const list = readApplications();
  list.push(record);
  writeApplications(list);
  res.status(201).json(record);
});

app.put('/api/applications/:id', (req, res) => {
  const list = readApplications();
  const idx = list.findIndex((a) => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Application not found.' });
  const { errors, value } = validate(req.body || {});
  if (Object.keys(errors).length) return res.status(400).json({ error: 'Validation failed.', errors });
  list[idx] = { id: list[idx].id, ...value };
  writeApplications(list);
  res.json(list[idx]);
});

app.delete('/api/applications/:id', (req, res) => {
  const list = readApplications();
  const idx = list.findIndex((a) => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Application not found.' });
  const [removed] = list.splice(idx, 1);
  writeApplications(list);
  res.json(removed);
});

app.post('/api/reset', (req, res) => {
  const fresh = buildSampleRecords();
  writeApplications(fresh);
  res.json(fresh);
});

app.use('/api', (req, res) => res.status(404).json({ error: 'Not found.' }));

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Invalid JSON.' });
  console.error(err);
  res.status(500).json({ error: 'Something went wrong.' });
});

app.listen(PORT, () => console.log(`Internship Tracker running on http://localhost:${PORT}`));
