import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Square, 
  RefreshCw, 
  Terminal, 
  Globe, 
  ShieldAlert, 
  Search, 
  Zap, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  History,
  Radio,
  Sliders,
  ExternalLink
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

  const terminalEndRef = useRef<HTMLDivElement>(null);

  const isScanning = scannerStatus?.isScanning || false;
  const isContinuous = scannerStatus?.isContinuous || false;
  const currentScan = scannerStatus?.currentScan;

  const targetPresets = [
    { label: 'Portal Utama (republika.co.id)', url: 'https://www.republika.co.id' },
    { label: 'Retizen Warga (retizen.republika.co.id)', url: 'https://retizen.republika.co.id' },
    { label: 'Ihram Haji/Umrah (ihram.republika.co.id)', url: 'https://ihram.republika.co.id' },
    { label: 'Kanal News (news.republika.co.id)', url: 'https://news.republika.co.id' },
    { label: 'API Gateway (api.republika.co.id)', url: 'https://api.republika.co.id' },
  ];

  // Auto scroll terminal to latest
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

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
      {/* Top Banner explaining Continuous Scanner in research context */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
              Autonomous OWASP ZAP Scanner
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            Pusat Pengujian &amp; Pemindaian Berkelanjutan Website Republika
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Sistem menjalankan siklus iteratif otomatis: Spidering (Sprint 1) &rarr; Passive Analysis &amp; Active Payload Injection (Sprint 2) &rarr; Evaluasi OWASP Top 10 (Sprint 3) secara kontinu tanpa intervensi manual.
          </p>
        </div>

        {/* Continuous Toggle Big Widget */}
        <div className="flex items-center gap-4 bg-slate-950 p-3 rounded-xl border border-slate-800">
          <div className="space-y-0.5">
            <div className="text-xs font-semibold text-slate-200">Mode Continuous Scan</div>
            <div className="text-[11px] text-slate-400">
              {isContinuous ? `Looping setiap ${intervalSec}s` : 'Status: Non-aktif'}
            </div>
          </div>
          <button
            onClick={onToggleContinuous}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 shadow-lg ${
              isContinuous
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-emerald-500/20'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isContinuous ? 'animate-spin' : ''}`} />
            <span>{isContinuous ? 'BERJALAN' : 'AKTIFKAN'}</span>
          </button>
        </div>
      </div>

      {/* Control Panel: Target & Scan Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Configuration Form */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            Parameter Pemindaian OWASP ZAP
          </h3>

          {/* Preset Targets */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              Pilih Target Aset Republika:
            </label>
            <div className="space-y-1.5">
              {targetPresets.map((preset) => (
                <button
                  key={preset.url}
                  type="button"
                  onClick={() => {
                    setSelectedTarget(preset.url);
                    setCustomTarget('');
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium border transition-colors flex items-center justify-between ${
                    selectedTarget === preset.url && !customTarget
                      ? 'bg-cyan-950/60 border-cyan-500/50 text-cyan-300'
                      : 'bg-slate-800/40 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="truncate">{preset.label}</span>
                  <Radio className={`w-3.5 h-3.5 ${selectedTarget === preset.url && !customTarget ? 'text-cyan-400' : 'text-slate-600'}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Custom URL Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Atau Input URL Sasaran Spesifik:
            </label>
            <div className="relative">
              <Globe className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="url"
                value={customTarget}
                onChange={(e) => setCustomTarget(e.target.value)}
                placeholder="https://republika.co.id/sub-path..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Scan Type / Depth */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              Profil Pemindaian (Scan Profile):
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="Full Scan (Spider + Passive + Active)">
                Full Scan (Spider + Passive + Active - Rekomendasi TA)
              </option>
              <option value="Spider & Deteksi Arsitektur (Sprint 1)">
                Spidering / Crawling Only (Sprint 1)
              </option>
              <option value="Passive Scanning (Sprint 2)">
                Passive Header &amp; Cookie Analysis (Sprint 2)
              </option>
              <option value="Active Scanning (Sprint 2 - Injeksi)">
                Active Injection Probing (SQLi &amp; XSS) (Sprint 2)
              </option>
            </select>
          </div>

          {/* Continuous Interval Slider */}
          <div className="pt-2 border-t border-slate-800">
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-400">
                Interval Siklus Scan Otomatis:
              </label>
              <span className="text-xs font-mono font-bold text-cyan-400">{intervalSec} Detik</span>
            </div>
            <input
              type="range"
              min="15"
              max="300"
              step="15"
              value={intervalSec}
              onChange={(e) => handleIntervalChange(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>15s (Demo Cepat)</span>
              <span>1 Menit</span>
              <span>5 Menit</span>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            {isScanning ? (
              <button
                onClick={onStopScan}
                className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 transition-all"
              >
                <Square className="w-4 h-4 fill-current" />
                <span>Hentikan Proses Pemindaian</span>
              </button>
            ) : (
              <button
                onClick={handleStart}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/30 transition-all"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Mulai Scan Sekarang</span>
              </button>
            )}
          </div>
        </div>

        {/* Right: Live Scan Execution Console & Progress */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between space-y-4">
          {/* Active Job Header / Phase */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">
                  Console Pemindaian Real-Time (Live OWASP ZAP Execution)
                </h3>
              </div>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                isScanning
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 animate-pulse'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}>
                {isScanning ? 'Scan Sedang Berjalan' : 'Siap / Standby'}
              </span>
            </div>

            {/* Current Phase & Animated Progress */}
            {currentScan ? (
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/90 space-y-2 mb-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">
                    Fase Aktif: <strong className="text-cyan-400">{currentScan.phase}</strong>
                  </span>
                  <span className="font-mono font-bold text-cyan-400">{currentScan.progress}%</span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-teal-400 transition-all duration-300"
                    style={{ width: `${currentScan.progress}%` }}
                  ></div>
                </div>

                <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
                  <span className="truncate max-w-[280px]">URL: {currentScan.currentUrl}</span>
                  <span>Crawled: {currentScan.urlsCrawled} | Req: {currentScan.requestsSent}</span>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/60 text-xs text-slate-400 flex items-center justify-between mb-3">
                <span>Tidak ada pemindaian aktif saat ini. Tekan &quot;Mulai Scan Sekarang&quot; untuk menjalankan ZAP.</span>
                <span className="text-cyan-400 font-mono">Engine: Standby</span>
              </div>
            )}

            {/* Live Real-time Terminal Log Output */}
            <div className="rounded-xl bg-slate-950 border border-slate-800 p-3 h-72 overflow-y-auto font-mono text-xs space-y-1.5 shadow-inner">
              {logs.length === 0 ? (
                <div className="text-slate-600 text-center py-20 italic">
                  Menunggu keluaran log dari OWASP ZAP scanner...
                </div>
              ) : (
                logs.map((log) => {
                  let badgeColor = 'text-slate-400 bg-slate-800';
                  if (log.level === 'SPIDER') badgeColor = 'text-cyan-300 bg-cyan-950 border border-cyan-800';
                  else if (log.level === 'PASSIVE') badgeColor = 'text-blue-300 bg-blue-950 border border-blue-800';
                  else if (log.level === 'ACTIVE') badgeColor = 'text-amber-300 bg-amber-950 border border-amber-800';
                  else if (log.level === 'DANGER') badgeColor = 'text-rose-300 bg-rose-950 border border-rose-800 font-bold';
                  else if (log.level === 'WARN') badgeColor = 'text-yellow-300 bg-yellow-950 border border-yellow-800';
                  else if (log.level === 'SUCCESS') badgeColor = 'text-emerald-300 bg-emerald-950 border border-emerald-800';

                  return (
                    <div key={log.id} className="flex items-start gap-2 leading-relaxed">
                      <span className="text-slate-600 text-[10px] shrink-0">
                        {new Date(log.timestamp).toLocaleTimeString('id-ID')}
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono shrink-0 ${badgeColor}`}>
                        {log.level}
                      </span>
                      <span className={`text-slate-300 break-all ${
                        log.level === 'DANGER' ? 'text-rose-400 font-semibold' :
                        log.level === 'WARN' ? 'text-amber-300' :
                        log.level === 'SUCCESS' ? 'text-emerald-300' : ''
                      }`}>
                        {log.message}
                      </span>
                    </div>
                  );
                })
              )}
              <div ref={terminalEndRef} />
            </div>
          </div>

          {/* Quick Scanner Indicators Footer */}
          <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                OWASP ZAP 2.14 Core Ruleset
              </span>
              <span className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-yellow-400" />
                Active Injection Heuristics
              </span>
            </div>
            <span className="text-slate-400">
              Total Log Terkumpul: <strong className="text-white">{logs.length}</strong> entri
            </span>
          </div>
        </div>
      </div>

      {/* Scan History Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-cyan-400" />
            <h3 className="text-base font-bold text-white">
              Riwayat Pemindaian &amp; Hasil Scan Berkala
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            Total Eksekusi: <strong className="text-white">{scanHistory.length}</strong> Sesi Pemindaian
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800 font-medium">
              <tr>
                <th className="py-2.5 px-3">ID Scan</th>
                <th className="py-2.5 px-3">Target Sasaran</th>
                <th className="py-2.5 px-3">Tipe Pemindaian</th>
                <th className="py-2.5 px-3">Waktu Mulai</th>
                <th className="py-2.5 px-3">Durasi</th>
                <th className="py-2.5 px-3">Crawl &amp; Req</th>
                <th className="py-2.5 px-3">Temuan Kerentanan</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {scanHistory.map((scan) => (
                <tr key={scan.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-3 font-mono font-medium text-cyan-400">{scan.id}</td>
                  <td className="py-3 px-3 font-mono text-slate-300">{scan.targetUrl}</td>
                  <td className="py-3 px-3 text-slate-300">{scan.scanType}</td>
                  <td className="py-3 px-3 text-slate-400">
                    {new Date(scan.startTime).toLocaleString('id-ID')}
                  </td>
                  <td className="py-3 px-3 text-slate-300 font-mono">{scan.duration || 'Running'}</td>
                  <td className="py-3 px-3 text-slate-400 font-mono">
                    {scan.urlsCrawled} URLs / {scan.requestsSent} Req
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5 font-mono">
                      {scan.alertsFound.high > 0 && (
                        <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold">
                          {scan.alertsFound.high} H
                        </span>
                      )}
                      {scan.alertsFound.medium > 0 && (
                        <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold">
                          {scan.alertsFound.medium} M
                        </span>
                      )}
                      {scan.alertsFound.low > 0 && (
                        <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400">
                          {scan.alertsFound.low} L
                        </span>
                      )}
                      <span className="text-slate-400">({scan.alertsFound.total} total)</span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {scan.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
