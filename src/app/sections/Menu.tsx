import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Mono, Rule, ease } from "../system";

/**
 * Barra de metadados — a assinatura mais forte das referências.
 *
 * Quatro campos rotulados numa grade: quem / o quê / onde falar / que horas são
 * onde ele está. O relógio ao vivo com o offset GMT é o detalhe que faz a página
 * parecer um instrumento em vez de um layout.
 *
 * Sem mix-blend-difference (a versão anterior usava). A barra vive sobre preto
 * sólido, então o branco resolve direto — e some junto a classe de bug que já
 * apagou texto duas vezes neste repo.
 */

const timeFmt = new Intl.DateTimeFormat("en-GB", {
  timeZone: "America/Sao_Paulo",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

function useBrazilClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return timeFmt.format(now);
}

const NAV = [
  { label: "Work", href: "#work" },
  { label: "Pricing", href: "#pricing" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

/** Uma coluna da barra: linha forte em cima, linha quieta embaixo. */
function Field({ top, bottom }: { top: React.ReactNode; bottom: React.ReactNode }) {
  return (
    <div>
      <Mono as="div">{top}</Mono>
      <Mono as="div" dim>
        {bottom}
      </Mono>
    </div>
  );
}

export default function Menu() {
  const time = useBrazilClock();

  return (
    <motion.header
      className="relative z-20 w-full bleed pt-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease, delay: 0.2 }}
    >
      <div className="grid grid-cols-2 gap-x-6 gap-y-3 pb-3 md:grid-cols-4">
        <Field
          top={
            <a href="/" className="link-rule">
              Mateus Bredoff©
            </a>
          }
          bottom={
            <span className="whitespace-nowrap">
              {NAV.map((n, i) => (
                <span key={n.label}>
                  {i > 0 ? <span aria-hidden="true"> / </span> : null}
                  <a href={n.href} className="link-quiet">
                    {n.label}
                  </a>
                </span>
              ))}
            </span>
          }
        />

        <Field top="Brand Designer" bottom="Visual Identity Practice" />

        <Field
          top={
            <a href="mailto:hello@mateusbredoff.com" className="link-rule">
              hello@mateusbredoff.com
            </a>
          }
          bottom={
            <a
              href="https://www.instagram.com/sir.bredoff"
              target="_blank"
              rel="noopener noreferrer"
              className="link-quiet"
            >
              Instagram
            </a>
          }
        />

        {/* Relógio: a única coisa da página que se move sozinha. */}
        <div className="text-left md:text-right">
          <Mono as="div" className="tabular-nums">
            {time}
          </Mono>
          <Mono as="div" dim>
            Brazil — GMT&minus;3
          </Mono>
        </div>
      </div>
      <Rule />
    </motion.header>
  );
}
