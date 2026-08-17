import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { WORK } from "../../content/work";
import { useMetaRota } from "../../hooks/useMetaRota";
import { Prancha } from "./sistema";

/**
 * HOME — PARTIDO B: "A PROJEÇÃO".
 *
 * Uma peça por vez, em tela cheia, trocando sozinha. A home não é índice nem
 * mosaico: é uma SESSÃO — o trabalho passa, e quem quiser parar clica.
 *
 * A tese: um portfólio com nove projetos não precisa mostrar nove de uma vez;
 * precisa que o primeiro segure. Em tela cheia, cada peça tem a escala que teve
 * no projeto real, e o índice fica embaixo como legenda de sessão.
 *
 * ⚠ Troca por TEMPO, não por scroll: a home aqui é uma tela só, e prender o
 * scroll para animar (o recurso óbvio) tira do visitante a única coisa que ele
 * controla. 4,2s por peça — abaixo de 3s vira anúncio, acima de 6s vira espera.
 * O clique nos índices assume o controle e para o relógio.
 */
export default function HomeB() {
  useMetaRota();
  const [i, setI] = useState(0);
  const [preso, setPreso] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (preso) return;
    timer.current = window.setInterval(() => setI((x) => (x + 1) % WORK.length), 4200);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [preso]);

  const atual = WORK[i];

  return (
    <Prancha n="01" nome="Index" superficie="tinta" status="Available for projects">
      <section className="relative flex min-h-[calc(100svh-11rem)] flex-col justify-between pt-8">
        {/* a peça, cheia */}
        <div className="relative flex-1 overflow-hidden">
          {WORK.map((w, k) => (
            <img
              key={w.slug}
              src={w.cover.src}
              srcSet={w.cover.src2x ? `${w.cover.src} 1400w, ${w.cover.src2x} 2200w` : undefined}
              sizes="100vw"
              alt={w.cover.alt}
              width={w.cover.w}
              height={w.cover.h}
              loading={k > 1 ? "lazy" : undefined}
              decoding="async"
              draggable={false}
              className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
              style={{ opacity: i === k ? 1 : 0 }}
            />
          ))}
        </div>

        {/* a legenda da sessão: o índice inteiro, com a peça atual acesa */}
        <div className="flex items-end justify-between gap-6 pt-6 max-md:flex-col max-md:items-start">
          <p className="p-item">
            {atual.title}
            <span className="p-marca pl-3" style={{ color: "var(--p-quieto)" }}>
              {atual.disciplines.join(", ")} — {atual.year}
            </span>
          </p>

          <nav
            className="flex flex-wrap gap-x-4 gap-y-1"
            onMouseEnter={() => setPreso(true)}
            onMouseLeave={() => setPreso(false)}
          >
            {WORK.map((w, k) => (
              <Link
                key={w.slug}
                to={`/work/${w.slug}`}
                onMouseEnter={() => setI(k)}
                onFocus={() => setI(k)}
                className="p-marca"
                style={{ color: i === k ? "var(--p-acento)" : "var(--p-quieto)" }}
              >
                {String(k + 1).padStart(2, "0")}
              </Link>
            ))}
          </nav>
        </div>
      </section>
    </Prancha>
  );
}
