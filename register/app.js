/* TEDx Thyna Youth — registration app (vanilla JS, no build step). */
(function () {
  "use strict";

  const CFG = window.TEDX_REGISTER || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  const canvas = $("#ticket");
  const ctx = canvas.getContext("2d");
  const stage = $("#ticketStage");
  const tilt = $("#ticketTilt");
  const form = $("#form");
  const nameInput = $("#name");
  const errorBox = $("#error");
  const submitBtn = $("#submitBtn");
  let mode = "register";
  let issued = null; // { ticket, name }

  /* ───────── ticket rendering ───────── */

  // Positions are in the template's native pixels (1772 × 709).
  const SPOT = {
    name: { x: 915, y: 566, maxW: 230, size: 21 },
    number: { x: 1592, y: 636, maxW: 270, size: 34 },
  };

  const template = new Image();
  template.decoding = "async";
  template.src = "/assets/ticket-template.webp";

  function fitFont(text, weight, size, maxW) {
    let s = size;
    do {
      ctx.font = `${weight} ${s}px Montserrat, "DM Sans", sans-serif`;
      if (ctx.measureText(text).width <= maxW) break;
      s -= 1;
    } while (s > 10);
    return s;
  }

  function draw(name, number) {
    if (!template.complete || !template.naturalWidth) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(template, 0, 0, canvas.width, canvas.height);
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";

    // attendee name under "GENERAL PASS"
    const holder = (name || "").trim().toUpperCase() || "YOUR NAME";
    fitFont(holder, 600, SPOT.name.size, SPOT.name.maxW);
    ctx.fillStyle = name && name.trim() ? "#111111" : "#9a9a9a";
    if ("letterSpacing" in ctx) ctx.letterSpacing = "1px";
    ctx.fillText(holder, SPOT.name.x, SPOT.name.y);

    // ticket number on the stub
    const num = number || `${CFG.TICKET_PREFIX || "TY2026"} - ····`;
    fitFont(num, 700, SPOT.number.size, SPOT.number.maxW);
    ctx.fillStyle = number ? "#0b0b0b" : "#b9b9b9";
    if ("letterSpacing" in ctx) ctx.letterSpacing = "0px";
    ctx.fillText(num, SPOT.number.x, SPOT.number.y);
  }

  const redraw = () => draw(issued ? issued.name : nameInput.value, issued ? issued.ticket : null);
  template.addEventListener("load", redraw);
  if (document.fonts && document.fonts.load) {
    Promise.all([document.fonts.load('600 20px "Montserrat"'), document.fonts.load('700 30px "Montserrat"')]).then(redraw, redraw);
  }
  nameInput.addEventListener("input", () => {
    if (!issued) redraw();
  });

  // gentle 3D tilt on pointer devices
  stage.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = stage.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    tilt.style.transform = `rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
  });
  stage.addEventListener("pointerleave", () => (tilt.style.transform = ""));

  /* ───────── modes ───────── */

  function setMode(next) {
    mode = next;
    $$(".tab").forEach((t) => {
      const on = t.dataset.mode === next;
      t.classList.toggle("is-on", on);
      t.setAttribute("aria-selected", String(on));
    });
    $(".mode-register").hidden = next !== "register";
    $(".mode-lookup").hidden = next !== "lookup";
    $$(".mode-register [required]").forEach((el) => (el.disabled = next !== "register"));
    $('[name="lookupEmail"]').required = next === "lookup";
    $(".label", submitBtn).textContent = next === "register" ? "Get my pass" : "Find my pass";
    hideError();
  }
  $$(".tab").forEach((t) => t.addEventListener("click", () => setMode(t.dataset.mode)));

  /* ───────── validation ───────── */

  function showError(msg) {
    errorBox.textContent = msg;
    errorBox.hidden = false;
  }
  function hideError() {
    errorBox.hidden = true;
    $$(".is-bad").forEach((el) => el.classList.remove("is-bad"));
  }
  const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  const phoneOk = (v) => v.replace(/[^\d]/g, "").length >= 8;

  function validate(data) {
    const bad = [];
    if (mode === "lookup") {
      if (!emailOk(data.lookupEmail || "")) bad.push("lookupEmail");
    } else {
      if (!data.name || data.name.trim().length < 3) bad.push("name");
      if (!emailOk(data.email || "")) bad.push("email");
      if (!phoneOk(data.phone || "")) bad.push("phone");
      if (!data.profile) bad.push("profile");
      if (!data.source) bad.push("source");
      if (!data.consent) bad.push("consent");
    }
    bad.forEach((n) => {
      const el = form.elements[n];
      (el.closest(".field") || el.closest(".check")).classList.add("is-bad");
    });
    if (bad.length) {
      form.elements[bad[0]].focus();
      return bad.includes("consent") && bad.length === 1 ? "Please accept the consent checkbox." : "Please check the highlighted fields.";
    }
    return null;
  }

  /* ───────── submit ───────── */

  async function call(payload) {
    if (!CFG.ENDPOINT) throw new Error("not-configured");
    const res = await fetch(CFG.ENDPOINT, { method: "POST", body: JSON.stringify(payload), redirect: "follow" });
    if (!res.ok) throw new Error("http-" + res.status);
    return res.json();
  }

  const MESSAGES = {
    "not-configured": "Registration is being set up — please try again in a few minutes.",
    "not-found": "We couldn't find a pass for that email. Check the spelling, or register.",
    full: "We're sorry — all seats have been claimed. Follow @tedxthyna for any released seats.",
    invalid: "Some details look incorrect. Please check the form.",
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideError();
    const fd = new FormData(form);
    const data = Object.fromEntries(fd.entries());
    data.consent = fd.get("consent") === "on";
    if (data.website) return; // bot honeypot
    const problem = validate(data);
    if (problem) return showError(problem);

    submitBtn.disabled = true;
    submitBtn.classList.add("is-loading");
    try {
      const payload =
        mode === "lookup"
          ? { action: "lookup", email: data.lookupEmail.trim().toLowerCase() }
          : {
              action: "register",
              name: data.name.trim().replace(/\s+/g, " "),
              email: data.email.trim().toLowerCase(),
              phone: data.phone.trim(),
              profile: data.profile,
              organization: (data.organization || "").trim(),
              source: data.source,
              consent: true,
              userAgent: navigator.userAgent.slice(0, 180),
            };
      const out = await call(payload);
      if (!out || !out.ok) throw new Error((out && out.error) || "unknown");
      issue(out.ticket, out.name, out.existing || mode === "lookup");
    } catch (err) {
      const key = String(err && err.message);
      showError(MESSAGES[key] || "Something went wrong. Please check your connection and try again.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.classList.remove("is-loading");
    }
  });

  /* ───────── issued ticket ───────── */

  function issue(ticket, name, existing) {
    issued = { ticket, name };
    redraw();
    stage.classList.remove("is-issued");
    void stage.offsetWidth;
    stage.classList.add("is-issued");
    form.hidden = true;
    $(".tabs").hidden = true;
    $("#success").hidden = false;
    $("#successKicker").textContent = existing ? `Welcome back · ${ticket}` : `You're in · ${ticket}`;
    $("#successText").textContent = existing
      ? "Here is your pass again. Download it and show it at the entrance — on your phone or printed."
      : "Your pass is ready. Download it and show it at the entrance — on your phone or printed. A confirmation is on its way to your inbox.";
    $("#ticketHint").textContent = "Your official pass — keep it safe.";
    $("#ticketActions").hidden = false;
    buildCalendar();
    if (navigator.canShare) $("#shareBtn").hidden = false;
    stage.scrollIntoView({ behavior: "smooth", block: "center" });
    try {
      localStorage.setItem("tedx-thyna-pass", JSON.stringify(issued));
    } catch (_) {
      /* storage unavailable */
    }
  }

  const fileName = () => `TEDxThynaYouth-Pass-${issued.ticket.replace(/\s+/g, "")}.png`;
  const toBlob = () => new Promise((resolve) => canvas.toBlob(resolve, "image/png"));

  $("#downloadBtn").addEventListener("click", async () => {
    const blob = await toBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName();
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  });

  $("#shareBtn").addEventListener("click", async () => {
    const blob = await toBlob();
    const file = new File([blob], fileName(), { type: "image/png" });
    const data = { files: [file], title: "My TEDx Thyna Youth pass", text: "See you on 15 November at TEDx Thyna Youth! Get yours: https://register.tedxthyna.com" };
    try {
      if (navigator.canShare(data)) await navigator.share(data);
      else await navigator.share({ title: data.title, text: data.text, url: "https://register.tedxthyna.com" });
    } catch (_) {
      /* user cancelled */
    }
  });

  function buildCalendar() {
    const esc = (s) => String(s).replace(/[,;\\]/g, (m) => "\\" + m);
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//TEDx Thyna Youth//Register//EN",
      "BEGIN:VEVENT",
      `UID:${issued.ticket.replace(/\s+/g, "")}@tedxthyna.com`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+/, "")}`,
      `DTSTART;TZID=${CFG.EVENT_TZ}:${CFG.EVENT_START}`,
      `DTEND;TZID=${CFG.EVENT_TZ}:${CFG.EVENT_END}`,
      `SUMMARY:${esc(CFG.EVENT_TITLE)}`,
      `LOCATION:${esc(CFG.EVENT_LOCATION)}`,
      `DESCRIPTION:${esc(`General Pass ${issued.ticket} — ${issued.name}. Bring your ticket (phone or printed).`)}`,
      "URL:https://tedxthyna.com",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    $("#calendarBtn").href = "data:text/calendar;charset=utf-8," + encodeURIComponent(ics);
  }

  $("#againBtn").addEventListener("click", () => {
    issued = null;
    form.reset();
    form.hidden = false;
    $(".tabs").hidden = false;
    $("#success").hidden = true;
    $("#ticketActions").hidden = true;
    $("#ticketHint").textContent = "Live preview — your name appears on the pass as you type.";
    setMode("register");
    redraw();
    nameInput.focus();
  });

  setMode("register");
})();
