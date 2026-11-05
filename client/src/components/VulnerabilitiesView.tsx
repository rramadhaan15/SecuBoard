import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  ShieldAlert, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  ExternalLink, 
  Lock, 
  Eye, 
  Code,
  Flame,
  ArrowUpDown,
  Tag
} from 'lucide-react';
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
    // Search
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

    // Severity
    if (selectedSeverity !== 'ALL' && vuln.severity !== selectedSeverity) return false;

    // Status
    if (selectedStatus !== 'ALL' && vuln.status !== selectedStatus) return false;

    // OWASP Category
    if (selectedCategory !== 'ALL' && vuln.owaspCategory !== selectedCategory) return false;

    // Subdomain
    if (selectedSubdomain !== 'ALL' && vuln.subdomain !== selectedSubdomain) return false;

    return true;
  });

  const subdomains = Array.from(new Set(vulnerabilities.map((v) => v.subdomain)));

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
              Vulnerability Management System
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            Katalog Celah Keamanan &amp; Remediasi Tepat Sasaran
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Daftar lengkap kerentanan yang terdeteksi oleh pemindai otomatis OWASP ZAP pada seluruh ekosistem digital Republika. Klik tombol &quot;Remediasi&quot; untuk melihat blueprint patch dan kode konfigurasi server.
          </p>
        </div>

        {/* Stats Mini Badges */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-center min-w-[80px]">
            <span className="text-xs text-slate-400">Total</span>
            <p className="text-lg font-extrabold text-white">{vulnerabilities.length}</p>
          </div>
          <div className="px-3 py-2 rounded-xl bg-rose-950/40 border border-rose-800/60 text-center min-w-[80px]">
            <span className="text-xs text-rose-400 font-semibold">High</span>
            <p className="text-lg font-extrabold text-rose-400">
              {vulnerabilities.filter((v) => v.severity === 'High').length}
            </p>
          </div>
          <div className="px-3 py-2 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-center min-w-[80px]">
            <span className="text-xs text-emerald-400 font-semibold">Resolved</span>
            <p className="text-lg font-extrabold text-emerald-400">
              {vulnerabilities.filter((v) => v.status === 'Resolved').length}
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari kerentanan (judul, endpoint URL, CWE, kata kunci)..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Subdomain Filter */}
          <div>
            <select
              value={selectedSubdomain}
              onChange={(e) => setSelectedSubdomain(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
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
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
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

        {/* Severity & Status Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
          {/* Severity Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-semibold mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Severity:
            </span>
            {['ALL', 'High', 'Medium', 'Low', 'Informational'].map((sev) => {
              const isActive = selectedSeverity === sev;
              let activeClass = 'bg-cyan-600 text-white';
              if (sev === 'High') activeClass = 'bg-rose-600 text-white';
              else if (sev === 'Medium') activeClass = 'bg-amber-600 text-white';
              else if (sev === 'Low') activeClass = 'bg-blue-600 text-white';
              else if (sev === 'Informational') activeClass = 'bg-slate-700 text-white';

              return (
                <button
                  key={sev}
                  onClick={() => setSelectedSeverity(sev)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? activeClass
                      : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {sev === 'ALL' ? 'Semua' : sev}
                </button>
              );
            })}
          </div>

          {/* Status Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-semibold mr-1">Status:</span>
            {['ALL', 'Open', 'In Progress', 'Resolved'].map((st) => {
              const isActive = selectedStatus === st;
              return (
                <button
                  key={st}
                  onClick={() => setSelectedStatus(st)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-700 text-white border border-slate-600'
                      : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {st === 'ALL' ? 'Semua' : st}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Vulnerabilities Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 font-semibold">
              <tr>
                <th className="py-3 px-4">Tingkat Risiko</th>
                <th className="py-3 px-4">Kerentanan &amp; CWE</th>
                <th className="py-3 px-4">Kategori OWASP Top 10</th>
                <th className="py-3 px-4">Target Endpoint</th>
                <th className="py-3 px-4">Dampak CIA</th>
                <th className="py-3 px-4">Status &amp; PIC</th>
                <th className="py-3 px-4 text-center">Aksi Mitigasi</th>
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
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                          vuln.severity === 'High' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                          vuln.severity === 'Medium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                          vuln.severity === 'Low' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                          'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}>
                          {vuln.severity === 'High' && <Flame className="w-3 h-3 text-rose-500" />}
                          {vuln.severity === 'Medium' && <AlertTriangle className="w-3 h-3 text-amber-500" />}
                          {vuln.severity === 'Low' && <Info className="w-3 h-3 text-blue-500" />}
                          {vuln.severity}
                        </span>
                        <div className="text-[11px] font-mono text-slate-400">
                          CVSS: <strong className="text-white">{vuln.cvss}</strong>
                        </div>
                      </div>
                    </td>

                    {/* Title & CWE */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5 max-w-xs sm:max-w-md">
                        <span className="font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
                          {vuln.title}
                        </span>
                        <div className="text-[11px] text-slate-400 font-mono line-clamp-1">
                          {vuln.cwe}
                        </div>
                      </div>
                    </td>

                    {/* OWASP Category */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-block px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[11px] border border-slate-700">
                        {vuln.owaspCategory}
                      </span>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {vuln.owaspName}
                      </div>
                    </td>

                    {/* Target Endpoint */}
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-300 max-w-[200px]">
                      <div className="truncate text-slate-300" title={vuln.target}>
                        {vuln.target}
                      </div>
                      <span className="text-[10px] text-slate-400 block">
                        {vuln.sprint}
                      </span>
                    </td>

                    {/* CIA Triad Badges */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 font-mono text-[10px]">
                        <span className={`px-1.5 py-0.5 rounded ${
                          vuln.ciaImpact.confidentiality === 'High' ? 'bg-rose-950 text-rose-300 font-bold' :
                          vuln.ciaImpact.confidentiality === 'Medium' ? 'bg-amber-950 text-amber-300' :
                          vuln.ciaImpact.confidentiality === 'Low' ? 'bg-blue-950 text-blue-300' :
                          'bg-slate-800 text-slate-500'
                        }`} title="Confidentiality (Kerahasiaan)">
                          C:{vuln.ciaImpact.confidentiality[0]}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded ${
                          vuln.ciaImpact.integrity === 'High' ? 'bg-rose-950 text-rose-300 font-bold' :
                          vuln.ciaImpact.integrity === 'Medium' ? 'bg-amber-950 text-amber-300' :
                          vuln.ciaImpact.integrity === 'Low' ? 'bg-blue-950 text-blue-300' :
                          'bg-slate-800 text-slate-500'
                        }`} title="Integrity (Integritas Konten Berita)">
                          I:{vuln.ciaImpact.integrity[0]}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded ${
                          vuln.ciaImpact.availability === 'High' ? 'bg-rose-950 text-rose-300 font-bold' :
                          vuln.ciaImpact.availability === 'Medium' ? 'bg-amber-950 text-amber-300' :
                          vuln.ciaImpact.availability === 'Low' ? 'bg-blue-950 text-blue-300' :
                          'bg-slate-800 text-slate-500'
                        }`} title="Availability (Ketersediaan Portal)">
                          A:{vuln.ciaImpact.availability[0]}
                        </span>
                      </div>
                    </td>

                    {/* Status & PIC */}
                    <td className="py-3.5 px-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={vuln.status}
                        onChange={(e) => onQuickStatusChange(vuln.id, e.target.value as Status)}
                        className={`text-[11px] font-semibold px-2 py-1 rounded border focus:outline-none ${
                          vuln.status === 'Resolved' ? 'bg-emerald-950/80 border-emerald-700 text-emerald-300' :
                          vuln.status === 'In Progress' ? 'bg-blue-950/80 border-blue-700 text-blue-300' :
                          'bg-rose-950/80 border-rose-700 text-rose-300'
                        }`}
                      >
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="False Positive">False Positive</option>
                      </select>
                      <div className="text-[10px] text-slate-400 mt-1 truncate max-w-[130px]">
                        PIC: {vuln.assignedTo.split('(')[0]}
                      </div>
                    </td>

                    {/* Action Button */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onSelectVulnerability(vuln)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-sm transition-all flex items-center gap-1.5 mx-auto"
                      >
                        <Code className="w-3.5 h-3.5" />
                        <span>Remediasi</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-3 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Menampilkan <strong className="text-white">{filtered.length}</strong> dari {vulnerabilities.length} temuan celah keamanan</span>
          <span className="text-slate-400">Klik baris untuk membuka panduan perbaikan teknis</span>
        </div>
      </div>
    </div>
  );
};
