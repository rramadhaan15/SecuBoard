import React, { useState } from 'react';
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
        className="bg-slate-900 border border-slate-750 rounded-xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950 sticky top-0 z-10 flex items-start justify-between gap-4">
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold text-sky-400 bg-sky-950 px-2.5 py-0.5 rounded border border-sky-800">
                {vulnerability.id}
              </span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                vulnerability.severity === 'High' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                vulnerability.severity === 'Medium' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                'bg-slate-800 text-slate-300'
              }`}>
                {vulnerability.severity} Risk (CVSS {vulnerability.cvss})
              </span>
              <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                {vulnerability.owaspCategory}: {vulnerability.owaspName}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {vulnerability.sprint}
              </span>
            </div>

            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              {vulnerability.title}
            </h2>

            <div className="text-xs font-mono text-slate-400 flex items-center gap-1 truncate">
              <span className="text-slate-500">Target Endpoint:</span>
              <span className="text-slate-300">{vulnerability.target}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="px-2.5 py-1 rounded text-xs bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            Tutup
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-6">
          {/* Section 1: CIA Triad Impact & Description */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Deskripsi Teknis Kerentanan
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800">
                {vulnerability.description}
              </p>
              <div className="text-xs text-slate-400 font-mono">
                Standar Industri: <span className="text-sky-400">{vulnerability.cwe}</span>
              </div>
            </div>

            {/* CIA Triad Impact Box (No purple) */}
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-lg space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
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

              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-300 leading-snug">
                {vulnerability.ciaImpact.summary}
              </div>
            </div>
          </div>

          {/* Section 2: Technical Evidence from OWASP ZAP */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Bukti Pengujian &amp; Payload OWASP ZAP (Attack Evidence)
            </h3>
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 space-y-2 text-xs font-mono">
              <div className="flex flex-wrap items-center justify-between text-slate-400 gap-2 border-b border-slate-800 pb-2">
                <span>Metode: <strong className="text-sky-400">{vulnerability.evidence.method}</strong></span>
                <span>Parameter: <strong className="text-amber-400">{vulnerability.evidence.parameter}</strong></span>
                <span>Tingkat Keyakinan: <strong className="text-emerald-400">{vulnerability.evidence.confidence}</strong></span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Payload Eksploitasi:</span>
                <span className="text-rose-400 break-all">{vulnerability.evidence.attackPayload}</span>
              </div>
              <div className="pt-1">
                <span className="text-slate-500 block text-[11px]">Snippet Respon Server:</span>
                <pre className="text-slate-300 text-[11px] bg-slate-900 p-2 rounded mt-1 overflow-x-auto whitespace-pre-wrap font-mono">
                  {vulnerability.evidence.responseSnippet}
                </pre>
              </div>
            </div>
          </div>

          {/* Section 3: Remediation Blueprint (Solid Dark Slate, No Purple) */}
          <div className="space-y-3 bg-slate-950 border border-slate-800 rounded-lg p-4">
            <h3 className="text-sm font-bold text-white">
              Rekomendasi Mitigasi Cepat &amp; Tepat Sasaran (Patch Blueprint)
            </h3>

            <div className="space-y-1">
              <h4 className="text-xs font-bold text-sky-400">
                {vulnerability.remediation.quickFixTitle}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {vulnerability.remediation.description}
              </p>
            </div>

            {/* Checklist */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Langkah-Langkah Perbaikan:
              </span>
              <ul className="space-y-1 text-xs text-slate-300">
                {vulnerability.remediation.steps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">&bull;</span>
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
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors text-[11px]"
                  >
                    {copiedCode ? 'Tersalin!' : 'Salin Kode'}
                  </button>
                </div>
                <pre className="bg-slate-900 border border-slate-800 rounded p-3 text-xs text-emerald-300 overflow-x-auto whitespace-pre-wrap leading-relaxed font-mono">
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
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors text-[11px]"
                  >
                    {copiedFramework ? 'Tersalin!' : 'Salin Konfigurasi'}
                  </button>
                </div>
                <pre className="bg-slate-900 border border-slate-800 rounded p-3 text-xs text-sky-300 overflow-x-auto whitespace-pre-wrap leading-relaxed font-mono">
                  {vulnerability.remediation.frameworkSnippet}
                </pre>
              </div>
            )}
          </div>

          {/* Section 4: Workflow Status & Assignee Controller */}
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Status Penanganan:
                </label>
                <select
                  value={currentStatus}
                  onChange={(e) => setCurrentStatus(e.target.value as Status)}
                  className="bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500 font-semibold"
                >
                  <option value="Open">Open (Belum Ditangani)</option>
                  <option value="In Progress">In Progress (Sedang Dikerjakan)</option>
                  <option value="Resolved">Resolved (Patch Telah Diterapkan)</option>
                  <option value="False Positive">False Positive (Bukan Kerentanan)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Penanggung Jawab (PIC Tim IT):
                </label>
                <input
                  type="text"
                  value={assignee}
                  onChange={(e) => setAssignee(e.target.value)}
                  placeholder="Nama PIC / Tim..."
                  className="bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              {savedNotification && (
                <span className="text-xs text-emerald-400 font-medium">
                  Berhasil disimpan!
                </span>
              )}
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs shadow-sm transition-all"
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
