const express = require('express');
const path = require('path');
const cors = require('cors');
const youtubedl = require('yt-dlp-exec');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Regex kasar untuk deteksi platform, hanya dipakai untuk label di UI
function detectPlatform(url = '') {
  const u = url.toLowerCase();
  if (u.includes('youtube.com') || u.includes('youtu.be')) return 'YouTube';
  if (u.includes('instagram.com')) return 'Instagram';
  if (u.includes('tiktok.com')) return 'TikTok';
  if (u.includes('twitter.com') || u.includes('x.com')) return 'Twitter / X';
  if (u.includes('facebook.com') || u.includes('fb.watch')) return 'Facebook';
  return 'Platform lain';
}

// Ambil informasi video + daftar format yang tersedia
app.post('/api/info', async (req, res) => {
  const { url } = req.body || {};

  if (!url || !/^https?:\/\//i.test(url)) {
    return res.status(400).json({ error: 'Masukkan URL video yang valid (harus diawali http:// atau https://).' });
  }

  try {
    const info = await youtubedl(url, {
      dumpSingleJson: true,
      noWarnings: true,
      noCallHome: true,
      noCheckCertificate: true,
      preferFreeFormats: true,
      addHeader: ['referer:youtube.com', 'user-agent:googlebot']
    });

    const seen = new Set();
    const formats = (info.formats || [])
      .filter((f) => f.url && (f.vcodec !== 'none' || f.acodec !== 'none'))
      .map((f) => ({
        format_id: f.format_id,
        ext: f.ext,
        resolution: f.height ? `${f.height}p` : (f.vcodec === 'none' ? 'Audio' : (f.resolution || 'N/A')),
        filesize: f.filesize || f.filesize_approx || null,
        has_video: f.vcodec !== 'none',
        has_audio: f.acodec !== 'none',
        note: f.format_note || ''
      }))
      .filter((f) => {
        // buang duplikat resolusi+ekstensi supaya list tidak terlalu panjang
        const key = `${f.resolution}-${f.ext}-${f.has_audio}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .sort((a, b) => (parseInt(b.resolution) || 0) - (parseInt(a.resolution) || 0));

    res.json({
      title: info.title || 'Tanpa judul',
      thumbnail: info.thumbnail,
      duration: info.duration,
      uploader: info.uploader || info.channel || '',
      platform: detectPlatform(url),
      formats
    });
  } catch (err) {
    console.error('info error:', err.message);
    res.status(500).json({
      error: 'Gagal mengambil informasi video. Pastikan link publik, valid, dan platform didukung oleh yt-dlp.'
    });
  }
});

// Stream unduhan langsung ke browser (tanpa menyimpan file di server)
app.get('/api/download', (req, res) => {
  const { url, format_id, title } = req.query;

  if (!url) return res.status(400).send('URL wajib diisi');

  const safeName = (title || 'video').replace(/[^\w\s.-]/g, '').slice(0, 80) || 'video';
  res.setHeader('Content-Disposition', `attachment; filename="${safeName}.mp4"`);
  res.setHeader('Content-Type', 'application/octet-stream');

  const subprocess = youtubedl.exec(
    url,
    {
      format: format_id || 'best',
      output: '-',
      noWarnings: true,
      noCheckCertificate: true
    },
    { stdio: ['ignore', 'pipe', 'pipe'] }
  );

  subprocess.stdout.pipe(res);

  subprocess.stderr.on('data', (d) => console.error('yt-dlp:', d.toString()));

  subprocess.on('error', (err) => {
    console.error('download error:', err);
    if (!res.headersSent) res.status(500).send('Gagal mengunduh video');
  });

  req.on('close', () => {
    subprocess.kill();
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server berjalan di http://localhost:${PORT}`);
});
