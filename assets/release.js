// 站点版本信息：优先读 GitHub Release，读不到就用同目录的 release.json。
// 发布新版本后不需要改页面——打一个带 zip 资产的 Release 即可自动更新。
const REPO = 'comreade-123/EndBox';
const API = `https://api.github.com/repos/${REPO}/releases/latest`;
const FALLBACK = './release.json';

function humanSize(bytes) {
  if (!bytes || bytes < 1024) return bytes ? `${bytes} B` : '—';
  const mb = bytes / 1024 / 1024;
  return mb >= 100 ? `${Math.round(mb)} MB` : `${mb.toFixed(1)} MB`;
}

function isoDate(value) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())}`;
}

async function fetchLatest() {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 4500);
  try {
    const res = await fetch(API, { signal: ctrl.signal, headers: { Accept: 'application/vnd.github+json' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const asset = (data.assets || []).find((a) => /\.zip$/i.test(a.name || ''));
    const digest = typeof asset?.digest === 'string' ? asset.digest.replace(/^sha256:/i, '') : '';
    return {
      version: String(data.tag_name || data.name || '').replace(/^v/i, ''),
      zip_name: asset?.name || '',
      size: asset?.size || 0,
      sha256: digest,
      published_at: data.published_at || '',
      release_url: data.html_url || '',
      download_url: asset?.browser_download_url || data.html_url || '',
    };
  } finally {
    clearTimeout(timer);
  }
}

async function fetchFallback() {
  const res = await fetch(FALLBACK, { cache: 'no-cache' });
  if (!res.ok) throw new Error(`fallback HTTP ${res.status}`);
  return res.json();
}

function apply(data) {
  const set = (selector, value, attr) => {
    if (value === undefined || value === null || value === '') return;
    document.querySelectorAll(selector).forEach((el) => {
      if (attr) el.setAttribute(attr, value);
      else el.textContent = value;
    });
  };
  set('[data-release-version]', `v${data.version}`);
  set('[data-release-version-number]', data.version);
  set('[data-release-title]', `下载 EndBox ${data.version}`);
  set('[data-release-download]', data.download_url, 'href');
  set('[data-release-release]', data.release_url, 'href');
  set('[data-release-zip]', data.zip_name);
  set('[data-release-size]', humanSize(data.size));
  set('[data-release-sha]', data.sha256 ? `SHA256 ${data.sha256}` : 'SHA256 见 Releases 页面');
  set('[data-release-date]', isoDate(data.published_at));
  document.documentElement.dataset.releaseVersion = data.version || '';
}

export async function wireRelease() {
  let data = null;
  try {
    data = await fetchLatest();
  } catch {
    try {
      data = await fetchFallback();
    } catch {
      return; // 两个来源都失败：保留页面里的兜底文案
    }
  }
  if (data && data.version) apply(data);
}
