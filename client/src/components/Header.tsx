import React from 'react';
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
    <header className="border-b border-slate-800 bg-slate-950 sticky top-0 z-40">
      {/* Top Academic & Target Context Bar */}
      <div className="bg-slate-900/80 border-b border-slate-800/80 px-4 sm:px-8 py-1.5 text-xs text-slate-400 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-3">
          <span className="font-medium text-slate-300">
            TA DIII Sistem Informasi &bull; FIK UPN &ldquo;Veteran&rdquo; Jakarta 2026
          </span>
          <span className="text-slate-600">|</span>
          <span>
            Peneliti: <span className="text-slate-200 font-medium">Rizki Ramadhan</span> (2410501091)
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span>
            Target: <strong className="text-slate-200 font-mono">PT Republika Media Mandiri (republika.co.id)</strong>
          </span>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & App Title */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-6 rounded-sm bg-sky-500"></span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold tracking-tight text-white font-mono">
                    SecuBoard
                  </span>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-sky-400 border border-slate-700">
                    OWASP ZAP BI
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 hidden sm:block">
                  Continuous Web Vulnerability Intelligence
                </p>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* ZAP Status */}
            <button
              onClick={onOpenZapConfig}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                zapConnected
                  ? 'bg-emerald-950/40 border-emerald-800 text-emerald-400 hover:bg-emerald-900/40'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${zapConnected ? 'bg-emerald-400' : 'bg-sky-400'}`}></span>
              <span>{zapConnected ? 'ZAP Daemon Live' : 'ZAP Engine Active'}</span>
            </button>

            {/* Continuous Mode Toggle */}
            <button
              onClick={onToggleContinuous}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition-all ${
                isContinuous
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
              }`}
            >
              Continuous Scan: {isContinuous ? 'ON' : 'OFF'}
            </button>

            {/* Scan Trigger */}
            {isScanning ? (
              <button
                onClick={onStopScan}
                className="px-3.5 py-1.5 rounded-md text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-sm transition-all"
              >
                Stop Scan
              </button>
            ) : (
              <button
                onClick={onStartScan}
                className="px-3.5 py-1.5 rounded-md text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white shadow-sm transition-all"
              >
                Scan Sekarang
              </button>
            )}

            {/* Report Button */}
            <button
              onClick={onOpenReport}
              className="px-3 py-1.5 rounded-md text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition-all"
            >
              Laporan TA
            </button>
          </div>
        </div>

        {/* Tab Navigation Menu (Clean Text Tabs, No Icons) */}
        <div className="flex border-t border-slate-850 -mb-px overflow-x-auto scrollbar-none gap-1 sm:gap-2">
          {[
            { id: 'overview', label: 'Ringkasan BI & Metrik' },
            { id: 'scanner', label: 'Continuous Scanner (ZAP)', badge: isScanning ? 'RUNNING' : undefined },
            { id: 'vulnerabilities', label: 'Katalog Kerentanan' },
            { id: 'scrum', label: 'Agile Scrum (Sprint 1-3)' },
            { id: 'report', label: 'Laporan Audit & Sidang' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2.5 px-3.5 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
                  isActive
                    ? 'border-sky-500 text-sky-400 font-semibold'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-sky-950 text-sky-300 border border-sky-800">
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
