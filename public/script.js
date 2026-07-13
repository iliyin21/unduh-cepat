
const form = document.getElementById('downloadForm');
const urlInput = document.getElementById('urlInput');
const submitBtn = document.getElementById('submitBtn');
const btnLabel = submitBtn.querySelector('.btn-label');
const btnSpinner = submitBtn.querySelector('.btn-spinner');
const formError = document.getElementById('formError');
const platformResult = document.getElementById("platformResult");

urlInput.addEventListener("input", function(){

    const url = urlInput.value.toLowerCase();

    if(url.includes("instagram.com")){
        platformResult.innerHTML = "✓ Instagram terdeteksi";
    }

    else if(url.includes("tiktok.com")){
        platformResult.innerHTML = "✓ TikTok terdeteksi";
    }

    else if(url.includes("youtube.com") || url.includes("youtu.be")){
        platformResult.innerHTML = "✓ YouTube terdeteksi";
    }

    else if(url.includes("facebook.com")){
        platformResult.innerHTML = "✓ Facebook terdeteksi";
    }

    else if(url.includes("twitter.com") || url.includes("x.com")){
        platformResult.innerHTML = "✓ Twitter/X terdeteksi";
    }

    else{
        platformResult.innerHTML = "";
    }

});
const resultSection = document.getElementById('resultSection');
const resThumb = document.getElementById('resThumb');
const resPlatform = document.getElementById('resPlatform');
const resTitle = document.getElementById('resTitle');
const resMeta = document.getElementById('resMeta');
const formatList = document.getElementById('formatList');

function setLoading(isLoading) {
  submitBtn.disabled = isLoading;
  btnLabel.hidden = isLoading;
  btnSpinner.hidden = !isLoading;
}

function showError(message) {
  formError.textContent = message;
  formError.hidden = false;
}

function hideError() {
  formError.hidden = true;
  formError.textContent = '';
}

function formatDuration(seconds) {
  if (!seconds) return '';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function formatSize(bytes) {
  if (!bytes) return '';
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${(bytes / 1024).toFixed(0)} KB`;
}

function renderResult(data, sourceUrl) {
  resThumb.src = data.thumbnail || '';
  resPlatform.textContent = data.platform || 'Video';
  resTitle.textContent = data.title;

  const metaParts = [];
  if (data.uploader) metaParts.push(data.uploader);
  if (data.duration) metaParts.push(formatDuration(data.duration));
  resMeta.textContent = metaParts.join(' • ');

  formatList.innerHTML = '';

  if (!data.formats || data.formats.length === 0) {
    formatList.innerHTML = '<p style="color:var(--ink-soft); font-size:0.85rem;">Tidak ada format yang bisa diunduh untuk video ini.</p>';
  } else {
    data.formats.forEach((f) => {
      const a = document.createElement('a');
      a.className = 'format-item';
      const downloadUrl = `/api/download?url=${encodeURIComponent(sourceUrl)}&format_id=${encodeURIComponent(f.format_id)}&title=${encodeURIComponent(data.title)}`;
      a.href = downloadUrl;

      a.innerHTML = `
        <span class="res">${f.has_video ? f.resolution : '🎵 Audio'}</span>
        <span class="ext">${f.ext}</span>
        ${f.filesize ? `<span class="size">${formatSize(f.filesize)}</span>` : ''}
      `;
      formatList.appendChild(a);
    });
  }

  resultSection.hidden = false;
  resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  hideError();
  resultSection.hidden = true;

  const url = urlInput.value.trim();
  if (!url) return;

  setLoading(true);

  try {
    const res = await fetch('/api/info', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });

    const data = await res.json();

    if (!res.ok) {
      showError(data.error || 'Terjadi kesalahan, coba lagi.');
      return;
    }

    renderResult(data, url);
  } catch (err) {
    console.error(err);
    showError('Tidak bisa terhubung ke server. Pastikan server Node.js sedang berjalan.');
  } finally {
    setLoading(false);
  }
});
