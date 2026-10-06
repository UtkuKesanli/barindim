# AI Log — Barındım

## Tools used

Codex desktop; Node.js/npm; Git/GitHub CLI; TypeScript, ESLint, Node test runner and tsx; Playwright/Chromium; shell/Python and pypdf; official documentation and security advisory research.

## User and AI contributions

**User:** chose the product, audience, Turkish language and scope; created the Next.js scaffold; configured Firebase and Vercel; reviewed and directed the design and mobile revisions; translated the README into English; confirmed a live form record in Firestore. The official timer was started by the user.

**AI:** implemented the promotional page, fictional capacity panel, demo form, validation, API, Firestore integration and tests; checked dependencies and layouts; prepared documentation and Git commits.

Earlier context was supplied through the user's summary rather than a full transcript. Preparatory development is acknowledged. Portal handover remains the user's responsibility.

## Key instructions and decisions

- Kept the scope to a fictional promotional site and persistent software demo requests, without a full shelter-management application.
- Used shared Zod validation independently in browser and server. Success waits for the database write; errors preserve entered data. Firebase Admin credentials stay server-side.
- Kept plain CSS and system fonts. The user approved warm colors, the original shelter drawing, decorative SVG animals and consistent branding. Five-species totals derive from one data source; fish capacity means number of fish. Mobile totals use a 2×2 grid, with independent table scrolling and stacked name/email fields.
- Origin and body-size checks are limited safeguards. Rejected forced dependency fixes and unverified overrides. Braces has no listed patch; patched UUID exceeds the upstream range. The inspected UUID caller uses `v4()` without arguments. Findings remain open in the README.

## Actual verifications

- Seven automated tests, lint, TypeScript and production build passed. Tests cover invalid fields/service values, validation bypass, malformed JSON, body limits, origin checks and delayed/failed writes.
- A fictional live form submission returned success; its fields and server timestamp were independently read from Firestore. Anonymous document access was denied. The live page opened without login.
- Browser checks covered desktop/mobile layouts, keyboard skip link and focus, field errors, pending/duplicate prevention and preserved input after failure. Mobile checks at 320, 360, 390 and 430 CSS pixels confirmed no page/panel/totals overflow, all four total boxes visible, independently scrollable table and full-width stacked fields. Desktop retained its layout.
- Error/success visual previews used mocked responses; failure checks also used local missing Firebase configuration and controlled unit-test storage failures. No actual hosted database outage or full screen-reader test was performed.
- A scoped scan checked tracked source and browser build output for credentials. Environment files, private key exports and generated dependency/build directories are excluded from Git. This is not a comprehensive security audit.
- Audits report 5 high and 2 moderate findings overall, and 2 moderate in production dependencies; these remain unresolved. GitHub retains the original uploaded history and the application source.
