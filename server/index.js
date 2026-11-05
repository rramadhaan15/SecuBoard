import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { scannerService } from './scannerService.js';
import { OWASP_CATEGORIES, INITIAL_SPRINTS } from './vulnerabilityDatabase.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve client dist in production
const clientDistPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

// In-memory sprints state
let sprintsState = [...INITIAL_SPRINTS];

// 1. Health & Overview BI Endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'UP', timestamp: new Date().toISOString() });
});

app.get('/api/overview', (req, res) => {
  const metrics = scannerService.getOverviewMetrics();
  res.json({
    metrics,
    categories: OWASP_CATEGORIES
  });
});

// 2. Vulnerabilities Endpoints
app.get('/api/vulnerabilities', (req, res) => {
  const { severity, owaspCategory, status, subdomain, search } = req.query;
  let list = [...scannerService.vulnerabilities];

  if (severity && severity !== 'ALL') {
    list = list.filter((v) => v.severity.toLowerCase() === severity.toLowerCase());
  }

  if (owaspCategory && owaspCategory !== 'ALL') {
    list = list.filter((v) => v.owaspCategory === owaspCategory);
  }

  if (status && status !== 'ALL') {
    list = list.filter((v) => v.status.toLowerCase() === status.toLowerCase());
  }

  if (subdomain && subdomain !== 'ALL') {
    list = list.filter((v) => v.subdomain.toLowerCase() === subdomain.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(
      (v) =>
        v.title.toLowerCase().includes(q) ||
        v.target.toLowerCase().includes(q) ||
        v.owaspName.toLowerCase().includes(q) ||
        v.description.toLowerCase().includes(q)
    );
  }

  res.json({
    total: list.length,
    vulnerabilities: list
  });
});

app.get('/api/vulnerabilities/:id', (req, res) => {
  const vuln = scannerService.vulnerabilities.find((v) => v.id === req.params.id);
  if (!vuln) return res.status(404).json({ error: 'Kerentanan tidak ditemukan.' });
  res.json(vuln);
});

app.patch('/api/vulnerabilities/:id', (req, res) => {
  const updated = scannerService.updateVulnerability(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Kerentanan tidak ditemukan.' });
  res.json(updated);
});

// 3. Scanner Control & Real-time SSE
app.get('/api/scanner/status', (req, res) => {
  res.json(scannerService.getStatus());
});

app.get('/api/scanner/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  scannerService.registerClient(res);

  req.on('close', () => {
    scannerService.unregisterClient(res);
  });
});

app.post('/api/scans/start', async (req, res) => {
  const { targetUrl, scanType } = req.body;
  const result = await scannerService.startScan({ targetUrl, scanType });
  res.json(result);
});

app.post('/api/scans/stop', (req, res) => {
  const result = scannerService.stopScan();
  res.json(result);
});

app.post('/api/scans/continuous', (req, res) => {
  const { enabled, intervalSec } = req.body;
  const status = scannerService.setContinuousMode(Boolean(enabled), intervalSec);
  res.json({ success: true, status });
});

app.get('/api/scans', (req, res) => {
  res.json({
    scans: scannerService.scanHistory
  });
});

// 4. Agile Scrum Sprints
app.get('/api/sprints', (req, res) => {
  res.json({ sprints: sprintsState });
});

app.patch('/api/sprints/:sprintId/tasks/:taskId', (req, res) => {
  const { sprintId, taskId } = req.params;
  const { status } = req.body;

  const sprint = sprintsState.find((s) => s.id === sprintId);
  if (!sprint) return res.status(404).json({ error: 'Sprint tidak ditemukan' });

  const task = sprint.tasks.find((t) => t.id === taskId);
  if (!task) return res.status(404).json({ error: 'Tugas tidak ditemukan' });

  task.status = status;
  // Recalculate completed story points
  const completedPoints = sprint.tasks
    .filter((t) => t.status === 'Done')
    .reduce((sum, t) => sum + (t.points || 0), 0);
  sprint.storyPointsCompleted = completedPoints;

  res.json({ success: true, sprint });
});

// 5. OWASP ZAP Daemon Status & Config
app.get('/api/zap/status', async (req, res) => {
  const connected = await scannerService.checkZapConnection();
  res.json({
    connected,
    zapConfig: scannerService.zapConfig
  });
});

app.post('/api/zap/config', async (req, res) => {
  const { host, port, apiKey } = req.body;
  if (host) scannerService.zapConfig.host = host;
  if (port) scannerService.zapConfig.port = Number(port);
  if (apiKey !== undefined) scannerService.zapConfig.apiKey = apiKey;

  const connected = await scannerService.checkZapConnection();
  res.json({ success: true, connected, zapConfig: scannerService.zapConfig });
});

// 6. Comprehensive Audit Report Data (for TA defense & Republika IT Team)
app.get('/api/report', (req, res) => {
  const metrics = scannerService.getOverviewMetrics();
  res.json({
    reportMetadata: {
      title: 'Laporan Audit Kerentanan Web Berbasis OWASP ZAP',
      institution: 'Universitas Pembangunan Nasional "Veteran" Jakarta',
      faculty: 'Fakultas Ilmu Komputer - Program Studi DIII Sistem Informasi',
      targetOrganization: 'PT Republika Media Mandiri',
      primaryTarget: 'https://www.republika.co.id (Portal Berita Nasional)',
      researcher: 'Rizki Ramadhan (NIM: 2410501091)',
      methodology: 'OWASP Top 10:2021 & Agile Scrum Framework (3 Sprints)',
      generatedAt: new Date().toISOString(),
      reportId: 'REP-AUDIT-' + Date.now().toString().slice(-6)
    },
    metrics,
    vulnerabilities: scannerService.vulnerabilities,
    sprints: sprintsState,
    categories: OWASP_CATEGORIES
  });
});

// Fallback route for client SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`[SecuBoard Server] Running on http://localhost:${PORT}`);
});
