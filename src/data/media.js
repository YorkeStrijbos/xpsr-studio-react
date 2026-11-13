/*
 * Media-slots: elke plek waar later echte footage komt. Lever een bestand aan onder /public/media met precies
 * de naam uit `file`, en de site gebruikt het automatisch. Zolang het bestand er niet is, valt de browser terug
 * op `fallback` (een bestaand asset uit src/assets/media): een <video> probeert zijn <source>-elementen op volgorde.
 * Encode voor loops: H.264 (High), geen audio, faststart. Bijvoorbeeld:
 *   ffmpeg -i bron.mov -an -c:v libx264 -profile:v high -crf 22 -preset slow -pix_fmt yuv420p -movflags +faststart -vf scale=1920:-2 hero-reel.mp4
 */
export const SLOTS = {
  reel: {
    file: `${import.meta.env.BASE_URL}media/reel.mp4`,
    fallback: 'loop-reym-juri', // TODO XPSR: showreel aanleveren; tot die tijd speelt dit korte fragment.
    spec: 'Showreel 60 tot 90 s, 1920x1080 of groter, 25 fps, H.264 rond 10 Mbps, met audio (AAC 192 kbps). Opent in de fullscreen player.',
  },
  heroReel: {
    file: `${import.meta.env.BASE_URL}media/hero-reel.mp4`,
    fallback: 'loop-reym-juri', // TODO XPSR: hero-reel.mp4 aanleveren; deze fallback is 380 px breed en dus zacht.
    spec: '1920x1080, 8 tot 12 s naadloze loop, 25 fps, H.264 rond 6 Mbps, geen audio. Industrie: vonken, lassen, machines, vakmensen. Veel contrast en licht: hij speelt in de letters van de kop.',
  },
};
