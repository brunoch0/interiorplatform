#!/usr/bin/env python3
"""
Collect Dubai interior/fit-out companies via Google Places API (New) Text Search.

Key file: data/dubaipulse/places.key (gitignored)
Output:   data/places/dubai_interior_companies.json (gitignored raw)
          web/src/lib/seed-places.json (committed, curated fields only)

Usage: python3 scripts/collect_places.py
"""
import json
import subprocess
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
KEY = (ROOT / "data/dubaipulse/places.key").read_text().strip()
OUT_RAW = ROOT / "data/places/dubai_interior_companies.json"
OUT_SEED = ROOT / "web/src/lib/seed-places.json"

AREAS = [
    "Business Bay", "Downtown Dubai", "Dubai Marina", "JLT", "JVC",
    "Al Quoz", "Al Barsha", "Deira", "Palm Jumeirah", "DIFC", "Jumeirah",
]
QUERIES = [
    ("interior fit out company", ["Commercial", "Full Renovation"]),
    ("interior design company", ["Residential"]),
    ("renovation contractor", ["Full Renovation"]),
    ("joinery and carpentry company", ["Carpentry", "Custom Furniture"]),
    ("villa renovation company", ["Villa Renovation"]),
]

FIELD_MASK = ",".join([
    "places.id", "places.displayName", "places.formattedAddress",
    "places.websiteUri", "places.nationalPhoneNumber", "places.types",
    "places.businessStatus", "places.primaryTypeDisplayName", "nextPageToken",
])

KNOWN_AREAS = AREAS + ["Al Qusais", "Arjan", "The Greens", "Sheikh Zayed Road",
                       "Jebel Ali", "Dubai Investment Park", "Arabian Ranches",
                       "Dubai Design District", "Silicon Oasis", "Deira", "Bur Dubai"]


def search(text_query: str, page_token: str | None = None):
    body = {"textQuery": text_query, "pageSize": 20}
    if page_token:
        body["pageToken"] = page_token
    out = subprocess.run(
        [
            "curl", "-s", "--max-time", "30",
            "-X", "POST", "https://places.googleapis.com/v1/places:searchText",
            "-H", "Content-Type: application/json",
            "-H", f"X-Goog-Api-Key: {KEY}",
            "-H", f"X-Goog-FieldMask: {FIELD_MASK}",
            "-d", json.dumps(body),
        ],
        capture_output=True, text=True, timeout=40,
    )
    d = json.loads(out.stdout)
    if "error" in d:
        raise RuntimeError(d["error"].get("message", "API error")[:150])
    return d


def detect_area(address: str) -> str:
    for a in KNOWN_AREAS:
        if a.lower() in address.lower():
            return a
    return "Dubai"


def main():
    companies: dict[str, dict] = {}
    requests_made = 0
    for area in AREAS:
        for q, cats in QUERIES:
            query = f"{q} {area} Dubai"
            token = None
            for page in range(2):  # max 2 pages per query
                try:
                    d = search(query, token)
                except Exception as e:
                    print(f"  ! {query} p{page}: {e}")
                    break
                requests_made += 1
                for p in d.get("places", []):
                    pid = p["id"]
                    if p.get("businessStatus") not in (None, "OPERATIONAL"):
                        continue
                    entry = companies.setdefault(pid, {
                        "placeId": pid,
                        "name": p["displayName"]["text"],
                        "address": p.get("formattedAddress", ""),
                        "area": detect_area(p.get("formattedAddress", "")),
                        "website": p.get("websiteUri"),
                        "phone": p.get("nationalPhoneNumber"),
                        "primaryType": p.get("primaryTypeDisplayName", {}).get("text", ""),
                        "categories": [],
                    })
                    for c in cats:
                        if c not in entry["categories"]:
                            entry["categories"].append(c)
                token = d.get("nextPageToken")
                if not token:
                    break
                time.sleep(2)
            time.sleep(0.2)
        print(f"[{area}] cumulative unique: {len(companies)} (requests: {requests_made})")

    OUT_RAW.parent.mkdir(parents=True, exist_ok=True)
    OUT_RAW.write_text(json.dumps(list(companies.values()), indent=2, ensure_ascii=False))

    # Curated seed for the web app (no phone — keep contact for claimed profiles only)
    seed = sorted(
        (
            {
                "name": c["name"],
                "area": c["area"],
                "categories": c["categories"][:3],
                "website": c["website"],
            }
            for c in companies.values()
        ),
        key=lambda x: x["name"].lower(),
    )
    OUT_SEED.write_text(json.dumps(seed, indent=2, ensure_ascii=False))
    print(f"\n✅ {len(companies)} unique companies · {requests_made} API requests")
    print(f"raw → {OUT_RAW}\nseed → {OUT_SEED}")


if __name__ == "__main__":
    main()
