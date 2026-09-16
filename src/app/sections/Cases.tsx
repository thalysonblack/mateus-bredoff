import { useCallback, useEffect, useRef, useState, startTransition } from "react";

/**
 * Cases — o carrossel HORIZONTAL do Framer original dele ("CasesScroll / Cases
 * Showcase"), reconstruído: fita virtual infinita, um card ativo centrado
 * (escala 1) com os vizinhos caindo a 0,745, lerp + snap, drag com inércia,
 * setas nas bordas, cursor "View Case" no centro, nav de nomes embaixo.
 *
 * 16/09: deixou de ser órfão. Virou o modo CARDS da /work ("vamos poder ver em
 * lista ou como esse [/cases], só que scroll lateral"): recebe os projetos por
 * prop, a RODA DO MOUSE anda a fita (deltaY e deltaX), os filtros filtram de
 * verdade e o card abre o case. Cor e tipo vêm dos tokens da prancha.
 */

export type CaseCard = {
  slug: string;
  name: string;
  image: string;
  srcSet?: string;
  tags: string[];
};

type Project = CaseCard;

// ── DEFAULTS (projects/horizontal) ───────────────────────────────────────────
// Figma: active card 1103×728 (≈1.51:1 landscape); neighbours 851×542 → 0.745 of
// the active height. The engine scales a uniform card by these factors.
const ASPECT = [2, 3] as const; // landscape card (width ≈ 1.5 × height)
const GAP = 16;
const SCROLL_EASE = 0.1;
const ACTIVE_SCALE = 1;
const ADJACENT_SCALE = 0.745;
const CARD_RADIUS = 4;
const CARD_CROSS_PCT = 74; // % of root height used by the card row (cross axis)
// Ceiling on the card's scroll-axis length, as a fraction of the viewport width.
// Keeps the active card (and its label) fully on screen in portrait.
const MAX_CARD_VIEWPORT_FRACTION = 0.92;


// Bottom nav — Figma: Geist Regular 20px, gap 19, tracking -0.6px, leading 0.78.
// The Figma spec paints it #fff with mix-blend-exclusion, which only inverts if the
// blend can reach the section background. It can't: the nav's wrapper carries
// translateX(-50%), and a transform creates a stacking context that isolates the
// blend — so the labels rendered as #f7f7f7 on #f6f6f6 (measured 1.01:1, invisible).
// The nav sits over the light section, so it is painted dark outright, at AA.
const NAV_COLOR_ACTIVE = "var(--p-ink)";
const NAV_COLOR_IDLE = "var(--p-quieto)";
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

const SHIMMER_CSS = `@keyframes cases-shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
`;

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
        background: "var(--p-fio)",
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
        srcSet={project.srcSet}
        sizes="(max-width: 900px) 90vw, 111vh"
        alt={project.name}
        draggable={false}
        decoding="async"
        onLoad={() => startTransition(() => setLoaded(true))}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
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
    // O nome era branco em `difference`: sobre a capa vermelha da Ginga virava
    // CIANO (16/09). Agora é branco sólido com sombra difusa — lê em capa escura
    // e em capa clara sem mudar de cor.
    <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between" style={{ padding: 12 }}>
      {/* Project name */}
      <p
        style={{ margin: 0, fontFamily: "'Geist', ui-sans-serif, sans-serif", fontWeight: 500, fontSize: 20, lineHeight: 1.25, letterSpacing: "-0.02em", color: "#ffffff", textShadow: "0 1px 14px rgba(0,0,0,0.45)", whiteSpace: "nowrap" }}
      >
        {project.name}
      </p>

      {/* Category tags */}
      <div className="flex items-center" style={{ gap: 11 }}>
        {project.tags.map((t) => (
          <span
            key={t}
            // The 15% scrim of the Figma spec only holds up over dark artwork; on the
            // light cards white-on-chip fell to 1.4:1. Denser scrim, same glass look.
            style={{ background: "rgba(0,0,0,0.54)", backdropFilter: "blur(11.75px)", WebkitBackdropFilter: "blur(11.75px)", color: "#ffffff", fontFamily: "'Geist', ui-sans-serif, sans-serif", fontWeight: 500, fontSize: 12, lineHeight: 1.25, padding: "4.653px 8.143px", borderRadius: 3, whiteSpace: "nowrap" }}
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
      style={{ display: "block", ...NAV_FONT, textAlign: "center", color: isActive || hovered ? NAV_COLOR_ACTIVE : NAV_COLOR_IDLE, transition: "color 0.3s ease", whiteSpace: "nowrap", cursor: "pointer", pointerEvents: "auto" }}
    >
      {name}
    </span>
  );
}

// ── Top filter tabs ──────────────────────────────────────────────────────────
export default function Cases({ projects, onView }: { projects: CaseCard[]; onView: (p: CaseCard) => void }) {
  /* o filtro é de quem chama (a /work): aqui só chega a lista já filtrada;
     a chave dos tiles muda com ela para o DOM e os refs nascerem de novo */
  const chave = projects.map((p) => p.slug).join("|");
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
  const activeRef = useRef(0);
  const activeTileRef = useRef(0);

  // ── Build the virtual tape ─────────────────────────────────────────────────
  const build = useCallback(() => {
    const root = rootRef.current;
    const cards = cardsRef.current;
    if (!root || !cards || !itemCount) return;
    const rootRect = root.getBoundingClientRect();
    const winH = Math.max(1, rootRect.width); // horizontal → scroll axis is X
    winHRef.current = winH;

    // The card is sized off the cross axis (height). On a landscape viewport that
    // lands well, but on a portrait phone a 74%-of-height card is ~2.4× wider than
    // the screen — it bleeds out and takes its name/tags label with it. So the
    // cross axis is also capped by what the scroll axis can actually show.
    let cardW = Math.max(1, rootRect.height * (CARD_CROSS_PCT / 100)); // cross axis
    let cardH = cardW * (arH / arW); // scroll-axis length of a card
    const maxCardH = winH * MAX_CARD_VIEWPORT_FRACTION;
    if (cardH > maxCardH) {
      cardH = maxCardH;
      cardW = cardH * (arW / arH);
    }
    cards.style.height = `${cardW}px`;
    cards.style.top = `${(rootRect.height - cardW) / 2}px`;
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
  }, [itemCount, arW, arH, chave]);

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
      /* ⚠ o clique nas zonas do card ativo (setas e "View Case") não inicia
         arrasto: com `setPointerCapture` o pointerup vira do root e o `click`
         nunca chega ao botão — era por isso que "View Case" não abria nada */
      if ((e.target as Element | null)?.closest?.("button")) return;
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

  // ── Roda do mouse: "scroll lateral" — deltaY e deltaX andam a fita ─────────
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const onWheel = (e: WheelEvent) => {
      const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      scrollRef.current.target -= d * 0.8;
      idleRef.current = { frames: 0, snapped: false };
    };
    root.addEventListener("wheel", onWheel, { passive: true });
    return () => root.removeEventListener("wheel", onWheel);
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
    <section className="relative h-full min-h-0 w-full flex-1 overflow-hidden">
      <style>{SHIMMER_CSS}</style>

      {/* Showcase root */}
      <div
        ref={rootRef}
        role="list"
        aria-label="Project showcase"
        style={{ position: "absolute", inset: 0, overflow: "hidden", touchAction: "pan-y", userSelect: "none", cursor: "grab" }}
      >
        {/* Card row — full width, vertically centered */}
        {/* height/top are set by build() — it caps the card so it fits portrait too. */}
        <div ref={cardsRef} style={{ position: "absolute", left: 0, width: "100%", height: `${CARD_CROSS_PCT}%`, top: `${(100 - CARD_CROSS_PCT) / 2}%` }}>
          {tiles.map((tile, i) => {
            const pi = tile.projectIndex;
            /* entre a troca de filtro e o rebuild, os tiles velhos apontam para
               índices que a lista nova não tem — um frame sem eles, sem quebrar */
            if (!projects[pi]) return null;
            const isActiveCard = i === activeTileIndex;
            return (
              <div
                key={`${chave}-${i}`}
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
                {isActiveCard && <CursorZone onLeft={goPrev} onRight={goNext} onView={() => onView(projects[pi])} />}
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
