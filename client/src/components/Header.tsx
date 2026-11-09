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
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-40 shadow-sm">
      {/* Top Academic & Target Context Bar */}
      <div className="bg-slate-100/90 border-b border-slate-200 px-4 sm:px-8 py-2 text-xs text-slate-600 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-bold text-blue-700">
            <span className="inline-block w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
            Tugas Akhir DIII Sistem Informasi UPN &ldquo;Veteran&rdquo; Jakarta 2026
          </span>
          <span className="text-slate-300 hidden sm:inline">|</span>
          <span className="text-slate-600 hidden sm:inline">
            Peneliti: <strong className="text-slate-900 font-semibold">Rizki Ramadhan</strong> (NIM: 2410501091)
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            Objek Penelitian: <strong className="text-blue-700 font-mono">PT Republika Media Mandiri (republika.co.id)</strong>
          </span>
          <a
            href="https://www.republika.co.id"
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors text-[11px] font-semibold underline underline-offset-2"
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
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow-md shadow-blue-500/20 text-white">
                <ShieldCheck className="w-5 h-5" />
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
                <span className="text-xl font-extrabold tracking-tight text-slate-900 font-mono flex items-center">
                  Secu<span className="text-blue-600">Board</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 shadow-sm flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-blue-600" />
                  v2.0 Light Edition
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Continuous Web Vulnerability Intelligence &bull; OWASP ZAP BI
              </p>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* ZAP Status Button */}
            <button
              onClick={onOpenZapConfig}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                zapConnected
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100 shadow-sm'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
              title="Konfigurasi Engine OWASP ZAP Daemon"
            >
              <Zap className={`w-3.5 h-3.5 ${zapConnected ? 'text-emerald-600' : 'text-blue-600'}`} />
              <span className={`w-2 h-2 rounded-full ${zapConnected ? 'bg-emerald-500' : 'bg-blue-500 animate-pulse'}`}></span>
              <span className="hidden md:inline">{zapConnected ? 'ZAP Live' : 'Autonomous Engine'}</span>
              <Settings className="w-3 h-3 text-slate-400 ml-0.5" />
            </button>

            {/* Continuous Mode Toggle */}
            <button
              onClick={onToggleContinuous}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                isContinuous
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-700 shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
              title="Aktifkan/Nonaktifkan pemindaian otomatis tanpa henti"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isContinuous ? 'animate-spin text-white' : 'text-slate-500'}`} />
              <span className="hidden sm:inline">Continuous:</span>
              <span className={isContinuous ? 'font-extrabold text-white' : 'text-slate-600'}>
                {isContinuous ? 'ON' : 'OFF'}
              </span>
            </button>

            {/* Scan Trigger */}
            {isScanning ? (
              <button
                onClick={onStopScan}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20 transition-all active:scale-95"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Stop Scan</span>
              </button>
            ) : (
              <button
                onClick={onStartScan}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 transition-all hover:scale-[1.02] active:scale-95"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Scan Sekarang</span>
              </button>
            )}

            {/* Report Button */}
            <button
              onClick={onOpenReport}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-sm transition-all"
            >
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">Laporan TA</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Menu (Pills with Light Theme Styling) */}
        <div className="flex border-t border-slate-200 -mb-px overflow-x-auto scrollbar-none py-2 gap-1.5 sm:gap-2">
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
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                    isActive ? 'bg-white text-blue-700' : 'bg-blue-100 text-blue-800'
                  } animate-pulse`}>
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
