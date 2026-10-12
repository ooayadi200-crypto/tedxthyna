import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import { Link } from "wouter";
import { img } from "@/data/site";
import { Lines, Reveal, ScrollWords } from "@/components/site/motion";
import { Kicker, NextFile, Page, PageHero } from "@/components/site/Page";

const PILLARS = [
  {
    code: "A",
    title: "The ideas",
    body: "Questions that refuse to stay quiet. Talks that leave a trace long after the lights go down.",
    href: "/minds",
    link: "Meet the voices",
  },
  {
    code: "B",
    title: "The people",
    body: "Behind every story lies a network — a youth team in Sfax building the experience piece by piece.",
    href: "/organization",
    link: "Open the organization",
  },
  {
    code: "C",
    title: "The place",
    body: "The Complexe Culturel Mohamed Jamoussi, a cultural landmark of Sfax, ready to receive the next signal.",
    href: "/scene",
    link: "Visit the scene",
  },
];

export default function Mission() {
  const quote = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: quote, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], ["10%", "-25%"]);

  return (
    <Page title="Mission — TEDx Thyna Youth">
      <PageHero
        code="02"
        label="The mission"
        image="dossier"
        title={[
          <span key="a">Behind every idea</span>,
          <span key="b">
            lies a <em>story.</em>
          </span>,
        ]}
        lead="TEDx Thyna is more than a stage. It is a gathering of minds, ideas and people capable of changing the way we see the world."
        meta={[
          ["File", "Opened"],
          ["Spirit", "Ideas worth spreading"],
        ]}
      />
      <main>
        <section className="section">
          <Kicker code="02.1">Statement</Kicker>
          <ScrollWords
            className="brief-text"
            text="We believe the most powerful ideas are hidden in plain sight — in a classroom, a workshop, a street in Sfax. Our mission is to find them, give them a stage, and send them further than they could travel alone."
            highlight={["hidden", "plain", "sight", "stage", "further"]}
          />
        </section>

        <section ref={quote} className="quote-band" aria-label="Behind every story lies a network">
          <motion.p style={{ x }}>
            Behind every story lies a <em>network.</em> Behind every story lies a <em>network.</em>
          </motion.p>
        </section>

        <section className="section">
          <Kicker code="02.2">Three lines of inquiry</Kicker>
          <div className="pillars">
            {PILLARS.map((p, i) => (
              <Reveal key={p.code} delay={i * 0.1} className="pillar">
                <span className="pillar-code">{p.code}</span>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
                <Link href={p.href} className="btn-link mono" data-cursor="Open">
                  {p.link} <ArrowUpRight size={14} />
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="section split-feature">
          <div className="split-feature-img">
            <img src={img("archive", 1000)} alt="An archive room lit in crimson" loading="lazy" />
            <span className="stamp">File<br />opened</span>
          </div>
          <div>
            <Kicker code="02.3">Access protocol</Kicker>
            <Lines as="h2" className="display">
              <span>Follow</span>
              <em>the signal.</em>
            </Lines>
            <Reveal>
              <p className="lead-copy">Every encounter leaves a trace. Every question opens a door. And behind this event lies an organization — young people from Sfax who decided the city deserved this stage.</p>
            </Reveal>
          </div>
        </section>
        <NextFile current="/mission" />
      </main>
    </Page>
  );
}
