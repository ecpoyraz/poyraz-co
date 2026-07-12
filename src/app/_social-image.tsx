import { ImageResponse } from "next/og";

export const socialImageSize = { width: 1200, height: 630 };

export function createSocialImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#fdfbf8",
        color: "#0c0c0a",
        padding: "72px 82px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
          color: "#6b6b63",
          fontSize: 20,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
        }}
      >
        <span>Eyüp Poyraz</span>
        <span
          style={{
            display: "flex",
            width: 150,
            height: 2,
            background: "#801919",
          }}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
        <div
          style={{
            display: "flex",
            maxWidth: 1040,
            fontSize: 100,
            lineHeight: 0.94,
            letterSpacing: "-0.055em",
          }}
        >
          A full stack marketer
        </div>
        <div
          style={{
            display: "flex",
            maxWidth: 940,
            color: "#6b6b63",
            fontSize: 30,
            lineHeight: 1.35,
          }}
        >
          Hi, it&apos;s Eyüp. I blend product marketing, growth, content,
          analytics, and a little code to help tech products find traction and
          scale.
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          color: "#6b6b63",
          fontSize: 19,
          letterSpacing: "0.08em",
        }}
      >
        POYRAZ.CO
      </div>
    </div>,
    socialImageSize,
  );
}
