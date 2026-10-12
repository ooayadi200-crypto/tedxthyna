import { motion } from "framer-motion";
import { Fragment, useMemo, type CSSProperties } from "react";
import { ROLE_TAGLINE, speakerPhoto, SPEAKERS } from "@/data/site";
import { EASE_OUT } from "./motion";

export type Speaker = (typeof SPEAKERS)[number];

/** Deterministic pseudo-random generator so torn edges look the same on every render. */
function rand(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/** A ripped-paper edge, like the bottom of the poster photos. Place it at the top or bottom of a section. */
export function Torn({ side = "bottom", seed = 3, className, color = "var(--surface-paper)" }: { side?: "top" | "bottom" | "under"; seed?: number; className?: string; color?: string }) {
  const d = useMemo(() => {
    const r = rand(seed);
    const pts: string[] = [];
    let x = 0;
    while (x < 1000) {
      pts.push(`${x.toFixed(1)},${(8 + r() * 22 + (r() > 0.85 ? r() * 14 : 0)).toFixed(1)}`);
      x += 4 + r() * 16;
    }
    pts.push("1000,18");
    return `M0,60 L0,20 L${pts.join(" L")} L1000,60 Z`;
  }, [seed]);
  return (
    <svg className={`torn torn-${side} ${className ?? ""}`} viewBox="0 0 1000 60" preserveAspectRatio="none" aria-hidden style={{ color } as CSSProperties}>
      <path d={d} fill="currentColor" />
    </svg>
  );
}

/** Simple Sfax palm silhouette, used as a collage accent. */
export function Palms({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 220 160" aria-hidden>
      <g fill="currentColor">
        <path d="M58 160 C60 120 62 90 70 60 L73 61 C66 92 65 122 64 160Z" />
        <path d="M71 60 C55 50 35 52 18 64 C38 54 54 56 69 63Z M71 60 C60 42 42 34 24 36 C44 40 58 48 69 62Z M71 60 C74 40 88 28 104 26 C90 34 80 46 73 62Z M71 60 C88 50 108 52 122 62 C104 56 88 56 73 63Z M71 60 C70 46 60 32 46 26 C60 36 66 46 69 61Z" />
        <path d="M148 160 C149 128 150 104 156 80 L158 81 C153 104 153 130 153 160Z" />
        <path d="M157 80 C145 72 130 74 118 82 C132 76 145 77 156 83Z M157 80 C150 66 136 60 124 62 C138 66 148 72 156 82Z M157 80 C162 66 172 58 186 58 C174 64 166 72 158 82Z M157 80 C170 74 184 76 194 84 C182 79 170 79 158 83Z" />
        <rect x="0" y="146" width="220" height="14" />
        <path d="M84 146 h40 v-22 h6 v-10 h-6 v-4 a14 14 0 0 1 -40 0 v4 h-6 v10 h6Z" opacity=".85" />
      </g>
    </svg>
  );
}

/** Renders a bio where *words* are set in red italics, like the posters. */
export function Bio({ text }: { text: string }) {
  const parts = text.split(/(\*[^*]+\*)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("*") ? (
          <b key={i} className="bio-red">
            {p.slice(1, -1)}
          </b>
        ) : (
          <Fragment key={i}>{p}</Fragment>
        ),
      )}
    </>
  );
}

export function PosterName({ first, last, className }: { first: string; last: string; className?: string }) {
  return (
    <span className={`poster-name ${className ?? ""}`}>
      <span className="pn-first">{first}</span>
      <span className="pn-last">{last}</span>
    </span>
  );
}

/** A speaker card built in the visual language of the "Meet Our" posters. */
export function SpeakerCard({ s, index = 0 }: { s: Speaker; index?: number }) {
  const [a, b] = ROLE_TAGLINE[s.role];
  return (
    <motion.article
      className="poster-card"
      initial={{ opacity: 0, y: 60, rotate: index % 2 ? 2 : -2 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 1, delay: (index % 3) * 0.08, ease: EASE_OUT }}
      data-cursor={s.role}
    >
      <header className="pc-head">
        <span className="pc-meet">Meet Our</span>
        <span className="pc-role">{s.label}</span>
      </header>
      <div className="pc-collage">
        <span className="pc-block is-back" aria-hidden />
        <span className="pc-block is-red" aria-hidden />
        <Palms className="pc-palms" />
        <div className="pc-photo">
          <img src={speakerPhoto(s.photo)} alt={`${s.first} ${s.last}`} loading="lazy" />
        </div>
        <span className="pc-tag" aria-hidden>
          {a.split(" ")[0]} <i>{a.split(" ").slice(1).join(" ")}</i>
          <br />
          {b.split(" ")[0]} <i>{b.split(" ").slice(1).join(" ")}</i>
        </span>
        <Torn className="pc-torn" seed={index * 7 + 2} />
      </div>
      <PosterName first={s.first} last={s.last} />
      <p className="pc-bio">
        <Bio text={s.bio} />
      </p>
      <span className="pc-sig">
        <b>TED<sup>x</sup></b>ThynaYouth
      </span>
    </motion.article>
  );
}
