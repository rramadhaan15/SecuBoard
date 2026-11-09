import React, { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';
import { Header } from './components/Header';
import { OverviewView } from './components/OverviewView';
import { ContinuousScannerView } from './components/ContinuousScannerView';
import { VulnerabilitiesView } from './components/VulnerabilitiesView';
import { ScrumBoardView } from './components/ScrumBoardView';
import { DetailModal } from './components/DetailModal';
import { ReportModal } from './components/ReportModal';
import { ZAPConfigModal } from './components/ZAPConfigModal';
import { api } from './services/api';
import { 
  OverviewMetrics, 
  OWASPCategoryInfo, 
  Vulnerability, 
  Sprint, 
  ScannerStatus, 
  ScanJob, 
  LogItem, 
  Status 
} from './types';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Core Data States
  const [metrics, setMetrics] = useState<OverviewMetrics | null>(null);
  const [categories, setCategories] = useState<Record<string, OWASPCategoryInfo>>({});
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [scanHistory, setScanHistory] = useState<ScanJob[]>([]);
  const [scannerStatus, setScannerStatus] = useState<ScannerStatus | null>(null);
  const [logs, setLogs] = useState<LogItem[]>([]);

  // Modals
  const [selectedVulnerability, setSelectedVulnerability] = useState<Vulnerability | null>(null);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [showZapConfig, setShowZapConfig] = useState<boolean>(false);

  // Initial Data Fetching
  const refreshAllData = async () => {
    try {
      const [overviewData, vulnsData, sprintsData, historyData, statusData] = await Promise.all([
        api.getOverview(),
        api.getVulnerabilities(),
        api.getSprints(),
        api.getScanHistory(),
        api.getScannerStatus(),
      ]);

      setMetrics(overviewData.metrics);
      setCategories(overviewData.categories);
      setVulnerabilities(vulnsData.vulnerabilities);
      setSprints(sprintsData.sprints);
      setScanHistory(historyData.scans);
      setScannerStatus(statusData);
      if (statusData.recentLogs) {
        setLogs(statusData.recentLogs.reverse());
      }
    } catch (err) {
      console.error('Error fetching initial data:', err);
    }
  };

  useEffect(() => {
    refreshAllData();

    // Setup Server-Sent Events (SSE) for Real-Time Scanner Updates
    const sse = new EventSource('/api/scanner/stream');

    sse.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.type === 'STATUS') {
          setScannerStatus(payload.data);
          if (payload.data.recentLogs) {
            setLogs((prev) => {
              const ids = new Set(prev.map((l) => l.id));
              const newLogs = payload.data.recentLogs.filter((l: LogItem) => !ids.has(l.id));
              return [...prev, ...newLogs];
            });
          }
        } else if (payload.type === 'LOG') {
          setLogs((prev) => [...prev, payload.data]);
        } else if (payload.type === 'SCAN_PROGRESS') {
          setScannerStatus((prev) => (prev ? { ...prev, currentScan: payload.data, isScanning: true } : null));
        } else if (payload.type === 'SCAN_COMPLETED') {
          refreshAllData();
        }
      } catch (e) {
        console.error('SSE parse error:', e);
      }
    };

    sse.onerror = (e) => {
      // SSE reconnects automatically
    };

    return () => {
      sse.close();
    };
  }, []);

  // Handlers
  const handleStartScan = async (
    targetUrl: string = 'https://www.republika.co.id',
    scanType: string = 'Full Scan (Spider + Passive + Active)'
  ) => {
    try {
      await api.startScan(targetUrl, scanType);
      setActiveTab('scanner');
    } catch (err) {
      console.error('Failed to trigger scan:', err);
    }
  };

  const handleStopScan = async () => {
    try {
      await api.stopScan();
    } catch (err) {
      console.error('Failed to stop scan:', err);
    }
  };

  const handleToggleContinuous = async () => {
    try {
      const nextState = !scannerStatus?.isContinuous;
      const res = await api.setContinuousMode(nextState, scannerStatus?.continuousIntervalSec || 45);
      if (res && res.status) {
        setScannerStatus(res.status);
      }
    } catch (err) {
      console.error('Failed to toggle continuous scan:', err);
    }
  };

  const handleSetInterval = async (seconds: number) => {
    try {
      await api.setContinuousMode(scannerStatus?.isContinuous || false, seconds);
    } catch (err) {
      console.error('Failed to set continuous interval:', err);
    }
  };

  const handleUpdateVulnerability = async (id: string, updates: Partial<Vulnerability>) => {
    try {
      const updated = await api.updateVulnerability(id, updates);
      setVulnerabilities((prev) => prev.map((v) => (v.id === id ? updated : v)));
      if (selectedVulnerability && selectedVulnerability.id === id) {
        setSelectedVulnerability(updated);
      }
      // Re-fetch overview metrics to reflect changes
      const overviewData = await api.getOverview();
      setMetrics(overviewData.metrics);
    } catch (err) {
      console.error('Failed to update vulnerability:', err);
    }
  };

  const handleQuickStatusChange = (id: string, status: Status) => {
    handleUpdateVulnerability(id, { status });
  };

  const handleUpdateSprintTask = async (sprintId: string, taskId: string, status: string) => {
    try {
      const res = await api.updateSprintTask(sprintId, taskId, status);
      if (res && res.sprint) {
        setSprints((prev) => prev.map((s) => (s.id === sprintId ? res.sprint : s)));
      }
    } catch (err) {
      console.error('Failed to update sprint task:', err);
    }
  };

  const handleSaveZapConfig = async (cfg: { host: string; port: number; apiKey: string }) => {
    try {
      const res = await api.updateZapConfig(cfg);
      if (res && res.zapConfig) {
        setScannerStatus((prev) => (prev ? { ...prev, zapConfig: res.zapConfig } : null));
      }
    } catch (err) {
      console.error('Failed to save ZAP config:', err);
    }
  };

  const handleTestZapConnection = async (): Promise<boolean> => {
    try {
      const res = await api.getZapStatus();
      if (res && res.zapConfig) {
        setScannerStatus((prev) => (prev ? { ...prev, zapConfig: res.zapConfig } : null));
      }
      return Boolean(res?.connected);
    } catch {
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Top Header & Navigation */}
      <Header
        scannerStatus={scannerStatus}
        onStartScan={() => handleStartScan()}
        onStopScan={handleStopScan}
        onToggleContinuous={handleToggleContinuous}
        onOpenZapConfig={() => setShowZapConfig(true)}
        onOpenReport={() => setShowReportModal(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'overview' && (
          <OverviewView
            metrics={metrics}
            categories={categories}
            vulnerabilities={vulnerabilities}
            onSelectVulnerability={(vuln) => setSelectedVulnerability(vuln)}
            onNavigateToTab={(tab) => setActiveTab(tab)}
            onStartScan={() => handleStartScan()}
          />
        )}

        {activeTab === 'scanner' && (
          <ContinuousScannerView
            scannerStatus={scannerStatus}
            scanHistory={scanHistory}
            logs={logs}
            onStartScan={handleStartScan}
            onStopScan={handleStopScan}
            onToggleContinuous={handleToggleContinuous}
            onSetInterval={handleSetInterval}
          />
        )}

        {activeTab === 'vulnerabilities' && (
          <VulnerabilitiesView
            vulnerabilities={vulnerabilities}
            categories={categories}
            onSelectVulnerability={(vuln) => setSelectedVulnerability(vuln)}
            onQuickStatusChange={handleQuickStatusChange}
          />
        )}

        {activeTab === 'scrum' && (
          <ScrumBoardView
            sprints={sprints}
            onUpdateTaskStatus={handleUpdateSprintTask}
          />
        )}

        {activeTab === 'report' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  Laporan Hasil Pengujian &amp; Dokumen Audit TA
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Siap dicetak atau diekspor ke PDF untuk berkas sidang DIII Sistem Informasi UPN &ldquo;Veteran&rdquo; Jakarta
                </p>
              </div>
              <button
                onClick={() => setShowReportModal(true)}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-95 shrink-0"
              >
                Buka Pratinjau Dokumen Cetak
              </button>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-3 shadow-xs">
              <p className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Klik tombol di atas untuk membuka dokumen laporan komprehensif lengkap dengan kop resmi Universitas Pembangunan Nasional &quot;Veteran&quot; Jakarta, tabel temuan kerentanan OWASP Top 10, rekomendasi patch teknis, dan lembar tanda tangan pengesahan.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer (Crisp Light Theme) */}
      <footer className="border-t border-slate-200 bg-white py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <p className="text-slate-800 font-bold">
              SecuBoard &mdash; Business Intelligence Vulnerability Assessment Dashboard
            </p>
            <p className="text-slate-500">
              Tugas Akhir: Rizki Ramadhan (NIM: 2410501091) &bull; DIII Sistem Informasi, FIK UPN &ldquo;Veteran&rdquo; Jakarta 2026
            </p>
          </div>
          <div className="text-center sm:text-right text-slate-600">
            <span>Studi Kasus: PT Republika Media Mandiri</span>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Engine: OWASP ZAP 2.14 &bull; Standar: OWASP Top 10:2021 &bull; Framework: Agile Scrum
            </div>
          </div>
        </div>
      </footer>

      {/* Detail / Remediation Modal */}
      {selectedVulnerability && (
        <DetailModal
          vulnerability={selectedVulnerability}
          onClose={() => setSelectedVulnerability(null)}
          onUpdateStatus={handleUpdateVulnerability}
        />
      )}

      {/* Comprehensive Report Modal */}
      {showReportModal && (
        <ReportModal
          onClose={() => setShowReportModal(false)}
          metrics={metrics}
          vulnerabilities={vulnerabilities}
          sprints={sprints}
        />
      )}

      {/* OWASP ZAP Configuration Modal */}
      {showZapConfig && scannerStatus && (
        <ZAPConfigModal
          config={scannerStatus.zapConfig}
          onClose={() => setShowZapConfig(false)}
          onSaveConfig={handleSaveZapConfig}
          onTestConnection={handleTestZapConnection}
        />
      )}
    </div>
  );
};

export default App;
