import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ScrollDepthTracker } from "@/components/scroll-depth-tracker";
import { StickyActions } from "@/components/sticky-actions";
import { YandexMetrika } from "@/components/yandex-metrika";
import { YandexVarioqub } from "@/components/yandex-varioqub";
import { Providers } from "@/components/providers";
import { SITE } from "@/lib/constants";
import { SEO_KEYWORDS } from "@/lib/seo";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.title,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: SEO_KEYWORDS.slice(0, 28),
  authors: [{ name: SITE.fullName }],
  creator: SITE.fullName,
  publisher: SITE.fullName,
  category: "transportation",
  applicationName: SITE.fullName,
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: SITE.url,
    siteName: SITE.fullName,
    title: SITE.title,
    description: SITE.description,
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Подключение к Яндекс Такси — таксопарк Армада",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
    images: ["/og.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    types: {
      "application/rss+xml": `${SITE.url}/feed.xml`,
    },
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  other: {
    "geo.region": "RU",
    "format-detection": "telephone=yes",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="dark">
      <head>
        <link rel="describedby" href={`${SITE.url}/llms.txt`} />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Статьи таксопарка Армада"
          href={`${SITE.url}/feed.xml`}
        />
      </head>
      <body
        className={`${manrope.variable} min-h-screen bg-background font-sans text-foreground antialiased`}
      >
        <a href="#main" className="skip-link">
          Перейти к содержимому
        </a>
        <Providers>
          <Header />
          <main id="main" className="pb-0">
            {children}
          </main>
          <Footer />
          <StickyActions />
          <ScrollDepthTracker />
        </Providers>
        {/* Аналитика после контента — не блокирует первый экран */}
        <YandexVarioqub />
        <YandexMetrika />
      </body>
    </html>
  );
}
