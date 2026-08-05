/**
 * Plain module on purpose. A "use server" file may only export async functions —
 * a const exported from actions.ts arrives at the caller as an action stub, and
 * the page 500s on the first .map(). Same trap as values exported from
 * "use client", mirrored.
 */
export const FEEDBACK_KINDS = [
  "Something is broken",
  "Wrong information",
  "Suggestion",
  "My company's listing",
  "Something else",
] as const;

export type FeedbackKind = (typeof FEEDBACK_KINDS)[number];
