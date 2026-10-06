# Barındım

A Turkish landing page and demo request form for a fictional shelter-management software service. The capacity dashboard is clearly labelled as a sample with fictional data.

## Live link

[barindim.vercel.app](https://barindim.vercel.app) · [Source code](https://github.com/UtkuKesanli/barindim)

## Setup

Use Node.js 22 and npm.

```sh
npm ci
cp .env.example .env.local
# Fill in the Firebase server variables before starting.
npm run dev
```

Open http://localhost:3000. Required environment variables:

- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`

Create a Firebase project with a default Cloud Firestore database. Use the Firebase service account credentials for the variables above, and publish the included `firestore.rules` to deny browser access. The Admin SDK uses server credentials and bypasses these rules. Keep credentials server-side; never commit them or use a `NEXT_PUBLIC_` prefix. The private key can be stored as a quoted string with escaped newlines. Restart the server after changing variables.

For production, build with `npm run build`, then run `npm start`. The deployed site uses Vercel with the same server environment variables.

## Architecture

Next.js App Router, React, TypeScript and plain CSS provide the page and form. A shared Zod schema validates name, email, service selection and description independently in the browser and server.

The form sends JSON to `POST /api/demo-requests`. The server validates the request and writes to Cloud Firestore through Firebase Admin. It returns success only after the write completes. The form shows sending, success and error states, prevents repeated submissions while pending, and preserves entered data on failure.

The fictional panel covers dogs, cats, birds, rabbits and fish. Each row and the grand totals are calculated from occupied, reserved and vacant counts; fish capacity means the number of fish. The sample dashboard describes the product concept; animal intake, reservations and shelter administration are not implemented. The user created the `create-next-app` scaffold; the custom page, form, API and tests were developed with AI assistance. No external landing-page template, image or font was used. Contributions are summarized in `AI_LOG.md`.

## Tests

```sh
npm run test
npm run lint
npm run typecheck
npm run build
npm audit
npm audit --omit=dev
```

All seven automated tests, lint, TypeScript and production build passed. Tests cover invalid requests, validation bypass, delayed/failed writes, malformed JSON, origin checks and body limits. Unit tests use controlled storage; actual persistence was checked separately against Firestore.

The live form saved fictional data that was independently read back from Firestore with its server timestamp. Invalid requests were rejected. Browser checks covered keyboard navigation, validation messages, pending/duplicate prevention and preserved input after failure. At 320, 360, 390 and 430 CSS pixels, the page, panel and totals stayed within their bounds; all four total boxes remained visible in a 2×2 grid, only the table scrolled, and name/email fields stacked at full width. Desktop layout was also checked.

Error checks used controlled responses and a local missing-configuration scenario; an actual hosted database outage was not induced.

To verify a new submission, use fictional data and confirm that the returned document exists in the `demoRequests` collection.

## Known Limitations

- No authentication, admin panel, email notifications or full shelter-management application.
- No comprehensive bot protection or rate limiting. Origin and body-size checks provide limited protection; repeated valid requests can consume storage quotas. Retrying after a lost response may create a duplicate record.
- Open dependency findings: the latest executed audit reports **5 high and 2 moderate** findings overall; production dependencies have **2 moderate** findings. These remain unresolved.
- [braces advisory](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm): nested patterns can cause stack-exhaustion denial of service in ESLint tooling. No patch was listed during review. The inspected path processes ESLint root-directory patterns, not form inputs; tooling exposure remains relevant.
- [uuid advisory](https://github.com/advisories/GHSA-w5hq-g745-h8pq): v3/v5/v6 output-buffer handling can produce malformed identifiers. Firebase Admin's transitive dependency remains affected. The inspected gaxios call uses `v4()` without arguments; form inputs do not reach affected methods or buffers. Patched UUID 11.1.1 exceeds gaxios's declared `^9.0.1` range. No forced fix or override was retained.
- Full screen-reader testing and an actual hosted database-outage test were not performed.
