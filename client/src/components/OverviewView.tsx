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
      <div className="flex flex-col items-center justify-center py-24 space-y-3">
        <div className="w-8 h-8 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-slate-500 text-xs font-medium">
          Memuat data metrik keamanan...
        </p>
      </div>
    );
  }

  // OWASP Chart Data (Strictly clean professional palette: Red, Orange, Amber, Blue, Teal, Emerald, Slate)
  const owaspChartData = Object.entries(metrics.owaspDistribution).map(([code, count]) => {
    const info = categories[code];
    let color = '#2563eb'; // Default blue
    if (code === 'A03:2021' || code === 'A01:2021') color = '#dc2626'; // Red for High
    else if (code === 'A02:2021' || code === 'A07:2021') color = '#ea580c'; // Orange
    else if (code === 'A04:2021') color = '#d97706'; // Amber
    else if (code === 'A05:2021') color = '#0284c7'; // Sky/Blue
    else if (code === 'A06:2021') color = '#0d9488'; // Teal
    else if (code === 'A08:2021') color = '#059669'; // Emerald
    else if (code === 'A09:2021' || code === 'A10:2021') color = '#64748b'; // Slate

    return {
      code,
      name: info ? `${code} - ${info.name}` : code,
      nameShort: code,
      nameId: info ? info.nameId : '',
      count,
      color,
    };
  });

  // CIA Triad Data
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
      {/* Clean Page Header (No Tacky Gradient or Sparkles) */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Executive BI Dashboard
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Pembaruan Terakhir: {new Date(metrics.lastScanTime).toLocaleTimeString('id-ID')} WIB
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Postur Keamanan Siber Portal Berita PT Republika Media Mandiri
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
            Pemantauan kerentanan terstandar OWASP Top 10:2021 dan evaluasi kepatuhan SLA mitigasi untuk seluruh aset digital Republika.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => onNavigateToTab('scanner')}
            className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs transition-colors"
          >
            Konsol Scanner
          </button>
          <button
            onClick={() => onNavigateToTab('vulnerabilities')}
            className="px-3.5 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-medium text-xs transition-colors"
          >
            Semua Temuan ({metrics.totalFindings})
          </button>
        </div>
      </div>

      {/* Row 1: KPI Summary Cards (Clean Minimalist Analytics Style, No Icons) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Security Posture Score */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">
              Security Score
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-bold text-slate-900 font-mono tracking-tight">{metrics.postureScore}</span>
              <span className="text-xs text-slate-400">/ 100</span>
              <span className="ml-auto text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                Grade {metrics.securityGrade}
              </span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Resolusi Temuan:</span>
            <span className="font-semibold text-emerald-600">{metrics.resolutionRate}% Selesai</span>
          </div>
        </div>

        {/* Card 2: High Severity */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-medium text-rose-700 uppercase tracking-wider block">
              High Risk (Kritis)
            </span>
            <div className="text-3xl font-bold text-rose-600 mt-2 font-mono tracking-tight">
              {metrics.severityCounts.high}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Batas SLA:</span>
            <span className="font-semibold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
              &lt; 24 Jam
            </span>
          </div>
        </div>

        {/* Card 3: Medium Severity */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-medium text-amber-700 uppercase tracking-wider block">
              Medium Risk
            </span>
            <div className="text-3xl font-bold text-amber-600 mt-2 font-mono tracking-tight">
              {metrics.severityCounts.medium}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Batas SLA:</span>
            <span className="font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
              &lt; 72 Jam
            </span>
          </div>
        </div>

        {/* Card 4: Low & Info */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-medium text-slate-600 uppercase tracking-wider block">
              Low &amp; Hardening
            </span>
            <div className="text-3xl font-bold text-slate-800 mt-2 font-mono tracking-tight">
              {metrics.severityCounts.low + metrics.severityCounts.info}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Fokus:</span>
            <span className="font-medium text-slate-700">Security Headers</span>
          </div>
        </div>

        {/* Card 5: MTTR & SLA Compliance */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-medium text-slate-600 uppercase tracking-wider block">
              MTTR Respon
            </span>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-3xl font-bold text-slate-900 font-mono tracking-tight">{metrics.mttrHours}</span>
              <span className="text-xs text-slate-500 font-medium">Jam</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Kepatuhan SLA:</span>
            <span className="font-semibold text-emerald-600">{metrics.slaComplianceRate}% Target</span>
          </div>
        </div>
      </div>

      {/* Row 2: Charts (OWASP Top 10 Distribution + CIA Triad Matrix) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* OWASP Top 10:2021 Distribution */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Distribusi Kerentanan Berdasarkan OWASP Top 10:2021
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Klasifikasi risiko internasional sesuai standar penelitian Bab 2.1.4
                </p>
              </div>
              <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded font-medium self-start sm:self-auto border border-slate-200">
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
                  <XAxis type="number" stroke="#94a3b8" fontSize={11} allowDecimals={false} />
                  <YAxis 
                    dataKey="code" 
                    type="category" 
                    stroke="#475569" 
                    fontSize={11} 
                    tickLine={false} 
                    width={75}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(241, 245, 249, 0.6)' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white border border-slate-200 p-2.5 rounded-lg shadow-md text-xs space-y-1">
                            <p className="font-bold text-slate-900">{data.name}</p>
                            <p className="text-slate-600">{data.nameId}</p>
                            <p className="text-blue-600 font-semibold">{data.count} Temuan</p>
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
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-2 text-xs">
            {owaspChartData.map((item) => (
              <span key={item.code} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-50 border border-slate-200 text-slate-700">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                <strong className="text-slate-900">{item.code}:</strong> {item.count}
              </span>
            ))}
          </div>
        </div>

        {/* CIA Triad Impact Matrix */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900">
                Dampak CIA Triad
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Prinsip Keamanan Informasi Utama (Bab 2.1.1)
              </p>
            </div>

            <div className="h-44 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ciaData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
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
                          <div className="bg-white border border-slate-200 p-2 rounded shadow-md text-xs">
                            <p className="font-semibold text-slate-900">{data.name}</p>
                            <p className="text-blue-600 font-bold">{data.value} Kerentanan Terkait</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-1.5 mt-2">
              <div className="flex items-center justify-between text-xs p-2 rounded bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sky-600"></span>
                  <span className="text-slate-700">Confidentiality (Kerahasiaan)</span>
                </div>
                <span className="font-bold text-slate-900 font-mono">{metrics.ciaTriad.confidentiality}</span>
              </div>

              <div className="flex items-center justify-between text-xs p-2 rounded bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  <span className="text-slate-700">Integrity (Integritas Berita)</span>
                </div>
                <span className="font-bold text-slate-900 font-mono">{metrics.ciaTriad.integrity}</span>
              </div>

              <div className="flex items-center justify-between text-xs p-2 rounded bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                  <span className="text-slate-700">Availability (Ketersediaan Portal)</span>
                </div>
                <span className="font-bold text-slate-900 font-mono">{metrics.ciaTriad.availability}</span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-500 leading-snug">
            *Integritas sangat krusial bagi Republika untuk menjamin konten berita bebas dari manipulasi atau hoaks publik.
          </div>
        </div>
      </div>

      {/* Row 3: Attack Surface + Actionable Top Priority Remediations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attack Surface by Subdomain */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Attack Surface: Aset Domain Republika
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Pemetaan ruang lingkup pengujian (Scope of Testing)
            </p>
          </div>

          <div className="space-y-2">
            {Object.entries(metrics.subdomainCounts).map(([subdomain, count]) => (
              <div 
                key={subdomain} 
                className="p-3 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100/70 transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span className="text-xs font-semibold text-slate-900 font-mono">{subdomain}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{getSubdomainLabel(subdomain)}</p>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 font-mono">
                  {count} Temuan
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-100">
            <span>Metode: Spidering &amp; Passive Scan</span>
            <span className="font-medium text-slate-700">5 Subdomain Aktif</span>
          </div>
        </div>

        {/* Actionable Top Priority Remediations */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Prioritas Mitigasi Segera (Actionable Remediations)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Temuan risiko tinggi yang memerlukan penanganan teknis secepatnya
              </p>
            </div>
            <button
              onClick={() => onNavigateToTab('vulnerabilities')}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold transition-colors"
            >
              Lihat Semua Temuan &rarr;
            </button>
          </div>

          <div className="space-y-2.5">
            {highPriority.map((vuln) => (
              <div
                key={vuln.id}
                onClick={() => onSelectVulnerability(vuln)}
                className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 hover:border-slate-300 hover:bg-white transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[11px] font-semibold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {vuln.id}
                    </span>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
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
                  <h3 className="text-xs sm:text-sm font-semibold text-slate-900 truncate">
                    {vuln.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-mono truncate">
                    Endpoint: {vuln.target}
                  </p>
                </div>

                <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                    vuln.status === 'Resolved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    vuln.status === 'In Progress' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                    'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}>
                    {vuln.status}
                  </span>
                  <button className="px-3 py-1.5 rounded-md bg-white hover:bg-slate-50 text-blue-700 font-medium text-xs border border-slate-300 transition-colors">
                    Detail Mitigasi
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
