import { L } from "./types";

export const testSuite: { name: L; via: L; repos: string[]; fail?: boolean }[] = [
  { name: L("writes manual and automated test cases", "เขียนเทสต์เคสทั้งแบบทำมือและอัตโนมัติ"), via: L("Playwright · Robot Framework", "Playwright · Robot Framework"), repos: ["PLAY_playwright_O", "automation-testing-demoqa", "Assignment_Robot"] },
  { name: L("tests REST APIs end to end", "ทดสอบ REST API"), via: L("Postman · Bruno", "Postman · Bruno"), repos: ["api-testing-course"] },
  { name: L("tracks defects and coordinates UAT", "ตามบั๊กและประสาน UAT"), via: L("Playtorium · Capstone", "Playtorium · Capstone"), repos: [] },
  { name: L("sets up the CI pipeline", "ตั้ง CI pipeline"), via: L("GitHub Actions", "GitHub Actions"), repos: ["GitHubActionPractice"] },
  { name: L("ships full-stack apps", "ส่งมอบแอป Full-stack"), via: L("React · Next.js · Node · Django · Spring Boot", "React · Next.js · Node · Django · Spring Boot"), repos: ["NOCHILL", "tercelo"] },
  { name: L("models relational and document data", "ออกแบบข้อมูล relational และ document"), via: L("PostgreSQL · MySQL · MongoDB", "PostgreSQL · MySQL · MongoDB"), repos: ["BeingHuman-Database"] },
  { name: L("gets enough sleep before a deadline", "นอนให้พอก่อนเดดไลน์"), via: L("known issue — won't fix", "บั๊กที่รู้อยู่ ไม่แก้"), repos: [], fail: true },
];

export const skillGroups: { name: L; color: string; items: string[] }[] = [
  { name: L("Languages", "ภาษาโปรแกรม"), color: "var(--g1)", items: ["Python", "Java", "C / C++", "JavaScript", "TypeScript", "SQL"] },
  { name: L("Web", "เว็บ"), color: "var(--g2)", items: ["React", "Next.js", "Node.js", "Express", "Django", "Spring Boot", "Tailwind"] },
  { name: L("Testing", "งานเทสต์"), color: "var(--g3)", items: ["Playwright", "Postman", "Bruno", "Robot Framework", "Defect tracking"] },
  { name: L("Data & ML", "ข้อมูลและ ML"), color: "var(--g4)", items: ["NumPy", "Pandas", "Matplotlib", "scikit-learn", "PCA"] },
  { name: L("Databases", "ฐานข้อมูล"), color: "var(--g5)", items: ["PostgreSQL", "MySQL", "MongoDB", "Firebase"] },
  { name: L("Tools", "เครื่องมือ"), color: "var(--g6)", items: ["Git", "Docker", "Figma", "n8n", "Zapier", "Power Automate"] },
];
