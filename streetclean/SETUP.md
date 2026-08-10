# StreetClean — Prototype Setup

## Run it right now (zero setup)

This is plain HTML/CSS/JS. No build step, no npm install.

1. Open the `streetclean` folder in VS Code.
2. Install the **Live Server** extension (if you don't have it).
3. Right-click `index.html` → **Open with Live Server**.

That's it. The app works fully offline using your browser's `localStorage`
as a stand-in database, pre-loaded with 4 sample reports.

## What's already working

- **Home** — dashboard feed + live stats
- **Report** — submit a new litter report with photo + bounty → becomes an open commission instantly
- **Browse** — claim an open commission
- **My Tasks** — upload an after-photo to send a claimed task for verification
- **Verify** — compare before/after photos, verify, release payment
- **Wallet** — running balance + transaction history

The role switcher in the header (Resident / Cleaner / Verifier) is currently
just a label for the demo narrative — it doesn't restrict what you can click.
That's fine for a hackathon demo: it lets you tell the story of switching
roles without needing real auth.

## Where everything lives

```
streetclean/
├── index.html          Home dashboard
├── report.html          Submit a report
├── commissions.html     Browse & claim
├── my-tasks.html         My claimed tasks + submit proof
├── verify.html           Verify & pay
├── wallet.html            Earnings + history
├── css/style.css        All styling (one file, shared design tokens at the top)
├── js/db.js              Data layer — READ THIS FIRST if you're doing Day 2
└── js/app.js             Shared header/nav + small helpers
```

Every page follows the same pattern: it calls `renderShell()` for the header/nav,
then reads/writes data only through `DB.xxx()` functions. **Nobody should touch
`localStorage` directly outside of `db.js`** — that's what makes the Firebase
swap on Day 2 painless.

## Day 2: swapping in Firebase

1. Create a Firebase project → enable **Firestore** and **Storage**.
2. Add the Firebase SDK `<script>` tags + your config to each page (or a shared `firebase-init.js`).
3. Open `js/db.js`. Every function (`getTasks`, `addReport`, `claimTask`, `submitProof`, `verifyAndPay`, etc.)
   has a comment showing what its Firestore version looks like. Replace the
   localStorage line(s) inside each function with the equivalent Firestore call.
4. Because every page only calls `DB.xxx()`, you don't have to touch `index.html`,
   `report.html`, etc. at all — the swap is contained to one file.

Suggested Firestore collections to mirror the current shape:
- `tasks` — same fields as the objects in `db.js` (title, description, bounty, status, photoBefore, photoAfter, claimedBy, createdAt)
- `transactions` — taskTitle, amount, date

For photo uploads, swap `readImageAsDataURL()` (which currently just base64-encodes
the file for localStorage) for an upload to **Firebase Storage**, then store the
resulting URL on the task instead of a base64 string.

## Team split suggestion

- **Backend/data owner**: owns `js/db.js`, does the Firebase swap on Day 2
- **Report + Browse pages**: `report.html`, `commissions.html`
- **My Tasks + Verify pages**: `my-tasks.html`, `verify.html`
- **Wallet + polish**: `wallet.html`, seed data, styling pass, `css/style.css`
- **Pitch + demo**: script, slides, screen-recording backup

## Before demo day

- [ ] Replace the 4 seed reports in `js/db.js` with better, more realistic-looking ones (real photos help a lot)
- [ ] Do 3 full run-throughs on the actual demo laptop
- [ ] Record a screen-capture backup of a full run-through
- [ ] Deploy to Firebase Hosting (or GitHub Pages) so you have a real URL, not just localhost
