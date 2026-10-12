import { ArrowUpRight, Instagram, Linkedin, Mail, Send } from "lucide-react";
import { useState, type FormEvent } from "react";
import { EVENT } from "@/data/site";
import { Reveal } from "@/components/site/motion";
import { Kicker, NextFile, Page, PageHero } from "@/components/site/Page";

const TOPICS = ["General question", "Partnership", "Volunteering", "Press"];

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [topic, setTopic] = useState(TOPICS[0]);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const subject = encodeURIComponent(`[${topic}] TEDx Thyna — message from ${d.get("name") || "website visitor"}`);
    const body = encodeURIComponent(`Name: ${d.get("name")}\nEmail: ${d.get("email")}\nTopic: ${topic}\n\n${d.get("message")}`);
    window.location.href = `mailto:${EVENT.email}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <Page title="Contact — TEDx Thyna Youth">
      <PageHero
        code="07"
        label="Contact us"
        image="sfax"
        title={[
          <span key="a">Start a</span>,
          <em key="b">conversation.</em>,
        ]}
        lead="Have a question, an idea, or something you want to share? Send a signal to the TEDx Thyna team."
        meta={[
          ["Channel", "Open"],
          ["Base", EVENT.city],
        ]}
      />
      <main>
        <section className="section contact">
          <div className="contact-side">
            <Kicker code="07.1">Transmission channels</Kicker>
            <h2 className="display small">
              We would love to hear from <em>you.</em>
            </h2>
            <p className="lead-copy">Use the form to reach our team. We will get back to you as soon as possible.</p>
            <div className="channels">
              <a href={`mailto:${EVENT.email}`} className="channel" data-cursor="Write">
                <Mail size={20} />
                <span>
                  <small className="mono">Email</small>
                  {EVENT.email}
                </span>
                <ArrowUpRight size={18} />
              </a>
              <a href={EVENT.instagram} target="_blank" rel="noreferrer" className="channel" data-cursor="Follow">
                <Instagram size={20} />
                <span>
                  <small className="mono">Instagram</small>@tedxthyna
                </span>
                <ArrowUpRight size={18} />
              </a>
              <a href={EVENT.linkedin} target="_blank" rel="noreferrer" className="channel" data-cursor="Follow">
                <Linkedin size={20} />
                <span>
                  <small className="mono">LinkedIn</small>TEDxThyna Youth
                </span>
                <ArrowUpRight size={18} />
              </a>
            </div>
          </div>
          <Reveal className="contact-form-wrap">
            <form className="form" onSubmit={submit}>
              <fieldset className="field">
                <legend className="mono">Subject</legend>
                <div className="chips">
                  {TOPICS.map((t) => (
                    <label key={t} className={`chip ${topic === t ? "is-on" : ""}`}>
                      <input type="radio" name="topic" value={t} checked={topic === t} onChange={() => setTopic(t)} />
                      {t}
                    </label>
                  ))}
                </div>
              </fieldset>
              <div className="field-row">
                <label className="field">
                  <span className="mono">Name</span>
                  <input name="name" required autoComplete="name" placeholder="Your name" />
                </label>
                <label className="field">
                  <span className="mono">Email</span>
                  <input name="email" type="email" required autoComplete="email" placeholder="you@example.com" />
                </label>
              </div>
              <label className="field">
                <span className="mono">Your question or message</span>
                <textarea name="message" required rows={6} placeholder="Tell us what is on your mind…" />
              </label>
              <button className="btn btn-red btn-wide" type="submit" data-cursor="Send">
                <span className="btn-fill" />
                <span className="btn-label">{sent ? "Message ready to send" : "Send your message"}</span>
                <Send size={16} />
              </button>
              <p className="form-note mono">Submitting opens your email app with your message pre-filled.</p>
            </form>
          </Reveal>
        </section>
        <NextFile current="/contact" />
      </main>
    </Page>
  );
}
