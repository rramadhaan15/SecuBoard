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
  ExternalLink,
  Terminal,
  ShieldAlert,
  Layers,
  Zap
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
    <header className="border-b border-[#17233d] bg-[#0c1322]/95 backdrop-blur-md sticky top-0 z-40">
      {/* Top Academic & Target Context Bar */}
      <div className="bg-[#080c14]/90 border-b border-[#17233d]/70 px-4 sm:px-8 py-1.5 text-xs text-slate-400 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-medium text-cyan-400">
            <span className="inline-block w-2 h-2 rounded-full bg-cyan-500 animate-ping"></span>
            Tugas Akhir DIII Sistem Informasi UPN &ldquo;Veteran&rdquo; Jakarta 2026
          </span>
          <span className="text-slate-700 hidden sm:inline">|</span>
          <span className="hidden sm:inline">
            Peneliti: <span className="text-slate-200 font-medium">Rizki Ramadhan</span> (NIM: 2410501091)
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            Objek Penelitian: <strong className="text-emerald-400 font-mono">PT Republika Media Mandiri (republika.co.id)</strong>
          </span>
          <a
            href="https://www.republika.co.id"
            target="_blank"
            rel="noreferrer"
            className="text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition-colors text-[11px]"
            title="Kunjungi Portal Republika"
          >
            Portal <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Identity */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 border border-cyan-400/30">
                <ShieldCheck className="w-5 h-5 text-slate-950 font-bold" />
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
                <span className="text-xl font-bold tracking-tight text-white font-mono flex items-center">
                  Secu<span className="text-cyan-400">Board</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-400 border border-cyan-800">
                  OWASP ZAP BI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Continuous Web Vulnerability Intelligence
              </p>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* ZAP Daemon Status Button */}
            <button
              onClick={onOpenZapConfig}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                zapConnected
                  ? 'bg-emerald-950/50 border-emerald-700/80 text-emerald-400 hover:bg-emerald-900/50 shadow-sm shadow-emerald-950'
                  : 'bg-[#111a2e] border-[#1e2f52] text-slate-300 hover:bg-[#17233d]'
              }`}
              title="Konfigurasi Engine OWASP ZAP Daemon"
            >
              <Zap className={`w-3.5 h-3.5 ${zapConnected ? 'text-emerald-400' : 'text-cyan-400'}`} />
              <span className={`w-2 h-2 rounded-full ${zapConnected ? 'bg-emerald-400 shadow-sm shadow-emerald-400' : 'bg-cyan-400 animate-pulse'}`}></span>
              <span className="hidden md:inline">{zapConnected ? 'ZAP Daemon Live' : 'Autonomous Engine'}</span>
              <Settings className="w-3 h-3 text-slate-400 ml-0.5" />
            </button>

            {/* Continuous Mode Toggle */}
            <button
              onClick={onToggleContinuous}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                isContinuous
                  ? 'bg-emerald-600/90 hover:bg-emerald-500 text-white border-emerald-400 shadow-sm shadow-emerald-600/30'
                  : 'bg-[#111a2e] hover:bg-[#17233d] text-slate-300 border-[#1e2f52]'
              }`}
              title="Aktifkan/Nonaktifkan pemindaian berkala otomatis"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isContinuous ? 'animate-spin text-white' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">Continuous:</span>
              <span className={isContinuous ? 'font-bold' : 'text-slate-400'}>
                {isContinuous ? 'ON' : 'OFF'}
              </span>
            </button>

            {/* Scan Trigger */}
            {isScanning ? (
              <button
                onClick={onStopScan}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/30 transition-all active:scale-95"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Stop Scan</span>
              </button>
            ) : (
              <button
                onClick={onStartScan}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-md shadow-cyan-600/30 transition-all active:scale-95"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Scan Sekarang</span>
              </button>
            )}

            {/* Report Button */}
            <button
              onClick={onOpenReport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#111a2e] hover:bg-[#17233d] text-cyan-300 border border-[#1e2f52] hover:border-cyan-500/50 shadow-sm transition-all"
            >
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Laporan TA</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="flex border-t border-[#17233d] -mb-px overflow-x-auto scrollbar-none gap-1 sm:gap-2">
          {[
            { id: 'overview', label: 'Ringkasan BI & Metrik', icon: Activity },
            { id: 'scanner', label: 'Continuous Scanner (ZAP)', icon: Terminal, badge: isScanning ? 'RUNNING' : undefined },
            { id: 'vulnerabilities', label: 'Katalog Kerentanan', icon: ShieldAlert },
            { id: 'scrum', label: 'Agile Scrum (Sprint 1-3)', icon: Layers },
            { id: 'report', label: 'Laporan Audit & Sidang', icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-3.5 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
                  isActive
                    ? 'border-cyan-400 text-cyan-300 font-semibold bg-cyan-950/20'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700 hover:bg-[#111a2e]/40'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-700 animate-pulse">
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
