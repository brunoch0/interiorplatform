// Mock data layer — swap with Supabase queries in Phase 2
import { seedCompanies } from "./seed-companies";

export type Company = {
  id: string;
  name: string;
  legalName: string;
  verified: boolean;
  area: string;
  categories: string[];
  spaceTypes: string[];
  priceRange: string;
  intro: string;
  // Quantitative trust metrics (UAE-safe, no star ratings)
  scheduleComplianceRate: number | null; // on-time completion %
  noExtraChargeRate: number | null; // no-extra-charge %
  verifiedReviewCount: number;
  avgApprovalWeeks: number | null; // avg government approval weeks
  portfolioCount: number;
  licenseExpiry: string;
  exposurePackage: "premium" | "basic" | null;
  contactVerified?: boolean;
  portfolioVerified?: boolean;
  // Public Google Maps rating (displayed with "Google" attribution, refreshed monthly)
  googleRating?: number | null;
  googleRatingCount?: number | null;
};

const curatedCompanies: Company[] = [
  {
    id: "c1",
    name: "Al Noor Interiors",
    legalName: "Al Noor Interiors LLC",
    verified: true,
    area: "Business Bay",
    categories: ["Full Renovation", "Kitchen", "Bathroom"],
    spaceTypes: ["Apartment", "Villa"],
    priceRange: "AED 80K–250K",
    intro: "15 years in Dubai with a dedicated DM approval team. Premium fit-out specialist with Korean-speaking consultants.",
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
    name: "Desert Oak Design",
    legalName: "Desert Oak Design Studio",
    verified: true,
    area: "JVC",
    categories: ["Residential", "Custom Furniture"],
    spaceTypes: ["Apartment"],
    priceRange: "AED 40K–120K",
    intro: "Apartment specialist with transparent milestone-based quotations at reasonable prices.",
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
    name: "Marina Fitout",
    legalName: "Marina Fitout Contracting",
    verified: true,
    area: "Dubai Marina",
    categories: ["Commercial", "Restaurant", "Office"],
    spaceTypes: ["Commercial"],
    priceRange: "AED 150K–800K",
    intro: "F&B and retail fit-out specialist. One-stop DED / DM / Civil Defense approval handling.",
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
    name: "Palm Villa Renovations",
    legalName: "Palm Villa Renovations LLC",
    verified: true,
    area: "Palm Jumeirah",
    categories: ["Villa Renovation", "Landscaping", "Pool"],
    spaceTypes: ["Villa"],
    priceRange: "AED 300K–2M",
    intro: "High-end villa specialist for Palm Jumeirah and Emirates Hills. Dedicated community approval handling.",
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
    name: "Downtown Spaceworks",
    legalName: "Downtown Spaceworks FZE",
    verified: true,
    area: "Downtown Dubai",
    categories: ["Apartment", "Home Office"],
    spaceTypes: ["Apartment"],
    priceRange: "AED 60K–180K",
    intro: "Extensive track record in Downtown towers. Fully versed in Emaar community regulations.",
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
    name: "Gulf Craft Contracting",
    legalName: "Gulf Craft Contracting",
    verified: false,
    area: "Al Quoz",
    categories: ["Carpentry", "Painting"],
    spaceTypes: ["Apartment", "Villa"],
    priceRange: "Not listed",
    intro: "Auto-generated profile from public data. Full details become visible after the owner claims this profile.",
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
    name: "Oasis Home Studio",
    legalName: "Oasis Home Studio",
    verified: false,
    area: "Deira",
    categories: ["Residential"],
    spaceTypes: ["Apartment"],
    priceRange: "Not listed",
    intro: "Auto-generated profile from public data. Full details become visible after the owner claims this profile.",
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
    name: "Serenity Interiors",
    legalName: "Serenity Interiors FZE",
    verified: true,
    area: "JLT",
    categories: ["Full Renovation", "Smart Home"],
    spaceTypes: ["Apartment", "Villa"],
    priceRange: "AED 100K–400K",
    intro: "Smart-home integration specialist. Official KNX and Lutron partner.",
    scheduleComplianceRate: 93,
    noExtraChargeRate: 97,
    verifiedReviewCount: 15,
    avgApprovalWeeks: 2.3,
    portfolioCount: 31,
    licenseExpiry: "2027-08-01",
    exposurePackage: "basic",
  },
];

// Real Dubai companies from public sources, listed as unclaimed profiles (spec 1.1)
const seededProfiles: Company[] = seedCompanies.map((s, i) => ({
  id: `s${i + 1}`,
  name: s.name,
  legalName: s.name,
  verified: false,
  area: s.area,
  categories: s.categories,
  spaceTypes: s.spaceTypes,
  priceRange: "Not listed",
  intro: "Auto-generated profile from public data. Full details become visible after the owner claims this profile.",
  scheduleComplianceRate: null,
  noExtraChargeRate: null,
  verifiedReviewCount: 0,
  avgApprovalWeeks: null,
  portfolioCount: 0,
  licenseExpiry: "-",
  exposurePackage: null,
}));

export const companies: Company[] = [...curatedCompanies, ...seededProfiles];

export type Review = {
  id: string;
  companyId: string;
  author: string;
  date: string;
  spaceType: string;
  scheduleDelayDays: number; // 0 = on time
  approvalWeeks: number;
  extraCharge: boolean;
  qualityOk: boolean;
  factNote: string; // factual statement ≤200 chars
};

export const reviews: Review[] = [
  { id: "r1", companyId: "c1", author: "Kim J.", date: "2026-06-12", spaceType: "2BR Apartment", scheduleDelayDays: 0, approvalWeeks: 2, extraCharge: false, qualityOk: true, factNote: "Completed exactly within the 8-week contract schedule. DM approval done in 2 weeks. No extra charges." },
  { id: "r2", companyId: "c1", author: "Sarah M.", date: "2026-05-28", spaceType: "4BR Villa", scheduleDelayDays: 3, approvalWeeks: 2, extraCharge: false, qualityOk: true, factNote: "3-day extension due to material import delay, notified in writing beforehand. Final amount matched the quotation." },
  { id: "r3", companyId: "c2", author: "Park S.", date: "2026-06-01", spaceType: "1BR Apartment", scheduleDelayDays: 0, approvalWeeks: 3, extraCharge: true, qualityOk: true, factNote: "AED 4,200 extra incurred for a countertop change I requested. Proceeded after signing a change order." },
  { id: "r4", companyId: "c3", author: "Ahmed K.", date: "2026-04-15", spaceType: "Restaurant 180sqm", scheduleDelayDays: 7, approvalWeeks: 4, extraCharge: false, qualityOk: true, factNote: "7-day delay due to Civil Defense re-inspection. Received detailed weekly reports during the delay." },
  { id: "r5", companyId: "c8", author: "Lee H.", date: "2026-07-02", spaceType: "3BR Apartment", scheduleDelayDays: 0, approvalWeeks: 2, extraCharge: false, qualityOk: true, factNote: "10-week schedule kept including smart-home wiring. 2 defects reported and fixed within 5 days." },
];

export type Milestone = {
  id: string;
  name: string;
  ratio: number; // payment ratio %
  dueDate: string;
  status: "Completed" | "In Progress" | "Pending" | "Awaiting QA" | "Disputed";
  escrowStatus: "Released" | "Held in Escrow" | "On Hold";
};

export const contract = {
  id: "ct1",
  companyId: "c1",
  consumer: "Kim J.",
  totalAmount: 145000,
  currency: "AED",
  signedConsumer: true,
  signedSupplier: true,
  startDate: "2026-06-20",
  endDate: "2026-09-12",
  escrowDeposited: true,
  milestones: [
    { id: "m1", name: "Demolition & Groundwork", ratio: 20, dueDate: "2026-07-05", status: "Completed", escrowStatus: "Released" },
    { id: "m2", name: "Electrical & Plumbing", ratio: 25, dueDate: "2026-07-28", status: "Awaiting QA", escrowStatus: "Held in Escrow" },
    { id: "m3", name: "Tiling, Painting & Finishing", ratio: 35, dueDate: "2026-08-25", status: "Pending", escrowStatus: "Held in Escrow" },
    { id: "m4", name: "Furniture & Final Inspection", ratio: 20, dueDate: "2026-09-12", status: "Pending", escrowStatus: "Held in Escrow" },
  ] as Milestone[],
};

export type ChecklistItem = {
  id: string;
  label: string;
  required: boolean;
  result: "Pass" | "Fail" | null;
  comment: string;
  photos: number;
};

export const qaChecklist: ChecklistItem[] = [
  { id: "q1", label: "Tile leveling (±2mm tolerance)", required: true, result: "Pass", comment: "Level-checked across all zones", photos: 3 },
  { id: "q2", label: "Paint finish quality", required: true, result: "Pass", comment: "Two coats confirmed", photos: 2 },
  { id: "q3", label: "Silicone caulking finish", required: true, result: "Fail", comment: "Rework needed around kitchen sink", photos: 4 },
  { id: "q4", label: "Bathroom waterproofing (24h flood test)", required: true, result: null, comment: "", photos: 0 },
  { id: "q5", label: "Electrical outlet continuity check", required: false, result: "Pass", comment: "", photos: 1 },
];

export type QuoteRequest = {
  id: string;
  companyId: string;
  status: "Pending" | "Received" | "Expired";
  sentDate: string;
  amount: number | null;
  durationWeeks: number | null;
  note: string;
};

export const quoteRequests: QuoteRequest[] = [
  { id: "qr1", companyId: "c1", status: "Received", sentDate: "2026-07-18", amount: 145000, durationWeeks: 12, note: "Detailed material-grade quotation attached. DM approval handling included." },
  { id: "qr2", companyId: "c2", status: "Received", sentDate: "2026-07-18", amount: 118000, durationWeeks: 14, note: "Lower cost via in-house furniture workshop production." },
  { id: "qr3", companyId: "c8", status: "Received", sentDate: "2026-07-18", amount: 162000, durationWeeks: 11, note: "Includes basic smart-home package." },
  { id: "qr4", companyId: "c5", status: "Pending", sentDate: "2026-07-18", amount: null, durationWeeks: null, note: "" },
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
  status: "New" | "Accepted" | "Declined" | "Expired";
};

export const supplierLeads: Lead[] = [
  { id: "l1", consumer: "Kim J.", spaceType: "3BR Apartment", area: "Business Bay", budget: "AED 120K–160K", wish: "Completion before September move-in. Prefers Korean-style kitchen.", fee: 250, receivedAt: "2026-07-23", status: "New" },
  { id: "l2", consumer: "Fatima A.", spaceType: "5BR Villa", area: "Arabian Ranches", budget: "AED 400K+", wish: "Full renovation plus landscaping.", fee: 400, receivedAt: "2026-07-22", status: "New" },
  { id: "l3", consumer: "Park S.", spaceType: "2BR Apartment", area: "JVC", budget: "AED 60K–90K", wish: "Two bathrooms plus kitchen.", fee: 250, receivedAt: "2026-07-19", status: "Accepted" },
  { id: "l4", consumer: "David L.", spaceType: "Office 120sqm", area: "DIFC", budget: "AED 200K", wish: "Must start within 4 weeks.", fee: 350, receivedAt: "2026-07-15", status: "Declined" },
];

export type LicenseApplication = {
  id: string;
  companyId: string;
  companyName: string;
  tradeLicense: string;
  detLicense: string;
  submittedAt: string;
  status: "Under Review" | "Approved" | "Rejected";
  rejectReason?: string;
};

export const licenseApplications: LicenseApplication[] = [
  { id: "la1", companyId: "c6", companyName: "Gulf Craft Contracting", tradeLicense: "trade_license_887123.pdf", detLicense: "det_fitout_887123.pdf", submittedAt: "2026-07-23", status: "Under Review" },
  { id: "la2", companyId: "c7", companyName: "Oasis Home Studio", tradeLicense: "TL-445829.pdf", detLicense: "det_license_scan.jpg", submittedAt: "2026-07-21", status: "Under Review" },
  { id: "la3", companyId: "c5", companyName: "Downtown Spaceworks", tradeLicense: "trade_lic_2027.pdf", detLicense: "det_2027.pdf", submittedAt: "2026-07-10", status: "Approved" },
  { id: "la4", companyId: "c9x", companyName: "QuickFix Deco", tradeLicense: "license_photo.jpg", detLicense: "-", submittedAt: "2026-07-08", status: "Rejected", rejectReason: "DET fit-out license missing. Trade license expired (2026-05)." },
];

export type Dispute = {
  id: string;
  contractId: string;
  milestone: string;
  claimant: "Consumer" | "Contractor";
  companyName: string;
  consumer: string;
  reason: string;
  amount: number;
  evidenceCount: number;
  filedAt: string;
  status: "Filed" | "Under Review" | "Resolved";
  resolution?: string;
};

export const disputes: Dispute[] = [
  { id: "d1", contractId: "ct1", milestone: "Electrical & Plumbing", claimant: "Consumer", companyName: "Al Noor Interiors", consumer: "Kim J.", reason: "Switch hardware installed differs from the brand (Legrand) specified in the contract.", amount: 36250, evidenceCount: 6, filedAt: "2026-07-20", status: "Under Review" },
  { id: "d2", contractId: "ct8", milestone: "Finishing Works", claimant: "Contractor", companyName: "Desert Oak Design", consumer: "Choi M.", reason: "Failed negotiation over extra time and cost after 3 design changes requested by the consumer.", amount: 12800, evidenceCount: 4, filedAt: "2026-07-14", status: "Resolved", resolution: "AED 8,400 paid to contractor for 2 change orders; 1 claim dismissed" },
];

export const inspections = [
  { id: "i1", contractId: "ct1", companyName: "Al Noor Interiors", consumer: "Kim J.", milestone: "Electrical & Plumbing", inspector: "J. Chung", date: "2026-07-26 10:00", status: "Confirmed" },
  { id: "i2", contractId: "ct4", companyName: "Palm Villa Renovations", consumer: "Omar H.", milestone: "Waterproofing", inspector: "J. Chung", date: "2026-07-27 14:00", status: "Confirmed" },
  { id: "i3", contractId: "ct8", companyName: "Desert Oak Design", consumer: "Choi M.", milestone: "Finishing Works", inspector: "Unassigned", date: "Reschedule requested (reason: material delivery delay)", status: "Pending Approval" },
];

export const exposurePackages = [
  { id: "p1", name: "Basic Boost", price: 499, period: "30 days", benefits: ["Higher ranking in local search results", "'Featured' badge"] },
  { id: "p2", name: "Premium Boost", price: 1299, period: "30 days", benefits: ["Pinned at top of all search results (max 3 firms)", "Homepage featured section placement", "'Premium' badge", "Weekly profile-view analytics report"] },
  { id: "p3", name: "Category Sponsor", price: 899, period: "30 days", benefits: ["#1 position in a chosen category", "Category banner placement"] },
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

export const areas = ["Business Bay", "Downtown Dubai", "Dubai Marina", "JVC", "JLT", "Al Quoz", "Palm Jumeirah", "Al Barsha", "Deira", "Arabian Ranches"];
export const spaceTypeOptions = ["Apartment", "Villa", "Commercial"];
export const budgetOptions = ["Under AED 50K", "AED 50K–100K", "AED 100K–200K", "AED 200K–500K", "AED 500K+"];
export const categoryOptions = ["Full Renovation", "Kitchen", "Bathroom", "Commercial", "Custom Furniture", "Smart Home", "Landscaping"];

export function getCompany(id: string) {
  return companies.find((c) => c.id === id);
}

export const fmt = (n: number) => n.toLocaleString("en-US");

// Real interior photography (Unsplash CDN) — replaces gradient placeholders
// until claimed contractors upload their own portfolios.
const photoIds = [
  "1600210492486-724fe5c67fb0",
  "1600585154340-be6161a56a0c",
  "1618221195710-dd6b41faaea6",
  "1600566753086-00f18fb6b3ea",
  "1556912173-3bb406ef7e77",
  "1615873968403-89e068629265",
  "1586023492125-27b2c045efd7",
  "1600607687939-ce8a6c25118c",
  "1616486338812-3dadae4b4ace",
  "1600607687920-4e2a09cf159d",
];

export function interiorPhoto(i: number, w = 800) {
  return `https://images.unsplash.com/photo-${photoIds[i % photoIds.length]}?w=${w}&q=80&auto=format&fit=crop`;
}
