<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Sistem Monitoring Air Bersih</title>
  <style>
    body { font-family: sans-serif; line-height: 1.6; max-width: 900px; margin: auto; padding: 1em; background: #f9f9f9; }
    h1, h2, h3 { color: #FFFFFFFF; }
    ul { margin-left: 1em; }
    code, pre { background-color: #eee; padding: 0.2em 0.5em; border-radius: 4px; }
    .banner { background: #e0f3ff; padding: 1em; text-align: center; margin-bottom: 2em; border-radius: 10px; }
    .section { margin-bottom: 2em; }
    .highlight { background: #fff; border-left: 4px solid #FFFFFFFF; padding: 1em; margin: 1em 0; }
    table { border-collapse: collapse; width: 100%; margin: 1em 0; }
    th, td { border: 1px solid #ddd; padding: 0.5em; }
    th { background-color: #f2f2f2; }
    .badge { display: inline-block; padding: 0.3em 0.6em; background: #FFFFFFFF; color: #fff; border-radius: 5px; font-size: 0.9em; }
  </style>
</head>
<body>

  <div class="banner">
    <h1>💧 Sistem Monitoring Air Bersih</h1>
    <p>Aplikasi Microservices untuk Pemantauan Air Bersih</p>
    <img src="../front-end//public/logo.png" alt="Banner proyek" width="100%" />
  </div>

  <div class="section">
    <h2>🌟 Fitur Utama</h2>
    <ul>
      <li><strong>👨‍💻 Admin</strong>: Dashboard, manajemen pengguna, pelacakan laporan</li>
      <li><strong>👷 Petugas</strong>: Formulir tindakan, timeline laporan, riwayat tindakan</li>
      <li><strong>👥 Masyarakat</strong>: Pelaporan, pelacakan status, notifikasi</li>
    </ul>
  </div>

  <div class="section">
    <h2>🔐 Autentikasi</h2>
    <ul>
      <li>Registrasi & login aman</li>
      <li>Akses berbasis peran (role-based)</li>
      <li>Proteksi halaman</li>
    </ul>
  </div>

  <div class="section">
    <h2>🛠️ Teknologi yang Digunakan</h2>
    <h3>Backend</h3>
    <table>
      <tr><th>Komponen</th><th>Teknologi</th></tr>
      <tr><td>API Gateway</td><td>Node.js + Express</td></tr>
      <tr><td>Layanan User</td><td>Node.js + Express</td></tr>
      <tr><td>Laporan</td><td>Node.js + Express</td></tr>
      <tr><td>Tindakan</td><td>Node.js + Express</td></tr>
      <tr><td>Status</td><td>Node.js + Express</td></tr>
    </table>
    <h3>Frontend</h3>
    <table>
      <tr><th>Fitur</th><th>Teknologi</th></tr>
      <tr><td>Framework</td><td>React 19 + Vite</td></tr>
      <tr><td>Styling</td><td>TailwindCSS</td></tr>
      <tr><td>Komponen UI</td><td>Material UI + Ant Design</td></tr>
      <tr><td>Manajemen State</td><td>React Context</td></tr>
      <tr><td>Routing</td><td>React Router</td></tr>
      <tr><td>Chart</td><td>Recharts</td></tr>
      <tr><td>Ikon</td><td>Lucide + Heroicons</td></tr>
    </table>
  </div>

  <div class="section">
    <h2>🚀 Memulai Proyek</h2>
    <h3>📋 Prasyarat</h3>
    <ul>
      <li>Node.js (18+)</li>
      <li>npm (9+)</li>
      <li>Git</li>
    </ul>
    <h3>⚙️ Instalasi</h3>
    <pre><code>git clone https://github.com/rizallfrm/Monitoring-System-Clean-Water.git
cd Monitoring-System-Clean-Water
npm install</code></pre>

    <h3>🖥️ Menjalankan Aplikasi</h3>
    <strong>Backend (Microservices)</strong>
    <pre><code>nodemon server.js</code></pre>
    <p>Atau per layanan:</p>
    <pre><code># API Gateway
cd api-gateway
nodemon index.js

npm install
npm run dev</code></pre>
    <p>Akses di: <code>http://localhost:5173</code></p>
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

  <div class="section">
    <h2>📂 Struktur Folder</h2>
    <pre><code>project-root/
├── api-gateway/
├── services/
│   ├── userServices/
│   ├── reportService/
│   ├── statusService/
│   └── actionService/
├── front-end/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── layouts/
│       ├── pages/
│       └── services/
└── server.js</code></pre>
  </div>

  <div class="section">
    <h2>🛣️ Rencana Pengembangan</h2>
    <ul>
      <li>Autentikasi JWT</li>
      <li>Docker containerization</li>
      <li>Deploy ke Vercel + Railway</li>
      <li>Sistem logging & monitoring</li>
      <li>Integrasi database</li>
      <li>Desain responsive mobile</li>
      <li>Notifikasi real-time</li>
    </ul>
  </div>

  <div class="section">
    <h2>🤝 Berkontribusi</h2>
    <ol>
      <li>Fork proyek ini</li>
      <li>Buat branch: <code>git checkout -b fitur/ContohFitur</code></li>
      <li>Commit: <code>git commit -m 'Tambahkan fitur baru'</code></li>
      <li>Push: <code>git push origin fitur/ContohFitur</code></li>
      <li>Buat Pull Request</li>
    </ol>
  </div>

  <div class="section">
    <h2>📜 Lisensi</h2>
    <p>Didistribusikan di bawah lisensi MIT. Lihat file <code>LICENSE</code> untuk info lengkap.</p>
  </div>

  <div class="section">
    <h2>👨‍💻 Kontributor</h2>
    <ul>
      <li><strong>rizallfrm</strong> – Pengelola proyek</li>
      <li>(Tambahkan kontributor lain jika ada)</li>
    </ul>
  </div>

</body>
</html>
