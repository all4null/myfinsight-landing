/**
 * 내려받을 MyFinSight 배포판. 근거: MyFinSight/packaging/RELEASE_NOTES.md, README.md "받아서 쓰기", GitHub Releases.
 *
 * 값은 빌드할 때 정해진다. 우선순위: .env → GitHub Releases API → 아래 FALLBACK.
 *   RELEASE_VERSION     0.1.2 처럼 판 번호. 비우거나 latest 면 GitHub 에서 가장 최근 판(시험판 포함)을 쓴다.
 *   RELEASE_DATE        공개일 YYYY-MM-DD. 비우면 GitHub 의 게시 시각(한국 시간)으로.
 *   RELEASE_PRERELEASE  true/false. 비우면 GitHub 의 시험판 표시를 따른다.
 *   RELEASE_NOTES_URL   「이 버전에서 바뀐 점」 링크. 비우면 그 판의 Releases 페이지.
 *   RELEASE_GUIDE_URL   「배포판 안내」 링크. 비우면 그 판의 packaging/source-zip/README.md.
 *   GITHUB_TOKEN        (선택) 있으면 로그인한 요청으로 조회한다. GitHub Actions 배포에서 넘긴다.
 * GitHub 에 닿지 못하면(오프라인 빌드) FALLBACK 을 쓰고, 버전이 FALLBACK 과 다르면 파일 크기는 표시하지 않는다.
 * 시험판은 GitHub 의 /releases/latest 에 잡히지 않으므로, 내려받기 링크는 늘 태그를 넣은 주소로 만든다.
 */
import { cache } from "react";
import { site } from "./site";

export type Platform = "windows" | "macos" | "linux";

/** 오프라인 빌드용 마지막 확인값 (2026-11-23, v0.1.1) */
const FALLBACK = {
  version: "0.1.1",
  date: "2026-11-23",
  prerelease: true,
  sizes: { windows: 128, macos: 110, linux: 171 } as Record<Platform, number>,
};

/** 켜면 열리는 주소 (packaging/launcher.py, 고정) */
export const localUrl = "http://localhost:8765";

const env = (k: string) => {
  const v = process.env[k];
  return v && v.trim() ? v.trim() : undefined;
};
const stripV = (s: string) => s.replace(/^v/i, "");
const fileName = (version: string, suffix: string) => `MyFinSight-${version}-${suffix}`;

/** 운영체제별 실행 파일의 고정 정보 (판마다 바뀌는 것은 이름·주소·크기뿐) */
const platforms: {
  id: Platform;
  suffix: string;
  os: string;
  arch: string;
  icon: string;
  iconSize: [number, number];
  open: string;
  note: string;
}[] = [
  {
    id: "windows",
    suffix: "windows.exe",
    os: "Windows",
    arch: "64비트",
    icon: "/icons/windows.svg",
    iconSize: [28, 28],
    open: "받은 파일을 두 번 눌러 켭니다.",
    note: "서명이 없는 프로그램이라 처음에 「PC 보호」 창이 뜹니다. 「추가 정보」를 누른 뒤 「실행」을 누르세요.",
  },
  {
    id: "macos",
    suffix: "macos",
    os: "macOS",
    arch: "Apple Silicon (M1 이후)",
    icon: "/icons/apple.svg",
    iconSize: [23, 28],
    open: "터미널에서 chmod +x 로 실행 권한을 준 뒤 켭니다.",
    note: "자동 빌드로 만든 판이라 실제 맥에서는 아직 켜 보지 못했습니다. 인텔 맥은 아래의 파이썬 방법을 쓰세요.",
  },
  {
    id: "linux",
    suffix: "linux",
    os: "Linux",
    arch: "x86_64",
    icon: "/icons/linux-tux.svg",
    iconSize: [24, 28],
    open: "chmod +x 로 실행 권한을 준 뒤 켭니다.",
    note: "Ubuntu 20.04, Debian 11 이후에서 돕니다. 데스크톱 키링이 없으면 주소와 키를 화면에서 저장할 수 없습니다.",
  },
];

export type Executable = (typeof platforms)[number] & { name: string; url: string; sizeMB: number | null };

export type Release = {
  version: string;
  tag: string;
  /** YYYY-MM-DD, 모르면 null */
  date: string | null;
  dateLabel: string | null;
  prerelease: boolean;
  notesUrl: string;
  allUrl: string;
  guideUrl: string;
  executables: Executable[];
  sourceZip: { name: string; url: string };
};

type GitHubRelease = { tag: string; prerelease: boolean; date: string; assets: Map<string, number> };

/** GitHub Releases API 에서 판 하나를 읽는다. tag 가 없으면 가장 최근 판. 실패하면 null. */
async function fromGitHub(tag: string | null): Promise<GitHubRelease | null> {
  const m = site.repoUrl.match(/github\.com\/([^/]+)\/([^/#?]+)/);
  if (!m) return null;
  const api = `https://api.github.com/repos/${m[1]}/${m[2].replace(/\.git$/, "")}/releases`;
  // 토큰이 있으면(GitHub Actions 의 GITHUB_TOKEN 등) 로그인한 요청으로: 조회 한도가 시간당 60번에서 크게 늘어난다
  const token = env("GITHUB_TOKEN");
  try {
    const res = await fetch(tag ? `${api}/tags/${tag}` : `${api}?per_page=1`, {
      headers: { Accept: "application/vnd.github+json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      // 정적 내보내기: 빌드할 때 한 번 받아 HTML 에 굳힌다
      cache: "force-cache",
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const body = await res.json();
    const r = Array.isArray(body) ? body[0] : body;
    if (!r?.tag_name) return null;
    // 게시 시각을 한국 날짜로 (UTC+9)
    const kst = new Date(new Date(r.published_at ?? r.created_at).getTime() + 9 * 3600_000).toISOString().slice(0, 10);
    const assets = new Map<string, number>((r.assets ?? []).map((a: { name: string; size: number }) => [a.name, a.size]));
    return { tag: r.tag_name, prerelease: !!r.prerelease, date: kst, assets };
  } catch {
    return null;
  }
}

const label = (d: string) => {
  const [y, mo, da] = d.split("-").map(Number);
  return `${y}년 ${mo}월 ${da}일`;
};

/** 빌드 한 번에 한 번만 읽는다 (여러 섹션이 불러도 같은 결과) */
export const getRelease = cache(async (): Promise<Release> => {
  const wanted = env("RELEASE_VERSION");
  const latest = !wanted || wanted.toLowerCase() === "latest";
  const gh = await fromGitHub(latest ? null : `v${stripV(wanted)}`);

  const version = latest ? (gh ? stripV(gh.tag) : FALLBACK.version) : stripV(wanted);
  const tag = gh?.tag ?? `v${version}`;
  const known = version === FALLBACK.version;
  const prEnv = env("RELEASE_PRERELEASE");
  const date = env("RELEASE_DATE") ?? gh?.date ?? (known ? FALLBACK.date : null);
  const prerelease = prEnv ? prEnv.toLowerCase() === "true" : (gh?.prerelease ?? (known ? FALLBACK.prerelease : false));

  const download = (name: string) => `${site.repoUrl}/releases/download/${tag}/${name}`;
  const executables = platforms
    // GitHub 에서 읽었으면 그 판에 실제로 있는 파일만 (예: v0.1.0 에는 macOS 파일이 없다)
    .filter((p) => !gh || gh.assets.has(fileName(version, p.suffix)))
    .map((p) => {
      const name = fileName(version, p.suffix);
      const bytes = gh?.assets.get(name);
      return { ...p, name, url: download(name), sizeMB: bytes ? Math.round(bytes / 1048576) : known && !gh ? FALLBACK.sizes[p.id] : null };
    });

  const where = gh ? "GitHub 에서 확인" : "GitHub 에 닿지 못해 저장된 값 사용";
  console.info(`[release] ${tag}${prerelease ? " (시험판)" : ""}, ${date ?? "공개일 모름"}, 파일 ${executables.length}개 — ${where}`);

  return {
    version,
    tag,
    date,
    dateLabel: date ? label(date) : null,
    prerelease,
    notesUrl: env("RELEASE_NOTES_URL") ?? `${site.repoUrl}/releases/tag/${tag}`,
    allUrl: `${site.repoUrl}/releases`,
    guideUrl: env("RELEASE_GUIDE_URL") ?? `${site.repoUrl}/blob/${tag}/packaging/source-zip/README.md`,
    executables,
    sourceZip: { name: fileName(version, "source.zip"), url: download(fileName(version, "source.zip")) },
  };
});

/** 실행 파일 대신 쓰는 방법 (source.zip 하나로 스크립트와 Docker 둘 다). 판과 관계없다. */
export const otherWays = [
  {
    id: "python",
    title: "파이썬으로 켜기",
    need: "파이썬 3.11 이상",
    icon: "/icons/python.svg",
    iconSize: [24, 24] as [number, number],
    body: "압축을 풀고 Windows는 run.bat을 두 번 누르고, macOS와 Linux는 터미널에서 아래 명령을 칩니다. 처음 한 번은 필요한 라이브러리를 받느라 몇 분 걸립니다.",
    code: "bash run.sh",
  },
  {
    id: "docker",
    title: "Docker로 켜기",
    need: "Docker",
    icon: "/icons/docker.svg",
    iconSize: [26, 19] as [number, number],
    body: "컨테이너에는 운영체제 보관함이 없어서, 팀 DB 주소와 OpenAI 키를 화면 대신 .env 파일에 적습니다.",
    code: "cp .env.example .env\n# .env 에 DATABASE_URL 과 OPENAI_API_KEY 를 채운 뒤\ndocker compose up -d --build",
  },
];
