import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { FloatingContacts } from "@/components/floating-contacts";
import { YandexMetrika } from "@/components/yandex-metrika";
import { SITE } from "@/lib/constants";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.title,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "Яндекс Такси",
    "таксопарк",
    "Армада",
    "подключение водителей",
    "самозанятый такси",
    "трудовой договор такси",
  ],
  authors: [{ name: SITE.fullName }],
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: SITE.url,
    siteName: SITE.fullName,
    title: SITE.title,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/icon.svg",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "EmploymentAgency",
      name: SITE.fullName,
      description: SITE.description,
      url: SITE.url,
      telephone: "+79180521022",
      openingHours: "Mo-Su 08:00-21:00",
      areaServed: "RU",
      sameAs: ["https://t.me/park_Armada_d"],
    },
    {
      "@type": "TaxiService",
      name: SITE.fullName,
      description:
        "Подключение водителей к Яндекс Такси: парковый самозанятый, ИП и трудовой договор.",
      url: SITE.url,
      telephone: "+79180521022",
      provider: {
        "@type": "Organization",
        name: SITE.fullName,
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="dark">
      <body
        className={`${inter.variable} ${sora.variable} min-h-screen bg-background font-sans text-foreground antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <YandexMetrika />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <FloatingContacts />
      </body>
    </html>
  );
}
