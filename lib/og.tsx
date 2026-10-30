import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 } as const;

/** The 1200x630 card shared by every page. Rendered once at build time. */
export function ogImage({ eyebrow, title }: { eyebrow: string; title: string }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(135deg, #0b6b74 0%, #0f8f99 60%, #4cc3cb 100%)",
          color: "#ffffff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 40, fontWeight: 800 }}>
          <svg width="56" height="56" viewBox="0 0 32 32">
            <rect width="32" height="32" rx="9" fill="#ffffff" />
            <path
              d="M6 13c3-3.2 6-3.2 10 0s7 3.2 10 0M6 20c3-3.2 6-3.2 10 0s7 3.2 10 0"
              fill="none"
              stroke="#0b6b74"
              strokeWidth="2.6"
              strokeLinecap="round"
            />
          </svg>
          Tidepool
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", opacity: 0.9 }}>{eyebrow}</div>
          <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2, maxWidth: 980 }}>{title}</div>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
