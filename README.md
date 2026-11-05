# SecuBoard 🛡️
### Dashboard Business Intelligence Deteksi Kerentanan Web Berbasis OWASP ZAP
**Studi Kasus: PT Republika Media Mandiri (`republika.co.id`)**

---

## 🎓 Informasi Tugas Akhir (TA)
* **Judul Penelitian:** Implementasi Web Vulnerability Scanner Berbasis OWASP Deteksi Kerentanan Website Republika
* **Peneliti:** Rizki Ramadhan
* **NIM:** 2410501091
* **Program Studi:** DIII - Sistem Informasi
* **Fakultas:** Fakultas Ilmu Komputer
* **Institusi:** Universitas Pembangunan Nasional "Veteran" Jakarta (UPNVJ)
* **Tahun:** 2026
* **Lokasi Penelitian:** PT Republika Media Mandiri, Jl. KH Abdullah Syafei No.30, Bukit Duri, Kec. Tebet, Kota Jakarta Selatan

---

## 🌟 Fitur Utama Sistem

### 1. 📊 Executive BI Dashboard & Security Posture
* **Security Posture Score (0 - 100 & Grade A/B/C/D):** Metrik kalkulasi kesehatan keamanan siber berdasarkan pembobotan tingkat keparahan risiko CVSS.
* **Distribusi OWASP Top 10:2021:** Visualisasi grafik batang terstandar untuk kategori risiko paling kritis (A01 s/d A10).
* **Evaluasi Dampak CIA Triad:** Pemetaan dampak celah keamanan terhadap *Confidentiality* (kerahasiaan data pembaca), *Integrity* (integritas artikel pers nasional agar terbebas dari hoaks/deface), dan *Availability* (ketersediaan portal berita publik).
* **Attack Surface Subdomain Map:** Pemetaan kerentanan per aset domain (`republika.co.id`, `retizen`, `ihram`, `news`, `api`).
* **MTTR & SLA Tracking:** Pemantauan *Mean Time to Remediate* dan kepatuhan batas waktu SLA perbaikan kerentanan.

### 2. ⚡ Continuous Scanner & OWASP ZAP Automation
* **Continuous Scanning Engine:** Pemindaian otomatis terus-menerus tanpa henti dengan interval yang dapat disesuaikan (15 detik, 1 menit, 5 menit, atau harian).
* **Live Streaming Execution Terminal:** Terminal console interaktif berbasis *Server-Sent Events (SSE)* yang menyajikan log proses pemindaian secara real-time.
* **4-Tahap Pipeline Otomatis:**
  1. *Spidering / Crawler:* Memetakan struktur URL, halaman, form input, dan arsitektur web Republika (Sprint 1).
  2. *Passive Scanning:* Analisis respons HTTP, security headers (CSP, X-Frame-Options, HSTS), Cookie flags, dan banner disclosure (Sprint 2).
  3. *Active Scanning:* Pengujian injeksi payload aktif (SQL Injection, Cross-Site Scripting / XSS, IDOR, CSRF) (Sprint 2).
  4. *Analysis & Classification:* Klasifikasi keparahan risiko, skor CVSS v3.1, dan pembentukan tiket perbaikan (Sprint 3).
* **Dukungan OWASP ZAP Daemon:** Terhubung langsung ke REST API OWASP ZAP (`http://127.0.0.1:8080`) atau beroperasi secara mandiri menggunakan Autonomous Engine bawaan.

### 3. 🎯 Katalog Kerentanan & Remediasi Cepat Tepat Sasaran
* **Actionable Remediation Blueprint:** Setiap celah keamanan dilengkapi dengan petunjuk mitigasi teknis langkah-demi-langkah.
* **Siap Salin (Copy-Paste Code Snippet):** Kode perbaikan siap pakai untuk Nginx (`vhost` security headers), Apache (`.htaccess`), PHP (Prepared Statements PDO, HTML escaping), dan Node.js Express.
* **Workflow Status Management:** Pembaruan status tiket (*Open*, *In Progress*, *Resolved*, *False Positive*) dan penugasan PIC Tim IT.

### 4. 🏃 Manajemen Pengujian Agile Scrum (Bab 3.1 & 3.4)
* **Sprint 1 (Information Gathering):** Spidering, pemetaan direktori, dan deteksi teknologi.
* **Sprint 2 (Scanning):** Passive Scan & Active Scan injection testing.
* **Sprint 3 (Analysis & Reporting):** Klasifikasi OWASP Top 10:2021, mitigasi patching, dan penyusunan dokumen tugas akhir.
* **Interactive Story Points & Task Checklist:** Manajemen backlog pengujian dengan kalkulasi progres persentase otomatis.

### 5. 📑 Dokumen Audit Resmi & Sidang Tugas Akhir
* Template laporan audit komprehensif berstandar akademik dan korporat.
* Dilengkapi kop resmi UPN "Veteran" Jakarta dan identitas PT Republika Media Mandiri.
* Fitur satu-klik Cetak / Simpan PDF (`window.print()`) dan Ekspor Data JSON.

---

## 🚀 Cara Menjalankan Aplikasi

### Prasyarat
* Node.js versi 18+ (telah teruji pada Node v24)
* Peramban web (Google Chrome / Mozilla Firefox / Microsoft Edge)

### 1. Mode Production / Standalone (Paling Mudah)
Jalankan perintah berikut di direktori proyek:
\`\`\`bash
npm start
\`\`\`
Buka peramban pada alamat:
👉 **`http://localhost:5000`**

### 2. Mode Development (Hot-Reloading)
Jalankan server backend dan client Vite secara bersamaan:
\`\`\`bash
npm run dev
\`\`\`
* Frontend Vite: **`http://localhost:5173`**
* Backend API: **`http://localhost:5000`**

---

## 🔌 Panduan Menghubungkan ke OWASP ZAP Desktop Daemon (Opsional)

Jika ingin menghubungkan langsung ke aplikasi desktop OWASP ZAP yang terpasang di komputer Anda:
1. Jalankan OWASP ZAP via command prompt:
   \`\`\`bash
   zap.bat -daemon -port 8080 -config api.disablekey=true
   \`\`\`
   *(atau buka GUI OWASP ZAP &rarr; Tools &rarr; Options &rarr; API &rarr; pastikan port 8080 aktif)*
2. Buka SecuBoard, klik tombol status ZAP di pojok kanan atas header (**ZAP Engine Active**).
3. Masukkan Host `127.0.0.1` dan Port `8080`, lalu klik **Uji Koneksi** dan **Simpan Konfigurasi**.
4. SecuBoard akan otomatis terhubung ke OWASP ZAP daemon.

---

## 📁 Struktur Direktori Proyek

\`\`\`text
SecuBoard/
├── client/                     # Frontend React + TypeScript + Vite + TailwindCSS
│   ├── src/
│   │   ├── components/         # Komponen UI Dashboard BI, Scanner, Katalog, Scrum, Report
│   │   │   ├── Header.tsx
│   │   │   ├── OverviewView.tsx
│   │   │   ├── ContinuousScannerView.tsx
│   │   │   ├── VulnerabilitiesView.tsx
│   │   │   ├── ScrumBoardView.tsx
│   │   │   ├── DetailModal.tsx
│   │   │   ├── ReportModal.tsx
│   │   │   └── ZAPConfigModal.tsx
│   │   ├── services/
│   │   │   └── api.ts          # REST API & SSE Client
│   │   ├── types/
│   │   │   └── index.ts        # TypeScript Interfaces & Model
│   │   ├── App.tsx             # Main Application Container
│   │   ├── main.tsx
│   │   └── index.css
│   └── dist/                   # Hasil build production
├── server/                     # Backend Node.js Express Engine
│   ├── index.js                # REST API & Server-Sent Events (SSE) Routes
│   ├── scannerService.js       # Continuous Scanner Engine & ZAP API Handler
│   └── vulnerabilityDatabase.js# Dataset OWASP Top 10 & Website Republika
├── package.json
└── README.md
\`\`\`

---

## 🎯 Nilai Tambah Akademik & Kontribusi Riset
1. **Penerapan Nyata Standar Industri:** Menggabungkan standar global keamanan siber **OWASP Top 10:2021** dengan metriks sistem informasi bisnis (*Business Intelligence*).
2. **Kesesuaian Metodologi:** Merealisasikan secara utuh tahapan penelitian berbasis **Agile Scrum (Sprint 1, 2, 3)** sesuai Bab III Proposal Tugas Akhir.
3. **Efisiensi Remediasi:** Membantu tim IT PT Republika Media Mandiri mengatasi celah keamanan secara proaktif sebelum dieksploitasi oleh pihak luar melalui rekomendasi *patching* yang terarah dan tepat sasaran.
