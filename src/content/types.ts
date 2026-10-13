// Shared content types. Every visible string is a bilingual pair.
export type L = { en: string; th: string };
export const L = (en: string, th: string): L => ({ en, th });

export interface Detail {
  summary: L;
  did: L[];
  flowTitle?: L;
  flow: L[];
  loop?: boolean;
  phasesTitle?: L;
  phases: { when: L; what: L }[];
}

export interface Experience {
  id: string;
  when: L;
  span: L;
  role: L;
  org: string;
  tag: L;
  text: L;
  tech: string[];
  detail: Detail;
}

export type CoverId = "nochill" | "beinghuman" | "tercelo" | "cocoa" | "camp" | "hotel" | "sleep";

export interface Project {
  id: CoverId;
  title: string;
  kind: L;
  year: L;
  text: L;
  role?: L;
  stack: string[];
  live?: string;
  repo?: string;
  featured?: boolean;
  accent: string;
  detail: Detail;
}
