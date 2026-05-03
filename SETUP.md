# Home in the UK — Property Cost Tracker

A self-contained tool to track every cost of buying and renovating each property you've shortlisted in Surrey/Guildford. Built for a tight budget (~£400k), first-time buyer with a mortgage, May 2026.

## Files in this folder

- **property-cost-tracker.html** — the app itself. Just open it in any browser (Chrome, Safari, Firefox).
- **google-apps-script.gs** — the small backend script that lets you and your partner share data live.
- **SETUP.md** — this file.

## Quick start (single-user, no setup)

1. Double-click `property-cost-tracker.html`.
2. Click **+ Add property**, fill in the listing URL from Zoopla/Rightmove, the asking price, EPC, council tax band, etc.
3. Mandatory costs (Stamp Duty, conveyancing, mortgage, survey, move-in) are pre-filled with current Surrey averages. Edit any number to override.
4. Add renovation line items per room or category. Use the **Add common item** dropdown for typical Surrey/Guildford prices, or add your own quotes.
5. Use **Compare** to put 2–4 properties side by side; the cheapest cell on each row is highlighted.
6. Hit **Export** to download a backup JSON anytime.

Your data lives in your browser's localStorage by default — it survives reloads and restarts but stays on this one device.

## Sharing live with your partner (5-min Google Sheets setup)

This gives both of you a synced view from any device, free, with your data living in your own Google account.

### Step 1 — Create the sheet

1. Go to [drive.google.com](https://drive.google.com) → New → Google Sheets.
2. Rename the first tab to exactly `data`.
3. Rename the file to something memorable, e.g. *Home in the UK — sync*.

### Step 2 — Paste the script

1. In the Sheet: **Extensions → Apps Script**. A new tab opens.
2. Delete the placeholder code.
3. Open `google-apps-script.gs` from this folder, copy everything, and paste it into the Apps Script editor.
4. **Important:** near the top, change the line
   ```js
   const SHARED_TOKEN = "CHANGE-ME-PICK-A-SECRET-PHRASE";
   ```
   to your own secret phrase. Anything memorable, e.g. `guildford-2026-zakharova`. You and your partner will both type this into the app.
5. Click the **Save** disk icon.

### Step 3 — Deploy as a web app

1. Click **Deploy → New deployment**.
2. Click the gear icon next to "Select type" → choose **Web app**.
3. Settings:
   - **Description:** *Home in the UK sync*
   - **Execute as:** Me (your email)
   - **Who has access:** Anyone with the link
4. Click **Deploy**.
5. Google will ask you to authorize. Click through — when it says "Google hasn't verified this app", click **Advanced → Go to {your project} (unsafe)**. This is normal because it's a script *you wrote*. Allow access.
6. Copy the **Web app URL** — looks like `https://script.google.com/macros/s/AKfyc.../exec`.

### Step 4 — Connect the HTML app

1. Open `property-cost-tracker.html`.
2. Top-right → **Sync setup** → paste the Web app URL and the same shared token.
3. Click **Save & test**. The dot in the top bar should turn green.

### Step 5 — Share with your partner

1. In Google Drive, right-click the Sheet → **Share** → add your partner's email with **Editor** access.
2. Send your partner:
   - the file `property-cost-tracker.html` (they save it anywhere)
   - the **Web app URL** you copied
   - the shared **token**

They open the HTML, paste the URL + token under **Sync setup**, and you're both editing the same data live. Changes sync within ~30 seconds.

## What's included out of the box

For each property:

- **About:** name, address, listing URL, asking price, beds, internal m², tenure, EPC, council tax band, viewing notes
- **Mandatory costs (auto-prefilled, editable):**
  - Stamp Duty (auto-calculated — uses first-time buyer relief and main-residence rules from your Buyer profile; updates whenever you change the price)
  - Solicitor / Land Registry / searches / ID checks / CHAPS
  - Mortgage arrangement / valuation / broker
  - RICS Level 2 survey (switch to Level 3 manually for older properties)
  - Removals / insurance / 1st month council tax / EPC / broadband
- **Renovation budget:**
  - Whole-house items (repaint, recarpet, rewire, doors, skirting, boiler…)
  - Per-room areas: kitchen, living, bedrooms, bathroom, hallway, garden — add/rename freely
  - Each line: quantity × unit × unit price, plus notes
  - Add suppliers for any line (B&Q, Wickes, Howdens, IKEA…), pick one or auto-use the cheapest
  - Optional **room dimensions** → auto-calculator for paint litres, flooring m², tiles, wallpaper rolls, skirting metres
- **All-in summary:** asking price + mandatory + renovation + 10% contingency. £/m² shown if you've entered floor area.
- **Compare** view: 2–4 properties side by side; cheapest cell highlighted per row.

## Buyer profile defaults (change in Settings)

- First-time buyer ✓
- Main residence ✓
- Buying with a mortgage ✓
- Renovation contingency: 10%

These affect Stamp Duty and which costs prefill on every new property.

## Verifying the prefill numbers

I sourced the defaults from current Surrey/Guildford averages (early 2026). Double-check these before relying on any single number:

- **SDLT:** [gov.uk/stamp-duty-land-tax/residential-property-rates](https://www.gov.uk/stamp-duty-land-tax/residential-property-rates)
- **Land Registry fees:** [gov.uk/guidance/hm-land-registry-registration-services-fees](https://www.gov.uk/guidance/hm-land-registry-registration-services-fees)
- **Council tax bands Guildford 2025/26:** [guildford.gov.uk/counciltax](https://www.guildford.gov.uk/counciltax)
- **Conveyancing quotes:** [reallymoving.com](https://www.reallymoving.com)
- **Trade rates:** [checkatrade.com/cost-guides](https://www.checkatrade.com/cost-guides), [mybuilder.com/cost-guides](https://www.mybuilder.com/cost-guides)
- **Material prices:** B&Q, Wickes, Howdens, Topps Tiles, IKEA, Carpetright, Tapi, Screwfix

Worked example, £400k FTB main residence: SDLT = **£5,000** (5% on the slice from £300k–£400k).

## Ideas you might want to add later

These weren't in the original scope but came up while building:

1. **Mortgage repayment estimator** — given deposit %, term, rate → monthly payment. Helps you see total cost of ownership not just upfront.
2. **Time to liveable** — per renovation line, add a "blocks move-in?" toggle and an estimated days-to-complete. Roll up to "weeks until you can move in" vs "weeks to fully done".
3. **EPC-based energy savings** — flag properties with EPC D or worse and estimate retrofit ROI (heat pump + insulation + solar). I have a `home-energy-renovation` skill that can model this if you'd like a follow-up.
4. **DIY vs trade** column on each renovation line, so you can see what the savings would be if your partner does the painting yourselves.
5. **Photo attachments** — currently the app only links to listings; storing photos would need either inline base64 (bloats the JSON) or a Google Drive folder per property. Happy to add either.
6. **Garden specifically:** measurements (m²) → soft landscaping cost / m², plant budget tiers, planning rules around extensions.
7. **Stamp Duty alternative scenarios** — if you ever consider a property over £500k, FTB relief disappears entirely; would be useful to flag this on the property card.
8. **Council tax full-year cost** in the all-in total (currently only first month is included as a move-in cost). I deliberately kept it as 1 month so all-in stays a one-time cash figure, but a separate "annual running cost" panel would be useful.
9. **Renovation timeline Gantt** — once each line item has a duration, plot a simple bar chart of which trades are needed when.
10. **Notes per supplier quote** — currently store/price/URL, could add notes field (lead time, delivery cost, in-stock).

Tell me which of these you'd like and I'll add them.

## Troubleshooting

- **"Offline" or red dot in top bar after setup:** Open the Web app URL directly in a new tab. If it asks you to log in, that means deployment access isn't set to "Anyone with the link" — redeploy with the correct setting.
- **Partner sees different data:** make sure you both used the *same* Web app URL + token. Each deployment of the Apps Script gives a unique URL.
- **Need to fix the script later:** edit it in Apps Script, then **Deploy → Manage deployments → Edit (pencil) → Version: New version → Deploy**. The URL stays the same.
