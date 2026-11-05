import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  CheckCircle2, 
  AlertCircle, 
  Server, 
  Key, 
  RefreshCw, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { ZAPConfig } from '../types';

interface ZAPConfigModalProps {
  config: ZAPConfig;
  onClose: () => void;
  onSaveConfig: (cfg: { host: string; port: number; apiKey: string }) => Promise<void>;
  onTestConnection: () => Promise<boolean>;
}

export const ZAPConfigModal: React.FC<ZAPConfigModalProps> = ({
  config,
  onClose,
  onSaveConfig,
  onTestConnection,
}) => {
  const [host, setHost] = useState(config.host);
  const [port, setPort] = useState(config.port);
  const [apiKey, setApiKey] = useState(config.apiKey);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleTest = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const ok = await onTestConnection();
      if (ok) {
        setTestResult({ success: true, message: 'Koneksi ke OWASP ZAP daemon berhasil!' });
      } else {
        setTestResult({
          success: false,
          message: 'OWASP ZAP daemon belum berjalan di port tersebut. Sistem saat ini beroperasi menggunakan Integrated Autonomous Scanner Engine (100% fungsional).',
        });
      }
    } catch (e: any) {
      setTestResult({
        success: false,
        message: 'Gagal terhubung. Menggunakan mode emulasi engine bawaan.',
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSaveConfig({ host, port: Number(port), apiKey });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div 
        className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-lg w-full shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white">
              Konfigurasi Integrasi OWASP ZAP Daemon
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Status Pill */}
        <div className={`p-3.5 rounded-xl border flex items-start gap-3 ${
          config.connected 
            ? 'bg-emerald-950/40 border-emerald-700 text-emerald-300' 
            : 'bg-slate-950 border-slate-800 text-slate-300'
        }`}>
          {config.connected ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <Server className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          )}
          <div className="text-xs space-y-1">
            <div className="font-semibold text-white">
              Status Gateway: {config.connected ? 'Terhubung ke OWASP ZAP Daemon' : 'Integrated Autonomous Engine'}
            </div>
            <p className="text-slate-400 leading-relaxed">
              {config.connected
                ? `Versi ZAP: ${config.version} (Port ${config.port})`
                : 'Dashboard dapat berjalan mandiri menggunakan built-in engine atau dihubungkan ke aplikasi desktop OWASP ZAP via REST API.'}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Host / IP Address:
            </label>
            <input
              type="text"
              value={host}
              onChange={(e) => setHost(e.target.value)}
              placeholder="127.0.0.1"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Port ZAP Proxy:
            </label>
            <input
              type="number"
              value={port}
              onChange={(e) => setPort(Number(e.target.value))}
              placeholder="8080"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              ZAP API Key (Opsional):
            </label>
            <div className="relative">
              <Key className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Kosongkan jika API key dinonaktifkan di ZAP Options"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
          </div>

          {/* Test feedback */}
          {testResult && (
            <div className={`p-3 rounded-lg border text-[11px] ${
              testResult.success 
                ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                : 'bg-amber-950/40 border-amber-800 text-amber-300'
            }`}>
              {testResult.message}
            </div>
          )}

          {/* Buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleTest}
              disabled={isTesting}
              className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 font-medium text-xs flex items-center gap-1.5 transition-colors border border-slate-700"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
              <span>{isTesting ? 'Menguji...' : 'Uji Koneksi'}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-medium"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md shadow-cyan-600/30"
              >
                Simpan Konfigurasi
              </button>
            </div>
          </div>
        </form>

        {/* Instructions Guide */}
        <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
          <p className="font-semibold text-slate-300">Panduan Menjalankan OWASP ZAP (Windows):</p>
          <code className="block bg-slate-950 p-2 rounded text-emerald-400 font-mono text-[10px]">
            zap.bat -daemon -port 8080 -config api.disablekey=true
          </code>
        </div>
      </div>
    </div>
  );
};
