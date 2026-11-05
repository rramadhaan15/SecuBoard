import React from 'react';
import { Vulnerability, OverviewMetrics, Sprint } from '../types';

interface ReportModalProps {
  onClose: () => void;
  metrics: OverviewMetrics | null;
  vulnerabilities: Vulnerability[];
  sprints: Sprint[];
}

export const ReportModal: React.FC<ReportModalProps> = ({
  onClose,
  metrics,
  vulnerabilities,
  sprints,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJson = () => {
    const reportData = {
      title: 'Laporan Audit Kerentanan Web OWASP ZAP - Website Republika',
      author: 'Rizki Ramadhan (NIM: 2410501091)',
      institution: 'Universitas Pembangunan Nasional "Veteran" Jakarta',
      organization: 'PT Republika Media Mandiri',
      generatedAt: new Date().toISOString(),
      metrics,
      vulnerabilities,
      sprints
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Laporan_Audit_OWASP_Republika_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-2 sm:p-6 print:p-0 print:bg-white print:text-black">
      <div 
        className="bg-slate-900 border border-slate-750 rounded-xl max-w-5xl w-full max-h-[94vh] overflow-y-auto shadow-2xl flex flex-col print:border-none print:shadow-none print:max-h-none print:w-full print:bg-white print:text-black"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Actions (Hidden in Print) */}
        <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between gap-4 sticky top-0 z-20 print:hidden">
          <div className="text-sm font-bold text-white">
            Dokumen Resmi Laporan Audit Keamanan Siber &amp; Sidang TA
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadJson}
              className="px-3 py-1.5 rounded text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              Ekspor JSON
            </button>
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white shadow-sm transition-colors"
            >
              Cetak / Simpan PDF
            </button>
            <button
              onClick={onClose}
              className="px-2.5 py-1.5 rounded text-xs bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors ml-2"
            >
              Tutup
            </button>
          </div>
        </div>

        {/* Report Content */}
        <div className="p-6 sm:p-10 space-y-8 bg-slate-900 text-slate-200 print:bg-white print:text-black print:p-4 text-xs sm:text-sm">
          {/* Header */}
          <div className="border-b-2 border-slate-700 pb-6 text-center space-y-2 print:border-black">
            <div className="text-xs uppercase tracking-widest text-slate-400 print:text-slate-600 font-bold">
              UNIVERSITAS PEMBANGUNAN NASIONAL &ldquo;VETERAN&rdquo; JAKARTA
            </div>
            <div className="text-sm font-bold text-white print:text-black">
              FAKULTAS ILMU KOMPUTER &mdash; PROGRAM STUDI DIII SISTEM INFORMASI
            </div>
            <div className="text-xs text-slate-400 print:text-slate-600">
              Jl. RS. Fatmawati Raya, Pondok Labu, Jakarta Selatan 12450
            </div>

            <div className="pt-3">
              <span className="inline-block px-3 py-1 rounded bg-slate-950 text-sky-400 font-mono text-xs border border-slate-800 print:bg-slate-100 print:text-black print:border-black">
                DOKUMEN HASIL AUDIT KERENTANAN SISTEM KEAMANAN WEB
              </span>
            </div>

            <h1 className="text-base sm:text-lg font-bold text-white print:text-black mt-2 leading-snug uppercase">
              IMPLEMENTASI WEB VULNERABILITY SCANNER BERBASIS OWASP DETEKSI KERENTANAN WEBSITE REPUBLIKA
            </h1>
          </div>

          {/* Research Metadata Block */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950 p-4 rounded-lg border border-slate-800 print:bg-slate-50 print:border-slate-300 print:text-black">
            <div className="space-y-1.5 text-xs">
              <div>
                <strong className="text-slate-400 print:text-slate-600">Peneliti:</strong>{' '}
                <span className="font-bold text-white print:text-black">Rizki Ramadhan</span>
              </div>
              <div>
                <strong className="text-slate-400 print:text-slate-600">NIM:</strong>{' '}
                <span className="font-mono text-sky-400 print:text-black">2410501091</span>
              </div>
              <div>
                <strong className="text-slate-400 print:text-slate-600">Program Studi:</strong>{' '}
                <span>DIII Sistem Informasi (2026)</span>
              </div>
              <div>
                <strong className="text-slate-400 print:text-slate-600">Metodologi:</strong>{' '}
                <span>Agile Scrum Framework (3 Sprints Iteratif)</span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <div>
                <strong className="text-slate-400 print:text-slate-600">Organisasi Target:</strong>{' '}
                <span className="font-bold text-white print:text-black">PT Republika Media Mandiri</span>
              </div>
              <div>
                <strong className="text-slate-400 print:text-slate-600">Lokasi:</strong>{' '}
                <span>Jl. KH Abdullah Syafei No.30, Tebet, Jakarta Selatan</span>
              </div>
              <div>
                <strong className="text-slate-400 print:text-slate-600">Alat Pemindai:</strong>{' '}
                <span>OWASP ZAP (Zed Attack Proxy) 2.14</span>
              </div>
              <div>
                <strong className="text-slate-400 print:text-slate-600">Standar Klasifikasi:</strong>{' '}
                <span>OWASP Top 10:2021 &amp; CVSS v3.1</span>
              </div>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="space-y-3">
            <h2 className="text-base font-bold text-white print:text-black border-b border-slate-800 pb-1.5">
              I. Ringkasan Eksekutif (Executive Summary)
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 print:text-slate-800 leading-relaxed text-justify">
              Berdasarkan hasil pemindaian otomatis menggunakan <strong>OWASP ZAP (Zed Attack Proxy)</strong> pada portal berita nasional <strong>republika.co.id</strong> beserta subdomain pendukungnya (retizen, ihram, news, dan REST API), sistem mencatatkan skor postur keamanan <strong>{metrics?.postureScore || 74}/100 (Grade {metrics?.securityGrade || 'B'})</strong>. Pemindaian berhasil mengidentifikasi total <strong>{vulnerabilities.length} kerentanan</strong>, yang terbagi dalam kategori High (2), Medium (4), Low (4), dan Informational (2).
            </p>
            <p className="text-xs sm:text-sm text-slate-300 print:text-slate-800 leading-relaxed text-justify">
              Celah keamanan dengan prioritas tertinggi mencakup <strong>SQL Injection</strong> pada parameter pencarian berita dan <strong>Insecure Direct Object Reference (IDOR)</strong> pada endpoint penghapusan komentar. Kerentanan ini mengancam prinsip <em>Confidentiality</em> (kerahasiaan data pembaca) dan <em>Integrity</em> (integritas artikel pers nasional dari manipulasi konten berita palsu).
            </p>
          </div>

          {/* Metric Summary Table */}
          <div className="space-y-3">
            <h2 className="text-base font-bold text-white print:text-black border-b border-slate-800 pb-1.5">
              II. Ringkasan Kuantitatif Temuan Celah Keamanan
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded bg-rose-950/60 border border-rose-800 text-rose-300 print:bg-slate-100 print:text-black print:border-black">
                <span className="text-xs font-semibold">High Severity</span>
                <p className="text-2xl font-bold font-mono">{metrics?.severityCounts.high}</p>
                <span className="text-[10px] text-slate-400 print:text-slate-600">SLA: &lt; 24 Jam</span>
              </div>
              <div className="p-3 rounded bg-amber-950/60 border border-amber-800 text-amber-300 print:bg-slate-100 print:text-black print:border-black">
                <span className="text-xs font-semibold">Medium Severity</span>
                <p className="text-2xl font-bold font-mono">{metrics?.severityCounts.medium}</p>
                <span className="text-[10px] text-slate-400 print:text-slate-600">SLA: &lt; 72 Jam</span>
              </div>
              <div className="p-3 rounded bg-slate-950 border border-slate-800 text-slate-300 print:bg-slate-100 print:text-black print:border-black">
                <span className="text-xs font-semibold">Low &amp; Info</span>
                <p className="text-2xl font-bold font-mono">{(metrics?.severityCounts.low || 0) + (metrics?.severityCounts.info || 0)}</p>
                <span className="text-[10px] text-slate-400 print:text-slate-600">Security Hardening</span>
              </div>
              <div className="p-3 rounded bg-emerald-950/60 border border-emerald-800 text-emerald-300 print:bg-slate-100 print:text-black print:border-black">
                <span className="text-xs font-semibold">Tingkat Patching</span>
                <p className="text-2xl font-bold font-mono">{metrics?.resolutionRate}%</p>
                <span className="text-[10px] text-slate-400 print:text-slate-600">MTTR: {metrics?.mttrHours} Jam</span>
              </div>
            </div>
          </div>

          {/* Vulnerability Catalog Table */}
          <div className="space-y-3">
            <h2 className="text-base font-bold text-white print:text-black border-b border-slate-800 pb-1.5">
              III. Rincian Temuan Kerentanan &amp; Rekomendasi Mitigasi Teknis
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-800 print:border-black">
                <thead className="bg-slate-950 text-slate-300 print:bg-slate-200 print:text-black font-semibold border-b border-slate-800 print:border-black">
                  <tr>
                    <th className="py-2 px-2.5 border-r border-slate-800 print:border-black">Kode &amp; Risiko</th>
                    <th className="py-2 px-2.5 border-r border-slate-800 print:border-black">Nama Kerentanan</th>
                    <th className="py-2 px-2.5 border-r border-slate-800 print:border-black">Kategori OWASP</th>
                    <th className="py-2 px-2.5 border-r border-slate-800 print:border-black">Target Subdomain</th>
                    <th className="py-2 px-2.5 border-r border-slate-800 print:border-black">Dampak CIA</th>
                    <th className="py-2 px-2.5">Rekomendasi Patch (Tepat Sasaran)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 print:divide-black">
                  {vulnerabilities.map((vuln) => (
                    <tr key={vuln.id} className="print:border-b print:border-slate-300">
                      <td className="py-2.5 px-2.5 font-mono border-r border-slate-800 print:border-black whitespace-nowrap">
                        <strong className="text-white print:text-black">{vuln.id}</strong>
                        <div className={`text-[10px] font-bold ${
                          vuln.severity === 'High' ? 'text-rose-400 print:text-red-700' :
                          vuln.severity === 'Medium' ? 'text-amber-400 print:text-amber-700' :
                          'text-slate-400 print:text-slate-700'
                        }`}>
                          {vuln.severity} ({vuln.cvss})
                        </div>
                      </td>
                      <td className="py-2.5 px-2.5 font-semibold text-slate-200 print:text-black border-r border-slate-800 print:border-black">
                        {vuln.title}
                        <div className="text-[10px] text-slate-400 print:text-slate-600 font-mono font-normal">
                          {vuln.cwe.split(':')[0]}
                        </div>
                      </td>
                      <td className="py-2.5 px-2.5 font-mono border-r border-slate-800 print:border-black whitespace-nowrap text-slate-300 print:text-black">
                        {vuln.owaspCategory}
                      </td>
                      <td className="py-2.5 px-2.5 font-mono text-[11px] border-r border-slate-800 print:border-black text-slate-300 print:text-black">
                        {vuln.subdomain}
                      </td>
                      <td className="py-2.5 px-2.5 font-mono text-[10px] border-r border-slate-800 print:border-black whitespace-nowrap">
                        C:{vuln.ciaImpact.confidentiality[0]} | I:{vuln.ciaImpact.integrity[0]} | A:{vuln.ciaImpact.availability[0]}
                      </td>
                      <td className="py-2.5 px-2.5 text-[11px] text-slate-300 print:text-black">
                        <strong className="text-sky-300 print:text-black">{vuln.remediation.quickFixTitle}</strong>
                        <p className="text-[10px] text-slate-400 print:text-slate-600 line-clamp-2">
                          {vuln.remediation.description}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Validation & Signatures */}
          <div className="pt-8 border-t-2 border-slate-700 print:border-black space-y-8">
            <div className="text-xs text-slate-400 print:text-slate-700 text-center italic">
              Dokumen ini disusun sebagai bukti luaran implementasi Tugas Akhir Program Studi DIII Sistem Informasi, Fakultas Ilmu Komputer, UPN &ldquo;Veteran&rdquo; Jakarta tahun 2026.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-xs">
              <div className="space-y-16">
                <div>Peneliti / Mahasiswa,</div>
                <div>
                  <strong className="border-b border-slate-400 pb-1 text-white print:text-black">
                    Rizki Ramadhan
                  </strong>
                  <div className="text-slate-400 print:text-slate-600 font-mono mt-1">NIM: 2410501091</div>
                </div>
              </div>

              <div className="space-y-16">
                <div>Dosen Pembimbing,</div>
                <div>
                  <strong className="border-b border-slate-400 pb-1 text-white print:text-black">
                    Dosen Pembimbing TA
                  </strong>
                  <div className="text-slate-400 print:text-slate-600 font-mono mt-1">NIDN: ................................</div>
                </div>
              </div>

              <div className="space-y-16">
                <div>Perwakilan PT Republika Media Mandiri,</div>
                <div>
                  <strong className="border-b border-slate-400 pb-1 text-white print:text-black">
                    IT Security / Web Admin Lead
                  </strong>
                  <div className="text-slate-400 print:text-slate-600 font-mono mt-1">NIK: ................................</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
