import { SITE } from "@/lib/constants";

/**
 * Ключ IndexNow (Яндекс / Bing). Файл в корне:
 * https://park-armada.ru/{INDEXNOW_KEY}.txt
 * Содержимое файла = сам ключ, без HTML.
 * @see https://yandex.ru/support/webmaster/ru/indexnow/key
 */
export const INDEXNOW_KEY = "armadaidx7Kq2Nm9Px4Rt8Wv";

export const INDEXNOW_KEY_PATH = `/${INDEXNOW_KEY}.txt`;

export const INDEXNOW_KEY_URL = `${SITE.url}${INDEXNOW_KEY_PATH}`;
