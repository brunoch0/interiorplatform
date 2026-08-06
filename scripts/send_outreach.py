#!/usr/bin/env python3
"""Personalized contractor outreach via Resend.
Usage:
  python3 scripts/send_outreach.py --dry-run          # print 3 samples, send nothing
  python3 scripts/send_outreach.py --batch 30         # send next 30 (skips already-sent)
Reads RESEND_API_KEY from web/.env.local. Logs to data/outreach_email_log.csv."""
import argparse, csv, json, math, os, re, subprocess, sys, time

SUPABASE = "https://hpirwzpdqaxzsvlqvwod.supabase.co"
ANON = "sb_publishable_c1vJb-6zmLs-y7mJ-UnWTQ_7Klye6EX"
FROM = "Bruno from OnePass Interior <bruno@onepassinterior.com>"
REPLY_TO = "business@growtodayholdings.com"
LOG = "data/outreach_email_log.csv"
UTM = "utm_source=resend&utm_medium=email&utm_campaign=contractor_outreach_2026q3"
FREEMAIL = ("gmail.", "hotmail.", "yahoo.", "outlook.", "icloud.")
# Scraped addresses arrive with URL-encoding artefacts ("%20info@..."), which
# bounce and cost sending reputation. Screen them out rather than burn a send.
VALID_EMAIL = re.compile(r"^[^@\s%]+@[^@\s%]+\.[a-z]{2,}$", re.I)

def curl_json(url):
    r = subprocess.run(["curl", "-sL", "--max-time", "30", url + ("&" if "?" in url else "?") + "apikey=" + ANON],
                       capture_output=True, text=True)
    return json.loads(r.stdout)


def open_brief_count():
    """Never claim a number of live briefs we can't back — fall back to vague."""
    try:
        r = subprocess.run(
            ["curl", "-s", "--max-time", "30", "-X", "POST",
             f"{SUPABASE}/rest/v1/rpc/public_open_requests",
             "-H", f"apikey: {ANON}", "-H", "Content-Type: application/json", "-d", "{}"],
            capture_output=True, text=True)
        n = len(json.loads(r.stdout))
        return f"{n} of them" if n else None
    except Exception:
        return None

def load_env_key():
    for line in open("web/.env.local"):
        if line.startswith("RESEND_API_KEY="):
            return line.split("=", 1)[1].strip()
    return None

def sent_emails():
    if not os.path.exists(LOG):
        return set()
    return {row["email"] for row in csv.DictReader(open(LOG))}

TOP_RATED_MIN = 4.5
RANKINGS_SHOWN = 50  # the public page lists this many — never imply a company is on it when it isn't


def dubai_rank(co, all_cos):
    """Position on the public /rankings table, or None if they don't qualify.

    Must mirror the page exactly (rated 4.5+, ordered by review count) — the
    whole point of the email is that they can go and verify it.
    """
    if not co.get("google_rating") or float(co["google_rating"]) < TOP_RATED_MIN:
        return None
    # Tie-break must match byReviews() in web/src/lib/area-stats.ts exactly:
    # reviews desc, rating desc, name asc. Reviews tie often at low counts.
    ranked = sorted(
        (c for c in all_cos if c.get("google_rating") and float(c["google_rating"]) >= TOP_RATED_MIN),
        key=lambda c: (-int(c.get("google_rating_count") or 0), -float(c.get("google_rating") or 0), c["name"]),
    )
    for i, c in enumerate(ranked, 1):
        if c["id"] == co["id"]:
            return i
    return None


def area_rank(co, all_cos):
    peers = [c for c in all_cos if c.get("area") == co.get("area") and c.get("google_rating")]
    if not co.get("google_rating") or len(peers) < 5:
        return None
    better = sum(1 for p in peers if float(p["google_rating"]) > float(co["google_rating"]))
    pct = (better / len(peers)) * 100
    if pct <= 10: return "top 10%"
    if pct <= 25: return "top 25%"
    return None

def compose(co, rank, dubai_pos, open_briefs):
    name = co["name"]
    area = co.get("area") or "Dubai"
    rating = co.get("google_rating")
    n = co.get("google_rating_count")
    cats = (co.get("categories") or [])[:2]
    rankings_url = f"https://onepassinterior.com/rankings?{UTM}&utm_content=rankings"

    # The strongest opener we have is a fact they can check in one click.
    if dubai_pos and dubai_pos <= RANKINGS_SHOWN:
        subject = f"{name} is #{dubai_pos} in Dubai by review volume — see the table"
        proof = [
            f"We published the ranking today: {rankings_url}",
            f"You are #{dubai_pos} of 649 companies, with {n} Google reviews at {float(rating):.1f}.",
        ]
    elif rating and n:
        subject = f"{name} — your {float(rating):.1f} rating is live on OnePass Interior"
        proof = [
            f"Your profile: https://onepassinterior.com/companies/{co['id']}?{UTM}&utm_content=profile_link",
            f"Showing {float(rating):.1f} from {n} Google reviews" + (f", {rank} in {area}." if rank else "."),
        ]
    else:
        subject = f"{name} is listed on OnePass Interior — two things to check"
        proof = [
            f"Your profile: https://onepassinterior.com/companies/{co['id']}?{UTM}&utm_content=profile_link",
            "Listed from Dubai's public licence register. No rating is showing yet.",
        ]

    lines = [
        f"Hi {name} team,",
        "",
        "I'm Bruno, founder of OnePass Interior (onepassinterior.com). We track all 649 licensed interior and fit-out companies in Dubai and this week we published what 22,563 Google reviews across them actually show.",
        "",
        *proof,
        "",
        "Two things worth knowing about how that table works:",
        "- It ranks by review volume, not star score. 85% of rated companies in Dubai sit at 4.5 or above, so the score separates nobody.",
        "- Placement cannot be bought, and claiming a profile gives no ranking advantage. The method is published on the page.",
    ]
    if cats:
        lines.append(f"- You are listed under: {', '.join(cats)}")
    lines += [
        "",
        f"Separately, homeowners post renovation briefs on the platform. {open_briefs or 'Some'} are open for quotes right now: https://onepassinterior.com/requests?{UTM}&utm_content=open_board",
        "",
        "Two free things while we're in early access:",
        "1) Quote on any open brief — it goes straight to the homeowner",
        f"2) Claim your profile (5 minutes, trade licence needed) so enquiries reach your dashboard instead of a form we forward: https://onepassinterior.com/supplier/license?{UTM}&utm_content=claim_cta",
        "",
        "If the data on your listing is wrong, reply and I'll fix it the same day.",
        "",
        "Bruno",
        "OnePass Interior · onepassinterior.com",
        "Growtoday Holdings FZE, Dubai, UAE",
        "",
        'P.S. Not interested in emails from us? Just reply "unsubscribe" and I\'ll remove you — no hard feelings.',
    ]
    text = "\n".join(lines)
    import html as _h
    html_body = "<div style=\'font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;color:#222\'>" + \
        "<br>".join(_h.escape(l) if l else "&nbsp;" for l in lines) + "</div>"
    return subject, text, html_body

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--batch", type=int, default=30)
    args = ap.parse_args()

    emails, skipped = {}, []
    for row in csv.DictReader(open("data/company_emails.csv")):
        e = row["email"].strip().lower()
        if VALID_EMAIL.match(e):
            emails[row["id"]] = e
        else:
            skipped.append(e)
    if skipped:
        print(f"형식 이상으로 제외 {len(skipped)}건: {skipped[:5]}")

    # Rank against the whole directory, not just the companies we can email —
    # the number in the subject line has to match the public page they'll open.
    all_cos = curl_json(f"{SUPABASE}/rest/v1/companies?select=id,name,area,categories,google_rating,google_rating_count&limit=1000")
    cos = [c for c in all_cos if c["id"] in emails]
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

    open_briefs = open_brief_count()

    if args.dry_run:
        for c in queue[:3]:
            subj, body, _ = compose(c, area_rank(c, all_cos), dubai_rank(c, all_cos), open_briefs)
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
            subj, body, html_body = compose(c, area_rank(c, all_cos), dubai_rank(c, all_cos), open_briefs)
            payload = json.dumps({
                "from": FROM, "to": [c["email"]], "reply_to": REPLY_TO,
                "subject": subj, "text": body, "html": html_body,
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
