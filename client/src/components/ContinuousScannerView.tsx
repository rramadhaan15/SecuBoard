import React, { useState, useRef, useEffect } from 'react';
import { 
  Terminal, 
  Play, 
  Square, 
  RefreshCw, 
  Sliders, 
  Globe, 
  ShieldAlert, 
  Trash2, 
  CheckCircle2, 
  ArrowDown, 
  Layers, 
  Wifi, 
  Activity, 
  Flame, 
  AlertTriangle, 
  Info,
  Clock
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
      <div className="relative overflow-hidden rounded-2xl bg-[#0c1322] border border-[#17233d] p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
              Autonomous OWASP ZAP Scanner Engine
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            Pusat Pengujian &amp; Pemindaian Berkelanjutan Website Republika
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Sistem menjalankan siklus pengujian: Spidering (Sprint 1) &rarr; Passive Analysis &amp; Active Payload Injection (Sprint 2) &rarr; Evaluasi OWASP Top 10 (Sprint 3) secara kontinu tanpa jeda manual.
          </p>
        </div>

        {/* Continuous Toggle Widget */}
        <div className="flex items-center gap-4 bg-[#080c14] p-4 rounded-xl border border-[#17233d] shadow-lg shrink-0">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <RefreshCw className={`w-3.5 h-3.5 ${isContinuous ? 'text-emerald-400 animate-spin' : 'text-slate-400'}`} />
              <span className="text-xs font-bold text-white">Mode Continuous Scan</span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              {isContinuous ? `Looping setiap ${intervalSec} detik` : 'Status: Non-aktif'}
            </div>
          </div>
          <button
            onClick={onToggleContinuous}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 ${
              isContinuous
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950'
                : 'bg-[#17233d] hover:bg-[#1e2f52] text-slate-300 border border-[#253a63]'
            }`}
          >
            {isContinuous ? 'AKTIF' : 'AKTIFKAN'}
          </button>
        </div>
      </div>

      {/* Control Panel & Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Configuration Form */}
        <div className="bg-[#0c1322] border border-[#17233d] rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-[#17233d]">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h3 className="text-base font-bold text-white">
              Parameter Pemindaian ZAP
            </h3>
          </div>

          {/* Preset Targets */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
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
                        ? 'bg-cyan-950/40 border-cyan-500/70 text-cyan-300 shadow-sm shadow-cyan-950'
                        : 'bg-[#080c14] border-[#17233d] text-slate-300 hover:border-[#1e2f52] hover:bg-[#111a2e]'
                    }`}
                  >
                    <div className="flex items-center justify-between font-semibold">
                      <span className="text-white">{preset.label}</span>
                      <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-cyan-400' : 'bg-slate-600'}`}></span>
                    </div>
                    <span className="text-[11px] text-slate-400 mt-0.5 font-mono">{preset.url}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom URL Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
              Atau Custom Endpoint:
            </label>
            <div className="relative">
              <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={customTarget}
                onChange={(e) => setCustomTarget(e.target.value)}
                placeholder="https://www.republika.co.id/path"
                className="w-full bg-[#080c14] border border-[#17233d] rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
          </div>

          {/* Scan Type */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
              Profil Pemindaian:
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-[#080c14] border border-[#17233d] rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
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
          <div className="space-y-2 pt-2 border-t border-[#17233d]">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-400 uppercase tracking-wider">Interval Continuous:</span>
              <span className="font-mono font-bold text-cyan-400">{intervalSec} Detik</span>
            </div>
            <div className="flex gap-2">
              {[30, 45, 60, 120].map((sec) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => handleIntervalChange(sec)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                    intervalSec === sec
                      ? 'bg-cyan-600 text-white font-bold shadow-sm shadow-cyan-950'
                      : 'bg-[#080c14] border border-[#17233d] text-slate-400 hover:text-white'
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
                className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-950 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Square className="w-4 h-4 fill-current" />
                <span>Hentikan Pemindaian Aktif</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleStart}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-950 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-95"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Jalankan Pemindaian Sekarang</span>
              </button>
            )}
          </div>
        </div>

        {/* Right: Telemetry & Live Terminal Console */}
        <div className="lg:col-span-2 space-y-4">
          {/* Active Scan Telemetry Card */}
          <div className="bg-[#0c1322] border border-[#17233d] rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#17233d]">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${isScanning ? 'bg-cyan-400 animate-ping' : 'bg-slate-600'}`}></span>
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  {isScanning ? 'Pemindaian Sedang Berjalan (Active)' : 'Engine Status: Siaga (Idle)'}
                </span>
              </div>
              <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2.5 py-0.5 rounded border border-cyan-800">
                Phase: {currentScan?.phase || (isScanning ? 'Initializing ZAP' : 'Standby')}
              </span>
            </div>

            {/* Target & Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-mono truncate max-w-md">
                  Target: <strong className="text-white">{currentScan?.targetUrl || selectedTarget}</strong>
                </span>
                <span className="font-mono font-bold text-cyan-400 text-sm">
                  {currentScan?.progress || 0}%
                </span>
              </div>

              {/* Progress Bar with Cyan Glow */}
              <div className="w-full h-2 rounded-full bg-[#080c14] overflow-hidden border border-[#17233d]">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300 relative"
                  style={{ width: `${currentScan?.progress || 0}%` }}
                >
                  {isScanning && (
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  )}
                </div>
              </div>
            </div>

            {/* Live Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-[#080c14] border border-[#17233d]">
                <span className="text-[11px] text-slate-400 block">URLs Crawled</span>
                <span className="text-lg font-bold text-white font-mono">{currentScan?.urlsCrawled || 0}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#080c14] border border-[#17233d]">
                <span className="text-[11px] text-slate-400 block">Requests Sent</span>
                <span className="text-lg font-bold text-white font-mono">{currentScan?.requestsSent || 0}</span>
              </div>
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-900/60">
                <span className="text-[11px] text-rose-400 font-semibold block">High Alerts</span>
                <span className="text-lg font-bold text-rose-300 font-mono">{currentScan?.alertsFound?.high || 0}</span>
              </div>
              <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-900/60">
                <span className="text-[11px] text-amber-400 font-semibold block">Medium Alerts</span>
                <span className="text-lg font-bold text-amber-300 font-mono">{currentScan?.alertsFound?.medium || 0}</span>
              </div>
            </div>
          </div>

          {/* Terminal Window */}
          <div className="bg-[#050811] border border-[#17233d] rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[340px]">
            {/* Terminal Top Window Bar */}
            <div className="px-4 py-2.5 bg-[#090d1a] border-b border-[#17233d] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
                </div>
                <span className="text-[11px] font-mono text-slate-400 ml-2">
                  OWASP ZAP 2.14 Daemon Telemetry Stream
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setAutoScroll(!autoScroll)}
                  className={`text-[11px] px-2 py-0.5 rounded font-mono transition-colors ${
                    autoScroll ? 'bg-cyan-950 text-cyan-400 border border-cyan-800' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Auto-scroll: {autoScroll ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>

            {/* Terminal Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-1.5 font-mono text-xs text-slate-300">
              {logs.length === 0 ? (
                <div className="text-slate-500 italic py-8 text-center">
                  Menunggu telemetri scanner aktif...
                </div>
              ) : (
                logs.map((log) => {
                  let badgeColor = 'text-cyan-400 bg-cyan-950/70 border-cyan-800';
                  if (log.level === 'WARN') badgeColor = 'text-amber-400 bg-amber-950/70 border-amber-800';
                  if (log.level === 'DANGER') badgeColor = 'text-rose-400 bg-rose-950/70 border-rose-800 font-bold';
                  if (log.level === 'SUCCESS') badgeColor = 'text-emerald-400 bg-emerald-950/70 border-emerald-800';
                  if (log.level === 'ACTIVE') badgeColor = 'text-cyan-400 bg-cyan-950/70 border-cyan-800 font-bold';
                  if (log.level === 'SPIDER' || log.level === 'PASSIVE') badgeColor = 'text-sky-300 bg-sky-950/70 border-sky-800';

                  return (
                    <div key={log.id} className="flex items-start gap-2 leading-relaxed hover:bg-white/[0.02] px-1 rounded">
                      <span className="text-slate-500 text-[11px] shrink-0 select-none">
                        [{new Date(log.timestamp).toLocaleTimeString('id-ID')}]
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded border font-bold shrink-0 ${badgeColor}`}>
                        {log.level}
                      </span>
                      <span className="text-slate-300 break-all">{log.message}</span>
                    </div>
                  );
                })
              )}
              <div ref={terminalEndRef} />
            </div>
          </div>
        </div>
      </div>

      {/* Scan History Table */}
      <div className="bg-[#0c1322] border border-[#17233d] rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#17233d]">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              Riwayat Pemindaian &amp; Audit Log
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Daftar sesi pemindaian ZAP otomatis yang telah diselesaikan
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Total Sesi: {scanHistory.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#080c14] text-slate-400 uppercase font-mono text-[11px] border-b border-[#17233d]">
              <tr>
                <th className="py-3 px-4">Waktu Mulai</th>
                <th className="py-3 px-4">Target Endpoint</th>
                <th className="py-3 px-4">Tipe Pemindaian</th>
                <th className="py-3 px-4">Durasi</th>
                <th className="py-3 px-4">Crawled / Requests</th>
                <th className="py-3 px-4">Temuan Alert</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#17233d] text-slate-300 font-mono">
              {scanHistory.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-slate-500 italic">
                    Belum ada riwayat pemindaian tersimpan.
                  </td>
                </tr>
              ) : (
                scanHistory.map((scan) => (
                  <tr key={scan.id} className="hover:bg-[#111a2e]/60 transition-colors">
                    <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                      {new Date(scan.startTime).toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-4 text-white font-medium truncate max-w-xs">
                      {scan.targetUrl}
                    </td>
                    <td className="py-3 px-4 text-slate-300 font-sans text-xs">
                      {scan.scanType}
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {scan.duration || 'Running'}
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {scan.urlsCrawled} / {scan.requestsSent}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 text-[10px] font-bold">
                          {scan.alertsFound.high} H
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-bold">
                          {scan.alertsFound.medium} M
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-bold">
                          {scan.alertsFound.low} L
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
                        <CheckCircle2 className="w-3 h-3" />
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
