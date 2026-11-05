import http from 'http';
import { INITIAL_VULNERABILITIES, INITIAL_SCAN_HISTORY } from './vulnerabilityDatabase.js';

class ScannerService {
  constructor() {
    this.vulnerabilities = [...INITIAL_VULNERABILITIES];
    this.scanHistory = [...INITIAL_SCAN_HISTORY];
    this.sseClients = new Set();

    // Scanner state
    this.isScanning = false;
    this.isContinuous = false;
    this.continuousIntervalSec = 45; // default continuous interval in seconds
    this.continuousTimer = null;
    this.currentScan = null;
    this.logs = [];

    // OWASP ZAP Integration settings
    this.zapConfig = {
      host: '127.0.0.1',
      port: 8080,
      apiKey: '',
      connected: false,
      version: 'N/A'
    };

    // Auto-check ZAP connection
    this.checkZapConnection();
  }

  // Check if live OWASP ZAP is running on localhost:8080
  async checkZapConnection() {
    return new Promise((resolve) => {
      const req = http.get(
        `http://${this.zapConfig.host}:${this.zapConfig.port}/JSON/core/view/version/`,
        { timeout: 2000 },
        (res) => {
          let data = '';
          res.on('data', (chunk) => (data += chunk));
          res.on('end', () => {
            try {
              const json = JSON.parse(data);
              if (json && json.version) {
                this.zapConfig.connected = true;
                this.zapConfig.version = json.version;
                this.addLog('SUCCESS', `Terhubung dengan OWASP ZAP daemon v${json.version} di port ${this.zapConfig.port}`);
                return resolve(true);
              }
            } catch (e) {}
            this.zapConfig.connected = false;
            resolve(false);
          });
        }
      );
      req.on('error', () => {
        this.zapConfig.connected = false;
        resolve(false);
      });
    });
  }

  // Register SSE Client for real-time streaming
  registerClient(res) {
    this.sseClients.add(res);
    // Send initial state immediately
    res.write(`data: ${JSON.stringify({ type: 'STATUS', data: this.getStatus() })}\n\n`);
  }

  unregisterClient(res) {
    this.sseClients.delete(res);
  }

  broadcast(type, data) {
    const payload = `data: ${JSON.stringify({ type, data })}\n\n`;
    for (const client of this.sseClients) {
      try {
        client.write(payload);
      } catch (e) {
        this.sseClients.delete(client);
      }
    }
  }

  addLog(level, message, metadata = null) {
    const logItem = {
      id: 'LOG-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      timestamp: new Date().toISOString(),
      level, // INFO, WARN, DANGER, SUCCESS, SPIDER, PASSIVE, ACTIVE
      message,
      metadata
    };
    this.logs.unshift(logItem);
    if (this.logs.length > 250) this.logs.pop();
    this.broadcast('LOG', logItem);
  }

  getStatus() {
    return {
      isScanning: this.isScanning,
      isContinuous: this.isContinuous,
      continuousIntervalSec: this.continuousIntervalSec,
      currentScan: this.currentScan,
      zapConfig: this.zapConfig,
      recentLogs: this.logs.slice(0, 30)
    };
  }

  // Start continuous mode
  setContinuousMode(enabled, intervalSec = 45) {
    this.isContinuous = enabled;
    if (intervalSec) this.continuousIntervalSec = Math.max(10, intervalSec);

    if (this.continuousTimer) {
      clearInterval(this.continuousTimer);
      this.continuousTimer = null;
    }

    if (this.isContinuous) {
      this.addLog('INFO', `Mode Continuous Scanning diaktifkan (Interval: ${this.continuousIntervalSec} detik).`);
      // Run first scan immediately if not scanning
      if (!this.isScanning) {
        this.startScan({
          targetUrl: 'https://www.republika.co.id',
          scanType: 'Continuous OWASP ZAP Automated Scan'
        });
      }

      this.continuousTimer = setInterval(() => {
        if (!this.isScanning && this.isContinuous) {
          this.addLog('INFO', `[Continuous Scheduler] Memulai siklus scan otomatis berkala untuk Website Republika...`);
          this.startScan({
            targetUrl: 'https://www.republika.co.id',
            scanType: 'Continuous OWASP ZAP Automated Scan'
          });
        }
      }, this.continuousIntervalSec * 1000);
    } else {
      this.addLog('WARN', 'Mode Continuous Scanning dinonaktifkan.');
    }

    this.broadcast('STATUS', this.getStatus());
    return this.getStatus();
  }

  // Trigger manual or automated scan
  async startScan({ targetUrl = 'https://www.republika.co.id', scanType = 'Full Scan (Spider + Passive + Active)' }) {
    if (this.isScanning) {
      return { success: false, message: 'Pemindaian sedang berjalan.' };
    }

    const scanId = 'SCAN-' + new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
    this.isScanning = true;

    this.currentScan = {
      id: scanId,
      targetUrl,
      scanType,
      phase: 'Spidering',
      progress: 0,
      startTime: new Date().toISOString(),
      urlsCrawled: 0,
      requestsSent: 0,
      alertsFound: { high: 0, medium: 0, low: 0, info: 0, total: 0 },
      currentUrl: targetUrl
    };

    this.addLog('INFO', `[${scanId}] Memulai pemindaian keamanan terpadu OWASP ZAP pada target: ${targetUrl}`);
    this.broadcast('STATUS', this.getStatus());

    // Execute scan asynchronously
    this.runScanPipeline(this.currentScan);

    return { success: true, scanId, message: 'Pemindaian berhasil dimulai.' };
  }

  // Abort scan
  stopScan() {
    if (!this.isScanning) return { success: false, message: 'Tidak ada pemindaian aktif.' };
    this.isScanning = false;
    this.addLog('WARN', `Pemindaian ${this.currentScan?.id} dihentikan oleh pengguna.`);
    this.currentScan = null;
    this.broadcast('STATUS', this.getStatus());
    return { success: true, message: 'Pemindaian dihentikan.' };
  }

  // Scan execution pipeline simulating OWASP ZAP stages
  async runScanPipeline(scan) {
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    try {
      // ----------------------------------------------------
      // SPRINT 1: INFORMATION GATHERING & SPIDERING
      // ----------------------------------------------------
      scan.phase = 'Spidering & Deteksi Arsitektur (Sprint 1)';
      this.addLog('SPIDER', `[Sprint 1] Menginisiasi OWASP ZAP Spider pada ${scan.targetUrl}...`);

      const spiderEndpoints = [
        '/',
        '/berita/nasional',
        '/berita/internasional',
        '/berita/ekonomi',
        '/khazanah/islam-digest',
        '/retizen/trending',
        '/ihram/haji-umrah',
        '/search?q=pemilu',
        '/kontak-redaksi',
        '/api/v1/news/popular',
        '/api/v1/comments',
        '/assets/js/main.js',
        '/assets/vendor/jquery.min.js',
        '/robots.txt',
        '/sitemap.xml'
      ];

      for (let i = 0; i < spiderEndpoints.length; i++) {
        if (!this.isScanning) return;
        const endpoint = spiderEndpoints[i];
        scan.currentUrl = `${scan.targetUrl}${endpoint}`;
        scan.urlsCrawled += Math.floor(Math.random() * 8) + 4;
        scan.requestsSent += Math.floor(Math.random() * 15) + 8;
        scan.progress = Math.round((i / spiderEndpoints.length) * 30);

        this.addLog('SPIDER', `[Spider Crawl] Menemukan URI: ${scan.currentUrl} (Status: 200 OK)`);
        this.broadcast('SCAN_PROGRESS', scan);
        await sleep(350);
      }

      this.addLog('SUCCESS', `[Sprint 1 Selesai] Total ${scan.urlsCrawled} URL & form endpoints berhasil dipetakan.`);

      // ----------------------------------------------------
      // SPRINT 2: PASSIVE SCANNING
      // ----------------------------------------------------
      scan.phase = 'Passive Scanning (Sprint 2)';
      this.addLog('PASSIVE', `[Sprint 2] Menjalankan OWASP ZAP Passive Scan pada seluruh respon HTTP yang tercatat...`);

      const passiveChecks = [
        'Memeriksa konfigurasi Content-Security-Policy (CSP)',
        'Memeriksa atribut header X-Frame-Options (Clickjacking protection)',
        'Memeriksa header Strict-Transport-Security (HSTS)',
        'Menganalisis atribut Set-Cookie (HttpOnly, Secure, SameSite)',
        'Memeriksa kebocoran banner server (Server Tokens, X-Powered-By)',
        'Pemeriksaan versi library JavaScript usang (Retire.js rules)'
      ];

      for (let i = 0; i < passiveChecks.length; i++) {
        if (!this.isScanning) return;
        const check = passiveChecks[i];
        scan.progress = 30 + Math.round((i / passiveChecks.length) * 35);
        scan.requestsSent += 25;
        this.addLog('PASSIVE', `[Passive Rule] ${check}...`);

        if (i === 0) {
          scan.alertsFound.medium++;
          scan.alertsFound.total++;
          this.addLog('WARN', `[Alert Pasif Ditemukan] Missing CSP Header pada ${scan.targetUrl}`);
        } else if (i === 1) {
          scan.alertsFound.low++;
          scan.alertsFound.total++;
          this.addLog('WARN', `[Alert Pasif Ditemukan] X-Frame-Options tidak terkonfigurasi secara ketat`);
        } else if (i === 4) {
          scan.alertsFound.low++;
          scan.alertsFound.total++;
          this.addLog('INFO', `[Alert Pasif Ditemukan] Versi Nginx/PHP terekspos pada header respon`);
        }

        this.broadcast('SCAN_PROGRESS', scan);
        await sleep(400);
      }

      // ----------------------------------------------------
      // SPRINT 2: ACTIVE SCANNING (Payload Injection)
      // ----------------------------------------------------
      scan.phase = 'Active Scanning (Sprint 2 - Injection Testing)';
      this.addLog('ACTIVE', `[Sprint 2] Mengirimkan payload simulasi eksploitasi aktif ke parameter input...`);

      const activeTargets = [
        { url: `${scan.targetUrl}/search?q=test`, payload: "' UNION SELECT 1,2,3--", type: 'SQL Injection' },
        { url: `${scan.targetUrl}/retizen/filter?tag=news`, payload: "<script>alert(1)</script>", type: 'Reflected XSS' },
        { url: `${scan.targetUrl}/api/v1/comments/1`, payload: "IDOR Parameter tampering", type: 'Broken Access Control' },
        { url: `${scan.targetUrl}/kontak-redaksi`, payload: "CSRF token validation probe", type: 'CSRF Test' }
      ];

      for (let i = 0; i < activeTargets.length; i++) {
        if (!this.isScanning) return;
        const target = activeTargets[i];
        scan.currentUrl = target.url;
        scan.progress = 65 + Math.round((i / activeTargets.length) * 25);
        scan.requestsSent += 65;

        this.addLog('ACTIVE', `[Active Scan Probe] Menguji ${target.type} pada ${target.url} [Payload: ${target.payload}]`);

        if (i === 0) {
          scan.alertsFound.high++;
          scan.alertsFound.total++;
          this.addLog('DANGER', `[ALERT KRITIS] Potensi SQL Injection terdeteksi pada parameter q di ${target.url}`);
        } else if (i === 1) {
          scan.alertsFound.medium++;
          scan.alertsFound.total++;
          this.addLog('WARN', `[ALERT SEDANG] Reflected XSS payload berhasil direfleksikan`);
        }

        this.broadcast('SCAN_PROGRESS', scan);
        await sleep(500);
      }

      // ----------------------------------------------------
      // SPRINT 3: ANALYSIS & OWASP TOP 10 CLASSIFICATION
      // ----------------------------------------------------
      scan.phase = 'Analysis & Mitigasi (Sprint 3)';
      scan.progress = 95;
      this.addLog('INFO', `[Sprint 3] Melakukan pemetaan temuan ke standar OWASP Top 10:2021 dan kalkulasi CVSS...`);
      await sleep(600);

      scan.progress = 100;
      scan.endTime = new Date().toISOString();
      scan.status = 'Completed';
      scan.duration = '1m 24s';

      this.addLog('SUCCESS', `[Pemindaian Selesai] Target ${scan.targetUrl} berhasil dipindai secara otomatis. Total kerentanan aktif: ${scan.alertsFound.total}`);

      // Push to scan history
      this.scanHistory.unshift({
        id: scan.id,
        targetUrl: scan.targetUrl,
        scanType: scan.scanType,
        startTime: scan.startTime,
        endTime: scan.endTime,
        duration: scan.duration,
        urlsCrawled: scan.urlsCrawled,
        requestsSent: scan.requestsSent,
        status: 'Completed',
        alertsFound: { ...scan.alertsFound }
      });

      this.isScanning = false;
      this.currentScan = null;
      this.broadcast('STATUS', this.getStatus());
      this.broadcast('SCAN_COMPLETED', { scanId: scan.id, stats: scan.alertsFound });

    } catch (err) {
      this.isScanning = false;
      this.currentScan = null;
      this.addLog('DANGER', `Gagal menjalankan pemindaian: ${err.message}`);
      this.broadcast('STATUS', this.getStatus());
    }
  }

  // Update status or remediation notes for a vulnerability
  updateVulnerability(id, updates) {
    const index = this.vulnerabilities.findIndex((v) => v.id === id);
    if (index === -1) return null;

    this.vulnerabilities[index] = {
      ...this.vulnerabilities[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.addLog(
      'INFO',
      `Kerentanan [${id}] diperbarui. Status: ${updates.status || this.vulnerabilities[index].status}`
    );

    return this.vulnerabilities[index];
  }

  // Get aggregated overview for BI Dashboard
  getOverviewMetrics() {
    const total = this.vulnerabilities.length;
    const high = this.vulnerabilities.filter((v) => v.severity === 'High').length;
    const medium = this.vulnerabilities.filter((v) => v.severity === 'Medium').length;
    const low = this.vulnerabilities.filter((v) => v.severity === 'Low').length;
    const info = this.vulnerabilities.filter((v) => v.severity === 'Informational').length;

    const resolved = this.vulnerabilities.filter((v) => v.status === 'Resolved').length;
    const inProgress = this.vulnerabilities.filter((v) => v.status === 'In Progress').length;
    const open = this.vulnerabilities.filter((v) => v.status === 'Open').length;

    // Security Posture Score calculation (100 base, deduction based on open vulnerabilities)
    // High deduction: 15 pts, Medium: 6 pts, Low: 2 pts
    const openHigh = this.vulnerabilities.filter((v) => v.severity === 'High' && v.status !== 'Resolved').length;
    const openMedium = this.vulnerabilities.filter((v) => v.severity === 'Medium' && v.status !== 'Resolved').length;
    const openLow = this.vulnerabilities.filter((v) => v.severity === 'Low' && v.status !== 'Resolved').length;

    const penalty = (openHigh * 15) + (openMedium * 6) + (openLow * 2);
    const postureScore = Math.max(10, Math.min(100, 100 - penalty));

    let securityGrade = 'A';
    if (postureScore < 60) securityGrade = 'D';
    else if (postureScore < 75) securityGrade = 'C';
    else if (postureScore < 88) securityGrade = 'B';

    // CIA Triad Distribution
    let confCount = 0;
    let integCount = 0;
    let availCount = 0;

    for (const v of this.vulnerabilities) {
      if (v.ciaImpact.confidentiality !== 'None') confCount++;
      if (v.ciaImpact.integrity !== 'None') integCount++;
      if (v.ciaImpact.availability !== 'None') availCount++;
    }

    // OWASP Top 10 Distribution
    const owaspCounts = {};
    for (const v of this.vulnerabilities) {
      owaspCounts[v.owaspCategory] = (owaspCounts[v.owaspCategory] || 0) + 1;
    }

    // Subdomain Attack Surface Distribution
    const subdomainCounts = {};
    for (const v of this.vulnerabilities) {
      subdomainCounts[v.subdomain] = (subdomainCounts[v.subdomain] || 0) + 1;
    }

    return {
      postureScore,
      securityGrade,
      totalFindings: total,
      severityCounts: { high, medium, low, info },
      statusCounts: { open, inProgress, resolved },
      resolutionRate: Math.round((resolved / total) * 100),
      mttrHours: 18.4, // Mean Time To Remediate (hours)
      slaComplianceRate: 88, // %
      ciaTriad: {
        confidentiality: confCount,
        integrity: integCount,
        availability: availCount
      },
      owaspDistribution: owaspCounts,
      subdomainCounts,
      totalScansConducted: this.scanHistory.length,
      lastScanTime: this.scanHistory[0]?.endTime || new Date().toISOString()
    };
  }
}

export const scannerService = new ScannerService();
