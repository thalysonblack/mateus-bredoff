import { LAB } from "../../content/lab";
import { findWork } from "../../content/work";
import { useMetaRota } from "../../hooks/useMetaRota";
import { Prancha } from "./sistema";

/**
 * FOLHA 04 — LAB. Os ensaios de marca fictícia.
 *
 * Superfície de TINTA, e é a única da V2 — o levantamento do revelatio mostrou
 * que lá as internas são quase todas de uma superfície só, e que a alternância
 * dura é dispositivo exclusivo da home. Aqui o escuro tem função de conteúdo: o
 * lab é ensaio, não trabalho de cliente, e a troca de ambiente diz isso antes
 * de qualquer rótulo.
 *
 * A mesma folha de espécimes da 01, com uma diferença que vem do material: três
 * dos seis ensaios não têm arte no repo (vivem só no Instagram dele). Em vez de
 * placeholder, esses viram espécime PURAMENTE tipográfico — o que é honesto e,
 * num lab de marca, é a própria matéria: nome desenhado é o começo de toda
 * identidade.
 */
export default function LabV2() {
  useMetaRota();

  return (
    <Prancha n="04" nome="Lab" superficie="tinta" status={`${LAB.length} experiments`} rodape="completo">
      <section className="pt-14 max-md:pt-8" data-atenua>
        <p className="p-corpo max-w-[46ch]">
          Fictional brands, built to test systems that a client brief would never
          ask for. No deadline, no approval — only the craft.
        </p>

        <ul className="pt-16 max-md:pt-10">
          {LAB.map((e, i) => {
            const foto = e.slug ? findWork(e.slug)?.cover : undefined;
            return (
              <li
                key={e.brand}
                className="p-especime-linha"
                style={{ ["--n" as string]: e.brand.length }}
              >
                <div
                  data-alvo
                  className="grid grid-cols-12 items-center py-5 max-md:py-4"
                  style={{ columnGap: "var(--p-gap-x)" }}
                >
                  <span className="p-marca col-span-1 self-start pt-3 max-md:col-span-2">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="p-especime col-span-6 max-md:col-span-10">{e.brand}</span>

                  <span className="p-especime-arte col-span-2 flex justify-end max-md:hidden">
                    {foto ? (
                      <img
                        src={foto.src}
                        alt=""
                        width={foto.w}
                        height={foto.h}
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                        className="h-[104px] w-auto object-cover"
                      />
                    ) : null}
                  </span>

                  <span className="p-marca col-span-3 self-start pt-3 text-right max-md:col-span-12 max-md:pt-2 max-md:text-left">
                    {e.discipline}
                    <span className="block pt-1" style={{ opacity: 0.88 }}>
                      {e.medium}
                    </span>
                  </span>
                </div>
              </li>
            );
          })}
          <li className="p-fio" />
        </ul>
      </section>
    </Prancha>
  );
}
