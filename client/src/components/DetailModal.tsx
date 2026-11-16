import React, { useState } from 'react';
import { X, Copy, Check } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div 
        className="bg-white border border-slate-200 rounded-xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 bg-slate-50/50 sticky top-0 z-10 flex items-start justify-between gap-4">
          <div className="space-y-2 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-semibold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                {vulnerability.id}
              </span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                vulnerability.severity === 'High' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                vulnerability.severity === 'Medium' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                'bg-blue-50 text-blue-700 border border-blue-200'
              }`}>
                {vulnerability.severity} Risk &bull; CVSS {vulnerability.cvss}
              </span>
              <span className="text-xs bg-white text-slate-600 px-2 py-0.5 rounded font-mono border border-slate-200">
                {vulnerability.owaspCategory}: {vulnerability.owaspName}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {vulnerability.sprint}
              </span>
            </div>

            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              {vulnerability.title}
            </h2>

            <div className="text-xs font-mono text-slate-500 flex items-center gap-1.5 truncate">
              <span className="text-slate-400">Target Endpoint:</span>
              <span className="text-slate-800 font-medium select-all">{vulnerability.target}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-400 hover:text-slate-700 border border-slate-200 transition-colors shrink-0"
            title="Tutup Modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6">
          {/* Section 1: Description & CIA Triad */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Deskripsi Teknis Kerentanan
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200">
                {vulnerability.description}
              </p>
              <div className="text-xs text-slate-500 font-mono">
                Standar Industri: <span className="text-slate-700 font-semibold">{vulnerability.cwe}</span>
              </div>
            </div>

            {/* CIA Triad Impact Box */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Dampak CIA Triad
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center p-2 rounded bg-white border border-slate-200">
                  <span className="text-slate-600 font-medium">Confidentiality:</span>
                  <span className={`font-semibold ${
                    vulnerability.ciaImpact.confidentiality === 'High' ? 'text-rose-600' :
                    vulnerability.ciaImpact.confidentiality === 'Medium' ? 'text-amber-600' : 'text-slate-600'
                  }`}>
                    {vulnerability.ciaImpact.confidentiality}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 rounded bg-white border border-slate-200">
                  <span className="text-slate-600 font-medium">Integrity:</span>
                  <span className={`font-semibold ${
                    vulnerability.ciaImpact.integrity === 'High' ? 'text-rose-600' :
                    vulnerability.ciaImpact.integrity === 'Medium' ? 'text-amber-600' : 'text-slate-600'
                  }`}>
                    {vulnerability.ciaImpact.integrity}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 rounded bg-white border border-slate-200">
                  <span className="text-slate-600 font-medium">Availability:</span>
                  <span className={`font-semibold ${
                    vulnerability.ciaImpact.availability === 'High' ? 'text-rose-600' :
                    vulnerability.ciaImpact.availability === 'Medium' ? 'text-amber-600' : 'text-slate-600'
                  }`}>
                    {vulnerability.ciaImpact.availability}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500 leading-snug">
                {vulnerability.ciaImpact.summary}
              </div>
            </div>
          </div>

          {/* Section 2: Technical Evidence from OWASP ZAP */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Bukti Pengujian &amp; Payload OWASP ZAP
            </h3>
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-3 text-xs font-mono text-slate-200">
              <div className="flex flex-wrap items-center justify-between text-slate-400 gap-2 border-b border-slate-800 pb-2.5">
                <span>Metode: <strong className="text-slate-200">{vulnerability.evidence.method}</strong></span>
                <span>Parameter: <strong className="text-slate-200">{vulnerability.evidence.parameter}</strong></span>
                <span>Confidence: <strong className="text-slate-200">{vulnerability.evidence.confidence}</strong></span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Payload Pengujian:</span>
                <span className="text-rose-300 break-all bg-rose-950/50 px-2 py-1 rounded block mt-1 border border-rose-900/60">
                  {vulnerability.evidence.attackPayload}
                </span>
              </div>
              <div className="pt-1">
                <span className="text-slate-400 block text-[11px]">Snippet Respon Server:</span>
                <pre className="text-slate-300 text-[11px] bg-black/40 border border-slate-800 p-3 rounded mt-1 overflow-x-auto whitespace-pre-wrap font-mono">
                  {vulnerability.evidence.responseSnippet}
                </pre>
              </div>
            </div>
          </div>

          {/* Section 3: Remediation Blueprint */}
          <div className="space-y-4 bg-slate-50 border border-slate-200 rounded-lg p-5">
            <div className="pb-2 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900">
                Blueprint Panduan Remediasi &amp; Patching
              </h3>
            </div>

            <div className="space-y-1">
              <h4 className="text-xs font-semibold text-blue-700">
                {vulnerability.remediation.quickFixTitle}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {vulnerability.remediation.description}
              </p>
            </div>

            {/* Checklist */}
            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider block">
                Langkah-Langkah Perbaikan:
              </span>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {vulnerability.remediation.steps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 mt-1.5"></span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Code Snippet */}
            {vulnerability.remediation.codeSnippet && (
              <div className="pt-2">
                <div className="flex items-center justify-between text-xs pb-1.5 text-slate-600">
                  <span className="font-semibold text-slate-800">
                    Kode Implementasi Patch:
                  </span>
                  <button
                    onClick={() => handleCopy(vulnerability.remediation.codeSnippet, false)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 transition-all text-[11px] font-medium"
                  >
                    {copiedCode ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-400" />}
                    <span>{copiedCode ? 'Tersalin' : 'Salin Kode'}</span>
                  </button>
                </div>
                <pre className="bg-slate-950 border border-slate-800 rounded-lg p-3.5 text-xs text-emerald-300 overflow-x-auto whitespace-pre-wrap leading-relaxed font-mono">
                  {vulnerability.remediation.codeSnippet}
                </pre>
              </div>
            )}

            {/* Framework Snippet */}
            {vulnerability.remediation.frameworkSnippet && (
              <div className="pt-2">
                <div className="flex items-center justify-between text-xs pb-1.5 text-slate-600">
                  <span className="font-semibold text-slate-800">
                    Konfigurasi Web Server (Nginx / Apache):
                  </span>
                  <button
                    onClick={() => handleCopy(vulnerability.remediation.frameworkSnippet || '', true)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 transition-all text-[11px] font-medium"
                  >
                    {copiedFramework ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-400" />}
                    <span>{copiedFramework ? 'Tersalin' : 'Salin Konfigurasi'}</span>
                  </button>
                </div>
                <pre className="bg-slate-950 border border-slate-800 rounded-lg p-3.5 text-xs text-cyan-300 overflow-x-auto whitespace-pre-wrap leading-relaxed font-mono">
                  {vulnerability.remediation.frameworkSnippet}
                </pre>
              </div>
            )}
          </div>

          {/* Section 4: Workflow Status & Assignee Controller */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1">
                  Status Penanganan:
                </label>
                <select
                  value={currentStatus}
                  onChange={(e) => setCurrentStatus(e.target.value as Status)}
                  className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-medium shadow-xs"
                >
                  <option value="Open">Open (Belum Ditangani)</option>
                  <option value="In Progress">In Progress (Sedang Dikerjakan)</option>
                  <option value="Resolved">Resolved (Patch Telah Diterapkan)</option>
                  <option value="False Positive">False Positive (Bukan Kerentanan)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1">
                  Penanggung Jawab (PIC):
                </label>
                <input
                  type="text"
                  value={assignee}
                  onChange={(e) => setAssignee(e.target.value)}
                  placeholder="Nama PIC / Tim..."
                  className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-medium shadow-xs"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-center">
              {savedNotification && (
                <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Perubahan tersimpan!
                </span>
              )}
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-all"
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
