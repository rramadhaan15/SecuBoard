import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell, 
  PieChart, 
  Pie 
} from 'recharts';
import { 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Terminal, 
  ArrowUpRight, 
  ExternalLink,
  Target,
  FileCode,
  Flame,
  Shield,
  Layers,
  Sparkles
} from 'lucide-react';
import { OverviewMetrics, OWASPCategoryInfo, Vulnerability } from '../types';

interface OverviewViewProps {
  metrics: OverviewMetrics | null;
  categories: Record<string, OWASPCategoryInfo>;
  vulnerabilities: Vulnerability[];
  onSelectVulnerability: (vuln: Vulnerability) => void;
  onNavigateToTab: (tab: string) => void;
  onStartScan: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  metrics,
  categories,
  vulnerabilities,
  onSelectVulnerability,
  onNavigateToTab,
  onStartScan,
}) => {
  if (!metrics) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-3">
        <div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
        <p className="text-slate-400 text-sm font-medium">Memuat metrik Business Intelligence &amp; OWASP ZAP...</p>
      </div>
    );
  }

  // OWASP Chart Data (Colors: Red, Orange, Amber, Cyan, Teal, Slate - Strictly NO PURPLE/INDIGO)
  const owaspChartData = Object.entries(metrics.owaspDistribution).map(([code, count]) => {
    const info = categories[code];
    let cleanColor = '#06b6d4'; // Default cyber cyan
    if (code === 'A03:2021' || code === 'A01:2021') cleanColor = '#ef4444'; // Red for High/Critical
    else if (code === 'A02:2021' || code === 'A07:2021') cleanColor = '#f97316'; // Orange
    else if (code === 'A04:2021') cleanColor = '#eab308'; // Amber
    else if (code === 'A05:2021') cleanColor = '#0284c7'; // Ocean blue
    else if (code === 'A06:2021') cleanColor = '#0d9488'; // Teal
    else if (code === 'A08:2021') cleanColor = '#10b981'; // Emerald
    else if (code === 'A09:2021' || code === 'A10:2021') cleanColor = '#64748b'; // Slate

    return {
      code,
      name: info ? `${code} - ${info.name}` : code,
      nameShort: code,
      nameId: info ? info.nameId : '',
      count,
      color: cleanColor,
    };
  });

  // CIA Triad Data (Cyber Cyan, Emerald, Amber)
  const ciaData = [
    { name: 'Confidentiality (Kerahasiaan)', value: metrics.ciaTriad.confidentiality, color: '#06b6d4' },
    { name: 'Integrity (Integritas Berita)', value: metrics.ciaTriad.integrity, color: '#10b981' },
    { name: 'Availability (Ketersediaan Portal)', value: metrics.ciaTriad.availability, color: '#f59e0b' },
  ];

  // Attack surface asset labels
  const getSubdomainLabel = (domain: string) => {
    if (domain === 'republika.co.id') return 'Portal Berita Utama';
    if (domain === 'retizen.republika.co.id') return 'Jurnalisme Warga Retizen';
    if (domain === 'ihram.republika.co.id') return 'Kanal Khusus Haji & Umrah';
    if (domain === 'news.republika.co.id') return 'Kanal Berita Terkini';
    if (domain === 'api.republika.co.id') return 'API Gateway & Services';
    return 'Digital Media Asset';
  };

  // Top high priority vulnerabilities
  const highPriority = vulnerabilities
    .filter((v) => v.severity === 'High' || v.severity === 'Medium')
    .sort((a, b) => b.cvss - a.cvss)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Hero Intelligence Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0c1322] via-[#111a2e] to-[#0c1322] border border-[#17233d] p-6 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-cyan-400 bg-cyan-950/80 px-2.5 py-0.5 rounded-full border border-cyan-800">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                Continuous Security Intelligence
              </span>
              <span className="text-xs text-slate-400 font-mono bg-[#080c14]/70 px-2.5 py-0.5 rounded border border-[#17233d]">
                Update Terakhir: {new Date(metrics.lastScanTime).toLocaleTimeString('id-ID')} WIB
              </span>
              <span className="text-xs text-emerald-400 font-mono bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-800 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                ZAP Engine Ready
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Postur Keamanan Siber Portal Berita PT Republika Media Mandiri
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Dashboard intelijen bisnis otomatis berbasis OWASP ZAP memetakan kerentanan secara terstandar ke OWASP Top 10:2021 guna memberikan rekomendasi mitigasi teknis yang cepat, akurat, dan tepat sasaran bagi ekosistem digital media massa.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => onNavigateToTab('scanner')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs shadow-md shadow-cyan-950 transition-all hover:scale-[1.02] active:scale-95"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Buka Konsol Pemindaian</span>
            </button>
            <button
              onClick={() => onNavigateToTab('vulnerabilities')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#111a2e] hover:bg-[#17233d] text-slate-200 border border-[#1e2f52] hover:border-cyan-500/50 font-medium text-xs transition-all hover:scale-[1.02] active:scale-95"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
              <span>Lihat Semua Temuan ({metrics.totalFindings})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Row 1: KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Security Posture Score */}
        <div className="group bg-[#0c1322] hover:bg-[#111a2e] border border-[#17233d] hover:border-cyan-500/40 rounded-xl p-5 shadow-lg transition-all duration-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Security Score
              </span>
              <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-800 flex items-center justify-center text-cyan-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono">{metrics.postureScore}</span>
              <span className="text-xs text-slate-500 font-medium">/ 100</span>
              <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                Grade {metrics.securityGrade}
              </span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#17233d] flex items-center justify-between text-xs">
            <span className="text-slate-400">Resolusi Temuan:</span>
            <span className="font-bold text-emerald-400">{metrics.resolutionRate}% Selesai</span>
          </div>
        </div>

        {/* Card 2: High Severity */}
        <div className="group bg-[#0c1322] hover:bg-[#111a2e] border border-[#17233d] hover:border-rose-500/40 rounded-xl p-5 shadow-lg transition-all duration-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider">
                High Risk (Kritis)
              </span>
              <div className="w-8 h-8 rounded-lg bg-rose-950/80 border border-rose-800 flex items-center justify-center text-rose-400">
                <Flame className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-rose-500 mt-2 font-mono">
              {metrics.severityCounts.high}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#17233d] flex items-center justify-between text-xs text-slate-400">
            <span>Batas Waktu SLA:</span>
            <span className="font-bold text-rose-400">&lt; 24 Jam</span>
          </div>
        </div>

        {/* Card 3: Medium Severity */}
        <div className="group bg-[#0c1322] hover:bg-[#111a2e] border border-[#17233d] hover:border-amber-500/40 rounded-xl p-5 shadow-lg transition-all duration-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                Medium Risk
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-950/80 border border-amber-800 flex items-center justify-center text-amber-400">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-amber-400 mt-2 font-mono">
              {metrics.severityCounts.medium}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#17233d] flex items-center justify-between text-xs text-slate-400">
            <span>Batas Waktu SLA:</span>
            <span className="font-bold text-amber-400">&lt; 72 Jam</span>
          </div>
        </div>

        {/* Card 4: Low & Info */}
        <div className="group bg-[#0c1322] hover:bg-[#111a2e] border border-[#17233d] hover:border-cyan-500/40 rounded-xl p-5 shadow-lg transition-all duration-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
                Low &amp; Hardening
              </span>
              <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-800 flex items-center justify-center text-cyan-400">
                <Shield className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-cyan-400 mt-2 font-mono">
              {metrics.severityCounts.low + metrics.severityCounts.info}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#17233d] flex items-center justify-between text-xs text-slate-400">
            <span>Fokus:</span>
            <span className="font-semibold text-slate-300">Security Headers</span>
          </div>
        </div>

        {/* Card 5: MTTR & SLA Compliance */}
        <div className="group bg-[#0c1322] hover:bg-[#111a2e] border border-[#17233d] hover:border-emerald-500/40 rounded-xl p-5 shadow-lg transition-all duration-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                MTTR Respon
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-800 flex items-center justify-center text-emerald-400">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-mono">{metrics.mttrHours}</span>
              <span className="text-xs text-slate-400 font-medium">Jam</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#17233d] flex items-center justify-between text-xs text-slate-400">
            <span>Kepatuhan SLA:</span>
            <span className="font-bold text-emerald-400">{metrics.slaComplianceRate}% Target</span>
          </div>
        </div>
      </div>

      {/* Row 2: Charts (OWASP Top 10 Distribution + CIA Triad Matrix) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* OWASP Top 10:2021 Distribution */}
        <div className="lg:col-span-2 bg-[#0c1322] border border-[#17233d] rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#17233d] gap-2">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  Distribusi Kerentanan Berdasarkan OWASP Top 10:2021
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Klasifikasi risiko internasional sesuai standar penelitian Bab 2.1.4
                </p>
              </div>
              <span className="text-xs bg-[#111a2e] text-cyan-300 px-3 py-1 rounded-full border border-[#1e2f52] font-medium self-start sm:self-auto">
                {owaspChartData.length} Kategori Terdeteksi
              </span>
            </div>

            <div className="h-64 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={owaspChartData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                >
                  <XAxis type="number" stroke="#64748b" fontSize={11} allowDecimals={false} />
                  <YAxis 
                    dataKey="code" 
                    type="category" 
                    stroke="#94a3b8" 
                    fontSize={11} 
                    tickLine={false} 
                    width={75}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(6, 182, 212, 0.05)' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-[#080c14] border border-[#1e2f52] p-3 rounded-xl shadow-2xl text-xs space-y-1">
                            <p className="font-bold text-white">{data.name}</p>
                            <p className="text-slate-400">{data.nameId}</p>
                            <div className="flex items-center gap-2 pt-1 border-t border-[#17233d]">
                              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: data.color }}></span>
                              <span className="text-cyan-400 font-bold">{data.count} Temuan Celah</span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                    {owaspChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-[#17233d] flex flex-wrap gap-2 text-xs">
            {owaspChartData.map((item) => (
              <span key={item.code} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#080c14] border border-[#17233d] text-slate-300">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                <strong className="text-white">{item.code}:</strong> {item.count}
              </span>
            ))}
          </div>
        </div>

        {/* CIA Triad Impact Matrix */}
        <div className="bg-[#0c1322] border border-[#17233d] rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="pb-4 border-b border-[#17233d]">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-400" />
                Dampak CIA Triad
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Prinsip Keamanan Informasi Utama (Bab 2.1.1)
              </p>
            </div>

            <div className="h-48 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ciaData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={75}
                    paddingAngle={4}
                  >
                    {ciaData.map((entry, index) => (
                      <Cell key={`pie-cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0];
                        return (
                          <div className="bg-[#080c14] border border-[#1e2f52] p-2.5 rounded-xl shadow-2xl text-xs">
                            <p className="font-semibold text-white">{data.name}</p>
                            <p className="text-cyan-400 font-bold mt-1">{data.value} Kerentanan Terkait</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2 mt-2">
              <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-[#080c14] border border-[#17233d]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span>
                  <span className="text-slate-300">Confidentiality (Kerahasiaan)</span>
                </div>
                <span className="font-bold text-white font-mono">{metrics.ciaTriad.confidentiality}</span>
              </div>

              <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-[#080c14] border border-[#17233d]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span className="text-slate-300">Integrity (Integritas Berita)</span>
                </div>
                <span className="font-bold text-white font-mono">{metrics.ciaTriad.integrity}</span>
              </div>

              <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-[#080c14] border border-[#17233d]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <span className="text-slate-300">Availability (Ketersediaan Portal)</span>
                </div>
                <span className="font-bold text-white font-mono">{metrics.ciaTriad.availability}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#17233d] text-[11px] text-slate-400">
            *Integritas sangat krusial bagi Republika untuk menjamin konten berita bebas dari manipulasi atau hoaks publik.
          </div>
        </div>
      </div>

      {/* Row 3: Attack Surface + Actionable Top Priority Remediations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attack Surface by Subdomain */}
        <div className="bg-[#0c1322] border border-[#17233d] rounded-2xl p-6 shadow-xl space-y-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-cyan-400" />
              Attack Surface: Aset Domain Republika
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Pemetaan ruang lingkup pengujian (Scope of Testing)
            </p>
          </div>

          <div className="space-y-2.5">
            {Object.entries(metrics.subdomainCounts).map(([subdomain, count]) => (
              <div 
                key={subdomain} 
                className="p-3 rounded-xl bg-[#080c14] border border-[#17233d] hover:border-cyan-500/40 transition-all flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span className="text-xs font-bold text-white font-mono">{subdomain}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{getSubdomainLabel(subdomain)}</p>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono">
                  {count} Temuan
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Metode: Spidering &amp; Passive Scan</span>
            <span className="text-cyan-400 font-medium">5 Subdomain Aktif</span>
          </div>
        </div>

        {/* Actionable Top Priority Remediations */}
        <div className="lg:col-span-2 bg-[#0c1322] border border-[#17233d] rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#17233d]">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-rose-500" />
                Prioritas Mitigasi Segera (Actionable Remediations)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Temuan dengan risiko tertinggi yang memerlukan tindakan teknis secepatnya
              </p>
            </div>
            <button
              onClick={() => onNavigateToTab('vulnerabilities')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 transition-colors"
            >
              Lihat Semua <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {highPriority.map((vuln) => (
              <div
                key={vuln.id}
                onClick={() => onSelectVulnerability(vuln)}
                className="group p-4 rounded-xl bg-[#080c14] border border-[#17233d] hover:border-cyan-500/50 hover:bg-[#111a2e]/60 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[11px] font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                      {vuln.id}
                    </span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                      vuln.severity === 'High' 
                        ? 'bg-rose-950 text-rose-300 border border-rose-800' 
                        : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}>
                      {vuln.severity} (CVSS {vuln.cvss})
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {vuln.owaspCategory}: {vuln.owaspName}
                    </span>
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                    {vuln.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono truncate">
                    Endpoint: {vuln.target}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                    vuln.status === 'Resolved' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                    vuln.status === 'In Progress' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                    'bg-rose-950/70 text-rose-300 border border-rose-800'
                  }`}>
                    {vuln.status}
                  </span>
                  <button className="px-3 py-1.5 rounded-lg bg-cyan-600/20 group-hover:bg-cyan-600 text-cyan-300 group-hover:text-white font-medium text-xs border border-cyan-500/30 transition-all flex items-center gap-1">
                    <FileCode className="w-3.5 h-3.5" />
                    <span>Blueprint</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
