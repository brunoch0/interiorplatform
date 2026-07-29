# UTM 규칙 — 바이럴 루프 유입 추적

원칙 하나: **onepassinterior.com으로 향하는 모든 외부 링크는 UTM을 달고 나간다.** 안 달면 GA4에서 `(direct)/(none)`으로 뭉개져서 어느 채널이 효과 있었는지 영구히 알 수 없다. (배치1 콜드메일 30통이 실제로 이렇게 유실됐다.)

## 파라미터 사전

| 파라미터 | 쓰는 값 | 의미 |
|---|---|---|
| `utm_source` | `resend` · `instagram` · `whatsapp` · `share` · `reddit` · `facebook` · `expat_forum` | 트래픽이 온 플랫폼 |
| `utm_medium` | `email` · `social` · `outreach` · `referral` | 전달 방식 |
| `utm_campaign` | `contractor_outreach_2026q3` · `content_lab` · `viral_share` · `seed` · `bid_to_claim` · `first_ten` | 캠페인 단위 (성과 판단의 기본 묶음) |
| `utm_content` | `profile_link` · `open_board` · `claim_cta` · `permits_reel` · `companies` · `guides` | 같은 캠페인 안에서 어느 소재/버튼이 먹혔나 |

`utm_campaign`은 **판단 단위**다. 하나의 실험 = 하나의 campaign 값. 새 실험을 시작하면 새 값을 쓰고, 기존 값을 재사용하지 않는다.

## 자동으로 붙는 것 (코드가 처리)

| 경로 | 처리 위치 |
|---|---|
| 사이트 내 공유 버튼 (WhatsApp/링크복사/네이티브) | `web/src/components/share-buttons.tsx` → `withUtm()`. `utm_content`에 공유된 페이지 종류가 자동 기록 |
| 콜드메일 3개 링크 | `scripts/send_outreach.py` 상단 `UTM` 상수 |
| 커뮤니티/WhatsApp 플레이북 링크 | `docs/marketing-kit.md` (이미 태깅됨) |

새 링크를 코드에 추가할 때는 문자열을 직접 쓰지 말고 `withUtm(path, { source, medium, campaign, content })` (`web/src/lib/site.ts`)를 쓴다.

## 수동으로 붙여야 하는 것

- **인스타 프로필 링크 / 링크 스티커**: 캡션의 URL은 클릭이 안 되므로 실제 유입은 bio 링크에서 온다. 릴스마다 bio 링크를 그 편의 UTM으로 바꾼다 — 예: `?utm_source=instagram&utm_medium=social&utm_campaign=content_lab&utm_content=permits_reel`
- **DM·1:1 대화**로 보내는 링크: `utm_source=whatsapp&utm_medium=outreach`
- **오프라인/QR**: `utm_source=qr&utm_medium=print&utm_campaign=<장소>`

## 어디서 확인하나

1. **GA4 → 획득 → 트래픽 획득**: 세션 기준. `세션 소스/매체`와 `세션 캠페인`으로 분해
2. **GA4 → 참여도 → 이벤트**: `generate_lead`(견적요청·AI상담), `bid_submitted`, `licence_claim_submitted`, `newsletter_signup`, `share`, `outbound_maps_click`, `consult_started`
3. **DB (진짜 판단용)**: `quote_requests.attribution`, `quote_bids.attribution`, `claims.attribution` — first-touch 유입 정보가 리드 행에 90일간 유지된다. GA4는 세션만 보지만 이건 **실제 리드가 어디서 왔는지**를 보여준다.

```sql
-- 캠페인별 리드 수 (지난 30일)
select attribution->>'utm_campaign' as campaign,
       attribution->>'utm_source'   as source,
       count(*) as leads
from quote_requests
where created_at > now() - interval '30 days'
group by 1, 2
order by leads desc;
```

## 주의

- UTM은 공개된다 — 링크에 내부 코드명·미공개 정보를 넣지 않는다
- 같은 페이지에 UTM만 다른 링크가 다수 생기면 GA4에서는 문제없지만, **canonical이 항상 파라미터 없는 URL을 가리켜야** 색인 중복이 안 생긴다 (현재 전 페이지 정상)
- 우리 도메인 내부 이동에는 UTM을 붙이지 않는다 (세션이 끊기고 소스가 자기 자신으로 덮어써짐)
