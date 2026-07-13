# Unduh Cepat — Video Downloader (Node.js)

Website untuk mengunduh video dari berbagai platform (YouTube, Instagram, TikTok, Twitter/X, Facebook, dll), dibangun dengan **Node.js + Express**, memakai [`yt-dlp`](https://github.com/yt-dlp/yt-dlp) sebagai mesin ekstraksi video di balik layar (via paket `yt-dlp-exec`).

⚠️ **Penting soal legalitas**: gunakan alat ini hanya untuk kontenmu sendiri, konten domain publik, atau konten yang kamu punya izin untuk diunduh. Mengunduh dan menyebarkan ulang video berhak cipta tanpa izin dapat melanggar Ketentuan Layanan platform dan hukum hak cipta di negaramu.

## Struktur Proyek

```
video-downloader/
├── server.js           # Backend Express (API info & download)
├── package.json
├── public/
│   ├── index.html       # Halaman utama
│   ├── style.css        # Tampilan (gaya mirip SaveInsta)
│   └── script.js        # Logika frontend (fetch API, render hasil)
└── README.md
```

## Cara Menjalankan di VS Code

### 1. Prasyarat
- **Node.js** versi 18 ke atas — cek dengan `node -v`. Kalau belum ada, unduh di https://nodejs.org
- Koneksi internet aktif (server perlu mengunduh binary `yt-dlp` saat instalasi pertama, dan tentu untuk mengambil video).

### 2. Buka folder di VS Code
Buka folder `video-downloader` ini di VS Code (`File > Open Folder...`).

### 3. Install dependency
Buka Terminal di VS Code (`` Ctrl+` `` atau `Terminal > New Terminal`), lalu jalankan:

```bash
npm install
```

Ini akan mengunduh Express, cors, dan `yt-dlp-exec` (paket ini otomatis mengunduh binary `yt-dlp` yang sesuai OS kamu saat pertama kali dipakai).

### 4. Jalankan server

```bash
npm start
```

Kalau berhasil, akan muncul:
```
✅ Server berjalan di http://localhost:3000
```

### 5. Buka di browser
Kunjungi **http://localhost:3000** — tempel link video, klik **Analisis**, lalu pilih kualitas untuk mengunduh.

## Cara Kerja Singkat

1. **Frontend** (`public/script.js`) mengirim URL video ke endpoint `POST /api/info`.
2. **Backend** (`server.js`) menjalankan `yt-dlp` untuk mengekstrak metadata video (judul, thumbnail, durasi) dan daftar format/resolusi yang tersedia, lalu mengirimkannya sebagai JSON.
3. Saat user memilih kualitas, browser diarahkan ke `GET /api/download?...`, di mana backend menjalankan `yt-dlp` lagi dan men-*streaming*-kan hasil unduhan langsung ke browser (tidak disimpan di server).

## Platform yang Didukung

`yt-dlp` mendukung 1000+ situs. Yang paling umum: YouTube, Instagram (post/reel publik), TikTok, Twitter/X, Facebook, Twitch clips, Vimeo, dan lainnya. Untuk konten privat/berbayar atau yang butuh login, biasanya tidak akan berhasil diekstrak.

## Troubleshooting

- **"Gagal mengambil informasi video"**: pastikan link publik dan bisa dibuka tanpa login. Beberapa platform (terutama Instagram/TikTok) sering mengubah struktur mereka — pastikan `yt-dlp` versimu terbaru dengan menjalankan `npx yt-dlp-exec --update` atau update paket via `npm update yt-dlp-exec`.
- **Port 3000 sudah dipakai**: jalankan dengan port lain, misalnya `PORT=4000 npm start`.
- **Unduhan lambat/gagal di tengah jalan**: ini tergantung kecepatan koneksi ke server asal video, bukan ke server Node.js-mu.

## Pengembangan Lanjutan (Opsional)

- Tambahkan `nodemon` (`npm run dev`) untuk auto-restart saat mengedit kode — sudah ada di `devDependencies`, cukup jalankan `npm install` lalu `npm run dev`.
- Tambahkan rate-limiting (misalnya `express-rate-limit`) agar API tidak disalahgunakan.
- Tambahkan opsi "unduh audio saja (MP3)" dengan mengatur `format: 'bestaudio'` di endpoint download.
