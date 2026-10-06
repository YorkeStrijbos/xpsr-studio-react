#!/usr/bin/env bash
# Zet bronbeelden in src/assets/images om naar web-formaten in src/assets/media.
# Stills: AVIF + WebP in 640px en volle breedte (max 1600), plus JPG-fallback.
# Bewegend (gif/animated webp): H.264 mp4 + VP9 webm + poster.
# TODO XPSR: vervangen door masters zodra de showreel en loops in hoge kwaliteit binnen zijn.
set -euo pipefail
cd "$(dirname "$0")/.."
SRC=src/assets/images
OUT=src/assets/media
FFMPEG=${FFMPEG:-ffmpeg}
mkdir -p "$OUT"

for f in "$SRC"/proj-*.jpg; do
  name=$(basename "$f" .jpg | sed 's/^proj-//')
  w=$(magick identify -format '%w' "$f")
  full=$(( w > 1600 ? 1600 : w ))
  for size in 640 "$full"; do
    [ "$size" -gt "$w" ] && continue
    magick "$f" -resize "${size}x" -quality 62 "$OUT/$name-$size.avif"
    magick "$f" -resize "${size}x" -quality 78 "$OUT/$name-$size.webp"
  done
  magick "$f" -resize "${full}x" -quality 82 -strip "$OUT/$name-$full.jpg"
done

encode_motion() { # $1 = bron, $2 = naam
  local tmp; tmp=$(mktemp -d)
  # Frames uitpakken via ImageMagick, zodat animated webp ook werkt.
  magick "$1" -coalesce "$tmp/f_%04d.png"
  local delay; delay=$(magick identify -format '%T\n' "$1" | head -1)
  local fps=$(( delay > 0 ? 100 / delay : 12 )); [ "$fps" -lt 1 ] && fps=12
  local vf="scale=trunc(iw/2)*2:trunc(ih/2)*2"
  "$FFMPEG" -loglevel error -y -framerate "$fps" -i "$tmp/f_%04d.png" -vf "$vf" -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 20 -preset slow -movflags +faststart -an "$OUT/$2.mp4"
  "$FFMPEG" -loglevel error -y -framerate "$fps" -i "$tmp/f_%04d.png" -vf "$vf" -c:v libvpx-vp9 -b:v 0 -crf 34 -row-mt 1 -an "$OUT/$2.webm"
  magick "$tmp/f_0001.png" -quality 80 "$OUT/$2-poster.webp"
  rm -rf "$tmp"
}

encode_motion "$SRC/hero-bg.webp" reel-boterlap-tafel
encode_motion "$SRC/statement-gif-boterlap-table.gif" loop-boterlap-tafel
encode_motion "$SRC/statement-gif-reym-juri.gif" loop-reym-juri

# Afmetingen voor width/height-attributen (voorkomt layout shift).
{
  echo "{"
  first=1
  for f in "$OUT"/*.jpg "$OUT"/*-poster.webp; do
    name=$(basename "$f"); name=${name%.*}; name=$(echo "$name" | sed -E 's/-[0-9]+$//')
    dims=$(magick identify -format '[%w,%h]' "$f")
    [ $first -eq 1 ] && first=0 || echo ","
    printf '  "%s": %s' "$name" "$dims"
  done
  echo; echo "}"
} > "$OUT/dims.json"
