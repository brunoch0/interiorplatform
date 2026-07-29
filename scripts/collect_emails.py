#!/usr/bin/env python3
"""Collect public contact emails from company websites (homepage + contact page).
curl subprocess per site (macOS python SSL workaround), 16 workers.
Output: data/company_emails.csv (id,email,source_url)"""
import csv, json, re, subprocess, sys
from concurrent.futures import ThreadPoolExecutor, as_completed

SUPABASE = "https://hpirwzpdqaxzsvlqvwod.supabase.co"
ANON = "sb_publishable_c1vJb-6zmLs-y7mJ-UnWTQ_7Klye6EX"

EMAIL_RE = re.compile(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}")
JUNK = ("example.", "sentry", "wixpress", "godaddy", "@2x", ".png", ".jpg", ".jpeg", ".webp", ".gif",
        "yourdomain", "domain.com", "email.com", "sitename", "@site.", "no-reply", "noreply",
        "schema.org", "w3.org", "placeholder")

def curl(url, timeout=12):
    try:
        r = subprocess.run(
            ["curl", "-sL", "--max-time", str(timeout), "--compressed",
             "-A", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
             url],
            capture_output=True, text=True, errors="ignore", timeout=timeout + 5)
        return r.stdout or ""
    except Exception:
        return ""

def extract(html):
    out = []
    for e in EMAIL_RE.findall(html):
        el = e.lower().strip(".")
        if any(j in el for j in JUNK):
            continue
        if len(el) > 60:
            continue
        if el not in out:
            out.append(el)
    return out

def probe(company):
    cid, site = company["id"], company["website"]
    if not site.startswith("http"):
        site = "https://" + site
    base = site.rstrip("/")
    for url in (base, base + "/contact", base + "/contact-us", base + "/contact.html"):
        emails = extract(curl(url))
        if emails:
            return (cid, emails[0], url)
    return None

def main():
    raw = curl(f"{SUPABASE}/rest/v1/companies?select=id,website&website=not.is.null&limit=1000&apikey={ANON}", 30)
    companies = json.loads(raw)
    companies = [c for c in companies if c.get("website")]
    print(f"probing {len(companies)} websites...", flush=True)

    results, done = [], 0
    with ThreadPoolExecutor(max_workers=16) as ex:
        futs = {ex.submit(probe, c): c for c in companies}
        for f in as_completed(futs):
            done += 1
            r = f.result()
            if r:
                results.append(r)
            if done % 50 == 0:
                print(f"  {done}/{len(companies)} probed, {len(results)} emails", flush=True)

    with open("data/company_emails.csv", "w", newline="") as fh:
        w = csv.writer(fh)
        w.writerow(["id", "email", "source_url"])
        w.writerows(results)
    print(f"DONE: {len(results)} emails from {len(companies)} sites -> data/company_emails.csv", flush=True)

if __name__ == "__main__":
    main()
