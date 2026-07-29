// Topical hero images for guides — every ID verified live on Unsplash CDN.
// Explicit per-slug picks for editorial fit; category pools cover future auto-published guides.

const IMG: Record<string, string> = {
  livingRoom: "1600210492486-724fe5c67fb0",
  livingRoom2: "1618221195710-dd6b41faaea6",
  villaPool: "1613490493576-7fde63acd811",
  kitchen: "1556909114-f6e7ad7d3136",
  bathroom: "1552321554-5fefe8c9ef14",
  blueprint: "1503387762-592deb58ef4e",
  handshake: "1521791136064-7986c2920216",
  signing: "1450101499163-c8848c66ca85",
  calculatorDocs: "1554224155-6726b3ff858f",
  siteWorkers: "1541888946425-d81bb19240f5",
  siteEmpty: "1504307651254-35680f356dfd",
  workerTool: "1558618666-fcd25c85cd64",
  paintRoller: "1562259949-e8e7689d7828",
  emptyRoomWood: "1581858726788-75bc0f6a952d",
};

const BY_SLUG: Record<string, string> = {
  "apartment-renovation-cost-dubai": IMG.livingRoom,
  "villa-renovation-cost-dubai": IMG.villaPool,
  "kitchen-bathroom-renovation-cost-dubai": IMG.kitchen,
  "renovation-timeline-dubai": IMG.blueprint,
  "dubai-renovation-permits-dm-approval-noc": IMG.blueprint,
  "how-to-choose-fit-out-contractor-dubai": IMG.handshake,
  "renovation-contract-checklist-dubai": IMG.signing,
  "compare-renovation-quotes-dubai": IMG.calculatorDocs,
  "living-in-during-renovation-dubai": IMG.livingRoom2,
  "renovation-milestone-payments-dubai": IMG.calculatorDocs,
  "managing-contractor-during-renovation-dubai": IMG.workerTool,
  "renovation-defects-snagging-dubai": IMG.emptyRoomWood,
  "renovation-complaints-dubai": IMG.signing,
  "contractor-asking-for-more-money-dubai": IMG.calculatorDocs,
  "contractor-delaying-renovation-dubai": IMG.siteWorkers,
  "contractor-took-deposit-dubai": IMG.siteEmpty,
};

const BY_CATEGORY: Record<string, string[]> = {
  "Planning & Costs": [IMG.calculatorDocs, IMG.livingRoom, IMG.blueprint],
  "Permits & Rules": [IMG.blueprint, IMG.signing],
  "Hiring & Contracts": [IMG.handshake, IMG.signing],
  "During the Works": [IMG.siteWorkers, IMG.workerTool, IMG.paintRoller],
  "Handover & Quality": [IMG.emptyRoomWood, IMG.bathroom],
  "Problems & Rights": [IMG.signing, IMG.calculatorDocs],
};

export function guideImage(slug: string, category: string, w = 1200): string {
  let id = BY_SLUG[slug];
  if (!id) {
    const pool = BY_CATEGORY[category] ?? [IMG.livingRoom];
    const hash = [...slug].reduce((n, c) => n + c.charCodeAt(0), 0);
    id = pool[hash % pool.length];
  }
  return `https://images.unsplash.com/photo-${id}?w=${w}&q=75&auto=format&fit=crop`;
}
