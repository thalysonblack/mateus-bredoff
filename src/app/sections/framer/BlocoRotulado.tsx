/**
 * O padrão de composição que sustenta o site inteiro: **rótulo de 12px numa
 * coluna FIXA de 400px à esquerda, conteúdo à direita.**
 *
 * Fixa, nunca fracionária: o conteúdo começa em x=424 tanto em 1600px quanto
 * em 1200px. Como `25%` a coluna andaria entre larguras — e deriva de coluna é
 * o que mais denuncia uma réplica.
 *
 * Vive em `sections/framer/` e não dentro de uma página porque se repete na
 * home ("About me", "Featured projects", "Capabilities", "Contact") e na
 * `/about`. Duas cópias do mesmo padrão divergem na terceira alteração.
 */

export default function BlocoRotulado({
  rotulo,
  fio = true,
  children,
  className = "",
}: {
  rotulo: string;
  /** Fio de 1px no topo, separando do bloco anterior. */
  fio?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`grid grid-cols-1 gap-y-6 lg:grid-cols-[var(--fr-rotulo-col)_minmax(0,1fr)] ${className}`}
      style={{ paddingInline: "var(--fr-margem)" }}
    >
      <p className={`fr-secao-rotulo ${fio ? "border-t border-current/12 pt-[33px]" : ""}`}>
        {rotulo}
      </p>
      {/* O fio some no mobile: em coluna única ele separaria o rótulo do
          próprio conteúdo que ele nomeia, em vez de separar as seções. */}
      <div className={fio ? "border-t border-current/12 pt-[33px] max-lg:border-t-0 max-lg:pt-0" : ""}>
        {children}
      </div>
    </section>
  );
}
