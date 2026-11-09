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
  Clock, 
  Terminal, 
  ArrowUpRight, 
  Target, 
  FileCode, 
  Flame, 
  Shield, 
  Layers, 
  Sparkles,
  ExternalLink
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
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-slate-600 text-sm font-semibold tracking-wide">
          Memuat metrik Business Intelligence &amp; OWASP ZAP...
        </p>
      </div>
    );
  }

  // OWASP Chart Data (Strictly ZERO Purple: Red, Orange, Amber, Blue, Teal, Emerald, Slate)
  const owaspChartData = Object.entries(metrics.owaspDistribution).map(([code, count]) => {
    const info = categories[code];
    let cleanColor = '#0284c7'; // Ocean blue
    if (code === 'A03:2021' || code === 'A01:2021') cleanColor = '#dc2626'; // Red for High
    else if (code === 'A02:2021' || code === 'A07:2021') cleanColor = '#ea580c'; // Orange
    else if (code === 'A04:2021') cleanColor = '#d97706'; // Amber
    else if (code === 'A05:2021') cleanColor = '#2563eb'; // Blue
    else if (code === 'A06:2021') cleanColor = '#0d9488'; // Teal
    else if (code === 'A08:2021') cleanColor = '#059669'; // Emerald
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

  // CIA Triad Data (Blue, Emerald, Amber)
  const ciaData = [
    { name: 'Confidentiality (Kerahasiaan)', value: metrics.ciaTriad.confidentiality, color: '#0284c7' },
    { name: 'Integrity (Integritas Berita)', value: metrics.ciaTriad.integrity, color: '#059669' },
    { name: 'Availability (Ketersediaan Portal)', value: metrics.ciaTriad.availability, color: '#d97706' },
  ];

  const getSubdomainLabel = (domain: string) => {
    if (domain === 'republika.co.id') return 'Portal Berita Utama';
    if (domain === 'retizen.republika.co.id') return 'Jurnalisme Warga Retizen';
    if (domain === 'ihram.republika.co.id') return 'Kanal Khusus Haji & Umrah';
    if (domain === 'news.republika.co.id') return 'Kanal Berita Terkini';
    if (domain === 'api.republika.co.id') return 'API Gateway & Services';
    return 'Digital Media Asset';
  };

  const highPriority = vulnerabilities
    .filter((v) => v.severity === 'High' || v.severity === 'Medium')
    .sort((a, b) => b.cvss - a.cvss)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Hero Intelligence Header Banner (Light Crisp Gradient) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-50 via-white to-sky-50 border border-blue-200/80 p-6 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-blue-700 bg-blue-100/80 px-3 py-1 rounded-full border border-blue-300 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                Continuous Security Intelligence &bull; SecuBoard v2.0
              </span>
              <span className="text-xs text-slate-600 font-mono bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
                Pembaruan: {new Date(metrics.lastScanTime).toLocaleTimeString('id-ID')} WIB
              </span>
              <span className="text-xs text-emerald-800 font-mono bg-emerald-50 px-3 py-1 rounded-full border border-emerald-300 flex items-center gap-1.5 shadow-sm font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                ZAP Engine Online
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Postur Keamanan Siber Portal Berita PT Republika Media Mandiri
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Dashboard intelijen bisnis otomatis berbasis OWASP ZAP memetakan kerentanan secara terstandar ke OWASP Top 10:2021 guna memberikan rekomendasi mitigasi teknis yang cepat, akurat, dan tepat sasaran bagi ekosistem digital media massa.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigateToTab('scanner')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-95"
            >
              <Terminal className="w-4 h-4 text-white" />
              <span>Buka Konsol Pemindaian</span>
            </button>
            <button
              onClick={() => onNavigateToTab('vulnerabilities')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs transition-all hover:scale-[1.02] active:scale-95 shadow-sm"
            >
              <ShieldAlert className="w-4 h-4 text-blue-600" />
              <span>Katalog Temuan ({metrics.totalFindings})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Row 1: KPI Summary Cards (Crisp White with Thick Colored Accent Borders) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Security Posture Score */}
        <div className="bg-white border border-slate-200 border-l-4 border-l-blue-600 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-blue-700 uppercase tracking-wider">
                Security Score
              </span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-sm">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono">{metrics.postureScore}</span>
              <span className="text-xs text-slate-500 font-semibold">/ 100</span>
              <span className="ml-auto text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300 shadow-sm">
                Grade {metrics.securityGrade}
              </span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Resolusi Temuan:</span>
            <span className="font-extrabold text-emerald-600">{metrics.resolutionRate}% Selesai</span>
          </div>
        </div>

        {/* Card 2: High Severity */}
        <div className="bg-white border border-slate-200 border-l-4 border-l-rose-600 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-rose-700 uppercase tracking-wider">
                High Risk (Kritis)
              </span>
              <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shadow-sm">
                <Flame className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-rose-600 mt-2 font-mono">
              {metrics.severityCounts.high}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium">Batas Waktu SLA:</span>
            <span className="font-extrabold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
              &lt; 24 Jam
            </span>
          </div>
        </div>

        {/* Card 3: Medium Severity */}
        <div className="bg-white border border-slate-200 border-l-4 border-l-amber-500 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-amber-700 uppercase tracking-wider">
                Medium Risk
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-sm">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-amber-600 mt-2 font-mono">
              {metrics.severityCounts.medium}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium">Batas Waktu SLA:</span>
            <span className="font-extrabold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              &lt; 72 Jam
            </span>
          </div>
        </div>

        {/* Card 4: Low & Info */}
        <div className="bg-white border border-slate-200 border-l-4 border-l-sky-500 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-sky-700 uppercase tracking-wider">
                Low &amp; Hardening
              </span>
              <div className="w-8 h-8 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 shadow-sm">
                <Shield className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-sky-600 mt-2 font-mono">
              {metrics.severityCounts.low + metrics.severityCounts.info}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium">Fokus Mitigasi:</span>
            <span className="font-bold text-slate-700">Security Headers</span>
          </div>
        </div>

        {/* Card 5: MTTR & SLA Compliance */}
        <div className="bg-white border border-slate-200 border-l-4 border-l-emerald-600 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-emerald-700 uppercase tracking-wider">
                MTTR Respon
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-sm">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-emerald-600 font-mono">{metrics.mttrHours}</span>
              <span className="text-xs text-slate-500 font-bold">Jam</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium">Kepatuhan SLA:</span>
            <span className="font-extrabold text-emerald-700">{metrics.slaComplianceRate}% Target</span>
          </div>
        </div>
      </div>

      {/* Row 2: Charts (White Cards, Clean High-Contrast Charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* OWASP Top 10:2021 Distribution */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-600" />
                  Distribusi Kerentanan Berdasarkan OWASP Top 10:2021
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Klasifikasi risiko internasional sesuai standar penelitian Bab 2.1.4
                </p>
              </div>
              <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-200 font-bold self-start sm:self-auto">
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
                    stroke="#334155" 
                    fontSize={11} 
                    tickLine={false} 
                    width={75}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-xl text-xs space-y-1">
                            <p className="font-bold text-slate-900">{data.name}</p>
                            <p className="text-slate-600">{data.nameId}</p>
                            <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color }}></span>
                              <span className="text-blue-700 font-bold">{data.count} Temuan Celah</span>
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

          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-2 text-xs">
            {owaspChartData.map((item) => (
              <span key={item.code} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                <strong className="text-slate-900">{item.code}:</strong> {item.count}
              </span>
            ))}
          </div>
        </div>

        {/* CIA Triad Impact Matrix */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="pb-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-600" />
                Dampak CIA Triad
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
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
                          <div className="bg-white border border-slate-200 p-2.5 rounded-xl shadow-xl text-xs">
                            <p className="font-bold text-slate-900">{data.name}</p>
                            <p className="text-blue-700 font-bold mt-1">{data.value} Kerentanan Terkait</p>
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
              <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-600"></span>
                  <span className="text-slate-700 font-medium">Confidentiality (Kerahasiaan)</span>
                </div>
                <span className="font-bold text-slate-900 font-mono">{metrics.ciaTriad.confidentiality}</span>
              </div>

              <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                  <span className="text-slate-700 font-medium">Integrity (Integritas Berita)</span>
                </div>
                <span className="font-bold text-slate-900 font-mono">{metrics.ciaTriad.integrity}</span>
              </div>

              <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
                  <span className="text-slate-700 font-medium">Availability (Ketersediaan Portal)</span>
                </div>
                <span className="font-bold text-slate-900 font-mono">{metrics.ciaTriad.availability}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 leading-snug">
            *Integritas sangat krusial bagi Republika untuk menjamin konten berita bebas dari manipulasi atau hoaks publik.
          </div>
        </div>
      </div>

      {/* Row 3: Attack Surface + Actionable Top Priority Remediations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attack Surface by Subdomain */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-600" />
              Attack Surface: Aset Domain Republika
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Pemetaan ruang lingkup pengujian (Scope of Testing)
            </p>
          </div>

          <div className="space-y-2.5">
            {Object.entries(metrics.subdomainCounts).map(([subdomain, count]) => (
              <div 
                key={subdomain} 
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 hover:bg-blue-50/20 transition-all flex items-center justify-between shadow-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="text-xs font-bold text-slate-900 font-mono">{subdomain}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{getSubdomainLabel(subdomain)}</p>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-mono shadow-xs">
                  {count} Temuan
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Metode: Spidering &amp; Passive Scan</span>
            <span className="text-blue-700 font-bold">5 Subdomain Aktif</span>
          </div>
        </div>

        {/* Actionable Top Priority Remediations */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Flame className="w-4 h-4 text-rose-600" />
                Prioritas Mitigasi Segera (Actionable Remediations)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Temuan dengan risiko tertinggi yang memerlukan tindakan teknis secepatnya
              </p>
            </div>
            <button
              onClick={() => onNavigateToTab('vulnerabilities')}
              className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 transition-colors"
            >
              Lihat Semua <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {highPriority.map((vuln) => (
              <div
                key={vuln.id}
                onClick={() => onSelectVulnerability(vuln)}
                className="group p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-400 hover:bg-blue-50/20 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                      {vuln.id}
                    </span>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded ${
                      vuln.severity === 'High' 
                        ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {vuln.severity} (CVSS {vuln.cvss})
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {vuln.owaspCategory}: {vuln.owaspName}
                    </span>
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                    {vuln.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-mono truncate">
                    Endpoint: {vuln.target}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                    vuln.status === 'Resolved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    vuln.status === 'In Progress' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                    'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}>
                    {vuln.status}
                  </span>
                  <button className="px-3.5 py-2 rounded-xl bg-blue-50 group-hover:bg-blue-600 text-blue-700 group-hover:text-white font-bold text-xs border border-blue-200 group-hover:border-blue-600 transition-all flex items-center gap-1.5 shadow-xs">
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
