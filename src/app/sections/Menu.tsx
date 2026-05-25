import { useEffect, useState } from "react";
import { motion } from "motion/react";
import ConnectButton from "./ConnectButton";

/**
 * Menu — top bar of the Framer site (the "Menu" Design-to-AI export, rebuilt).
 * BREDOFF© · live clock (São Paulo / BRT) · Currently/Available · Menu.
 * Off-white text with mix-blend-difference so it reads on any background.
 */

const timeFmt = new Intl.DateTimeFormat("pt-BR", {
  timeZone: "America/Sao_Paulo",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
  timeZoneName: "short",
});
const dateFmt = new Intl.DateTimeFormat("pt-BR", {
  timeZone: "America/Sao_Paulo",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

function useBrazilClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const parts = timeFmt.formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const tz = (parts.find((p) => p.type === "timeZoneName")?.value ?? "").trim();
  const time = `${get("hour")}:${get("minute")}:${get("second")} ${tz}`;
  return { time, date: dateFmt.format(now) };
}

const reveal = {
  initial: { opacity: 0, y: -8 },
  animate: { opacity: 1, y: 0 },
};
const ease = [0.16, 1, 0.3, 1] as const;

export default function Menu() {
  const { time, date } = useBrazilClock();

  return (
    <>
    <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[60px] font-['Geist:Medium',sans-serif] text-[14px] font-medium leading-[1.1] tracking-[-0.03em] text-[#ede6e1] mix-blend-difference">
      {/* BREDOFF© */}
      <motion.a
        href="/"
        className="pointer-events-auto absolute left-[9px] top-[7px] whitespace-pre"
        {...reveal}
        transition={{ duration: 0.7, ease }}
      >
        BREDOFF©
      </motion.a>

      {/* Live clock */}
      <motion.div
        className="absolute left-[25.3%] top-[8px] whitespace-nowrap tabular-nums"
        {...reveal}
        transition={{ duration: 0.7, ease, delay: 0.06 }}
      >
        <p className="mb-0">{time}</p>
        <p className="opacity-55">{date}</p>
      </motion.div>

      {/* Availability */}
      <motion.div
        className="absolute left-[68.8%] top-[8px] whitespace-nowrap"
        {...reveal}
        transition={{ duration: 0.7, ease, delay: 0.12 }}
      >
        <p className="mb-0">Currently</p>
        <p className="opacity-55">Available for work</p>
      </motion.div>

    </div>

      {/* Menu → Connect Button (rebuilt Framer "Connect Button 2"): collapsed
          "Menu" pill that expands into the contact panel on hover. Lives outside
          the mix-blend-difference layer so its dark panel renders true. */}
      <ConnectButton />
    </>
  );
}
