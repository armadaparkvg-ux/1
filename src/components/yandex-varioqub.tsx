import Script from "next/script";
import { METRIKA_ID } from "@/lib/metrika";
import { VarioqubSpaInit } from "@/components/varioqub-spa-init";

/**
 * Яндекс Вариокуб (A/B и персонализации).
 * Счётчик Метрики уже на сайте — сюда только сниппет ymab.
 * @see https://yandex.ru/support/varioqub/ru/connect
 */
export function YandexVarioqub() {
  return (
    <>
      <Script id="yandex-varioqub" strategy="beforeInteractive">{`
(function(e, x, pe, r, i, me, nt){
  e[i]=e[i]||function(){(e[i].a=e[i].a||[]).push(arguments)};
  me=x.createElement(pe);me.async=1;me.src=r;
  nt=x.getElementsByTagName(pe)[0];
  me.addEventListener("error",function(){
    function cb(t){t=t[t.length-1];"function"==typeof t&&t({flags:{}})}
    Array.isArray(e[i].a)&&e[i].a.forEach(cb);
    e[i]=function(){cb(arguments)};
  });
  nt.parentNode.insertBefore(me,nt);
})(window, document, 'script', 'https://abt.s3.yandex.net/expjs/latest/exp.js', 'ymab');

ymab('metrika.${METRIKA_ID}', 'init');
`}</Script>
      <VarioqubSpaInit />
    </>
  );
}
