import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight, Check } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { EVENT } from "@/data/site";
import { Reveal } from "@/components/site/motion";
import { Kicker, NextFile, Page, PageHero } from "@/components/site/Page";

const PROFILES = ["Student", "Professional", "Entrepreneur", "Other"];

function fileId(seed: string) {
  let h = 2166136261;
  for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return `TX-${String(Math.abs(h) % 100000).padStart(5, "0")}`;
}

function Ticket({ name, profile }: { name: string; profile: string }) {
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const sx = useSpring(rx, { stiffness: 150, damping: 15 });
  const sy = useSpring(ry, { stiffness: 150, damping: 15 });
  const shine = useTransform(sy, [-12, 12], ["0%", "100%"]);
  const holder = name.trim() || "Your name here";
  const id = useMemo(() => fileId(name.trim().toLowerCase() || "guest"), [name]);

  return (
    <div
      className="ticket-stage"
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        ry.set(((e.clientX - r.left) / r.width - 0.5) * 24);
        rx.set(-((e.clientY - r.top) / r.height - 0.5) * 18);
      }}
      onPointerLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
    >
      <motion.div className="ticket" style={{ rotateX: sx, rotateY: sy }} aria-label="Your access pass preview">
        <motion.span className="ticket-shine" style={{ left: shine }} aria-hidden />
        <div className="ticket-main">
          <div className="ticket-top">
            <img src="/media/wordmark-light.png" alt="TEDx Thyna Youth" />
            <span className="mono red">Access pass</span>
          </div>
          <span className="mono ticket-label">Holder</span>
          <strong className={`ticket-name ${name.trim() ? "" : "is-empty"}`}>{holder}</strong>
          <div className="ticket-grid">
            <div>
              <span className="mono">Date</span>
              <b>{EVENT.dateShort}</b>
            </div>
            <div>
              <span className="mono">Venue</span>
              <b>C.C. Jamoussi</b>
            </div>
            <div>
              <span className="mono">Profile</span>
              <b>{profile || "—"}</b>
            </div>
            <div>
              <span className="mono">Seat</span>
              <b>TBA</b>
            </div>
          </div>
        </div>
        <div className="ticket-stub">
          <img src="/media/mark-512.png" alt="" />
          <span className="mono ticket-id">{id}</span>
          <span className="ticket-barcode" aria-hidden />
          <span className="mono">Admit one</span>
        </div>
      </motion.div>
    </div>
  );
}

export default function Register() {
  const [name, setName] = useState("");
  const [profile, setProfile] = useState("");
  const [sent, setSent] = useState(false);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const subject = encodeURIComponent(`TEDx Thyna Registration — ${d.get("name")}`);
    const body = encodeURIComponent(
      `Name: ${d.get("name")}\nEmail: ${d.get("email")}\nPhone: ${d.get("phone") || "—"}\nProfile: ${d.get("profile") || "—"}\n\nWhy I want to attend:\n${d.get("why") || "—"}\n\nPass ID: ${fileId(String(d.get("name")).trim().toLowerCase())}`,
    );
    window.location.href = `mailto:${EVENT.email}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <Page title="Register — TEDx Thyna Youth">
      <PageHero
        code="08"
        label="Registration"
        image="archive"
        title={[
          <span key="a">Your seat</span>,
          <span key="b">
            has been <em>identified.</em>
          </span>,
        ]}
        lead="The operation is already in motion. Register your intent and enter the archive."
        meta={[
          ["Date", EVENT.dateLabel],
          ["Seats", "Limited"],
        ]}
      />
      <main>
        <section className="section register">
          <div className="register-form-wrap">
            <Kicker code="08.1">Access protocol</Kicker>
            <h2 className="display small">
              Join the <em>operation.</em>
            </h2>
            <p className="lead-copy">Registration opens soon. Leave a signal and the team will contact you the moment seats are released.</p>
            <form className="form" onSubmit={submit}>
              <label className="field">
                <span className="mono">Full name</span>
                <input name="name" required autoComplete="name" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} maxLength={40} />
              </label>
              <div className="field-row">
                <label className="field">
                  <span className="mono">Email</span>
                  <input name="email" type="email" required autoComplete="email" placeholder="you@example.com" />
                </label>
                <label className="field">
                  <span className="mono">Phone</span>
                  <input name="phone" type="tel" autoComplete="tel" placeholder="+216 …" />
                </label>
              </div>
              <fieldset className="field">
                <legend className="mono">You are</legend>
                <div className="chips">
                  {PROFILES.map((p) => (
                    <label key={p} className={`chip ${profile === p ? "is-on" : ""}`}>
                      <input type="radio" name="profile" value={p} checked={profile === p} onChange={() => setProfile(p)} />
                      {profile === p && <Check size={13} />} {p}
                    </label>
                  ))}
                </div>
              </fieldset>
              <label className="field">
                <span className="mono">Why do you want to attend?</span>
                <textarea name="why" rows={4} placeholder="One question you would ask the stage…" />
              </label>
              <button type="submit" className="btn btn-red btn-wide" data-cursor="Send">
                <span className="btn-fill" />
                <span className="btn-label">{sent ? "Signal ready — check your mail app" : "Send my registration"}</span>
                <ArrowUpRight size={16} />
              </button>
              <p className="form-note mono">Submitting opens your email app with your details pre-filled, addressed to {EVENT.email}.</p>
            </form>
          </div>
          <Reveal className="register-ticket">
            <Ticket name={name} profile={profile} />
            <p className="mono ticket-caption">Live preview — your pass updates as you type</p>
          </Reveal>
        </section>
        <NextFile current="/register" />
      </main>
    </Page>
  );
}
