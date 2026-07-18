"use client";

import { FadeIn, SectionHeading } from "@/components/fade-in";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function FunnyVideo() {
  return (
    <section
      id="video"
      className="section-anchor relative py-16 sm:py-20"
      aria-labelledby="video-heading"
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionHeading
            id="video-heading"
            eyebrow="Видео"
            title="Коротко и по делу: комиссия парка vs «сюрпризы»"
            description="15 секунд юмора про жизнь водителя — и намёк, зачем выбирать парк с понятными 1,9%."
          />
        </FadeIn>

        <FadeIn delay={0.08} className="mt-8">
          <div className="overflow-hidden rounded-2xl border border-border bg-black shadow-card">
            <video
              className="aspect-video w-full"
              controls
              playsInline
              preload="metadata"
              poster="/images/hero-banner.jpg"
            >
              <source src="/video/armada-taxi-short.mp4" type="video/mp4" />
              Ваш браузер не поддерживает видео.
            </video>
          </div>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Button asChild shine>
              <Link href="/#quiz">Подобрать тариф без сюрпризов</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/blog/">Читать короткие статьи</Link>
            </Button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
