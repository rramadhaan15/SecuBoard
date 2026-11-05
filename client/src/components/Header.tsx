import React from 'react';
import { 
  ShieldCheck, 
  Activity, 
  RefreshCw, 
  Settings, 
  FileText, 
  Play, 
  Square, 
  Globe, 
  ExternalLink 
} from 'lucide-react';
import { ScannerStatus } from '../types';

interface HeaderProps {
  scannerStatus: ScannerStatus | null;
  onStartScan: () => void;
  onStopScan: () => void;
  onToggleContinuous: () => void;
  onOpenZapConfig: () => void;
  onOpenReport: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  scannerStatus,
  onStartScan,
  onStopScan,
  onToggleContinuous,
  onOpenZapConfig,
  onOpenReport,
  activeTab,
  setActiveTab,
}) => {
  const isScanning = scannerStatus?.isScanning || false;
  const isContinuous = scannerStatus?.isContinuous || false;
  const zapConnected = scannerStatus?.zapConfig.connected || false;

  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-40">
      {/* Top Banner with University & Republika info */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border-b border-slate-800/80 px-4 py-1.5 text-xs text-slate-300 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-medium text-blue-400">
            <span className="inline-block w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
            Tugas Akhir DIII Sistem Informasi UPN &ldquo;Veteran&rdquo; Jakarta 2026
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300">
            Peneliti: <strong className="text-white">Rizki Ramadhan</strong> (NIM: 2410501091)
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-slate-300">
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            Objek Penelitian: <strong className="text-emerald-400 font-mono">PT Republika Media Mandiri (republika.co.id)</strong>
          </span>
          <a 
            href="https://www.republika.co.id" 
            target="_blank" 
            rel="noreferrer"
            className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            Visit Portal <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Main Navigation Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Identity */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              {isScanning && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                  Secu<span className="text-cyan-400">Board</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    OWASP ZAP BI
                  </span>
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Continuous Web Vulnerability Scanner &amp; Decision Intelligence
              </p>
            </div>
          </div>

          {/* Quick Controls & Scanner Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* ZAP Status Pill */}
            <button
              onClick={onOpenZapConfig}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                zapConnected
                  ? 'bg-emerald-950/60 border-emerald-700 text-emerald-300 hover:bg-emerald-900/60'
                  : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
              }`}
              title="Klik untuk konfigurasi koneksi OWASP ZAP"
            >
              <span className={`w-2 h-2 rounded-full ${zapConnected ? 'bg-emerald-400 animate-pulse' : 'bg-cyan-400'}`}></span>
              <span className="hidden md:inline">{zapConnected ? 'ZAP Daemon Live' : 'ZAP Engine Active'}</span>
              <Settings className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
            </button>

            {/* Continuous Mode Toggle Button */}
            <button
              onClick={onToggleContinuous}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                isContinuous
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-400 shadow-md shadow-emerald-600/30 ring-2 ring-emerald-500/40'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
              title="Aktifkan pemindaian terus-menerus secara otomatis"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isContinuous ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Scan Otomatis Berkelanjutan:</span>
              <span>{isContinuous ? 'AKTIF' : 'OFF'}</span>
            </button>

            {/* Manual Scan Trigger / Stop */}
            {isScanning ? (
              <button
                onClick={onStopScan}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/30 transition-all"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Stop Scan</span>
              </button>
            ) : (
              <button
                onClick={onStartScan}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-600/30 transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Scan Sekarang</span>
              </button>
            )}

            {/* Report Export Button */}
            <button
              onClick={onOpenReport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 hover:border-cyan-500/50 transition-all"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Laporan TA</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="flex border-t border-slate-800 -mb-px overflow-x-auto scrollbar-none">
          {[
            { id: 'overview', label: 'Dashboard BI & Metrik', icon: Activity },
            { id: 'scanner', label: 'Continuous Scanner (ZAP)', icon: RefreshCw, badge: isScanning ? 'RUNNING' : undefined },
            { id: 'vulnerabilities', label: 'Katalog Kerentanan', icon: ShieldCheck },
            { id: 'scrum', label: 'Agile Scrum (Sprint 1-3)', icon: ExternalLink },
            { id: 'report', label: 'Laporan Audit & Sidang', icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-3 px-4 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                  isActive
                    ? 'border-cyan-500 text-cyan-400 bg-cyan-950/20'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 animate-pulse">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
