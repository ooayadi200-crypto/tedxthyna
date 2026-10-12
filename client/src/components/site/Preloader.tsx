import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { EASE, EASE_OUT } from "./motion";

const STATUS = ["Setting the stage", "Gathering the voices", "Dimming the lights", "Curtain up"];

/** Cinematic opening: counter and logo, then the screen splits like a theatre curtain. */
export function Preloader({ onReveal, onDone }: { onReveal: () => void; onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add("is-locked");
    let raf = 0;
    const start = performance.now();
    const duration = 1300;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // stuttering progress, like a file being pieced together
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      setProgress(Math.round(eased * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
      else window.setTimeout(() => setLeaving(true), 120);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("is-locked");
    };
  }, []);

  useEffect(() => {
    if (!leaving) return;
    document.documentElement.classList.remove("is-locked");
    const r = window.setTimeout(onReveal, 250);
    const t = window.setTimeout(onDone, 1000);
    return () => {
      window.clearTimeout(r);
      window.clearTimeout(t);
    };
  }, [leaving, onDone, onReveal]);

  const status = STATUS[Math.min(STATUS.length - 1, Math.floor(progress / 26))];

  return (
    <div className="preloader" aria-label="Loading TEDx Thyna Youth" role="status">
      <motion.div
        className="preloader-panel is-top"
        animate={leaving ? { y: "-100%" } : { y: 0 }}
        transition={{ duration: 0.8, ease: EASE, delay: 0.05 }}
      />
      <motion.div
        className="preloader-panel is-bottom"
        animate={leaving ? { y: "100%" } : { y: 0 }}
        transition={{ duration: 0.8, ease: EASE, delay: 0.05 }}
      />
      <motion.div className="preloader-seam" initial={{ scaleX: 0 }} animate={leaving ? { scaleX: 1, opacity: [1, 1, 0] } : { scaleX: progress / 100 }} transition={leaving ? { duration: 0.9, ease: EASE } : { duration: 0.2 }} />

      <AnimatePresence>
        {!leaving && (
          <motion.div className="preloader-content" exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.35 }}>
            <div className="preloader-corner is-tl mono">TEDx Thyna Youth<br />15.11.2026 — Break the pattern</div>
            <div className="preloader-corner is-tr mono">Sfax / Tunisia<br />34.74° N — 10.76° E</div>
            <div className="preloader-corner is-bl mono">
              <span className="blink-dot" /> {status}
            </div>
            <button className="preloader-corner is-br mono preloader-skip" onClick={() => setLeaving(true)}>
              Skip intro →
            </button>

            <motion.img
              src="/media/logo.webp"
              alt=""
              className="preloader-mark"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: EASE_OUT }}
            />
            <div className="preloader-count">
              <span>{String(progress).padStart(3, "0")}</span>
              <small>%</small>
            </div>
            <motion.p className="preloader-line" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8 }}>
              Break the <em>pattern.</em>
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
