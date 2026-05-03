/**
 * Home in the UK — Property Cost Tracker
 * Google Apps Script backend for live sync between you and your partner.
 *
 * What this does:
 *   - Stores the whole app state (your properties + costs) in a single Google Sheet you own.
 *   - Exposes two HTTP endpoints (GET to read, POST to write) that the HTML app calls.
 *   - Protects your data with a simple shared token you choose.
 *
 * SETUP — 5 minutes total:
 *
 *   1. Create a new Google Sheet (drive.google.com → New → Google Sheets).
 *      Rename the first tab to: data
 *
 *   2. In that Sheet, click  Extensions → Apps Script.
 *      Delete any code you see and paste THIS ENTIRE FILE in.
 *
 *   3. At the top of the file below, change SHARED_TOKEN to something only
 *      you and your partner know (e.g. "guildford-2026-zakharova").
 *      It must match what you type into the HTML app.
 *
 *   4. Click  Save (the disk icon).  Then click  Deploy → New deployment.
 *      Settings:
 *        - Type:               Web app
 *        - Description:        Home in the UK sync
 *        - Execute as:         Me (your gmail)
 *        - Who has access:     Anyone with the link
 *      Click Deploy. Authorize when prompted ("Advanced → Go to project (unsafe)" is normal).
 *
 *   5. Copy the Web app URL it gives you (looks like
 *      https://script.google.com/macros/s/AKfycb…/exec).
 *
 *   6. Open property-cost-tracker.html in your browser.
 *      Click "Sync setup" in the top bar → paste the URL and the token.
 *
 *   7. Share the Google Sheet itself with your partner (right-click in Drive →
 *      Share). Send your partner the HTML file + the URL + the token.
 *      Both of you can now edit the same data live.
 */

const SHARED_TOKEN = "CHANGE-ME-PICK-A-SECRET-PHRASE";   // ← change this!

const SHEET_NAME = "data";
const STATE_CELL = "A1";

function _sheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) sh = ss.insertSheet(SHEET_NAME);
  return sh;
}

function _ok(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(Object.assign({ ok: true }, payload || {})))
    .setMimeType(ContentService.MimeType.JSON);
}
function _err(message) {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: false, error: message }))
    .setMimeType(ContentService.MimeType.JSON);
}

/** GET /exec?token=…&action=load   → returns saved state */
function doGet(e) {
  try {
    const token = (e.parameter && e.parameter.token) || "";
    if (token !== SHARED_TOKEN) return _err("bad token");
    const action = (e.parameter && e.parameter.action) || "load";
    if (action === "load") {
      const raw = _sheet().getRange(STATE_CELL).getValue();
      if (!raw) return _ok({ state: null });
      try {
        return _ok({ state: JSON.parse(raw) });
      } catch (parseErr) {
        return _err("stored data is not valid JSON");
      }
    }
    return _err("unknown action");
  } catch (err) {
    return _err(String(err));
  }
}

/** POST /exec  with JSON body { token, action:"save", state } */
function doPost(e) {
  try {
    let body = {};
    try { body = JSON.parse(e.postData.contents); } catch (_) { return _err("invalid JSON"); }
    if ((body.token || "") !== SHARED_TOKEN) return _err("bad token");
    if (body.action === "save") {
      if (!body.state) return _err("no state provided");
      // Stringify with no indentation to keep the cell small. Sheets allows ~50,000 chars per cell;
      // for typical use (a handful of properties) you'll be well under that.
      _sheet().getRange(STATE_CELL).setValue(JSON.stringify(body.state));
      return _ok({ savedAt: new Date().toISOString() });
    }
    return _err("unknown action");
  } catch (err) {
    return _err(String(err));
  }
}
