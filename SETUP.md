# SOS Church website — content setup guide

The parts of the site that change (roster, events, announcements, sermons)
are **not typed into the code**. They come from **Google**. You connect each
one **once** by pasting a link into `script.js`; after that, the church
updates everything through Google — no code, ever.

> **Do all of this in the church's Google account**, not a personal one, so
> the church owns the forms, sheets, and files and it survives any handover.

There are three things to connect. Each is independent.

| Content | Updated by | Paste its link into (`script.js`) |
|---|---|---|
| Events **and** announcements | one Google **Form** | `CONTENT_SHEET_CSV` (line 155) |
| Service roster | a Google **Sheet** | `ROSTER_SHEET_CSV` (line 154) |
| Sermons (PDF downloads) | a Google **Sheet** + Drive | `SERMONS_SHEET_CSV` (line 156) |

---

## 1. Events & Announcements — the Google Form

**One form posts both.** When someone fills it they choose *Event* or
*Announcement*; events show in **Upcoming events**, announcements in
**News & announcements**.

**One-time setup (~3 minutes):**
1. Go to **script.google.com** → **New project**.
2. Delete whatever is in the editor and paste the **whole** `admin-form-setup.gs` file.
3. Press **Save** (disk icon), then **Run**. Google asks for permission — allow it (it's your own account creating your own form).
4. Open the **Execution log**. It prints three links:
   - **FILL** — share this with whoever posts updates.
   - **EDIT** — to change the form's questions later.
   - **SHEET** — where the answers land.
5. Open the **SHEET** → the **"Form Responses 1"** tab → **File → Share → Publish to web** → choose that tab and **Comma-separated values (.csv)** → **Publish** → copy the link.
6. Paste that link into `CONTENT_SHEET_CSV` on **line 155** of `script.js`, between the quotes. Save.

**From then on:** filling the form is the only way anyone posts updates. The
site shows the **3 soonest** upcoming events and the **3 newest** announcements.

---

## 2. Service roster — a Google Sheet

**One-time setup (~2 minutes):**
1. Create a Google Sheet laid out **exactly** like the table on the page — the
   first row is a blank cell then the Sunday dates; each row after is a role
   then the names:

   ```
   (blank)       | Jul 12 | Jul 19 | Jul 26 | Aug 2
   Bible study   | John   | Peter  | …      | …
   Song leading  | …
   Preaching     | …
   Lord's Supper | …
   Offering      | …
   ```
2. **File → Share → Publish to web** → pick that tab → **CSV** → **Publish** → copy the link.
3. Paste it into `ROSTER_SHEET_CSV` on **line 154** of `script.js`. Save.

**From then on:** edit the sheet each week. The leftmost date column always
shows as **"This Sunday,"** so keep columns ordered soonest-first.

---

## 3. Sermons — a Google Sheet + Google Drive

The list shows the **3 most recent** sermons; clicking one **downloads that
week's PDF**.

**One-time setup:**
1. Create a Google Sheet with three columns: **Date · Title · PDF link**.
2. **File → Share → Publish to web** → **CSV** → **Publish** → copy the link.
3. Paste it into `SERMONS_SHEET_CSV` on **line 156** of `script.js`. Save.

**Weekly routine (~1 minute):**
1. Upload the sermon PDF to the church's **Google Drive** → right-click →
   **Share → "Anyone with the link" → Copy link.**
2. Add one row to the Sermons sheet: today's date, the sermon title, and paste
   the link.

The newest sermon jumps to the top and the fourth drops off automatically. The
site turns a Drive share link into a direct download for you (a plain PDF link
from anywhere else works too).

---

## The rules that matter (for all three)

1. Paste each link **between the quotes** in `script.js` and **keep the semicolon** at the end.
2. Use the **"Publish to web" CSV link** (it ends in `output=csv`) — *not* the normal "Share" link and *not* the URL in the browser's address bar.
3. Pasting a link is the **only** code step, and it's **once per source**. After pasting, **save `script.js` and push** so the live site updates.
4. **Updates aren't instant.** Google caches the published data, so a change can take a few minutes to appear. That's normal.
