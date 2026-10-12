import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, MapPin } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { Link } from "wouter";
import { EVENT, FILES, img, srcSet } from "@/data/site";
import { useIntroDone } from "@/components/site/intro";
import { Chars, EASE_OUT, Lines, Magnetic, Marquee, Reveal, RollingNumber, ScrollWords, useCountdown } from "@/components/site/motion";
import { Kicker, Page } from "@/components/site/Page";

function useMedia(query: string) {
  const [match, setMatch] = useState(() => typeof window !== "undefined" && window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatch(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [query]);
  return match;
}

/* ───────────────────────── 01 · HERO ───────────────────────── */

function Hero() {
  const ready = useIntroDone();
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const titleScale = useTransform(scrollYProgress, [0, 1], [1, 0.86]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const { days, hours, minutes, seconds } = useCountdown(EVENT.dateISO);

  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    if (reduce || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    ref.current.style.setProperty("--sx", `${((e.clientX - r.left) / r.width) * 100}%`);
    ref.current.style.setProperty("--sy", `${((e.clientY - r.top) / r.height) * 100}%`);
    ref.current.classList.add("is-tracking");
  };

  return (
    <section ref={ref} className="hero" onPointerMove={onMove} onPointerLeave={() => ref.current?.classList.remove("is-tracking")}>
      <motion.div className="hero-media" style={{ scale: bgScale }}>
        <img className="hero-img is-dark" src={img("curtain")} srcSet={srcSet("curtain")} sizes="100vw" alt="" fetchPriority="high" />
        <img className="hero-img is-lit" src={img("curtain")} srcSet={srcSet("curtain")} sizes="100vw" alt="" aria-hidden />
      </motion.div>
      <div className="hero-vignette" />
      <div className="hero-grid" aria-hidden />
      <motion.div
        className="hero-mark-wrap"
        aria-hidden
        initial={{ opacity: 0, rotate: -40, scale: 0.8 }}
        animate={ready ? { opacity: 1, rotate: 0, scale: 1 } : undefined}
        transition={{ duration: 2.4, ease: EASE_OUT }}
      >
        <img src="/media/mark.webp" alt="" className="hero-mark" />
      </motion.div>

      <motion.div className="hero-content" style={{ opacity: fade }}>
        <motion.div className="hero-top mono" initial={{ opacity: 0 }} animate={ready ? { opacity: 1 } : undefined} transition={{ delay: 0.9, duration: 1 }}>
          <span>
            <i className="blink-dot" /> Case Nº {EVENT.caseNo} — status: active
          </span>
          <span className="hide-sm">Clearance: open</span>
          <span>{EVENT.dateShort}</span>
        </motion.div>

        <motion.h1 className="hero-title" style={{ y: titleY, scale: titleScale }}>
          <span className="hero-title-row">
            <Chars text="THE CASE" play={ready} delay={0.15} />
          </span>
          <span className="hero-title-row is-indent">
            <Chars text="IS" play={ready} delay={0.45} className="is-outline" />
            <span className="hero-title-em">
              <Chars text="open." play={ready} delay={0.55} />
            </span>
          </span>
        </motion.h1>

        <div className="hero-bottom">
          <motion.div className="hero-intro" initial={{ opacity: 0, y: 30 }} animate={ready ? { opacity: 1, y: 0 } : undefined} transition={{ delay: 1.1, duration: 1.1, ease: EASE_OUT }}>
            <p>
              Some stories are meant to be discovered. Some questions are meant to be asked. On <b>{EVENT.dateLabel}</b>, Sfax opens the file.
            </p>
            <div className="hero-ctas">
              <Magnetic>
                <Link href="/register" className="btn btn-red" data-cursor="Join">
                  <span className="btn-fill" />
                  <span className="btn-label">Claim your seat</span>
                  <ArrowUpRight size={16} />
                </Link>
              </Magnetic>
              <a href="#brief" className="btn-link mono">
                Enter the investigation <ArrowDownRight size={14} />
              </a>
            </div>
          </motion.div>

          <motion.div className="hero-count" initial={{ opacity: 0, y: 30 }} animate={ready ? { opacity: 1, y: 0 } : undefined} transition={{ delay: 1.3, duration: 1.1, ease: EASE_OUT }} aria-label={`${days} days, ${hours} hours, ${minutes} minutes until TEDx Thyna`}>
            <span className="mono hero-count-label">Countdown to curtain-up</span>
            <div className="hero-count-units" aria-hidden>
              {[
                [days, "Days", 3],
                [hours, "Hrs", 2],
                [minutes, "Min", 2],
                [seconds, "Sec", 2],
              ].map(([v, l, p]) => (
                <div key={l as string}>
                  <RollingNumber value={v as number} pad={days > 99 && l === "Days" ? (p as number) : 2} />
                  <small className="mono">{l}</small>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      <div className="hero-foot mono">
        <span>
          <MapPin size={12} /> {EVENT.venue}
        </span>
        <span className="hero-scroll">
          <i /> Scroll to discover
        </span>
      </div>
    </section>
  );
}

/* ───────────────────────── 02 · CROSSED TAPES ───────────────────────── */

function Tapes() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const shift = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const shift2 = useTransform(scrollYProgress, [0, 1], [-200, 0]);
  const items = ["15.11.2026", "Théâtre Municipal de Sfax", "Ideas worth spreading", "Case Nº TX-026", "The case is open"];
  return (
    <div ref={ref} className="tapes" aria-hidden>
      <motion.div className="tape is-red" style={{ x: shift }}>
        <Marquee items={items} speed={38} />
      </motion.div>
      <motion.div className="tape is-paper" style={{ x: shift2 }}>
        <Marquee items={["Do not cross", "Evidence inside", "Clearance: open", "TEDx Thyna Youth", "Follow the signal"]} reverse speed={44} />
      </motion.div>
    </div>
  );
}

/* ───────────────────────── 03 · THE BRIEF ───────────────────────── */

function Brief() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rotate = useTransform(scrollYProgress, [0, 1], [-60, 120]);
  const imgY = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  return (
    <section ref={ref} id="brief" className="brief section">
      <div className="brief-head">
        <Kicker code="01">The brief</Kicker>
        <motion.img src="/media/mark.webp" alt="" className="brief-mark" style={{ rotate }} aria-hidden />
      </div>
      <ScrollWords
        className="brief-text"
        text="Every great idea begins as a secret worth sharing. This November, Sfax opens the file — and invites the curious, the restless and the bold to follow the questions, the people and the place behind TEDx Thyna."
        highlight={["secret", "sharing", "curious", "restless", "bold"]}
      />
      <div className="brief-foot">
        <div className="brief-photo">
          <motion.img src={img("dossier", 1000)} alt="A sealed case file, photographs and a microphone on a desk" style={{ y: imgY }} loading="lazy" />
          <span className="stamp">Clearance<br />open</span>
        </div>
        <Reveal className="brief-copy">
          <p>
            TEDx Thyna is more than a stage. It is a gathering of minds, ideas and people capable of changing the way we see the world — a youth-led event built in Sfax, for anyone who refuses to stop asking why.
          </p>
          <Link href="/mission" className="btn-link mono" data-cursor="Open">
            Read the mission <ArrowUpRight size={14} />
          </Link>
        </Reveal>
        <div className="brief-stats">
          {[
            ["01", "Stage"],
            ["01", "Day"],
            ["∞", "Questions"],
          ].map(([n, l], i) => (
            <Reveal key={l} delay={i * 0.1} className="brief-stat">
              <b>{n}</b>
              <span className="mono">{l}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── 04 · EVIDENCE BOARD (horizontal) ───────────────────────── */

function FileCard({ file, index }: { file: (typeof FILES)[number]; index: number }) {
  return (
    <Link href={file.href} className="file-card" data-cursor="Open file" style={{ "--i": index } as CSSProperties}>
      <span className="file-pin" aria-hidden />
      <div className="file-img">
        <img src={img(file.image, 1000)} alt="" loading="lazy" />
        <span className="file-code">{file.code}</span>
      </div>
      <div className="file-body">
        <span className="mono red">Evidence / {file.tag}</span>
        <h3>{file.title}</h3>
        <p>{file.question}</p>
        <span className="file-open mono">
          Open file <ArrowUpRight size={14} />
        </span>
      </div>
    </Link>
  );
}

function EvidenceBoard() {
  const desktop = useMedia("(min-width: 900px)");
  const reduce = useReducedMotion();
  const pin = desktop && !reduce;
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  const x = useTransform(smooth, [0, 1], [0, -distance]);
  const thread = useTransform(smooth, [0, 1], [0, 1]);
  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setActive(Math.min(FILES.length - 1, Math.floor(v * FILES.length))));

  useLayoutEffect(() => {
    if (!pin || !track.current) return;
    const measure = () => track.current && setDistance(track.current.scrollWidth - window.innerWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [pin]);

  return (
    <section ref={section} className={`board ${pin ? "is-pinned" : ""}`} style={pin ? { height: `calc(100vh + ${distance}px)` } : undefined}>
      <div className="board-sticky">
        <div className="board-bg" aria-hidden>
          <img src={img("board", 1000)} alt="" loading="lazy" />
        </div>
        <motion.div ref={track} className="board-track" style={pin ? { x } : undefined}>
          <div className="board-intro">
            <Kicker code="02">The evidence board</Kicker>
            <Lines as="h2" className="display">
              {["Five files."]}
              {["One "]}
              {[<em key="s">story.</em>]}
            </Lines>
            <p>Every file answers a question. Pull the thread and follow it to the stage.</p>
            {pin && (
              <span className="mono board-hint">
                Keep scrolling <ArrowDownRight size={13} style={{ transform: "rotate(-45deg)" }} />
              </span>
            )}
          </div>
          <svg className="board-thread" viewBox="0 0 1000 40" preserveAspectRatio="none" aria-hidden>
            <motion.path d="M0 20 Q 125 4 250 20 T 500 20 T 750 20 T 1000 20" style={pin ? { pathLength: thread } : { pathLength: 1 }} />
          </svg>
          {FILES.map((f, i) => (
            <FileCard key={f.code} file={f} index={i} />
          ))}
          <div className="board-end">
            <span className="mono">End of board</span>
            <Link href="/register" className="board-end-link" data-cursor="Join">
              Join the<br />
              <em>operation</em>
              <ArrowUpRight />
            </Link>
          </div>
        </motion.div>
        {pin && (
          <div className="board-progress mono" aria-hidden>
            <span className="red">{String(active + 1).padStart(2, "0")}</span> / {String(FILES.length).padStart(2, "0")}
            <motion.i style={{ scaleX: smooth }} />
          </div>
        )}
      </div>
    </section>
  );
}

/* ───────────────────────── 05 · THE VOICE ───────────────────────── */

function Voice() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const nameX = useTransform(scrollYProgress, [0, 1], ["8%", "-38%"]);
  const imgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  return (
    <section ref={ref} className="voice section">
      <motion.div className="voice-name" style={{ x: nameX }} aria-hidden>
        Jihed <em>Cherni</em> — Jihed <em>Cherni</em>
      </motion.div>
      <div className="voice-grid">
        <motion.div
          className="voice-photo"
          initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
          whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 1.4, ease: EASE_OUT }}
          data-cursor="Moderator"
        >
          <motion.img src={img("jihed", 1000)} alt="Jihed Cherni, TEDx Thyna moderator" style={{ y: imgY }} loading="lazy" />
          <span className="voice-tag mono">Moderator file / confirmed</span>
        </motion.div>
        <div className="voice-copy">
          <Kicker code="03">The voice</Kicker>
          <Lines as="h2" className="display">
            {["The voice that"]}
            {["guides the"]}
            {[<em key="c">conversation.</em>]}
          </Lines>
          <Reveal>
            <h3 className="voice-person">Jihed Cherni</h3>
            <p className="voice-role mono red">Event moderator</p>
            <p>
              Tunisian actor, screenwriter and media producer. Jihed Cherni will guide the conversation and connect the voices on the TEDx Thyna stage.
            </p>
            <Link href="/minds" className="btn-link mono" data-cursor="Open">
              Meet the voices <ArrowUpRight size={14} />
            </Link>
          </Reveal>
          <div className="voice-redacted" aria-label="More speakers to be revealed">
            {["Speaker 01", "Speaker 02", "Speaker 03"].map((s, i) => (
              <Reveal key={s} delay={i * 0.08} className="redacted-row">
                <span className="mono">{s}</span>
                <span className="redacted-bar" />
                <span className="mono red">Classified</span>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── 06 · THE SCENE (zoom reveal) ───────────────────────── */

function Scene() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const clip = useTransform(scrollYProgress, [0, 0.55], ["inset(24% 28% 24% 28% round 4px)", "inset(0% 0% 0% 0% round 0px)"]);
  const scale = useTransform(scrollYProgress, [0, 0.6], [1.35, 1]);
  const titleOpacity = useTransform(scrollYProgress, [0.35, 0.6], [0, 1]);
  const titleY = useTransform(scrollYProgress, [0.35, 0.65], [60, 0]);
  const preOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  return (
    <section ref={ref} className="scene">
      <div className="scene-sticky">
        <motion.div className="scene-pre" style={{ opacity: preOpacity }}>
          <Kicker code="04">The scene</Kicker>
          <p className="scene-pre-title">
            Where ideas <em>arrive.</em>
          </p>
        </motion.div>
        <motion.div className="scene-frame" style={{ clipPath: clip }}>
          <motion.img src={img("stage")} srcSet={srcSet("stage")} sizes="100vw" alt="The stage of the Théâtre Municipal de Sfax under a red spotlight" style={{ scale }} loading="lazy" />
          <div className="scene-shade" />
        </motion.div>
        <motion.div className="scene-copy" style={{ opacity: titleOpacity, y: titleY }}>
          <span className="mono red">Operation site / identified</span>
          <h2>
            Théâtre <em>Municipal</em>
            <br />
            de Sfax
          </h2>
          <div className="scene-data">
            <div>
              <span className="mono">Date</span>
              <b>{EVENT.dateLabel}</b>
            </div>
            <div>
              <span className="mono">Coordinates</span>
              <b>{EVENT.plusCode} · Sfax</b>
            </div>
            <a href={EVENT.mapsUrl} target="_blank" rel="noreferrer" className="btn-link mono" data-cursor="Map">
              Open location <ArrowUpRight size={14} />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ───────────────────────── 07 · CLOCK ───────────────────────── */

function Clock() {
  const { days, hours, minutes, seconds, done } = useCountdown(EVENT.dateISO);
  return (
    <section className="clock section">
      <Kicker code="05">The clock is running</Kicker>
      <div className="clock-grid" aria-label={done ? "TEDx Thyna is live" : `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds to go`}>
        {[
          [days, "Days"],
          [hours, "Hours"],
          [minutes, "Minutes"],
          [seconds, "Seconds"],
        ].map(([v, l], i) => (
          <Reveal key={l} delay={i * 0.08} className="clock-unit">
            <span className="clock-num" aria-hidden>
              <RollingNumber value={v as number} />
            </span>
            <span className="mono">{l}</span>
          </Reveal>
        ))}
      </div>
      <Reveal className="clock-foot">
        <p>Doors open on {EVENT.dateLabel}. Seats are limited — the file closes when the theatre is full.</p>
      </Reveal>
    </section>
  );
}

/* ───────────────────────── 08 · FINAL CALL ───────────────────────── */

function FinalCall() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const glow = useTransform(scrollYProgress, [0, 1], [0.1, 0.65]);
  const ringText = "Register now · Join the operation · ";
  return (
    <section ref={ref} className="final section">
      <motion.div className="final-glow" style={{ opacity: glow }} aria-hidden />
      <Kicker code="06">The next move</Kicker>
      <Lines as="h2" className="final-title">
        {["Are you ready"]}
        {["to uncover"]}
        {[
          <span key="s">
            the <em>story?</em>
          </span>,
        ]}
      </Lines>
      <div className="final-row">
        <Reveal className="final-copy">
          <p>Registration opens soon. Leave a signal and the team will contact you the moment seats are released.</p>
          <Link href="/contact" className="btn-link mono">
            Ask a question <ArrowUpRight size={14} />
          </Link>
        </Reveal>
        <Magnetic strength={0.4}>
          <Link href="/register" className="ring-btn" data-cursor="Join" aria-label="Register for TEDx Thyna">
            <svg viewBox="0 0 200 200" className="ring-text" aria-hidden>
              <defs>
                <path id="ring-path" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
              </defs>
              <text>
                <textPath href="#ring-path" textLength="488" lengthAdjust="spacing">
                  {ringText}
                </textPath>
              </text>
            </svg>
            <span className="ring-core">
              <ArrowUpRight size={34} />
            </span>
          </Link>
        </Magnetic>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <Page title="TEDx Thyna Youth — The Case Is Open · 15.11.2026, Sfax">
      <main>
        <Hero />
        <Tapes />
        <Brief />
        <EvidenceBoard />
        <Voice />
        <Scene />
        <Clock />
        <FinalCall />
      </main>
    </Page>
  );
}
