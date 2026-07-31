# SEO + AI 검색 감사 — 2026-07-31

전제: 2026-07-30 기술 감사(`audit-2026-07-30.md`)에서 canonical·noindex·스키마·GA4는 이미 수정됨. 이 문서는 **키워드·경쟁·콘텐츠 갭 + AI 검색(생성형 엔진) 인용 가능성**에 집중한다.

## 종합 판정

**기반은 탄탄, 그런데 AI가 인용할 이유가 아직 약하다.**

- 강점: 색인은 이미 되고 있다. `onepassinterior.com/companies`는 관련 쿼리에서 **1위**로 노출되고, AI 요약이 우리 페이지 설명을 정확히 인용했다. llms.txt는 형식·내용 모두 우수하고 AI 크롤러는 전부 허용 상태다.
- 약점 1: **인용 가능한 숫자가 경쟁자보다 적다.** AI 답변은 "AED 500-2,000", "10-15 영업일", "최대 AED 50,000 벌금" 같은 단위 붙은 수치를 인용한다. 경쟁 블로그가 이걸 더 많이 갖고 있다.
- 약점 2: **공식 출처 링크가 21편 중 3편에만 있다.** 정작 허가(permits) 가이드에 없다. AI에게 페이지를 읽혀보니 "공식 규정 링크 없음 / 저자 자격 없음"을 인용 약점으로 지목했다.
- 약점 3: **"best/top 회사" 유형 페이지가 0개.** 이 쿼리 유형이 SERP와 AI 답변을 전부 장악하는데, 우리는 649곳 데이터를 갖고도 만들지 않았다.

가장 큰 역설: **우리 계산기 수치가 이미 AI 답변에 나타나고 있는데 출처로 우리가 불리지 않는다.** (검색 결과 중 "Budget: AED 80-150/sqft, Standard: 150-250, Premium: 250-400"은 우리 계산기 상수와 정확히 일치)

---

## 1. AI 검색(GEO) 진단 — 우선 항목

AI 엔진이 특정 페이지를 인용하는 실제 기준으로 점검.

| 요소 | 상태 | 근거 |
|---|---|---|
| AI 크롤러 접근 | ✅ | robots.txt가 `*`에 Allow. GPTBot/ClaudeBot/PerplexityBot/Google-Extended 차단 없음 |
| llms.txt | ✅ 우수 | 649곳·검증방식·소비자보호·주요 URL까지 2.5KB에 압축. 이미 AI가 읽기 좋은 형태 |
| 구조화 데이터 | 🟡 | Organization·WebSite·Article·FAQPage·ItemList·HomeAndConstructionBusiness 있음. **author·datePublished·BreadcrumbList 없음** |
| 인용 가능한 수치 밀도 | 🔴 | 허가 가이드에서 AI가 뽑아낸 수치는 5개. 경쟁 페이지는 허가비·처리일수·벌금까지 제공 |
| 공식 출처 인용 | 🔴 | 21편 중 3편만 officialLinks 보유. 허가 가이드에 없음 |
| 저자·전문성(E-E-A-T) | 🔴 | 저자 표기 없음. AI가 직접 "저자 자격 미표기"를 약점으로 지적 |
| 질문형 구조 | ✅ | FAQ 3~5개 + FAQPage 스키마 → AI가 그대로 인용하기 좋음 |
| 최신성 | ✅ | `updated` 표기 + 매일 발행 |
| 엔티티 일관성 | 🟡 | 브랜드명 3종 혼용(Dubai Interior / Onepass Interior / Onepass) → 지식그래프 결합 약화 |
| 다국어 | ✅ | 아랍어/러시아어/한국어 84페이지 + hreflang. **아랍어 AI 질의에서 경쟁자 거의 없음** |

### AI에게 우리 페이지를 읽힌 실제 결과

허가 가이드를 AI 검색 엔진 관점으로 평가시킨 결과:
- 뽑아낸 수치: NOC 3-10 영업일 / DM 허가 1-3주 / 보증금 AED 2,000-5,000 / 아파트 2-4주 / 빌라 4-8주
- 지적된 약점: **공식 규정 직링크 없음, 저자 배경 미표기, 벌금 사례 없음**
- 경쟁 페이지가 실제로 갖고 있는 것: BPS 포털 명시, 소규모 허가 AED 500-2,000 / 대규모 AED 2,000-15,000, 처리 5-10일 / 10-15일, 무허가 시 **최대 AED 50,000 벌금**

→ 이 세 가지만 채우면 같은 질의에서 인용 우선순위가 바뀐다.

---

## 2. 키워드 기회

검색 결과 실측 기반. 정확한 볼륨은 Ahrefs/Semrush MCP 연결 시 자동 채워짐.

| 키워드 | 난이도 | 기회 | 현재 | 의도 | 권장 포맷 |
|---|---|---|---|---|---|
| best renovation companies dubai | 높음 | **높음** | 미노출 | 상업 | **데이터 기반 랭킹 페이지**(방법론 공개) |
| top interior fit out companies dubai | 높음 | **높음** | 미노출 | 상업 | 랭킹 페이지 |
| renovation companies in [area] | 중간 | **높음** | 부분(area 페이지) | 상업 | area 페이지 강화 |
| kitchen renovation companies dubai marina | 낮음 | **높음** | 없음 | 상업 | **서비스 × 지역 조합 페이지** |
| dubai municipality renovation permit fee | 중간 | **높음** | 부분 | 정보 | 허가 가이드 보강 |
| renovation without permit dubai fine | 낮음 | **높음** | 없음 | 정보 | 전용 섹션/가이드 |
| apartment renovation cost dubai per sqft | 높음 | 중간 | 있음 | 정보 | 계산기 + 가이드 연결 강화 |
| villa renovation cost dubai | 높음 | 중간 | 있음 | 정보 | 기존 가이드 |
| how to verify contractor licence dubai | 낮음 | **높음** | 있음 | 정보 | 기존 가이드 + 공식링크 |
| contractor took deposit dubai what to do | 낮음 | **높음** | 있음 | 정보 | 기존(강점) |
| renovation contract template dubai | 중간 | **높음** | 없음(실물 PDF 부재) | 거래 | **다운로드 자산** |
| dubai renovation timeline how long | 낮음 | 중간 | 있음 | 정보 | 기존 |
| تكلفة تجديد شقة في دبي | 낮음 | **높음** | 있음(신규) | 정보 | 아랍어 가이드 — 경쟁 희박 |
| ремонт квартиры в Дубае цена | 낮음 | **높음** | 있음(신규) | 정보 | 러시아어 가이드 — 경쟁 희박 |
| 두바이 인테리어 비용 | 낮음 | 중간 | 있음(신규) | 정보 | 한국어 |
| snagging inspection dubai | 낮음 | 중간 | 있음 | 정보 | 기존 |
| fit out permit trakhees palm jumeirah | 낮음 | 중간 | 부분 | 정보 | 특수구역 전용 섹션 |
| renovation cost calculator dubai | 낮음 | **높음** | 있음(도구) | 도구 | WebApplication 스키마 추가 |

---

## 3. 콘텐츠 갭 (우선순위 순)

### G1. 데이터 기반 랭킹 페이지 — 최대 기회
현재 SERP의 "Top 10 renovation companies in Dubai"는 **전부 시공사가 자기를 넣어 쓴 리스티클**(novafloor, fixitdubai, lushloom, carpentrydubai, revivehub…). 신뢰 근거가 없다.
우리는 649곳 × 구글 평점 612건 × 지역 데이터를 갖고 있다. **방법론을 공개한 랭킹**은 이 시장에 없다.
- 포맷: `/best/renovation-companies-dubai` + 지역별 변형
- 필수: 순위 산출 방식 명시(평점·리뷰수·등록 여부·지역 표본), 갱신일, "협찬 없음" 명시
- 효과: 높음 / 노력: 반나절(데이터는 이미 있음)

### G2. 서비스 × 지역 조합 페이지
경쟁 디렉토리(Quvera)가 이미 하고 있는 패턴 — "Kitchen Renovation Companies in Dubai Marina".
우리는 area 페이지만 있고 서비스 축이 없다. 23개 지역 × 6개 서비스 = 최대 138페이지, 전부 실데이터 기반.
- 효과: 높음 / 노력: 반나절(프로그래매틱)
- 주의: 표본이 적은 조합(업체 3곳 미만)은 생성하지 말 것 — 얇은 콘텐츠 취급됨

### G3. 허가 가이드 수치 보강
허가비·처리일수·벌금·BPS 포털·Trakhees/DDA 구분을 추가. **AI 인용 확률을 직접 올리는 작업.**
- 효과: 높음 / 노력: 1-2시간 (단, 수치는 공식 출처 확인 필수 — 추정 금지)

### G4. 공식 링크 전면 적용
21편 중 3편 → 관련된 모든 편에. AI가 지목한 약점의 직접 해소.
- 효과: 높음 / 노력: 1-2시간

### G5. 표준계약서 PDF
가이드들이 계속 가리키는데 실물이 없다. 다운로드 자산은 링크·인용·이메일 수집을 동시에 만든다.
- 효과: 중간~높음 / 노력: 반나절

### G6. 저자·방법론 페이지
"우리 수치는 어디서 오나 / 검증은 어떻게 하나 / 누가 쓰나". E-E-A-T와 AI 신뢰의 근거.
- 효과: 중간 / 노력: 1-2시간

---

## 4. 온페이지 이슈

| 페이지 | 이슈 | 심각도 | 조치 |
|---|---|---|---|
| /companies | HTML **645KB**(gzip 65KB) — 649곳 데이터가 서버 렌더 + 클라 페이로드로 중복 | High | 초기 30곳만 전달, 나머지는 페이지네이션/무한스크롤로 요청 |
| 가이드 전체 | `author`·`datePublished` 스키마 없음 | High | Article 스키마에 추가 |
| 가이드 18편 | officialLinks 없음 | High | 관련 편에 정부 포털 추가 |
| 상세 4종 | BreadcrumbList 없음 | Medium | 공통 헬퍼 |
| /companies/[id] | `aggregateRating` 미표기(평점 데이터는 보유) | Medium | 649페이지 효과. 단 제3자 평점 마크업 정책 확인 필요 |
| /areas/* | 허브(`/areas` 인덱스) 없음, 푸터 8개 하드코딩(실제 23개) | Medium | 인덱스 생성 + 데이터 기반 목록 |
| /calculator | WebApplication 스키마 없음 | Low | FAQPage에 추가 |
| 이미지 전체 | Unsplash 스톡 + raw `<img>` | Medium | 자체/업체 사진 확보, next/image 전환 |
| 브랜드명 | 3종 혼용 | Medium | `Onepass Interior`로 통일 |
| title/desc | ✅ 전부 규격 내(51-55자 / 140-157자) | — | 어제 수정 완료 |

---

## 5. 기술 체크리스트

| 항목 | 상태 | 비고 |
|---|---|---|
| HTTPS | Pass | |
| robots.txt | Pass | 데모 경로 차단, AI 크롤러 허용 |
| 사이트맵 | Pass | 770 URL (다국어 66 포함) |
| canonical | Pass | 어제 수정, 전 페이지 자기참조 |
| noindex(비공개/데모) | Pass | 어제 수정 |
| hreflang | Pass | 4개 언어 상호 연결 |
| TTFB | Pass | 0.12-0.70s |
| 페이지 용량 | **Warning** | /companies 645KB |
| 구조화 데이터 | Warning | author/date/Breadcrumb/aggregateRating 누락 |
| 이미지 최적화 | Warning | next/image 미사용 |
| 모바일 | Pass | 반응형 |
| IndexNow | Warning | 키 파일은 있으나 발행 시 자동 핑 미연결 |
| GSC/Bing 검증 메타 | Warning | DNS 인증만 됨(HTML 메타 없음) |

---

## 6. 경쟁 비교

| 항목 | Onepass Interior | renovation-dubai.ae | Bayut(MyBayut) | 시공사 리스티클 다수 |
|---|---|---|---|---|
| 업체 수 | **649** | 170+ | — | 10-13개 나열 |
| 가이드 | **21편 × 4언어** | 0 | 블로그 다수 | 각 1-2편 |
| 신뢰 근거 | 정식등록 + 구글 평점(검증 가능) | 자체주장(98% 추천, 4.9/5) | 미디어 권위 | 자기 홍보 |
| 도메인 파워 | 신규 | 중 | **매우 높음** | 낮음 |
| 매칭 약속 | 최대 5곳 견적 | 3-5곳 / 24시간 | 없음 | 없음 |
| 랭킹 페이지 | **없음** ← 갭 | 없음 | 있음(상위 노출) | 있음(다수) |
| 서비스×지역 | 없음 ← 갭 | 없음 | 부분 | 부분 |

**해석**: renovation-dubai.ae는 콘텐츠가 0이라 정보성 쿼리를 못 먹는다. Bayut은 도메인 파워로 상업 쿼리를 먹지만 데이터가 아니라 편집 리스트다. **정보성(가이드) + 데이터 기반 랭킹**을 동시에 가진 곳이 없다 — 그 자리가 비어 있다.

---

## 7. 실행 계획

### 이번 주 (각 2시간 이하)

1. **허가 가이드 수치 보강** — 허가비·처리일수·벌금·BPS·Trakhees/DDA. 공식 출처 확인 후에만 기재. 효과 High
2. **officialLinks 전면 적용** (18편) — 효과 High
3. **Article 스키마에 author·datePublished 추가** — Guide 타입에 `published` 필드 신설 필요. 효과 High
4. **브랜드명 통일** (`Onepass Interior`) — SITE_NAME·타이틀 템플릿·스키마. 효과 Medium
5. **/areas 인덱스 + 푸터 지역 목록 데이터화** — 효과 Medium

### 이번 분기

6. **데이터 기반 랭킹 페이지**(G1) — 방법론 공개형. 효과 High / 반나절
7. **서비스 × 지역 조합 페이지**(G2) — 표본 3곳 이상만. 효과 High / 반나절
8. **/companies 페이로드 축소** — 초기 30곳 + 점진 로드. 효과 High(CWV) / 반나절
9. **표준계약서 PDF** — 효과 Medium~High / 반나절
10. **방법론·저자 페이지** — 효과 Medium / 1-2시간
11. **aggregateRating 스키마**(649페이지) — 정책 확인 후. 효과 High / 1-2시간
12. **IndexNow 자동 핑을 발행 파이프라인에 연결** — 효과 Medium / 1시간

### 측정

- GSC: 노출·클릭·평균순위를 주 단위로. 특히 랭킹 페이지 투입 전후
- AI 인용: 월 1회 주요 질의 10개를 AI 엔진에 직접 물어 우리 도메인이 인용되는지 수기 확인 (자동 추적 수단 없음)
- GA4: `generate_lead`를 유입 채널별로 — 규칙은 `utm-conventions.md`

---

## 참고한 검색 결과

- [Compare Renovation Contractors Dubai (renovation-dubai.ae)](https://www.renovation-dubai.ae/)
- [Best Home Renovation Companies in Dubai — MyBayut](https://www.bayut.com/mybayut/home-renovation-companies-dubai/)
- [Kitchen Renovation Companies in Dubai Marina — Quvera](https://www.quvera.ae/services/kitchen-renovation-dubai-marina)
- [How to Get NOC & Renovation Permits in Dubai — Yalla Renovation](https://www.yallarenovation.com/post/how-to-get-noc-renovation-permits-in-dubai)
- [Dubai Municipality NOC Guide — ReviveHub](https://revivehub.ae/dubai-municipality-renovation-permit-guide/)
- [Renovation Cost in Dubai 2026 — Atech Interiors](https://atechinteriors.ae/renovation-cost-in-dubai/)
- [Top 10 Best Renovation Companies in Dubai — LushLoom](https://lushloom.ae/top-renovation-companies-in-dubai/)
