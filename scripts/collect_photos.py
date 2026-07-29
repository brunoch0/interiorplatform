#!/usr/bin/env python3
"""Fetch one Google Places photo per company -> Supabase storage projects/companies/<id>.jpg
Incremental (resume-safe): data/company_photos.csv appended per success.
Cost: ~649 x (details Pro + photo media) ~= USD 15 one-off."""
import csv, json, os, subprocess
from concurrent.futures import ThreadPoolExecutor, as_completed

SUPABASE = "https://hpirwzpdqaxzsvlqvwod.supabase.co"
ANON = "sb_publishable_c1vJb-6zmLs-y7mJ-UnWTQ_7Klye6EX"
KEY = open("data/dubaipulse/places.key").read().strip()
OUT = "data/company_photos.csv"

def curl(args, timeout=30):
    r = subprocess.run(["curl", "-sL", "--max-time", str(timeout)] + args,
                       capture_output=True, timeout=timeout + 5)
    return r.stdout

def fetch_companies():
    raw = curl([f"{SUPABASE}/rest/v1/companies?select=id,place_id&place_id=not.is.null&limit=1000&apikey={ANON}"])
    return json.loads(raw)

def process(co):
    cid, pid = co["id"], co["place_id"]
    det = curl(["-H", f"X-Goog-Api-Key: {KEY}", "-H", "X-Goog-FieldMask: photos",
                f"https://places.googleapis.com/v1/places/{pid}"])
    try:
        photos = json.loads(det).get("photos") or []
    except Exception:
        return None
    if not photos:
        return None
    pname = photos[0]["name"]
    attr = (photos[0].get("authorAttributions") or [{}])[0].get("displayName", "")
    img = curl(["-H", f"X-Goog-Api-Key: {KEY}",
                f"https://places.googleapis.com/v1/{pname}/media?maxWidthPx=640&skipHttpRedirect=false"], 40)
    if not img or len(img) < 3000:
        return None
    path = f"companies/{cid}.jpg"
    up = subprocess.run(
        ["curl", "-s", "--max-time", "30", "-X", "POST",
         f"{SUPABASE}/storage/v1/object/projects/{path}",
         "-H", f"Authorization: Bearer {ANON}", "-H", f"apikey: {ANON}",
         "-H", "Content-Type: image/jpeg",
         "--data-binary", "@-"],
        input=img, capture_output=True)
    if b'"Key"' not in up.stdout and b'"Id"' not in up.stdout:
        return None
    return (cid, path, attr)

def main():
    companies = fetch_companies()
    done = set()
    exists = os.path.exists(OUT)
    if exists:
        done = {r["id"] for r in csv.DictReader(open(OUT))}
    todo = [c for c in companies if c["id"] not in done]
    print(f"{len(companies)} companies with place_id · {len(done)} done · {len(todo)} to fetch", flush=True)

    fh = open(OUT, "a", newline="")
    w = csv.writer(fh)
    if not exists:
        w.writerow(["id", "path", "attribution"])
        fh.flush()
    n, ok = 0, len(done)
    with ThreadPoolExecutor(max_workers=8) as ex:
        futs = [ex.submit(process, c) for c in todo]
        for f in as_completed(futs):
            n += 1
            r = f.result()
            if r:
                w.writerow(r); fh.flush(); ok += 1
            if n % 50 == 0:
                print(f"  {n}/{len(todo)} processed, {ok} photos stored", flush=True)
    fh.close()
    print(f"DONE: {ok} photos -> storage projects/companies/*", flush=True)

if __name__ == "__main__":
    main()
