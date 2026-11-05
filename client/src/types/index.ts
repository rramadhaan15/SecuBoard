export type Severity = 'High' | 'Medium' | 'Low' | 'Informational';
export type Status = 'Open' | 'In Progress' | 'Resolved' | 'False Positive';

export interface CIAImpact {
  confidentiality: 'High' | 'Medium' | 'Low' | 'None';
  integrity: 'High' | 'Medium' | 'Low' | 'None';
  availability: 'High' | 'Medium' | 'Low' | 'None';
  summary: string;
}

export interface Evidence {
  method: string;
  parameter: string;
  attackPayload: string;
  responseSnippet: string;
  confidence: string;
}

export interface Remediation {
  quickFixTitle: string;
  description: string;
  codeSnippet: string;
  frameworkSnippet?: string;
  steps: string[];
}

export interface Vulnerability {
  id: string;
  title: string;
  target: string;
  subdomain: string;
  severity: Severity;
  cvss: number;
  cvssVector: string;
  owaspCategory: string;
  owaspName: string;
  cwe: string;
  sprint: string;
  detectedAt: string;
  status: Status;
  assignedTo: string;
  ciaImpact: CIAImpact;
  description: string;
  evidence: Evidence;
  remediation: Remediation;
  updatedAt?: string;
}

export interface OWASPCategoryInfo {
  code: string;
  name: string;
  nameId: string;
  color: string;
}

export interface OverviewMetrics {
  postureScore: number;
  securityGrade: string;
  totalFindings: number;
  severityCounts: {
    high: number;
    medium: number;
    low: number;
    info: number;
  };
  statusCounts: {
    open: number;
    inProgress: number;
    resolved: number;
  };
  resolutionRate: number;
  mttrHours: number;
  slaComplianceRate: number;
  ciaTriad: {
    confidentiality: number;
    integrity: number;
    availability: number;
  };
  owaspDistribution: Record<string, number>;
  subdomainCounts: Record<string, number>;
  totalScansConducted: number;
  lastScanTime: string;
}

export interface ScanJob {
  id: string;
  targetUrl: string;
  scanType: string;
  phase: string;
  progress: number;
  startTime: string;
  endTime?: string;
  duration?: string;
  urlsCrawled: number;
  requestsSent: number;
  currentUrl?: string;
  status?: string;
  alertsFound: {
    high: number;
    medium: number;
    low: number;
    info: number;
    total: number;
  };
}

export interface LogItem {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'DANGER' | 'SUCCESS' | 'SPIDER' | 'PASSIVE' | 'ACTIVE';
  message: string;
  metadata?: any;
}

export interface SprintTask {
  id: string;
  title: string;
  status: 'Todo' | 'In Progress' | 'Done';
  points: number;
}

export interface Sprint {
  id: string;
  number: number;
  name: string;
  goal: string;
  status: 'Planned' | 'In Progress' | 'Active' | 'Completed';
  startDate: string;
  endDate: string;
  storyPointsTotal: number;
  storyPointsCompleted: number;
  tasks: SprintTask[];
}

export interface ZAPConfig {
  host: string;
  port: number;
  apiKey: string;
  connected: boolean;
  version: string;
}

export interface ScannerStatus {
  isScanning: boolean;
  isContinuous: boolean;
  continuousIntervalSec: number;
  currentScan: ScanJob | null;
  zapConfig: ZAPConfig;
  recentLogs: LogItem[];
}
