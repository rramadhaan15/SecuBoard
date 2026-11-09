import React from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  X
} from 'lucide-react';
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-6 print:p-0 print:bg-white print:text-black">
      <div 
        className="bg-white border border-slate-200 rounded-2xl max-w-5xl w-full max-h-[94vh] overflow-y-auto shadow-2xl flex flex-col print:border-none print:shadow-none print:max-h-none print:w-full print:bg-white print:text-black"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Actions (Hidden in Print) */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-4 sticky top-0 z-20 print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-bold text-slate-900">
              Dokumen Resmi Laporan Audit Keamanan Siber &amp; Sidang TA
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadJson}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 transition-colors shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span>Ekspor JSON</span>
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-95"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / Simpan PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-800 border border-slate-200 transition-colors ml-1 shadow-2xs"
              title="Tutup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Report Content (Clean Professional Paper Layout) */}
        <div className="p-6 sm:p-10 space-y-8 bg-white text-slate-800 print:p-4 text-xs sm:text-sm">
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-6 text-center space-y-2">
            <div className="text-xs uppercase tracking-widest text-blue-800 font-extrabold">
              UNIVERSITAS PEMBANGUNAN NASIONAL &ldquo;VETERAN&rdquo; JAKARTA
            </div>
            <div className="text-sm font-bold text-slate-900">
              FAKULTAS ILMU KOMPUTER &mdash; PROGRAM STUDI DIII SISTEM INFORMASI
            </div>
            <div className="text-xs text-slate-500">
              Jl. RS. Fatmawati Raya, Pondok Labu, Jakarta Selatan 12450
            </div>

            <div className="pt-3">
              <span className="inline-block px-3.5 py-1 rounded-full bg-blue-50 text-blue-700 font-mono text-xs border border-blue-200 font-bold">
                DOKUMEN HASIL AUDIT KERENTANAN SISTEM KEAMANAN WEB
              </span>
            </div>

            <h1 className="text-base sm:text-lg font-extrabold text-slate-900 mt-2 leading-snug uppercase">
              IMPLEMENTASI WEB VULNERABILITY SCANNER BERBASIS OWASP DETEKSI KERENTANAN WEBSITE REPUBLIKA
            </h1>
          </div>

          {/* Research Metadata Block */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-5 rounded-xl border border-slate-200">
            <div className="space-y-1.5 text-xs">
              <div>
                <strong className="text-slate-500">Peneliti:</strong>{' '}
                <span className="font-bold text-slate-900">Rizki Ramadhan</span>
              </div>
              <div>
                <strong className="text-slate-500">NIM:</strong>{' '}
                <span className="font-mono text-blue-700 font-bold">2410501091</span>
              </div>
              <div>
                <strong className="text-slate-500">Program Studi:</strong>{' '}
                <span className="text-slate-800 font-medium">DIII Sistem Informasi (2026)</span>
              </div>
              <div>
                <strong className="text-slate-500">Metodologi:</strong>{' '}
                <span className="text-slate-800 font-medium">Agile Scrum Framework (3 Sprints Iteratif)</span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <div>
                <strong className="text-slate-500">Organisasi Target:</strong>{' '}
                <span className="font-bold text-slate-900">PT Republika Media Mandiri</span>
              </div>
              <div>
                <strong className="text-slate-500">Lokasi:</strong>{' '}
                <span className="text-slate-800 font-medium">Jl. KH Abdullah Syafei No.30, Tebet, Jakarta Selatan</span>
              </div>
              <div>
                <strong className="text-slate-500">Alat Pemindai:</strong>{' '}
                <span className="text-slate-800 font-medium">OWASP ZAP (Zed Attack Proxy) 2.14</span>
              </div>
              <div>
                <strong className="text-slate-500">Standar Klasifikasi:</strong>{' '}
                <span className="text-slate-800 font-medium">OWASP Top 10:2021 &amp; CVSS v3.1</span>
              </div>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-1.5">
              I. Ringkasan Eksekutif (Executive Summary)
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify">
              Berdasarkan hasil pemindaian otomatis menggunakan <strong>OWASP ZAP (Zed Attack Proxy)</strong> pada portal berita nasional <strong>republika.co.id</strong> beserta subdomain pendukungnya (retizen, ihram, news, dan REST API), sistem mencatatkan skor postur keamanan <strong>{metrics?.postureScore || 74}/100 (Grade {metrics?.securityGrade || 'B'})</strong>. Pemindaian berhasil mengidentifikasi total <strong>{vulnerabilities.length} kerentanan</strong>, yang terbagi dalam kategori High (2), Medium (4), Low (4), dan Informational (2).
            </p>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify">
              Celah keamanan dengan prioritas tertinggi mencakup <strong>SQL Injection</strong> pada parameter pencarian berita dan <strong>Insecure Direct Object Reference (IDOR)</strong> pada endpoint penghapusan komentar. Kerentanan ini mengancam prinsip <em>Confidentiality</em> (kerahasiaan data pembaca) dan <em>Integrity</em> (integritas artikel pers nasional dari manipulasi konten berita palsu).
            </p>
          </div>

          {/* Metric Summary Table */}
          <div className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-1.5">
              II. Ringkasan Kuantitatif Temuan Celah Keamanan
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800">
                <span className="text-xs font-bold">High Severity</span>
                <p className="text-2xl font-extrabold font-mono mt-1 text-rose-600">{metrics?.severityCounts.high}</p>
                <span className="text-[10px] text-rose-600 font-medium block mt-1">SLA: &lt; 24 Jam</span>
              </div>
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800">
                <span className="text-xs font-bold">Medium Severity</span>
                <p className="text-2xl font-extrabold font-mono mt-1 text-amber-600">{metrics?.severityCounts.medium}</p>
                <span className="text-[10px] text-amber-700 font-medium block mt-1">SLA: &lt; 72 Jam</span>
              </div>
              <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-800">
                <span className="text-xs font-bold">Low &amp; Info</span>
                <p className="text-2xl font-extrabold font-mono mt-1 text-blue-700">{(metrics?.severityCounts.low || 0) + (metrics?.severityCounts.info || 0)}</p>
                <span className="text-[10px] text-blue-600 font-medium block mt-1">Security Hardening</span>
              </div>
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800">
                <span className="text-xs font-bold">Tingkat Patching</span>
                <p className="text-2xl font-extrabold font-mono mt-1 text-emerald-600">{metrics?.resolutionRate}%</p>
                <span className="text-[10px] text-emerald-700 font-medium block mt-1">MTTR: {metrics?.mttrHours} Jam</span>
              </div>
            </div>
          </div>

          {/* Vulnerability Catalog Table */}
          <div className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-1.5">
              III. Rincian Temuan Kerentanan &amp; Rekomendasi Mitigasi Teknis
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-slate-50 text-slate-800 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3 border-r border-slate-200">Kode &amp; Risiko</th>
                    <th className="py-2.5 px-3 border-r border-slate-200">Nama Kerentanan</th>
                    <th className="py-2.5 px-3 border-r border-slate-200">Kategori OWASP</th>
                    <th className="py-2.5 px-3 border-r border-slate-200">Target Subdomain</th>
                    <th className="py-2.5 px-3 border-r border-slate-200">Dampak CIA</th>
                    <th className="py-2.5 px-3">Rekomendasi Patch (Tepat Sasaran)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {vulnerabilities.map((vuln) => (
                    <tr key={vuln.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3 font-mono border-r border-slate-200 whitespace-nowrap">
                        <strong className="text-slate-900">{vuln.id}</strong>
                        <div className={`text-[10px] font-bold ${
                          vuln.severity === 'High' ? 'text-rose-600' :
                          vuln.severity === 'Medium' ? 'text-amber-600' :
                          'text-blue-700'
                        }`}>
                          {vuln.severity} ({vuln.cvss})
                        </div>
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-900 border-r border-slate-200">
                        {vuln.title}
                        <div className="text-[10px] text-slate-500 font-mono font-normal">
                          {vuln.cwe.split(':')[0]}
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono border-r border-slate-200 whitespace-nowrap text-slate-700 font-semibold">
                        {vuln.owaspCategory}
                      </td>
                      <td className="py-3 px-3 font-mono text-[11px] border-r border-slate-200 text-slate-700">
                        {vuln.subdomain}
                      </td>
                      <td className="py-3 px-3 font-mono text-[10px] border-r border-slate-200 whitespace-nowrap text-slate-600 font-semibold">
                        C:{vuln.ciaImpact.confidentiality[0]} | I:{vuln.ciaImpact.integrity[0]} | A:{vuln.ciaImpact.availability[0]}
                      </td>
                      <td className="py-3 px-3 text-[11px] text-slate-700">
                        <strong className="text-blue-700">{vuln.remediation.quickFixTitle}</strong>
                        <p className="text-[10px] text-slate-500 line-clamp-2 mt-0.5">
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
          <div className="pt-8 border-t-2 border-slate-200 space-y-8">
            <div className="text-xs text-slate-500 text-center italic">
              Dokumen ini disusun sebagai bukti luaran implementasi Tugas Akhir Program Studi DIII Sistem Informasi, Fakultas Ilmu Komputer, UPN &ldquo;Veteran&rdquo; Jakarta tahun 2026.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-xs">
              <div className="space-y-16">
                <div className="font-semibold text-slate-700">Peneliti / Mahasiswa,</div>
                <div>
                  <strong className="border-b border-slate-400 pb-1 text-slate-900">
                    Rizki Ramadhan
                  </strong>
                  <div className="text-slate-500 font-mono mt-1 font-semibold">NIM: 2410501091</div>
                </div>
              </div>

              <div className="space-y-16">
                <div className="font-semibold text-slate-700">Dosen Pembimbing,</div>
                <div>
                  <strong className="border-b border-slate-400 pb-1 text-slate-900">
                    Dosen Pembimbing TA
                  </strong>
                  <div className="text-slate-500 font-mono mt-1">NIDN: ................................</div>
                </div>
              </div>

              <div className="space-y-16">
                <div className="font-semibold text-slate-700">Perwakilan PT Republika Media Mandiri,</div>
                <div>
                  <strong className="border-b border-slate-400 pb-1 text-slate-900">
                    IT Security / Web Admin Lead
                  </strong>
                  <div className="text-slate-500 font-mono mt-1">NIK: ................................</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
