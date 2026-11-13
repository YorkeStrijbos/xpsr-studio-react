/*
 * Screenshots en audit-metingen van de site.
 * Gebruik: node scripts/screenshots.mjs [--base http://localhost:5174] [--out screenshots/<label>] [--reduced]
 * Maakt per breedte (1440 en 390) een full-page screenshot van home, losse viewport-screenshots per sectie
 * (bij gepinde secties ook op 25, 50 en 75% van de pin), screenshots van /cases en elke casepagina,
 * en schrijft metingen (contrast, fonts, cursor-states, placeholders, overflow, knoppen) naar audit.json.
 */
import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : fallback;
};
const BASE = arg('base', 'http://localhost:5174');
const REDUCED = process.argv.includes('--reduced');
const OUT = arg('out', `screenshots/${new Date().toISOString().slice(0, 10)}${REDUCED ? '-reduced' : ''}`);
const WIDTHS = [
  { name: '1440', viewport: { width: 1440, height: 900 } },
  { name: '390', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true },
];

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// Draait in de pagina: verzamelt de metingen.
function measure() {
  const parse = (c) => {
    const m = c.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number);
    return { r: p[0], g: p[1], b: p[2], a: p[3] ?? 1 };
  };
  const lum = ({ r, g, b }) => {
    const f = (v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const ratio = (a, b) => {
    const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
    return (x + 0.05) / (y + 0.05);
  };
  const mix = (top, bottom) => ({
    r: top.r * top.a + bottom.r * (1 - top.a),
    g: top.g * top.a + bottom.g * (1 - top.a),
    b: top.b * top.a + bottom.b * (1 - top.a),
    a: 1,
  });
  // Achtergrond onder een element: eerste dekkende kleur omhoog; staat er beeld of een gradient onder, dan "complex".
  const bgOf = (el) => {
    const r = el.getBoundingClientRect();
    const stack = document.elementsFromPoint(r.left + r.width / 2, r.top + Math.min(r.height / 2, 10));
    let color = { r: 0, g: 0, b: 0, a: 0 };
    for (const n of stack) {
      if (n === el || el.contains(n)) continue;
      if (['IMG', 'VIDEO', 'PICTURE', 'CANVAS'].includes(n.tagName) || n.closest('svg image')) return { complex: 'beeld' };
      const cs = getComputedStyle(n);
      if (cs.backgroundImage && cs.backgroundImage !== 'none' && !n.classList.contains('grain')) return { complex: 'gradient', on: n.className.toString().slice(0, 40) };
      if (n.classList.contains('grain') || n.classList.contains('cursor')) continue;
      const c = parse(cs.backgroundColor);
      if (c && c.a > 0) {
        color = color.a ? mix(color, c) : c;
        if (c.a >= 1) return { color };
      }
    }
    return { color: color.a ? mix(color, { r: 0, g: 0, b: 0, a: 1 }) : { r: 0, g: 0, b: 0, a: 1 } };
  };

  const texts = [];
  const walker = document.createTreeWalker(document.querySelector('main') || document.body, NodeFilter.SHOW_TEXT);
  const seen = new Set();
  while (walker.nextNode()) {
    const el = walker.currentNode.parentElement;
    const t = walker.currentNode.textContent.trim();
    if (!t || !el || seen.has(el)) continue;
    seen.add(el);
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    if (cs.visibility === 'hidden' || +cs.opacity === 0 || r.width === 0 || r.bottom < 0 || r.top > innerHeight) continue;
    if (el.closest('[aria-hidden="true"]') && !el.closest('.hud')) continue;
    const fg = parse(cs.color);
    const bg = bgOf(el);
    const size = parseFloat(cs.fontSize);
    const large = size >= 24 || (size >= 18.66 && +cs.fontWeight >= 700);
    const entry = { text: t.slice(0, 60), size, cls: el.className.toString().slice(0, 40) };
    if (bg.complex) texts.push({ ...entry, contrast: null, on: bg.complex });
    else {
      const c = ratio(mix(fg, bg.color), bg.color);
      texts.push({ ...entry, contrast: +c.toFixed(2), pass: c >= (large ? 3 : 4.5) });
    }
  }

  const cursors = [...document.querySelectorAll('[data-cursor]')].map((el) => ({
    value: el.getAttribute('data-cursor'),
    tag: el.tagName,
    cls: el.className.toString().slice(0, 40),
    clickable: !!el.closest('a, button') || !!el.querySelector('a, button') || el.onclick !== null || el.hasAttribute('onclick'),
    hasMedia: !!el.querySelector('img, video'),
  }));

  const buttons = [...document.querySelectorAll('.btn, button, a[class*="btn"]')]
    .filter((b) => b.offsetWidth)
    .map((b) => {
      const cs = getComputedStyle(b);
      return { text: b.textContent.trim().slice(0, 30), h: b.offsetHeight, radius: cs.borderRadius, bg: cs.backgroundColor, border: cs.borderColor, color: cs.color, cls: b.className.toString().slice(0, 40) };
    });
  const ctaLabels = {};
  document.querySelectorAll('a, button').forEach((a) => {
    const t = a.textContent.trim().toLowerCase();
    if (t) ctaLabels[t] = (ctaLabels[t] || 0) + 1;
  });

  const nav = document.querySelector('.nav');
  return {
    fonts: [...document.fonts].filter((f) => f.status === 'loaded').map((f) => `${f.family} ${f.weight} ${f.style}`),
    bodyFont: getComputedStyle(document.body).fontFamily,
    noSignal: document.querySelectorAll('.nosignal').length,
    horizontalOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    navBackground: nav ? getComputedStyle(nav).backgroundColor : null,
    navBlur: nav ? getComputedStyle(nav).backdropFilter : null,
    texts,
    cursors,
    buttons,
    ctaLabels: Object.fromEntries(Object.entries(ctaLabels).filter(([, n]) => n > 1)),
  };
}

async function shootHome(page, dir, w) {
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
  await wait(2500);
  // Eén keer door de hele pagina, zodat lazy media en ScrollTriggers klaar staan.
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 600) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await wait(60);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await wait(1200);
  await page.screenshot({ path: path.join(dir, `home-${w}-full.png`), fullPage: true });

  const sections = await page.evaluate(() =>
    [...document.querySelectorAll('main > *')]
      .filter((e) => e.offsetHeight && !e.classList.contains('vf'))
      .map((e) => {
        const r = e.getBoundingClientRect();
        const inner = e.classList.contains('pin-spacer') ? e.firstElementChild : e;
        return { name: (inner.className.toString().split(' ').find((c) => c.startsWith('s-')) || inner.className.toString().split(' ')[0] || 'sectie'), top: r.top + window.scrollY, height: r.height, pinned: e.classList.contains('pin-spacer') || !!e.querySelector('.pin-spacer') };
      }),
  );
  const audit = { sections: [] };
  let i = 0;
  for (const s of sections) {
    i++;
    const stops = s.pinned ? [0, 0.25, 0.5, 0.75] : [0];
    for (const f of stops) {
      const y = Math.round(s.top + f * Math.max(0, s.height - (await page.evaluate(() => innerHeight))));
      await page.evaluate((yy) => window.scrollTo(0, yy), y);
      await wait(1300);
      const label = `${String(i).padStart(2, '0')}-${s.name}${stops.length > 1 ? `-${Math.round(f * 100)}` : ''}`;
      await page.screenshot({ path: path.join(dir, `home-${w}-${label}.png`) });
      if (f === 0 || f === 0.5) audit.sections.push({ label, ...(await page.evaluate(measure)) });
    }
  }
  return audit;
}

async function shootCases(page, dir, w) {
  const out = {};
  await page.goto(`${BASE}/cases`, { waitUntil: 'networkidle' });
  await wait(1500);
  await page.screenshot({ path: path.join(dir, `cases-${w}.png`), fullPage: true });
  const slugs = await page.evaluate(() => [...new Set([...document.querySelectorAll('a[href^="/cases/"]')].map((a) => a.getAttribute('href').split('/')[2]))]);
  for (const slug of slugs) {
    await page.goto(`${BASE}/cases/${slug}`, { waitUntil: 'networkidle' });
    await wait(1500);
    await page.screenshot({ path: path.join(dir, `case-${slug}-${w}.png`), fullPage: true });
    out[slug] = await page.evaluate(() => ({
      placeholders: (document.body.innerText.match(/\[(PLACEHOLDER|RESULTAAT)\]/g) || []).length,
      noSignal: document.querySelectorAll('.nosignal').length,
      images: document.querySelectorAll('main img').length,
      videos: document.querySelectorAll('main video').length,
    }));
  }
  return out;
}

const browser = await chromium.launch();
const report = {};
for (const w of WIDTHS) {
  const dir = path.join(OUT, w.name);
  await mkdir(dir, { recursive: true });
  const ctx = await browser.newContext({ viewport: w.viewport, isMobile: !!w.isMobile, hasTouch: !!w.hasTouch, reducedMotion: REDUCED ? 'reduce' : 'no-preference' });
  // Preloader overslaan: die speelt alleen bij het eerste bezoek per sessie.
  await ctx.addInitScript(() => sessionStorage.setItem('xpsr-seen', '1'));
  const page = await ctx.newPage();
  const consoleMsgs = [];
  page.on('console', (m) => ['error', 'warning'].includes(m.type()) && consoleMsgs.push(`${m.type()}: ${m.text()}`));
  page.on('pageerror', (e) => consoleMsgs.push(`pageerror: ${e.message}`));
  report[w.name] = { home: await shootHome(page, dir, w.name), cases: await shootCases(page, dir, w.name), console: consoleMsgs };
  await ctx.close();
}
await browser.close();
await writeFile(path.join(OUT, 'audit.json'), JSON.stringify(report, null, 2));
console.log(`Klaar: ${OUT}`);
