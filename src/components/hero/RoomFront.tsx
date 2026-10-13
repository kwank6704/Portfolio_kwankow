// The foreground of the room: desk, monitor, keyboard, mug, plant and the desk lamp.
// Pure static SVG (no hooks). The monitor's screen rectangle is x304 y100 w992 h558 — the HTML "screen"
// overlay in Hero.tsx sits exactly on it. Colours are CSS variables, so day/night switches for free.
export default function RoomFront() {
  return (
    <svg className="room-front" viewBox="0 0 1600 900" focusable="false" aria-hidden="true">
      <defs>
        <radialGradient id="deskglow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" style={{ stopColor: "var(--lamp)", stopOpacity: 0.55 }} />
          <stop offset="1" style={{ stopColor: "var(--lamp)", stopOpacity: 0 }} />
        </radialGradient>
        <linearGradient id="cone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "var(--lamp)", stopOpacity: 0.5 }} />
          <stop offset="1" style={{ stopColor: "var(--lamp)", stopOpacity: 0 }} />
        </linearGradient>
      </defs>

      {/* desk top (extends far beyond the frame so any screen shape stays covered) */}
      <rect x="-3000" y="772" width="7600" height="4000" style={{ fill: "var(--desk-top)" }} />
      <rect x="-3000" y="772" width="7600" height="8" style={{ fill: "var(--desk-edge)" }} />
      <ellipse className="lamp-on" cx="1130" cy="830" rx="560" ry="80" fill="url(#deskglow)" />

      {/* monitor */}
      <rect x="765" y="690" width="70" height="86" style={{ fill: "var(--mon)" }} />
      <path d="M640 778h320l-24-20H664z" style={{ fill: "var(--mon)" }} />
      <rect x="272" y="72" width="1056" height="630" rx="26" style={{ fill: "var(--mon)" }} />
      <rect x="304" y="100" width="992" height="558" rx="8" style={{ fill: "var(--bg)" }} />
      <circle cx="800" cy="680" r="4" style={{ fill: "var(--desk-edge)" }} />

      {/* keyboard + mouse */}
      <rect x="500" y="806" width="600" height="38" rx="12" style={{ fill: "var(--kb)" }} />
      <path d="M522 818h556M522 832h556" strokeWidth="2.5" strokeDasharray="14 6" style={{ stroke: "var(--desk-edge)" }} />
      <ellipse cx="1200" cy="826" rx="28" ry="17" style={{ fill: "var(--kb)" }} />

      {/* mug */}
      <rect x="150" y="724" width="68" height="74" rx="11" style={{ fill: "var(--mug)" }} />
      <path d="M218 742q30 0 30 24t-30 24" fill="none" strokeWidth="9" strokeLinecap="round" style={{ stroke: "var(--mug)" }} />
      <path className="steam" d="M172 706q-14-16 0-32t0-26" fill="none" strokeWidth="5" strokeLinecap="round" style={{ stroke: "var(--steam)" }} />
      <path className="steam s2" d="M196 706q-14-16 0-32t0-26" fill="none" strokeWidth="5" strokeLinecap="round" style={{ stroke: "var(--steam)" }} />

      {/* plant */}
      <rect x="40" y="690" width="84" height="88" rx="10" style={{ fill: "var(--mug)" }} />
      <path d="M82 692q-46-46-30-110q42 22 30 110zM82 692q50-40 56-102q-52 4-56 102zM82 692q-10-70 14-118q34 40-14 118z" style={{ fill: "var(--g1)" }} />

      {/* desk lamp: the light switch for the whole page */}
      <rect x="1392" y="758" width="140" height="18" rx="9" style={{ fill: "var(--lampbody)" }} />
      <path d="M1462 760L1486 480L1388 318" fill="none" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" style={{ stroke: "var(--lampbody)" }} />
      <circle cx="1486" cy="480" r="13" style={{ fill: "var(--lampbody)" }} />
      <path className="lamp-on" d="M1380 352L1250 772H1850L1494 300z" fill="url(#cone)" />
      <path d="M1318 300l128-52l36 104-128 52z" style={{ fill: "var(--lampbody)" }} />
      <ellipse className="lamp-on" cx="1384" cy="362" rx="26" ry="12" transform="rotate(-21 1384 362)" style={{ fill: "var(--lamp)" }} />
      <ellipse className="lamp-off" cx="1384" cy="362" rx="26" ry="12" transform="rotate(-21 1384 362)" style={{ fill: "var(--lamp-off)" }} />
    </svg>
  );
}
