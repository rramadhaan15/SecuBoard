import React, { useState } from 'react';
import { 
  X, 
  Zap, 
  CheckCircle2, 
  AlertCircle, 
  Terminal
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
        setTestResult({ success: true, message: 'Koneksi ke OWASP ZAP daemon berhasil terhubung!' });
      } else {
        setTestResult({
          success: false,
          message: 'OWASP ZAP daemon belum aktif di port tersebut. Sistem beroperasi penuh menggunakan Integrated Autonomous Scanner Engine.',
        });
      }
    } catch {
      setTestResult({
        success: false,
        message: 'Gagal terhubung. Menggunakan mode autonomous engine bawaan.',
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div 
        className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full shadow-2xl p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">
              Konfigurasi OWASP ZAP Daemon
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Status */}
        <div className={`p-4 rounded-xl border text-xs space-y-1.5 ${
          config.connected 
            ? 'bg-emerald-50 border-emerald-300 text-emerald-800' 
            : 'bg-slate-50 border-slate-200 text-slate-700'
        }`}>
          <div className="font-bold text-slate-900 flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${config.connected ? 'bg-emerald-500' : 'bg-blue-600'}`}></span>
            <span>Gateway: {config.connected ? 'Terhubung ke OWASP ZAP Daemon' : 'Autonomous Engine Bawaan Aktif'}</span>
          </div>
          <p className="text-slate-500 leading-relaxed text-[11px]">
            {config.connected
              ? `Versi ZAP: ${config.version} (Port ${config.port})`
              : 'Dashboard dapat berjalan mandiri menggunakan built-in autonomous engine atau dihubungkan ke aplikasi desktop OWASP ZAP via REST API.'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-1.5">
              Host / IP Address:
            </label>
            <input
              type="text"
              value={host}
              onChange={(e) => setHost(e.target.value)}
              placeholder="127.0.0.1"
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-blue-500 font-mono shadow-xs"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-1.5">
              Port ZAP Proxy:
            </label>
            <input
              type="number"
              value={port}
              onChange={(e) => setPort(Number(e.target.value))}
              placeholder="8080"
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-blue-500 font-mono shadow-xs"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-1.5">
              ZAP API Key (Opsional):
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Kosongkan jika API key dinonaktifkan di ZAP Options"
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-blue-500 font-mono shadow-xs"
            />
          </div>

          {testResult && (
            <div className={`p-3 rounded-xl border text-xs flex items-start gap-2 ${
              testResult.success 
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800' 
                : 'bg-amber-50 border-amber-300 text-amber-800'
            }`}>
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              )}
              <span className="leading-relaxed font-medium">{testResult.message}</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleTest}
              disabled={isTesting}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors border border-slate-300 shadow-2xs"
            >
              {isTesting ? 'Menguji...' : 'Uji Koneksi'}
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold shadow-2xs"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-95"
              >
                Simpan Konfigurasi
              </button>
            </div>
          </div>
        </form>

        <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 space-y-1.5">
          <p className="font-bold text-slate-700 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-blue-600" />
            Panduan Menjalankan OWASP ZAP (Windows):
          </p>
          <code className="block bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-emerald-400 font-mono text-[10px]">
            zap.bat -daemon -port 8080 -config api.disablekey=true
          </code>
        </div>
      </div>
    </div>
  );
};
