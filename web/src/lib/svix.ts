import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Verify a Svix-style webhook signature (Resend uses Svix).
 *
 * The signed payload is `${id}.${timestamp}.${rawBody}` — the raw body, not a
 * re-serialised object, so callers must pass the exact bytes received.
 * The header carries space-separated `v1,<base64sig>` pairs; a secret rotation
 * means several may be present and any one matching is enough.
 */
export function verifySvix(
  secret: string,
  id: string,
  timestamp: string,
  rawBody: string,
  signatureHeader: string,
): boolean {
  const key = Buffer.from(secret.replace(/^whsec_/, ""), "base64");
  const expected = createHmac("sha256", key).update(`${id}.${timestamp}.${rawBody}`).digest("base64");
  const want = Buffer.from(expected);

  return signatureHeader.split(" ").some((part) => {
    const sig = part.split(",")[1];
    if (!sig) return false;
    const got = Buffer.from(sig);
    // timingSafeEqual throws on length mismatch, so screen for it first.
    return got.length === want.length && timingSafeEqual(got, want);
  });
}

/** Reject replays of a captured request. Svix recommends a five-minute window. */
export function freshTimestamp(timestamp: string, toleranceSec = 300): boolean {
  const age = Math.abs(Date.now() / 1000 - Number(timestamp));
  return Number.isFinite(age) && age <= toleranceSec;
}
