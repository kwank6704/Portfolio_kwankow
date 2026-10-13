import type { Metadata, Viewport } from "next";
import { Caveat, Fraunces, Mali, Plus_Jakarta_Sans, IBM_Plex_Sans_Thai, Trirong } from "next/font/google";
import Script from "next/script";
import Providers from "@/components/shell/Providers";
import "@/styles/tokens.css";
import "@/styles/base.css";
import "@/styles/scene.css";
import "@/styles/shared.css";
import "@/styles/nav.css";
import "@/styles/hero.css";
import "@/styles/sections.css";
import "@/styles/sheet.css";
import "@/styles/responsive.css";

// Headings: Fraunces (soft, characterful serif) / Trirong for Thai. Body: Plus Jakarta Sans / IBM Plex Sans Thai.
const display = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const serif = Fraunces({ subsets: ["latin"], style: ["normal", "italic"], axes: ["opsz"], variable: "--font-serif", display: "swap" });
// Thai faces are only downloaded when Thai text is actually shown (unicode-range), so English visitors never pay for them.
const thai = IBM_Plex_Sans_Thai({ subsets: ["thai"], weight: ["400", "500", "600", "700"], variable: "--font-thai", display: "swap", preload: false });
const thaiSerif = Trirong({ subsets: ["thai"], weight: ["400", "500", "600"], variable: "--font-thai-serif", display: "swap", preload: false });

const hand = Caveat({ subsets: ["latin"], weight: "600", variable: "--font-hand", display: "swap", preload: false });
const handTh = Mali({ subsets: ["thai"], weight: "500", variable: "--font-hand-th", display: "swap", preload: false });

export const metadata: Metadata = {
  title: "Nattarat Samartkit (Kwan) — Software Tester & Developer",
  description:
    "Portfolio of Nattarat Samartkit: Computer Engineering student at Chulalongkorn University — software testing, full-stack development and data analysis.",
  openGraph: {
    title: "Nattarat Samartkit (Kwan) — Software Tester & Developer",
    description: "Software testing, full-stack development and data analysis. Projects, internships and research.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0e1128" },
    { media: "(prefers-color-scheme: light)", color: "#f6efe4" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning className={`${display.variable} ${serif.variable} ${thai.variable} ${thaiSerif.variable} ${hand.variable} ${handTh.variable}`}>
      <body>
        {/* applies the saved theme before first paint; a real file so the CSP can forbid inline scripts */}
        <Script src="/theme-init.js" strategy="beforeInteractive" />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
