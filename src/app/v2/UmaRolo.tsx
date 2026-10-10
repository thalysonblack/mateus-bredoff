import { useMetaRota } from "../../hooks/useMetaRota";
import { Prancha } from "./sistema";

/** one page — versão "Rolo" (em construção) */
export default function UmaRolo() {
  useMetaRota();
  return <Prancha n="01" nome="Index" superficie="tinta" status="Available for projects" rodape="completo"><section /></Prancha>;
}
