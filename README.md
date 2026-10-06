# Barındım

A demo request form and **fictional** software showcase site designed for animal shelter managers. Language: Turkish; task ID: ALEX-24H-v1.0. Features regarding capacity, intake, and check-in/check-out are conceptual product ideas, not part of an actual management application. Membership, animal registration, payments, notifications, and admin panels are out of scope.

## Local setup

Uses Node.js 22 and npm. The lock file is under version control.

```sh
npm ci
cp .env.example .env.local
# Fill in the server variables below in the local file.
npm run dev
```

Open http://localhost:3000. Restart the dev server after changing environment variables. `.env.local` and keys are not committed to Git. Do not share values in chat or logs.

Required variables: `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`. `NEXT_PUBLIC_` variables are not used. The private key corresponds to the `private_key` value in the downloaded service account JSON; it can be stored within double quotes, preserving `\n` escape sequences. Firebase Web SDK configuration is not required.

## Firebase setup (in your account)

1. Firebase Console → Add project: Create a project separate from TaleVD. Use the Spark plan; do not link a billing account. Analytics is not required.
2. Build → Firestore Database → Create database: Standard, `(default)`, production mode. Select a region based on your needs; the database region cannot be changed later.
3. Paste the contents of `firestore.rules` into the Rules tab and click Publish. Browser-based read/write access is disabled. The Admin SDK bypasses these rules; server-side validation and service account IAM permissions represent separate security boundaries.
4. Project settings → Service accounts → Firebase Admin SDK → Generate new private key. Store the downloaded JSON file outside the repository. Transfer the three relevant values from the file into `.env.local`. If the key is compromised, revoke and regenerate it.
5. Submit a dummy demo request. Verify the returned record ID and the `name`, `email`, `service`, `description`, and `createdAt` fields within the `demoRequests` collection on the Firestore Data tab. Confirm that the record persists after restarting the server.

## Architecture and data flow

`src/app/page.tsx`: static content and a mock dashboard (dog: 100=64+8+28; cat: 60=42+6+12). `src/components/demo-form.tsx`: client-side validation, pending/error/success states. `src/lib/demo-schema.ts`: Zod schema used on both client and server. `POST /api/demo-requests`: checks origin, content type, 16 KiB body limit, and performs server-side validation. `src/lib/firebase-admin.ts`: server-only logic using `await add()` to the `demoRequests` collection and server-side timestamps. Returns HTTP 201, `ok: true`, and the document ID only after the write completes. If configuration is missing, a 503 error occurs; no fake successful record is created.

Zod trims fields; name is 2–80 characters, email is max 254 characters with a valid format, and description is 10–2000 characters. Service options are limited to `capacity`, `check-in-out`, and `all`. Number/null types and unexpected fields are rejected. React does not interpret user text as HTML. The API does not include a data read/listing endpoint.

## Checks

```sh
npm run test
npm run lint
npm run typecheck
npm run build
npm start
npm audit
npm audit --omit=dev
```

Tests use a controlled storage function; they do not verify actual Firestore persistence. Invalid fields, bypassing browser validation, delayed writes, write errors, malformed JSON, origin issues, and large request bodies are tested. Browser and live environment check logs are kept in `AI_LOG.md`. Local result: 7/7 tests, linting, type checking, and production build passed. Tested for 320–1440px overflow, keyboard form navigation, controlled pending/503 states, and actual missing-configuration 503 flows. Verified the flow from actual form → API → cloud Firestore record, as well as persistence after server restart. Live hosting checks passed on 6 October 2026; see the Live verification section below.

Manual end-to-end checks: 360px/desktop views, Tab/Shift+Tab/Enter navigation, visible focus, field errors, "submitting" state, double-click handling, data preservation, and matching against actual Firestore documents. Success should not be indicated when Firestore is disabled. Test data consists solely of fictional entries like `Deniz Örnek / deniz@example.com`.

## Hosting recommendation and deployment steps

Recommendation: Vercel Hobby + Firebase Spark. The Firebase project has been created by the user, and the local server is connected. The user deployed the application to https://barindim.vercel.app, and the live form was verified. Official resource check (as of October 6, 2026): [Vercel Hobby](https://vercel.com/docs/plans/hobby) is intended for personal/non-commercial use; it includes 1 million function invocations and 4 CPU hours per month, with access potentially halting if quotas are exceeded. [Next.js support](https://vercel.com/docs/frameworks/full-stack/nextjs) includes server functions and Route Handlers. A hypothetical use case limited to the scope of the evaluation appears suitable for this plan; however, this is an inference, and plan terms should be re-verified prior to deployment.

[Firestore quota](https://firebase.google.com/docs/firestore/pricing): one free database per project; 1 GiB storage, 50,000 reads/20,000 writes/20,000 deletes per day, and 10 GiB egress per month. The [Spark](https://firebase.google.com/docs/projects/billing/firebase-pricing-plans) plan requires no payment information; do not enable Blaze or paid features. Exceeding Spark limits may impact availability.

Deployment setup reference (completed by the user): Create a GitHub personal repository (can be private) and grant access to the evaluator. Vercel → Add New → Project → import repo → Next.js, root `.` → add the three server environment variables to Production → Deploy. Use the free `vercel.app` address. Verify in an incognito window that production access protection does not block the evaluator. Before official submission, verify the match between the live form submission and the Firestore record. Static export/GitHub Pages cannot be used as an API is required.

## Security status and known issues

Regarding `braces@3.0.3` and [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm): affected versions are <=3.0.3, and there is no patched version available. Dependency chain: eslint-config-next@16.3.8 → @next/eslint-plugin-next → fast-glob@3.3.1 → micromatch@4.0.8 → braces@3.0.3. Specially crafted nested brace patterns can cause stack exhaustion or DoS. The API does not convert user input fields into glob patterns; however, the exposure of lint/build processes to untrusted patterns or repository inputs requires separate evaluation. The fact that it is a dev dependency does not eliminate the risk. Downgrading to `eslint-config-next@14.2.35` (as suggested by npm) was not implemented because it would break compatibility with the Next.js version; no overrides are in place. Final audit check: full audit shows 5 high/2 moderate vulnerabilities; `--omit=dev` shows 0 high/2 moderate. These findings were rechecked during finalization on 6 October 2026 and remain unresolved; review upstream fixes before any later release.

The installation of Firebase Admin@14.5.0 also triggers 2 moderate audit warnings via the chain `@google-cloud/storage@8.2.0 → gaxios@6.7.1 → uuid@9.0.1`. [GHSA-w5hq-g745-h8pq](https://github.com/advisories/GHSA-w5hq-g745-h8pq) lists 11.1.1/12.0.1/13.0.1 as the fixed versions; this transitive dependency uses ^9. `npm audit fix --dry-run` did not indicate a compatible version change. gaxios uses uuid v4 in the source; the advisory concerns output buffer limits for v3/v5/v6. The application does not use Cloud Storage or UUID output buffer APIs; this is not direct evidence of API exploitation, though the audit warning persists. No incompatible override/downgrade was applied; monitor upstream fixes before any later release.

- Origin checking mitigates browser-based cross-site submissions; however, the origin can be bypassed or spoofed, and it does not serve as bot or DDoS protection.
- A 16 KiB body limit constrains resource consumption; there is no comprehensive rate limiting. Every valid API call consumes quota. The provider's security/usage dashboard should be monitored for the live environment.
- The "pending" lock prevents double-clicking on the same form; however, if the network drops and the registration response is lost, resubmission could result in duplicate records. Idempotency has not been implemented.
- The client may time out after 25 seconds; this does not roll back the server-side write. In such cases, a "confirmation not received" message is displayed.
- There is no email delivery, ownership verification, authentication, CAPTCHA, or administrative panel.
- Actual Firestore documents and fields were verified via the local production API. The live site and real cloud Firestore write were verified on 6 October 2026. The evaluator can access the public GitHub repository; identify the finalized source commit using the command in Delivery status. Existing dependency security warnings remain unresolved.

## Resources and contributions

Initialization: The user set up the Next.js/React/TypeScript/ESLint boilerplate using `create-next-app`. The original README and starter files were backed up to `/private/tmp/barindim-starter-backup` before modification during this session (this temporary backup is not part of the deliverable). No pre-made landing page templates, external images, paid tools, or third-party fonts were used; system fonts and simple CSS styling were employed. Unused starter SVGs or `page.module.css` files may remain in the repository.

Product name, scope, target audience, and technology choices were determined by the user. During this session, AI-generated page copy, CSS/React code, schema, API logic, tests, and documentation were prepared; the user selected the scope, translated this README into English, and performed Firebase/hosting account configuration separately. Package-specific licenses apply. Official references include the Firebase [Admin setup](https://firebase.google.com/docs/admin/setup) and [rules](https://firebase.google.com/docs/firestore/security/rules-conditions) documentation.

## Delivery status

Local production preview: http://localhost:3001. Firebase project ID: barindim-f66f4. Verified mock record: GB9I2niB3rwtXsAAvSpD. Live URL: https://barindim.vercel.app (verified on 6 October 2026). Live fictional record: `u5hGAG2GGcPaFaBiL2vX`; independently read from Firestore with matching fields and server timestamp. Source code repository: https://github.com/UtkuKesanli/barindim (public). The local application has been merged with the manual GitHub upload while preserving history; push and final remote verification details are logged in AI_LOG.md. The finalized source commit is the HEAD pushed by this finalization. Run `git rev-parse HEAD` after pulling main, or use the full SHA in the final push confirmation, and copy that exact ID into the submission form. The initial setup commit is not the delivery commit. Official timing and portal submission are handled solely by the user.

## Live verification — 6 October 2026

The user deployed the GitHub application to https://barindim.vercel.app and supplied that URL. Chromium accessed the page without requiring a Vercel login. Two direct API requests bypassing browser validation (invalid fields and an invalid service value) returned HTTP 400. A fictional form submission returned HTTP 201; success was displayed only after that response. Firestore document `u5hGAG2GGcPaFaBiL2vX` was independently read with Firebase Admin and all submitted fields plus the server timestamp verified (2026-10-06 03:14:35 Europe/Istanbul). An anonymous Firestore REST read of that document was denied with HTTP 403.

Desktop/mobile screenshots were reviewed; no horizontal overflow at 320, 360, 390, 768 or 1440px. Keyboard skip navigation and blank-field errors passed. A browser-intercepted delayed 503 response verified pending state, duplicate-submit prevention and field preservation; this was a simulated network response, not a live database outage. No browser JavaScript errors were observed. Full keyboard form submission and real missing-configuration 503 behavior were previously tested locally.

Existing English README edits were retained and included in the final documentation commit. Before finalization, GitHub reported a successful Vercel deployment for commit `cbd90b5eefa95baa299a713badb75e8446711e2e`; live form behavior was independently verified as described above. Any later documentation-only deployment status is checked separately after push. The official timer and submission portal were not operated.


## Final review — 6 October 2026

Lint, all 7 unit tests, TypeScript and production build passed again. Both npm audits were rerun: full dependency tree 5 high / 2 moderate; production dependencies 0 high / 2 moderate. Required application source and tests are tracked. Credentials, .env.local, node_modules, .next and generated TypeScript files are excluded. A pattern scan of 28 tracked files and 40 reachable historical blobs, plus comparison with the known Firebase private key, found no matching credentials; this is a scoped check, not proof that every possible secret format is absent.

No application code was changed during documentation finalization. Preparatory work, including implementation before the official timer, is recorded in AI_LOG.md. Earlier work duration and total active effort were not measured reliably; they are not claimed to fit the 3–4-hour target. The official start and submission remain user actions. Full screen-reader testing and an actual hosted database outage were not performed.
