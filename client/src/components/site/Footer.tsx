import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import { Link } from "wouter";
import { EVENT, NAV } from "@/data/site";
import { useLenis } from "./SmoothScroll";

export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const lenis = useLenis();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const y = useTransform(scrollYProgress, [0, 1], ["40%", "0%"]);

  const toTop = () => (lenis ? lenis.scrollTo(0, { duration: 2 }) : window.scrollTo({ top: 0, behavior: "smooth" }));

  return (
    <footer ref={ref} className="footer">
      <div className="footer-top">
        <div className="footer-statement">
          <img src="/media/logo.webp" alt="TEDx Thyna Youth" className="footer-logo" width={96} height={96} loading="lazy" />
          <p>
            The mission doesn&apos;t <em>end here.</em>
          </p>
          <a className="footer-mail" href={`mailto:${EVENT.email}`} data-cursor="Write">
            {EVENT.email} <ArrowUpRight size={18} />
          </a>
        </div>
        <div className="footer-cols">
          <div>
            <span className="mono">Files</span>
            {NAV.map((n) => (
              <Link key={n.href} href={n.href}>
                {n.label}
              </Link>
            ))}
          </div>
          <div>
            <span className="mono">Channels</span>
            <a href={EVENT.instagram} target="_blank" rel="noreferrer">
              Instagram
            </a>
            <a href={EVENT.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <a href={EVENT.registerUrl}>Register</a>
          </div>
          <div>
            <span className="mono">Location</span>
            <p>
              {EVENT.venue}
              <br />
              {EVENT.city}
              <br />
              {EVENT.dateLabel}
            </p>
          </div>
        </div>
      </div>

      <div className="footer-giant" aria-hidden>
        <motion.span style={{ y }}>THYNA</motion.span>
      </div>

      <div className="footer-bottom mono">
        <span>© 2026 TEDx Thyna Youth</span>
        <span>This independent TEDx event is operated under license from TED.</span>
        <button onClick={toTop} className="footer-top-btn" data-cursor="Up">
          Back to top <ArrowUp size={13} />
        </button>
      </div>
    </footer>
  );
}
