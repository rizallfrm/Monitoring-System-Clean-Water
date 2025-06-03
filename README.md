<div align="center">
    <img src="https://raw.githubusercontent.com/rizallfrm/Monitoring-System-Clean-Water/main/front-end/public/logo.png" alt="Banner proyek" width="50%" />


  <h1>💧 Sistem Monitoring Air Bersih</h1>
  <p>Aplikasi berbasis sistem terdistribusi untuk memantau kualitas air bersih secara real-time</p>
</div>

<div>
  <div class="section">
      <h2>🌟 Fitur Utama</h2>
      <ul>
        <li><strong>👨‍💻 Admin</strong>: Dashboard, manajemen pengguna, pelacakan laporan</li>
        <li><strong>👷 Petugas</strong>: Formulir tindakan, update laporan, update status laporan, riwayat tindakan</li>
        <li><strong>👥 Warga</strong>: Pelaporan, pelacakan status</li>
      </ul>
    </div>
  <div class="section">
    <h2>🔐 Autentikasi</h2>
    <ul>
      <li>Registrasi & login menggunakan JWT</li>
      <li>Akses berbasis peran (role-based)</li>
      <li>Proteksi data pengguna</li>
    </ul>
  </div>    
  <h3>👨‍💻 Untuk Admin</h3>
  <ul>
    <li>Dashboard analisis data lengkap</li>
    <li>Manajemen pengguna & petugas</li>
    <li>Pelacakan status laporan</li>
  </ul>

  <h3>👷 Untuk Petugas</h3>
  <ul>
    <li>Formulir pelaporan masalah</li>
    <li>Timeline perkembangan laporan</li>
    <li>Sistem tindak lanjut terstruktur</li>
  </ul>
</div>


<div class="use-case-container">
  <h2>💡 Alur Kerja Sistem</h2>
  
  <div class="timeline">
    <div class="timeline-step">
      <d
      <div class="step-content">
        <h3>📱 Pelaporan Masalah</h3>
        <div class="step-detail">
          <p><strong>Warga:</strong></p>
          <ul>
            <li>📌 Pinpoint lokasi kejadian</li>
            <li>📝 Deskripsi masalah (air keruh, bau, dll) dan upload bukti</li>
            <li>⏱ Waktu kejadian</li>
          </ul>
        </div>
      </div>
    </div>

<div class="timeline-step">
      <d
      <div class="step-content">
        <h3>🔍 Verifikasi Lapangan</h3>
        <div class="step-detail">
          <p><strong>Petugas:</strong></p>
          <ul>
            <li>🛵 Kunjungan lokasi</li>
            <li>📋 Form checklist pemeriksaan</li>
            <li>⚗️ Uji kualitas air sederhana</li>
            <li>📸 Dokumentasi kondisi</li>
          </ul>
        </div>
      </div>
    </div>

   <div class="timeline-step">
      <d
      <div class="step-content">
        <h3>📊 Monitoring Admin</h3>
        <div class="step-detail">
          <p><strong>Fitur Pengawasan:</strong></p>
          <ul>
            <li>🗺️ Melihat laporan yang diajukan</li>
            <li>⏱ Menambah akun petugas dari sistem</li>
            <li>📉 Melihat statistik sistem</li>
            <li>⭐ Menugaskan petugas untuk menindaklanjuti laporan</li>
          </ul>
        </div>
      </div>
    </div> 
     <div class="timeline-step">
      <div></div>
      <div class="step-content">
        <h3>🔄 Update Real-time</h3>
        <div class="step-detail">
          <p><strong>Proses:</strong></p>
          <ul>
            <li>📛 Klasifikasi masalah</li>
            <li>📲 Notifikasi ke pelapor</li>
          </ul>
          <div class="status-flow">
            <span class="status pending">Menunggu →</span>
            <span class="status process">Diproses →</span>
            <span class="status done">Selesai</span>
          </div>
        </div>
      </div>
    </div>
    <div class="timeline-step">
      <d
      <div class="step-content">
        <h3>📊 Menindaklanjuti Laporan</h3>
        <div class="step-detail">
          <p><strong>Petugas :</strong></p>
          <ul>
            <li>🗺️ Terjun ke lokasi kejadian laporan</li>
            <li>⏱ Melakukan tindakan dari laporan warga</li>
            <li>📉 Update status laporan</li>
          </ul>
        </div>
      </div>
    </div>
  </div>

<div>
  <h2>🛠️ Teknologi</h2>
  
  <table>
    <tr>
      <th>Komponen</th>
      <th>Teknologi</th>
    </tr>
    <tr>
      <td>Backend</td>
      <td>Node.js, Express, ImageKit, JWT</td>
    </tr>
    <tr>
      <td>Frontend</td>
      <td>React, Vite, TailwindCSS</td>
    </tr>
    <tr>
      <td>Database</td>
      <td>PostgreSQL</td>
    </tr>
  </table>
</div>

<div>
  <h2>🚀 Panduan Instalasi</h2>
  <h3>Langkah-langkah</h3>
  <ol>
    <li>Clone repositori:
      <pre><code>git clone https://github.com/rizallfrm/Monitoring-System-Clean-Water.git</code></pre>
    </li>
    <li>Instal dependensi:
      <pre><code>npm install</code></pre>
    </li>
    <li>Jalankan backend:
      <pre><code>cd back-end
npm run dev</code></pre>
    </li>
    <li>Jalankan frontend:
      <pre><code>cd front-end
npm run dev</code></pre>
    </li>
  </ol>
</div>


 <div class="section">
    <h2>🌐 Endpoint API</h2>
    <table>
      <tr><th>Layanan</th><th>Endpoint Gateway</th><th>Port Lokal</th></tr>
      <tr><td>Auth/User</td><td>http://localhost:5000/api/auth</td><td>3001</td></tr>
      <tr><td>Laporan</td><td>http://localhost:5000/api/reports</td><td>3002</td></tr>
      <tr><td>Tindakan</td><td>http://localhost:5000/api/actions</td><td>3003</td></tr>
      <tr><td>Status</td><td>http://localhost:5000/api/status</td><td>3004</td></tr>
    </table>
  </div>


  <div>
  <h2>🌐 Struktur Proyek</h2>
  <pre>
project-root/
├── api-gateway/              # API Gateway untuk routing
├── services/                 # Microservices:
│   ├── userServices/         # Autentikasi & manajemen user
│   ├── reportService/        # Penanganan laporan
│   ├── statusService/        # Update status
│   └── actionService/        # Pelacakan tindakan
│   └── actionService/        # Pelacakan tindakan
│   └── server.js             # Entry Point
├── front-end/                # Frontend React
│   └── src/
│       ├── components/       # Komponen UI
│       ├── context/          # Context autentikasi
│       ├── layouts/          # Layout admin
│       ├── pages/            # Halaman utama
│       └── services/         # Pemanggilan API
└── 
  </pre>
</div>
<div>
  <h2>🤝 Berkontribusi</h2>
  <p>Kami menerima kontribusi melalui:</p>
  <ol>
    <li>Fork project ini</li>
    <li>Buat branch baru</li>
    <li>Commit perubahan</li>
    <li>Push ke branch</li>
    <li>Buka Pull Request</li>
  </ol>
</div>


<div>
  <h2>👨‍💻 Kontak</h2>
  <p>Pengelola: <a href="https://github.com/rizallfrm">Rizal Firmansyah</a></p>
  <p>Pengelola: <a href="https://github.com/aritrw">Ari Tri Wibowo</a></p>
</div>
