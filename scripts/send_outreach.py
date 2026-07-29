#!/usr/bin/env python3
"""Personalized contractor outreach via Resend.
Usage:
  python3 scripts/send_outreach.py --dry-run          # print 3 samples, send nothing
  python3 scripts/send_outreach.py --batch 30         # send next 30 (skips already-sent)
Reads RESEND_API_KEY from web/.env.local. Logs to data/outreach_email_log.csv."""
import argparse, csv, json, math, os, subprocess, sys, time

SUPABASE = "https://hpirwzpdqaxzsvlqvwod.supabase.co"
ANON = "sb_publishable_c1vJb-6zmLs-y7mJ-UnWTQ_7Klye6EX"
FROM = "Bruno from Dubai Interior <bruno@onepassinterior.com>"
REPLY_TO = "chohj0228@gmail.com"
LOG = "data/outreach_email_log.csv"
FREEMAIL = ("gmail.", "hotmail.", "yahoo.", "outlook.", "icloud.")

def curl_json(url):
    r = subprocess.run(["curl", "-sL", "--max-time", "30", url + ("&" if "?" in url else "?") + "apikey=" + ANON],
                       capture_output=True, text=True)
    return json.loads(r.stdout)

def load_env_key():
    for line in open("web/.env.local"):
        if line.startswith("RESEND_API_KEY="):
            return line.split("=", 1)[1].strip()
    return None

def sent_emails():
    if not os.path.exists(LOG):
        return set()
    return {row["email"] for row in csv.DictReader(open(LOG))}

def area_rank(co, all_cos):
    peers = [c for c in all_cos if c.get("area") == co.get("area") and c.get("google_rating")]
    if not co.get("google_rating") or len(peers) < 5:
        return None
    better = sum(1 for p in peers if float(p["google_rating"]) > float(co["google_rating"]))
    pct = (better / len(peers)) * 100
    if pct <= 10: return "top 10%"
    if pct <= 25: return "top 25%"
    return None

def compose(co, rank):
    name = co["name"]
    area = co.get("area") or "Dubai"
    rating = co.get("google_rating")
    n = co.get("google_rating_count")
    cats = (co.get("categories") or [])[:2]

    if rating and n:
        subject = f"{name} — your {float(rating):.1f}★ Google rating is live on Dubai Interior"
        rating_line = f"- Google rating shown: {float(rating):.1f}★ ({n} reviews)" + (f" — {rank} in {area}" if rank else "")
    else:
        subject = f"{name} is listed on Dubai Interior — 2 things to check"
        rating_line = "- Licence-based listing from Dubai's public register"

    cat_line = f"- Listed under: {', '.join(cats)}" if cats else ""
    lines = [
        f"Hi {name} team,",
        "",
        "I'm Bruno, founder of Dubai Interior (onepassinterior.com) — Dubai's renovation comparison platform. All 649 licensed fit-out companies are listed, including yours:",
        "",
        f"Your live profile: https://onepassinterior.com/companies/{co['id']}",
        rating_line,
    ]
    if cat_line:
        lines.append(cat_line)
    lines += [
        "",
        f"Homeowners now post renovation briefs through the platform — the open board currently has live briefs from Marina, JVC, Business Bay and Arabian Ranches you can quote on: https://onepassinterior.com/requests",
        "",
        "Two free things while we're in early access:",
        "1) Quote on any open brief — we pass it straight to the homeowner",
        f"2) Claim your profile (5 minutes, trade licence needed) — verified companies rank first in {area} and homeowner contacts come to your dashboard directly: https://onepassinterior.com/supplier/license",
        "",
        "No catch during early access. We're building the trust layer for Dubai renovation, and companies with your track record are exactly who should be at the top.",
        "",
        "Bruno",
        "Dubai Interior · onepassinterior.com",
        "Growtoday Holdings FZE, Dubai, UAE",
        "",
        'P.S. Not interested in emails from us? Just reply "unsubscribe" and I\'ll remove you — no hard feelings.',
    ]
    return subject, "\n".join(lines)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--batch", type=int, default=30)
    args = ap.parse_args()

    emails = {}
    for row in csv.DictReader(open("data/company_emails.csv")):
        emails[row["id"]] = row["email"].lower()

    cos = curl_json(f"{SUPABASE}/rest/v1/companies?select=id,name,area,categories,google_rating,google_rating_count&limit=1000")
    cos = [c for c in cos if c["id"] in emails]
    for c in cos:
        c["email"] = emails[c["id"]]

    # dedupe by email (some sites share a contact address), prefer higher-rated listing
    def score(c):
        r = float(c["google_rating"] or 0); n = int(c["google_rating_count"] or 0)
        return r * math.log1p(n)
    cos.sort(key=score, reverse=True)
    seen, deduped = set(), []
    for c in cos:
        if c["email"] in seen:
            continue
        seen.add(c["email"])
        deduped.append(c)

    already = sent_emails()
    queue = [c for c in deduped if c["email"] not in already]
    print(f"list: {len(deduped)} unique emails · already sent: {len(already)} · queue: {len(queue)}")

    if args.dry_run:
        for c in queue[:3]:
            rank = area_rank(c, cos)
            subj, body = compose(c, rank)
            print("\n" + "=" * 70 + f"\nTO: {c['email']}\nSUBJECT: {subj}\n\n{body}")
        return

    key = load_env_key()
    if not key:
        sys.exit("RESEND_API_KEY not found in web/.env.local")

    os.makedirs("data", exist_ok=True)
    new_log = not os.path.exists(LOG)
    sent = 0
    with open(LOG, "a", newline="") as fh:
        w = csv.writer(fh)
        if new_log:
            w.writerow(["email", "company_id", "name", "sent_at", "status"])
        for c in queue[: args.batch]:
            rank = area_rank(c, cos)
            subj, body = compose(c, rank)
            payload = json.dumps({
                "from": FROM, "to": [c["email"]], "reply_to": REPLY_TO,
                "subject": subj, "text": body,
            })
            r = subprocess.run(
                ["curl", "-s", "--max-time", "30", "-X", "POST", "https://api.resend.com/emails",
                 "-H", f"Authorization: Bearer {key}", "-H", "Content-Type: application/json",
                 "-d", payload],
                capture_output=True, text=True)
            ok = '"id"' in r.stdout
            w.writerow([c["email"], c["id"], c["name"], time.strftime("%Y-%m-%d %H:%M"), "sent" if ok else "error"])
            fh.flush()
            sent += 1 if ok else 0
            if not ok:
                print(f"ERROR {c['email']}: {r.stdout[:200]}", flush=True)
            else:
                print(f"sent {sent}/{args.batch}: {c['name'][:40]} <{c['email']}>", flush=True)
            time.sleep(1.5)
    print(f"DONE: {sent} sent")

if __name__ == "__main__":
    main()
