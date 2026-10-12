import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ROLE_TAGLINE, speakerPhoto, SPEAKERS } from "@/data/site";
import { Lineup } from "@/components/site/Lineup";
import { EASE_OUT, Lines, Reveal } from "@/components/site/motion";
import { Kicker, NextFile, Page, PageHero } from "@/components/site/Page";
import { Bio, PosterName } from "@/components/site/Poster";

const MODERATORS = SPEAKERS.filter((s) => s.role === "Moderator");

export default function Voices() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <Page title="The Voices — Speakers, Panelists & Moderators · TEDx Thyna Youth">
      <PageHero
        code="03"
        label="The voices"
        image="curtain"
        title={[
          <span key="a">Ten voices.</span>,
          <span key="b">
            One <em>stage.</em>
          </span>,
        ]}
        lead="Five speakers sharing ideas, three panelists in one conversation, and two moderators connecting it all."
        meta={[
          ["Speakers", "05"],
          ["Panelists", "03"],
          ["Moderators", "02"],
        ]}
      />
      <main>
        <Lineup />

        <section ref={ref} className="section">
          <Kicker code="03.2">{ROLE_TAGLINE.Moderator.join(" · ")}</Kicker>
          <Lines as="h2" className="display">
            <span>The hosts of</span>
            <em>the conversation.</em>
          </Lines>
          <div className="mod-grid">
            {MODERATORS.map((m, i) => (
              <Reveal key={m.photo} delay={i * 0.12} className="mod-card" as="article">
                <motion.div
                  className="mod-photo"
                  initial={{ clipPath: "inset(0% 100% 0% 0%)" }}
                  whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
                  viewport={{ once: true, margin: "-15% 0px" }}
                  transition={{ duration: 1.3, ease: EASE_OUT }}
                >
                  <motion.img src={speakerPhoto(m.photo)} alt={`${m.first} ${m.last}`} style={{ y }} loading="lazy" />
                  <span className="voice-tag mono">{m.label}</span>
                </motion.div>
                <PosterName first={m.first} last={m.last} className="is-dark" />
                <p className="mod-bio">
                  <Bio text={m.bio} />
                </p>
              </Reveal>
            ))}
          </div>
        </section>
        <NextFile current="/minds" />
      </main>
    </Page>
  );
}
