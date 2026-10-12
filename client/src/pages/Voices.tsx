import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { img } from "@/data/site";
import { EASE_OUT, Lines, Reveal } from "@/components/site/motion";
import { Kicker, NextFile, Page, PageHero } from "@/components/site/Page";

export default function Voices() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <Page title="The Voices — TEDx Thyna Youth">
      <PageHero
        code="03"
        label="The voices"
        image="curtain"
        title={[
          <span key="a">The people</span>,
          <span key="b">
            behind the <em>signal.</em>
          </span>,
        ]}
        lead="Three perspectives. One signal waiting to be revealed."
        meta={[
          ["Moderator", "Confirmed"],
          ["Speakers", "Classified"],
        ]}
      />
      <main>
        <section ref={ref} className="section moderator">
          <motion.div
            className="moderator-photo"
            initial={{ clipPath: "inset(0% 100% 0% 0%)" }}
            whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ duration: 1.4, ease: EASE_OUT }}
          >
            <motion.img src={img("jihed")} alt="Jihed Cherni, TEDx Thyna moderator" style={{ y }} loading="lazy" />
          </motion.div>
          <div className="moderator-copy">
            <Kicker code="03.1">Moderator file / confirmed</Kicker>
            <Lines as="h2" className="display">
              <span>Meet our</span>
              <em>moderator.</em>
            </Lines>
            <Reveal>
              <h3 className="voice-person">Jihed Cherni</h3>
              <p className="voice-role mono red">Event moderator</p>
              <p className="lead-copy">
                Tunisian actor, screenwriter and media producer. Jihed Cherni will guide the conversation and connect the voices on the TEDx Thyna stage.
              </p>
              <dl className="dossier-list">
                <div>
                  <dt className="mono">Role</dt>
                  <dd>Guiding the conversation</dd>
                </div>
                <div>
                  <dt className="mono">Craft</dt>
                  <dd>Actor · Screenwriter · Media producer</dd>
                </div>
                <div>
                  <dt className="mono">Status</dt>
                  <dd className="red">Confirmed / TX-2026</dd>
                </div>
              </dl>
            </Reveal>
          </div>
        </section>

        <section className="section">
          <Kicker code="03.2">Speaker files</Kicker>
          <Lines as="h2" className="display">
            <span>The rest is</span>
            <em>classified.</em>
          </Lines>
          <div className="classified-grid">
            {[1, 2, 3].map((n, i) => (
              <Reveal key={n} delay={i * 0.12} className="classified-card" as="article">
                <div className="classified-portrait" aria-hidden>
                  <span className="classified-q">?</span>
                  <span className="scanline" />
                </div>
                <span className="mono red">Speaker file / 0{n}</span>
                <span className="redacted-bar is-wide" aria-hidden />
                <span className="redacted-bar is-short" aria-hidden />
                <span className="classified-status mono">
                  <i className="blink-dot" /> Identity sealed — revealed soon
                </span>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <p className="lead-copy center">Follow us on Instagram — every voice is unveiled there first.</p>
          </Reveal>
        </section>
        <NextFile current="/minds" />
      </main>
    </Page>
  );
}
