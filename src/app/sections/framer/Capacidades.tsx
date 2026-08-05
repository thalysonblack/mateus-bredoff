import { useState } from "react";

/**
 * Capabilities — cinco disciplinas em corpo de display, uma acesa por vez.
 *
 * Medido no original (@1600): 64px em x=424 (a coluna do rótulo), passo
 * vertical de ~85px, a primeira em `#260F0A` e as outras quatro no cinza
 * quieto. Não é lista de bullets nem tabela: a hierarquia inteira se faz com
 * COR sobre o mesmo corpo, e é isso que dá o silêncio da seção.
 *
 * A quieta recua em opacidade/cor, nunca em tamanho — mudar o corpo no hover
 * faria a página inteira pular, e a coluna perderia a régua.
 */

const DISCIPLINAS = [
  "Branding",
  "Art Direction",
  "Creative Direction",
  "Digital Design",
  "Brand Strategy",
];

export default function Capacidades() {
  /* A primeira nasce acesa, como no original — a seção nunca aparece toda
     apagada, nem depende de hover para ter um estado legível. */
  const [ativa, setAtiva] = useState(0);

  return (
    <ul className="fr-display-solto" onMouseLeave={() => setAtiva(0)}>
      {DISCIPLINAS.map((nome, i) => (
        <li key={nome}>
          <span
            className="block cursor-default transition-colors duration-300"
            style={{ color: i === ativa ? "var(--fr-marrom)" : "var(--fr-cinza)" }}
            onMouseEnter={() => setAtiva(i)}
            onFocus={() => setAtiva(i)}
            tabIndex={0}
          >
            {nome}
          </span>
        </li>
      ))}
    </ul>
  );
}
