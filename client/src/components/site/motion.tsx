import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Children, useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from "react";

export const EASE = [0.76, 0, 0.24, 1] as const;
export const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/** Fades and lifts children into view once. */
export function Reveal({
  children,
  delay = 0,
  y = 40,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "span" | "p" | "li" | "section" | "article";
}) {
  const Tag = motion[as] as typeof motion.div;
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 1.1, delay, ease: EASE_OUT }}
    >
      {children}
    </Tag>
  );
}

/**
 * Masked line reveal: every child line slides up from behind a clip.
 * Pass each line as a separate child (strings or elements).
 */
export function Lines({
  children,
  as: Tag = "h2",
  className,
  delay = 0,
  stagger = 0.09,
  immediate = false,
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
  stagger?: number;
  immediate?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8% 0px" });
  const show = immediate || inView;
  const lines = Children.toArray(children);
  return (
    <Tag ref={ref} className={className}>
      {lines.map((line, i) => (
        <span className="line-mask" key={i}>
          <motion.span
            className="line-inner"
            initial={{ y: "110%", rotate: 3 }}
            animate={show ? { y: "0%", rotate: 0 } : undefined}
            transition={{ duration: 1.2, delay: delay + i * stagger, ease: EASE_OUT }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/** Splits a string into characters that rise one after another. */
export function Chars({
  text,
  delay = 0,
  className,
  stagger = 0.035,
  play = true,
}: {
  text: string;
  delay?: number;
  className?: string;
  stagger?: number;
  play?: boolean;
}) {
  return (
    <span className={`chars ${className ?? ""}`} aria-label={text}>
      {Array.from(text).map((ch, i) => (
        <span className="char-mask" key={i} aria-hidden>
          <motion.span
            className="char"
            initial={{ y: "115%" }}
            animate={play ? { y: "0%" } : undefined}
            transition={{ duration: 1.1, delay: delay + i * stagger, ease: EASE_OUT }}
          >
            {ch === " " ? " " : ch}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/** Paragraph whose words light up one by one as it scrolls through the viewport. */
export function ScrollWords({ text, className, highlight = [] }: { text: string; className?: string; highlight?: string[] }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] });
  const words = text.split(" ");
  return (
    <p ref={ref} className={`scroll-words ${className ?? ""}`}>
      {words.map((word, i) => (
        <Word
          key={i}
          progress={scrollYProgress}
          range={[i / words.length, (i + 1) / words.length]}
          accent={highlight.includes(word.replace(/[.,]/g, ""))}
        >
          {word}
        </Word>
      ))}
    </p>
  );
}

function Word({ children, progress, range, accent }: { children: string; progress: MotionValue<number>; range: [number, number]; accent: boolean }) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  return (
    <span className={`sw-word ${accent ? "is-accent" : ""}`}>
      <motion.span style={{ opacity }}>{children}</motion.span>{" "}
    </span>
  );
}

/** Element that leans toward the pointer. */
export function Magnetic({ children, strength = 0.35, className }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 14, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 180, damping: 14, mass: 0.4 });
  const reduce = useReducedMotion();
  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: sx, y: sy, display: "inline-block" }}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/** Infinite horizontal ticker. */
export function Marquee({ items, reverse = false, className, speed = 40 }: { items: ReactNode[]; reverse?: boolean; className?: string; speed?: number }) {
  const row = (
    <div className="marquee-row" aria-hidden>
      {items.map((item, i) => (
        <span className="marquee-item" key={i}>
          {item}
          <i className="marquee-dot" />
        </span>
      ))}
    </div>
  );
  return (
    <div className={`marquee ${reverse ? "is-reverse" : ""} ${className ?? ""}`} style={{ "--marquee-speed": `${speed}s` } as CSSProperties}>
      <div className="marquee-track">
        {row}
        {row}
      </div>
    </div>
  );
}

/** Parallax wrapper: translates its child against scroll. */
export function Parallax({ children, amount = 120, className }: { children: ReactNode; amount?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-amount, amount]);
  return (
    <div ref={ref} className={className} style={{ overflow: "hidden" }}>
      <motion.div style={{ y, height: "100%" }} className="parallax-inner">
        {children}
      </motion.div>
    </div>
  );
}

/** Animated count from 0 to `to` once visible. */
export function CountUp({ to, pad = 2, duration = 1.6 }: { to: number; pad?: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / (duration * 1000));
      setValue(Math.round(to * (1 - Math.pow(1 - t, 4))));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);
  return <span ref={ref}>{String(value).padStart(pad, "0")}</span>;
}

export function useCountdown(targetISO: string) {
  const target = new Date(targetISO).getTime();
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, []);
  const total = Math.max(0, Math.floor((target - now) / 1000));
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
    done: total === 0,
  };
}

/** A digit that rolls when its value changes. */
export function RollingNumber({ value, pad = 2 }: { value: number; pad?: number }) {
  const text = String(value).padStart(pad, "0");
  return (
    <span className="rolling">
      {Array.from(text).map((d, i) => (
        <span className="rolling-slot" key={i}>
          <motion.span
            key={`${i}-${d}`}
            className="rolling-digit"
            initial={{ y: "-100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            transition={{ duration: 0.5, ease: EASE_OUT }}
          >
            {d}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
