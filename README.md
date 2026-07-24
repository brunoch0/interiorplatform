# 두바이 인테리어 오픈 플랫폼 (Dubai Trusted Interior Platform)

두바이 인테리어 시장의 정보 비대칭과 신뢰 부재 문제를 해결하는 신뢰 기반 오픈 마켓플레이스.
별점 대신 **정량 지표(공기 준수율 · 추가 비용 미청구율 · 정부 승인 처리 속도)**를 전면 노출하는 UAE 법적 안전 설계.

## 구조

```
web/          Next.js 16 (App Router) + TypeScript + Tailwind v4
  src/lib/data.ts        목데이터 레이어 (Phase 2에서 Supabase로 교체)
  src/components/        공용 UI 컴포넌트
  src/app/               32개 와이어프레임 기반 라우트
docs (root)   기능명세서 · 유저플로우 · ManyFast 와이어프레임 HTML
```

## 화면 구성 (기능명세서 기준)

| 영역 | 라우트 |
|------|--------|
| 온보딩/회원가입 | `/onboarding` `/signup/consumer` `/signup/supplier` |
| 업체 탐색·비교 | `/companies` (다중 필터) `/companies/[id]` (정량 신뢰 지표 대시보드) |
| 견적 요청·계약 | `/quote` (최대 5개 동시 발송) `/quote/compare` `/quote/confirm` `/contract` (전자서명) `/contract/escrow` |
| 공사 진행·감리 | `/project` (마일스톤) `/project/inspection` `/project/checklist` (감리단) `/project/qa-report` (에스크로 연동) `/project/dispute` `/project/complete` (인증 리뷰) |
| 공급자 센터 | `/supplier` `/supplier/license` (Claim 3단계) `/supplier/profile` `/supplier/leads` (리드 수락/거절) `/supplier/packages` |
| 어드민 | `/admin` `/admin/licenses` `/admin/reviews` `/admin/disputes` `/admin/inspections` `/admin/kpi` |

## 실행

```bash
cd web
npm install
npm run dev
```

## 로드맵

- **1단계 (현재)**: 광고·리드 연결 모델 — 전체 UI/UX 데모 (목데이터)
- **2단계**: Supabase 연동 (auth / companies / reviews / leads / contracts RLS)
- **3단계**: 에스크로·직접 결제 모델 (CBUAE 규정 검토 후)
