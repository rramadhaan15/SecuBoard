import React from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  Layers, 
  Flame, 
  Lock, 
  FileCheck, 
  RefreshCcw,
  Sparkles,
  Server
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell, 
  PieChart, 
  Pie, 
  Legend 
} from 'recharts';
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
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <RefreshCcw className="w-8 h-8 text-cyan-400 animate-spin mx-auto mb-2" />
          <p className="text-slate-400 text-sm">Memuat metrik Business Intelligence...</p>
        </div>
      </div>
    );
  }

  // Prepare data for OWASP chart
  const owaspChartData = Object.entries(metrics.owaspDistribution).map(([code, count]) => {
    const info = categories[code];
    return {
      code,
      name: info ? `${code} - ${info.name}` : code,
      nameShort: code,
      nameId: info ? info.nameId : '',
      count,
      color: info ? info.color : '#38bdf8',
    };
  });

  // Prepare CIA Triad data
  const ciaData = [
    { name: 'Confidentiality (Kerahasiaan)', value: metrics.ciaTriad.confidentiality, color: '#38bdf8' },
    { name: 'Integrity (Integritas Berita)', value: metrics.ciaTriad.integrity, color: '#a855f7' },
    { name: 'Availability (Ketersediaan Portal)', value: metrics.ciaTriad.availability, color: '#f59e0b' },
  ];

  // Prepare Subdomain attack surface data
  const subdomainData = Object.entries(metrics.subdomainCounts).map(([subdomain, count]) => ({
    name: subdomain,
    count,
  }));

  // Top high priority vulnerabilities
  const highPriority = vulnerabilities
    .filter((v) => v.severity === 'High' || v.severity === 'Medium')
    .sort((a, b) => b.cvss - a.cvss)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Top Banner Alert / Value Proposition */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-slate-900 border border-blue-500/30 p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Continuous Security BI
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Terakhir Diperbarui: {new Date(metrics.lastScanTime).toLocaleTimeString('id-ID')} WIB
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Postur Keamanan Siber Portal Berita PT Republika Media Mandiri
            </h1>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              Dashboard intelijen bisnis ini mengotomatisasi pemindaian berkelanjutan berbasis{' '}
              <strong className="text-cyan-300">OWASP ZAP</strong> dan memetakan kerentanan secara terstandar ke{' '}
              <strong className="text-blue-300">OWASP Top 10:2021</strong> guna memberikan rekomendasi mitigasi teknis yang cepat, akurat, dan tepat sasaran.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateToTab('scanner')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all"
            >
              <RefreshCcw className="w-4 h-4" />
              <span>Buka Console Pemindaian</span>
            </button>
            <button
              onClick={() => onNavigateToTab('vulnerabilities')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center gap-2 transition-all"
            >
              <span>Lihat Semua Temuan ({metrics.totalFindings})</span>
              <ArrowUpRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Row 1: KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Security Posture Score */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Security Score</p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-4xl font-extrabold text-white">{metrics.postureScore}</span>
                <span className="text-sm text-slate-400">/ 100</span>
              </div>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-extrabold text-xl shadow-inner ${
              metrics.securityGrade === 'A' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
              metrics.securityGrade === 'B' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
              metrics.securityGrade === 'C' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
              'bg-rose-500/20 text-rose-400 border border-rose-500/30'
            }`}>
              {metrics.securityGrade}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">Tingkat Resolusi:</span>
            <span className="font-semibold text-emerald-400">{metrics.resolutionRate}% Selesai</span>
          </div>
        </div>

        {/* Card 2: High Severity */}
        <div className="bg-slate-900/90 border border-rose-500/20 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5" /> High Risk
              </p>
              <div className="text-4xl font-extrabold text-rose-500 mt-2">
                {metrics.severityCounts.high}
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>SLA Remediasi:</span>
            <span className="font-semibold text-rose-400">&lt; 24 Jam (Kritis)</span>
          </div>
        </div>

        {/* Card 3: Medium Severity */}
        <div className="bg-slate-900/90 border border-amber-500/20 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" /> Medium Risk
              </p>
              <div className="text-4xl font-extrabold text-amber-400 mt-2">
                {metrics.severityCounts.medium}
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>SLA Remediasi:</span>
            <span className="font-semibold text-amber-400">&lt; 72 Jam</span>
          </div>
        </div>

        {/* Card 4: Low & Informational */}
        <div className="bg-slate-900/90 border border-blue-500/20 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" /> Low &amp; Info
              </p>
              <div className="text-4xl font-extrabold text-blue-400 mt-2">
                {metrics.severityCounts.low + metrics.severityCounts.info}
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Info className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Konfigurasi Header:</span>
            <span className="font-semibold text-blue-300">Hardening</span>
          </div>
        </div>

        {/* Card 5: MTTR & SLA Compliance */}
        <div className="bg-slate-900/90 border border-emerald-500/20 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> MTTR Respon
              </p>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-4xl font-extrabold text-emerald-400">{metrics.mttrHours}</span>
                <span className="text-xs text-slate-400">Jam</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Kepatuhan SLA:</span>
            <span className="font-semibold text-emerald-400">{metrics.slaComplianceRate}% Target Tercapai</span>
          </div>
        </div>
      </div>

      {/* Row 2: Charts (OWASP Top 10 + CIA Triad + Subdomain Surface) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* OWASP Top 10:2021 Distribution */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                Distribusi Kerentanan Berdasarkan OWASP Top 10:2021
              </h2>
              <p className="text-xs text-slate-400">
                Klasifikasi risiko internasional sesuai standar penelitian Bab 2.1.4
              </p>
            </div>
            <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md border border-slate-700">
              {owaspChartData.length} Kategori Terdeteksi
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={owaspChartData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
              >
                <XAxis type="number" stroke="#64748b" fontSize={12} allowDecimals={false} />
                <YAxis 
                  dataKey="code" 
                  type="category" 
                  stroke="#94a3b8" 
                  fontSize={12} 
                  tickLine={false} 
                  width={75}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-950 border border-slate-800 p-3 rounded-lg shadow-xl text-xs space-y-1">
                          <p className="font-bold text-white">{data.name}</p>
                          <p className="text-slate-300">{data.nameId}</p>
                          <p className="text-cyan-400 font-semibold">{data.count} Temuan Celah Keamanan</p>
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

          <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap gap-2 text-xs">
            {owaspChartData.map((item) => (
              <span key={item.code} className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-slate-800/60 border border-slate-700/60 text-slate-300">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                <strong className="text-white">{item.code}:</strong> {item.count}
              </span>
            ))}
          </div>
        </div>

        {/* CIA Triad Impact Matrix */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-purple-400" />
                  Dampak CIA Triad
                </h2>
                <p className="text-xs text-slate-400">
                  Prinsip Keamanan Informasi (Bab 2.1.1)
                </p>
              </div>
            </div>

            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ciaData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
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
                          <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-lg shadow-xl text-xs">
                            <p className="font-semibold text-white">{data.name}</p>
                            <p className="text-cyan-400 font-bold">{data.value} Kerentanan Terkait</p>
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
              <div className="flex items-center justify-between text-xs p-2 rounded bg-slate-800/40 border border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
                  <span className="text-slate-300">Confidentiality (Kerahasiaan)</span>
                </div>
                <span className="font-bold text-white">{metrics.ciaTriad.confidentiality}</span>
              </div>

              <div className="flex items-center justify-between text-xs p-2 rounded bg-slate-800/40 border border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                  <span className="text-slate-300">Integrity (Integritas Konten)</span>
                </div>
                <span className="font-bold text-white">{metrics.ciaTriad.integrity}</span>
              </div>

              <div className="flex items-center justify-between text-xs p-2 rounded bg-slate-800/40 border border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                  <span className="text-slate-300">Availability (Ketersediaan Portal)</span>
                </div>
                <span className="font-bold text-white">{metrics.ciaTriad.availability}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 italic">
            *Integritas sangat vital bagi Republika untuk menjamin berita tidak dimanipulasi menjadi hoaks.
          </div>
        </div>
      </div>

      {/* Row 3: Attack Surface Breakdown + Actionable Top Priority Remediations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attack Surface by Subdomain */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Server className="w-4 h-4 text-emerald-400" />
                Attack Surface: Aset Domain Republika
              </h2>
              <p className="text-xs text-slate-400">
                Pemetaan ruang lingkup pengujian (Scope of Testing)
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {subdomainData.map((item) => (
              <div key={item.name} className="p-3 rounded-lg bg-slate-800/50 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono font-medium text-slate-200">{item.name}</span>
                  <p className="text-[11px] text-slate-400">
                    {item.name === 'republika.co.id' ? 'Portal Berita Utama' :
                     item.name === 'retizen.republika.co.id' ? 'Platform Jurnalisme Warga' :
                     item.name === 'ihram.republika.co.id' ? 'Portal Haji & Umroh' :
                     item.name === 'news.republika.co.id' ? 'Kanal Berita Kilat' :
                     'REST API Gateway'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {item.count} Issues
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Metode: Spidering &amp; Active Scan</span>
            <span className="text-cyan-400 font-medium">100% Crawled</span>
          </div>
        </div>

        {/* Actionable High Priority Remediation Quick-Fix */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Prioritas Remediasi Cepat &amp; Tepat Sasaran
              </h2>
              <p className="text-xs text-slate-400">
                Celah berisiko tinggi yang memerlukan tindakan segera oleh Tim IT Republika
              </p>
            </div>
            <button
              onClick={() => onNavigateToTab('vulnerabilities')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
            >
              Lihat Semua &rarr;
            </button>
          </div>

          <div className="space-y-3">
            {highPriority.map((vuln) => (
              <div
                key={vuln.id}
                onClick={() => onSelectVulnerability(vuln)}
                className="group p-4 rounded-xl bg-slate-800/40 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      vuln.severity === 'High' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                      vuln.severity === 'Medium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}>
                      {vuln.severity} (CVSS {vuln.cvss})
                    </span>
                    <span className="text-xs font-mono font-medium text-slate-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                      {vuln.owaspCategory}
                    </span>
                    <span className="text-xs text-slate-400 truncate font-mono">
                      {vuln.subdomain}
                    </span>
                  </div>

                  <h4 className="text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors truncate">
                    {vuln.title}
                  </h4>

                  <p className="text-xs text-slate-400 line-clamp-1">
                    Solusi Cepat: <strong className="text-slate-300">{vuln.remediation.quickFixTitle}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <span className={`text-xs px-2 py-1 rounded font-medium ${
                    vuln.status === 'Resolved' ? 'bg-emerald-500/20 text-emerald-400' :
                    vuln.status === 'In Progress' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-rose-500/20 text-rose-400'
                  }`}>
                    {vuln.status}
                  </span>
                  <button className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-600/20 hover:bg-cyan-600 text-cyan-300 hover:text-white border border-cyan-500/30 transition-all">
                    Lihat Solusi
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
              Tersedia snippet konfigurasi Nginx, Apache, PHP &amp; Node.js
            </span>
            <span className="text-slate-400">Klik item untuk membuka petunjuk patch</span>
          </div>
        </div>
      </div>
    </div>
  );
};
