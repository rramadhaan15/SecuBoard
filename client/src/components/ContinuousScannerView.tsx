import React, { useState, useRef, useEffect } from 'react';
import { Play, Square, RefreshCw } from 'lucide-react';
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
      {/* Header Bar */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
              Autonomous Scanner Engine
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Pemindaian Kerentanan Berkelanjutan
          </h2>
          <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
            Menjalankan siklus pengujian Spidering (Sprint 1), Passive Analysis &amp; Active Injections (Sprint 2), serta Evaluasi OWASP Top 10 (Sprint 3) secara otomatis pada domain republika.co.id.
          </p>
        </div>

        {/* Continuous Toggle Widget */}
        <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 shrink-0">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isContinuous ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></span>
              <span className="text-sm font-bold text-slate-900">Continuous Scan</span>
            </div>
            <div className="text-xs text-slate-500 font-mono">
              {isContinuous ? `Looping setiap ${intervalSec} detik` : 'Mode: Manual'}
            </div>
          </div>
          <button
            onClick={onToggleContinuous}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-xs ${
              isContinuous
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'
            }`}
          >
            {isContinuous ? 'Aktif' : 'Aktifkan'}
          </button>
        </div>
      </div>

      {/* Control Panel & Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Configuration Form */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs space-y-5">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">
              Parameter Pemindaian
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Konfigurasi target URL dan profil pengujian</p>
          </div>

          {/* Preset Targets */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Pilih Target Asset Republika
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
                    className={`w-full text-left p-3 rounded-lg border transition-all text-xs flex flex-col justify-between ${
                      isSelected
                        ? 'bg-blue-50/80 border-blue-500 text-blue-900 shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span className={isSelected ? 'text-blue-900' : 'text-slate-900'}>{preset.label}</span>
                      <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-blue-600' : 'bg-slate-300'}`}></span>
                    </div>
                    <span className="text-xs text-slate-500 mt-1 font-mono">{preset.url}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom URL Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Atau Endpoint Kustom
            </label>
            <input
              type="text"
              value={customTarget}
              onChange={(e) => setCustomTarget(e.target.value)}
              placeholder="https://www.republika.co.id/endpoint"
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-mono shadow-xs"
            />
          </div>

          {/* Scan Type */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Profil Pemindaian
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 shadow-xs font-medium"
            >
              <option value="Full Scan (Spider + Passive + Active)">
                Full Scan (Spider + Passive Analysis + Active Injections)
              </option>
              <option value="Passive Scan (Header & Traffic Inspection)">
                Passive Audit (Headers, Cookies, Sensitive Data)
              </option>
              <option value="Active Injection Scan (SQLi & XSS Only)">
                Active Injection (SQLi, XSS, Path Traversal)
              </option>
            </select>
          </div>

          {/* Interval Configuration */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700 uppercase tracking-wider">Interval Continuous:</span>
              <span className="font-mono font-bold text-blue-700 text-sm">{intervalSec}s</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[30, 45, 60, 120].map((sec) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => handleIntervalChange(sec)}
                  className={`py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
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
                className="w-full py-2.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-2 transition-all"
              >
                <Square className="w-4 h-4 fill-current" />
                <span>Hentikan Pemindaian</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleStart}
                className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-2 transition-all"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Jalankan Pemindaian</span>
              </button>
            )}
          </div>
        </div>

        {/* Right: Telemetry & Terminal Console */}
        <div className="lg:col-span-2 space-y-4">
          {/* Active Scan Status Card */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${isScanning ? 'bg-blue-600 animate-ping' : 'bg-slate-300'}`}></span>
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  {isScanning ? 'Pemindaian Sedang Berjalan' : 'Status Engine: Siaga (Idle)'}
                </span>
              </div>
              <span className="text-xs font-mono text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200 font-bold">
                Fase: {currentScan?.phase || (isScanning ? 'Inisialisasi ZAP' : 'Standby')}
              </span>
            </div>

            {/* Target & Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600 font-mono truncate max-w-md">
                  Target: <strong className="text-slate-900">{currentScan?.targetUrl || selectedTarget}</strong>
                </span>
                <span className="font-mono font-bold text-blue-700 text-sm">
                  {currentScan?.progress || 0}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                <div
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${currentScan?.progress || 0}%` }}
                ></div>
              </div>
            </div>

            {/* Live Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 block font-medium">URLs Crawled</span>
                <span className="text-lg font-bold text-slate-900 font-mono">{currentScan?.urlsCrawled || 0}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 block font-medium">Requests Sent</span>
                <span className="text-lg font-bold text-slate-900 font-mono">{currentScan?.requestsSent || 0}</span>
              </div>
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200">
                <span className="text-xs text-rose-700 font-bold block">High Alerts</span>
                <span className="text-lg font-bold text-rose-600 font-mono">{currentScan?.alertsFound?.high || 0}</span>
              </div>
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                <span className="text-xs text-amber-700 font-bold block">Medium Alerts</span>
                <span className="text-lg font-bold text-amber-600 font-mono">{currentScan?.alertsFound?.medium || 0}</span>
              </div>
            </div>
          </div>

          {/* High-Contrast Developer Terminal Window */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl shadow-xs overflow-hidden flex flex-col h-[360px]">
            {/* Terminal Window Header */}
            <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-700"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-700"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-700"></span>
                </div>
                <span className="text-xs font-mono text-slate-400 ml-2">
                  Console Telemetri OWASP ZAP 2.14
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setAutoScroll(!autoScroll)}
                  className={`text-xs px-2.5 py-0.5 rounded font-mono font-medium transition-colors ${
                    autoScroll ? 'bg-slate-800 text-slate-200 border border-slate-700' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Auto-scroll: {autoScroll ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>

            {/* Terminal Body: Highly readable monospaced logs */}
            <div className="flex-1 p-4 overflow-y-auto space-y-1.5 font-mono text-xs text-slate-100 leading-relaxed">
              {logs.length === 0 ? (
                <div className="text-slate-500 italic py-10 text-center">
                  Menunggu telemetri scanner aktif...
                </div>
              ) : (
                logs.map((log) => {
                  let badgeColor = 'text-cyan-300 bg-cyan-950/90 border-cyan-800';
                  if (log.level === 'WARN') badgeColor = 'text-amber-300 bg-amber-950/90 border-amber-800';
                  if (log.level === 'DANGER') badgeColor = 'text-rose-300 bg-rose-950/90 border-rose-800 font-bold';
                  if (log.level === 'SUCCESS') badgeColor = 'text-emerald-300 bg-emerald-950/90 border-emerald-800';
                  if (log.level === 'ACTIVE') badgeColor = 'text-blue-300 bg-blue-950/90 border-blue-800 font-bold';
                  if (log.level === 'SPIDER' || log.level === 'PASSIVE') badgeColor = 'text-sky-300 bg-sky-950/90 border-sky-800';

                  return (
                    <div key={log.id} className="flex items-start gap-2.5 hover:bg-white/[0.04] px-1.5 py-0.5 rounded">
                      <span className="text-slate-400 text-xs shrink-0 select-none">
                        [{new Date(log.timestamp).toLocaleTimeString('id-ID')}]
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded border font-semibold shrink-0 ${badgeColor}`}>
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

      {/* Scan History Table: High Contrast & Comfortable Padding */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Riwayat Pemindaian &amp; Sesi Audit
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Daftar sesi pengujian ZAP yang telah diselesaikan
            </p>
          </div>
          <span className="text-xs text-slate-600 font-mono font-semibold bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
            Total: {scanHistory.length} Sesi
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
                  <td colSpan={7} className="py-8 text-center text-slate-400 italic">
                    Belum ada riwayat pemindaian tersimpan.
                  </td>
                </tr>
              ) : (
                scanHistory.map((scan) => (
                  <tr key={scan.id} className="hover:bg-slate-50/80 transition-colors">
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
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-bold">
                          {scan.alertsFound.low} L
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Selesai
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
