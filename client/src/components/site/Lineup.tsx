import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { SPEAKERS } from "@/data/site";
import { EASE_OUT, Lines } from "./motion";
import { SpeakerCard, Torn } from "./Poster";


const FILTERS = ["All", "Speaker", "Panelist", "Moderator"] as const;

export function Lineup({ compact = false }: { compact?: boolean }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const list = SPEAKERS.filter((s) => filter === "All" || s.role === filter);
  return (
    <section id="lineup" className="lineup section theme-paper">
      <div className="lineup-head">
        <div>
          <span className="script lineup-script">Meet Our</span>
          <Lines as="h2" className="display lineup-title">
            <span>Voices of the</span>
            <em>stage.</em>
          </Lines>
        </div>
        <div className="lineup-side">
          <p>Five speakers, three panelists and two moderators — each one sharing ideas, shaping perspectives and breaking a pattern of their own.</p>
          <div className="chips" role="tablist" aria-label="Filter the line-up">
            {FILTERS.map((f) => (
              <button key={f} role="tab" aria-selected={filter === f} className={`chip ${filter === f ? "is-on" : ""}`} onClick={() => setFilter(f)}>
                {f === "All" ? "All voices" : `${f}s`}
                <small>{f === "All" ? SPEAKERS.length : SPEAKERS.filter((s) => s.role === f).length}</small>
              </button>
            ))}
          </div>
        </div>
      </div>
      <motion.div layout className={`poster-grid ${compact ? "is-compact" : ""}`}>
        <AnimatePresence mode="popLayout">
          {list.map((s, i) => (
            <motion.div layout key={s.photo} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.5, ease: EASE_OUT }}>
              <SpeakerCard s={s} index={i} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      <Torn side="under" seed={21} />
    </section>
  );
}

