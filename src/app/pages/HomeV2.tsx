import Intro from "../sections/Intro";
import Hero from "../sections/Hero";
import About from "../sections/About";
import Work from "../sections/Work";
import Capabilities from "../sections/Capabilities";
import Pricing from "../sections/Pricing";
import Footer from "../sections/Footer";

/**
 * V2 — a home autoral, viva em `/v2`.
 *
 * `/` é a réplica do Framer; esta é a alternativa de direção própria, a que se
 * construiu ao longo de sete versões. Não foi descartada quando o projeto
 * virou réplica: continua montável e visitável. As seções que ela usa
 * (`sections/Intro`, `Hero`, `About`, `Work`, `Capabilities`, `Pricing`,
 * `Footer`) seguem intactas no disco.
 *
 * ⚠ Não confundir com a "Home V2" do antigo laboratório (`/lab/home-v2`), que
 * era uma das sete tentativas. Aquele lab foi apagado; este `v2` é o nome da
 * ALTERNATIVA que sobrou, não do segundo experimento.
 *
 * O comentário original está preservado abaixo — descreve o partido dela.
 *
 * ---
 *
 * Home — exatamente o que já estava aprovado, agora como rota.
 *
 * O ritmo é o das referências (TITARVL / WIDE ANGLE® / All In®): blocos de
 * sangria a sangria, sem meio-tom. O papel domina e a tinta marca as viradas.
 *   Hero              papel
 *   About             TINTA   — o momento cromático da página
 *   Work              papel   — índice do trabalho
 *   Capabilities      tinta   ┐
 *   Pricing · Contact tinta   ┘ o fecho é um bloco escuro contínuo
 *
 * **Havia um carrossel de artes entre a About e o Work, e ele saiu.** A faixa
 * mostrava as peças em movimento e logo abaixo o Selected Work mostrava as
 * MESMAS peças — o visitante via o portfólio duas vezes em dois formatos, e a
 * segunda vez tirava o impacto da primeira. Impacto na About passou a vir da
 * virada de cor, não de imagem repetida.
 *
 * A barra de metadados (`sections/Menu`) vive DENTRO do Hero nesta página, e é
 * por isso que o Layout não a repete aqui: ela participa do flex do hero e
 * movê-la para fora mudaria uma composição já aprovada. Nas rotas internas o
 * Layout monta a barra por conta própria.
 */
export default function HomeV2() {
  return (
    <>
      <Intro />
      <Hero />
      <About />
      <Work />
      <Capabilities />
      <Pricing />
      <Footer />
    </>
  );
}
