import React, { useState } from 'react';
import { Vulnerability, OWASPCategoryInfo, Severity, Status } from '../types';

interface VulnerabilitiesViewProps {
  vulnerabilities: Vulnerability[];
  categories: Record<string, OWASPCategoryInfo>;
  onSelectVulnerability: (vuln: Vulnerability) => void;
  onQuickStatusChange: (id: string, status: Status) => void;
}

export const VulnerabilitiesView: React.FC<VulnerabilitiesViewProps> = ({
  vulnerabilities,
  categories,
  onSelectVulnerability,
  onQuickStatusChange,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedSubdomain, setSelectedSubdomain] = useState<string>('ALL');

  // Filter logic
  const filtered = vulnerabilities.filter((vuln) => {
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const match =
        vuln.title.toLowerCase().includes(q) ||
        vuln.target.toLowerCase().includes(q) ||
        vuln.owaspName.toLowerCase().includes(q) ||
        vuln.description.toLowerCase().includes(q) ||
        vuln.cwe.toLowerCase().includes(q);
      if (!match) return false;
    }

    if (selectedSeverity !== 'ALL' && vuln.severity !== selectedSeverity) return false;
    if (selectedStatus !== 'ALL' && vuln.status !== selectedStatus) return false;
    if (selectedCategory !== 'ALL' && vuln.owaspCategory !== selectedCategory) return false;
    if (selectedSubdomain !== 'ALL' && vuln.subdomain !== selectedSubdomain) return false;

    return true;
  });

  const subdomains = Array.from(new Set(vulnerabilities.map((v) => v.subdomain)));

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-sky-400 uppercase tracking-wider block">
            Vulnerability Management System
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
            Katalog Celah Keamanan &amp; Remediasi Tepat Sasaran
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Daftar lengkap kerentanan yang terdeteksi oleh pemindai otomatis OWASP ZAP pada seluruh ekosistem digital Republika. Klik tombol &quot;Remediasi&quot; untuk melihat blueprint patch dan kode konfigurasi server.
          </p>
        </div>

        {/* Mini Stats */}
        <div className="flex items-center gap-2.5">
          <div className="px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-center min-w-[75px]">
            <span className="text-xs text-slate-400">Total</span>
            <p className="text-base font-bold text-white font-mono">{vulnerabilities.length}</p>
          </div>
          <div className="px-3.5 py-2 rounded-lg bg-rose-950/60 border border-rose-800 text-center min-w-[75px]">
            <span className="text-xs text-rose-400 font-semibold">High</span>
            <p className="text-base font-bold text-rose-300 font-mono">
              {vulnerabilities.filter((v) => v.severity === 'High').length}
            </p>
          </div>
          <div className="px-3.5 py-2 rounded-lg bg-emerald-950/60 border border-emerald-800 text-center min-w-[75px]">
            <span className="text-xs text-emerald-400 font-semibold">Resolved</span>
            <p className="text-base font-bold text-emerald-300 font-mono">
              {vulnerabilities.filter((v) => v.status === 'Resolved').length}
            </p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="md:col-span-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari kerentanan (judul, endpoint URL, CWE, kata kunci)..."
              className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Subdomain Filter */}
          <div>
            <select
              value={selectedSubdomain}
              onChange={(e) => setSelectedSubdomain(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
            >
              <option value="ALL">Semua Domain &amp; Subdomain</option>
              {subdomains.map((sub) => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>

          {/* OWASP Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
            >
              <option value="ALL">Semua Kategori OWASP Top 10</option>
              {Object.entries(categories).map(([code, info]) => (
                <option key={code} value={code}>
                  {code}: {info.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-semibold mr-1">Severity:</span>
            {['ALL', 'High', 'Medium', 'Low', 'Informational'].map((sev) => {
              const isActive = selectedSeverity === sev;
              let activeClass = 'bg-sky-600 text-white';
              if (sev === 'High') activeClass = 'bg-rose-600 text-white';
              else if (sev === 'Medium') activeClass = 'bg-amber-600 text-white';
              else if (sev === 'Low') activeClass = 'bg-slate-700 text-white';
              else if (sev === 'Informational') activeClass = 'bg-slate-700 text-white';

              return (
                <button
                  key={sev}
                  onClick={() => setSelectedSeverity(sev)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                    isActive
                      ? activeClass
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {sev === 'ALL' ? 'Semua' : sev}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-semibold mr-1">Status:</span>
            {['ALL', 'Open', 'In Progress', 'Resolved'].map((st) => {
              const isActive = selectedStatus === st;
              return (
                <button
                  key={st}
                  onClick={() => setSelectedStatus(st)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-700 text-white'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {st === 'ALL' ? 'Semua' : st}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-semibold">
              <tr>
                <th className="py-2.5 px-4">Tingkat Risiko</th>
                <th className="py-2.5 px-4">Kerentanan &amp; CWE</th>
                <th className="py-2.5 px-4">Kategori OWASP</th>
                <th className="py-2.5 px-4">Target Endpoint</th>
                <th className="py-2.5 px-4">Dampak CIA</th>
                <th className="py-2.5 px-4">Status &amp; PIC</th>
                <th className="py-2.5 px-4 text-center">Aksi Mitigasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    Tidak ditemukan kerentanan dengan filter yang dipilih.
                  </td>
                </tr>
              ) : (
                filtered.map((vuln) => (
                  <tr 
                    key={vuln.id} 
                    className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                    onClick={() => onSelectVulnerability(vuln)}
                  >
                    {/* Severity & CVSS */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="space-y-0.5">
                        <span className={`inline-block px-2 py-0.5 rounded font-bold text-[11px] ${
                          vuln.severity === 'High' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                          vuln.severity === 'Medium' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                          'bg-slate-800 text-slate-300'
                        }`}>
                          {vuln.severity}
                        </span>
                        <div className="text-[11px] font-mono text-slate-400">
                          CVSS: <strong className="text-white">{vuln.cvss}</strong>
                        </div>
                      </div>
                    </td>

                    {/* Title & CWE */}
                    <td className="py-3 px-4">
                      <div className="space-y-0.5 max-w-xs sm:max-w-md">
                        <span className="font-semibold text-white group-hover:text-sky-400 transition-colors line-clamp-1">
                          {vuln.title}
                        </span>
                        <div className="text-[11px] text-slate-400 font-mono line-clamp-1">
                          {vuln.cwe}
                        </div>
                      </div>
                    </td>

                    {/* OWASP */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="inline-block px-2 py-0.5 rounded bg-slate-950 text-slate-300 font-mono text-[11px] border border-slate-800">
                        {vuln.owaspCategory}
                      </span>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {vuln.owaspName}
                      </div>
                    </td>

                    {/* Endpoint */}
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-300 max-w-[200px]">
                      <div className="truncate text-slate-300" title={vuln.target}>
                        {vuln.target}
                      </div>
                      <span className="text-[10px] text-slate-500 block">
                        {vuln.sprint}
                      </span>
                    </td>

                    {/* CIA Triad */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 font-mono text-[10px]">
                        <span className={`px-1.5 py-0.5 rounded ${
                          vuln.ciaImpact.confidentiality === 'High' ? 'bg-rose-950 text-rose-300 font-bold' :
                          vuln.ciaImpact.confidentiality === 'Medium' ? 'bg-amber-950 text-amber-300' :
                          'bg-slate-800 text-slate-400'
                        }`} title="Confidentiality">
                          C:{vuln.ciaImpact.confidentiality[0]}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded ${
                          vuln.ciaImpact.integrity === 'High' ? 'bg-rose-950 text-rose-300 font-bold' :
                          vuln.ciaImpact.integrity === 'Medium' ? 'bg-amber-950 text-amber-300' :
                          'bg-slate-800 text-slate-400'
                        }`} title="Integrity">
                          I:{vuln.ciaImpact.integrity[0]}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded ${
                          vuln.ciaImpact.availability === 'High' ? 'bg-rose-950 text-rose-300 font-bold' :
                          vuln.ciaImpact.availability === 'Medium' ? 'bg-amber-950 text-amber-300' :
                          'bg-slate-800 text-slate-400'
                        }`} title="Availability">
                          A:{vuln.ciaImpact.availability[0]}
                        </span>
                      </div>
                    </td>

                    {/* Status & PIC */}
                    <td className="py-3 px-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={vuln.status}
                        onChange={(e) => onQuickStatusChange(vuln.id, e.target.value as Status)}
                        className={`text-[11px] font-semibold px-2 py-1 rounded border focus:outline-none ${
                          vuln.status === 'Resolved' ? 'bg-emerald-950 border-emerald-800 text-emerald-300' :
                          vuln.status === 'In Progress' ? 'bg-sky-950 border-sky-800 text-sky-300' :
                          'bg-rose-950 border-rose-800 text-rose-300'
                        }`}
                      >
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="False Positive">False Positive</option>
                      </select>
                      <div className="text-[10px] text-slate-500 mt-0.5 truncate max-w-[130px]">
                        PIC: {vuln.assignedTo.split('(')[0]}
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onSelectVulnerability(vuln)}
                        className="px-3 py-1 rounded text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
                      >
                        Remediasi
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Menampilkan <strong className="text-white">{filtered.length}</strong> dari {vulnerabilities.length} temuan</span>
          <span className="text-slate-500">Klik baris untuk membuka panduan perbaikan teknis</span>
        </div>
      </div>
    </div>
  );
};
