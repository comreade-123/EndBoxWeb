// 站点动效：实时时钟、数字滚动、滚动进入、阅读进度条。
const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function wireClock() {
  const clocks = document.querySelectorAll('[data-clock]');
  const dates = document.querySelectorAll('[data-clock-date]');
  if (!clocks.length && !dates.length) return;
  const pad = (n) => String(n).padStart(2, '0');
  const tick = () => {
    const now = new Date();
    const time = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    clocks.forEach((el) => (el.textContent = time));
    const date = `${now.getFullYear()}.${pad(now.getMonth() + 1)}.${pad(now.getDate())}`;
    dates.forEach((el) => (el.textContent = date));
  };
  tick();
  setInterval(tick, 1000);
}

function wireCounters() {
  const nodes = [...document.querySelectorAll('[data-count]')];
  if (!nodes.length) return;
  const run = (el) => {
    if (el.dataset.counted) return;
    el.dataset.counted = '1';
    const target = Number(el.dataset.count);
    if (!Number.isFinite(target)) return;
    if (reduceMotion()) {
      el.textContent = String(target);
      return;
    }
    const start = performance.now();
    const step = (t) => {
      const p = Math.min(1, (t - start) / 780);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && run(e.target)),
    { threshold: 0.4 }
  );
  nodes.forEach((n) => io.observe(n));
}

function wireReveal() {
  const nodes = [
    ...document.querySelectorAll('.doc-section, .banner, .gallery figure, .stat-band > div, .module-rows li'),
  ];
  if (!nodes.length || reduceMotion()) return;
  nodes.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${Math.min(i * 38, 380)}ms`;
  });
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      }),
    { threshold: 0.1 }
  );
  nodes.forEach((n) => io.observe(n));
}

function wireScrollProgress() {
  const root = document.documentElement;
  const update = () => {
    const max = root.scrollHeight - root.clientHeight;
    const pct = max > 0 ? Math.min(1, Math.max(0, root.scrollTop / max)) : 0;
    root.style.setProperty('--scroll', pct.toFixed(4));
  };
  update();
  document.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
}

function wireFilters() {
  const chips = [...document.querySelectorAll('[data-filter]')];
  const rows = [...document.querySelectorAll('.module-rows li')];
  if (chips.length && rows.length) {
    const apply = (cat) => {
      rows.forEach((row) => {
        row.classList.toggle('is-hidden', cat !== 'all' && row.dataset.cat !== cat);
      });
    };
    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        chips.forEach((c) => c.classList.toggle('is-active', c === chip));
        apply(chip.dataset.filter || 'all');
      });
    });
  }

  const input = document.querySelector('[data-rail-filter]');
  const links = [...document.querySelectorAll('.rail-mods a')];
  if (input && links.length) {
    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      links.forEach((a) => {
        const hay = `${a.textContent} ${a.dataset.mod || ''}`.toLowerCase();
        a.classList.toggle('is-hidden', q.length > 0 && !hay.includes(q));
      });
    });
  }
}

function wireRailSpy() {
  const links = [...document.querySelectorAll('.rail > a[href^="#"]')];
  if (!links.length) return;
  const sections = links
    .map((a) => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);
  const set = (id) => {
    links.forEach((a) => {
      if (a.getAttribute('href') === '#' + id) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
  };
  const io = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (visible) set(visible.target.id);
    },
    { rootMargin: '-15% 0px -70% 0px', threshold: 0 }
  );
  sections.forEach((s) => io.observe(s));
}

export function wireSiteFx() {
  wireClock();
  wireCounters();
  wireReveal();
  wireScrollProgress();
  wireFilters();
  wireRailSpy();
}
