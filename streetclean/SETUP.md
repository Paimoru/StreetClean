# StreetClean — Prototype Setup

## Run it

This version uses Firebase Authentication + Firestore, so accounts and user activity are shared across browsers instead of being tied to one laptop.

1. Open the `streetclean` folder in VS Code.
2. Make sure the Firebase project in `js/firebase-config.js` has **Authentication → Email/Password** enabled.
3. Make sure **Firestore Database** is enabled.
4. Publish `firestore.rules` to the Firebase project.
5. Install the **Live Server** extension if you don't have it.
6. Right-click `index.html` → **Open with Live Server**.

The first authenticated visitor creates the four fixed demo reports in Firestore. They are demo fixtures, not activity belonging to a real account.

## What's working

- **Home** — login form is shown directly on the main webpage when logged out
- **Registration/Login** — Firebase Authentication accounts
- **Report** — reports are saved with the reporter's Firebase UID
- **Browse** — claims are saved with the cleaner's Firebase UID
- **My Tasks** — only shows tasks claimed by the logged-in cleaner
- **Verify** — only verifiers can approve pending cleanups
- **Wallet** — only shows transactions belonging to the logged-in cleaner
- **Logout** — signs out the current Firebase account
- **Account-specific data** — user actions are associated with `uid`, not the word `You`

The old role switcher was removed. A user's role now comes from their account profile.

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

## Firebase data model

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
