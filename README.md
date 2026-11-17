# Bandhanam — Invitation & Guest Manager 🪔

Indian wedding & event invitation platform. Zero-budget, multi-language, regional ceremony templates, UPI-based payment with offline activation codes, installable PWA (works on Android, iPhone, desktop).

**Live:** `https://<your-username>.github.io/bandhanam/`

---

## What's in this repo

| File | Purpose |
|------|---------|
| `index.html` | The complete application (HTML + CSS + JS in one file, ~103 KB) |
| `sw.js` | Service worker (offline caching — so the app works without internet after first load) |
| `.nojekyll` | Tells GitHub Pages not to run Jekyll (keeps `sw.js` and the data-URI manifest intact) |
| `.gitignore` | Standard ignores (no secrets — this repo is safe to be Public) |
| `LICENSE` | MIT — you retain copyright, others can study but not resell as-is |
| `README.md` | This file |

---

## Payment & activation model

This is a **zero-backend** app. No database, no server, no payment gateway.

1. User opens the app → taps **Plans** → taps **Pay ₹149 via UPI** (or ₹499 for Pro).
2. App shows your UPI ID + QR code + (collapsible) bank transfer details.
3. User pays you directly via UPI. You see the credit in your bank app.
4. User emails the UPI transaction reference to your support email.
5. You verify the credit, run `python3 bandhanam_code_gen.py generate L` (the generator script — **kept OFF this repo**, on your own computer), and WhatsApp the code to the user.
6. User pastes the code into the app → app verifies the SHA-1 checksum client-side → plan unlocks in `localStorage`.

**Operator payment details baked into `index.html`:**

- UPI ID: `7717625968@ybl`
- Account holder: `KUCHE GANESH`
- Support email: `businessganeshshop@gmail.com`
- Bank transfer fallback: HDFC Bank, IFSC `HDFC0009237`, Branch `SHIVRANJANI CROSS ROAD` (account number visible in-app; MMID intentionally NOT exposed — UPI ID covers all flows).

---

## Deploy (2 options, both free)

### Option A — Web upload (no CLI, ~10 min)

1. Create a public GitHub repo named `bandhanam`.
2. Upload `index.html`, `sw.js`, `.nojekyll`, `.gitignore`, `LICENSE`, `README.md` (drag-drop on the repo's "Add file → Upload files" page).
3. Settings → Pages → Source: `Deploy from a branch`, Branch: `main` / `/(root)`.
4. Wait 2 minutes → your site is live at `https://<your-username>.github.io/bandhanam/`.

### Option B — Git CLI (~5 min after one-time setup)

```bash
git clone https://github.com/<your-username>/bandhanam.git
cd bandhanam
# Copy the 6 files from this package into the folder
git add .
git commit -m "Initial deploy — Bandhanam PWA"
git push origin main
# Then enable Pages: Settings → Pages → main / root
```

---

## Verify the deployment

After Pages is live, open your URL in:

- Desktop Chrome (incognito) — should load in <2s
- Mobile Chrome (Android) on 4G — should load in <5s, install prompt after ~30s
- Mobile Safari (iPhone) — Share → Add to Home Screen → installs as native app

Run these 3 checks:

1. Tap **Plans → Pay ₹149 via UPI**. You should see `7717625968@ybl` + a QR code.
2. Tap the **"No UPI? Pay via Bank Transfer (NEFT/IMPS)"** line — it expands to show account `50100746583439`, IFSC `HDFC0009237`.
3. DevTools (F12) → Application → Service Workers — should show `sw.js` activated (status 0).

---

## Local development

Just open `index.html` in a browser. No build step. No dependencies.

To test the service worker locally, serve over HTTP (SW requires http/https, not file://):

```bash
cd bandhanam-deploy
python3 -m http.server 8080
# open http://localhost:8080/
```

---

## Tech stack

- Vanilla HTML5 + CSS3 + JS (no frameworks — 1 file, ~103 KB)
- Web Crypto API (SHA-1) for activation-code verification
- Service Worker API for offline caching
- Web App Manifest (inline data-URI) for PWA installability
- localStorage for state (no database)

---

## Security notes

- The activation-code secret ships in the client JS. This is an accepted trade-off for zero-backend simplicity — the value at stake (₹149–₹499) is too small to justify a license server. Rotate the secret in both `index.html` and the private `bandhanam_code_gen.py` if it ever leaks.
- **Never** commit `bandhanam_code_gen.py` to this repo. Keep it only on your own computer.
- MMID is intentionally NOT in the app. UPI ID covers all UPI flows; bank transfer fallback uses account + IFSC only.

---

## License

MIT — see `LICENSE`. You (KUCHE GANESH) retain copyright; others may study and fork but may not resell as-is without attribution.

---

## Support

Email: `businessganeshshop@gmail.com`
