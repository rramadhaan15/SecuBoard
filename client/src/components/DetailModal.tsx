import React, { useState } from 'react';
import { 
  X, 
  ShieldAlert, 
  Copy, 
  Check, 
  FileCode, 
  Terminal, 
  CheckCircle2, 
  Target, 
  Layers, 
  Cpu, 
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div 
        className="bg-[#0c1322] border border-[#17233d] rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-[#17233d] bg-[#080c14] sticky top-0 z-10 flex items-start justify-between gap-4">
          <div className="space-y-2 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950 px-2.5 py-0.5 rounded-md border border-cyan-800">
                {vulnerability.id}
              </span>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md ${
                vulnerability.severity === 'High' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                vulnerability.severity === 'Medium' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                'bg-cyan-950 text-cyan-300 border border-cyan-800'
              }`}>
                {vulnerability.severity} Risk &bull; CVSS {vulnerability.cvss}
              </span>
              <span className="text-xs bg-[#111a2e] text-slate-300 px-2.5 py-0.5 rounded-md font-mono border border-[#1e2f52]">
                {vulnerability.owaspCategory}: {vulnerability.owaspName}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {vulnerability.sprint}
              </span>
            </div>

            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              {vulnerability.title}
            </h2>

            <div className="text-xs font-mono text-slate-400 flex items-center gap-1.5 truncate">
              <span className="text-slate-500">Target Endpoint:</span>
              <span className="text-cyan-300 select-all">{vulnerability.target}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#111a2e] hover:bg-[#17233d] text-slate-400 hover:text-white border border-[#1e2f52] transition-colors shrink-0"
            title="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6">
          {/* Section 1: CIA Triad Impact & Description */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                Deskripsi Teknis Kerentanan
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-[#080c14] p-4 rounded-xl border border-[#17233d]">
                {vulnerability.description}
              </p>
              <div className="text-xs text-slate-400 font-mono">
                Standar Industri: <span className="text-cyan-400">{vulnerability.cwe}</span>
              </div>
            </div>

            {/* CIA Triad Impact Box */}
            <div className="bg-[#080c14] border border-[#17233d] p-4 rounded-xl space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-emerald-400" />
                Dampak CIA Triad
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center p-1.5 rounded bg-[#0c1322] border border-[#17233d]">
                  <span className="text-slate-400">Confidentiality:</span>
                  <span className={`font-bold ${
                    vulnerability.ciaImpact.confidentiality === 'High' ? 'text-rose-400' :
                    vulnerability.ciaImpact.confidentiality === 'Medium' ? 'text-amber-400' : 'text-slate-300'
                  }`}>
                    {vulnerability.ciaImpact.confidentiality}
                  </span>
                </div>
                <div className="flex justify-between items-center p-1.5 rounded bg-[#0c1322] border border-[#17233d]">
                  <span className="text-slate-400">Integrity:</span>
                  <span className={`font-bold ${
                    vulnerability.ciaImpact.integrity === 'High' ? 'text-rose-400' :
                    vulnerability.ciaImpact.integrity === 'Medium' ? 'text-amber-400' : 'text-slate-300'
                  }`}>
                    {vulnerability.ciaImpact.integrity}
                  </span>
                </div>
                <div className="flex justify-between items-center p-1.5 rounded bg-[#0c1322] border border-[#17233d]">
                  <span className="text-slate-400">Availability:</span>
                  <span className={`font-bold ${
                    vulnerability.ciaImpact.availability === 'High' ? 'text-rose-400' :
                    vulnerability.ciaImpact.availability === 'Medium' ? 'text-amber-400' : 'text-slate-300'
                  }`}>
                    {vulnerability.ciaImpact.availability}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#17233d] text-[11px] text-slate-300 leading-snug">
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
            <div className="bg-[#080c14] border border-[#17233d] rounded-xl p-4 space-y-3 text-xs font-mono">
              <div className="flex flex-wrap items-center justify-between text-slate-400 gap-2 border-b border-[#17233d] pb-2.5">
                <span>Metode: <strong className="text-cyan-400">{vulnerability.evidence.method}</strong></span>
                <span>Parameter: <strong className="text-amber-400">{vulnerability.evidence.parameter}</strong></span>
                <span>Keyakinan (Confidence): <strong className="text-emerald-400">{vulnerability.evidence.confidence}</strong></span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Payload Eksploitasi:</span>
                <span className="text-rose-400 break-all bg-rose-950/20 px-2 py-1 rounded block mt-1 border border-rose-900/40">
                  {vulnerability.evidence.attackPayload}
                </span>
              </div>
              <div className="pt-1">
                <span className="text-slate-500 block text-[11px]">Snippet Respon Server:</span>
                <pre className="text-slate-300 text-[11px] bg-[#050811] border border-[#17233d] p-3 rounded-lg mt-1 overflow-x-auto whitespace-pre-wrap font-mono">
                  {vulnerability.evidence.responseSnippet}
                </pre>
              </div>
            </div>
          </div>

          {/* Section 3: Remediation Blueprint */}
          <div className="space-y-4 bg-[#080c14] border border-[#17233d] rounded-xl p-5">
            <div className="flex items-center gap-2 pb-2 border-b border-[#17233d]">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">
                Rekomendasi Mitigasi Cepat &amp; Tepat Sasaran (Patch Blueprint)
              </h3>
            </div>

            <div className="space-y-1">
              <h4 className="text-xs font-bold text-cyan-400">
                {vulnerability.remediation.quickFixTitle}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {vulnerability.remediation.description}
              </p>
            </div>

            {/* Checklist */}
            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Langkah-Langkah Perbaikan:
              </span>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {vulnerability.remediation.steps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Code Snippet */}
            {vulnerability.remediation.codeSnippet && (
              <div className="pt-2">
                <div className="flex items-center justify-between text-xs pb-1.5 text-slate-400">
                  <span className="font-semibold text-slate-300">
                    Kode Implementasi Patch:
                  </span>
                  <button
                    onClick={() => handleCopy(vulnerability.remediation.codeSnippet, false)}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[#111a2e] hover:bg-[#17233d] text-cyan-300 border border-[#1e2f52] transition-all text-[11px]"
                  >
                    {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCode ? 'Tersalin!' : 'Salin Kode'}</span>
                  </button>
                </div>
                <pre className="bg-[#050811] border border-[#17233d] rounded-xl p-3.5 text-xs text-emerald-300 overflow-x-auto whitespace-pre-wrap leading-relaxed font-mono">
                  {vulnerability.remediation.codeSnippet}
                </pre>
              </div>
            )}

            {/* Framework Snippet */}
            {vulnerability.remediation.frameworkSnippet && (
              <div className="pt-2">
                <div className="flex items-center justify-between text-xs pb-1.5 text-slate-400">
                  <span className="font-semibold text-slate-300">
                    Konfigurasi Web Server (Nginx / Apache):
                  </span>
                  <button
                    onClick={() => handleCopy(vulnerability.remediation.frameworkSnippet || '', true)}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[#111a2e] hover:bg-[#17233d] text-cyan-300 border border-[#1e2f52] transition-all text-[11px]"
                  >
                    {copiedFramework ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedFramework ? 'Tersalin!' : 'Salin Konfigurasi'}</span>
                  </button>
                </div>
                <pre className="bg-[#050811] border border-[#17233d] rounded-xl p-3.5 text-xs text-cyan-300 overflow-x-auto whitespace-pre-wrap leading-relaxed font-mono">
                  {vulnerability.remediation.frameworkSnippet}
                </pre>
              </div>
            )}
          </div>

          {/* Section 4: Workflow Status & Assignee Controller */}
          <div className="bg-[#080c14] p-4 rounded-xl border border-[#17233d] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Status Penanganan:
                </label>
                <select
                  value={currentStatus}
                  onChange={(e) => setCurrentStatus(e.target.value as Status)}
                  className="bg-[#0c1322] border border-[#17233d] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-semibold"
                >
                  <option value="Open">Open (Belum Ditangani)</option>
                  <option value="In Progress">In Progress (Sedang Dikerjakan)</option>
                  <option value="Resolved">Resolved (Patch Telah Diterapkan)</option>
                  <option value="False Positive">False Positive (Bukan Kerentanan)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Penanggung Jawab (PIC Tim IT):
                </label>
                <input
                  type="text"
                  value={assignee}
                  onChange={(e) => setAssignee(e.target.value)}
                  placeholder="Nama PIC / Tim..."
                  className="bg-[#0c1322] border border-[#17233d] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-center">
              {savedNotification && (
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Berhasil disimpan!
                </span>
              )}
              <button
                onClick={handleSave}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-md shadow-cyan-950 transition-all hover:scale-[1.02] active:scale-95"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
