import React from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  X, 
  CheckCircle2, 
  Award, 
  ShieldCheck, 
  Building2, 
  GraduationCap
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 print:p-0 print:bg-white print:text-black">
      <div 
        className="bg-[#0c1322] border border-[#17233d] rounded-2xl max-w-5xl w-full max-h-[94vh] overflow-y-auto shadow-2xl flex flex-col print:border-none print:shadow-none print:max-h-none print:w-full print:bg-white print:text-black"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Actions (Hidden in Print) */}
        <div className="p-4 sm:p-5 border-b border-[#17233d] bg-[#080c14] flex items-center justify-between gap-4 sticky top-0 z-20 print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-bold text-white">
              Dokumen Resmi Laporan Audit Keamanan Siber &amp; Sidang TA
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadJson}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#111a2e] hover:bg-[#17233d] text-slate-200 border border-[#1e2f52] transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Ekspor JSON</span>
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-md shadow-cyan-950 transition-all hover:scale-[1.02] active:scale-95"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / Simpan PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-[#111a2e] hover:bg-[#17233d] text-slate-400 hover:text-white border border-[#1e2f52] transition-colors ml-1"
              title="Tutup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Report Content */}
        <div className="p-6 sm:p-10 space-y-8 bg-[#0c1322] text-slate-200 print:bg-white print:text-black print:p-4 text-xs sm:text-sm">
          {/* Header */}
          <div className="border-b-2 border-[#17233d] pb-6 text-center space-y-2 print:border-black">
            <div className="text-xs uppercase tracking-widest text-cyan-400 print:text-slate-600 font-bold">
              UNIVERSITAS PEMBANGUNAN NASIONAL &ldquo;VETERAN&rdquo; JAKARTA
            </div>
            <div className="text-sm font-bold text-white print:text-black">
              FAKULTAS ILMU KOMPUTER &mdash; PROGRAM STUDI DIII SISTEM INFORMASI
            </div>
            <div className="text-xs text-slate-400 print:text-slate-600">
              Jl. RS. Fatmawati Raya, Pondok Labu, Jakarta Selatan 12450
            </div>

            <div className="pt-3">
              <span className="inline-block px-3.5 py-1 rounded-full bg-[#080c14] text-cyan-400 font-mono text-xs border border-cyan-800 print:bg-slate-100 print:text-black print:border-black">
                DOKUMEN HASIL AUDIT KERENTANAN SISTEM KEAMANAN WEB
              </span>
            </div>

            <h1 className="text-base sm:text-lg font-bold text-white print:text-black mt-2 leading-snug uppercase">
              IMPLEMENTASI WEB VULNERABILITY SCANNER BERBASIS OWASP DETEKSI KERENTANAN WEBSITE REPUBLIKA
            </h1>
          </div>

          {/* Research Metadata Block */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#080c14] p-5 rounded-xl border border-[#17233d] print:bg-slate-50 print:border-slate-300 print:text-black">
            <div className="space-y-1.5 text-xs">
              <div>
                <strong className="text-slate-400 print:text-slate-600">Peneliti:</strong>{' '}
                <span className="font-bold text-white print:text-black">Rizki Ramadhan</span>
              </div>
              <div>
                <strong className="text-slate-400 print:text-slate-600">NIM:</strong>{' '}
                <span className="font-mono text-cyan-400 print:text-black font-semibold">2410501091</span>
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
            <h2 className="text-base font-bold text-white print:text-black border-b border-[#17233d] print:border-black pb-1.5">
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
            <h2 className="text-base font-bold text-white print:text-black border-b border-[#17233d] print:border-black pb-1.5">
              II. Ringkasan Kuantitatif Temuan Celah Keamanan
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 print:bg-slate-100 print:text-black print:border-black">
                <span className="text-xs font-semibold">High Severity</span>
                <p className="text-2xl font-bold font-mono mt-1">{metrics?.severityCounts.high}</p>
                <span className="text-[10px] text-slate-400 print:text-slate-600 block mt-1">SLA: &lt; 24 Jam</span>
              </div>
              <div className="p-3.5 rounded-xl bg-amber-950/60 border border-amber-800 text-amber-300 print:bg-slate-100 print:text-black print:border-black">
                <span className="text-xs font-semibold">Medium Severity</span>
                <p className="text-2xl font-bold font-mono mt-1">{metrics?.severityCounts.medium}</p>
                <span className="text-[10px] text-slate-400 print:text-slate-600 block mt-1">SLA: &lt; 72 Jam</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#080c14] border border-[#17233d] text-cyan-300 print:bg-slate-100 print:text-black print:border-black">
                <span className="text-xs font-semibold text-slate-300">Low &amp; Info</span>
                <p className="text-2xl font-bold font-mono mt-1">{(metrics?.severityCounts.low || 0) + (metrics?.severityCounts.info || 0)}</p>
                <span className="text-[10px] text-slate-400 print:text-slate-600 block mt-1">Security Hardening</span>
              </div>
              <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 print:bg-slate-100 print:text-black print:border-black">
                <span className="text-xs font-semibold">Tingkat Patching</span>
                <p className="text-2xl font-bold font-mono mt-1">{metrics?.resolutionRate}%</p>
                <span className="text-[10px] text-slate-400 print:text-slate-600 block mt-1">MTTR: {metrics?.mttrHours} Jam</span>
              </div>
            </div>
          </div>

          {/* Vulnerability Catalog Table */}
          <div className="space-y-3">
            <h2 className="text-base font-bold text-white print:text-black border-b border-[#17233d] print:border-black pb-1.5">
              III. Rincian Temuan Kerentanan &amp; Rekomendasi Mitigasi Teknis
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-[#17233d] print:border-black rounded-xl overflow-hidden">
                <thead className="bg-[#080c14] text-slate-300 print:bg-slate-200 print:text-black font-semibold border-b border-[#17233d] print:border-black">
                  <tr>
                    <th className="py-2.5 px-3 border-r border-[#17233d] print:border-black">Kode &amp; Risiko</th>
                    <th className="py-2.5 px-3 border-r border-[#17233d] print:border-black">Nama Kerentanan</th>
                    <th className="py-2.5 px-3 border-r border-[#17233d] print:border-black">Kategori OWASP</th>
                    <th className="py-2.5 px-3 border-r border-[#17233d] print:border-black">Target Subdomain</th>
                    <th className="py-2.5 px-3 border-r border-[#17233d] print:border-black">Dampak CIA</th>
                    <th className="py-2.5 px-3">Rekomendasi Patch (Tepat Sasaran)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#17233d] print:divide-black">
                  {vulnerabilities.map((vuln) => (
                    <tr key={vuln.id} className="hover:bg-[#111a2e]/50 print:border-b print:border-slate-300">
                      <td className="py-3 px-3 font-mono border-r border-[#17233d] print:border-black whitespace-nowrap">
                        <strong className="text-white print:text-black">{vuln.id}</strong>
                        <div className={`text-[10px] font-bold ${
                          vuln.severity === 'High' ? 'text-rose-400 print:text-red-700' :
                          vuln.severity === 'Medium' ? 'text-amber-400 print:text-amber-700' :
                          'text-cyan-400 print:text-slate-700'
                        }`}>
                          {vuln.severity} ({vuln.cvss})
                        </div>
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-200 print:text-black border-r border-[#17233d] print:border-black">
                        {vuln.title}
                        <div className="text-[10px] text-slate-400 print:text-slate-600 font-mono font-normal">
                          {vuln.cwe.split(':')[0]}
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono border-r border-[#17233d] print:border-black whitespace-nowrap text-slate-300 print:text-black">
                        {vuln.owaspCategory}
                      </td>
                      <td className="py-3 px-3 font-mono text-[11px] border-r border-[#17233d] print:border-black text-slate-300 print:text-black">
                        {vuln.subdomain}
                      </td>
                      <td className="py-3 px-3 font-mono text-[10px] border-r border-[#17233d] print:border-black whitespace-nowrap">
                        C:{vuln.ciaImpact.confidentiality[0]} | I:{vuln.ciaImpact.integrity[0]} | A:{vuln.ciaImpact.availability[0]}
                      </td>
                      <td className="py-3 px-3 text-[11px] text-slate-300 print:text-black">
                        <strong className="text-cyan-300 print:text-black">{vuln.remediation.quickFixTitle}</strong>
                        <p className="text-[10px] text-slate-400 print:text-slate-600 line-clamp-2 mt-0.5">
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
          <div className="pt-8 border-t-2 border-[#17233d] print:border-black space-y-8">
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
