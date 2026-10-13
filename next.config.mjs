// Security headers. The site is fully static (no API routes, no forms, no user input, no cookies, no database),
// so the attack surface is already tiny; these headers close the remaining browser-side doors.
const isDev = process.env.NODE_ENV === "development";

const csp = [
  "default-src 'self'",
  // Next.js inlines its tiny bootstrap/data scripts into every page, and their content changes per build, so
  // inline scripts must be allowed. A nonce would fix that but forces server rendering on every request.
  // This is safe here because nothing on the site accepts or reflects user input (no injection point), and
  // everything else in this policy stays strict: no third-party scripts, no eval in production, no frames, no <object>.
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  // React writes style="" attributes; styles can't run code, so only the attribute form is relaxed
  "style-src 'self'" + (isDev ? " 'unsafe-inline'" : ""),
  "style-src-attr 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "media-src 'none'",
  "object-src 'none'",
  "frame-src 'none'",
  "worker-src 'none'",
  "manifest-src 'self'",
  "base-uri 'self'",
  "form-action 'none'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), serial=(), bluetooth=(), accelerometer=(), gyroscope=(), magnetometer=(), interest-cohort=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false, // don't advertise the framework
  productionBrowserSourceMaps: false, // don't ship source maps to visitors
  experimental: {
    // adds integrity="sha256-…" to every script so a tampered file is refused by the browser
    sri: { algorithm: "sha256" },
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
