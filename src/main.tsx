
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import "./styles/index.css";

  /* Marca que o JS está vivo. É o que autoriza o CSS a esconder o que vai ser
     revelado por máscara (ver `.js [data-reveal]` em styles/system.css): sem
     esta classe o texto permanece visível, então uma falha de script degrada
     para "sem animação" em vez de "página em branco". Roda antes do render de
     propósito — depois, haveria um frame com o texto já pintado. */
  document.documentElement.classList.add("js");

  createRoot(document.getElementById("root")!).render(<App />);
