/**
 * Máscara de TERRA do planeta — 180 × 91 células de 2°, uma por bit.
 *
 * Existe porque o globo da home era uma gaiola de meridianos: linha de grade
 * sem massa nenhuma, que não lê como Terra e não diz "worldwide" — diz
 * "placeholder". Continente exige dado; dado exige ou uma dependência de mapa
 * (d3-geo + topojson, ~100 kB no bundle) ou o contorno embutido. Está embutido.
 *
 * ## De onde veio, e por que em bits
 *
 * Natural Earth `ne_110m_land` (domínio público, a mesma base que o d3 usa),
 * 127 polígonos, amostrado offline por point-in-polygon numa grade de 2°:
 * 16.380 células, 5.392 de terra. O resultado empacota em 2.048 bytes — 2,7 kB
 * em base64, contra ~140 kB do GeoJSON e ~100 kB da dependência. O GeoJSON não
 * entra no repo: ele foi INSUMO, o produto é esta string.
 *
 * Resolução de 2° é deliberada: o globo desenha pontos de ~1,5 px, então
 * detalhe de costa abaixo disso não chegaria à tela. É a menor máscara que
 * ainda faz a América do Sul parecer a América do Sul.
 *
 * ⚠ A leitura é `terra(lat, lon)` — nesta ordem, e em GRAUS. A linha 0 é o polo
 * NORTE e a coluna 0 é a longitude −180: a grade cresce para o sul e para
 * leste, como uma imagem, não como o eixo Y do mundo.
 */
const MASCARA_B64 = 
  "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" +
  "AAAAAAAAAAf4AP/AAAAAAAAAAAAAAAAAAAAAAAAX/z///+AAAAAAAABAAAAAAAAAAAAAYd8P///wAA+AAAAAA8AA" +
  "AAAAAAAAAwAnw////4AAIAAAAAAGAAAAAAAAAAADivwAf//wAAAAADAAf/wAHYAAAAAADoi3sAP//gAAAAAMAD//" +
  "/sAAAAgBgACfwz/AD/+gAAAwAEHf///+/8gBAP/7/nJdjwD/+AAAH/AA7f///////f4P//////h8H/gAAAf/6//f" +
  "////////Mf/////9H4D8AeAA+ev///////////AP/////4A0B4AAAD5/////////////Af3////gHgA4AAAH5///" +
  "////////LwAHgH///gHkAAAAAH4/////////+CIAABAB///4D+AAAAGCx/////////4A8AAIAAf///n/gAAAOCD/" +
  "////////wA4AAAAAf///n/wAAAbP///////////AgAAAAAP/////wAAADf//////////9AAAAAAAF////0YAAAB/" +
  "//////////9AAAAAAAD////8EAAAB///////////5AAAAAAAD////2AAAAB/f5fP//////wAAAAAAAD////gAAAA" +
  "fxnwPP//////jAAAAAAAD////AAAAAPCb3/n/////+CAAAAAAAD///8AAAAAfALf/n////+ECAAAAAAAB///8AAA" +
  "AAGHQP/n/////mMAAAAAAAA///8AAAAAH+Ai///////E8AAAAAAAAf//wAAAAAP/AA///////BgAAAAAAAAP//gA" +
  "AAAAf/73///////gAAAAAAAAAD/AQAAAAAf////f/////gAAAAAAAAAF+AQAAAAB///+/n/////AAAAAAAAAAC+A" +
  "AAAAAB///+f0H////AAAAAAAAAAAeAwAAAAD////f/B///8gAAAAAAAAAAeGEAAAAH////v+B/z/AAAAAAAAAAAA" +
  "PMAgAAAD////n+A/B+gAAAAAAAAAAAD8AAAAAD////n4AeB/AgAAAAAAAAAAAPAAAAAH////3gAcAfAgAAAAAAAA" +
  "AAADAAAAAD////6AAcAfggAAAAAAAAAAABDwAAAD////8wAMATAIAAAAAAAAAAAAr/AAAB/////gAKASAAAAAAAA" +
  "AAAAAAH/gAAA/////gACAAAIAAAAAAAAAAAAH/8AAAaH///AAAAsGAAAAAAAAAAAAAH/+AAAAB//+AAAAUOAAAAA" +
  "AAAAAAAAP/+AAAAB//8AAAAYegAAAAAAAAAAAAP//gAAAD//4AAAAMeBgAAAAAAAAAAAP//8AAAB//wAAAAGdiuA" +
  "AAAAAAAAAAf///AAAA//wAAAACAQHgAAAAAAAAAAP///gAAA//wAAAABwAHwgAAAAAAAAAH///AAAA//wAAAAACI" +
  "DQIAAAAAAAAAH//+AAAAf/wAAAAAAAAAAAAAAAAAAAD//+AAAA//wgAAAAABxAAAAAAAAAAAD//+AAAA//wgAAAA" +
  "APxgBAAAAAAAAAA//8AAAA//jgAAAAAf5gAAAAAAAAAAAf/8AAAA//DgAAAAAf/gAAAAAAAAAAAf/8AAAAf/DAAA" +
  "AAD//4CAAAAAAAAAAf/wAAAAf/DAAAAAH//4AAAAAAAAAAAf/AAAAAf+CAAAAAH//8AAAAAAAAAAAf/AAAAAP8AA" +
  "AAAAH//+AAAAAAAAAAA/+AAAAAP8AAAAAAH//+AAAAAAAAAAA/+AAAAAH4AAAAAAD//+AAAAAAAAAAA/8AAAAAHw" +
  "AAAAAADwf8AAAAAAAAAAA/gAAAAAAAAAAAAACAH4AIAAAAAAAAB/wAAAAAAAAAAAAAAAD4AEAAAAAAAAB+AAAAAA" +
  "AAAAAAAAAAAAAGAAAAAAAAB6AAAAAAAAAAAAAAAAAwAMAAAAAAAAA8AAAAAAAAAAAAAAAAAQAYAAAAAAAAB4AAAA" +
  "AAAAAAAAAAAAAAAwAAAAAAAAB4AAAAAAAAAAAAAAAAAAAAAAAAAAAADwAAAAAAAAAACAAAAAAAAAAAAAAAAADgAA" +
  "AAAAAAAAAAAAAAAAAAAAAAAAAABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" +
  "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" +
  "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMAAAAAAAAAeAAIP+f/gAAAAAAAA" +
  "AAAMAAAAAAABP/+H//////AAAAAAAAAAA+AAAAAf////8////////AAAAAAAOEAPAAAB///////////////gAAAP" +
  "//T//8AAAH//////////////+AAAH/////4AAAH///////////////8AAE//////4ABw////////////////8AAA" +
  "D//////gCA////////////////wAAAf/////////////////////////+A/4A///////////////////////////" +
  "////////////////////////////////////////////////////////////AAAAAAAAAAAAAAAAAAAAAAAAAAAA" +
  "AAA=";

const BITS = (() => {
  const bin = atob(MASCARA_B64);
  const b = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) b[i] = bin.charCodeAt(i);
  return b;
})();

export const GRADE_LON = 180;
export const GRADE_LAT = 91;

/** `true` se o ponto cai em terra firme. Fora de faixa devolve `false`. */
export function terra(lat: number, lon: number): boolean {
  const linha = Math.floor((90 - lat) / 2);
  const col = Math.floor((lon + 180) / 2);
  if (linha < 0 || linha >= GRADE_LAT || col < 0 || col >= GRADE_LON) return false;
  const i = linha * GRADE_LON + col;
  return (BITS[i >> 3] & (128 >> (i & 7))) !== 0;
}
