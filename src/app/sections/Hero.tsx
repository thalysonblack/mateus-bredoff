import { Mono } from "../system";
import Menu from "./Menu";
import portrait1600 from "../../assets/optimized/hero-portrait-1600.webp";
import portrait3200 from "../../assets/optimized/hero-portrait-3200.webp";

/**
 * Hero — o retrato COMO ambiente da página.
 *
 * Vem do site publicado dele: o retrato preenche a tela e o nome fica ancorado
 * nos dois cantos de baixo. Substituiu a versão em que o retrato era uma chapa
 * 3:4 ao lado do nome — aprovada em 26/07 comparando com a variação do lab.
 *
 * ⚠ A DESCOBERTA QUE FAZ ESTA SEÇÃO FUNCIONAR: o arquivo do retrato **já é** um
 * gradiente petróleo. Amostrado no próprio pixel, o fundo dele vai de #18373f no
 * topo a #eceded na base — quase exatamente o degradê que eu havia recriado por
 * baixo. A primeira tentativa empilhou um gradiente inventado atrás de uma foto
 * COM fundo opaco, e o resultado foi um retângulo visível contra o fundo da
 * seção, além do nome desaparecendo atrás da imagem.
 *
 * Agora: o `background` da seção usa as cores REAIS medidas na foto, para
 * qualquer área que sobre casar sem emenda; a foto entra em `cover` (ela é
 * 1600×850, então o recorte come só as laterais, que são fundo puro); e o nome
 * vai POR CIMA da imagem, não atrás.
 *
 * ⚠ Sem `mix-blend` em nenhuma camada. Neste repo o blend já apagou texto duas
 * vezes ao cair dentro de stacking context, e aqui há gradiente e transform por
 * perto — terreno exato da armadilha.
 *
 * ⚠ CONTRASTE. O nome fica na base, onde o fundo da foto já chegou ao claro
 * (#eceded): texto em #19272d mede 11,9:1 ali. É a única parte do sistema em que
 * o fundo do texto não é constante — se mexer no enquadramento ou nas paradas,
 * remeça.
 */
export default function Hero() {
  return (
    <section
      className="relative flex h-[100dvh] min-h-[36rem] w-full flex-col overflow-clip"
      style={{
        /* cores amostradas no arquivo do retrato, não escolhidas a olho */
        background: "linear-gradient(180deg, #18373f 0%, #486067 25%, #8d9ca1 50%, #d4d8da 85%, #eceded 100%)",
      }}
    >
      {/* A barra vive sobre o topo escuro do gradiente, então usa o par da tinta */}
      <div className="on-ink relative z-30" style={{ background: "transparent" }}>
        <Menu />
      </div>

      {/* Retrato preenchendo a tela — o fundo dele É o ambiente */}
      <img
        src={portrait1600}
        srcSet={`${portrait1600} 1600w, ${portrait3200} 3200w`}
        sizes="100vw"
        alt="Mateus Bredoff"
        width={1600}
        height={850}
        draggable={false}
        /* SEM z-index: o nome mescla com esta imagem por `mix-blend-exclusion`,
           e blend só enxerga o que está no MESMO stacking context. Um z-index
           aqui isolaria a foto e o nome pintaria chapado. O empilhamento vem
           da ordem do DOM — a imagem é declarada antes do nome, logo fica
           atrás dele. */
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: "center 22%" }}
      />

      {/* Marcas de registro — gabarito de impressão, não decoração (ref REBOOT) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-20">
        <span className="absolute left-[var(--gutter)] top-[34%] flex flex-col gap-[6px] opacity-70">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="block h-px w-4" style={{ background: "#eceded" }} />
          ))}
        </span>
        <span className="absolute right-[var(--gutter)] top-[16%]" style={{ color: "#eceded" }}>
          <Mono>+</Mono>
        </span>
        <span className="absolute bottom-[6%] left-[var(--gutter)]" style={{ color: "#19272d" }}>
          <Mono>+</Mono>
        </span>
      </div>

      {/* O nome POR CIMA da foto, nos dois cantos de baixo: quem ele é à
          esquerda, o que faz à direita. Ancorado onde o fundo já é claro. */}
      {/* Sem `z-index` neste invólucro: ele viria com `position` e criaria
          stacking context, aprisionando o blend dos filhos. A ordem do DOM já
          põe o nome acima da foto. O blend vai em CADA bloco, não aqui —
          invólucro com blend mesclaria o conjunto como uma camada só. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-[clamp(1rem,4vw,4rem)] px-[var(--gutter)] pb-[clamp(1rem,3vh,2.5rem)]">
        <h1
          className="t-display t-display-xl"
          style={{
            fontSize: "clamp(2.25rem,6.6vw,108px)",
            /* `exclusion` com branco: inverte contra a foto e devolve escuro
               onde o fundo é claro, prata onde a camisa escurece. É o modo do
               site publicado — `difference` inverte com contraste total e
               endurece o meio-tom. */
            color: "#fff",
            mixBlendMode: "exclusion",
          }}
        >
          Mateus
          <br />
          Bredoff
        </h1>
        <p
          className="t-display t-display-xl text-right"
          style={{
            fontSize: "clamp(2.25rem,6.6vw,108px)",
            color: "#fff",
            mixBlendMode: "exclusion",
          }}
        >
          Brand
          <br />
          Designer
        </p>
      </div>
    </section>
  );
}
