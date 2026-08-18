/**
 * Uma palavra que encosta EXATAMENTE nas duas margens, em qualquer largura.
 *
 * `textLength` + `lengthAdjust="spacingAndGlyphs"` é o único jeito de garantir
 * isso: `font-size` em `vw` erra por alguns pixels a cada breakpoint, e num
 * layout cuja régua é a margem, errar a margem é errar tudo.
 */
export default function Palavra({
  texto,
  className = "",
  peso = 500,
}: {
  texto: string;
  className?: string;
  peso?: number;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 1000 190"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={texto}
    >
      <text x="0" y="150" textLength="1000" lengthAdjust="spacingAndGlyphs" fontSize="190" fontWeight={peso}>
        {texto}
      </text>
    </svg>
  );
}
