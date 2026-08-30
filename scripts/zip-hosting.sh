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
Релиз: hosting-v66 (30.08.2026)

1. Распакуйте этот ZIP.
2. В файловом менеджере Reg.ru (server54) откройте КОРЕНЬ сайта:
   /www/park-armada.ru/
   (не public_html, если в панели указан именно этот путь).
3. Загрузите ВСЕ файлы из архива В КОРЕНЬ этой папки
   (чтобы index.html оказался в /www/park-armada.ru/index.html).
4. Домен park-armada.ru — A-запись на IP этого сервера.
5. SSL уже через панель Reg.ru / nginx — не включать принудительный HTTPS в .htaccess.
6. Проверьте:
   https://park-armada.ru/
   https://park-armada.ru/trudovoj-dogovor/
   https://park-armada.ru/llms.txt
   https://park-armada.ru/feed.xml
   https://park-armada.ru/armadaidx7Kq2Nm9Px4Rt8Wv.txt
   https://park-armada.ru/yandex_618ea4dc33112d20.html

Заявка на статике открывает MAX/Telegram с готовым текстом.
После заливки из репозитория можно отправить IndexNow: npm run indexnow
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
cp -f "$ZIP_PATH" "${OUT_DIR}/park-armada-hosting-v66.zip"
cp -f "$ZIP_PATH" "${ARTIFACTS}/park-armada-hosting-v66.zip"

# Публичная ссылка на скачивание: GitHub raw из папки hosting-upload/
mkdir -p "${ROOT}/hosting-upload"
cp -f "$ZIP_PATH" "${ROOT}/hosting-upload/park-armada-hosting-v66.zip"
cp -f "$ZIP_PATH" "${ROOT}/hosting-upload/park-armada-hosting-latest.zip"
echo "Download: https://github.com/armadaparkvg-ux/1/raw/cursor/armada-landing-1d2d/hosting-upload/park-armada-hosting-v66.zip"

ls -lh "$ZIP_PATH" "$SRC_PATH" "${OUT_DIR}/park-armada-hosting-v66.zip"
echo "Artifacts:"
ls -lh "${ARTIFACTS}/${ZIP_NAME}" "${ARTIFACTS}/${SRC_ZIP}" "${ARTIFACTS}/park-armada-hosting-v66.zip"
echo "OK: ${ZIP_PATH}"
