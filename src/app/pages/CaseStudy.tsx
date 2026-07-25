import { useEffect } from "react";
import { useParams, Link } from "react-router";
import { Mono, Rule, Bracket, SectionHead } from "../system";
import { useReveal } from "../../hooks/useReveal";
import { findWork, WORK } from "../../content/work";
import Footer from "../sections/Footer";

/**
 * Página de case — UMA página para todos os cases.
 *
 * Não existe um componente por projeto: esta rota resolve o slug contra a
 * coleção em `content/work.ts` e renderiza o item. Seis páginas quase iguais
 * divergem no primeiro ajuste; esta não tem como divergir.
 *
 * O corpo de texto só aparece quando existe. Quatro dos seis cases do material
 * do cliente estão com lorem ipsum no ar — em vez de portar enchimento, a página
 * mostra o trabalho (capa, imagens, metadados reais) e omite a seção de texto.
 * Ver `contentPending` em content/work.ts.
 */
export default function CaseStudy() {
  const { slug } = useParams();
  const item = findWork(slug);
  const titleRef = useReveal<HTMLHeadingElement>({ immediate: true });

  /* Title por rota: sem isso toda página de case herda o título da home e o
     compartilhamento manda sempre o mesmo card. */
  useEffect(() => {
    if (!item) return;
    const previous = document.title;
    document.title = `${item.title} — Mateus Bredoff`;
    return () => {
      document.title = previous;
    };
  }, [item]);

  if (!item) {
    return (
      <section className="on-paper flex min-h-[70vh] w-full items-center">
        <div className="bleed">
          <Mono dim>Erro 404</Mono>
          <h1 className="t-display pt-4" style={{ fontSize: "clamp(2rem,7vw,110px)" }}>
            Case não encontrado
          </h1>
          <Link to="/work" className="link-quiet mt-8 inline-block">
            <Bracket>VER TODO O TRABALHO</Bracket>
          </Link>
        </div>
      </section>
    );
  }

  const others = WORK.filter((w) => w.slug !== item.slug).slice(0, 3);

  return (
    <>
      <article className="on-paper w-full">
        <div className="bleed pt-[clamp(2rem,5vw,4rem)]">
          <SectionHead left="Work" right={String(item.year)} />

          <h1
            ref={titleRef}
            data-reveal
            className="t-display t-display-xl pb-[clamp(2rem,5vw,4rem)]"
            style={{ fontSize: "clamp(2.25rem, 9vw, 176px)" }}
          >
            {item.title}
          </h1>

          {/* Ficha técnica: os mesmos campos que o CMS dele expõe */}
          <Rule />
          <dl className="grid grid-cols-1 gap-x-[clamp(1rem,3vw,3rem)] gap-y-[clamp(1.25rem,2.5vw,2rem)] py-[clamp(1.5rem,3vw,2.5rem)] md:grid-cols-3">
            <div>
              <dt className="pb-2">
                <Mono dim>Type</Mono>
              </dt>
              <dd>
                <Mono>{item.disciplines.join(" / ")}</Mono>
              </dd>
            </div>
            <div>
              <dt className="pb-2">
                <Mono dim>Year</Mono>
              </dt>
              <dd>
                <Mono>{item.year}</Mono>
              </dd>
            </div>
            {item.credits.length > 0 ? (
              <div>
                <dt className="pb-2">
                  <Mono dim>Credits</Mono>
                </dt>
                <dd className="flex flex-col gap-1">
                  {item.credits.map((c) => (
                    <Mono key={c.name}>
                      {c.name}
                      <span className="dim">{` — ${c.role}`}</span>
                    </Mono>
                  ))}
                </dd>
              </div>
            ) : null}
          </dl>
          <Rule />
        </div>

        {/* Capa em sangria: a proporção vem medida do arquivo, então a caixa já
            nasce certa e não há salto de layout quando a imagem decodifica. */}
        <figure className="w-full pt-[clamp(1.5rem,3vw,2.5rem)]">
          <div className="w-full overflow-hidden" style={{ aspectRatio: `${item.cover.w} / ${item.cover.h}` }}>
            <img
              src={item.cover.src}
              srcSet={item.cover.src2x ? `${item.cover.src} 1400w, ${item.cover.src2x} 2200w` : undefined}
              sizes="100vw"
              width={item.cover.w}
              height={item.cover.h}
              alt={item.cover.alt}
              className="h-full w-full object-cover"
              draggable={false}
            />
          </div>
        </figure>

        {item.about.length > 0 ? (
          <div className="bleed pt-[clamp(2.5rem,5vw,4.5rem)]">
            <SectionHead left="About" right="Statement" />
            <div className="about-flow pb-[clamp(2rem,4vw,3.5rem)]">
              {item.about.map((p, i) => (
                <p key={i} className="t-body">
                  {p}
                </p>
              ))}
            </div>
          </div>
        ) : (
          /* Sem texto: dizer isso com uma linha honesta é melhor que encher. */
          <div className="bleed pt-[clamp(2rem,4vw,3rem)]">
            <Rule />
            <div className="py-[clamp(1rem,2vw,1.5rem)]">
              <Mono dim>Case study in preparation</Mono>
            </div>
            <Rule />
          </div>
        )}

        {item.images.length > 0 ? (
          <div className="bleed flex flex-col gap-[clamp(1rem,2.5vw,2.5rem)] pt-[clamp(2rem,4vw,3.5rem)]">
            {item.images.map((im, i) => (
              <figure key={im.src} className="w-full">
                <div className="w-full overflow-hidden" style={{ aspectRatio: `${im.w} / ${im.h}` }}>
                  <img
                    src={im.src}
                    srcSet={im.src2x ? `${im.src} 1400w, ${im.src2x} 2200w` : undefined}
                    sizes="(min-width: 768px) 90vw, 100vw"
                    width={im.w}
                    height={im.h}
                    alt={im.alt}
                    loading={i < 2 ? "eager" : "lazy"}
                    decoding="async"
                    draggable={false}
                    className="h-full w-full object-cover"
                  />
                </div>
              </figure>
            ))}
          </div>
        ) : null}

        {item.behanceUrl ? (
          <div className="bleed pt-[clamp(2rem,4vw,3rem)]">
            <a href={item.behanceUrl} target="_blank" rel="noopener noreferrer" className="link-quiet">
              <Bracket>VER NO BEHANCE</Bracket>
            </a>
          </div>
        ) : null}

        {/* Próximos projetos — o mesmo "Other Projects" do CMS dele */}
        <div className="bleed pt-[clamp(3rem,6vw,6rem)]">
          <SectionHead left="Other Projects" right={<Link to="/work" className="link-quiet">View All</Link>} />
          <div className="grid grid-cols-1 gap-[clamp(1rem,2.5vw,2.5rem)] pb-[clamp(2rem,4vw,4rem)] md:grid-cols-3">
            {others.map((o) => (
              <Link key={o.slug} to={`/work/${o.slug}`} className="group block">
                <div className="w-full overflow-hidden" style={{ aspectRatio: `${o.cover.w} / ${o.cover.h}` }}>
                  <img
                    src={o.cover.src}
                    alt={o.cover.alt}
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                    className="h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  />
                </div>
                <div className="flex items-baseline justify-between gap-4 pt-2">
                  <Mono dim className="idx-acc">
                    {String(o.year)}
                  </Mono>
                  <Mono className="text-right">{o.title}</Mono>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </article>

      <Footer />
    </>
  );
}
