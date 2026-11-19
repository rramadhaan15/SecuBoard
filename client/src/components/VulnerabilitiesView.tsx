import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Vulnerability, OWASPCategoryInfo, Status } from '../types';

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
      {/* Page Header: High legibility */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wide text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
              Vulnerability Management
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-sans">
            Katalog Temuan Kerentanan &amp; Blueprint Remediasi
          </h2>
          <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
            Daftar komprehensif celah keamanan terdeteksi pada ekosistem digital Republika berdasarkan standar OWASP Top 10:2021. Klik blueprint untuk melihat langkah patch teknis dan konfigurasi web server.
          </p>
        </div>

        {/* Metric Badges */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center min-w-[85px]">
            <span className="text-xs text-slate-600 block font-semibold">Total</span>
            <p className="text-xl font-extrabold text-slate-900 font-mono">{vulnerabilities.length}</p>
          </div>
          <div className="px-4 py-2.5 rounded-xl bg-rose-50 border border-rose-200 text-center min-w-[85px]">
            <span className="text-xs text-rose-700 font-bold block">High Risk</span>
            <p className="text-xl font-extrabold text-rose-600 font-mono">
              {vulnerabilities.filter((v) => v.severity === 'High').length}
            </p>
          </div>
          <div className="px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-center min-w-[85px]">
            <span className="text-xs text-emerald-700 font-bold block">Resolved</span>
            <p className="text-xl font-extrabold text-emerald-600 font-mono">
              {vulnerabilities.filter((v) => v.status === 'Resolved').length}
            </p>
          </div>
        </div>
      </div>

      {/* Filter Toolbar: Spacious & Easy to Read */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari celah (nama kerentanan, endpoint URL, CWE, payload)..."
              className="w-full bg-white border border-slate-300 rounded-lg pl-10 pr-9 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-xs transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Subdomain Filter */}
          <div>
            <select
              value={selectedSubdomain}
              onChange={(e) => setSelectedSubdomain(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-blue-500 font-medium shadow-xs"
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
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-blue-500 font-medium shadow-xs"
            >
              <option value="ALL">Semua Kategori OWASP</option>
              {Object.entries(categories).map(([code, info]) => (
                <option key={code} value={code}>
                  {code} - {info.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Severity Chips & Status Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          {/* Severity Badges Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-600 mr-1 uppercase tracking-wider">
              Severity:
            </span>
            {[
              { id: 'ALL', label: 'Semua', count: vulnerabilities.length },
              { id: 'High', label: 'High', count: vulnerabilities.filter((v) => v.severity === 'High').length, color: 'text-rose-700' },
              { id: 'Medium', label: 'Medium', count: vulnerabilities.filter((v) => v.severity === 'Medium').length, color: 'text-amber-700' },
              { id: 'Low', label: 'Low', count: vulnerabilities.filter((v) => v.severity === 'Low').length, color: 'text-blue-700' },
              { id: 'Informational', label: 'Info', count: vulnerabilities.filter((v) => v.severity === 'Informational').length, color: 'text-slate-600' },
            ].map((sev) => {
              const active = selectedSeverity === sev.id;
              return (
                <button
                  key={sev.id}
                  onClick={() => setSelectedSeverity(sev.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                    active
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span className={active ? 'text-white' : sev.color}>{sev.label}</span>
                  <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-mono ${active ? 'bg-white text-blue-700' : 'bg-slate-200 text-slate-700'}`}>
                    {sev.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-semibold"
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
                className="text-xs text-blue-600 hover:text-blue-800 font-bold ml-2 underline underline-offset-2 transition-colors"
              >
                Reset Filter
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Vulnerabilities List: Spacious, Clear Typography, Comfortable Reading */}
      <div className="space-y-3.5">
        {filtered.length === 0 ? (
          <div className="bg-white border border-slate-200/90 rounded-xl p-12 text-center space-y-3 shadow-xs">
            <h3 className="text-base font-bold text-slate-900">Tidak ada kerentanan yang cocok</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Tidak ditemukan temuan yang memenuhi kriteria pencarian atau filter yang dipilih.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold shadow-xs hover:bg-blue-700 transition-all"
            >
              Tampilkan Semua Temuan
            </button>
          </div>
        ) : (
          filtered.map((vuln) => (
            <div
              key={vuln.id}
              className="group bg-white hover:border-blue-400 border border-slate-200/90 rounded-xl p-5 shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Left Column: Details */}
              <div className="space-y-2.5 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200">
                    {vuln.id}
                  </span>

                  {/* Severity Badge */}
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded ${
                    vuln.severity === 'High' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                    vuln.severity === 'Medium' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                    vuln.severity === 'Low' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                    'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}>
                    {vuln.severity} &bull; CVSS {vuln.cvss}
                  </span>

                  <span className="text-xs bg-slate-50 text-slate-800 px-2.5 py-0.5 rounded font-mono border border-slate-200 font-semibold">
                    {vuln.owaspCategory}: {vuln.owaspName}
                  </span>

                  <span className="text-xs text-slate-500 font-mono font-medium">
                    {vuln.sprint}
                  </span>
                </div>

                {/* Title */}
                <h3 
                  onClick={() => onSelectVulnerability(vuln)}
                  className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors cursor-pointer leading-snug"
                >
                  {vuln.title}
                </h3>

                {/* Endpoint & CWE */}
                <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-600">
                  <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg font-mono text-xs text-slate-800 font-medium truncate max-w-xl">
                    Target: <span className="text-blue-700 font-semibold">{vuln.target}</span>
                  </div>
                  <span className="text-slate-300 hidden sm:inline">&bull;</span>
                  <span className="truncate max-w-sm text-slate-600 font-mono text-xs">
                    {vuln.cwe}
                  </span>
                </div>

                {/* Assigned To & Detect info */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-0.5">
                  <span>
                    PIC Tim: <span className="text-slate-800 font-bold">{vuln.assignedTo}</span>
                  </span>
                  <span className="text-slate-300">&bull;</span>
                  <span>
                    Terdeteksi: <strong className="text-slate-700 font-semibold">{new Date(vuln.detectedAt).toLocaleDateString('id-ID')}</strong>
                  </span>
                </div>
              </div>

              {/* Right Column: Status Selector & Action Buttons (Uniform Width & Height) */}
              <div className="flex flex-col items-stretch sm:items-end justify-center gap-2 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 w-full sm:w-auto">
                {/* Status Selector Dropdown */}
                <div className="w-full sm:w-48">
                  <select
                    value={vuln.status}
                    onChange={(e) => onQuickStatusChange(vuln.id, e.target.value as Status)}
                    className={`w-full h-9 text-xs font-bold px-3 rounded-lg border focus:outline-none transition-all cursor-pointer ${
                      vuln.status === 'Resolved'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100/70'
                        : vuln.status === 'In Progress'
                        ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100/70'
                        : vuln.status === 'False Positive'
                        ? 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200/70'
                        : 'bg-rose-50 text-rose-800 border-rose-300 hover:bg-rose-100/70'
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
                  className="w-full sm:w-48 h-9 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
                >
                  <span>Blueprint Remediasi</span>
                  <span>&rarr;</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
