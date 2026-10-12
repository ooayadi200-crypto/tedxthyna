# Registration backend — Google Sheets + Apps Script

Registrations are saved in a Google Sheet. The script issues ticket numbers
(`TY2026 - 0001`, `TY2026 - 0002`, …), blocks duplicate emails (re-registering
returns the same ticket) and emails each attendee a confirmation.

## Setup (≈5 minutes)

1. Create a new Google Sheet, e.g. **TEDx Thyna Youth 2026 — Registrations**.
2. In the sheet: **Extensions → Apps Script**.
3. Replace the content of `Code.gs` with [`Code.gs`](./Code.gs) from this folder. Save.
4. Optional: edit `SETTINGS` at the top (`MAX_SEATS` to cap registrations, `REPLY_TO`, …).
5. **Deploy → New deployment** → type **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Click **Deploy** and authorise (Sheets + send email).
6. Copy the **Web app URL** (`https://script.google.com/macros/s/…/exec`).
7. Paste it into [`../config.js`](../config.js) as `ENDPOINT`, commit and push.

The first registration creates the **Registrations** tab with headers automatically.

## Updating the script later

After editing `Code.gs`: **Deploy → Manage deployments → ✏️ → Version: New version → Deploy**.
The URL stays the same, so `config.js` doesn't change.

## On event day

The sheet has a **Checked in** column — filter by ticket number or name at the door
and mark attendees as they arrive.

## Limits

Gmail allows ~100 confirmation emails/day on a free account (1,500 on Workspace).
If the quota is reached the registration is still saved; only the email is skipped.
