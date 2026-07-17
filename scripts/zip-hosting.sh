#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

bash scripts/build-static.sh

STAMP=$(date +%Y%m%d)
OUT_DIR="dist"
ZIP_NAME="park-armada-hosting-${STAMP}.zip"
ZIP_PATH="${OUT_DIR}/${ZIP_NAME}"
ARTIFACTS="/opt/cursor/artifacts"

mkdir -p "$OUT_DIR" "$ARTIFACTS"
rm -f "$ZIP_PATH" "${ARTIFACTS}/${ZIP_NAME}"

# Zip contents of out/ (not the out folder itself) for direct public_html upload
(
  cd out
  zip -r "../${ZIP_PATH}" . \
    -x "*.DS_Store" \
    -x "**/.DS_Store"
)

cp -f "$ZIP_PATH" "${ARTIFACTS}/${ZIP_NAME}"

# Also pack full source for Node hosting / backup
SRC_ZIP="park-armada-source-${STAMP}.zip"
SRC_PATH="${OUT_DIR}/${SRC_ZIP}"
rm -f "$SRC_PATH" "${ARTIFACTS}/${SRC_ZIP}"
zip -r "$SRC_PATH" . \
  -x "node_modules/*" \
  -x ".next/*" \
  -x "out/*" \
  -x "dist/*" \
  -x ".git/*" \
  -x ".static-build-backup/*" \
  -x "*.zip"

cp -f "$SRC_PATH" "${ARTIFACTS}/${SRC_ZIP}"

# Instructions inside hosting zip already via README in out
cat > out/КАК_ЗАГРУЗИТЬ.txt <<'EOF'
Загрузка сайта таксопарка «Армада» на хостинг
==============================================

1. Распакуйте этот ZIP (или загрузите файлы как есть).
2. В файловом менеджере хостинга откройте папку сайта:
   - обычно public_html или www
3. Загрузите ВСЕ файлы из архива В КОРЕНЬ этой папки
   (чтобы index.html оказался в public_html/index.html).
4. Домен park-armada.ru должен указывать A-записью на IP хостинга.
5. Включите SSL (Let's Encrypt) в панели Reg.ru.
6. Проверьте:
   https://park-armada.ru/
   https://park-armada.ru/yandex_618ea4dc33112d20.html

Форма заявки на статическом хостинге открывает Telegram
с готовым текстом заявки (API на shared-хостинге недоступен).
EOF

# Rebuild zip with instructions
rm -f "$ZIP_PATH" "${ARTIFACTS}/${ZIP_NAME}"
(
  cd out
  zip -r "../${ZIP_PATH}" . \
    -x "*.DS_Store" \
    -x "**/.DS_Store"
)
cp -f "$ZIP_PATH" "${ARTIFACTS}/${ZIP_NAME}"

ls -lh "$ZIP_PATH" "$SRC_PATH"
echo "Artifacts:"
ls -lh "${ARTIFACTS}/${ZIP_NAME}" "${ARTIFACTS}/${SRC_ZIP}"
echo "OK: ${ZIP_PATH}"
