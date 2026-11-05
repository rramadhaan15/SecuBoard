import React, { useState, useRef, useEffect } from 'react';
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

  // Auto scroll terminal to bottom
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
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sky-400"></span>
            <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
              Autonomous OWASP ZAP Scanner
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
            Pusat Pengujian &amp; Pemindaian Berkelanjutan Website Republika
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Sistem menjalankan siklus pengujian: Spidering (Sprint 1) &rarr; Passive Analysis &amp; Active Payload Injection (Sprint 2) &rarr; Evaluasi OWASP Top 10 (Sprint 3) secara kontinu tanpa intervensi manual.
          </p>
        </div>

        {/* Continuous Toggle Widget */}
        <div className="flex items-center gap-4 bg-slate-950 p-3 rounded-lg border border-slate-800 shrink-0">
          <div className="space-y-0.5">
            <div className="text-xs font-semibold text-slate-200">Mode Continuous Scan</div>
            <div className="text-[11px] text-slate-400">
              {isContinuous ? `Looping setiap ${intervalSec}s` : 'Status: Non-aktif'}
            </div>
          </div>
          <button
            onClick={onToggleContinuous}
            className={`px-4 py-2 rounded-md text-xs font-semibold transition-all ${
              isContinuous
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            {isContinuous ? 'BERJALAN' : 'AKTIFKAN'}
          </button>
        </div>
      </div>

      {/* Control Panel & Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Configuration Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-white">
            Parameter Pemindaian OWASP ZAP
          </h3>

          {/* Preset Targets */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              Target Aset Republika:
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
                  className={`w-full text-left px-3 py-2 rounded-md text-xs font-medium border transition-colors flex items-center justify-between ${
                    selectedTarget === preset.url && !customTarget
                      ? 'bg-sky-950/60 border-sky-500/50 text-sky-300'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="truncate">{preset.label}</span>
                  <span className={`w-2 h-2 rounded-full ${selectedTarget === preset.url && !customTarget ? 'bg-sky-400' : 'bg-slate-700'}`}></span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom URL Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Atau Input URL Sasaran Spesifik:
            </label>
            <input
              type="url"
              value={customTarget}
              onChange={(e) => setCustomTarget(e.target.value)}
              placeholder="https://republika.co.id/sub-path..."
              className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Scan Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              Profil Pemindaian (Scan Profile):
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
            >
              <option value="Full Scan (Spider + Passive + Active)">
                Full Scan (Spider + Passive + Active - Standar TA)
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
                Interval Siklus Otomatis:
              </label>
              <span className="text-xs font-mono font-bold text-sky-400">{intervalSec} Detik</span>
            </div>
            <input
              type="range"
              min="15"
              max="300"
              step="15"
              value={intervalSec}
              onChange={(e) => handleIntervalChange(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>15s (Cepat)</span>
              <span>1 Menit</span>
              <span>5 Menit</span>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            {isScanning ? (
              <button
                onClick={onStopScan}
                className="w-full py-2 rounded-md bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shadow-sm transition-all"
              >
                Hentikan Proses Pemindaian
              </button>
            ) : (
              <button
                onClick={handleStart}
                className="w-full py-2 rounded-md bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs shadow-sm transition-all"
              >
                Mulai Scan Sekarang
              </button>
            )}
          </div>
        </div>

        {/* Right: Live Console */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white">
                Console Pemindaian Real-Time (Live OWASP ZAP Execution)
              </h3>
              <span className={`text-[11px] px-2.5 py-0.5 rounded font-mono font-semibold ${
                isScanning
                  ? 'bg-sky-950 text-sky-400 border border-sky-800'
                  : 'bg-slate-800 text-slate-400'
              }`}>
                {isScanning ? 'SCANNING' : 'STANDBY'}
              </span>
            </div>

            {/* Current Phase & Progress */}
            {currentScan ? (
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2 mb-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">
                    Fase: <strong className="text-sky-400">{currentScan.phase}</strong>
                  </span>
                  <span className="font-mono font-bold text-sky-400">{currentScan.progress}%</span>
                </div>

                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div 
                    className="h-full bg-sky-500 transition-all duration-300"
                    style={{ width: `${currentScan.progress}%` }}
                  ></div>
                </div>

                <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 font-mono pt-0.5">
                  <span className="truncate max-w-[280px]">URL: {currentScan.currentUrl}</span>
                  <span>Crawled: {currentScan.urlsCrawled} | Req: {currentScan.requestsSent}</span>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-center justify-between mb-3">
                <span>Tidak ada pemindaian aktif saat ini. Tekan &quot;Mulai Scan Sekarang&quot; untuk menjalankan scanner.</span>
                <span className="text-slate-500 font-mono">Engine: Standby</span>
              </div>
            )}

            {/* Live Terminal */}
            <div className="rounded-lg bg-slate-950 border border-slate-800 p-3 h-72 overflow-y-auto font-mono text-xs space-y-1.5">
              {logs.length === 0 ? (
                <div className="text-slate-600 text-center py-20 italic">
                  Menunggu keluaran log dari OWASP ZAP scanner...
                </div>
              ) : (
                logs.map((log) => {
                  let badgeColor = 'text-slate-400 bg-slate-800';
                  if (log.level === 'SPIDER') badgeColor = 'text-sky-300 bg-sky-950 border border-sky-800';
                  else if (log.level === 'PASSIVE') badgeColor = 'text-blue-300 bg-blue-950 border border-blue-800';
                  else if (log.level === 'ACTIVE') badgeColor = 'text-amber-300 bg-amber-950 border border-amber-800';
                  else if (log.level === 'DANGER') badgeColor = 'text-rose-300 bg-rose-950 border border-rose-800 font-bold';
                  else if (log.level === 'WARN') badgeColor = 'text-amber-300 bg-amber-950 border border-amber-800';
                  else if (log.level === 'SUCCESS') badgeColor = 'text-emerald-300 bg-emerald-950 border border-emerald-800';

                  return (
                    <div key={log.id} className="flex items-start gap-2 leading-relaxed">
                      <span className="text-slate-600 text-[10px] shrink-0">
                        {new Date(log.timestamp).toLocaleTimeString('id-ID')}
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono shrink-0 ${badgeColor}`}>
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

          {/* Footer */}
          <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
            <div>
              Aturan Inti: OWASP ZAP Core Ruleset &bull; Passive &amp; Active Heuristics
            </div>
            <span>
              Total Log: <strong className="text-white font-mono">{logs.length}</strong> entri
            </span>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">
            Riwayat Pemindaian &amp; Hasil Scan Berkala
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            Total Sesi: {scanHistory.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-semibold">
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
                  <td className="py-2.5 px-3 font-mono font-medium text-sky-400">{scan.id}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-300">{scan.targetUrl}</td>
                  <td className="py-2.5 px-3 text-slate-300">{scan.scanType}</td>
                  <td className="py-2.5 px-3 text-slate-400">
                    {new Date(scan.startTime).toLocaleString('id-ID')}
                  </td>
                  <td className="py-2.5 px-3 text-slate-300 font-mono">{scan.duration || 'Running'}</td>
                  <td className="py-2.5 px-3 text-slate-400 font-mono">
                    {scan.urlsCrawled} URLs / {scan.requestsSent} Req
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-1.5 font-mono">
                      {scan.alertsFound.high > 0 && (
                        <span className="px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 font-bold">
                          {scan.alertsFound.high} H
                        </span>
                      )}
                      {scan.alertsFound.medium > 0 && (
                        <span className="px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-bold">
                          {scan.alertsFound.medium} M
                        </span>
                      )}
                      {scan.alertsFound.low > 0 && (
                        <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                          {scan.alertsFound.low} L
                        </span>
                      )}
                      <span className="text-slate-400">({scan.alertsFound.total} total)</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
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
