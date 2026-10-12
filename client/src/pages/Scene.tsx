import { ArrowUpRight, MapPin } from "lucide-react";
import { EVENT, img } from "@/data/site";
import { Lines, Parallax, Reveal } from "@/components/site/motion";
import { Kicker, NextFile, Page, PageHero } from "@/components/site/Page";

export default function Scene() {
  return (
    <Page title="The Scene — Complexe Culturel Mohamed Jamoussi · TEDx Thyna">
      <PageHero
        code="05"
        label="The scene"
        image="stage"
        title={[
          <span key="a">The place</span>,
          <span key="b">where ideas</span>,
          <em key="c">arrive.</em>,
        ]}
        lead="An address, a stage, a city waiting for the next signal."
        meta={[
          ["Date", EVENT.dateLabel],
          ["Time", "10:00 – 20:00"],
        ]}
      />
      <main>
        <section className="section venue">
          <div className="venue-copy">
            <Kicker code="05.1">Venue / confirmed</Kicker>
            <Lines as="h2" className="display venue-title">
              <span>Complexe</span>
              <em>Culturel</em>
              <span>Mohamed</span>
              <span>Jamoussi</span>
            </Lines>
            <Reveal>
              <dl className="dossier-list">
                <div>
                  <dt className="mono">Address</dt>
                  <dd>
                    {EVENT.address}, Tunisia
                  </dd>
                </div>
                <div>
                  <dt className="mono">Date</dt>
                  <dd>{EVENT.dateLabel}</dd>
                </div>
                <div>
                  <dt className="mono">Time</dt>
                  <dd>10:00 – 20:00</dd>
                </div>
              </dl>
              <a className="btn btn-red" href={EVENT.mapsUrl} target="_blank" rel="noreferrer" data-cursor="Map">
                <span className="btn-fill" />
                <span className="btn-label">Open in Google Maps</span>
                <ArrowUpRight size={16} />
              </a>
            </Reveal>
          </div>
          <Reveal className="venue-map">
            <iframe
              title="Map of the Complexe Culturel Mohamed Jamoussi, Sfax"
              src={EVENT.mapsEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <span className="venue-pin mono">
              <MapPin size={12} /> Target located
            </span>
          </Reveal>
        </section>

        <section className="city">
          <Parallax className="city-img" amount={80}>
            <img src={img("sfax", 1000)} alt="Sfax by night" loading="lazy" />
          </Parallax>
          <div className="city-shade" />
          <div className="city-copy">
            <Kicker code="05.2">The city</Kicker>
            <Lines as="h2" className="display">
              <span>Sfax never</span>
              <span>
                stops <em>thinking.</em>
              </span>
            </Lines>
            <Reveal>
              <p className="lead-copy">A city of makers, traders and builders. For one day in November, the Jamoussi cultural complex becomes the place where its boldest ideas take the stage.</p>
            </Reveal>
          </div>
        </section>
        <NextFile current="/scene" />
      </main>
    </Page>
  );
}
