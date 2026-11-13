#!/bin/sh
# Bouwt de site en zet hem live op https://yorkestrijbos.github.io/xpsr-studio-react/ (branch gh-pages).
# Gebruik: npm run deploy
set -e
GITHUB_PAGES=1 npm run build
# Pages kent geen SPA-routing: 404.html is een kopie van de app, zodat /cases/... direct werkt.
cp dist/index.html dist/404.html
touch dist/.nojekyll
cd dist
git init -q -b gh-pages
git add -A
git commit -q -m "Deploy $(git -C .. rev-parse --short HEAD)"
git push -q -f "$(git -C .. remote get-url origin)" gh-pages
rm -rf .git
