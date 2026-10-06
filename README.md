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

The live form successfully saved a fictional request, independently read back from Firestore. Invalid API requests were rejected. Mobile/desktop layout, keyboard use, pending state, duplicate-submit prevention and error recovery were checked. The five-species panel totals and labels were checked at widths of 320, 360, 390, 768 and 1440 pixels without horizontal overflow. Error checks used controlled responses and a local missing-configuration scenario; an actual hosted database outage was not induced.

To verify a new submission, use fictional data and confirm that the returned document exists in the `demoRequests` collection.

## Known Limitations

- No authentication, admin panel, email notifications or full shelter-management application.
- No comprehensive bot protection or rate limiting. Origin and body-size checks provide limited protection; repeated valid requests can consume storage quotas. Retrying after a lost response may create a duplicate record.
- Open dependency findings: the latest executed audit reports **5 high and 2 moderate** findings overall; production dependencies have **2 moderate** findings. These remain unresolved.
- [braces advisory](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm): deeply nested patterns can cause stack exhaustion/denial of service in the ESLint dependency chain. No patched version is listed. Form inputs are not passed to this glob parser, the inspected chain parses ESLint root-directory patterns, so exposure in development/build tooling remains relevant.
- [uuid advisory](https://github.com/advisories/GHSA-w5hq-g745-h8pq): unchecked output-buffer bounds in v3/v5/v6 can produce malformed identifiers. The affected version remains in Firebase Admin's transitive dependencies; the inspected gaxios call uses v4, outside those affected methods. The actual gaxios multipart boundary call is `v4()` with no arguments; form inputs cannot select UUID methods or supply output buffers. No fix exists within the current upstream version range: patched UUID 11.1.1 is outside gaxios’s declared `^9.0.1` range. Findings remain open; no forced fix or override was retained.
- Full screen-reader testing and an actual hosted database-outage test were not performed.
