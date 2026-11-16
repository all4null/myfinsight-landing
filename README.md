# MyFinSight 랜딩페이지

MyFinSight 서비스의 공식 소개 페이지입니다. 서비스 본체(`../MyFinSight`)와 완전히 분리된 정적 사이트입니다.

- **Next.js 16 (App Router) + React 19 + TypeScript (strict) + Tailwind CSS 4**
- 정적 내보내기(`output: "export"`): `npm run build` 결과가 `out/`에 HTML로 생깁니다. Vercel이나 다른 정적 호스팅에 그대로 올릴 수 있습니다.
- 대부분 **서버 컴포넌트**라 빌드할 때 HTML이 됩니다. 브라우저에서 움직이는 부분만 클라이언트 컴포넌트(`"use client"`)입니다.
- 폰트는 Pretendard Variable 하나를, 이 사이트에 쓰인 글자만 남겨 약 125KB로 줄여 씁니다.
- 처음 만든 Astro 버전은 `legacy-astro/`에 보관했습니다 (빌드·타입 검사 대상이 아닙니다).

## 실행

Node 20.9 이상이 필요합니다.

```bash
npm install
npm run dev       # http://localhost:3000  (먼저 폰트 서브셋을 만든다)
npm run build     # 폰트 서브셋 → 타입 검사 → out/ 정적 빌드
npm run start     # out/ 을 로컬에서 띄워 확인 (serve 사용)
npm run typecheck # 타입 검사만
```

## 환경변수

링크는 `.env`에서 관리합니다. 처음 받았다면 `.env.example`을 `.env`로 복사합니다. `.env`는 git에 올라가지 않고, `.env.example`만 올라갑니다. 값을 바꾼 뒤에는 다시 빌드해야 반영됩니다.

| 이름 | 쓰임 | 비어 있을 때 |
| --- | --- | --- |
| `SITE_URL` | canonical, og:url, sitemap 의 기준 주소 | `https://myfinsight.vercel.app` (임시값) |
| `NEXT_PUBLIC_APP_URL` | "내 아이디어 검증하기" 버튼이 여는 실제 앱 주소 | 시작 버튼이 "설치해서 써 보기"로 바뀌고 설치 안내 섹션으로 이동 |
| `NEXT_PUBLIC_REPO_URL` | 헤더·설치 섹션·마지막 CTA·바닥글의 GitHub 링크 | `https://github.com/sumb-10/MyFinSight` (MyFinSight 의 origin) |

현재 MyFinSight 앱은 공개 주소가 없어(프론트엔드는 로컬 `localhost:5173`에서 실행) `NEXT_PUBLIC_APP_URL` 을 비워 두었습니다. 도메인이 정해지면 `.env`의 `SITE_URL`만 바꾸면 됩니다. sitemap.xml과 robots.txt(`app/robots.ts`)가 이 값을 따라갑니다.

## Vercel 배포

프레임워크 프리셋 Next.js, 빌드 명령 `npm run build`. 정적 내보내기이므로 출력 폴더는 `out` 입니다. 위 환경변수를 프로젝트 설정에 넣습니다. (이 저장소에서는 배포하지 않았습니다.)

## 구조

```
app/
├─ layout.tsx               메타데이터(OG·canonical), 폰트 preload, 건너뛰기 링크
├─ page.tsx                 섹션 순서, JSON-LD
├─ sitemap.ts               /sitemap.xml
├─ robots.ts                /robots.txt (sitemap 주소가 SITE_URL 을 따라감)
└─ globals.css              디자인 토큰(@theme), 공통 클래스, 컴포넌트별 스타일
components/
├─ Header.tsx  (client)     모바일 메뉴·스크롤 테두리
├─ Footer.tsx, Logo.tsx, GithubMark.tsx
├─ product/                 앱 화면 재현 (서버 컴포넌트)
│  ├─ AppFrame.tsx          창 테두리 + "예시 화면" 표시 + 앱 사이드바
│  ├─ ReportOverview.tsx    리포트 개요 탭
│  ├─ TourReport.tsx        둘러보기용 리포트 (data-tour 대상)
│  ├─ Screens.tsx           홈·보충 질문·조건 확인·분석 진행 화면
│  └─ LineChart.tsx, Holdings.tsx
└─ sections/
   ├─ Hero, Division, Verify, After, Data, Faq, FinalCta, Report, Start, Flow, Tour   (서버)
   └─ FlowTabs, TourPlayer, CiteDemo, CopyButton                                     (client)
lib/
├─ site.ts                  사이트 설정·메뉴·시작 버튼 (환경변수)
└─ example.ts               모든 "예시 화면"이 함께 쓰는 예시 시나리오
scripts/subset-font.mjs     app·components·lib 에 쓰인 글자로 Pretendard 서브셋 생성 → public/fonts/
public/                     favicon.svg, og.png(1200×630)
legacy-astro/               처음 만든 Astro 버전 (참고용 보관)
```

**서버/클라이언트 나눔**: 상호작용 섹션은 "서버 컴포넌트가 앱 화면을 HTML로 그려 클라이언트 컴포넌트에 `children`/`panels`로 넘기는" 구조입니다. 예를 들어 `Flow`(서버)가 다섯 화면을 만들어 `FlowTabs`(클라이언트)에 넘기므로, 브라우저로는 탭 전환 코드만 갑니다.

## 콘텐츠의 근거

페이지의 기능 설명은 `../MyFinSight` 의 **코드**를 기준으로 썼습니다. 문서와 코드가 다른 곳은 코드를 따랐습니다.

| 페이지의 주장 | 근거 (MyFinSight 기준 경로) |
| --- | --- |
| S&P 500, NASDAQ-100, KOSPI 200 | `backend/analysis/schemas/request.py` `Universe` |
| AI는 해석·분류·문장, 숫자는 코드 | `backend/analysis/prompts/` (LLM 9종), `m3_selection`, `m4_portfolio` |
| 질문 최대 5번, 서로 무관한 질문은 한 화면에 | `settings.py` `max_questions=5`, `max_batch_questions=3` |
| 「분석 시작」 전에는 실행하지 않음 | `m1_request/dialog.py` 확인 단계, Front `ConfirmScreen.tsx` |
| 지표 5종, 비중 4종, Black-Litterman | `schemas/request.py` `Template`·`Weighting`, `m4_portfolio/math.py` |
| 거래 비용 0.05%, 비교지수 SPY·QQQ·KODEX 200 | `settings.py` `commission_bps=5`, 비교지수 설정 |
| 전날까지 자료로 비중, 그날 종가 체결 | `m2_data/market_data.py` |
| 충족·주의·미충족, 추천/추천(주의)/구성 불충분 | `m5_backtest_report/validate.py` |
| 인용 오류·기준일 이후 뉴스·금지 표현이면 리포트 차단 | `m5_backtest_report/report_check.py`, `settings.py` `banned_phrases` |
| 생존 편향을 리포트에 명시 | `m5_backtest_report/report_blocks.py` |
| 같은 요청 → 저장된 AI 응답 재사용 | `common/llm.py` 캐시 |
| 모의투자: 매일 평가, 자료 없으면 지연 표시 | `m6_tracking/paper.py` |
| 수정안 비교, 나아진 점·불리한 점을 코드가 작성 | `m5_backtest_report/compare.py` |
| 리포트 둘러보기 7단계 문구 | Front `features/tutorial/steps.ts` |
| 설치 명령 | `howtouse.md` 3·4·6절, `README.md` 빠른 시작 |
| 자료 범위 (가격·재무·공시·뉴스·환율) | `README.md` "DB 데이터 현황 (2026-10-17 기준)" |

**일부러 쓰지 않은 표현**: Multi-Agent, AI 에이전트, RAG, LangGraph (코드에 없음, OpenAI 호출을 쓰는 고정 14단계 파이프라인) · "모든 숫자를 검증" (숫자 불일치는 기본값이 경고, `strict_numbers=False`) · 실시간 · 수익 보장 · 분석 소요 시간 (문서마다 다름).

## 예시 화면 원칙

- 모든 제품 화면은 앱(`Front/src`)의 실제 구조와 문구를 HTML로 다시 그린 것이며, 창 위쪽에 항상 **"예시 화면"**이 표시됩니다.
- 숫자는 `lib/example.ts` 하나에서 나옵니다. 수익률 곡선은 고정 시드 난수로 만들고, 화면의 수익률·최대낙폭은 그 곡선에서 계산하므로 차트와 숫자가 어긋나지 않습니다.
- 예시는 일부러 "최대낙폭이 손실 감내 수준을 넘어 **주의**"가 뜨는 결과를 골랐습니다. 높은 수익률보다 위험을 숨기지 않는 서비스라는 점을 보여 주기 위해서입니다.

## 리포트 둘러보기 (Tour)

앱의 튜토리얼(`Front/src/features/tutorial`의 `Coachmark.tsx`, `steps.ts`)을 옮겼습니다. 단계 문구와 대상(`data-tour` 값)이 앱과 같습니다.

- 앱은 페이지 전체를 어둡게 하고 스크롤을 잠그지만, 랜딩에서는 **앱 창 안에서만** 동작합니다. 리포트 내용을 `translateY`로 옮겨 대상을 창 가운데로 가져오고, 스포트라이트(큰 `box-shadow`)와 말풍선이 같은 650ms 곡선으로 따라갑니다.
- React 상태는 단계·재생 여부·말풍선 자리(창 안/아래)만 갖고, 위치 계산과 이동은 ref 로 직접 스타일을 줍니다. 진행 막대는 `key` 를 바꿔 CSS 애니메이션을 다시 시작합니다.
- 섹션이 화면에 들어오면 5.2초 간격으로 자동 재생하고 한 바퀴 돌면 멈춥니다. 이전·다음·단계 선택·←/→ 키를 쓰면 자동 재생을 끄고, 화면을 벗어나거나 탭이 숨겨지면 멈춥니다. 동작 줄이기 설정이면 자동 재생하지 않습니다.

## 디자인 시스템

| 토큰 | 값 | 쓰임 |
| --- | --- | --- |
| ink | `#0f1b2d` | 본문 글자 |
| ink-2 / ink-3 | `#36465b` / `#56667c` | 보조 글자 (흰 바탕 9.6:1 / 5.9:1) |
| mist | `#f3f6f9` | 교차 섹션 바탕 |
| navy | `#13294a` | "AI와 코드" 띠, 코드 블록, 바닥글 |
| brand | `#1d4ed8` | 버튼·링크 (앱 brand-700 과 같음, 6.7:1) |
| cite | `#a16207` | 인용 번호, "주의" — 근거를 뜻하는 색은 하나 |
| 상태 | ok `#15803d`, warn `#a16207`, bad `#b91c1c` | 항상 글자와 함께 |

글꼴은 Pretendard Variable 하나, 숫자는 고정폭 숫자(`tabular-nums`). 제목 `h-display`(히어로 최대 56px) → `h-section`(최대 44px) → `h-sub`(20px).

## 디자인 스킬 사용 기록

- **ui-ux-pro-max** (디자인 시스템·UX 기준): `--design-system` 검색에서 첫 결과(다크 모드, 기업 영업 패턴)는 라이트 모드·일반 사용자 요구와 맞지 않아 버리고, 두 번째 결과의 Swiss Modernism(격자·절제)과 남색+블루+황토 팔레트를 채택. 랜딩 패턴 "Product Demo + Features", 한국어 서체, 동작 줄이기·대비 4.5:1·터치 44px·`cursor: pointer` 체크리스트로 점검.
- **Taste Skill / design-taste-frontend** (아트 디렉션): 히어로 "collage"(제품 창을 프레임 밖으로 잘라 보이고 결과 카드를 겹침), 핀테크의 작은 모서리, 섹션마다 페이드인 금지·보라색 금지·가짜 후기/수치 금지를 채택. 다크 팔레트, 한 화면=한 섹션 규칙, 스크롤 연출, finish gate 는 채택하지 않음. 검증 단계에서 스킬의 레이아웃·성능·접근성 검사 스크립트를 단독으로 사용.
- **frontend-design** (구현): 템플릿 티가 나는 기본값(크림 바탕, 모노스페이스 라벨, 대문자 눈썹 라벨, 섹션별 페이드인)을 피하고, 움직임은 히어로 등장 한 번과 사용자가 고른 동작(단계 탭, 둘러보기, 인용 번호)에 둠.

## 검증 결과 (Next.js 버전)

- `next build` 타입 검사 통과, `/` · `/sitemap.xml` 정적 생성.
- 성능(taste perf): FAIL 0. 전송량 약 383KB(JS 140KB gzip — React·Next 런타임), LCP 약 0.24초, 레이아웃 이동 0. Astro 버전(전송량 170KB, JS 0)보다 무겁지만 기준 안입니다.
- 접근성·레이아웃(taste consistency·check, 1440·390·320px): 이름·제목 순서·초점·건너뛰기 링크·메타·대비·터치 영역·넘침·겹침 통과. 남은 대비 지적은 둘러보기 스포트라이트가 일부러 어둡게 덮은 영역입니다.
- 둘러보기: 헤드리스 Chrome(CDP)으로 자동 재생 진행, 사용자 조작 시 정지, 모바일에서 말풍선 위치를 확인.

## 남은 일

- 실제 앱 공개 주소가 생기면 `NEXT_PUBLIC_APP_URL`, 도메인이 정해지면 `SITE_URL`을 바꿉니다 (`.env`).
- 저장소가 공개 상태인지 확인합니다 (비공개면 GitHub 링크가 방문자에게 404).
- 설치 명령은 `howtouse.md` 기준입니다. `main` 브랜치에서도 같은지 확인합니다.
- 예시 화면 대신 실제 분석 결과 화면(캡처)을 쓰려면, 실제 결과임을 표시하고 `components/product/` 를 교체합니다.
- 자료 범위 표의 기준일(2026년 10월)은 MyFinSight README 를 따른 것이므로, 데이터가 갱신되면 `components/sections/Data.tsx` 를 함께 고칩니다.
- `legacy-astro/` 가 더 필요 없으면 지웁니다.
