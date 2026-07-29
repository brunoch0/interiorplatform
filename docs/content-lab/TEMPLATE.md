# Content Lab — 일일 아웃라이어 해부 시스템

매일 아침 vidIQ로 인테리어/리노베이션 분야 아웃라이어(평소 대비 터진) 릴스·틱톡을 수집하고,
고정 템플릿으로 해부해 시트에 쌓는다. 목적: 감이 아니라 데이터로 우리 IG 콘텐츠 포맷을 정한다.

## 산출물 (매일)

1. **마스터 시트** `data/content_lab.csv` — 아래 컬럼 스키마로 append (엑셀/Numbers로 열람)
2. **일일 리포트** `docs/content-lab/YYYY-MM-DD.md` — 한국어 해부 리포트
3. **콘텐츠 큐** `docs/content-lab/idea-queue.md` — 그날 도출한 우리 버전 아이디어 append

## CSV 컬럼 스키마 (변경 금지 — 시트 정합성)

```
date, platform, handle, followers, views, outlier_x, niche, format_template,
hook_text, hook_visual, hook_audio, audio_mix, pacing, effort,
why_it_worked, our_adaptation, priority, content_id
```

- `outlier_x`: 해당 크리에이터 중앙값 대비 배수
- `why_it_worked`: 한 줄 진단 (팔로워 수 대비 성과의 이유)
- `our_adaptation`: Dubai Interior 자산(계산기·가이드·649 DB·브리프 보드)으로 변환한 구체 아이디어
- `priority`: High(우리가 이번 주 만들 것) / Mid(포맷 참고) / Low(기법만 참고)
- `content_id`: 릴스 shortcode 또는 틱톡 video id — **중복 수집 방지 키**

## 일일 실행 절차

1. `data/content_lab.csv`에서 기존 `content_id` 전부 로드 (dedupe용, 최근 100개를 excludeContentIds로 전달)
2. ToolSearch로 `vidiq_instagram_tiktok_outlier_search` 로드 후 **요일별 로테이션 쿼리** 1회 호출
   (`resultsPerPlatform: 8`, audienceQuery는 아래 고정값)
3. 결과 전체를 CSV 스키마로 해부해 append (이미 있는 content_id는 스킵)
4. 일일 리포트 작성 (아래 형식)
5. High priority 항목의 our_adaptation을 훅 카피 초안과 함께 idea-queue.md에 append
6. git commit + push (메시지: `Content lab — YYYY-MM-DD (N new outliers)`)

### 고정 audienceQuery

```
Culture/Region: Dubai/UAE expats; Global: true; Demographics: homeowners and renters 28-50 planning apartment renovation, mid-to-high income;
```

### 요일별 쿼리 로테이션 (두바이 기준 요일)

| 요일 | 테마 | 쿼리 |
|------|------|------|
| 월 | 비용 공개 | renovation cost breakdown, what I paid for my renovation, budget reveal |
| 화 | 레드플래그/실수 | contractor red flags, renovation mistakes, renovation horror story, what I regret |
| 수 | Before/After | home renovation before and after transformation, gut renovation reveal |
| 목 | 두바이 로컬 | dubai apartment tour, dubai home renovation, expat home dubai |
| 금 | 주방/욕실 | kitchen renovation, bathroom remodel, wet area renovation cost |
| 토 | 데이터/리스트 | 5 things worth the money home renovation, renovation tips ranked, what adds home value |
| 일 | 시리즈/과정 | renovation day 1, renovation diary, renovation process vlog series |

- vidIQ 호출 비용: 5크레딧/일. 호출 실패(연결 안 됨 등) 시 리포트에 실패 사유만 기록하고 종료.

## 일일 리포트 형식 (`docs/content-lab/YYYY-MM-DD.md`)

```
# Content Lab — YYYY-MM-DD (테마: ○○)

## 오늘의 Top 3 해부
각 항목: 핸들·뷰·아웃라이어 배수 / 훅(첫 3초의 텍스트·비주얼·오디오) /
왜 터졌나 한 줄 / 우리 버전 (훅 카피 초안 포함)

## 패턴 노트
누적 시트 대비 새로 보이는 패턴·반복 확인된 패턴 2-3줄

## 오늘의 액션
이번 주 제작 큐에 넣을 것 1개 (없으면 '없음')
```

## 주간 집계 (금요일 리포트에 추가)

- 누적 시트에서 format_template별 평균 outlier_x 집계 → 상위 3개 포맷 갱신
- High priority 아이디어 중 실제 제작된 것 체크 (Data Agent 판단: Continue/Pivot)
