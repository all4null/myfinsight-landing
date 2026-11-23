/**
 * 가운데 로고가 든 QR 코드. 빌드할 때 SVG 로 그려 HTML 에 넣는다 (브라우저로 내려가는 스크립트 없음).
 * 오류 복원 H(약 30%까지 복원)로 만들고, 가운데 칸(폭의 약 22%, 면적 5~6%)은 비운 채 흰 상자 위에 로고를 올린다.
 * 반쯤 가려진 칸이 남지 않아 카메라가 더 잘 읽는다.
 */
import QRCode from "qrcode";

const MARGIN = 4; // 바깥 흰 여백(칸 수). QR 규격의 최소 여백
const LOGO_RATIO = 0.22;

/** 24x24 기준 로고 */
const logos = {
  // MyFinSight 사이트 아이콘 (public/favicon.svg 와 같은 모양)
  site: (
    <g transform="scale(0.75)">
      <rect width="32" height="32" rx="8" fill="#1d4ed8" />
      <g fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" transform="translate(5 5) scale(0.917)">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
      </g>
    </g>
  ),
  // GitHub 마크 (simple-icons, CC0. 로고는 GitHub 의 상표)
  github: (
    <path
      fill="#181717"
      d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
    />
  ),
} as const;

export type QrLogo = keyof typeof logos;

export default function QrCode({ url, logo, label, size = 136 }: { url: string; logo: QrLogo; label: string; size?: number }) {
  const qr = QRCode.create(url, { errorCorrectionLevel: "H" });
  const n = qr.modules.size;
  const total = n + MARGIN * 2;

  // 가운데 비울 칸 (QR 칸 수와 홀짝을 맞춰 정가운데에)
  let box = Math.round(n * LOGO_RATIO);
  if (box % 2 !== n % 2) box += 1;
  const start = (n - box) / 2;
  const inBox = (r: number, c: number) => r >= start && r < start + box && c >= start && c < start + box;

  let d = "";
  for (let r = 0; r < n; r++)
    for (let c = 0; c < n; c++) if (qr.modules.get(r, c) && !inBox(r, c)) d += `M${c + MARGIN} ${r + MARGIN}h1v1h-1z`;

  const bx = start + MARGIN;
  const pad = 0.6;
  const inner = box - pad * 2;

  return (
    <svg
      role="img"
      aria-label={label}
      width={size}
      height={size}
      viewBox={`0 0 ${total} ${total}`}
      shapeRendering="crispEdges"
      className="block"
    >
      <rect width={total} height={total} fill="#fff" />
      <path d={d} fill="#000" />
      <rect x={bx} y={bx} width={box} height={box} rx={box * 0.18} fill="#fff" />
      <g transform={`translate(${bx + pad} ${bx + pad}) scale(${inner / 24})`} shapeRendering="geometricPrecision">
        {logos[logo]}
      </g>
    </svg>
  );
}
