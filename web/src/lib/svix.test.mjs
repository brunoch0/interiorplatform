// node src/lib/svix.test.mjs — no framework, no deps.
// Guards the one security decision in the webhook: does a forged signature get in?
import assert from "node:assert";
import { createHmac } from "node:crypto";
import { verifySvix, freshTimestamp } from "./svix.ts";

const SECRET = "whsec_" + Buffer.from("super-secret-key").toString("base64");
const id = "msg_123";
const ts = String(Math.floor(Date.now() / 1000));
const body = JSON.stringify({ type: "email.delivered", data: { email_id: "e1" } });

const sign = (secret, i, t, b) =>
  createHmac("sha256", Buffer.from(secret.replace(/^whsec_/, ""), "base64"))
    .update(`${i}.${t}.${b}`)
    .digest("base64");

const good = `v1,${sign(SECRET, id, ts, body)}`;

assert.equal(verifySvix(SECRET, id, ts, body, good), true, "valid signature must pass");
assert.equal(verifySvix(SECRET, id, ts, body + " ", good), false, "tampered body must fail");
assert.equal(verifySvix(SECRET, "msg_other", ts, body, good), false, "swapped id must fail");
assert.equal(verifySvix(SECRET, id, "1", body, good), false, "swapped timestamp must fail");
assert.equal(verifySvix("whsec_" + Buffer.from("wrong").toString("base64"), id, ts, body, good), false, "wrong secret must fail");
assert.equal(verifySvix(SECRET, id, ts, body, "v1,short"), false, "length mismatch must not throw");
assert.equal(verifySvix(SECRET, id, ts, body, `v1,aaaa ${good}`), true, "rotation: any matching sig passes");

assert.equal(freshTimestamp(ts), true, "current timestamp is fresh");
assert.equal(freshTimestamp(String(Number(ts) - 600)), false, "10 minutes old is a replay");
assert.equal(freshTimestamp("not-a-number"), false, "garbage timestamp is not fresh");

console.log("svix: 10 assertions passed");
