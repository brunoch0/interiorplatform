// Real Dubai interior/fit-out companies collected from public web sources (Google search,
// directories, company sites) — used to seed the directory as unclaimed "dummy" profiles
// per spec 1.1 (더미 프로필 자동 생성). Public business identity only; no personal data.
// Collected: 2026-07-24. In Phase 2 this becomes an operator-managed import pipeline.

export type SeedCompany = {
  name: string;
  area: string;
  categories: string[];
  spaceTypes: string[];
  website: string | null;
};

export const seedCompanies: SeedCompany[] = [
  { name: "Bond Interiors", area: "Dubai Industrial City", categories: ["Commercial", "Office", "Full Renovation"], spaceTypes: ["Commercial"], website: "https://bondinteriors.com" },
  { name: "Summertown Interiors", area: "Jebel Ali Free Zone", categories: ["Office", "Commercial"], spaceTypes: ["Commercial"], website: "https://www.summertown.ae" },
  { name: "Depa Interiors", area: "Dubai Investment Park", categories: ["Commercial", "Full Renovation"], spaceTypes: ["Commercial"], website: "https://depa.com" },
  { name: "HTS Interiors", area: "Jumeirah Beach Residence", categories: ["Office", "Commercial"], spaceTypes: ["Commercial"], website: "https://htsinteriors.com" },
  { name: "Swiss Bureau Interior Design", area: "Business Bay", categories: ["Office", "Commercial"], spaceTypes: ["Commercial"], website: "https://www.sb-id.com" },
  { name: "4Space Design", area: "JLT", categories: ["Commercial", "Restaurant", "Office"], spaceTypes: ["Commercial"], website: "https://4space.ae" },
  { name: "Algedra Interior Design", area: "JLT", categories: ["Residential", "Villa Renovation", "Full Renovation"], spaceTypes: ["Villa", "Apartment"], website: "https://algedra.ae" },
  { name: "Antonovich Group", area: "Downtown Dubai", categories: ["Villa Renovation", "Residential", "Full Renovation"], spaceTypes: ["Villa"], website: "https://antonovich-design.ae" },
  { name: "Zen Interiors", area: "Al Barsha", categories: ["Residential", "Custom Furniture"], spaceTypes: ["Apartment", "Villa"], website: "https://www.zeninteriors.net" },
  { name: "XBD Collective", area: "Dubai", categories: ["Residential", "Commercial"], spaceTypes: ["Villa", "Commercial"], website: "https://xbdesign.com" },
  { name: "Bishop Design", area: "Dubai", categories: ["Restaurant", "Commercial", "Custom Furniture"], spaceTypes: ["Commercial"], website: "https://wearebishopdesign.com" },
  { name: "Lloyd Design", area: "Al Quoz", categories: ["Restaurant", "Commercial", "Office"], spaceTypes: ["Commercial"], website: "https://lloyddesignuae.com" },
  { name: "Grand Crest Interior Decoration", area: "Business Bay", categories: ["Office", "Commercial"], spaceTypes: ["Commercial"], website: null },
  { name: "Horton Interiors", area: "Al Quoz", categories: ["Office", "Commercial", "Full Renovation"], spaceTypes: ["Commercial"], website: "https://hortoninteriors.com" },
  { name: "ARKI Fit Out", area: "The Greens", categories: ["Commercial", "Office"], spaceTypes: ["Commercial"], website: null },
  { name: "Edition Living", area: "Dubai Investment Park", categories: ["Villa Renovation", "Landscaping", "Joinery"], spaceTypes: ["Villa"], website: null },
  { name: "SITES Design & Build", area: "Al Quoz", categories: ["Office", "Commercial"], spaceTypes: ["Commercial"], website: null },
  { name: "Aujan Interiors", area: "Al Qusais", categories: ["Commercial", "Custom Furniture", "Joinery"], spaceTypes: ["Commercial"], website: null },
  { name: "Cornerstone Interiors", area: "Business Bay", categories: ["Office", "Joinery", "Commercial"], spaceTypes: ["Commercial"], website: null },
  { name: "A&T Group Interiors", area: "Sheikh Zayed Road", categories: ["Restaurant", "Commercial"], spaceTypes: ["Commercial"], website: null },
  { name: "Appello Interiors", area: "Al Quoz", categories: ["Commercial", "Office", "Joinery"], spaceTypes: ["Commercial", "Apartment"], website: null },
  { name: "GDM Interiors", area: "Arjan", categories: ["Office", "Restaurant", "Commercial"], spaceTypes: ["Commercial"], website: null },
  { name: "USBC Interiors", area: "Al Quoz", categories: ["Office", "Restaurant", "Full Renovation"], spaceTypes: ["Commercial", "Apartment", "Villa"], website: "https://www.usbcinteriors.com" },
  { name: "Spazio Interior Decoration", area: "Al Barsha", categories: ["Full Renovation", "Residential", "Restaurant"], spaceTypes: ["Villa", "Apartment", "Commercial"], website: "https://spazio.ae" },
  { name: "Designsmith", area: "Dubai", categories: ["Restaurant", "Commercial"], spaceTypes: ["Commercial"], website: "https://designsmith.ae" },
  { name: "Yalla Renovation", area: "Dubai", categories: ["Full Renovation", "Kitchen", "Bathroom"], spaceTypes: ["Apartment", "Villa"], website: "https://www.yallarenovation.com" },
  { name: "Smart Renovation", area: "Dubai", categories: ["Full Renovation", "Villa Renovation", "Landscaping"], spaceTypes: ["Villa", "Apartment"], website: "https://smartrenovation.ae" },
  { name: "Roseville Dubai", area: "Dubai", categories: ["Villa Renovation", "Kitchen", "Bathroom"], spaceTypes: ["Villa"], website: "https://www.rosevilledubai.com" },
  { name: "DEEJOS Interiors", area: "Dubai", categories: ["Full Renovation", "Kitchen", "Residential"], spaceTypes: ["Apartment", "Villa"], website: "https://www.deejos.ae" },
  { name: "Mokka Living", area: "Dubai", categories: ["Kitchen", "Bathroom"], spaceTypes: ["Apartment", "Villa"], website: "https://mokka.ae" },
  { name: "The Big Fitout", area: "Dubai", categories: ["Full Renovation", "Kitchen", "Bathroom"], spaceTypes: ["Apartment", "Villa"], website: "https://thebigfitout.com" },
  { name: "Fajr Interiors", area: "Dubai", categories: ["Villa Renovation", "Office", "Full Renovation"], spaceTypes: ["Villa", "Commercial"], website: "https://fajrinteriors.com" },
  { name: "Wood Luck Carpentry", area: "Al Quoz", categories: ["Carpentry", "Joinery", "Custom Furniture"], spaceTypes: ["Commercial", "Villa"], website: null },
  { name: "Milestone Dubai", area: "Al Quoz", categories: ["Carpentry", "Custom Furniture", "Landscaping"], spaceTypes: ["Villa"], website: "https://milestonedubai.com" },
  { name: "Dubai Carpenter", area: "Al Quoz", categories: ["Carpentry", "Custom Furniture", "Joinery"], spaceTypes: ["Apartment", "Villa"], website: "https://dubaicarpenter.ae" },
  { name: "KCJ Landscaping", area: "Dubai", categories: ["Landscaping"], spaceTypes: ["Villa"], website: "https://www.kcjlandscaping.ae" },
  { name: "Green Heaven Landscape", area: "Dubai", categories: ["Landscaping"], spaceTypes: ["Villa"], website: "https://greenheavens.ae" },
  { name: "Smartec", area: "Dubai", categories: ["Smart Home"], spaceTypes: ["Villa", "Apartment"], website: "https://smartec.ae" },
  { name: "MySmartHome", area: "Dubai", categories: ["Smart Home"], spaceTypes: ["Villa", "Apartment"], website: "https://www.mysmarthome.ae" },
  { name: "Zabeel Decor", area: "Dubai", categories: ["Office", "Commercial"], spaceTypes: ["Commercial"], website: "https://zabeeldecor.ae" },
];
