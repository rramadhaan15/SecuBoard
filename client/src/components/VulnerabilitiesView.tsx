import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  ShieldAlert, 
  FileCode, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  X, 
  ExternalLink,
  ChevronRight,
  Shield,
  Layers,
  Sparkles
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

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedSeverity('ALL');
    setSelectedStatus('ALL');
    setSelectedCategory('ALL');
    setSelectedSubdomain('ALL');
  };

  const hasActiveFilters =
    searchTerm ||
    selectedSeverity !== 'ALL' ||
    selectedStatus !== 'ALL' ||
    selectedCategory !== 'ALL' ||
    selectedSubdomain !== 'ALL';

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-[#0c1322] border border-[#17233d] p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
              Vulnerability Management System
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            Katalog Celah Keamanan &amp; Remediasi Tepat Sasaran
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Daftar lengkap kerentanan yang terdeteksi oleh pemindai otomatis OWASP ZAP pada seluruh ekosistem digital Republika. Klik tombol &quot;Blueprint Remediasi&quot; untuk melihat kode patch teknis dan konfigurasi hardening server.
          </p>
        </div>

        {/* Mini Stats Ribbon */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="px-4 py-2.5 rounded-xl bg-[#080c14] border border-[#17233d] text-center min-w-[80px]">
            <span className="text-[11px] text-slate-400 block">Total</span>
            <p className="text-lg font-bold text-white font-mono">{vulnerabilities.length}</p>
          </div>
          <div className="px-4 py-2.5 rounded-xl bg-rose-950/60 border border-rose-800 text-center min-w-[80px]">
            <span className="text-[11px] text-rose-400 font-semibold block">High Risk</span>
            <p className="text-lg font-bold text-rose-300 font-mono">
              {vulnerabilities.filter((v) => v.severity === 'High').length}
            </p>
          </div>
          <div className="px-4 py-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-center min-w-[80px]">
            <span className="text-[11px] text-emerald-400 font-semibold block">Resolved</span>
            <p className="text-lg font-bold text-emerald-300 font-mono">
              {vulnerabilities.filter((v) => v.status === 'Resolved').length}
            </p>
          </div>
        </div>
      </div>

      {/* Comprehensive Filter Bar */}
      <div className="bg-[#0c1322] border border-[#17233d] rounded-2xl p-5 shadow-xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari celah (judul, parameter URL, CWE, kategori, payload)..."
              className="w-full bg-[#080c14] border border-[#17233d] rounded-xl pl-10 pr-9 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all font-sans"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-3 text-slate-500 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Subdomain Filter */}
          <div>
            <select
              value={selectedSubdomain}
              onChange={(e) => setSelectedSubdomain(e.target.value)}
              className="w-full bg-[#080c14] border border-[#17233d] rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
            >
              <option value="ALL">Semua Subdomain ({vulnerabilities.length})</option>
              {subdomains.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>

          {/* OWASP Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-[#080c14] border border-[#17233d] rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">Semua OWASP Top 10:2021</option>
              {Object.entries(categories).map(([code, info]) => (
                <option key={code} value={code}>
                  {code} - {info.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Severity Chips & Status Selector Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#17233d]">
          {/* Severity Badges Filter */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3 text-cyan-400" />
              Severity:
            </span>
            {[
              { id: 'ALL', label: 'Semua', count: vulnerabilities.length },
              { id: 'High', label: 'High', count: vulnerabilities.filter((v) => v.severity === 'High').length, color: 'text-rose-400' },
              { id: 'Medium', label: 'Medium', count: vulnerabilities.filter((v) => v.severity === 'Medium').length, color: 'text-amber-400' },
              { id: 'Low', label: 'Low', count: vulnerabilities.filter((v) => v.severity === 'Low').length, color: 'text-cyan-400' },
              { id: 'Informational', label: 'Info', count: vulnerabilities.filter((v) => v.severity === 'Informational').length, color: 'text-slate-400' },
            ].map((sev) => {
              const active = selectedSeverity === sev.id;
              return (
                <button
                  key={sev.id}
                  onClick={() => setSelectedSeverity(sev.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    active
                      ? 'bg-cyan-600 text-white shadow-sm shadow-cyan-950'
                      : 'bg-[#080c14] border border-[#17233d] text-slate-400 hover:text-white hover:border-[#253a63]'
                  }`}
                >
                  <span className={active ? 'text-white' : sev.color}>{sev.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${active ? 'bg-cyan-950 text-cyan-200' : 'bg-[#17233d] text-slate-400'}`}>
                    {sev.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-[#080c14] border border-[#17233d] rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">Semua Status</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="False Positive">False Positive</option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-xs text-cyan-400 hover:text-cyan-300 ml-2 underline underline-offset-2 transition-colors"
              >
                Reset Filter
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Vulnerabilities List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-[#0c1322] border border-[#17233d] rounded-2xl p-12 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-slate-500 mx-auto" />
            <h3 className="text-sm font-bold text-white">Tidak ada kerentanan yang cocok</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Tidak ditemukan temuan yang memenuhi kriteria pencarian atau filter yang dipilih.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-xl bg-[#17233d] hover:bg-[#1e2f52] text-cyan-400 text-xs font-bold transition-all"
            >
              Tampilkan Semua Temuan
            </button>
          </div>
        ) : (
          filtered.map((vuln) => (
            <div
              key={vuln.id}
              className="group bg-[#0c1322] hover:bg-[#111a2e] border border-[#17233d] hover:border-cyan-500/50 rounded-2xl p-5 shadow-lg transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Left Column: Details */}
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950 px-2.5 py-0.5 rounded-md border border-cyan-800">
                    {vuln.id}
                  </span>

                  {/* Severity Badge */}
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md ${
                    vuln.severity === 'High' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                    vuln.severity === 'Medium' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                    vuln.severity === 'Low' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' :
                    'bg-slate-800 text-slate-300'
                  }`}>
                    {vuln.severity} Risk &bull; CVSS {vuln.cvss}
                  </span>

                  <span className="text-xs bg-[#080c14] text-slate-300 px-2.5 py-0.5 rounded-md font-mono border border-[#17233d]">
                    {vuln.owaspCategory}: {vuln.owaspName}
                  </span>

                  <span className="text-xs text-slate-400 font-mono">
                    {vuln.sprint}
                  </span>
                </div>

                {/* Title */}
                <h3 
                  onClick={() => onSelectVulnerability(vuln)}
                  className="text-sm sm:text-base font-bold text-white group-hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  {vuln.title}
                </h3>

                {/* Endpoint & Standard */}
                <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs font-mono text-slate-400">
                  <span className="text-slate-500">
                    Endpoint: <strong className="text-slate-300 font-normal">{vuln.target}</strong>
                  </span>
                  <span className="text-slate-600 hidden sm:inline">&bull;</span>
                  <span className="text-slate-400 truncate max-w-sm">
                    {vuln.cwe}
                  </span>
                </div>

                {/* Assigned To & Detect info */}
                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-1">
                  <span>
                    Penanggung Jawab: <span className="text-slate-200 font-medium">{vuln.assignedTo}</span>
                  </span>
                  <span className="text-slate-600">&bull;</span>
                  <span>
                    Terdeteksi: {new Date(vuln.detectedAt).toLocaleDateString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Right Column: Status Selector & Action Buttons */}
              <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-[#17233d]">
                {/* Status Selector Dropdown */}
                <div className="flex items-center gap-1.5">
                  <select
                    value={vuln.status}
                    onChange={(e) => onQuickStatusChange(vuln.id, e.target.value as Status)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-xl border focus:outline-none transition-all ${
                      vuln.status === 'Resolved'
                        ? 'bg-emerald-950/70 text-emerald-300 border-emerald-700'
                        : vuln.status === 'In Progress'
                        ? 'bg-amber-950/70 text-amber-300 border-amber-700'
                        : vuln.status === 'False Positive'
                        ? 'bg-slate-800 text-slate-300 border-slate-700'
                        : 'bg-rose-950/70 text-rose-300 border-rose-700'
                    }`}
                  >
                    <option value="Open">Status: Open</option>
                    <option value="In Progress">Status: In Progress</option>
                    <option value="Resolved">Status: Resolved</option>
                    <option value="False Positive">Status: False Positive</option>
                  </select>
                </div>

                {/* Detail & Blueprint Button */}
                <button
                  onClick={() => onSelectVulnerability(vuln)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs shadow-md shadow-cyan-950 flex items-center gap-1.5 transition-all hover:scale-[1.02] active:scale-95"
                >
                  <FileCode className="w-3.5 h-3.5" />
                  <span>Blueprint Remediasi</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
