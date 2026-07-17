import { ImageResponse } from "next/og";
import { SITE } from "@/lib/constants";

export const runtime = "edge";
export const alt = "Подключение к Яндекс Такси — таксопарк Армада";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(145deg, #0B0F14 0%, #0F1724 45%, #151d2e 100%)",
          padding: "64px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "14px",
              background: "#F59E0B",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#0B0F14",
              fontSize: "28px",
              fontWeight: 700,
            }}
          >
            A
          </div>
          <div
            style={{
              fontSize: "36px",
              fontWeight: 700,
              color: "#FBBF24",
              letterSpacing: "-0.02em",
            }}
          >
            {SITE.name}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              fontSize: "56px",
              fontWeight: 700,
              color: "#F8FAFC",
              lineHeight: 1.15,
              letterSpacing: "-0.03em",
              maxWidth: "980px",
            }}
          >
            Подключение к Яндекс Такси
          </div>
          <div
            style={{
              fontSize: "28px",
              color: "#94A3B8",
              lineHeight: 1.4,
              maxWidth: "900px",
            }}
          >
            Самозанятый и ИП от 1,9% · Трудовой договор · Лицензия ФГИС
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#64748B",
            fontSize: "22px",
          }}
        >
          <span>{SITE.domain}</span>
          <span>8:00–21:00 Мск</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
