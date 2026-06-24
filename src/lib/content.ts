import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const DATA_PATH = join(process.cwd(), "src", "data", "site.json");

export interface SiteData {
  adminRoute: string;
  telegramId: string;
  siteName: string;
  heroTitle: string;
  heroSubtitle: string;
  heroBadge: string;
  servers: Server[];
  plans: Plan[];
  features: Feature[];
  faq: FAQ[];
  payment: Payment;
}

export interface Payment {
  enabled: boolean;
  cardNumber: string;
  cardHolder: string;
  bankName: string;
  shabaNumber: string;
  phone: string;
  description: string;
}

export interface Server {
  id: string;
  name: string;
  flag: string;
  city: string;
  protocols: string[];
  status: "online" | "offline";
  load: number;
}

export interface Plan {
  id: string;
  name: string;
  price: string;
  priceUnit: string;
  per: string;
  description: string;
  features: string[];
  cta: string;
  popular: boolean;
  minGb: number;
  maxGb: number;
}

export interface Feature {
  title: string;
  description: string;
  icon: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export function getSiteData(): SiteData {
  if (!existsSync(DATA_PATH)) {
    throw new Error("Site data file not found");
  }
  const raw = readFileSync(DATA_PATH, "utf-8");
  return JSON.parse(raw);
}

export function updateSiteData(data: SiteData): void {
  writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export function updateSiteDataPartial(partial: Partial<SiteData>): SiteData {
  const current = getSiteData();
  const updated = { ...current, ...partial };
  updateSiteData(updated);
  return updated;
}
