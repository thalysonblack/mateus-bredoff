import { useCallback, useEffect, useRef, useState, startTransition } from "react";
import imgFerraciGem from "figma:asset/fcaeee05bfca266dd4f14bcbbe960dc8a68097aa.png";
import imgTrivoCart from "figma:asset/81452b91e81161b2c6134b3da978b23e718c43f1.png";
import imgFerraciBook from "figma:asset/a54c24e68688a4820d0e68f5110d1f98c3be5d55.png";

/**
 * Cases — Framer "CasesScroll / Cases Showcase" rebuild (projects mode,
 * horizontal). Self-contained requestAnimationFrame lerp engine: infinite
 * virtual loop, one active card centred (scale 1) with neighbours falling off
 * to 0.85, smooth lerp + snap, drag w/ momentum, arrows, cursor zones, nav.
 *
 * Styled to match the reference: top filter tabs, a large landscape active card
 * with project name + category tags + "View Case", and the bottom project nav.
 * (Stag/Votare reuse available art as placeholders until real images are added.)
 */

type Project = {
  name: string;
  image: string;
  tags: string[];
  bg: string;
  fit: "cover" | "contain";
};

const FILTERS = ["All", "Visual Identity", "Packaging", "UI Design", "AI"] as const;

const PROJECTS: Project[] = [
  { name: "Stag", image: imgFerraciBook, tags: ["Visual Identity"], bg: "#0d0d0d", fit: "cover" },
  { name: "Trivo", image: imgTrivoCart, tags: ["Visual Identity", "3D"], bg: "#000000", fit: "cover" },
  { name: "Ferraci", image: imgFerraciGem, tags: ["Visual Identity", "3D"], bg: "linear-gradient(150deg,#c79a6a 0%,#e8d4b8 55%,#f5ead8 100%)", fit: "contain" },
  { name: "Votare", image: imgFerraciBook, tags: ["Packaging"], bg: "#0d0d0d", fit: "cover" },
];

// ── DEFAULTS (projects/horizontal) ───────────────────────────────────────────
// Figma: active card 1103×728 (≈1.51:1 landscape); neighbours 851×542 → 0.745 of
// the active height. The engine scales a uniform card by these factors.
const ASPECT = [2, 3] as const; // landscape card (width ≈ 1.5 × height)
const GAP = 16;
const SCROLL_EASE = 0.1;
const ACTIVE_SCALE = 1;
const ADJACENT_SCALE = 0.745;
const CARD_RADIUS = 4;
const CARD_WIDTH = 74; // % of root height used by the card row (cross axis)

const SECTION_BG = "#f6f6f6";

// Bottom nav — Figma: Geist Regular 20px, gap 19, tracking -0.6px, leading 0.78,
// mix-blend-exclusion, active #fff / inactive rgba(255,255,255,0.5).
const NAV_FONT = { fontFamily: "'Geist:Regular', Geist, sans-serif", fontWeight: 400, fontSize: 20, lineHeight: "0.78", letterSpacing: "-0.6px" } as const;
const NAV_GAP = 19;
const NAV_OFFSET_Y = 40;

const CURSOR_SIZE = 32;

const clamp = (n: number, a: number, b: number) => Math.max(a, Math.min(b, n));

function makeArrowCursorSvg(direction: "left" | "right", size: number, color = "#ffffff") {
  const d = direction === "left" ? "M20 6L8 16L20 26" : "M12 6L24 16L12 26";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="15" fill="rgba(0,0,0,0.45)"/><path d="${d}" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const SHIMMER_CSS = `@keyframes cases-shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}`;

// ── Card visual (image + per-project background) ─────────────────────────────
function CardVisual({ project, visualRef }: { project: Project; visualRef: (el: HTMLDivElement | null) => void }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div
      ref={visualRef}
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        borderRadius: CARD_RADIUS,
        background: project.bg,
        willChange: "transform, filter, opacity",
        transform: "translateZ(0)",
        backfaceVisibility: "hidden",
        pointerEvents: "none",
      }}
    >
      {!loaded && (
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, transparent 25%, rgba(255,255,255,0.08) 50%, transparent 75%)", backgroundSize: "200% 100%", animation: "cases-shimmer 1.5s ease-in-out infinite" }} />
      )}
      <img
        src={project.image}
        alt={project.name}
        draggable={false}
        onLoad={() => startTransition(() => setLoaded(true))}
        style={{
          position: "absolute",
          inset: project.fit === "contain" ? "10%" : 0,
          width: project.fit === "contain" ? "80%" : "100%",
          height: project.fit === "contain" ? "80%" : "100%",
          objectFit: project.fit,
          display: "block",
          pointerEvents: "none",
        }}
      />
      {/* Each card owns its name + tags, INSIDE the (scaled, clipped) card so they
          never spill out and never morph between cards. The centred card shows its
          name; neighbours reveal their tags on the peeking edge. */}
      <CardLabel project={project} />
    </div>
  );
}

// ── Per-card label: name (bottom-left) + tags (bottom-right) — Figma 84:73 ────
function CardLabel({ project }: { project: Project }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex items-center justify-between" style={{ padding: 12 }}>
      {/* Project name */}
      <p
        style={{ margin: 0, fontFamily: "'Inter_Display:Medium', 'Inter Tight', sans-serif", fontWeight: 500, fontSize: 24.428, lineHeight: 1.25, color: "#ffffff", mixBlendMode: "difference", whiteSpace: "nowrap" }}
      >
        {project.name}
      </p>

      {/* Category tags */}
      <div className="flex items-center" style={{ gap: 11 }}>
        {project.tags.map((t) => (
          <span
            key={t}
            style={{ background: "rgba(0,0,0,0.15)", backdropFilter: "blur(11.75px)", WebkitBackdropFilter: "blur(11.75px)", color: "#ffffff", fontFamily: "'Inter_Display:Medium', 'Inter Tight', sans-serif", fontWeight: 500, fontSize: 12, lineHeight: 1.25, padding: "4.653px 8.143px", borderRadius: 3, whiteSpace: "nowrap" }}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Cursor zones on the active card ──────────────────────────────────────────
function CursorZone({ onLeft, onRight, onView }: { onLeft: () => void; onRight: () => void; onView: () => void }) {
  const leftCursor = `url(${makeArrowCursorSvg("left", CURSOR_SIZE)}) ${CURSOR_SIZE / 2} ${CURSOR_SIZE / 2}, pointer`;
  const rightCursor = `url(${makeArrowCursorSvg("right", CURSOR_SIZE)}) ${CURSOR_SIZE / 2} ${CURSOR_SIZE / 2}, pointer`;
  const pillRef = useRef<HTMLDivElement>(null);
  const [over, setOver] = useState(false);

  // Follow the pointer inside the centre zone (write to the DOM directly — no
  // re-render per mousemove).
  const onCenterMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const el = pillRef.current;
    if (el) {
      el.style.left = `${e.clientX - rect.left}px`;
      el.style.top = `${e.clientY - rect.top}px`;
    }
  };

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 20, pointerEvents: "none" }}>
      <button aria-label="Previous slide" onClick={(e) => { e.stopPropagation(); onLeft(); }} onPointerDown={(e) => e.stopPropagation()} style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: "24%", border: "none", background: "transparent", padding: 0, margin: 0, cursor: leftCursor, pointerEvents: "auto" }} />
      <button aria-label="Next slide" onClick={(e) => { e.stopPropagation(); onRight(); }} onPointerDown={(e) => e.stopPropagation()} style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: "24%", border: "none", background: "transparent", padding: 0, margin: 0, cursor: rightCursor, pointerEvents: "auto" }} />

      {/* Centre zone — custom "View Case" cursor (mix-blend-difference), native cursor hidden */}
      <button
        aria-label="View case"
        onClick={(e) => { e.stopPropagation(); onView(); }}
        onPointerDown={(e) => e.stopPropagation()}
        onMouseEnter={() => setOver(true)}
        onMouseLeave={() => setOver(false)}
        onMouseMove={onCenterMove}
        style={{ position: "absolute", top: 0, left: "24%", right: "24%", bottom: 0, border: "none", background: "transparent", padding: 0, margin: 0, cursor: "none", pointerEvents: "auto" }}
      >
        <div
          ref={pillRef}
          style={{
            position: "absolute",
            transform: "translate(-50%, -50%)",
            opacity: over ? 1 : 0,
            transition: "opacity 0.18s ease",
            pointerEvents: "none",
            mixBlendMode: "difference",
            background: "#f6f6f6",
            padding: "21px 34px",
            borderRadius: 2,
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ color: "#ffffff", mixBlendMode: "exclusion", fontFamily: "'Geist:Regular', Geist, sans-serif", fontWeight: 400, fontSize: 20, letterSpacing: "-0.6px", lineHeight: 0.78 }}>
            View Case
          </span>
        </div>
      </button>
    </div>
  );
}

// ── Bottom-center nav labels ─────────────────────────────────────────────────
function NavItem({ name, isActive, onClick }: { name: string; isActive: boolean; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <span
      role="button"
      aria-current={isActive ? "true" : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      style={{ display: "block", ...NAV_FONT, textAlign: "center", color: "#ffffff", mixBlendMode: "exclusion", opacity: isActive || hovered ? 1 : 0.5, transition: "opacity 0.3s ease", whiteSpace: "nowrap", cursor: "pointer", pointerEvents: "auto", willChange: "opacity" }}
    >
      {name}
    </span>
  );
}

// ── Top filter tabs ──────────────────────────────────────────────────────────
function FilterTabs({ active, onPick }: { active: string; onPick: (f: string) => void }) {
  return (
    <div className="pointer-events-auto absolute left-1/2 z-50 flex -translate-x-1/2 items-center gap-[6px]" style={{ top: 24 }}>
      {FILTERS.map((f) => {
        const on = f === active;
        return (
          <button
            key={f}
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); onPick(f); }}
            style={{
              fontFamily: "'Geist:Medium', Geist, sans-serif",
              fontSize: 14,
              letterSpacing: "-0.03em",
              lineHeight: 0.78,
              color: on ? "#fff" : "#b0b0b0",
              background: on ? "#19272d" : "transparent",
              padding: "8px 10px",
              borderRadius: 2,
              border: "none",
              cursor: "pointer",
              backdropFilter: "blur(26px)",
              WebkitBackdropFilter: "blur(26px)",
              whiteSpace: "nowrap",
            }}
          >
            {f}
          </button>
        );
      })}
    </div>
  );
}

type Tile = { baseY: number; h: number; projectIndex: number };

export default function Cases() {
  const projects = PROJECTS;
  const itemCount = projects.length;
  const [arW, arH] = ASPECT;

  const rootRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const tileElsRef = useRef<(HTMLDivElement | null)[]>([]);
  const tileVisualElsRef = useRef<(HTMLDivElement | null)[]>([]);
  const tilesRef = useRef<Tile[]>([]);

  const totalHRef = useRef(0);
  const winHRef = useRef(0);
  const rowHRef = useRef(1);
  const cardHRef = useRef(0);

  const scrollRef = useRef({ current: 0, target: 0 });
  const dragRef = useRef({ active: false, start: 0, startScroll: 0, last: 0, lastTime: 0, velocity: 0 });
  const idleRef = useRef({ frames: 0, snapped: false });

  const [tiles, setTiles] = useState<Tile[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeTileIndex, setActiveTileIndex] = useState(0);
  const [filter, setFilter] = useState<string>("All");
  const activeRef = useRef(0);
  const activeTileRef = useRef(0);

  // ── Build the virtual tape ─────────────────────────────────────────────────
  const build = useCallback(() => {
    const root = rootRef.current;
    const cards = cardsRef.current;
    if (!root || !cards || !itemCount) return;
    const rootRect = root.getBoundingClientRect();
    const winH = Math.max(1, rootRect.width); // horizontal → scroll axis is X
    const cardW = Math.max(1, cards.getBoundingClientRect().height); // cross axis
    winHRef.current = winH;
    const cardH = cardW * (arH / arW); // scroll-axis length of a card
    const rowH = ADJACENT_SCALE * cardH + GAP - (ACTIVE_SCALE - 1) * cardH / 2;
    rowHRef.current = rowH;
    cardHRef.current = cardH;
    const tilesNeeded = Math.max(itemCount, Math.ceil((winH + cardH) / rowH) + 2);
    const count = Math.ceil(tilesNeeded / itemCount) * itemCount;
    totalHRef.current = count * rowH;
    scrollRef.current = { current: winH / 2 - cardH / 2, target: winH / 2 - cardH / 2 };
    const newTiles: Tile[] = Array.from({ length: count }, (_, i) => ({ baseY: i * rowH, h: cardH, projectIndex: i % itemCount }));
    tilesRef.current = newTiles;
    startTransition(() => setTiles(newTiles));
  }, [itemCount, arW, arH]);

  // ── Render loop ──────────────────────────────────────────────────────────
  const render = useCallback(() => {
    const winH = winHRef.current;
    if (!winH) { rafRef.current = requestAnimationFrame(render); return; }
    const s = scrollRef.current;
    const tiles = tilesRef.current;
    const n = tiles.length;
    const mid = winH / 2;
    const ease = clamp(SCROLL_EASE, 0.02, 0.25);
    s.current += (s.target - s.current) * ease;
    if (!n) { rafRef.current = requestAnimationFrame(render); return; }

    const rowH = rowHRef.current;
    const totalH = totalHRef.current;
    const cardH = cardHRef.current;
    const push = (ACTIVE_SCALE - ADJACENT_SCALE) * cardH / 2;

    let newActive = 0, newActiveTile = 0, minDist = Infinity, closestDelta = 0;
    for (let i = 0; i < n; i++) {
      const tile = tiles[i];
      const tileEl = tileElsRef.current[i];
      const visualEl = tileVisualElsRef.current[i];
      if (!tileEl || !visualEl) continue;
      const tapeY = tile.baseY + s.current;
      const posY0 = tapeY + Math.round((mid - tapeY - cardH / 2) / totalH) * totalH;
      const relD = (posY0 + cardH / 2 - mid) / rowH;
      const posY = posY0 + clamp(relD, -1, 1) * push;
      const dist = Math.abs(posY + cardH / 2 - mid);
      const tNorm = dist / rowH;
      const scale = Math.max(ADJACENT_SCALE, ACTIVE_SCALE - tNorm * (ACTIVE_SCALE - ADJACENT_SCALE));
      tileEl.style.zIndex = String(Math.round(scale * 100));
      tileEl.style.transform = `translate3d(${posY}px, 0, 0)`;
      visualEl.style.transform = `scale(${scale})`;
      visualEl.style.transformOrigin = "center center";
      if (dist < minDist) { minDist = dist; newActive = tile.projectIndex; newActiveTile = i; closestDelta = posY + cardH / 2 - mid; }
    }

    if (newActive !== activeRef.current) { activeRef.current = newActive; startTransition(() => setActiveIndex(newActive)); }
    if (newActiveTile !== activeTileRef.current) { activeTileRef.current = newActiveTile; startTransition(() => setActiveTileIndex(newActiveTile)); }

    if (!dragRef.current.active) {
      if (Math.abs(s.target - s.current) < 2) idleRef.current.frames++;
      else { idleRef.current.frames = 0; idleRef.current.snapped = false; }
      if (idleRef.current.frames > 10 && !idleRef.current.snapped && Math.abs(closestDelta) > 1) {
        s.target -= closestDelta;
        idleRef.current.snapped = true;
        idleRef.current.frames = 0;
      }
    }
    rafRef.current = requestAnimationFrame(render);
  }, []);

  // ── Lifecycle: build + loop + resize ───────────────────────────────────────
  useEffect(() => {
    build();
    rafRef.current = requestAnimationFrame(render);
    let t: number | undefined;
    const onResize = () => {
      window.clearTimeout(t);
      t = window.setTimeout(() => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        build();
        rafRef.current = requestAnimationFrame(render);
      }, 300);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.clearTimeout(t);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [build, render]);

  // ── Pointer drag with momentum ─────────────────────────────────────────────
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const onDown = (e: PointerEvent) => {
      e.preventDefault();
      root.setPointerCapture(e.pointerId);
      dragRef.current = { active: true, start: e.clientX, startScroll: scrollRef.current.target, last: e.clientX, lastTime: performance.now(), velocity: 0 };
      idleRef.current = { frames: 0, snapped: false };
      root.style.cursor = "grabbing";
    };
    const onUp = (e: PointerEvent) => {
      const d = dragRef.current;
      if (d.active) {
        const momentum = d.velocity * 8;
        if (Math.abs(momentum) > 5) scrollRef.current.target += momentum;
      }
      d.active = false;
      d.velocity = 0;
      root.style.cursor = "grab";
      try { root.releasePointerCapture(e.pointerId); } catch { /* noop */ }
    };
    const onMove = (e: PointerEvent) => {
      const d = dragRef.current;
      if (!d.active) return;
      const now = performance.now();
      const dt = now - d.lastTime;
      const dx = e.clientX - d.last;
      if (dt > 0) d.velocity = d.velocity * 0.7 + (dx / dt) * 16 * 0.3;
      d.last = e.clientX;
      d.lastTime = now;
      scrollRef.current.target = d.startScroll + (e.clientX - d.start);
    };
    root.addEventListener("pointerdown", onDown, { passive: false });
    root.addEventListener("pointerup", onUp, { passive: true });
    root.addEventListener("pointercancel", onUp, { passive: true });
    root.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      root.removeEventListener("pointerdown", onDown);
      root.removeEventListener("pointerup", onUp);
      root.removeEventListener("pointercancel", onUp);
      root.removeEventListener("pointermove", onMove);
    };
  }, []);

  // ── Keyboard navigation ────────────────────────────────────────────────────
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    root.setAttribute("tabindex", "0");
    root.style.outline = "none";
    const onKey = (e: KeyboardEvent) => {
      const rowH = rowHRef.current;
      if (!rowH) return;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); scrollRef.current.target -= rowH; idleRef.current = { frames: 0, snapped: false }; }
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); scrollRef.current.target += rowH; idleRef.current = { frames: 0, snapped: false }; }
    };
    root.addEventListener("keydown", onKey);
    return () => root.removeEventListener("keydown", onKey);
  }, []);

  // ── Navigation helpers ───────────────────────────────────────────────────
  const goNext = useCallback(() => {
    const rowH = rowHRef.current;
    if (!rowH) return;
    scrollRef.current.target -= rowH;
    idleRef.current = { frames: 0, snapped: false };
  }, []);
  const goPrev = useCallback(() => {
    const rowH = rowHRef.current;
    if (!rowH) return;
    scrollRef.current.target += rowH;
    idleRef.current = { frames: 0, snapped: false };
  }, []);

  const handleNavClick = useCallback((index: number) => {
    const cardH = cardHRef.current;
    const winH = winHRef.current;
    const totalH = totalHRef.current;
    const s = scrollRef.current;
    const mid = winH / 2;
    let bestDelta = 0, bestDist = Infinity;
    for (const tile of tilesRef.current) {
      if (tile.projectIndex !== index) continue;
      const tapeY = tile.baseY + s.current;
      const posY = tapeY + Math.round((mid - tapeY - cardH / 2) / totalH) * totalH;
      const dist = Math.abs(posY + cardH / 2 - mid);
      if (dist < bestDist) { bestDist = dist; bestDelta = posY + cardH / 2 - mid; }
    }
    s.target -= bestDelta;
    idleRef.current = { frames: 0, snapped: false };
  }, []);

  return (
    <section className="relative w-full overflow-hidden" style={{ height: "100dvh", background: SECTION_BG }}>
      <style>{SHIMMER_CSS}</style>

      {/* Top filter tabs */}
      <FilterTabs active={filter} onPick={setFilter} />

      {/* Showcase root */}
      <div
        ref={rootRef}
        role="list"
        aria-label="Project showcase"
        style={{ position: "absolute", inset: 0, overflow: "hidden", touchAction: "pan-y", userSelect: "none", cursor: "grab" }}
      >
        {/* Card row — full width, vertically centered */}
        <div ref={cardsRef} style={{ position: "absolute", left: 0, width: "100%", height: `${CARD_WIDTH}%`, top: `${(100 - CARD_WIDTH) / 2}%` }}>
          {tiles.map((tile, i) => {
            const pi = tile.projectIndex;
            const isActiveCard = i === activeTileIndex;
            return (
              <div
                key={i}
                role="listitem"
                aria-label={projects[pi]?.name ?? `Item ${pi + 1}`}
                ref={(el) => { tileElsRef.current[i] = el; }}
                onClickCapture={(e) => {
                  if (isActiveCard) return;
                  e.preventDefault();
                  e.stopPropagation();
                  const rootRect = rootRef.current?.getBoundingClientRect();
                  const cardRect = e.currentTarget.getBoundingClientRect();
                  if (!rootRect) { i < activeTileRef.current ? goPrev() : goNext(); return; }
                  const rootCenter = rootRect.left + rootRect.width / 2;
                  const cardCenter = cardRect.left + cardRect.width / 2;
                  cardCenter < rootCenter ? goPrev() : goNext();
                }}
                style={{ position: "absolute", left: 0, top: 0, width: tile.h, height: "100%", willChange: "transform", transform: "translateZ(0)", backfaceVisibility: "hidden", pointerEvents: "auto", overflow: "visible", cursor: "ew-resize" }}
              >
                <CardVisual project={projects[pi]} visualRef={(el) => { tileVisualElsRef.current[i] = el; }} />
                {isActiveCard && <CursorZone onLeft={goPrev} onRight={goNext} onView={() => { /* TODO: open the case */ }} />}
              </div>
            );
          })}
        </div>

        {/* Bottom-center nav labels */}
        <div className="pointer-events-none absolute z-50 flex flex-row items-center" style={{ bottom: NAV_OFFSET_Y, left: "50%", transform: "translateX(-50%)", gap: NAV_GAP }}>
          {projects.map((p, i) => (
            <NavItem key={p.name + i} name={p.name} isActive={i === activeIndex} onClick={() => handleNavClick(i)} />
          ))}
        </div>
      </div>
    </section>
  );
}
