/**
 * TEDx Thyna Youth — registration backend (Google Apps Script).
 *
 * Stores every registration in the bound Google Sheet, issues sequential
 * ticket numbers (TY2026 - 0001, TY2026 - 0002, …), prevents duplicates
 * by email, and sends a confirmation email. Setup: see README.md.
 */

const SETTINGS = {
  SHEET_NAME: "Registrations",
  TICKET_PREFIX: "TY2026",
  MAX_SEATS: 0, // 0 = unlimited. Set e.g. 450 to close registration automatically.
  SEND_CONFIRMATION_EMAIL: true,
  REGISTER_URL: "https://register.tedxthyna.com",
  REPLY_TO: "affes.zied@tedxthyna.com",
};

const HEADERS = ["Timestamp", "Ticket", "Full name", "Email", "Phone", "Profile", "School / company", "Source", "Consent", "Checked in", "User agent"];

function doGet() {
  return json_({ ok: true, service: "tedx-thyna-register" });
}

function doPost(e) {
  let body;
  try {
    body = JSON.parse((e && e.postData && e.postData.contents) || "{}");
  } catch (err) {
    return json_({ ok: false, error: "invalid" });
  }

  const sheet = sheet_();
  const email = String(body.email || "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return json_({ ok: false, error: "invalid" });

  if (body.action === "lookup") {
    const found = findByEmail_(sheet, email);
    return found ? json_({ ok: true, existing: true, ticket: found.ticket, name: found.name }) : json_({ ok: false, error: "not-found" });
  }

  if (body.action !== "register") return json_({ ok: false, error: "invalid" });

  const name = clean_(body.name, 40);
  const phone = clean_(body.phone, 25);
  if (name.length < 3 || phone.replace(/\D/g, "").length < 8 || !body.consent) return json_({ ok: false, error: "invalid" });

  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const existing = findByEmail_(sheet, email);
    if (existing) return json_({ ok: true, existing: true, ticket: existing.ticket, name: existing.name });

    const count = Math.max(0, sheet.getLastRow() - 1);
    if (SETTINGS.MAX_SEATS && count >= SETTINGS.MAX_SEATS) return json_({ ok: false, error: "full" });

    // A persistent counter keeps numbers unique even if rows are later deleted or re-sorted.
    const props = PropertiesService.getScriptProperties();
    const next = Math.max(Number(props.getProperty("LAST_TICKET") || 0), count) + 1;
    props.setProperty("LAST_TICKET", String(next));
    const ticket = SETTINGS.TICKET_PREFIX + " - " + String(next).padStart(4, "0");
    sheet.appendRow([
      new Date(),
      ticket,
      name,
      email,
      "'" + phone,
      clean_(body.profile, 40),
      clean_(body.organization, 80),
      clean_(body.source, 40),
      "Yes",
      "",
      clean_(body.userAgent, 180),
    ]);
    SpreadsheetApp.flush();

    if (SETTINGS.SEND_CONFIRMATION_EMAIL) {
      try {
        sendConfirmation_(email, name, ticket);
      } catch (mailErr) {
        console.warn("Confirmation email failed: " + mailErr);
      }
    }
    return json_({ ok: true, existing: false, ticket: ticket, name: name });
  } finally {
    lock.releaseLock();
  }
}

/* ───────── helpers ───────── */

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SETTINGS.SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SETTINGS.SHEET_NAME);
    sh.appendRow(HEADERS);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold").setBackground("#e62b1e").setFontColor("#ffffff");
  }
  return sh;
}

function findByEmail_(sheet, email) {
  const last = sheet.getLastRow();
  if (last < 2) return null;
  const rows = sheet.getRange(2, 2, last - 1, 3).getValues(); // Ticket, Name, Email
  for (let i = 0; i < rows.length; i++) {
    if (String(rows[i][2]).trim().toLowerCase() === email) return { ticket: rows[i][0], name: rows[i][1] };
  }
  return null;
}

function clean_(v, max) {
  return String(v || "")
    .replace(/[\u0000-\u001f<>]/g, "")
    .replace(/^[=+\-@]+/, "") // block spreadsheet formula injection
    .trim()
    .slice(0, max);
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function sendConfirmation_(email, name, ticket) {
  const html =
    '<div style="font-family:Montserrat,Arial,sans-serif;max-width:560px;margin:auto;color:#111">' +
    '<div style="background:#000;padding:22px 26px"><span style="color:#e62b1e;font-weight:800;font-size:22px">TED<sup>x</sup></span> ' +
    '<span style="color:#fff;font-size:20px">Thyna Youth</span></div>' +
    '<div style="padding:26px;border:1px solid #eee;border-top:0">' +
    "<p>Hi " + escape_(name) + ",</p>" +
    "<p>Your General Pass for <b>TEDx Thyna Youth 2026 — Break The Pattern</b> is confirmed.</p>" +
    '<p style="font-size:13px;letter-spacing:2px;color:#777;margin:22px 0 4px">TICKET Nº</p>' +
    '<p style="font-size:30px;font-weight:800;margin:0 0 22px">' + ticket + "</p>" +
    "<p><b>15 November 2026</b> · 10:00 – 20:00<br>Complexe Culturel Mohamed Jamoussi, Rue Ibn Al Jazzar, Sfax</p>" +
    '<p>Download your ticket any time at <a href="' + SETTINGS.REGISTER_URL + '" style="color:#e62b1e">' +
    SETTINGS.REGISTER_URL.replace("https://", "") + "</a> → “I already registered”.</p>" +
    '<p style="color:#777;font-size:12px;margin-top:28px">x = independently organized TED event</p></div></div>';
  MailApp.sendEmail({
    to: email,
    subject: "Your TEDx Thyna Youth pass · " + ticket,
    htmlBody: html,
    name: "TEDx Thyna Youth",
    replyTo: SETTINGS.REPLY_TO,
  });
}

function escape_(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}
