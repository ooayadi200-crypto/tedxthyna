import { ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import { EVENT } from "@/data/site";
import { Lines, Reveal } from "@/components/site/motion";
import { Kicker, NextFile, Page, PageHero } from "@/components/site/Page";

const SLOTS = [
  { title: "Doors & check-in", note: "Collect your badge, find your seat." },
  { title: "Opening", note: "The file is opened on stage." },
  { title: "Session I", note: "First voices, first questions." },
  { title: "Intermission", note: "Encounters, coffee, conversations." },
  { title: "Session II", note: "The investigation deepens." },
  { title: "Closing", note: "The case — for now — is closed." },
];

export default function Agenda() {
  return (
    <Page title="Agenda — TEDx Thyna Youth">
      <PageHero
        code="06"
        label="The agenda"
        image="desk"
        title={[
          <span key="a">The day</span>,
          <span key="b">will be</span>,
          <em key="c">revealed.</em>,
        ]}
        lead="The programme is being assembled. The next signal will announce every moment."
        meta={[
          ["Date", EVENT.dateLabel],
          ["Status", "In preparation"],
        ]}
      />
      <main>
        <section className="section">
          <div className="org-head">
            <Kicker code="06.1">Provisional running order</Kicker>
            <span className="stamp is-inline">In preparation</span>
          </div>
          <ol className="timeline">
            {SLOTS.map((s, i) => (
              <Reveal as="li" key={s.title} delay={i * 0.06} className="slot">
                <span className="slot-time mono">
                  <span className="redacted-bar is-time" aria-hidden />
                  <span className="sr-only">Time to be announced</span>
                </span>
                <span className="slot-dot" aria-hidden />
                <span className="slot-body">
                  <strong>{s.title}</strong>
                  <small>{s.note}</small>
                </span>
                <span className="slot-tag mono">TBA</span>
              </Reveal>
            ))}
          </ol>
          <Reveal>
            <p className="lead-copy">Talks, encounters and performances will appear here as soon as the programme is cleared. Structure is provisional and may change.</p>
          </Reveal>
        </section>
        <section className="section join-band">
          <Lines as="h2" className="display">
            <span>Don&apos;t miss</span>
            <span>
              the <em>reveal.</em>
            </span>
          </Lines>
          <Reveal>
            <p className="lead-copy">Register your intent now and you will be the first to know when the agenda is declassified.</p>
            <div className="row-gap">
              <a className="btn btn-red" href={EVENT.registerUrl} data-cursor="Join">
                <span className="btn-fill" />
                <span className="btn-label">Register</span>
                <ArrowUpRight size={16} />
              </a>
              <Link className="btn-link mono" href="/contact">
                Ask a question <ArrowUpRight size={14} />
              </Link>
            </div>
          </Reveal>
        </section>
        <NextFile current="/agenda" />
      </main>
    </Page>
  );
}
