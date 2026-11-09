import React, { useState, useRef, useEffect } from 'react';
import { 
  Terminal, 
  Play, 
  Square, 
  RefreshCw, 
  Sliders, 
  Globe, 
  Clock, 
  CheckCircle2, 
  Activity, 
  Flame, 
  AlertTriangle, 
  Info,
  ShieldCheck
} from 'lucide-react';
import { ScannerStatus, ScanJob, LogItem } from '../types';

interface ContinuousScannerViewProps {
  scannerStatus: ScannerStatus | null;
  scanHistory: ScanJob[];
  logs: LogItem[];
  onStartScan: (targetUrl: string, scanType: string) => void;
  onStopScan: () => void;
  onToggleContinuous: () => void;
  onSetInterval: (seconds: number) => void;
}

export const ContinuousScannerView: React.FC<ContinuousScannerViewProps> = ({
  scannerStatus,
  scanHistory,
  logs,
  onStartScan,
  onStopScan,
  onToggleContinuous,
  onSetInterval,
}) => {
  const [selectedTarget, setSelectedTarget] = useState('https://www.republika.co.id');
  const [customTarget, setCustomTarget] = useState('');
  const [selectedType, setSelectedType] = useState('Full Scan (Spider + Passive + Active)');
  const [intervalSec, setIntervalSec] = useState(scannerStatus?.continuousIntervalSec || 45);
  const [autoScroll, setAutoScroll] = useState(true);

  const terminalEndRef = useRef<HTMLDivElement>(null);

  const isScanning = scannerStatus?.isScanning || false;
  const isContinuous = scannerStatus?.isContinuous || false;
  const currentScan = scannerStatus?.currentScan;

  const targetPresets = [
    { label: 'Portal Utama (republika.co.id)', url: 'https://www.republika.co.id', desc: 'Portal berita nasional & agregator' },
    { label: 'Retizen Warga (retizen.republika.co.id)', url: 'https://retizen.republika.co.id', desc: 'Platform jurnalisme publik/warga' },
    { label: 'Ihram Haji/Umrah (ihram.republika.co.id)', url: 'https://ihram.republika.co.id', desc: 'Layanan panduan ibadah haji/umrah' },
    { label: 'Kanal News (news.republika.co.id)', url: 'https://news.republika.co.id', desc: 'Feed headline berita terkini' },
    { label: 'API Gateway (api.republika.co.id)', url: 'https://api.republika.co.id', desc: 'Backend microservices & mobile API' },
  ];

  // Auto scroll terminal to bottom
  useEffect(() => {
    if (autoScroll && terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll]);

  const handleStart = () => {
    const target = customTarget.trim() ? customTarget.trim() : selectedTarget;
    onStartScan(target, selectedType);
  };

  const handleIntervalChange = (val: number) => {
    setIntervalSec(val);
    onSetInterval(val);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-50 via-white to-sky-50 border border-blue-200/80 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
              Autonomous OWASP ZAP Scanner Engine
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
            Pusat Pengujian &amp; Pemindaian Berkelanjutan Website Republika
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Sistem menjalankan siklus pengujian: Spidering (Sprint 1) &rarr; Passive Analysis &amp; Active Payload Injection (Sprint 2) &rarr; Evaluasi OWASP Top 10 (Sprint 3) secara kontinu tanpa jeda manual.
          </p>
        </div>

        {/* Continuous Toggle Widget */}
        <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm shrink-0">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <RefreshCw className={`w-3.5 h-3.5 ${isContinuous ? 'text-emerald-600 animate-spin' : 'text-slate-400'}`} />
              <span className="text-xs font-bold text-slate-900">Mode Continuous Scan</span>
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              {isContinuous ? `Looping setiap ${intervalSec} detik` : 'Status: Non-aktif'}
            </div>
          </div>
          <button
            onClick={onToggleContinuous}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 ${
              isContinuous
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
            }`}
          >
            {isContinuous ? 'AKTIF' : 'AKTIFKAN'}
          </button>
        </div>
      </div>

      {/* Control Panel & Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Configuration Form (Clean White Card) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Sliders className="w-4 h-4 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">
              Parameter Pemindaian ZAP
            </h3>
          </div>

          {/* Preset Targets */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
              Pilih Target Asset Republika:
            </label>
            <div className="space-y-2">
              {targetPresets.map((preset) => {
                const isSelected = selectedTarget === preset.url && !customTarget.trim();
                return (
                  <button
                    key={preset.url}
                    type="button"
                    onClick={() => {
                      setSelectedTarget(preset.url);
                      setCustomTarget('');
                    }}
                    className={`w-full text-left p-3 rounded-xl border transition-all text-xs flex flex-col justify-between ${
                      isSelected
                        ? 'bg-blue-50 border-blue-500 text-blue-900 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span className={isSelected ? 'text-blue-900' : 'text-slate-800'}>{preset.label}</span>
                      <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-blue-600' : 'bg-slate-300'}`}></span>
                    </div>
                    <span className="text-[11px] text-slate-500 mt-0.5 font-mono">{preset.url}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom URL Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
              Atau Custom Endpoint:
            </label>
            <div className="relative">
              <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={customTarget}
                onChange={(e) => setCustomTarget(e.target.value)}
                placeholder="https://www.republika.co.id/path"
                className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-mono shadow-xs"
              />
            </div>
          </div>

          {/* Scan Type */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
              Profil Pemindaian:
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 shadow-xs font-medium"
            >
              <option value="Full Scan (Spider + Passive + Active)">
                Full Scan (Spider + Passive Analysis + Active Injections)
              </option>
              <option value="Passive Scan (Header & Traffic Inspection)">
                Passive Audit Only (Headers, Cookies, Sensitive Data)
              </option>
              <option value="Active Injection Scan (SQLi & XSS Only)">
                Active Injection Attack (SQLi, XSS, Path Traversal)
              </option>
            </select>
          </div>

          {/* Interval Configuration */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-600 uppercase tracking-wider">Interval Continuous:</span>
              <span className="font-mono font-bold text-blue-700">{intervalSec} Detik</span>
            </div>
            <div className="flex gap-2">
              {[30, 45, 60, 120].map((sec) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => handleIntervalChange(sec)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                    intervalSec === sec
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {sec}s
                </button>
              ))}
            </div>
          </div>

          {/* Trigger Button */}
          <div className="pt-2">
            {isScanning ? (
              <button
                type="button"
                onClick={onStopScan}
                className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Square className="w-4 h-4 fill-current" />
                <span>Hentikan Pemindaian Aktif</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleStart}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-95"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Jalankan Pemindaian Sekarang</span>
              </button>
            )}
          </div>
        </div>

        {/* Right: Telemetry & Live Terminal Console */}
        <div className="lg:col-span-2 space-y-4">
          {/* Active Scan Telemetry Card (Clean White) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${isScanning ? 'bg-blue-600 animate-ping' : 'bg-slate-400'}`}></span>
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  {isScanning ? 'Pemindaian Sedang Berjalan (Active)' : 'Engine Status: Siaga (Idle)'}
                </span>
              </div>
              <span className="text-xs font-mono text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200 font-bold">
                Phase: {currentScan?.phase || (isScanning ? 'Initializing ZAP' : 'Standby')}
              </span>
            </div>

            {/* Target & Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600 font-mono truncate max-w-md">
                  Target: <strong className="text-slate-900">{currentScan?.targetUrl || selectedTarget}</strong>
                </span>
                <span className="font-mono font-extrabold text-blue-700 text-sm">
                  {currentScan?.progress || 0}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-300 relative"
                  style={{ width: `${currentScan?.progress || 0}%` }}
                >
                  {isScanning && (
                    <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                  )}
                </div>
              </div>
            </div>

            {/* Live Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] text-slate-500 block font-medium">URLs Crawled</span>
                <span className="text-lg font-extrabold text-slate-900 font-mono">{currentScan?.urlsCrawled || 0}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] text-slate-500 block font-medium">Requests Sent</span>
                <span className="text-lg font-extrabold text-slate-900 font-mono">{currentScan?.requestsSent || 0}</span>
              </div>
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200">
                <span className="text-[11px] text-rose-700 font-bold block">High Alerts</span>
                <span className="text-lg font-extrabold text-rose-600 font-mono">{currentScan?.alertsFound?.high || 0}</span>
              </div>
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                <span className="text-[11px] text-amber-700 font-bold block">Medium Alerts</span>
                <span className="text-lg font-extrabold text-amber-600 font-mono">{currentScan?.alertsFound?.medium || 0}</span>
              </div>
            </div>
          </div>

          {/* High-Contrast Developer Terminal Window */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-md overflow-hidden flex flex-col h-[340px]">
            {/* Terminal Top Window Bar */}
            <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                </div>
                <span className="text-[11px] font-mono text-slate-400 ml-2">
                  OWASP ZAP 2.14 Daemon Telemetry Stream
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setAutoScroll(!autoScroll)}
                  className={`text-[11px] px-2.5 py-0.5 rounded font-mono font-medium transition-colors ${
                    autoScroll ? 'bg-blue-950 text-blue-300 border border-blue-700' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Auto-scroll: {autoScroll ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>

            {/* Terminal Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-1.5 font-mono text-xs text-slate-200">
              {logs.length === 0 ? (
                <div className="text-slate-500 italic py-8 text-center">
                  Menunggu telemetri scanner aktif...
                </div>
              ) : (
                logs.map((log) => {
                  let badgeColor = 'text-cyan-300 bg-cyan-950 border-cyan-800';
                  if (log.level === 'WARN') badgeColor = 'text-amber-300 bg-amber-950 border-amber-800';
                  if (log.level === 'DANGER') badgeColor = 'text-rose-300 bg-rose-950 border-rose-800 font-bold';
                  if (log.level === 'SUCCESS') badgeColor = 'text-emerald-300 bg-emerald-950 border-emerald-800';
                  if (log.level === 'ACTIVE') badgeColor = 'text-blue-300 bg-blue-950 border-blue-800 font-bold';
                  if (log.level === 'SPIDER' || log.level === 'PASSIVE') badgeColor = 'text-sky-300 bg-sky-950 border-sky-800';

                  return (
                    <div key={log.id} className="flex items-start gap-2 leading-relaxed hover:bg-white/[0.04] px-1 rounded">
                      <span className="text-slate-500 text-[11px] shrink-0 select-none">
                        [{new Date(log.timestamp).toLocaleTimeString('id-ID')}]
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded border font-bold shrink-0 ${badgeColor}`}>
                        {log.level}
                      </span>
                      <span className="text-slate-200 break-all">{log.message}</span>
                    </div>
                  );
                })
              )}
              <div ref={terminalEndRef} />
            </div>
          </div>
        </div>
      </div>

      {/* Scan History Table (Clean White Card) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              Riwayat Pemindaian &amp; Audit Log
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Daftar sesi pemindaian ZAP otomatis yang telah diselesaikan
            </p>
          </div>
          <span className="text-xs text-slate-500 font-mono font-medium">
            Total Sesi: {scanHistory.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 uppercase font-mono text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-bold">Waktu Mulai</th>
                <th className="py-3 px-4 font-bold">Target Endpoint</th>
                <th className="py-3 px-4 font-bold">Tipe Pemindaian</th>
                <th className="py-3 px-4 font-bold">Durasi</th>
                <th className="py-3 px-4 font-bold">Crawled / Requests</th>
                <th className="py-3 px-4 font-bold">Temuan Alert</th>
                <th className="py-3 px-4 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-mono">
              {scanHistory.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-slate-400 italic">
                    Belum ada riwayat pemindaian tersimpan.
                  </td>
                </tr>
              ) : (
                scanHistory.map((scan) => (
                  <tr key={scan.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                      {new Date(scan.startTime).toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-4 text-slate-900 font-semibold truncate max-w-xs">
                      {scan.targetUrl}
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-sans text-xs">
                      {scan.scanType}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {scan.duration || 'Running'}
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      {scan.urlsCrawled} / {scan.requestsSent}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold">
                          {scan.alertsFound.high} H
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold">
                          {scan.alertsFound.medium} M
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold">
                          {scan.alertsFound.low} L
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-300">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Completed
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
