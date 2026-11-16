// 빌드 전에 실행: app·components·lib 에 쓰인 글자만 남긴 Pretendard Variable 한 개를 만든다.
// 한글 페이지는 dynamic-subset 을 쓰면 조각 파일 수십 개(약 480KB)를 받게 되는데,
// 이 사이트는 문구가 고정되어 있으므로 실제 쓰인 글자만 담은 파일 하나(약 100KB대)로 충분하다.
// 문구를 바꾸면 npm run build 가 이 스크립트를 다시 돌려 새 글자를 포함한다.
import { readFile, writeFile, readdir, mkdir } from "node:fs/promises";
import { join, extname } from "node:path";
import { fileURLToPath } from "node:url";
import subsetFont from "subset-font";

// fileURLToPath: 한글 경로가 %EC.. 로 남지 않게 디코딩한다
const root = fileURLToPath(new URL("..", import.meta.url));
const SRC_DIRS = ["app", "components", "lib"].map((d) => join(root, d));
const FONT = join(root, "node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2");
const OUT_DIR = join(root, "public/fonts");
const OUT = join(OUT_DIR, "pretendard-subset.woff2");

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if ([".tsx", ".ts", ".md", ".css"].includes(extname(e.name))) out.push(p);
  }
  return out;
}

const files = (await Promise.all(SRC_DIRS.map(walk))).flat();
let text = "";
for (const f of files) text += await readFile(f, "utf8");

// 화면에 나올 수 있는 기본 문자: 출력 가능한 ASCII 전체 + 자주 쓰는 기호
const ascii = Array.from({ length: 95 }, (_, i) => String.fromCharCode(32 + i)).join("");
const extra = "₩−–—·…‘’“”「」『』%‰×÷→←↑↓©®™ ";
const chars = new Set([...text, ...ascii, ...extra].filter((c) => c.codePointAt(0) >= 32));

const font = await readFile(FONT);
const subset = await subsetFont(font, [...chars].join(""), { targetFormat: "woff2" });
await mkdir(OUT_DIR, { recursive: true });
await writeFile(OUT, subset);

const hangul = [...chars].filter((c) => /[가-힣]/.test(c)).length;
console.log(`subset-font: ${chars.size} glyphs (${hangul} 한글), ${(subset.length / 1024).toFixed(1)} KiB → public/fonts/pretendard-subset.woff2`);
