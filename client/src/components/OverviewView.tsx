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
        <p className="text-slate-400 text-sm">Memuat metrik Business Intelligence...</p>
      </div>
    );
  }

  // OWASP Chart Data (Strictly without purple)
  const owaspChartData = Object.entries(metrics.owaspDistribution).map(([code, count]) => {
    const info = categories[code];
    let cleanColor = '#0ea5e9'; // Default sky blue
    if (code === 'A03:2021' || code === 'A01:2021') cleanColor = '#ef4444'; // Red for High
    else if (code === 'A05:2021') cleanColor = '#0284c7'; // Steel blue
    else if (code === 'A06:2021') cleanColor = '#0d9488'; // Teal
    else if (code === 'A07:2021') cleanColor = '#ea580c'; // Orange

    return {
      code,
      name: info ? `${code} - ${info.name}` : code,
      nameShort: code,
      nameId: info ? info.nameId : '',
      count,
      color: cleanColor,
    };
  });

  // CIA Triad Data (Strictly without purple: Sky Blue, Teal, Amber)
  const ciaData = [
    { name: 'Confidentiality (Kerahasiaan)', value: metrics.ciaTriad.confidentiality, color: '#0284c7' },
    { name: 'Integrity (Integritas Berita)', value: metrics.ciaTriad.integrity, color: '#059669' },
    { name: 'Availability (Ketersediaan Portal)', value: metrics.ciaTriad.availability, color: '#d97706' },
  ];

  // Subdomain attack surface data
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
      {/* Top Banner (Clean Dark Solid Card, No Purple/Indigo Gradient) */}
      <div className="rounded-xl bg-slate-900 border border-slate-800 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-sky-400 bg-sky-950/80 px-2.5 py-0.5 rounded border border-sky-800">
                Continuous Security BI
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Pembaruan: {new Date(metrics.lastScanTime).toLocaleTimeString('id-ID')} WIB
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Postur Keamanan Siber Portal Berita PT Republika Media Mandiri
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Dashboard intelijen bisnis otomatis berbasis OWASP ZAP memetakan kerentanan secara terstandar ke OWASP Top 10:2021 guna memberikan rekomendasi mitigasi teknis yang cepat, akurat, dan tepat sasaran.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => onNavigateToTab('scanner')}
              className="px-3.5 py-2 rounded-md bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs shadow-sm transition-all"
            >
              Buka Console Pemindaian
            </button>
            <button
              onClick={() => onNavigateToTab('vulnerabilities')}
              className="px-3.5 py-2 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-xs transition-all"
            >
              Lihat Semua Temuan ({metrics.totalFindings})
            </button>
          </div>
        </div>
      </div>

      {/* Row 1: KPI Summary Cards (Minimalist, No Icon Spam) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Security Posture Score */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Security Score
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl sm:text-4xl font-bold text-white font-mono">{metrics.postureScore}</span>
              <span className="text-xs text-slate-500">/ 100</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">Status Resolusi:</span>
            <span className="font-semibold text-emerald-400">{metrics.resolutionRate}% Selesai</span>
          </div>
        </div>

        {/* Card 2: High Severity */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider block">
              High Risk (Kritis)
            </span>
            <div className="text-3xl sm:text-4xl font-bold text-rose-500 mt-2 font-mono">
              {metrics.severityCounts.high}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Batas SLA:</span>
            <span className="font-semibold text-rose-400">&lt; 24 Jam</span>
          </div>
        </div>

        {/* Card 3: Medium Severity */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider block">
              Medium Risk
            </span>
            <div className="text-3xl sm:text-4xl font-bold text-amber-400 mt-2 font-mono">
              {metrics.severityCounts.medium}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Batas SLA:</span>
            <span className="font-semibold text-amber-400">&lt; 72 Jam</span>
          </div>
        </div>

        {/* Card 4: Low & Info */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-semibold text-sky-400 uppercase tracking-wider block">
              Low &amp; Informational
            </span>
            <div className="text-3xl sm:text-4xl font-bold text-sky-400 mt-2 font-mono">
              {metrics.severityCounts.low + metrics.severityCounts.info}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Kategori:</span>
            <span className="font-semibold text-slate-300">Hardening Header</span>
          </div>
        </div>

        {/* Card 5: MTTR */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block">
              MTTR Respon
            </span>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-3xl sm:text-4xl font-bold text-emerald-400 font-mono">{metrics.mttrHours}</span>
              <span className="text-xs text-slate-400">Jam</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Kepatuhan SLA:</span>
            <span className="font-semibold text-emerald-400">{metrics.slaComplianceRate}% Target</span>
          </div>
        </div>
      </div>

      {/* Row 2: Charts (OWASP Top 10 + CIA Triad) - Clean Minimalist Styling */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* OWASP Top 10:2021 Distribution */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-white">
                Distribusi Kerentanan Berdasarkan OWASP Top 10:2021
              </h2>
              <p className="text-xs text-slate-400">
                Klasifikasi risiko internasional sesuai standar penelitian Bab 2.1.4
              </p>
            </div>
            <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded border border-slate-700">
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
                        <div className="bg-slate-950 border border-slate-800 p-3 rounded shadow text-xs space-y-1">
                          <p className="font-bold text-white">{data.name}</p>
                          <p className="text-slate-300">{data.nameId}</p>
                          <p className="text-sky-400 font-semibold">{data.count} Temuan</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {owaspChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap gap-2 text-xs">
            {owaspChartData.map((item) => (
              <span key={item.code} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                <strong className="text-white">{item.code}:</strong> {item.count}
              </span>
            ))}
          </div>
        </div>

        {/* CIA Triad Impact Matrix (NO PURPLE) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="mb-4">
              <h2 className="text-sm font-bold text-white">
                Dampak CIA Triad
              </h2>
              <p className="text-xs text-slate-400">
                Prinsip Keamanan Informasi (Bab 2.1.1)
              </p>
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
                    outerRadius={78}
                    paddingAngle={3}
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
                          <div className="bg-slate-950 border border-slate-800 p-2.5 rounded shadow text-xs">
                            <p className="font-semibold text-white">{data.name}</p>
                            <p className="text-sky-400 font-bold">{data.value} Kerentanan Terkait</p>
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
              <div className="flex items-center justify-between text-xs p-2 rounded bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
                  <span className="text-slate-300">Confidentiality (Kerahasiaan)</span>
                </div>
                <span className="font-bold text-white font-mono">{metrics.ciaTriad.confidentiality}</span>
              </div>

              <div className="flex items-center justify-between text-xs p-2 rounded bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span className="text-slate-300">Integrity (Integritas Berita)</span>
                </div>
                <span className="font-bold text-white font-mono">{metrics.ciaTriad.integrity}</span>
              </div>

              <div className="flex items-center justify-between text-xs p-2 rounded bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <span className="text-slate-300">Availability (Ketersediaan Portal)</span>
                </div>
                <span className="font-bold text-white font-mono">{metrics.ciaTriad.availability}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
            *Integritas sangat krusial bagi Republika untuk menjamin konten berita bebas dari manipulasi atau hoaks.
          </div>
        </div>
      </div>

      {/* Row 3: Attack Surface + Actionable Top Priority Remediations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attack Surface by Subdomain */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="mb-4">
            <h2 className="text-sm font-bold text-white">
              Attack Surface: Aset Domain Republika
            </h2>
            <p className="text-xs text-slate-400">
              Pemetaan ruang lingkup pengujian (Scope of Testing)
            </p>
          </div>

          <div className="space-y-2.5">
            {subdomainData.map((item) => (
              <div key={item.name} className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
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
                <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {item.count} Issues
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Metode: Spidering &amp; Active Scan</span>
            <span className="text-emerald-400 font-medium">100% Crawled</span>
          </div>
        </div>

        {/* Priority Remediations (Clean list) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-white">
                Prioritas Remediasi Cepat &amp; Tepat Sasaran
              </h2>
              <p className="text-xs text-slate-400">
                Celah berisiko tinggi yang memerlukan tindakan segera oleh Tim IT Republika
              </p>
            </div>
            <button
              onClick={() => onNavigateToTab('vulnerabilities')}
              className="text-xs text-sky-400 hover:text-sky-300 font-medium"
            >
              Lihat Semua
            </button>
          </div>

          <div className="space-y-3">
            {highPriority.map((vuln) => (
              <div
                key={vuln.id}
                onClick={() => onSelectVulnerability(vuln)}
                className="group p-3.5 rounded-lg bg-slate-950 hover:bg-slate-800/60 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                      vuln.severity === 'High' ? 'bg-rose-950/80 text-rose-300 border border-rose-800' :
                      vuln.severity === 'Medium' ? 'bg-amber-950/80 text-amber-300 border border-amber-800' :
                      'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}>
                      {vuln.severity} (CVSS {vuln.cvss})
                    </span>
                    <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      {vuln.owaspCategory}
                    </span>
                    <span className="text-xs text-slate-400 truncate font-mono">
                      {vuln.subdomain}
                    </span>
                  </div>

                  <h4 className="text-sm font-semibold text-white group-hover:text-sky-400 transition-colors truncate">
                    {vuln.title}
                  </h4>

                  <p className="text-xs text-slate-400 line-clamp-1">
                    Solusi: <span className="text-slate-300">{vuln.remediation.quickFixTitle}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <span className={`text-xs px-2 py-1 rounded font-medium ${
                    vuln.status === 'Resolved' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                    vuln.status === 'In Progress' ? 'bg-sky-950 text-sky-400 border border-sky-800' :
                    'bg-rose-950 text-rose-400 border border-rose-800'
                  }`}>
                    {vuln.status}
                  </span>
                  <button className="px-3 py-1.5 rounded text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all">
                    Lihat Solusi
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Tersedia snippet konfigurasi Nginx, Apache, PHP &amp; Node.js</span>
            <span className="text-slate-500">Klik item untuk membuka petunjuk patch</span>
          </div>
        </div>
      </div>
    </div>
  );
};
