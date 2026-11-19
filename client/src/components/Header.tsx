import React from 'react';
import { ScannerStatus } from '../types';

interface HeaderProps {
  scannerStatus: ScannerStatus | null;
  onStartScan: () => void;
  onStopScan: () => void;
  onToggleContinuous: () => void;
  onOpenZapConfig: () => void;
  onOpenReport?: () => void;
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

  const tabs = [
    { id: 'overview', label: 'Ringkasan BI' },
    { id: 'scanner', label: 'Continuous Scanner', badge: isScanning ? 'Running' : undefined },
    { id: 'vulnerabilities', label: 'Katalog Kerentanan' },
    { id: 'scrum', label: 'Agile Scrum' },
    { id: 'report', label: 'Laporan Audit TA' },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      {/* Main App Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & App Title */}
          <div className="flex items-center gap-3">
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 font-sans">
                Secu<span className="text-blue-600">Board</span>
              </span>
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wide bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-mono">
                OWASP ZAP BI
              </span>
            </div>
            <span className="text-xs font-medium text-slate-500 hidden md:inline">
              Continuous Web Vulnerability Intelligence
            </span>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* ZAP Status Button */}
            <button
              onClick={onOpenZapConfig}
              className={`h-9 flex items-center gap-2 px-3.5 rounded-lg text-xs font-semibold border transition-colors ${
                zapConnected
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${zapConnected ? 'bg-emerald-500' : 'bg-blue-600'}`}></span>
              <span>{zapConnected ? 'ZAP Daemon Live' : 'ZAP Standby'}</span>
            </button>

            {/* Continuous Mode Toggle */}
            <button
              onClick={onToggleContinuous}
              className={`h-9 px-3.5 rounded-lg text-xs font-semibold border transition-colors ${
                isContinuous
                  ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              Continuous: {isContinuous ? 'ON' : 'OFF'}
            </button>

            {/* Scan Trigger */}
            {isScanning ? (
              <button
                onClick={onStopScan}
                className="h-9 px-4 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white transition-colors flex items-center justify-center"
              >
                Hentikan Scan
              </button>
            ) : (
              <button
                onClick={onStartScan}
                className="h-9 px-4 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-xs flex items-center justify-center"
              >
                Scan Sekarang
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation Menu (Clean Underline Style, No Icon Clutter) */}
        <nav className="flex space-x-1 sm:space-x-4 border-t border-slate-100 overflow-x-auto scrollbar-none" aria-label="Tabs">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-3.5 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
                  isActive
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="px-1.5 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-700 font-mono">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
