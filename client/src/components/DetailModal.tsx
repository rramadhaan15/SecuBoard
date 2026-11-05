import React, { useState } from 'react';
import { 
  X, 
  ShieldAlert, 
  AlertTriangle, 
  Info, 
  Copy, 
  Check, 
  ExternalLink, 
  Lock, 
  Terminal, 
  Code, 
  CheckCircle2, 
  Sparkles, 
  Flame,
  UserCheck
} from 'lucide-react';
import { Vulnerability, Status } from '../types';

interface DetailModalProps {
  vulnerability: Vulnerability | null;
  onClose: () => void;
  onUpdateStatus: (id: string, updates: Partial<Vulnerability>) => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({
  vulnerability,
  onClose,
  onUpdateStatus,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedFramework, setCopiedFramework] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<Status>(vulnerability?.status || 'Open');
  const [assignee, setAssignee] = useState(vulnerability?.assignedTo || '');
  const [savedNotification, setSavedNotification] = useState(false);

  if (!vulnerability) return null;

  const handleCopy = (text: string, isFramework: boolean = false) => {
    navigator.clipboard.writeText(text);
    if (isFramework) {
      setCopiedFramework(true);
      setTimeout(() => setCopiedFramework(false), 2000);
    } else {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleSave = () => {
    onUpdateStatus(vulnerability.id, {
      status: currentStatus,
      assignedTo: assignee,
    });
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div 
        className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950 sticky top-0 z-10 flex items-start justify-between gap-4">
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950/80 px-2.5 py-0.5 rounded border border-cyan-800">
                {vulnerability.id}
              </span>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                vulnerability.severity === 'High' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                vulnerability.severity === 'Medium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                'bg-blue-500/20 text-blue-400 border border-blue-500/30'
              }`}>
                {vulnerability.severity === 'High' && <Flame className="w-3.5 h-3.5" />}
                {vulnerability.severity} Risk (CVSS {vulnerability.cvss})
              </span>
              <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700 font-mono">
                {vulnerability.owaspCategory}: {vulnerability.owaspName}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {vulnerability.sprint}
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              {vulnerability.title}
            </h2>

            <div className="text-xs font-mono text-slate-400 flex items-center gap-1 truncate">
              <span className="text-slate-500">Target Endpoint:</span>
              <span className="text-slate-300">{vulnerability.target}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-6">
          {/* Section 1: CIA Triad Impact & Description */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Description & Impact Summary */}
            <div className="md:col-span-2 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Deskripsi Teknis Kerentanan
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                {vulnerability.description}
              </p>
              <div className="text-xs text-slate-400 font-mono">
                Standar Industri: <span className="text-cyan-400">{vulnerability.cwe}</span>
              </div>
            </div>

            {/* CIA Triad Impact Box */}
            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-purple-400" />
                Dampak CIA Triad
              </h3>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Confidentiality:</span>
                  <span className={`font-bold ${
                    vulnerability.ciaImpact.confidentiality === 'High' ? 'text-rose-400' :
                    vulnerability.ciaImpact.confidentiality === 'Medium' ? 'text-amber-400' : 'text-slate-300'
                  }`}>
                    {vulnerability.ciaImpact.confidentiality}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Integrity:</span>
                  <span className={`font-bold ${
                    vulnerability.ciaImpact.integrity === 'High' ? 'text-rose-400' :
                    vulnerability.ciaImpact.integrity === 'Medium' ? 'text-amber-400' : 'text-slate-300'
                  }`}>
                    {vulnerability.ciaImpact.integrity}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Availability:</span>
                  <span className={`font-bold ${
                    vulnerability.ciaImpact.availability === 'High' ? 'text-rose-400' :
                    vulnerability.ciaImpact.availability === 'Medium' ? 'text-amber-400' : 'text-slate-300'
                  }`}>
                    {vulnerability.ciaImpact.availability}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-300 leading-snug">
                {vulnerability.ciaImpact.summary}
              </div>
            </div>
          </div>

          {/* Section 2: Technical Evidence from OWASP ZAP */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              Bukti Pengujian &amp; Payload OWASP ZAP (Attack Evidence)
            </h3>
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2 text-xs font-mono">
              <div className="flex flex-wrap items-center justify-between text-slate-400 gap-2 border-b border-slate-800 pb-2">
                <span>Metode: <strong className="text-cyan-400">{vulnerability.evidence.method}</strong></span>
                <span>Parameter: <strong className="text-amber-400">{vulnerability.evidence.parameter}</strong></span>
                <span>Tingkat Keyakinan (Confidence): <strong className="text-emerald-400">{vulnerability.evidence.confidence}</strong></span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Payload Eksploitasi:</span>
                <span className="text-rose-400 break-all">{vulnerability.evidence.attackPayload}</span>
              </div>
              <div className="pt-1">
                <span className="text-slate-500 block text-[11px]">Snippet Respon Server:</span>
                <pre className="text-slate-300 text-[11px] bg-slate-900/80 p-2 rounded mt-1 overflow-x-auto whitespace-pre-wrap">
                  {vulnerability.evidence.responseSnippet}
                </pre>
              </div>
            </div>
          </div>

          {/* Section 3: Tepat Sasaran Mitigation & Patch Blueprint */}
          <div className="space-y-3 bg-gradient-to-b from-slate-950 to-blue-950/30 border border-blue-500/30 rounded-xl p-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">
                Rekomendasi Mitigasi Cepat &amp; Tepat Sasaran (Patch Blueprint)
              </h3>
            </div>

            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-cyan-300">
                {vulnerability.remediation.quickFixTitle}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {vulnerability.remediation.description}
              </p>
            </div>

            {/* Remediation Steps Checklist */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Langkah-Langkah Perbaikan Terarah:
              </span>
              <ul className="space-y-1 text-xs text-slate-300">
                {vulnerability.remediation.steps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Code Snippet for Developers / DevOps */}
            {vulnerability.remediation.codeSnippet && (
              <div className="pt-2">
                <div className="flex items-center justify-between text-xs pb-1.5 text-slate-400">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5 text-cyan-400" />
                    Kode Implementasi Patch:
                  </span>
                  <button
                    onClick={() => handleCopy(vulnerability.remediation.codeSnippet, false)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors text-[11px]"
                  >
                    {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCode ? 'Tersalin!' : 'Salin Kode'}</span>
                  </button>
                </div>
                <pre className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-emerald-300 overflow-x-auto whitespace-pre-wrap leading-relaxed font-mono">
                  {vulnerability.remediation.codeSnippet}
                </pre>
              </div>
            )}

            {/* Framework / Web Server Snippet (if available) */}
            {vulnerability.remediation.frameworkSnippet && (
              <div className="pt-2">
                <div className="flex items-center justify-between text-xs pb-1.5 text-slate-400">
                  <span className="font-semibold text-slate-300">
                    Konfigurasi Web Server (Nginx / Apache):
                  </span>
                  <button
                    onClick={() => handleCopy(vulnerability.remediation.frameworkSnippet || '', true)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors text-[11px]"
                  >
                    {copiedFramework ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedFramework ? 'Tersalin!' : 'Salin Konfigurasi'}</span>
                  </button>
                </div>
                <pre className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-cyan-300 overflow-x-auto whitespace-pre-wrap leading-relaxed font-mono">
                  {vulnerability.remediation.frameworkSnippet}
                </pre>
              </div>
            )}
          </div>

          {/* Section 4: Workflow Status & Assignee Controller */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              {/* Status Selector */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Status Penanganan:
                </label>
                <select
                  value={currentStatus}
                  onChange={(e) => setCurrentStatus(e.target.value as Status)}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-semibold"
                >
                  <option value="Open">Open (Belum Ditangani)</option>
                  <option value="In Progress">In Progress (Sedang Dikerjakan)</option>
                  <option value="Resolved">Resolved (Patch Telah Diterapkan)</option>
                  <option value="False Positive">False Positive (Bukan Kerentanan)</option>
                </select>
              </div>

              {/* Assignee Input */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Penanggung Jawab (PIC Tim IT):
                </label>
                <input
                  type="text"
                  value={assignee}
                  onChange={(e) => setAssignee(e.target.value)}
                  placeholder="Nama PIC / Tim..."
                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              {savedNotification && (
                <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Berhasil disimpan!
                </span>
              )}
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs shadow-md shadow-cyan-600/20 transition-all flex items-center gap-1.5"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Simpan Perubahan</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
