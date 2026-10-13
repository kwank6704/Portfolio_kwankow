# Portfolio — Nattarat Samartkit (Kwan)

Next.js 16 · React 19 · TypeScript. No image files: the landscape, the room, the covers and the charts are SVG/canvas drawn in code.

```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm start
npm run typecheck    # tsc, also flags unused code
npm run audit:prod   # vulnerabilities in what actually ships
```

## Where things live

```
src/
  app/            layout, page, icon
  content/        ALL text (EN + TH) and data — edit here, not in components
    ui.ts           interface strings        experience.ts / projects.ts   per-item detail (summary, steps, flow, timeline)
    profile.ts      name, links              skills.ts / community.ts      skills, test suite, awards, activities
  components/
    hero/           the room: Hero, HeroStage (particles + bug game), HeroZoom (scroll zoom), RoomFront (desk/monitor/lamp SVG)
    scene/          Scene (window view), Journey (trail down the left), Horizon (footer landscape)
    sections/       About, Experience, Projects, TestRunner, Research, Skills, Resume, Contact, Covers
    shell/          Nav, Providers (language + theme)
    ui/             Reveal, DetailSheet
  lib/            audio (Web Audio), ridge (mountain generators)
  styles/         tokens → base → scene → shared → nav → hero → sections → sheet → responsive
public/           resume PDF, theme-init.js, .well-known/security.txt
```

## How it works

- **Theme = the lamp.** Lamp on = night, lamp off = day; the view outside the window follows. Saved in `localStorage`, applied before first paint by `public/theme-init.js`.
- **Scroll zoom.** `HeroZoom` writes one CSS variable (`--e`); the camera move is pure CSS `calc()` on the GPU.
- **Light by design.** No `backdrop-filter`/blur, particle loop sleeps when still, bug loop 30 fps and only while visible, animations pause off-screen.
- **Palette** is defined once in `styles/tokens.css` (two colours per theme blend into the five mountain layers).

## Security

The site is static: no API routes, forms, cookies, database or user input, so there is nothing to inject into.

- `next.config.mjs` sends a Content-Security-Policy (no third-party scripts, no frames, no `<object>`, `form-action 'none'`, `frame-ancestors 'none'`), HSTS, `nosniff`, `X-Frame-Options: DENY`, strict referrer policy, a locked-down Permissions-Policy, and COOP/CORP.
- Scripts carry Subresource-Integrity hashes. No `dangerouslySetInnerHTML`, `eval` or `innerHTML` anywhere in `src/`.
- `script-src` allows inline scripts only because Next.js inlines its own bootstrap data; switching to nonces would force server rendering on every request. Safe here because nothing reflects user input.
- External links use `rel="noreferrer"` (implies `noopener`). `X-Powered-By` and source maps are off. `npm audit` is clean (prod and dev).
- `public/.well-known/security.txt` tells researchers where to report issues.

**The real risk is account takeover, not the code.** Turn on 2-factor authentication for GitHub and Vercel, use a unique password, and never commit `.env` files.

`public/Nattarat_Samartkit_Resume.pdf` contains a phone number and photo and is publicly downloadable. Replace it with a version without them if you prefer.

## Deploy

Push to GitHub, import the repo in Vercel (framework preset: Next.js, defaults are fine).
