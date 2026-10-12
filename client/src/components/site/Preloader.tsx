import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { EVENT } from "@/data/site";
import { EASE, EASE_OUT } from "./motion";
import { Torn } from "./Poster";

/**
 * Short, on-brand opening (≈1.2s): the poster's paper, the official logo and the
 * theme "Break The Pattern", then the page tears open to reveal the site.
 * It never waits on a fake counter — it leaves as soon as the page is ready.
 */
export function Preloader({ onReveal, onDone }: { onReveal: () => void; onDone: () => void }) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add("is-locked");
    const t = window.setTimeout(() => setLeaving(true), 1150);
    return () => {
      window.clearTimeout(t);
      document.documentElement.classList.remove("is-locked");
    };
  }, []);

  useEffect(() => {
    if (!leaving) return;
    document.documentElement.classList.remove("is-locked");
    const r = window.setTimeout(onReveal, 150);
    const t = window.setTimeout(onDone, 800);
    return () => {
      window.clearTimeout(r);
      window.clearTimeout(t);
    };
  }, [leaving, onDone, onReveal]);

  const words = ["Break", "The", "Pattern"];

  return (
    <div className="intro" aria-label="TEDx Thyna Youth — Break The Pattern" role="status" onClick={() => setLeaving(true)}>
      <motion.div className="intro-half is-top" animate={leaving ? { y: "-105%", rotate: -1.5 } : { y: 0 }} transition={{ duration: 0.75, ease: EASE }}>
        <Torn side="bottom" seed={9} className="intro-tear" color="var(--surface-paper)" />
      </motion.div>
      <motion.div className="intro-half is-bottom" animate={leaving ? { y: "105%", rotate: 1.5 } : { y: 0 }} transition={{ duration: 0.75, ease: EASE }}>
        <Torn side="top" seed={9} className="intro-tear" color="var(--surface-paper)" />
      </motion.div>

      <motion.div className="intro-content" animate={leaving ? { opacity: 0, scale: 0.97 } : { opacity: 1 }} transition={{ duration: 0.25 }}>
        <motion.img
          src="/media/logo.webp"
          alt=""
          className="intro-logo"
          initial={{ scale: 0.7, opacity: 0, rotate: -8 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ duration: 0.6, ease: EASE_OUT }}
        />
        <p className="intro-theme">
          {words.map((w, i) => (
            <span className="intro-word-mask" key={w}>
              <motion.span
                className={`intro-word ${w === "The" ? "is-small" : ""}`}
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.1, ease: EASE_OUT }}
              >
                {w}
              </motion.span>
            </span>
          ))}
        </p>
        <motion.span className="intro-meta mono" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55, duration: 0.4 }}>
          {EVENT.dateShort.replace(/\./g, " · ")} — Sfax
        </motion.span>
        <motion.span className="intro-line" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.3, duration: 0.8, ease: EASE_OUT }} />
      </motion.div>
    </div>
  );
}
