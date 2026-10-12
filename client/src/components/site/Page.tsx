import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";
import { Link } from "wouter";
import { EVENT, FILE_ORDER, img, srcSet } from "@/data/site";
import { Footer } from "./Footer";
import { EASE, EASE_OUT, Lines, Magnetic } from "./motion";
import { useLenis } from "./SmoothScroll";

/** Wraps every route: crimson wipe on enter/exit, scroll reset, document title, footer. */
export function Page({ title, children, footer = true }: { title: string; children: ReactNode; footer?: boolean }) {
  const lenis = useLenis();
  useEffect(() => {
    document.title = title;
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
    else window.scrollTo(0, 0);
  }, [title, lenis]);

  return (
    <motion.div className="page" initial="initial" animate="enter" exit="exit">
      <motion.div
        className="wipe"
        aria-hidden
        variants={{
          initial: { scaleY: 1, transformOrigin: "50% 0%" },
          enter: { scaleY: 0, transformOrigin: "50% 0%", transition: { duration: 0.9, ease: EASE, delay: 0.05 } },
          exit: { scaleY: 1, transformOrigin: "50% 100%", transition: { duration: 0.65, ease: EASE } },
        }}
      >
        <img src="/media/mark-512.png" alt="" />
      </motion.div>
      {children}
      {footer && <Footer />}
    </motion.div>
  );
}

/** Cinematic header used by every inner page. */
export function PageHero({
  code,
  label,
  title,
  lead,
  image,
  meta = [],
}: {
  code: string;
  label: string;
  title: ReactNode[];
  lead: string;
  image: string;
  meta?: [string, string][];
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1.05, 1.25]);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <header ref={ref} className="page-hero">
      <motion.div className="page-hero-media" style={{ scale, y }}>
        <motion.img
          src={img(image)}
          srcSet={srcSet(image)}
          sizes="100vw"
          alt=""
          initial={{ opacity: 0, scale: 1.2 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, ease: EASE_OUT }}
        />
      </motion.div>
      <div className="page-hero-shade" />
      <motion.div className="page-hero-inner" style={{ opacity: fade }}>
        <motion.div className="page-hero-kicker mono" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6, duration: 0.8 }}>
          <span className="red">{code}</span>
          <i />
          <span>{label}</span>
          <span className="page-hero-case">Case Nº {EVENT.caseNo}</span>
        </motion.div>
        <Lines as="h1" className="page-hero-title" immediate delay={0.55}>
          {title}
        </Lines>
        <div className="page-hero-bottom">
          <motion.p className="page-hero-lead" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1, duration: 1, ease: EASE_OUT }}>
            {lead}
          </motion.p>
          {meta.length > 0 && (
            <motion.dl className="page-hero-meta" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.25, duration: 1, ease: EASE_OUT }}>
              {meta.map(([k, v]) => (
                <div key={k}>
                  <dt className="mono">{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </motion.dl>
          )}
        </div>
        <span className="page-hero-scroll mono">
          Scroll <ArrowDownRight size={13} />
        </span>
      </motion.div>
    </header>
  );
}

/** Oversized "next file" link that closes every inner page. */
export function NextFile({ current }: { current: string }) {
  const index = FILE_ORDER.findIndex((f) => f.href === current);
  const next = FILE_ORDER[(index + 1) % FILE_ORDER.length];
  return (
    <section className="next-file">
      <span className="mono">Next file / {next.code}</span>
      <Link href={next.href} className="next-file-link" data-cursor="Open">
        <span className="next-file-text" data-text={next.label}>
          {next.label}
        </span>
        <Magnetic strength={0.25}>
          <span className="next-file-arrow">
            <ArrowUpRight />
          </span>
        </Magnetic>
      </Link>
    </section>
  );
}

/** Section heading with numbered kicker. */
export function Kicker({ code, children }: { code: string; children: ReactNode }) {
  return (
    <div className="kicker mono">
      <span className="red">{code}</span>
      <i />
      <span>{children}</span>
    </div>
  );
}
