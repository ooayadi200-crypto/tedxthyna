import { ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import { TEAM } from "@/data/site";
import { Lines, Reveal } from "@/components/site/motion";
import { Kicker, NextFile, Page, PageHero } from "@/components/site/Page";

const initials = (name: string) =>
  name
    .split(" ")
    .filter((_, i, a) => i === 0 || i === a.length - 1)
    .map((p) => p[0])
    .join("");

export default function Organization() {
  return (
    <Page title="Organization — TEDx Thyna Youth">
      <PageHero
        code="04"
        label="The organization"
        image="board"
        title={[
          <span key="a">The people</span>,
          <span key="b">
            behind the <em>operation.</em>
          </span>,
        ]}
        lead="Meet the team building the TEDx Thyna experience in Sfax."
        meta={[
          ["Personnel", `${String(TEAM.length).padStart(2, "0")} files`],
          ["Status", "Active"],
        ]}
      />
      <main>
        <section className="section">
          <div className="org-head">
            <Kicker code="04.1">Personnel index</Kicker>
            <span className="mono org-hint">Hover a file to lift the redaction</span>
          </div>
          <ol className="personnel">
            {TEAM.map((m, i) => (
              <Reveal as="li" key={m.email} delay={i * 0.05} className="person">
                <a href={`mailto:${m.email}`} className="person-row" data-cursor="Contact">
                  <span className="person-index mono">{String(i + 1).padStart(2, "0")}</span>
                  <span className="person-badge" aria-hidden>
                    {initials(m.name)}
                  </span>
                  <span className="person-main">
                    <strong>{m.name}</strong>
                    <small>{m.role}</small>
                  </span>
                  <span className="person-mail">
                    <span className="person-mail-text mono">{m.email}</span>
                    <span className="person-mail-redact" aria-hidden />
                  </span>
                  <span className="person-status mono">
                    <i className="blink-dot" /> Active
                  </span>
                  <ArrowUpRight className="person-arrow" size={20} />
                </a>
              </Reveal>
            ))}
          </ol>
        </section>
        <section className="section join-band">
          <Lines as="h2" className="display">
            <span>Want to join</span>
            <span>
              the <em>network?</em>
            </span>
          </Lines>
          <Reveal>
            <p className="lead-copy">Volunteers, partners and sponsors — every operation needs allies. Send a signal and the team will get back to you.</p>
            <Link className="btn btn-red" href="/contact" data-cursor="Write">
              <span className="btn-fill" />
              <span className="btn-label">Get in touch</span>
              <ArrowUpRight size={16} />
            </Link>
          </Reveal>
        </section>
        <NextFile current="/organization" />
      </main>
    </Page>
  );
}
