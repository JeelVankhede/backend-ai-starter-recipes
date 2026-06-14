/**
 * CLI startup banner constants.
 *
 * `BANNER_TITLE` is the canonical "Bare — Backend Ai starter REcipes" string used by
 * `src/cli.ts` on launch. WP-H consumes it to build the full boxed banner with version
 * + docs URL; WP-A only adds the constant + emits it from the existing startup line.
 *
 * Casing rule (binding per workspace memory `feedback-fare-bare-acronym-casing`):
 * - `Backend Ai starter REcipes` — lowercase `i`, lowercase `starter`, capital `RE`.
 * - Acronym letters form BARE: B-A-RE.
 *
 * @module banner
 */
export const BANNER_TITLE = 'Bare — Backend Ai starter REcipes';
