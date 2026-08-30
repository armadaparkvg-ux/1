import Script from "next/script";
import { METRIKA_ID } from "@/lib/metrika";
import { VarioqubSpaInit } from "@/components/varioqub-spa-init";

/**
 * Яндекс Вариокуб — после interactive, не beforeInteractive
 * (иначе блокирует первый paint на мобиле).
 */
export function YandexVarioqub() {
  return (
    <>
      <Script id="yandex-varioqub" strategy="lazyOnload">{`
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
