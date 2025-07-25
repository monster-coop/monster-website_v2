import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "몬스터 협동조합 OG 이미지";
export const size = {
  width: 1200,
  height: 630,
};

export default function ogImage() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 60,
          color: "#ffffff",
          background: "#6a5af9",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          paddingLeft: "100px",
        }}
      >
        <span style={{ fontWeight: 700 }}>몬스터 협동조합</span>
        <span style={{ fontSize: 32, marginTop: 20 }}>팀프러너를 양성하는 No.1 교육 기관</span>
      </div>
    ),
    {
      ...size,
    }
  );
} 