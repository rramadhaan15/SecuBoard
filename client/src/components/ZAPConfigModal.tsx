import React, { useState } from 'react';
import { X } from 'lucide-react';
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
        setTestResult({ success: true, message: 'Koneksi ke OWASP ZAP daemon berhasil terhubung.' });
      } else {
        setTestResult({
          success: false,
          message: 'OWASP ZAP daemon belum terdeteksi di port tersebut. Sistem tetap beroperasi menggunakan autonomous engine bawaan.',
        });
      }
    } catch {
      setTestResult({
        success: false,
        message: 'Gagal menghubungi service. Pastikan OWASP ZAP aktif.',
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div 
        className="bg-white border border-slate-200 rounded-xl max-w-lg w-full shadow-xl p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Konfigurasi OWASP ZAP Daemon
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Pengaturan koneksi REST API proxy daemon</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Status */}
        <div className={`p-3.5 rounded-lg border text-xs space-y-1.5 ${
          config.connected 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
            : 'bg-slate-50 border-slate-200 text-slate-700'
        }`}>
          <div className="font-semibold text-slate-900 flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${config.connected ? 'bg-emerald-500' : 'bg-blue-600'}`}></span>
            <span>Status: {config.connected ? 'Terhubung ke OWASP ZAP Daemon' : 'Autonomous Engine Bawaan Aktif'}</span>
          </div>
          <p className="text-slate-500 leading-relaxed text-[11px]">
            {config.connected
              ? `Versi ZAP: ${config.version} (Port ${config.port})`
              : 'Dashboard dapat berjalan mandiri menggunakan autonomous engine bawaan atau dikoneksikan ke desktop ZAP via port 8080.'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 uppercase tracking-wider text-[11px] mb-1.5">
              Host / IP Address:
            </label>
            <input
              type="text"
              value={host}
              onChange={(e) => setHost(e.target.value)}
              placeholder="127.0.0.1"
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500 font-mono shadow-xs"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 uppercase tracking-wider text-[11px] mb-1.5">
              Port ZAP Proxy:
            </label>
            <input
              type="number"
              value={port}
              onChange={(e) => setPort(Number(e.target.value))}
              placeholder="8080"
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500 font-mono shadow-xs"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 uppercase tracking-wider text-[11px] mb-1.5">
              ZAP API Key (Opsional):
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Kosongkan jika API key dinonaktifkan di ZAP Options"
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500 font-mono shadow-xs"
            />
          </div>

          {testResult && (
            <div className={`p-3 rounded-lg border text-xs flex items-start gap-2 ${
              testResult.success 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                : 'bg-amber-50 border-amber-200 text-amber-800'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 mt-1.5 ${testResult.success ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
              <span className="leading-relaxed font-medium">{testResult.message}</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleTest}
              disabled={isTesting}
              className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors border border-slate-200 shadow-xs"
            >
              {isTesting ? 'Menguji...' : 'Uji Koneksi'}
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-medium"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-all"
              >
                Simpan
              </button>
            </div>
          </div>
        </form>

        <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 space-y-1.5">
          <p className="font-semibold text-slate-700">
            Panduan Menjalankan ZAP via CLI:
          </p>
          <code className="block bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-emerald-400 font-mono text-[10px]">
            zap.bat -daemon -port 8080 -config api.disablekey=true
          </code>
        </div>
      </div>
    </div>
  );
};
