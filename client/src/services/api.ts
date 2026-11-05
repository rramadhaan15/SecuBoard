import { OverviewMetrics, OWASPCategoryInfo, Vulnerability, Sprint, ScannerStatus, ScanJob } from '../types';

const API_BASE = '/api';

export const api = {
  // Get BI overview
  async getOverview(): Promise<{ metrics: OverviewMetrics; categories: Record<string, OWASPCategoryInfo> }> {
    const res = await fetch(`${API_BASE}/overview`);
    if (!res.ok) throw new Error('Failed to fetch overview metrics');
    return res.json();
  },

  // Get vulnerabilities with filtering
  async getVulnerabilities(params: {
    severity?: string;
    owaspCategory?: string;
    status?: string;
    subdomain?: string;
    search?: string;
  } = {}): Promise<{ total: number; vulnerabilities: Vulnerability[] }> {
    const query = new URLSearchParams();
    if (params.severity) query.append('severity', params.severity);
    if (params.owaspCategory) query.append('owaspCategory', params.owaspCategory);
    if (params.status) query.append('status', params.status);
    if (params.subdomain) query.append('subdomain', params.subdomain);
    if (params.search) query.append('search', params.search);

    const res = await fetch(`${API_BASE}/vulnerabilities?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch vulnerabilities');
    return res.json();
  },

  // Get single vulnerability
  async getVulnerability(id: string): Promise<Vulnerability> {
    const res = await fetch(`${API_BASE}/vulnerabilities/${id}`);
    if (!res.ok) throw new Error('Failed to fetch vulnerability details');
    return res.json();
  },

  // Update vulnerability status / details
  async updateVulnerability(id: string, updates: Partial<Vulnerability>): Promise<Vulnerability> {
    const res = await fetch(`${API_BASE}/vulnerabilities/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update vulnerability');
    return res.json();
  },

  // Scanner status
  async getScannerStatus(): Promise<ScannerStatus> {
    const res = await fetch(`${API_BASE}/scanner/status`);
    if (!res.ok) throw new Error('Failed to fetch scanner status');
    return res.json();
  },

  // Trigger scan
  async startScan(targetUrl: string, scanType: string): Promise<{ success: boolean; scanId?: string; message: string }> {
    const res = await fetch(`${API_BASE}/scans/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetUrl, scanType }),
    });
    if (!res.ok) throw new Error('Failed to start scan');
    return res.json();
  },

  // Stop scan
  async stopScan(): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/scans/stop`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to stop scan');
    return res.json();
  },

  // Toggle continuous scan
  async setContinuousMode(enabled: boolean, intervalSec: number = 45): Promise<any> {
    const res = await fetch(`${API_BASE}/scans/continuous`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled, intervalSec }),
    });
    if (!res.ok) throw new Error('Failed to set continuous scan mode');
    return res.json();
  },

  // Scan history
  async getScanHistory(): Promise<{ scans: ScanJob[] }> {
    const res = await fetch(`${API_BASE}/scans`);
    if (!res.ok) throw new Error('Failed to fetch scan history');
    return res.json();
  },

  // Sprints
  async getSprints(): Promise<{ sprints: Sprint[] }> {
    const res = await fetch(`${API_BASE}/sprints`);
    if (!res.ok) throw new Error('Failed to fetch sprints');
    return res.json();
  },

  async updateSprintTask(sprintId: string, taskId: string, status: string): Promise<any> {
    const res = await fetch(`${API_BASE}/sprints/${sprintId}/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update task');
    return res.json();
  },

  // OWASP ZAP Config & status
  async getZapStatus(): Promise<any> {
    const res = await fetch(`${API_BASE}/zap/status`);
    if (!res.ok) throw new Error('Failed to fetch ZAP status');
    return res.json();
  },

  async updateZapConfig(config: { host?: string; port?: number; apiKey?: string }): Promise<any> {
    const res = await fetch(`${API_BASE}/zap/config`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
    if (!res.ok) throw new Error('Failed to update ZAP config');
    return res.json();
  },

  // Audit report data
  async getReportData(): Promise<any> {
    const res = await fetch(`${API_BASE}/report`);
    if (!res.ok) throw new Error('Failed to fetch report data');
    return res.json();
  },
};
