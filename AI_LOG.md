# AI Log — Barındım

## Tools used

Codex desktop; Node.js/npm; Git and GitHub CLI; TypeScript, ESLint, Node test runner and tsx; Playwright/Chromium for browser checks; shell/Python for file inspection and editing; pypdf for assignment review; web research using official documentation and security advisories.

## User and AI contributions

**User:** selected the product, target audience, Turkish language and visual direction; narrowed the scope to a promotional site and demo request form; created the Next.js scaffold; translated the README into English; configured Firebase and Vercel and deployed the site.

**AI:** implemented the page, fictional dashboard, form, shared validation, server API, Firestore integration and tests; reviewed dependency warnings; ran checks; helped preserve Git history and prepared documentation.

Earlier context came from the user's summary rather than a full prior transcript. Development included preparatory work. The AI did not start the official timer or submit through the assessment portal.

## Key instructions and decisions

- Accepted the restricted scope: showcase shelter software and save demo requests; do not build membership, payments or a shelter-management system.
- Used a shared Zod schema with separate client and server validation. Success waits for the Firestore write; failures preserve form data.
- Kept Firebase Admin credentials server-side and browser database access closed. Origin/body-size checks are limited safeguards, not comprehensive bot protection.
- Used plain CSS, system fonts and a decorative CSS illustration. The five-species dashboard is explicitly fictional. Row totals and summary totals are derived from the same data; fish capacity is labelled as a count of fish. Form options and backend behavior were preserved.
- Corrected same-origin validation and added a regression test for an internal URL differing from the incoming Host header.
- Rejected blind `npm audit fix --force`, incompatible downgrades and unverified overrides. Checked current releases, dependency ranges and actual upstream calls. No security fix fits the current ranges: braces has no listed patch and patched UUID is outside gaxios’s declared range. A UUID candidate passed a scoped multipart compatibility check, but no override was retained. Open findings and their impact remain documented in the README.

- Accepted the desktop design revision: consistent Barındım branding, retained shelter drawing, original decorative SVG animals, wider layout, status colors with visible labels, one calculated totals summary below the species rows, and equally sized form controls. Backend, field definitions, service options and validation logic were preserved. Local review precedes publication.

## Actual verifications

- Local desktop redesign: visually inspected the full desktop/mobile page and desktop form error/success states. Browser checks passed at 320–1920 pixels, including single-summary placement, calculated totals, equal input/select heights, unchanged service values, keyboard skip link and pending/duplicate prevention. Form-state previews used mocked 503/201 responses; they did not verify a new database write. Existing tests, lint, type-check and build passed.

- All seven automated tests, ESLint, TypeScript and production build passed.
- Direct API requests bypassing browser validation rejected invalid fields and service values. Tests also covered malformed JSON, oversized bodies and cross-origin requests.
- A valid live form submission returned success after saving; the resulting Firestore document and server timestamp were independently read and verified. Local server restart did not remove stored data.
- Browser checks covered mobile/desktop layouts, keyboard navigation, visible focus, field errors, pending state, duplicate-submit prevention and preserved data after failure. The five-species calculations, totals, fish label and unchanged service options were checked at 320, 360, 390, 768 and 1440 pixels. No horizontal overflow or browser JavaScript errors were observed.
- Failure behavior was checked through a delayed mock 503 response, a local server with missing Firebase configuration, and controlled storage failures in unit tests. These checks are not a test of an actual hosted database outage.
- An anonymous Firestore document read was denied. A scoped scan of tracked files, reachable history and client build output found no matching credentials; this is not a comprehensive security audit.
- The latest executed audits report 5 high/2 moderate findings overall and 2 moderate in production dependencies. The findings remain unresolved.
- GitHub contains the application source, retains the original uploaded commit, and reports a successful Vercel deployment. The live site was accessed without a login.
