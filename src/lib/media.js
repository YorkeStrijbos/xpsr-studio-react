import dims from '../assets/media/dims.json';

// Alle gegenereerde media (zie scripts/build-media.sh) als URL, per naam gegroepeerd.
const files = import.meta.glob('../assets/media/*.{avif,webp,jpg,mp4,webm}', {
  eager: true,
  query: '?url',
  import: 'default',
});

const stills = {};
const motion = {};

for (const [path, url] of Object.entries(files)) {
  const file = path.split('/').pop();
  const still = file.match(/^(.+)-(\d+)\.(avif|webp|jpg)$/);
  if (still) {
    const [, name, w, ext] = still;
    stills[name] ??= { avif: [], webp: [], jpg: null };
    if (ext === 'jpg') stills[name].jpg = url;
    else stills[name][ext].push({ w: Number(w), url });
    continue;
  }
  const mov = file.match(/^(.+?)(-poster)?\.(mp4|webm|webp)$/);
  if (mov) {
    const [, name, poster, ext] = mov;
    motion[name] ??= {};
    if (poster) motion[name].poster = url;
    else motion[name][ext] = url;
  }
}

const srcset = (list) =>
  list
    .slice()
    .sort((a, b) => a.w - b.w)
    .map((s) => `${s.url} ${s.w}w`)
    .join(', ');

export function getStill(name) {
  const s = stills[name];
  if (!s) throw new Error(`Onbekend beeld: ${name}`);
  const [width, height] = dims[name] ?? [];
  return { avif: srcset(s.avif), webp: srcset(s.webp), jpg: s.jpg, width, height };
}

export function getMotion(name) {
  const m = motion[name];
  if (!m?.mp4) throw new Error(`Onbekende video: ${name}`);
  const [width, height] = dims[`${name}-poster`] ?? [];
  return { ...m, width, height };
}
