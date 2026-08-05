import type { GuideLocale } from "./index";

/** Template chrome around a translated guide. Article text itself comes from the bundles. */
export type GuideChrome = {
  allGuides: string;
  shortAnswer: string;
  kicker: string;
  minRead: string;
  updated: string;
  official: string;
  officialNote: string;
  faqTitle: string;
  ctaTitle: string;
  ctaBody: string;
  ctaButton: string;
  moreGuides: string;
  translatedNotice: string;
  readOriginal: string;
  indexTitle: string;
  indexBody: string;
};

export const GUIDE_CHROME: Record<GuideLocale | "en", GuideChrome> = {
  en: {
    allGuides: "All guides",
    shortAnswer: "Short answer",
    kicker: "Dubai renovation guide",
    minRead: "min read",
    updated: "Updated",
    official: "Official resources — go direct",
    officialNote: "These are UAE government portals — filing is free and you never need a middleman to use them.",
    faqTitle: "Frequently asked questions",
    ctaTitle: "Ready to get real numbers for your project?",
    ctaBody: "Send one brief — get quotes from up to 5 licensed Dubai contractors. Free.",
    ctaButton: "Request quotes →",
    moreGuides: "More guides",
    translatedNotice: "",
    readOriginal: "",
    indexTitle: "Dubai renovation guides",
    indexBody: "Costs, permits, contracts and what to do when a contractor lets you down.",
  },
  ar: {
    allGuides: "كل الأدلة",
    shortAnswer: "الإجابة المختصرة",
    kicker: "دليل التجديد في دبي",
    minRead: "دقيقة قراءة",
    updated: "آخر تحديث",
    official: "الجهات الرسمية — تواصل مباشرة",
    officialNote: "هذه بوابات حكومية إماراتية — التقديم مجاني ولا تحتاج إلى وسيط لاستخدامها.",
    faqTitle: "أسئلة متكررة",
    ctaTitle: "جاهز للحصول على أرقام حقيقية لمشروعك؟",
    ctaBody: "أرسل طلبًا واحدًا واحصل على عروض أسعار من حتى 5 شركات مرخّصة في دبي. مجانًا.",
    ctaButton: "اطلب عروض أسعار ←",
    moreGuides: "أدلة أخرى",
    translatedNotice: "هذا الدليل مترجم آليًا عن الأصل الإنجليزي. في حال وجود اختلاف، النص الإنجليزي هو المرجع.",
    readOriginal: "اقرأ الأصل بالإنجليزية",
    indexTitle: "أدلة التجديد في دبي",
    indexBody: "التكاليف والتصاريح والعقود، وما تفعله إذا تعثّر المقاول.",
  },
  ru: {
    allGuides: "Все гайды",
    shortAnswer: "Кратко",
    kicker: "Гайд по ремонту в Дубае",
    minRead: "мин чтения",
    updated: "Обновлено",
    official: "Официальные источники — напрямую",
    officialNote: "Это государственные порталы ОАЭ — подача заявлений бесплатна, посредник не нужен.",
    faqTitle: "Частые вопросы",
    ctaTitle: "Готовы получить реальные цифры по вашему проекту?",
    ctaBody: "Одна заявка — сметы от 5 лицензированных подрядчиков Дубая. Бесплатно.",
    ctaButton: "Запросить сметы →",
    moreGuides: "Другие гайды",
    translatedNotice: "Этот гайд переведён машинно с английского оригинала. При расхождениях приоритет имеет английский текст.",
    readOriginal: "Читать оригинал на английском",
    indexTitle: "Гайды по ремонту в Дубае",
    indexBody: "Стоимость, разрешения, договоры и что делать, если подрядчик подвёл.",
  },
  ko: {
    allGuides: "전체 가이드",
    shortAnswer: "짧은 답",
    kicker: "두바이 인테리어 가이드",
    minRead: "분 소요",
    updated: "업데이트",
    official: "공식 기관 — 직접 확인",
    officialNote: "모두 UAE 정부 포털입니다. 신청은 무료이며 중개인이 필요하지 않습니다.",
    faqTitle: "자주 묻는 질문",
    ctaTitle: "내 프로젝트의 실제 견적을 받아볼까요?",
    ctaBody: "한 번만 작성하면 두바이 정식 등록 업체 최대 5곳의 견적을 받습니다. 무료입니다.",
    ctaButton: "견적 요청 →",
    moreGuides: "다른 가이드",
    translatedNotice: "이 가이드는 영어 원문을 기계 번역한 것입니다. 내용이 다를 경우 영어 원문이 기준입니다.",
    readOriginal: "영어 원문 보기",
    indexTitle: "두바이 인테리어 가이드",
    indexBody: "비용, 허가, 계약, 그리고 업체가 문제를 일으켰을 때의 대응.",
  },
};
