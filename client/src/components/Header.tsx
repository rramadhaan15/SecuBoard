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
  Zap,
  Sparkles
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
    <header className="border-b border-[#16233d] bg-[#0c1322]/95 backdrop-blur-md sticky top-0 z-40 shadow-xl">
      {/* Top Academic & Target Context Bar */}
      <div className="bg-[#070b14] border-b border-[#16233d]/80 px-4 sm:px-8 py-1.5 text-xs text-slate-300 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-bold text-cyan-400">
            <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            Tugas Akhir DIII Sistem Informasi UPN &ldquo;Veteran&rdquo; Jakarta 2026
          </span>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="text-slate-400 hidden sm:inline">
            Peneliti: <strong className="text-slate-200 font-medium">Rizki Ramadhan</strong> (2410501091)
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
            className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors text-[11px] underline underline-offset-2 font-medium"
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
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-teal-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 border border-cyan-300/40">
                <ShieldCheck className="w-5 h-5 text-slate-950 font-extrabold" />
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
                <span className="text-xl font-extrabold tracking-tight text-white font-mono flex items-center">
                  Secu<span className="text-cyan-400">Board</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-700 shadow-sm flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
                  v2.0 Cyber Edition
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Continuous Web Vulnerability Intelligence &bull; OWASP ZAP BI
              </p>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* ZAP Daemon Status Button */}
            <button
              onClick={onOpenZapConfig}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                zapConnected
                  ? 'bg-emerald-950/60 border-emerald-600 text-emerald-300 hover:bg-emerald-900/60 shadow-sm shadow-emerald-950'
                  : 'bg-[#111b2f] border-[#1d2e50] text-slate-300 hover:bg-[#16233d]'
              }`}
              title="Konfigurasi Engine OWASP ZAP Daemon"
            >
              <Zap className={`w-3.5 h-3.5 ${zapConnected ? 'text-emerald-400' : 'text-cyan-400'}`} />
              <span className={`w-2 h-2 rounded-full ${zapConnected ? 'bg-emerald-400 shadow-sm shadow-emerald-400' : 'bg-cyan-400 animate-pulse'}`}></span>
              <span className="hidden md:inline">{zapConnected ? 'ZAP Live' : 'Autonomous Engine'}</span>
              <Settings className="w-3 h-3 text-slate-400 ml-0.5" />
            </button>

            {/* Continuous Mode Toggle */}
            <button
              onClick={onToggleContinuous}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                isContinuous
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400 shadow-md shadow-emerald-950'
                  : 'bg-[#111b2f] hover:bg-[#16233d] text-slate-300 border-[#1d2e50]'
              }`}
              title="Aktifkan/Nonaktifkan pemindaian otomatis tanpa henti"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isContinuous ? 'animate-spin text-white' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">Continuous:</span>
              <span className={isContinuous ? 'font-extrabold text-white' : 'text-slate-400'}>
                {isContinuous ? 'ON' : 'OFF'}
              </span>
            </button>

            {/* Scan Trigger */}
            {isScanning ? (
              <button
                onClick={onStopScan}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-950 transition-all active:scale-95"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Stop Scan</span>
              </button>
            ) : (
              <button
                onClick={onStartScan}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-lg shadow-cyan-950 transition-all hover:scale-[1.02] active:scale-95"
              >
                <Play className="w-3.5 h-3.5 fill-current text-slate-950" />
                <span>Scan Sekarang</span>
              </button>
            )}

            {/* Report Button */}
            <button
              onClick={onOpenReport}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#111b2f] hover:bg-[#16233d] text-cyan-300 border border-[#1d2e50] hover:border-cyan-500/50 shadow-sm transition-all"
            >
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Laporan TA</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Menu (Pill Bar) */}
        <div className="flex border-t border-[#16233d] -mb-px overflow-x-auto scrollbar-none py-2 gap-1.5 sm:gap-2">
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
                className={`py-2 px-3.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-950/80 to-[#111b2f] border border-cyan-500/60 text-cyan-300 shadow-md shadow-cyan-950'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#111b2f]/60 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-cyan-950 text-cyan-300 border border-cyan-500 animate-pulse">
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
