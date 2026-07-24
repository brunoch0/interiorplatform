// Mock data layer — swap with Supabase queries in Phase 2
export type Company = {
  id: string;
  name: string;
  nameEn: string;
  verified: boolean;
  area: string;
  categories: string[];
  spaceTypes: string[];
  priceRange: string;
  intro: string;
  // Quantitative trust metrics (UAE-safe, no star ratings)
  scheduleComplianceRate: number | null; // 공기 준수율 %
  noExtraChargeRate: number | null; // 추가 비용 미청구율 %
  verifiedReviewCount: number;
  avgApprovalWeeks: number | null; // 정부 승인 평균 소요 주수
  portfolioCount: number;
  licenseExpiry: string;
  exposurePackage: "premium" | "basic" | null;
};

export const companies: Company[] = [
  {
    id: "c1",
    name: "알누르 인테리어",
    nameEn: "Al Noor Interiors LLC",
    verified: true,
    area: "Business Bay",
    categories: ["풀 리노베이션", "주방", "욕실"],
    spaceTypes: ["아파트", "빌라"],
    priceRange: "AED 80K–250K",
    intro: "두바이 15년 경력, DM 승인 전담팀 보유. 한국어 상담 가능한 프리미엄 피트아웃 전문사.",
    scheduleComplianceRate: 96,
    noExtraChargeRate: 92,
    verifiedReviewCount: 34,
    avgApprovalWeeks: 2.1,
    portfolioCount: 42,
    licenseExpiry: "2027-03-15",
    exposurePackage: "premium",
  },
  {
    id: "c2",
    name: "데저트 오크 디자인",
    nameEn: "Desert Oak Design Studio",
    verified: true,
    area: "JVC",
    categories: ["주거 인테리어", "가구 제작"],
    spaceTypes: ["아파트"],
    priceRange: "AED 40K–120K",
    intro: "합리적 가격의 아파트 전문. 마일스톤 단위 투명 견적이 강점.",
    scheduleComplianceRate: 91,
    noExtraChargeRate: 88,
    verifiedReviewCount: 21,
    avgApprovalWeeks: 2.8,
    portfolioCount: 28,
    licenseExpiry: "2026-11-02",
    exposurePackage: "basic",
  },
  {
    id: "c3",
    name: "마리나 피트아웃",
    nameEn: "Marina Fitout Contracting",
    verified: true,
    area: "Dubai Marina",
    categories: ["상업 공간", "레스토랑", "오피스"],
    spaceTypes: ["상업 공간"],
    priceRange: "AED 150K–800K",
    intro: "F&B·리테일 피트아웃 전문. DED/DM/Civil Defense 승인 원스톱 처리.",
    scheduleComplianceRate: 89,
    noExtraChargeRate: 95,
    verifiedReviewCount: 18,
    avgApprovalWeeks: 3.2,
    portfolioCount: 35,
    licenseExpiry: "2027-01-20",
    exposurePackage: null,
  },
  {
    id: "c4",
    name: "팜 빌라 리노베이션",
    nameEn: "Palm Villa Renovations",
    verified: true,
    area: "Palm Jumeirah",
    categories: ["빌라 리노베이션", "조경", "수영장"],
    spaceTypes: ["빌라"],
    priceRange: "AED 300K–2M",
    intro: "팜 주메이라·에미레이트 힐스 하이엔드 빌라 전문. 커뮤니티 승인 절차 전담.",
    scheduleComplianceRate: 94,
    noExtraChargeRate: 90,
    verifiedReviewCount: 12,
    avgApprovalWeeks: 4.0,
    portfolioCount: 19,
    licenseExpiry: "2026-09-30",
    exposurePackage: null,
  },
  {
    id: "c5",
    name: "다운타운 스페이스웍스",
    nameEn: "Downtown Spaceworks",
    verified: true,
    area: "Downtown Dubai",
    categories: ["아파트", "홈오피스"],
    spaceTypes: ["아파트"],
    priceRange: "AED 60K–180K",
    intro: "다운타운·디파이언스 타워 아파트 실적 다수. 에마르 커뮤니티 규정 숙지.",
    scheduleComplianceRate: 87,
    noExtraChargeRate: 84,
    verifiedReviewCount: 9,
    avgApprovalWeeks: 2.5,
    portfolioCount: 22,
    licenseExpiry: "2027-05-11",
    exposurePackage: null,
  },
  {
    id: "c6",
    name: "걸프 크래프트 컨트랙팅",
    nameEn: "Gulf Craft Contracting",
    verified: false,
    area: "Al Quoz",
    categories: ["목공", "도장"],
    spaceTypes: ["아파트", "빌라"],
    priceRange: "미등록",
    intro: "구글 정보 기반 자동 생성 프로필입니다. 소유권 주장 후 상세 정보가 공개됩니다.",
    scheduleComplianceRate: null,
    noExtraChargeRate: null,
    verifiedReviewCount: 0,
    avgApprovalWeeks: null,
    portfolioCount: 0,
    licenseExpiry: "-",
    exposurePackage: null,
  },
  {
    id: "c7",
    name: "오아시스 홈 스튜디오",
    nameEn: "Oasis Home Studio",
    verified: false,
    area: "Deira",
    categories: ["주거 인테리어"],
    spaceTypes: ["아파트"],
    priceRange: "미등록",
    intro: "구글 정보 기반 자동 생성 프로필입니다. 소유권 주장 후 상세 정보가 공개됩니다.",
    scheduleComplianceRate: null,
    noExtraChargeRate: null,
    verifiedReviewCount: 0,
    avgApprovalWeeks: null,
    portfolioCount: 0,
    licenseExpiry: "-",
    exposurePackage: null,
  },
  {
    id: "c8",
    name: "세리니티 인테리어",
    nameEn: "Serenity Interiors FZE",
    verified: true,
    area: "JLT",
    categories: ["풀 리노베이션", "스마트홈"],
    spaceTypes: ["아파트", "빌라"],
    priceRange: "AED 100K–400K",
    intro: "스마트홈 통합 시공 전문. KNX·루트론 공식 파트너.",
    scheduleComplianceRate: 93,
    noExtraChargeRate: 97,
    verifiedReviewCount: 15,
    avgApprovalWeeks: 2.3,
    portfolioCount: 31,
    licenseExpiry: "2027-08-01",
    exposurePackage: "basic",
  },
];

export type Review = {
  id: string;
  companyId: string;
  author: string;
  date: string;
  spaceType: string;
  scheduleDelayDays: number; // 0 = 준수
  approvalWeeks: number;
  extraCharge: boolean;
  qualityOk: boolean;
  factNote: string; // ≤200자 사실 서술
};

export const reviews: Review[] = [
  { id: "r1", companyId: "c1", author: "김○○", date: "2026-06-12", spaceType: "아파트 2BR", scheduleDelayDays: 0, approvalWeeks: 2, extraCharge: false, qualityOk: true, factNote: "계약서상 8주 공기 정확히 준수. DM 승인 2주 완료. 추가 비용 청구 없음." },
  { id: "r2", companyId: "c1", author: "Sarah M.", date: "2026-05-28", spaceType: "빌라 4BR", scheduleDelayDays: 3, approvalWeeks: 2, extraCharge: false, qualityOk: true, factNote: "자재 수입 지연으로 3일 연장, 사전 서면 통보 받음. 최종 금액 견적과 동일." },
  { id: "r3", companyId: "c2", author: "박○○", date: "2026-06-01", spaceType: "아파트 1BR", scheduleDelayDays: 0, approvalWeeks: 3, extraCharge: true, qualityOk: true, factNote: "주방 상판 변경 요청으로 AED 4,200 추가 발생. 변경 계약서 작성 후 진행됨." },
  { id: "r4", companyId: "c3", author: "Ahmed K.", date: "2026-04-15", spaceType: "레스토랑 180sqm", scheduleDelayDays: 7, approvalWeeks: 4, extraCharge: false, qualityOk: true, factNote: "Civil Defense 재검사로 7일 지연. 지연 기간 상세 리포트 매주 수신." },
  { id: "r5", companyId: "c8", author: "이○○", date: "2026-07-02", spaceType: "아파트 3BR", scheduleDelayDays: 0, approvalWeeks: 2, extraCharge: false, qualityOk: true, factNote: "스마트홈 배선 포함 10주 공기 준수. 하자 2건 접수 후 5일 내 보수 완료." },
];

export type Milestone = {
  id: string;
  name: string;
  ratio: number; // 대금 비율 %
  dueDate: string;
  status: "완료" | "진행중" | "대기" | "감리대기" | "분쟁";
  escrowStatus: "송금완료" | "예치중" | "보류";
};

export const contract = {
  id: "ct1",
  companyId: "c1",
  consumer: "김건축주",
  totalAmount: 145000,
  currency: "AED",
  signedConsumer: true,
  signedSupplier: true,
  startDate: "2026-06-20",
  endDate: "2026-09-12",
  escrowDeposited: true,
  milestones: [
    { id: "m1", name: "철거 및 기초 공사", ratio: 20, dueDate: "2026-07-05", status: "완료", escrowStatus: "송금완료" },
    { id: "m2", name: "전기·배관 공사", ratio: 25, dueDate: "2026-07-28", status: "감리대기", escrowStatus: "예치중" },
    { id: "m3", name: "타일·도장·마감", ratio: 35, dueDate: "2026-08-25", status: "대기", escrowStatus: "예치중" },
    { id: "m4", name: "가구 설치 및 최종 점검", ratio: 20, dueDate: "2026-09-12", status: "대기", escrowStatus: "예치중" },
  ] as Milestone[],
};

export type ChecklistItem = {
  id: string;
  label: string;
  required: boolean;
  result: "통과" | "미통과" | null;
  comment: string;
  photos: number;
};

export const qaChecklist: ChecklistItem[] = [
  { id: "q1", label: "타일 수평 (±2mm 허용)", required: true, result: "통과", comment: "전 구역 수평계 측정 완료", photos: 3 },
  { id: "q2", label: "도장 마감 상태", required: true, result: "통과", comment: "2회 도장 확인", photos: 2 },
  { id: "q3", label: "실리콘 코킹 마감", required: true, result: "미통과", comment: "주방 싱크 주변 재시공 필요", photos: 4 },
  { id: "q4", label: "욕실 방수 테스트 (24h 담수)", required: true, result: null, comment: "", photos: 0 },
  { id: "q5", label: "전기 콘센트 통전 확인", required: false, result: "통과", comment: "", photos: 1 },
];

export type QuoteRequest = {
  id: string;
  companyId: string;
  status: "대기" | "견적수신" | "기한만료";
  sentDate: string;
  amount: number | null;
  durationWeeks: number | null;
  note: string;
};

export const quoteRequests: QuoteRequest[] = [
  { id: "qr1", companyId: "c1", status: "견적수신", sentDate: "2026-07-18", amount: 145000, durationWeeks: 12, note: "자재 등급 상세 견적서 첨부. DM 승인 대행 포함." },
  { id: "qr2", companyId: "c2", status: "견적수신", sentDate: "2026-07-18", amount: 118000, durationWeeks: 14, note: "가구 제작 자체 공방 진행으로 단가 절감." },
  { id: "qr3", companyId: "c8", status: "견적수신", sentDate: "2026-07-18", amount: 162000, durationWeeks: 11, note: "스마트홈 기본 패키지 포함 견적." },
  { id: "qr4", companyId: "c5", status: "대기", sentDate: "2026-07-18", amount: null, durationWeeks: null, note: "" },
];

export type Lead = {
  id: string;
  consumer: string;
  spaceType: string;
  area: string;
  budget: string;
  wish: string;
  fee: number;
  receivedAt: string;
  status: "신규" | "수락" | "거절" | "만료";
};

export const supplierLeads: Lead[] = [
  { id: "l1", consumer: "김○○", spaceType: "아파트 3BR", area: "Business Bay", budget: "AED 120K–160K", wish: "9월 입주 전 완공 희망, 한국식 주방 선호", fee: 250, receivedAt: "2026-07-23", status: "신규" },
  { id: "l2", consumer: "Fatima A.", spaceType: "빌라 5BR", area: "Arabian Ranches", budget: "AED 400K+", wish: "풀 리노베이션 + 조경", fee: 400, receivedAt: "2026-07-22", status: "신규" },
  { id: "l3", consumer: "박○○", spaceType: "아파트 2BR", area: "JVC", budget: "AED 60K–90K", wish: "욕실 2개 + 주방", fee: 250, receivedAt: "2026-07-19", status: "수락" },
  { id: "l4", consumer: "David L.", spaceType: "오피스 120sqm", area: "DIFC", budget: "AED 200K", wish: "4주 내 착공 필요", fee: 350, receivedAt: "2026-07-15", status: "거절" },
];

export type LicenseApplication = {
  id: string;
  companyId: string;
  companyName: string;
  tradeLicense: string;
  detLicense: string;
  submittedAt: string;
  status: "심사중" | "승인" | "반려";
  rejectReason?: string;
};

export const licenseApplications: LicenseApplication[] = [
  { id: "la1", companyId: "c6", companyName: "걸프 크래프트 컨트랙팅", tradeLicense: "trade_license_887123.pdf", detLicense: "det_fitout_887123.pdf", submittedAt: "2026-07-23", status: "심사중" },
  { id: "la2", companyId: "c7", companyName: "오아시스 홈 스튜디오", tradeLicense: "TL-445829.pdf", detLicense: "det_license_scan.jpg", submittedAt: "2026-07-21", status: "심사중" },
  { id: "la3", companyId: "c5", companyName: "다운타운 스페이스웍스", tradeLicense: "trade_lic_2027.pdf", detLicense: "det_2027.pdf", submittedAt: "2026-07-10", status: "승인" },
  { id: "la4", companyId: "c9x", companyName: "퀵픽스 데코", tradeLicense: "license_photo.jpg", detLicense: "-", submittedAt: "2026-07-08", status: "반려", rejectReason: "DET 피트아웃 라이선스 미제출. 무역 라이선스 유효기간 만료(2026-05)." },
];

export type Dispute = {
  id: string;
  contractId: string;
  milestone: string;
  claimant: "소비자" | "업체";
  companyName: string;
  consumer: string;
  reason: string;
  amount: number;
  evidenceCount: number;
  filedAt: string;
  status: "접수" | "검토중" | "중재완료";
  resolution?: string;
};

export const disputes: Dispute[] = [
  { id: "d1", contractId: "ct1", milestone: "전기·배관 공사", claimant: "소비자", companyName: "알누르 인테리어", consumer: "김건축주", reason: "계약서 명시 브랜드(레그랑)와 다른 스위치 자재 설치 확인", amount: 36250, evidenceCount: 6, filedAt: "2026-07-20", status: "검토중" },
  { id: "d2", contractId: "ct8", milestone: "마감 공사", claimant: "업체", companyName: "데저트 오크 디자인", consumer: "최○○", reason: "소비자 요청 설계 변경 3회에 따른 추가 공기 및 비용 협의 불발", amount: 12800, evidenceCount: 4, filedAt: "2026-07-14", status: "중재완료", resolution: "변경 2회분 AED 8,400 업체 지급, 1회분 기각" },
];

export const inspections = [
  { id: "i1", contractId: "ct1", companyName: "알누르 인테리어", consumer: "김건축주", milestone: "전기·배관 공사", inspector: "정감리", date: "2026-07-26 10:00", status: "확정" },
  { id: "i2", contractId: "ct4", companyName: "팜 빌라 리노베이션", consumer: "Omar H.", milestone: "방수 공사", inspector: "정감리", date: "2026-07-27 14:00", status: "확정" },
  { id: "i3", contractId: "ct8", companyName: "데저트 오크 디자인", consumer: "최○○", milestone: "마감 공사", inspector: "미배정", date: "재예약 요청 (사유: 자재 입고 지연)", status: "승인대기" },
];

export const exposurePackages = [
  { id: "p1", name: "베이직 노출", price: 499, period: "30일", benefits: ["검색 결과 상위 노출 (지역 내)", "'추천' 배지 표시"] },
  { id: "p2", name: "프리미엄 노출", price: 1299, period: "30일", benefits: ["전체 검색 최상단 고정 (최대 3개사)", "홈 화면 추천 업체 섹션 노출", "'프리미엄' 배지 표시", "프로필 조회 리포트 주간 제공"] },
  { id: "p3", name: "카테고리 스폰서", price: 899, period: "30일", benefits: ["특정 카테고리 검색 1위 고정", "카테고리 배너 노출"] },
];

export const kpi = {
  monthly: [
    { month: "2026-02", companies: 82, claims: 6, quotes: 45, escrow: 0, disputes: 0 },
    { month: "2026-03", companies: 148, claims: 18, quotes: 112, escrow: 0, disputes: 1 },
    { month: "2026-04", companies: 231, claims: 34, quotes: 208, escrow: 2, disputes: 1 },
    { month: "2026-05", companies: 320, claims: 52, quotes: 334, escrow: 5, disputes: 2 },
    { month: "2026-06", companies: 412, claims: 78, quotes: 489, escrow: 9, disputes: 2 },
    { month: "2026-07", companies: 476, claims: 96, quotes: 571, escrow: 14, disputes: 3 },
  ],
  leadRevenue: 28450,
  packageRevenue: 41200,
  reviewRate: 43,
};

export const areas = ["Business Bay", "Downtown Dubai", "Dubai Marina", "JVC", "JLT", "Palm Jumeirah", "Al Quoz", "Deira", "Arabian Ranches"];
export const spaceTypeOptions = ["아파트", "빌라", "상업 공간"];
export const budgetOptions = ["AED 50K 미만", "AED 50K–100K", "AED 100K–200K", "AED 200K–500K", "AED 500K 이상"];
export const categoryOptions = ["풀 리노베이션", "주방", "욕실", "상업 공간", "가구 제작", "스마트홈", "조경"];

export function getCompany(id: string) {
  return companies.find((c) => c.id === id);
}

export const fmt = (n: number) => n.toLocaleString("en-US");
