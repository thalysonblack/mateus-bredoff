/**
 * Coleção de trabalho — a fonte ÚNICA dos cases.
 *
 * No Framer, `/work` é uma coleção de CMS e cada case é um item; aqui é este
 * arquivo. Home, índice `/work` e página `/work/:slug` leem todos daqui, então
 * não existe a possibilidade de o índice e a página discordarem.
 *
 * **Adicionar um case custa uma entrada neste array** — nenhum arquivo novo,
 * nenhuma rota nova. Foi por isso que não se fez um componente de página por
 * case: seis páginas quase iguais divergem no primeiro ajuste.
 *
 * O schema abaixo não foi inventado: são os rótulos que o CMS dele expõe em
 * toda página de item — About, Type, Year, Credits. Se um dia virar Sanity ou
 * Payload, estes campos viram o schema da coleção e a migração é mecânica.
 *
 * ⚠ CADA IMAGEM CARREGA SUA DIMENSÃO MEDIDA (`w`/`h`, lidas do arquivo com
 * `sips`, não estimadas). É o que permite reservar a caixa na proporção nativa
 * antes de a imagem carregar — sem layout shift e sem nada esticado. Se entrar
 * arte nova, MEÇA; não chute o par.
 */

export type WorkImage = {
  /** srcset por largura: 1400/2200 quando a origem permite, nativa quando é menor. */
  src: string;
  src2x?: string;
  w: number;
  h: number;
  alt: string;
  /**
   * Peça em MEIA largura na pilha do case, em vez de sangrar.
   *
   * Não é enfeite: o layout varia por item no CMS dele, e a medição provou.
   * Em `/work/stag` a peça de índice 1 sai sozinha em 788,6px na coluna da
   * direita; em `/work/alex-archer` as de índice 3 e 4 saem lado a lado, uma em
   * cada coluna. Nenhuma regra de posição (`i % 4`) reproduz os dois — é escolha
   * editorial por peça. Enquanto o campo não vier preenchido, `CaseStudy` cai na
   * cadência do template mais comum e o resultado é aproximado, não medido.
   */
  meia?: boolean;
};

export type WorkItem = {
  slug: string;
  title: string;
  /** Ano. Ausente = o material do cliente não informa (o Figma de 15/10/2026 não tem ano em nenhum case). */
  year?: number;
  /** "Type" no CMS dele. */
  disciplines: string[];
  credits: { name: string; role: string }[];
  /** "About": parágrafos do corpo. Vazio = texto ainda não escrito (ver `contentPending`). */
  about: string[];
  cover: WorkImage;
  images: WorkImage[];
  behanceUrl?: string;
  /**
   * O texto deste case não existe ainda no material do cliente.
   *
   * No Framer publicado, quatro dos seis cases estão com LOREM IPSUM visível e
   * um está totalmente vazio — só o Alex Archer tem texto escrito. Portar aquilo
   * seria trocar de tecnologia mantendo o defeito, e escrever por conta própria
   * seria inventar a narrativa dos projetos dele. Enquanto isto for `true`, a
   * página mostra o trabalho (imagem + metadados) e omite o corpo de texto, em
   * vez de exibir enchimento.
   */
  contentPending?: boolean;
};

const img = (
  src: string,
  w: number,
  h: number,
  alt: string,
  src2x?: string,
): WorkImage => ({ src, src2x, w, h, alt });


/* Artes que a home já usa — os cases sem texto reaproveitam a sua como capa,
   para o índice nunca ter buraco enquanto o corpo não chega. */
/* Alex Archer — capa. */
import aa01 from "../assets/optimized/case-alexarcher-01-1400.webp";
import aa01x from "../assets/optimized/case-alexarcher-01-2200.webp";

/* Galerias dos cases — extraídas do Figma do Mateus (15/10/2026), na ordem do canvas. */
import gg01 from "../assets/optimized/case-ginga-01-1400.webp";
import gg01x from "../assets/optimized/case-ginga-01-1620.webp";
import gg02 from "../assets/optimized/case-ginga-02-1400.webp";
import gg02x from "../assets/optimized/case-ginga-02-1620.webp";
import gg03 from "../assets/optimized/case-ginga-03-1400.webp";
import gg03x from "../assets/optimized/case-ginga-03-1620.webp";
import gg04 from "../assets/optimized/case-ginga-04-1400.webp";
import gg04x from "../assets/optimized/case-ginga-04-1620.webp";
import gg05 from "../assets/optimized/case-ginga-05-1400.webp";
import gg05x from "../assets/optimized/case-ginga-05-1620.webp";
import gg06 from "../assets/optimized/case-ginga-06-1400.webp";
import gg06x from "../assets/optimized/case-ginga-06-1620.webp";
import gg07 from "../assets/optimized/case-ginga-07-1400.webp";
import gg07x from "../assets/optimized/case-ginga-07-1613.webp";
import gg08 from "../assets/optimized/case-ginga-08-1400.webp";
import gg08x from "../assets/optimized/case-ginga-08-1620.webp";
import gg09 from "../assets/optimized/case-ginga-09-1400.webp";
import gg09x from "../assets/optimized/case-ginga-09-1620.webp";
import gg10 from "../assets/optimized/case-ginga-10-1400.webp";
import gg10x from "../assets/optimized/case-ginga-10-1620.webp";
import gg11 from "../assets/optimized/case-ginga-11-1400.webp";
import gg11x from "../assets/optimized/case-ginga-11-1620.webp";
import gg12 from "../assets/optimized/case-ginga-12-1400.webp";
import gg12x from "../assets/optimized/case-ginga-12-1620.webp";
import gg13 from "../assets/optimized/case-ginga-13-1400.webp";
import gg13x from "../assets/optimized/case-ginga-13-1620.webp";
import gg14 from "../assets/optimized/case-ginga-14-1400.webp";
import gg14x from "../assets/optimized/case-ginga-14-1620.webp";
import ax02 from "../assets/optimized/case-alex-archer-02-1400.webp";
import ax02x from "../assets/optimized/case-alex-archer-02-1921.webp";
import ax03 from "../assets/optimized/case-alex-archer-03-1400.webp";
import ax03x from "../assets/optimized/case-alex-archer-03-1921.webp";
import ax04 from "../assets/optimized/case-alex-archer-04-1400.webp";
import ax04x from "../assets/optimized/case-alex-archer-04-1921.webp";
import ax05 from "../assets/optimized/case-alex-archer-05-1400.webp";
import ax05x from "../assets/optimized/case-alex-archer-05-1920.webp";
import ax06 from "../assets/optimized/case-alex-archer-06-1400.webp";
import ax06x from "../assets/optimized/case-alex-archer-06-1921.webp";
import ax07 from "../assets/optimized/case-alex-archer-07-1400.webp";
import ax07x from "../assets/optimized/case-alex-archer-07-1920.webp";
import ax08 from "../assets/optimized/case-alex-archer-08-1400.webp";
import ax08x from "../assets/optimized/case-alex-archer-08-2028.webp";
import ax09 from "../assets/optimized/case-alex-archer-09-1400.webp";
import ax09x from "../assets/optimized/case-alex-archer-09-1920.webp";
import ax10 from "../assets/optimized/case-alex-archer-10-1400.webp";
import ax10x from "../assets/optimized/case-alex-archer-10-1920.webp";
import ax11 from "../assets/optimized/case-alex-archer-11-1400.webp";
import ax11x from "../assets/optimized/case-alex-archer-11-1921.webp";
import ax12 from "../assets/optimized/case-alex-archer-12-1400.webp";
import ax12x from "../assets/optimized/case-alex-archer-12-1920.webp";
import nx01 from "../assets/optimized/case-neox-01-1400.webp";
import nx01x from "../assets/optimized/case-neox-01-1856.webp";
import nx02 from "../assets/optimized/case-neox-02-1400.webp";
import nx02x from "../assets/optimized/case-neox-02-1856.webp";
import nx03 from "../assets/optimized/case-neox-03-1400.webp";
import nx03x from "../assets/optimized/case-neox-03-1856.webp";
import nx04 from "../assets/optimized/case-neox-04-1400.webp";
import nx04x from "../assets/optimized/case-neox-04-1856.webp";
import nx05 from "../assets/optimized/case-neox-05-1400.webp";
import nx05x from "../assets/optimized/case-neox-05-1856.webp";
import nx06 from "../assets/optimized/case-neox-06-1400.webp";
import nx06x from "../assets/optimized/case-neox-06-1856.webp";
import nx07 from "../assets/optimized/case-neox-07-1400.webp";
import nx07x from "../assets/optimized/case-neox-07-1856.webp";
import nx08 from "../assets/optimized/case-neox-08-1400.webp";
import nx08x from "../assets/optimized/case-neox-08-1856.webp";
import nx09 from "../assets/optimized/case-neox-09-1400.webp";
import nx09x from "../assets/optimized/case-neox-09-2800.webp";
import nx10 from "../assets/optimized/case-neox-10-1400.webp";
import nx10x from "../assets/optimized/case-neox-10-2572.webp";
import nx11 from "../assets/optimized/case-neox-11-1400.webp";
import nx11x from "../assets/optimized/case-neox-11-1857.webp";
import nx12 from "../assets/optimized/case-neox-12-1400.webp";
import nx12x from "../assets/optimized/case-neox-12-1857.webp";
import nx13 from "../assets/optimized/case-neox-13-1400.webp";
import nx13x from "../assets/optimized/case-neox-13-1857.webp";
import nx14 from "../assets/optimized/case-neox-14-1400.webp";
import nx14x from "../assets/optimized/case-neox-14-1857.webp";
import nx15 from "../assets/optimized/case-neox-15-1400.webp";
import nx15x from "../assets/optimized/case-neox-15-2800.webp";
import tv02 from "../assets/optimized/case-trivo-02-1400.webp";
import tv02x from "../assets/optimized/case-trivo-02-1890.webp";
import tv03 from "../assets/optimized/case-trivo-03-1400.webp";
import tv03x from "../assets/optimized/case-trivo-03-2147.webp";
import tv04 from "../assets/optimized/case-trivo-04-1400.webp";
import tv04x from "../assets/optimized/case-trivo-04-2800.webp";
import tv05 from "../assets/optimized/case-trivo-05-1400.webp";
import tv05x from "../assets/optimized/case-trivo-05-1890.webp";
import tv07 from "../assets/optimized/case-trivo-07-1400.webp";
import tv07x from "../assets/optimized/case-trivo-07-1890.webp";
import tv08 from "../assets/optimized/case-trivo-08-1400.webp";
import tv08x from "../assets/optimized/case-trivo-08-2147.webp";
import tv09 from "../assets/optimized/case-trivo-09-1400.webp";
import tv09x from "../assets/optimized/case-trivo-09-2148.webp";
import tv10 from "../assets/optimized/case-trivo-10-1400.webp";
import tv10x from "../assets/optimized/case-trivo-10-1890.webp";
import sg01 from "../assets/optimized/case-stag-01-1400.webp";
import sg01x from "../assets/optimized/case-stag-01-2800.webp";
import sg02 from "../assets/optimized/case-stag-02-1400.webp";
import sg02x from "../assets/optimized/case-stag-02-2534.webp";
import sg03 from "../assets/optimized/case-stag-03-1400.webp";
import sg03x from "../assets/optimized/case-stag-03-2534.webp";
import sg04 from "../assets/optimized/case-stag-04-1400.webp";
import sg04x from "../assets/optimized/case-stag-04-2534.webp";
import sg05 from "../assets/optimized/case-stag-05-1400.webp";
import sg05x from "../assets/optimized/case-stag-05-2800.webp";
import sg06 from "../assets/optimized/case-stag-06-1400.webp";
import sg06x from "../assets/optimized/case-stag-06-2533.webp";
import sg07 from "../assets/optimized/case-stag-07-1400.webp";
import sg07x from "../assets/optimized/case-stag-07-2800.webp";
import sg09 from "../assets/optimized/case-stag-09-1400.webp";
import sg09x from "../assets/optimized/case-stag-09-2534.webp";
import sg10 from "../assets/optimized/case-stag-10-1400.webp";
import sg10x from "../assets/optimized/case-stag-10-2534.webp";
import vt01 from "../assets/optimized/case-votare-01-1400.webp";
import vt01x from "../assets/optimized/case-votare-01-1652.webp";
import vt02 from "../assets/optimized/case-votare-02-1400.webp";
import vt02x from "../assets/optimized/case-votare-02-2800.webp";
import vt03 from "../assets/optimized/case-votare-03-1400.webp";
import vt03x from "../assets/optimized/case-votare-03-1652.webp";
import vt04 from "../assets/optimized/case-votare-04-1400.webp";
import vt04x from "../assets/optimized/case-votare-04-2160.webp";

/* Artes que a home já usa (capas). */
import artStag from "../assets/optimized/art-stag-1400.webp";
import artStagX from "../assets/optimized/art-stag-2200.webp";
import artVotare from "../assets/optimized/art-votare-1400.webp";
import artVotareX from "../assets/optimized/art-votare-2200.webp";
import artTrivo from "../assets/optimized/art-trivo-1400.webp";
import artNeox from "../assets/optimized/art-neox-1400.webp";
import artGinga from "../assets/optimized/art-ginga-1400.webp";
import artGinga2x from "../assets/optimized/art-ginga-2200.webp";

/* Cases novos do Figma (15/10/2026) — gerados com cwebp q82. */
import f_art_muhlwald_1400 from "../assets/optimized/art-muhlwald-1400.webp";
import f_art_muhlwald_2800 from "../assets/optimized/art-muhlwald-2800.webp";
import f_case_muhlwald_01_1400 from "../assets/optimized/case-muhlwald-01-1400.webp";
import f_case_muhlwald_01_2800 from "../assets/optimized/case-muhlwald-01-2800.webp";
import f_case_muhlwald_02_1400 from "../assets/optimized/case-muhlwald-02-1400.webp";
import f_case_muhlwald_02_2800 from "../assets/optimized/case-muhlwald-02-2800.webp";
import f_case_muhlwald_03_1400 from "../assets/optimized/case-muhlwald-03-1400.webp";
import f_case_muhlwald_03_2800 from "../assets/optimized/case-muhlwald-03-2800.webp";
import f_case_muhlwald_04_1400 from "../assets/optimized/case-muhlwald-04-1400.webp";
import f_case_muhlwald_04_2800 from "../assets/optimized/case-muhlwald-04-2800.webp";
import f_case_muhlwald_05_1400 from "../assets/optimized/case-muhlwald-05-1400.webp";
import f_case_muhlwald_05_2800 from "../assets/optimized/case-muhlwald-05-2800.webp";
import f_case_muhlwald_06_1400 from "../assets/optimized/case-muhlwald-06-1400.webp";
import f_case_muhlwald_06_2800 from "../assets/optimized/case-muhlwald-06-2800.webp";
import f_case_muhlwald_07_1400 from "../assets/optimized/case-muhlwald-07-1400.webp";
import f_case_muhlwald_07_2800 from "../assets/optimized/case-muhlwald-07-2800.webp";
import f_case_muhlwald_08_1400 from "../assets/optimized/case-muhlwald-08-1400.webp";
import f_case_muhlwald_08_2800 from "../assets/optimized/case-muhlwald-08-2800.webp";
import f_art_resieben_1400 from "../assets/optimized/art-resieben-1400.webp";
import f_art_resieben_2800 from "../assets/optimized/art-resieben-2800.webp";
import f_case_resieben_01_1400 from "../assets/optimized/case-resieben-01-1400.webp";
import f_case_resieben_01_2800 from "../assets/optimized/case-resieben-01-2800.webp";
import f_case_resieben_02_1400 from "../assets/optimized/case-resieben-02-1400.webp";
import f_case_resieben_02_2800 from "../assets/optimized/case-resieben-02-2800.webp";
import f_case_resieben_03_1400 from "../assets/optimized/case-resieben-03-1400.webp";
import f_case_resieben_03_2800 from "../assets/optimized/case-resieben-03-2800.webp";
import f_case_resieben_04_1400 from "../assets/optimized/case-resieben-04-1400.webp";
import f_case_resieben_04_2800 from "../assets/optimized/case-resieben-04-2800.webp";
import f_case_resieben_05_1400 from "../assets/optimized/case-resieben-05-1400.webp";
import f_case_resieben_05_2800 from "../assets/optimized/case-resieben-05-2800.webp";
import f_case_resieben_06_1400 from "../assets/optimized/case-resieben-06-1400.webp";
import f_case_resieben_06_2800 from "../assets/optimized/case-resieben-06-2800.webp";
import f_case_resieben_07_1400 from "../assets/optimized/case-resieben-07-1400.webp";
import f_case_resieben_07_2800 from "../assets/optimized/case-resieben-07-2800.webp";
import f_case_resieben_08_1400 from "../assets/optimized/case-resieben-08-1400.webp";
import f_case_resieben_08_2800 from "../assets/optimized/case-resieben-08-2800.webp";
import f_case_resieben_09_1400 from "../assets/optimized/case-resieben-09-1400.webp";
import f_case_resieben_09_2800 from "../assets/optimized/case-resieben-09-2800.webp";
import f_case_resieben_10_1400 from "../assets/optimized/case-resieben-10-1400.webp";
import f_case_resieben_10_2800 from "../assets/optimized/case-resieben-10-2800.webp";
import f_art_infinos_1400 from "../assets/optimized/art-infinos-1400.webp";
import f_art_infinos_2800 from "../assets/optimized/art-infinos-2800.webp";
import f_case_infinos_01_1400 from "../assets/optimized/case-infinos-01-1400.webp";
import f_case_infinos_01_2800 from "../assets/optimized/case-infinos-01-2800.webp";
import f_case_infinos_02_1400 from "../assets/optimized/case-infinos-02-1400.webp";
import f_case_infinos_02_2800 from "../assets/optimized/case-infinos-02-2800.webp";
import f_case_infinos_03_1400 from "../assets/optimized/case-infinos-03-1400.webp";
import f_case_infinos_03_2800 from "../assets/optimized/case-infinos-03-2800.webp";
import f_case_infinos_04_1400 from "../assets/optimized/case-infinos-04-1400.webp";
import f_case_infinos_04_2800 from "../assets/optimized/case-infinos-04-2800.webp";
import f_case_infinos_05_1400 from "../assets/optimized/case-infinos-05-1400.webp";
import f_case_infinos_05_2800 from "../assets/optimized/case-infinos-05-2800.webp";
import f_case_infinos_06_1400 from "../assets/optimized/case-infinos-06-1400.webp";
import f_case_infinos_06_2800 from "../assets/optimized/case-infinos-06-2800.webp";
import f_case_infinos_07_1400 from "../assets/optimized/case-infinos-07-1400.webp";
import f_case_infinos_07_2800 from "../assets/optimized/case-infinos-07-2800.webp";
import f_case_infinos_08_1400 from "../assets/optimized/case-infinos-08-1400.webp";
import f_case_infinos_08_2800 from "../assets/optimized/case-infinos-08-2800.webp";
import f_case_infinos_09_1400 from "../assets/optimized/case-infinos-09-1400.webp";
import f_case_infinos_09_2800 from "../assets/optimized/case-infinos-09-2800.webp";
import f_case_junghirsch_01_1400 from "../assets/optimized/case-junghirsch-01-1400.webp";
import f_case_junghirsch_01_1920 from "../assets/optimized/case-junghirsch-01-1920.webp";
import f_case_junghirsch_02_1400 from "../assets/optimized/case-junghirsch-02-1400.webp";
import f_case_junghirsch_02_1920 from "../assets/optimized/case-junghirsch-02-1920.webp";
import f_case_junghirsch_03_1400 from "../assets/optimized/case-junghirsch-03-1400.webp";
import f_case_junghirsch_03_1920 from "../assets/optimized/case-junghirsch-03-1920.webp";
import f_case_junghirsch_04_1400 from "../assets/optimized/case-junghirsch-04-1400.webp";
import f_case_junghirsch_04_1920 from "../assets/optimized/case-junghirsch-04-1920.webp";
import f_case_junghirsch_05_1400 from "../assets/optimized/case-junghirsch-05-1400.webp";
import f_case_junghirsch_05_1920 from "../assets/optimized/case-junghirsch-05-1920.webp";
import f_case_junghirsch_06_1400 from "../assets/optimized/case-junghirsch-06-1400.webp";
import f_case_junghirsch_06_1920 from "../assets/optimized/case-junghirsch-06-1920.webp";
import f_case_junghirsch_07_1400 from "../assets/optimized/case-junghirsch-07-1400.webp";
import f_case_junghirsch_07_1920 from "../assets/optimized/case-junghirsch-07-1920.webp";
import f_case_junghirsch_08_1400 from "../assets/optimized/case-junghirsch-08-1400.webp";
import f_case_junghirsch_08_1920 from "../assets/optimized/case-junghirsch-08-1920.webp";
import f_case_junghirsch_09_1400 from "../assets/optimized/case-junghirsch-09-1400.webp";
import f_case_junghirsch_09_1920 from "../assets/optimized/case-junghirsch-09-1920.webp";
import f_case_junghirsch_10_1400 from "../assets/optimized/case-junghirsch-10-1400.webp";
import f_case_junghirsch_10_1920 from "../assets/optimized/case-junghirsch-10-1920.webp";
import f_case_junghirsch_11_1400 from "../assets/optimized/case-junghirsch-11-1400.webp";
import f_case_junghirsch_11_1920 from "../assets/optimized/case-junghirsch-11-1920.webp";
import f_case_junghirsch_12_1400 from "../assets/optimized/case-junghirsch-12-1400.webp";
import f_case_junghirsch_12_1920 from "../assets/optimized/case-junghirsch-12-1920.webp";
import f_case_junghirsch_13_1400 from "../assets/optimized/case-junghirsch-13-1400.webp";
import f_case_junghirsch_13_1920 from "../assets/optimized/case-junghirsch-13-1920.webp";
import f_case_junghirsch_14_1400 from "../assets/optimized/case-junghirsch-14-1400.webp";
import f_case_junghirsch_14_1920 from "../assets/optimized/case-junghirsch-14-1920.webp";
import f_case_junghirsch_15_1400 from "../assets/optimized/case-junghirsch-15-1400.webp";
import f_case_junghirsch_15_1920 from "../assets/optimized/case-junghirsch-15-1920.webp";
import f_art_junghirsch_1400 from "../assets/optimized/art-junghirsch-1400.webp";
import f_art_junghirsch_1440 from "../assets/optimized/art-junghirsch-1440.webp";
import f_case_hoki_01_1400 from "../assets/optimized/case-hoki-01-1400.webp";
import f_case_hoki_01_1920 from "../assets/optimized/case-hoki-01-1920.webp";
import f_case_hoki_02_1400 from "../assets/optimized/case-hoki-02-1400.webp";
import f_case_hoki_02_1920 from "../assets/optimized/case-hoki-02-1920.webp";
import f_case_hoki_03_1400 from "../assets/optimized/case-hoki-03-1400.webp";
import f_case_hoki_03_1908 from "../assets/optimized/case-hoki-03-1908.webp";
import f_case_hoki_04_1400 from "../assets/optimized/case-hoki-04-1400.webp";
import f_case_hoki_04_1920 from "../assets/optimized/case-hoki-04-1920.webp";
import f_case_hoki_05_1400 from "../assets/optimized/case-hoki-05-1400.webp";
import f_case_hoki_05_1920 from "../assets/optimized/case-hoki-05-1920.webp";
import f_case_hoki_06_1400 from "../assets/optimized/case-hoki-06-1400.webp";
import f_case_hoki_06_1908 from "../assets/optimized/case-hoki-06-1908.webp";
import f_case_hoki_07_1400 from "../assets/optimized/case-hoki-07-1400.webp";
import f_case_hoki_07_1920 from "../assets/optimized/case-hoki-07-1920.webp";
import f_case_hoki_08_1400 from "../assets/optimized/case-hoki-08-1400.webp";
import f_case_hoki_08_1908 from "../assets/optimized/case-hoki-08-1908.webp";
import f_case_hoki_09_1400 from "../assets/optimized/case-hoki-09-1400.webp";
import f_case_hoki_09_1920 from "../assets/optimized/case-hoki-09-1920.webp";
import f_art_hoki_1400 from "../assets/optimized/art-hoki-c-1280.webp";

import f_case_magic_flight_01_1400 from "../assets/optimized/case-magic-flight-01-1400.webp";
import f_case_magic_flight_01_1920 from "../assets/optimized/case-magic-flight-01-1920.webp";
import f_case_magic_flight_02_1400 from "../assets/optimized/case-magic-flight-02-1400.webp";
import f_case_magic_flight_02_1920 from "../assets/optimized/case-magic-flight-02-1920.webp";
import f_case_magic_flight_03_1400 from "../assets/optimized/case-magic-flight-03-1400.webp";
import f_case_magic_flight_03_1920 from "../assets/optimized/case-magic-flight-03-1920.webp";
import f_case_magic_flight_04_1400 from "../assets/optimized/case-magic-flight-04-1400.webp";
import f_case_magic_flight_04_1920 from "../assets/optimized/case-magic-flight-04-1920.webp";
import f_case_magic_flight_05_1400 from "../assets/optimized/case-magic-flight-05-1400.webp";
import f_case_magic_flight_05_1920 from "../assets/optimized/case-magic-flight-05-1920.webp";
import f_art_magic_flight_1400 from "../assets/optimized/art-magic-flight-1400.webp";
import f_art_magic_flight_1440 from "../assets/optimized/art-magic-flight-1440.webp";
import f_case_proxima_01_1400 from "../assets/optimized/case-proxima-01-1400.webp";
import f_case_proxima_01_2160 from "../assets/optimized/case-proxima-01-2160.webp";
import f_case_proxima_02_1400 from "../assets/optimized/case-proxima-02-1400.webp";
import f_case_proxima_02_2160 from "../assets/optimized/case-proxima-02-2160.webp";
import f_case_proxima_03_1400 from "../assets/optimized/case-proxima-03-1400.webp";
import f_case_proxima_03_2160 from "../assets/optimized/case-proxima-03-2160.webp";
import f_case_proxima_04_1400 from "../assets/optimized/case-proxima-04-1400.webp";
import f_case_proxima_04_2160 from "../assets/optimized/case-proxima-04-2160.webp";
import f_case_proxima_05_1400 from "../assets/optimized/case-proxima-05-1400.webp";
import f_case_proxima_05_2160 from "../assets/optimized/case-proxima-05-2160.webp";
import f_case_proxima_06_1400 from "../assets/optimized/case-proxima-06-1400.webp";
import f_case_proxima_06_2160 from "../assets/optimized/case-proxima-06-2160.webp";
import f_case_proxima_07_1400 from "../assets/optimized/case-proxima-07-1400.webp";
import f_case_proxima_07_2160 from "../assets/optimized/case-proxima-07-2160.webp";
import f_case_proxima_08_1400 from "../assets/optimized/case-proxima-08-1400.webp";
import f_case_proxima_08_2160 from "../assets/optimized/case-proxima-08-2160.webp";
import f_case_proxima_09_1400 from "../assets/optimized/case-proxima-09-1400.webp";
import f_case_proxima_09_2160 from "../assets/optimized/case-proxima-09-2160.webp";
import f_case_proxima_10_1400 from "../assets/optimized/case-proxima-10-1400.webp";
import f_case_proxima_10_2160 from "../assets/optimized/case-proxima-10-2160.webp";
import f_art_proxima_1400 from "../assets/optimized/art-proxima-1400.webp";
import f_art_proxima_2160 from "../assets/optimized/art-proxima-2160.webp";
import f_case_mecanica_sanctas_01_1400 from "../assets/optimized/case-mecanica-sanctas-01-1400.webp";
import f_case_mecanica_sanctas_01_2160 from "../assets/optimized/case-mecanica-sanctas-01-2160.webp";
import f_case_mecanica_sanctas_02_1400 from "../assets/optimized/case-mecanica-sanctas-02-1400.webp";
import f_case_mecanica_sanctas_02_2700 from "../assets/optimized/case-mecanica-sanctas-02-2700.webp";
import f_case_mecanica_sanctas_03_1400 from "../assets/optimized/case-mecanica-sanctas-03-1400.webp";
import f_case_mecanica_sanctas_03_2176 from "../assets/optimized/case-mecanica-sanctas-03-2176.webp";
import f_case_mecanica_sanctas_04_1400 from "../assets/optimized/case-mecanica-sanctas-04-1400.webp";
import f_case_mecanica_sanctas_04_2025 from "../assets/optimized/case-mecanica-sanctas-04-2025.webp";
import f_case_mecanica_sanctas_05_1400 from "../assets/optimized/case-mecanica-sanctas-05-1400.webp";
import f_case_mecanica_sanctas_05_1676 from "../assets/optimized/case-mecanica-sanctas-05-1676.webp";
import f_case_mecanica_sanctas_06_1400 from "../assets/optimized/case-mecanica-sanctas-06-1400.webp";
import f_case_mecanica_sanctas_06_2175 from "../assets/optimized/case-mecanica-sanctas-06-2175.webp";
import f_case_mecanica_sanctas_07_1400 from "../assets/optimized/case-mecanica-sanctas-07-1400.webp";
import f_case_mecanica_sanctas_07_2024 from "../assets/optimized/case-mecanica-sanctas-07-2024.webp";
import f_case_mecanica_sanctas_08_1400 from "../assets/optimized/case-mecanica-sanctas-08-1400.webp";
import f_case_mecanica_sanctas_08_1676 from "../assets/optimized/case-mecanica-sanctas-08-1676.webp";
import f_case_mecanica_sanctas_09_1400 from "../assets/optimized/case-mecanica-sanctas-09-1400.webp";
import f_case_mecanica_sanctas_09_1991 from "../assets/optimized/case-mecanica-sanctas-09-1991.webp";
import f_case_mecanica_sanctas_10_1400 from "../assets/optimized/case-mecanica-sanctas-10-1400.webp";
import f_case_mecanica_sanctas_10_2176 from "../assets/optimized/case-mecanica-sanctas-10-2176.webp";
import f_case_mecanica_sanctas_11_1400 from "../assets/optimized/case-mecanica-sanctas-11-1400.webp";
import f_case_mecanica_sanctas_11_2161 from "../assets/optimized/case-mecanica-sanctas-11-2161.webp";
import f_case_mecanica_sanctas_12_1400 from "../assets/optimized/case-mecanica-sanctas-12-1400.webp";
import f_case_mecanica_sanctas_12_1612 from "../assets/optimized/case-mecanica-sanctas-12-1612.webp";
import f_art_mecanica_sanctas_1400 from "../assets/optimized/art-mecanica-sanctas-1400.webp";
import f_art_mecanica_sanctas_1800 from "../assets/optimized/art-mecanica-sanctas-1800.webp";
import f_case_nike_through_the_ages_01_1400 from "../assets/optimized/case-nike-through-the-ages-01-1400.webp";
import f_case_nike_through_the_ages_01_1856 from "../assets/optimized/case-nike-through-the-ages-01-1856.webp";
import f_case_nike_through_the_ages_02_1400 from "../assets/optimized/case-nike-through-the-ages-02-1400.webp";
import f_case_nike_through_the_ages_02_1857 from "../assets/optimized/case-nike-through-the-ages-02-1857.webp";
import f_case_nike_through_the_ages_03_1400 from "../assets/optimized/case-nike-through-the-ages-03-1400.webp";
import f_case_nike_through_the_ages_03_1856 from "../assets/optimized/case-nike-through-the-ages-03-1856.webp";
import f_case_nike_through_the_ages_04_1400 from "../assets/optimized/case-nike-through-the-ages-04-1400.webp";
import f_case_nike_through_the_ages_04_1875 from "../assets/optimized/case-nike-through-the-ages-04-1875.webp";
import f_case_nike_through_the_ages_05_1400 from "../assets/optimized/case-nike-through-the-ages-05-1400.webp";
import f_case_nike_through_the_ages_05_1856 from "../assets/optimized/case-nike-through-the-ages-05-1856.webp";
import f_case_nike_through_the_ages_06_1400 from "../assets/optimized/case-nike-through-the-ages-06-1400.webp";
import f_case_nike_through_the_ages_06_1856 from "../assets/optimized/case-nike-through-the-ages-06-1856.webp";
import f_case_nike_through_the_ages_07_1400 from "../assets/optimized/case-nike-through-the-ages-07-1400.webp";
import f_case_nike_through_the_ages_07_1856 from "../assets/optimized/case-nike-through-the-ages-07-1856.webp";
import f_case_nike_through_the_ages_08_1400 from "../assets/optimized/case-nike-through-the-ages-08-1400.webp";
import f_case_nike_through_the_ages_08_1856 from "../assets/optimized/case-nike-through-the-ages-08-1856.webp";
import f_case_nike_through_the_ages_09_1400 from "../assets/optimized/case-nike-through-the-ages-09-1400.webp";
import f_case_nike_through_the_ages_09_1856 from "../assets/optimized/case-nike-through-the-ages-09-1856.webp";
import f_case_nike_through_the_ages_10_1400 from "../assets/optimized/case-nike-through-the-ages-10-1400.webp";
import f_case_nike_through_the_ages_10_1856 from "../assets/optimized/case-nike-through-the-ages-10-1856.webp";
import f_case_nike_through_the_ages_11_1400 from "../assets/optimized/case-nike-through-the-ages-11-1400.webp";
import f_case_nike_through_the_ages_11_1856 from "../assets/optimized/case-nike-through-the-ages-11-1856.webp";
import f_case_nike_through_the_ages_12_1400 from "../assets/optimized/case-nike-through-the-ages-12-1400.webp";
import f_case_nike_through_the_ages_12_1856 from "../assets/optimized/case-nike-through-the-ages-12-1856.webp";
import f_case_nike_through_the_ages_13_1400 from "../assets/optimized/case-nike-through-the-ages-13-1400.webp";
import f_case_nike_through_the_ages_13_1856 from "../assets/optimized/case-nike-through-the-ages-13-1856.webp";
import f_case_nike_through_the_ages_14_1400 from "../assets/optimized/case-nike-through-the-ages-14-1400.webp";
import f_case_nike_through_the_ages_14_1856 from "../assets/optimized/case-nike-through-the-ages-14-1856.webp";
import f_art_nike_through_the_ages_1400 from "../assets/optimized/art-nike-through-the-ages-1400.webp";
import f_art_nike_through_the_ages_1856 from "../assets/optimized/art-nike-through-the-ages-1856.webp";
import f_case_adventure_time_01_1400 from "../assets/optimized/case-adventure-time-01-1400.webp";
import f_case_adventure_time_01_2175 from "../assets/optimized/case-adventure-time-01-2175.webp";
import f_case_adventure_time_02_1400 from "../assets/optimized/case-adventure-time-02-1400.webp";
import f_case_adventure_time_02_2176 from "../assets/optimized/case-adventure-time-02-2176.webp";
import f_case_adventure_time_03_1400 from "../assets/optimized/case-adventure-time-03-1400.webp";
import f_case_adventure_time_03_2175 from "../assets/optimized/case-adventure-time-03-2175.webp";
import f_case_adventure_time_04_1400 from "../assets/optimized/case-adventure-time-04-1400.webp";
import f_case_adventure_time_04_2175 from "../assets/optimized/case-adventure-time-04-2175.webp";
import f_case_adventure_time_05_1400 from "../assets/optimized/case-adventure-time-05-1400.webp";
import f_case_adventure_time_05_2175 from "../assets/optimized/case-adventure-time-05-2175.webp";
import f_case_adventure_time_06_1400 from "../assets/optimized/case-adventure-time-06-1400.webp";
import f_case_adventure_time_06_2175 from "../assets/optimized/case-adventure-time-06-2175.webp";
import f_case_adventure_time_07_1400 from "../assets/optimized/case-adventure-time-07-1400.webp";
import f_case_adventure_time_07_2175 from "../assets/optimized/case-adventure-time-07-2175.webp";
import f_case_adventure_time_08_1400 from "../assets/optimized/case-adventure-time-08-1400.webp";
import f_case_adventure_time_08_2175 from "../assets/optimized/case-adventure-time-08-2175.webp";
import f_case_adventure_time_09_1400 from "../assets/optimized/case-adventure-time-09-1400.webp";
import f_case_adventure_time_09_2175 from "../assets/optimized/case-adventure-time-09-2175.webp";
import f_case_adventure_time_10_1400 from "../assets/optimized/case-adventure-time-10-1400.webp";
import f_case_adventure_time_10_2100 from "../assets/optimized/case-adventure-time-10-2100.webp";
import f_case_adventure_time_11_1400 from "../assets/optimized/case-adventure-time-11-1400.webp";
import f_case_adventure_time_11_2175 from "../assets/optimized/case-adventure-time-11-2175.webp";
import f_case_adventure_time_12_1400 from "../assets/optimized/case-adventure-time-12-1400.webp";
import f_case_adventure_time_12_2175 from "../assets/optimized/case-adventure-time-12-2175.webp";
import f_case_adventure_time_13_1400 from "../assets/optimized/case-adventure-time-13-1400.webp";
import f_case_adventure_time_13_2160 from "../assets/optimized/case-adventure-time-13-2160.webp";
import f_art_adventure_time_1400 from "../assets/optimized/art-adventure-time-1400.webp";
import f_art_adventure_time_2175 from "../assets/optimized/art-adventure-time-2175.webp";
import f_case_lama_10_01_1400 from "../assets/optimized/case-lama-10-01-1400.webp";
import f_case_lama_10_01_1856 from "../assets/optimized/case-lama-10-01-1856.webp";
import f_case_lama_10_02_1400 from "../assets/optimized/case-lama-10-02-1400.webp";
import f_case_lama_10_02_1856 from "../assets/optimized/case-lama-10-02-1856.webp";
import f_case_lama_10_03_1400 from "../assets/optimized/case-lama-10-03-1400.webp";
import f_case_lama_10_03_1856 from "../assets/optimized/case-lama-10-03-1856.webp";
import f_case_lama_10_04_1400 from "../assets/optimized/case-lama-10-04-1400.webp";
import f_case_lama_10_04_1856 from "../assets/optimized/case-lama-10-04-1856.webp";
import f_case_lama_10_05_1400 from "../assets/optimized/case-lama-10-05-1400.webp";
import f_case_lama_10_05_1856 from "../assets/optimized/case-lama-10-05-1856.webp";
import f_case_lama_10_06_1400 from "../assets/optimized/case-lama-10-06-1400.webp";
import f_case_lama_10_06_1856 from "../assets/optimized/case-lama-10-06-1856.webp";
import f_case_lama_10_07_1400 from "../assets/optimized/case-lama-10-07-1400.webp";
import f_case_lama_10_07_1856 from "../assets/optimized/case-lama-10-07-1856.webp";
import f_case_lama_10_08_1400 from "../assets/optimized/case-lama-10-08-1400.webp";
import f_case_lama_10_08_1856 from "../assets/optimized/case-lama-10-08-1856.webp";
import f_case_lama_10_09_1400 from "../assets/optimized/case-lama-10-09-1400.webp";
import f_case_lama_10_09_1856 from "../assets/optimized/case-lama-10-09-1856.webp";
import f_case_lama_10_10_1400 from "../assets/optimized/case-lama-10-10-1400.webp";
import f_case_lama_10_10_2304 from "../assets/optimized/case-lama-10-10-2304.webp";
import f_case_lama_10_11_1400 from "../assets/optimized/case-lama-10-11-1400.webp";
import f_case_lama_10_11_2800 from "../assets/optimized/case-lama-10-11-2800.webp";
import f_case_lama_10_12_1400 from "../assets/optimized/case-lama-10-12-1400.webp";
import f_case_lama_10_12_2304 from "../assets/optimized/case-lama-10-12-2304.webp";
import f_case_lama_10_13_1400 from "../assets/optimized/case-lama-10-13-1400.webp";
import f_case_lama_10_13_1856 from "../assets/optimized/case-lama-10-13-1856.webp";
import f_case_lama_10_14_1400 from "../assets/optimized/case-lama-10-14-1400.webp";
import f_case_lama_10_14_1856 from "../assets/optimized/case-lama-10-14-1856.webp";
import f_case_lama_10_15_1400 from "../assets/optimized/case-lama-10-15-1400.webp";
import f_case_lama_10_15_1856 from "../assets/optimized/case-lama-10-15-1856.webp";
import f_art_lama_10_1400 from "../assets/optimized/art-lama-10-1400.webp";
import f_art_lama_10_2475 from "../assets/optimized/art-lama-10-2475.webp";

export const WORK: WorkItem[] = [
  /* ⚠ REMANESCENTES SAIU DA COLEÇÃO em 17/08/2026, a pedido dele ("projeto
     remanescentes remover"). A arte e a matéria do todays.design continuam no
     disco e em `reconhecimento.ts` — se ele quiser de volta, é reinserir esta
     entrada, não refazer nada.

     ⚠ Ginga entrou em 16/08/2026, e a lacuna que ele fecha
     é a mais séria que este site tinha: o Behance dele publica NOVE projetos e a
     coleção tinha SETE. Faltava justamente o trabalho mais recente — e o mais
     reconhecido, com matéria na Abduzeedo. Um portfólio que não mostra o
     projeto que rendeu imprensa está trabalhando contra o próprio dono.

     As capas vieram das fontes públicas dele (Behance para Ginga em 2432×1904,
     todays.design para Remanescentes), reencodadas aqui — é arte DELE, no site
     DELE. Os dois entram `contentPending`, como os demais sem texto: peça e
     metadados na tela, corpo vazio, nada inventado.

     ⚠ Continuam de fora `Bentofolio®` e `Bentofolio 2`: são produto próprio
     (template de portfólio), não identidade de cliente, e misturá-los na mesma
     coleção mudaria o que a lista afirma ser. Decisão do Mateus. */
  /* ⚠ 15/10/2026 — a coleção passou a ser EXATAMENTE a do Figma do Mateus
     ("bote apenas os projetos que têm no Figma"), na ordem das páginas do
     arquivo: Visual identities → Ai Generated images → UI design. Bureau e
     Ferraci saíram (não estão no Figma); as artes continuam no disco. Os cases
     novos não têm ano — o Figma não informa. */
  {
    slug: "ginga",
    title: "Ginga",
    year: 2026,
    disciplines: ["Branding", "Cultural Project"],
    credits: [],
    behanceUrl: "https://www.behance.net/gallery/253319999/Ginga",
    about: [
      "Ginga is a visual identity created for a capoeira group that offers workshops and learning experiences centered around this art form. The art direction draws on historical and cultural perspectives, presenting capoeira as a living, collective practice in constant motion. For this project, I combined editorial typography, bold colors, and high-contrast documentary photography, also using the images as illustrative elements. The visual system unfolds across posters, digital assets, and a range of applications that expand the brand’s universe.",
      "Ginga’s identity creates a visual language that expresses the unpredictability of the game, its historical dimension, and the continuous relationship between body, rhythm, and memory.",
    ],
    cover: img(artGinga, 1400, 1097, "Ginga — sistema de marca para projeto cultural de capoeira", artGinga2x),
    images: [
      { ...img(gg01, 1400, 1750, "Ginga — cartaz com a marca ginga em branco sobre vermelho", gg01x), meia: true },
      { ...img(gg02, 1400, 1750, "Ginga — retrato de capoeirista em rua de comunidade", gg02x), meia: true },
      { ...img(gg03, 1400, 1750, "Ginga — cartaz tipográfico com nomes de capoeira sobre verde-limão", gg03x), meia: true },
      { ...img(gg04, 1400, 1750, "Ginga — foto de jogo de capoeira em parada de mão", gg04x), meia: true },
      { ...img(gg05, 1400, 1750, "Ginga — folheto dobrado com a frase sobre memória do movimento", gg05x), meia: true },
      { ...img(gg06, 1400, 1750, "Ginga — cartaz 'Malícia is movement with a second meaning'", gg06x), meia: true },
      { ...img(gg07, 1400, 1758, "Ginga — foto de capoeiristas diante de parede vermelha", gg07x), meia: true },
      { ...img(gg08, 1400, 1750, "Ginga — cartaz da roda colado em vitrine com persiana", gg08x), meia: true },
      { ...img(gg09, 1400, 1750, "Ginga — catálogo Ginga Archive com instrumentos e roupas", gg09x), meia: true },
      { ...img(gg10, 1400, 1750, "Ginga — cartaz 'Every rooftop can turn into a living roda' preso em persiana", gg10x), meia: true },
      { ...img(gg11, 1400, 1750, "Ginga — cartaz 'The movement became resistance' sobre laranja", gg11x), meia: true },
      { ...img(gg12, 1400, 1750, "Ginga — cartaz com capoeiristas em alto contraste sobre oliva", gg12x), meia: true },
      { ...img(gg13, 1400, 1750, "Ginga — cartaz com capoeiristas em alto contraste sobre verde-limão", gg13x), meia: true },
      { ...img(gg14, 1400, 1750, "Ginga — cartaz com capoeiristas em alto contraste sobre vermelho", gg14x), meia: true },
    ],
  },
  {
    slug: "junghirsch",
    title: "Junghirsch",
    disciplines: ["Visual Identity", "AI Imagery", "UI", "Art Direction"],
    credits: [],
    about: [
      "Junghirsch is a marketing company focused on customer acquisition through its own proprietary framework. The company operates across Austria and Germany.",
      "I created an identity designed primarily for digital environments. The use of colors, details, and strong UI influences conveys a sense of modernity, technology, and authority.",
      "The symbol was inspired by the animal that represents Austria, the country where the company was founded. The typography follows the visual details of the symbol, and vice versa, creating a cohesive and distinctive identity.",
      "The minimalist illustrations communicate sophistication and presence, helping position the company as solid and trustworthy.",
      "The realistic AI-generated imagery conveys a sober, cold, and professional aesthetic, reinforcing the company’s positioning as an industry leader.",
    ],
    cover: img(f_art_junghirsch_1400, 1400, 1050, "Junghirsch — capa", f_art_junghirsch_1440),
    images: [
      img(f_case_junghirsch_01_1400, 1400, 788, "Junghirsch — marca Junghirsch com o cervo sobre branco", f_case_junghirsch_01_1920),
      img(f_case_junghirsch_02_1400, 1400, 788, "Junghirsch — peças impressas e tela do app com a frase 'Wir liefern Neukunden'", f_case_junghirsch_02_1920),
      img(f_case_junghirsch_03_1400, 1400, 788, "Junghirsch — executivo com tablet ao lado de card de vidro 'Echtes Wachstum'", f_case_junghirsch_03_1920),
      img(f_case_junghirsch_04_1400, 1400, 788, "Junghirsch — mão com celular e tela do app sobre floresta de pinheiros", f_case_junghirsch_04_1920),
      img(f_case_junghirsch_05_1400, 1400, 788, "Junghirsch — assinatura Junghirsch em branco sobre luz azul", f_case_junghirsch_05_1920),
      img(f_case_junghirsch_06_1400, 1400, 788, "Junghirsch — cartaz tipográfico 'Jung hirsch' em preto e branco", f_case_junghirsch_06_1920),
      img(f_case_junghirsch_07_1400, 1400, 788, "Junghirsch — celulares com o painel '420% mais Anfragen'", f_case_junghirsch_07_1920),
      img(f_case_junghirsch_08_1400, 1400, 788, "Junghirsch — sala de reunião com a marca na parede", f_case_junghirsch_08_1920),
      img(f_case_junghirsch_09_1400, 1400, 788, "Junghirsch — perfil de LinkedIn com a marca", f_case_junghirsch_09_1920),
      img(f_case_junghirsch_10_1400, 1400, 788, "Junghirsch — três cartazes da campanha em azul e branco", f_case_junghirsch_10_1920),
      img(f_case_junghirsch_11_1400, 1400, 788, "Junghirsch — cervo em silhueta sobre vale com névoa", f_case_junghirsch_11_1920),
      img(f_case_junghirsch_12_1400, 1400, 788, "Junghirsch — celular sobre pedestal branco", f_case_junghirsch_12_1920),
      img(f_case_junghirsch_13_1400, 1400, 788, "Junghirsch — cartaz em moldura no corredor de metal", f_case_junghirsch_13_1920),
      img(f_case_junghirsch_14_1400, 1400, 788, "Junghirsch — ícone do app e cartaz com o cervo", f_case_junghirsch_14_1920),
      img(f_case_junghirsch_15_1400, 1400, 788, "Junghirsch — livro preto 'Planbare Kundengewinnung'", f_case_junghirsch_15_1920),
    ],
  },
  {
    slug: "votare",
    title: "Votare",
    year: 2025,
    disciplines: ["Branding", "Visual Identity"],
    credits: [],
    behanceUrl: "https://www.behance.net/gallery/237665389/Votare-Visual-Identity",
    about: [
      "Votare is a platform created to transform the way Brazilians choose their representatives, combining technology, political education, and intelligent data. The project helps each voter understand their own ideals and values, connecting them with candidates who align with their vision, turning the act of voting into a true expression of identity.",
      "In a scenario where a large part of the population feels their voice has little impact, Votare presents clear and unbiased data, guiding citizens without manipulation and promoting conscious decision-making. Its visual identity reflects this purpose, conveying clarity, trust, and impact, while connecting democratic tradition with technological innovation to inspire a new generation of engaged voters.",
    ],
    cover: img(artVotare, 2800, 2100, "Votare — identidade cívica", artVotareX),
    images: [
      img(vt01, 1400, 1145, "Votare — cartaz 'Só faremos um Brasil melhor com intenção' sobre parede", vt01x),
      img(vt02, 1400, 350, "Votare — sistema da marca: símbolo, paleta e tipografia", vt02x),
      img(vt03, 1400, 1145, "Votare — painel 'Toda voz importa!' em evento", vt03x),
      img(vt04, 1400, 875, "Votare — cartaz 'Um voto consciente pode mudar milhões de vidas'", vt04x),
    ],
  },
  {
    slug: "trivo",
    title: "Trivo",
    year: 2025,
    disciplines: ["Visual Identity", "3D"],
    credits: [],
    behanceUrl: "https://www.behance.net/gallery/230919699/Trivo-Visual-Identity",
    about: [
      "Trivo is a bar inspired by the essence of jazz, not only as a musical genre, but as a way of living and connecting. It was born from the idea of bringing together three core elements: music, cocktails, and human presence.",
      "At Trivo, every night is an invitation to slow down, appreciate the moment, and enjoy the art of being together. Whether through a signature cocktail or a spontaneous conversation sparked by the sound of a saxophone, the experience is always intense, immersive, and full of personality.",
      "The space is intimate yet vibrant, designed to create encounters, stories, and a true sense of belonging. Trivo is not just a place to drink, it is a place to feel. To listen. To exist.",
      "Recently, we were featured in Behance’s Graphic Design category, placing my project among some of the best in the world on the platform.",
    ],
    cover: img(artTrivo, 1400, 930, "Trivo — identidade visual"),
    images: [
      { ...img(tv02, 1400, 2000, "Trivo — cardápio 'Meet the hall of sips' na mesa", tv02x), meia: true },
      img(tv03, 1400, 881, "Trivo — logotipo em metal sobre preto", tv03x),
      img(tv04, 1400, 612, "Trivo — peças impressas em ouro e vinho", tv04x),
      img(tv05, 1400, 1000, "Trivo — selo 'Book your table' dourado", tv05x),
      { ...img(tv07, 1400, 2000, "Trivo — guitarrista no palco do bar", tv07x), meia: true },
      img(tv08, 1400, 881, "Trivo — cartão de mesa com a marca", tv08x),
      img(tv09, 1400, 880, "Trivo — cartazes 'To the nights that overflow'", tv09x),
      { ...img(tv10, 1400, 2000, "Trivo — guardanapo com a marca ao lado de um copo de uísque", tv10x), meia: true },
    ],
  },
  {
    slug: "mecanica-sanctas",
    title: "Mecanica Sanctas",
    disciplines: ["Art Direction", "Visual Identity", "Illustration"],
    credits: [],
    about: [
      "Mecanica Sanctas is a study project where I set out to imagine what a Vatican-inspired biker gear brand would look like. The project brings an industrial and experimental edge to the design, while mixing in Byzantine and religious elements to set the scene.",
      "It's still a work in progress, but I already have some solid art direction to share.",
    ],
    cover: img(f_art_mecanica_sanctas_1400, 1400, 1050, "Mecanica Sanctas — capa", f_art_mecanica_sanctas_1800),
    images: [
      { ...img(f_case_mecanica_sanctas_01_1400, 1400, 1750, "Mecanica Sanctas — marca em cruz sobre preto", f_case_mecanica_sanctas_01_2160), meia: true },
      img(f_case_mecanica_sanctas_02_1400, 1400, 1400, "Mecanica Sanctas — cartaz 'Born in flesh, reborn in steel'", f_case_mecanica_sanctas_02_2700),
      { ...img(f_case_mecanica_sanctas_03_1400, 1400, 1737, "Mecanica Sanctas — vitral com Cristo e peças de motor", f_case_mecanica_sanctas_03_2176), meia: true },
      img(f_case_mecanica_sanctas_04_1400, 1400, 933, "Mecanica Sanctas — envelopes com ilustração em prata", f_case_mecanica_sanctas_04_2025),
      img(f_case_mecanica_sanctas_05_1400, 1400, 1128, "Mecanica Sanctas — bíblia de metal com a marca em cruz", f_case_mecanica_sanctas_05_1676),
      { ...img(f_case_mecanica_sanctas_06_1400, 1400, 1738, "Mecanica Sanctas — tatuagem da cruz Mecanica Sanctas no antebraço", f_case_mecanica_sanctas_06_2175), meia: true },
      img(f_case_mecanica_sanctas_07_1400, 1400, 934, "Mecanica Sanctas — capacete dourado com anjos esculpidos", f_case_mecanica_sanctas_07_2024),
      img(f_case_mecanica_sanctas_08_1400, 1400, 1128, "Mecanica Sanctas — afresco com motores entre anjos", f_case_mecanica_sanctas_08_1676),
      img(f_case_mecanica_sanctas_09_1400, 1400, 949, "Mecanica Sanctas — luva e página 'In ferro veritas'", f_case_mecanica_sanctas_09_1991),
      { ...img(f_case_mecanica_sanctas_10_1400, 1400, 1737, "Mecanica Sanctas — jaqueta de couro com pintura sacra nas costas", f_case_mecanica_sanctas_10_2176), meia: true },
      { ...img(f_case_mecanica_sanctas_11_1400, 1400, 1749, "Mecanica Sanctas — cartaz 'Vade retro Sátana'", f_case_mecanica_sanctas_11_2161), meia: true },
      img(f_case_mecanica_sanctas_12_1400, 1400, 1172, "Mecanica Sanctas — estátuas de santos com chave inglesa e engrenagem", f_case_mecanica_sanctas_12_1612),
    ],
  },
  {
    slug: "hoki",
    title: "Hōki",
    disciplines: ["Visual Identity", "UI Concept"],
    credits: [],
    about: [
      "hōki is a wellness and stress-relief company focused on scientific, accessible, and practical solutions for everyday life. Its ecosystem combines supplements designed to support stress hormone balance, a physical breathing tool inspired by ancient Japanese practices, and an app focused on building healthier routines and habits.",
      "To translate this positioning, I developed a minimalist and technology-driven visual identity that balances contemporary innovation with subtle references to the Japanese tradition connected to the brand’s name.",
      "The visual direction was created to convey clarity, trust, and lightness. The blue tones reinforce feelings of calmness, mental balance, and well-being, while the earthy brown and orange accents introduce warmth, dynamism, and a more human touch to the identity.",
      "The graphic elements, typography, and compositions follow a clean and functional approach, creating a modern and scientific perception without losing emotional proximity. The result is a versatile, sophisticated, and digital-first identity capable of positioning hōki as an innovative brand within the mental wellness and stress-relief space.",
      "Project developed by me at Design With blink* (my current job).",
    ],
    cover: img(f_art_hoki_1400, 1280, 960, "Hōki — capa"),
    images: [
      img(f_case_hoki_01_1400, 1400, 788, "Hōki — marca HŌKI sobre branco", f_case_hoki_01_1920),
      img(f_case_hoki_02_1400, 1400, 788, "Hōki — nome HŌKI desenhado com corrente dourada", f_case_hoki_02_1920),
      img(f_case_hoki_03_1400, 1400, 792, "Hōki — ícone do app e mulher relaxando com depoimento", f_case_hoki_03_1908),
      img(f_case_hoki_04_1400, 1400, 788, "Hōki — cápsula com a marca e cartaz com homem de olhos fechados", f_case_hoki_04_1920),
      img(f_case_hoki_05_1400, 1400, 788, "Hōki — tela do app hōki Routine com moedas douradas", f_case_hoki_05_1920),
      img(f_case_hoki_06_1400, 1400, 792, "Hōki — silhueta e colar dourado de respiração sobre céu", f_case_hoki_06_1908),
      img(f_case_hoki_07_1400, 1400, 788, "Hōki — selos '3 Jahre Entwicklung' sobre padrão azul", f_case_hoki_07_1920),
      img(f_case_hoki_08_1400, 1400, 792, "Hōki — cápsula Happī e frasco do suplemento", f_case_hoki_08_1908),
      img(f_case_hoki_09_1400, 1400, 788, "Hōki — frascos Happī com galhos de cerejeira", f_case_hoki_09_1920),
    ],
  },
  {
    slug: "alex-archer",
    title: "Alex Archer ®",
    year: 2026,
    disciplines: ["Branding", "Visual Identity"],
    credits: [{ name: "Mateus Bredoff", role: "Visual Identity & Art direction" }],
    behanceUrl: "https://www.behance.net/gallery/245777185/Alex-Archer",
    about: [
      "Alex Archer is conceived as a study of constructed presence, structured around architectural principles of repetition, precision and spatial control. The symbol emerges from the layering of horizontal modules, forming a stratified composition that references construction sections and structural support systems, establishing the logical foundation that guides the grid, typographic rhythm and visual organization across applications.",
      "The typography was developed through subtle adjustments in proportion and spacing, ensuring technical clarity and editorial coherence throughout the system. Direct contrasts, generous areas of negative space and rigorous alignments define a restrained visual language in which every element responds to a clear and predictable structure.",
      "Photography operates as an extension of this constructive logic, exploring architectural framing, dramatic light incidence and the repetition of human scale as a narrative device. Printed materials, posters and digital applications follow the same modular principles, consolidating an integrated, technical visual identity built on precise relationships between image, space and art direction.",
    ],
    cover: img(aa01, 3840, 2804, "Alex Archer — identidade visual", aa01x),
    images: [
      img(ax02, 1400, 1128, "Alex Archer — revista com retrato e a marca em grande escala", ax02x),
      img(ax03, 1400, 1126, "Alex Archer — livro 'Shapers of the Void'", ax03x),
      img(ax04, 1400, 1128, "Alex Archer — símbolo de módulos horizontais em luz", ax04x),
      img(ax05, 1400, 1130, "Alex Archer — site do estúdio com fotografia de arquitetura", ax05x),
      img(ax06, 1400, 1128, "Alex Archer — grupo nos degraus sob luz dura", ax06x),
      img(ax07, 1400, 1075, "Alex Archer — escada em espiral vista de baixo", ax07x),
      img(ax08, 1400, 1068, "Alex Archer — assinatura horizontal com símbolo e nome", ax08x),
      { ...img(ax09, 1400, 1075, "Alex Archer — caixa de cartões preta com a marca em relevo", ax09x), meia: true },
      { ...img(ax10, 1400, 1075, "Alex Archer — cartazes 'Structure (Presence)' com silhuetas", ax10x), meia: true },
      img(ax11, 1400, 1075, "Alex Archer — cartazes pendurados em série", ax11x),
      img(ax12, 1400, 1075, "Alex Archer — mãos segurando a publicação 'House N.01'", ax12x),
    ],
  },
  {
    slug: "magic-flight",
    title: "Magic Flight",
    disciplines: ["Visual Identity", "UI Concept"],
    credits: [],
    about: [
      "MagicFlight is a travel newsletter that helps travelers find and book cheap flights. It scans airlines for error fares, unadvertised deals, and flash sales, then alerts its members in real time.",
      "The company’s mission is to help travelers save hundreds of dollars on flights without the need to search manually.",
      "For this project, I created a simple yet scalable visual identity. The visuals feel friendly while still conveying solidity and trust. There’s also a sense of dynamism throughout the system, designed to evoke movement and inspire travel.",
    ],
    cover: img(f_art_magic_flight_1400, 1400, 1050, "Magic Flight — capa", f_art_magic_flight_1440),
    images: [
      img(f_case_magic_flight_01_1400, 1400, 788, "Magic Flight — marca MagicFlight sobre branco", f_case_magic_flight_01_1920),
      img(f_case_magic_flight_02_1400, 1400, 788, "Magic Flight — painel de marca com tipografia, cores e ícones", f_case_magic_flight_02_1920),
      img(f_case_magic_flight_03_1400, 1400, 788, "Magic Flight — site em notebook sobre poltrona laranja", f_case_magic_flight_03_1920),
      img(f_case_magic_flight_04_1400, 1400, 788, "Magic Flight — interface de busca de destinos sobre verde", f_case_magic_flight_04_1920),
      img(f_case_magic_flight_05_1400, 1400, 788, "Magic Flight — anúncio 'Tired of searching for flight deals?'", f_case_magic_flight_05_1920),
    ],
  },
  {
    slug: "proxima",
    title: "Próxima",
    disciplines: ["Visual Identity"],
    credits: [],
    about: [
      "In short, Próxima is a brand connected to the tangible asset investment sector, with a focus on crypto, mining, and strategic allocation in real-value assets. Its proposal is to combine the growth potential of the crypto universe with the security and solidity of more concrete investments, creating a bridge between technology, performance, and wealth protection.",
      "Inspired by the theme of space, the brand was built to convey sophistication, innovation, and trust through a modern and precise visual identity, positioning Próxima as a serious and well-structured solution within a highly competitive market.",
      "Project developed by me at Design With blink* (my current job).",
    ],
    cover: img(f_art_proxima_1400, 1400, 1050, "Próxima — capa", f_art_proxima_2160),
    images: [
      { ...img(f_case_proxima_01_1400, 1400, 1750, "Próxima — cartaz com a marca diante de planeta azul", f_case_proxima_01_2160), meia: true },
      { ...img(f_case_proxima_02_1400, 1400, 1750, "Próxima — casal passando diante de painel iluminado", f_case_proxima_02_2160), meia: true },
      { ...img(f_case_proxima_03_1400, 1400, 1750, "Próxima — painel 'Digitale Zukunft' com ícones de vidro", f_case_proxima_03_2160), meia: true },
      { ...img(f_case_proxima_04_1400, 1400, 1750, "Próxima — cartazes com a marca sobre luz azul", f_case_proxima_04_2160), meia: true },
      { ...img(f_case_proxima_05_1400, 1400, 1750, "Próxima — símbolo Próxima em cinza sobre preto", f_case_proxima_05_2160), meia: true },
      { ...img(f_case_proxima_06_1400, 1400, 1750, "Próxima — card 'Nachhaltige Innovationen' sobre grade azul", f_case_proxima_06_2160), meia: true },
      { ...img(f_case_proxima_07_1400, 1400, 1750, "Próxima — cartões de visita com a marca em relevo", f_case_proxima_07_2160), meia: true },
      { ...img(f_case_proxima_08_1400, 1400, 1750, "Próxima — sala de servidores com a marca em metal", f_case_proxima_08_2160), meia: true },
      { ...img(f_case_proxima_09_1400, 1400, 1750, "Próxima — rocha com o símbolo gravado", f_case_proxima_09_2160), meia: true },
      { ...img(f_case_proxima_10_1400, 1400, 1750, "Próxima — ícones de vidro com o símbolo sob luz azul", f_case_proxima_10_2160), meia: true },
    ],
  },
  {
    slug: "nike-through-the-ages",
    title: "Nike Through the Ages",
    disciplines: ["Art Direction", "AI Imagery"],
    credits: [],
    about: [
      "I set out to create a visual study of a brand I have always followed and that has a strong impact on the world of fashion and culture, Nike. The idea was to imagine how the brand’s symbol could exist in different periods of history, moving across eras, contexts, and aesthetics while maintaining a recognizable identity over time.  The entire project was built using AI generated images, aiming for a very specific visual consistency. I worked with a more documentary approach, simulating photos taken with direct flash from an iPhone 11, with hard light, strong contrast, and a more raw and immediate feel.  Attention to detail was essential throughout the process. Material textures, signs of use, imperfections, dirt, wear, and different qualities of light helped create a sense of time and context in each scene. The goal was for the symbol to feel like part of that moment in history, rather than something added afterward.  This was an exercise mainly focused on art direction, aesthetic consistency, and building context through imagery.",
    ],
    cover: img(f_art_nike_through_the_ages_1400, 1400, 1050, "Nike Through the Ages — capa", f_art_nike_through_the_ages_1856),
    images: [
      { ...img(f_case_nike_through_the_ages_01_1400, 1400, 1738, "Nike Through the Ages — capa 'Just did it' com fivela Nike no cinto", f_case_nike_through_the_ages_01_1856), meia: true },
      { ...img(f_case_nike_through_the_ages_02_1400, 1400, 1737, "Nike Through the Ages — cavaleiro medieval com espada em forma de swoosh", f_case_nike_through_the_ages_02_1857), meia: true },
      { ...img(f_case_nike_through_the_ages_03_1400, 1400, 1738, "Nike Through the Ages — sapato de baile com swoosh em cristais", f_case_nike_through_the_ages_03_1856), meia: true },
      { ...img(f_case_nike_through_the_ages_04_1400, 1400, 1720, "Nike Through the Ages — botão com swoosh em casaco sujo de lama", f_case_nike_through_the_ages_04_1875), meia: true },
      { ...img(f_case_nike_through_the_ages_05_1400, 1400, 1738, "Nike Through the Ages — sandália gasta com swoosh de metal", f_case_nike_through_the_ages_05_1856), meia: true },
      { ...img(f_case_nike_through_the_ages_06_1400, 1400, 1738, "Nike Through the Ages — bateia de ouro com swoosh gravado", f_case_nike_through_the_ages_06_1856), meia: true },
      { ...img(f_case_nike_through_the_ages_07_1400, 1400, 1738, "Nike Through the Ages — braçadeira de samurai com swoosh de couro", f_case_nike_through_the_ages_07_1856), meia: true },
      { ...img(f_case_nike_through_the_ages_08_1400, 1400, 1738, "Nike Through the Ages — rosto pintado com swoosh em vermelho", f_case_nike_through_the_ages_08_1856), meia: true },
      { ...img(f_case_nike_through_the_ages_09_1400, 1400, 1721, "Nike Through the Ages — tigela com swoosh em kintsugi dourado", f_case_nike_through_the_ages_09_1856), meia: true },
      { ...img(f_case_nike_through_the_ages_10_1400, 1400, 1738, "Nike Through the Ages — cinto de couro com fivela NIKE", f_case_nike_through_the_ages_10_1856), meia: true },
      { ...img(f_case_nike_through_the_ages_11_1400, 1400, 1738, "Nike Through the Ages — mão com mosquetão em forma de swoosh na neve", f_case_nike_through_the_ages_11_1856), meia: true },
      { ...img(f_case_nike_through_the_ages_12_1400, 1400, 1738, "Nike Through the Ages — pingente de jade em forma de swoosh", f_case_nike_through_the_ages_12_1856), meia: true },
      { ...img(f_case_nike_through_the_ages_13_1400, 1400, 1738, "Nike Through the Ages — fivela de prata com swoosh no jeans", f_case_nike_through_the_ages_13_1856), meia: true },
      { ...img(f_case_nike_through_the_ages_14_1400, 1400, 1738, "Nike Through the Ages — bota com swoosh na superfície da Lua", f_case_nike_through_the_ages_14_1856), meia: true },
    ],
  },
  {
    slug: "adventure-time",
    title: "Adventure Time",
    disciplines: ["Art Direction", "AI Imagery"],
    credits: [],
    about: [
      "In this Art Direction + AI study, I decided to explore the mystical and peculiar side of Adventure Time. My main focus was materiality. I moved away from the show’s simplified linework to pursue real textures, raw details, and realistic surfaces that create an aesthetic that feels both unsettling and fascinating at the same time.",
      "For each character, I chose a different material as a reference: rustic ceramics, luxury finishes, and the wear of time. My intention was to create objects that the viewer could almost feel through the screen.",
    ],
    cover: img(f_art_adventure_time_1400, 1400, 1050, "Adventure Time — capa", f_art_adventure_time_2175),
    images: [
      { ...img(f_case_adventure_time_01_1400, 1400, 1738, "Adventure Time — escultura preta de monstro com vários olhos", f_case_adventure_time_01_2175), meia: true },
      { ...img(f_case_adventure_time_02_1400, 1400, 1737, "Adventure Time — Finn em cerâmica dentro de cubo de metal", f_case_adventure_time_02_2176), meia: true },
      { ...img(f_case_adventure_time_03_1400, 1400, 1738, "Adventure Time — personagem de madeira pintada em cozinha", f_case_adventure_time_03_2175), meia: true },
      { ...img(f_case_adventure_time_04_1400, 1400, 1738, "Adventure Time — figura alada em cerâmica com chama na cabeça", f_case_adventure_time_04_2175), meia: true },
      { ...img(f_case_adventure_time_05_1400, 1400, 1738, "Adventure Time — personagem de cerâmica verde com chapéu", f_case_adventure_time_05_2175), meia: true },
      { ...img(f_case_adventure_time_06_1400, 1400, 1738, "Adventure Time — coruja de resina âmbar com asas", f_case_adventure_time_06_2175), meia: true },
      { ...img(f_case_adventure_time_07_1400, 1400, 1738, "Adventure Time — figura com vestido entre serpentes verdes", f_case_adventure_time_07_2175), meia: true },
      { ...img(f_case_adventure_time_08_1400, 1400, 1738, "Adventure Time — Lich esculpido em argila", f_case_adventure_time_08_2175), meia: true },
      { ...img(f_case_adventure_time_09_1400, 1400, 1738, "Adventure Time — personagem rosa de cerâmica com caneca em sala amarela", f_case_adventure_time_09_2175), meia: true },
      { ...img(f_case_adventure_time_10_1400, 1400, 1800, "Adventure Time — elefante de cerâmica com quatro cabeças", f_case_adventure_time_10_2100), meia: true },
      { ...img(f_case_adventure_time_11_1400, 1400, 1738, "Adventure Time — busto de vampiro com anatomia exposta", f_case_adventure_time_11_2175), meia: true },
      { ...img(f_case_adventure_time_12_1400, 1400, 1738, "Adventure Time — letreiro Adventure Time em ateliê de cerâmica", f_case_adventure_time_12_2175), meia: true },
      { ...img(f_case_adventure_time_13_1400, 1400, 1750, "Adventure Time — folha com os personagens desenhados", f_case_adventure_time_13_2160), meia: true },
    ],
  },
  {
    slug: "stag",
    title: "Stag",
    year: 2025,
    disciplines: ["Branding", "Visual Identity"],
    credits: [{ name: "Yara Hoffman", role: "Creative Direction, Strategy" }],
    behanceUrl: "https://www.behance.net/gallery/243272967/Stag-Grid-Fashion-Editorial",
    about: [],
    contentPending: true,
    cover: img(artStag, 2800, 2253, "Stag — editorial de moda", artStagX),
    images: [
      img(sg01, 1400, 1129, "Stag — modelo com máscara de cervo dourada e luvas pretas", sg01x),
      { ...img(sg02, 1400, 1740, "Stag — modelo com brinco em forma de galhada", sg02x), meia: true },
      { ...img(sg03, 1400, 1739, "Stag — costas com colar de galhada dourada", sg03x), meia: true },
      { ...img(sg04, 1400, 1739, "Stag — modelo com colar de galhada sobre tecido marrom", sg04x), meia: true },
      img(sg05, 1400, 983, "Stag — perfil com brinco de galhada sobre fundo marrom", sg05x),
      { ...img(sg06, 1400, 1738, "Stag — modelo de vestido longo com braceletes de galhada", sg06x), meia: true },
      img(sg07, 1400, 1248, "Stag — modelo com anéis de galhada sobre fundo preto", sg07x),
      { ...img(sg09, 1400, 1740, "Stag — modelo com top de galhada em passarela", sg09x), meia: true },
      { ...img(sg10, 1400, 1739, "Stag — detalhe de broche de cervo dourado no ombro", sg10x), meia: true },
    ],
  },
  {
    slug: "lama-10",
    title: "Lama 10",
    disciplines: ["Art Direction", "AI Imagery"],
    credits: [],
    about: [
      "Canva-inspired but enhanced, Lama 10 is an AI company focused on image and video creation. Its goal is to become a more powerful and creatively flexible version of Canva. The company was looking for an identity that felt creative yet grounded, something capable of positioning the brand as innovative while still maintaining a sense of professionalism and credibility.",
      "Based on that, I created a series of launch campaign visuals that translated this balance aesthetically throughout the imagery.",
      "I developed a universe where the brand’s 3D icon appears interacting with real-world elements, as well as with different brand applications.",
    ],
    cover: img(f_art_lama_10_1400, 1400, 1050, "Lama 10 — capa", f_art_lama_10_2475),
    images: [
      { ...img(f_case_lama_10_01_1400, 1400, 1738, "Lama 10 — lhama de acrílico cheia de fichas roxas", f_case_lama_10_01_1856), meia: true },
      { ...img(f_case_lama_10_02_1400, 1400, 1738, "Lama 10 — mulher com ícone de lhama em cenário roxo e laranja", f_case_lama_10_02_1856), meia: true },
      { ...img(f_case_lama_10_03_1400, 1400, 1738, "Lama 10 — mulher montada em lhama no estúdio", f_case_lama_10_03_1856), meia: true },
      { ...img(f_case_lama_10_04_1400, 1400, 1738, "Lama 10 — bonés Lama10 roxos e laranja", f_case_lama_10_04_1856), meia: true },
      { ...img(f_case_lama_10_05_1400, 1400, 1738, "Lama 10 — mulher sentada em lhama de pixels", f_case_lama_10_05_1856), meia: true },
      { ...img(f_case_lama_10_06_1400, 1400, 1738, "Lama 10 — mulher deitada entre ícones de lhama", f_case_lama_10_06_1856), meia: true },
      { ...img(f_case_lama_10_07_1400, 1400, 1738, "Lama 10 — cacto de pixels em vaso laranja", f_case_lama_10_07_1856), meia: true },
      { ...img(f_case_lama_10_08_1400, 1400, 1738, "Lama 10 — mulher em lhama empinada no estúdio", f_case_lama_10_08_1856), meia: true },
      { ...img(f_case_lama_10_09_1400, 1400, 1738, "Lama 10 — mulher abraçando ícone de lhama", f_case_lama_10_09_1856), meia: true },
      img(f_case_lama_10_10_1400, 1400, 1128, "Lama 10 — semáforo com lhama verde em néon", f_case_lama_10_10_2304),
      img(f_case_lama_10_11_1400, 1400, 781, "Lama 10 — lhama de terno laranja segurando bandeira Lama10", f_case_lama_10_11_2800),
      img(f_case_lama_10_12_1400, 1400, 1128, "Lama 10 — lhama de óculos vista por lente olho de peixe", f_case_lama_10_12_2304),
      { ...img(f_case_lama_10_13_1400, 1400, 1738, "Lama 10 — mulher com notebook no cenário", f_case_lama_10_13_1856), meia: true },
      { ...img(f_case_lama_10_14_1400, 1400, 1738, "Lama 10 — mulher regando cacto de pixels", f_case_lama_10_14_1856), meia: true },
      { ...img(f_case_lama_10_15_1400, 1400, 1738, "Lama 10 — rapaz com gorro de lhama sobre laranja", f_case_lama_10_15_1856), meia: true },
    ],
  },
  {
    slug: "neox",
    title: "Neox",
    year: 2025,
    disciplines: ["Technical Apparel", "Visual Identity"],
    credits: [],
    behanceUrl: "https://www.behance.net/gallery/247842007/Neox",
    about: [
      "Neox is a brand launched in Japan that operates at the intersection of garments and objects, developing pieces based on the relationship between form, material, and presence on the body. Its visual language is rooted in the retrofuturistic aesthetic of the early 2000s (Y2K), featuring metallic surfaces, organic shapes, and a technological tone that still feels contemporary. Rather than following trends, the brand builds a continuous visual system where each release reinforces a consistent and recognizable logic.",
      "At the same time, Neox is not limited to a specific territory or culture. Despite its origins in Japan, its approach is universal, aiming to connect across different contexts through a clear and direct visual language. The brand establishes a balance between past and present, using early 2000s references as a foundation to build something contemporary, where retro and current elements coexist with precision.",
      "In this project, I developed the entire photographic direction, 3D work (including AI-generated imagery), and part of the mockup creation. Essentially, all visual aspects of the project were created by me.",
    ],
    cover: img(artNeox, 1400, 1663, "Neox — vestuário técnico"),
    images: [
      { ...img(nx01, 1400, 1738, "Neox — regata de tela suspensa por cabos", nx01x), meia: true },
      { ...img(nx02, 1400, 1738, "Neox — modelo com óculos e anel diante de halo de luz", nx02x), meia: true },
      { ...img(nx03, 1400, 1738, "Neox — modelo em plongée com a mão aberta para a câmera", nx03x), meia: true },
      { ...img(nx04, 1400, 1738, "Neox — modelo agachado sobre fundo claro", nx04x), meia: true },
      { ...img(nx05, 1400, 1738, "Neox — modelo de macacão jeans em pose baixa", nx05x), meia: true },
      { ...img(nx06, 1400, 1738, "Neox — nuca raspada com a marca Neox", nx06x), meia: true },
      { ...img(nx07, 1400, 1738, "Neox — modelo com fones prateados e regata Neox", nx07x), meia: true },
      { ...img(nx08, 1400, 1738, "Neox — look branco de corpo inteiro", nx08x), meia: true },
      img(nx09, 1400, 1128, "Neox — modelo deitada sobre disco metálico", nx09x),
      { ...img(nx10, 1400, 2509, "Neox — chaveiro metálico com o símbolo Neox", nx10x), meia: true },
      { ...img(nx11, 1400, 1737, "Neox — modelo em traje cromado com tênis", nx11x), meia: true },
      { ...img(nx12, 1400, 1737, "Neox — modelo vista de cima em movimento", nx12x), meia: true },
      { ...img(nx13, 1400, 1737, "Neox — modelo ajustando os óculos", nx13x), meia: true },
      { ...img(nx14, 1400, 1737, "Neox — modelo em traje de tela e calça cargo", nx14x), meia: true },
      img(nx15, 1400, 1128, "Neox — capa de celular metálica de forma orgânica", nx15x),
    ],
  },
  {
    slug: "infinos",
    title: "Infinos",
    disciplines: ["Website Design"],
    credits: [],
    about: [
      "Infinos is a company that provides medical support for weight loss. They manage the entire treatment process, including medication, follow-up care, diet planning, and also a course designed to help people build a new lifestyle within a few months.",
      "The challenge for this website was to create something that felt serious and professional, while still maintaining a strong human-centered approach.",
      "In the end, I created a solid and clean visual identity that helps communicate the company’s commitment, professionalism, and dedication to its clients.",
    ],
    cover: img(f_art_infinos_1400, 1400, 1050, "Infinos — topo do site em janela de navegador", f_art_infinos_2800),
    images: [
      img(f_case_infinos_01_1400, 1400, 1117, "Infinos — página do site em janela de navegador, trecho 1 de 9", f_case_infinos_01_2800),
      img(f_case_infinos_02_1400, 1400, 1117, "Infinos — página do site em janela de navegador, trecho 2 de 9", f_case_infinos_02_2800),
      img(f_case_infinos_03_1400, 1400, 1117, "Infinos — página do site em janela de navegador, trecho 3 de 9", f_case_infinos_03_2800),
      img(f_case_infinos_04_1400, 1400, 1117, "Infinos — página do site em janela de navegador, trecho 4 de 9", f_case_infinos_04_2800),
      img(f_case_infinos_05_1400, 1400, 1117, "Infinos — página do site em janela de navegador, trecho 5 de 9", f_case_infinos_05_2800),
      img(f_case_infinos_06_1400, 1400, 1117, "Infinos — página do site em janela de navegador, trecho 6 de 9", f_case_infinos_06_2800),
      img(f_case_infinos_07_1400, 1400, 1117, "Infinos — página do site em janela de navegador, trecho 7 de 9", f_case_infinos_07_2800),
      img(f_case_infinos_08_1400, 1400, 1117, "Infinos — página do site em janela de navegador, trecho 8 de 9", f_case_infinos_08_2800),
      img(f_case_infinos_09_1400, 1400, 626, "Infinos — página do site em janela de navegador, trecho 9 de 9", f_case_infinos_09_2800),
    ],
  },
  {
    slug: "resieben",
    title: "Resieben",
    disciplines: ["Website Design"],
    credits: [],
    about: [
      "Resieben is a marketing agency focused on organic strategies, working primarily with healthcare clinics. The company was looking for a flat design approach, something outside the usual standards of the industry, with a technological feel and strong personality. The orange color was a key requirement in the brief, as well as an unconventional color combination for the segment, with the typography and the logo bar acting as the main visual elements.",
      "In my proposal, I built something clean, functional, and different from the usual, while still maintaining a striking and impactful visual presence.",
    ],
    cover: img(f_art_resieben_1400, 1400, 1050, "Resieben — topo do site em janela de navegador", f_art_resieben_2800),
    images: [
      img(f_case_resieben_01_1400, 1400, 1117, "Resieben — página do site em janela de navegador, trecho 1 de 10", f_case_resieben_01_2800),
      img(f_case_resieben_02_1400, 1400, 1117, "Resieben — página do site em janela de navegador, trecho 2 de 10", f_case_resieben_02_2800),
      img(f_case_resieben_03_1400, 1400, 1117, "Resieben — página do site em janela de navegador, trecho 3 de 10", f_case_resieben_03_2800),
      img(f_case_resieben_04_1400, 1400, 1117, "Resieben — página do site em janela de navegador, trecho 4 de 10", f_case_resieben_04_2800),
      img(f_case_resieben_05_1400, 1400, 1117, "Resieben — página do site em janela de navegador, trecho 5 de 10", f_case_resieben_05_2800),
      img(f_case_resieben_06_1400, 1400, 1117, "Resieben — página do site em janela de navegador, trecho 6 de 10", f_case_resieben_06_2800),
      img(f_case_resieben_07_1400, 1400, 1117, "Resieben — página do site em janela de navegador, trecho 7 de 10", f_case_resieben_07_2800),
      img(f_case_resieben_08_1400, 1400, 1117, "Resieben — página do site em janela de navegador, trecho 8 de 10", f_case_resieben_08_2800),
      img(f_case_resieben_09_1400, 1400, 1117, "Resieben — página do site em janela de navegador, trecho 9 de 10", f_case_resieben_09_2800),
      img(f_case_resieben_10_1400, 1400, 681, "Resieben — página do site em janela de navegador, trecho 10 de 10", f_case_resieben_10_2800),
    ],
  },
  {
    slug: "muhlwald",
    title: "Mühlwald",
    disciplines: ["Website Design"],
    credits: [],
    about: [
      "This was a website created for the community of Mühlwald, a small commune in Italy that welcomes many tourists every year. The focus was on creating a simple yet functional website that could convey the essence, history, and traditions of the place.",
      "The visual direction is clean and functional, with a strong emphasis on content.",
    ],
    cover: img(f_art_muhlwald_1400, 1400, 1050, "Mühlwald — topo do site em janela de navegador", f_art_muhlwald_2800),
    images: [
      img(f_case_muhlwald_01_1400, 1400, 1117, "Mühlwald — página do site em janela de navegador, trecho 1 de 8", f_case_muhlwald_01_2800),
      img(f_case_muhlwald_02_1400, 1400, 1117, "Mühlwald — página do site em janela de navegador, trecho 2 de 8", f_case_muhlwald_02_2800),
      img(f_case_muhlwald_03_1400, 1400, 1117, "Mühlwald — página do site em janela de navegador, trecho 3 de 8", f_case_muhlwald_03_2800),
      img(f_case_muhlwald_04_1400, 1400, 1117, "Mühlwald — página do site em janela de navegador, trecho 4 de 8", f_case_muhlwald_04_2800),
      img(f_case_muhlwald_05_1400, 1400, 1117, "Mühlwald — página do site em janela de navegador, trecho 5 de 8", f_case_muhlwald_05_2800),
      img(f_case_muhlwald_06_1400, 1400, 1117, "Mühlwald — página do site em janela de navegador, trecho 6 de 8", f_case_muhlwald_06_2800),
      img(f_case_muhlwald_07_1400, 1400, 1117, "Mühlwald — página do site em janela de navegador, trecho 7 de 8", f_case_muhlwald_07_2800),
      img(f_case_muhlwald_08_1400, 1400, 376, "Mühlwald — página do site em janela de navegador, trecho 8 de 8", f_case_muhlwald_08_2800),
    ],
  },
];

export const findWork = (slug?: string) => WORK.find((w) => w.slug === slug);

/**
 * Cases do CMS do Framer que ainda não estão na coleção. Vazio desde 15/10/2026:
 * `proxima` entrou com a arte do Figma do Mateus.
 */
export const MISSING_FROM_CMS = [] as const;
