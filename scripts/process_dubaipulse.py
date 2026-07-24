#!/usr/bin/env python3
"""
Dubai Pulse DED license data → interior contractor seed list.

Input (place downloaded CSVs in data/dubaipulse/):
  - business_activities.csv   activity code ↔ EN/AR description
  - license_master.csv        license number, trade name, status, issue/expiry
  - license_activities.csv    license ↔ activity mapping

Download (login required, free account / UAE Pass):
  https://www.dubaipulse.gov.ae/data/ded-licenses/ded_business_activities-open
  https://www.dubaipulse.gov.ae/data/ded-licenses/ded_license_master-open
  https://www.dubaipulse.gov.ae/data/ded-licenses/ded_license_activities-open

Output:
  data/dubaipulse/interior_licenses.json  (full result with license numbers)
  data/dubaipulse/summary.txt             (activity code stats)

Usage: python3 scripts/process_dubaipulse.py [--limit N]
"""
import csv
import json
import re
import sys
from pathlib import Path

DATA_DIR = Path(__file__).resolve().parent.parent / "data" / "dubaipulse"

# Interior/fit-out related activity keywords (EN descriptions in DED activity list)
ACTIVITY_KEYWORDS = re.compile(
    r"interior|fit.?out|décor|decor(?!ation of cakes)|carpentry|joinery|"
    r"painting contract|tiling|false ceiling|partition|gypsum|"
    r"wallpaper|parquet|curtain|upholster|landscap",
    re.IGNORECASE,
)

csv.field_size_limit(10_000_000)


def read_csv(name: str):
    path = DATA_DIR / name
    if not path.exists():
        sys.exit(f"Missing {path} — download it from Dubai Pulse first (see docstring).")
    # Dubai Pulse files are generally UTF-8 with BOM
    with open(path, encoding="utf-8-sig", errors="replace", newline="") as f:
        reader = csv.DictReader(f)
        cols = [c.strip() for c in (reader.fieldnames or [])]
        print(f"[{name}] columns: {cols}")
        for row in reader:
            yield {k.strip().upper(): (v or "").strip() for k, v in row.items() if k}


def find_col(row: dict, *candidates: str) -> str | None:
    for cand in candidates:
        for key in row:
            if cand in key:
                return key
    return None


def main(limit: int | None):
    # 1. Interior-related activity codes
    activity_name: dict[str, str] = {}
    code_col = desc_col = None
    for row in read_csv("business_activities.csv"):
        if code_col is None:
            code_col = find_col(row, "ACTIVITY_CODE", "ACTIVITYCODE", "CODE")
            desc_col = find_col(row, "ACTIVITY_DESC_EN", "DESC_EN", "NAME_EN", "DESCRIPTION", "ACTIVITY_EN")
            if not code_col or not desc_col:
                sys.exit(f"Could not detect columns in business_activities.csv: {list(row)}")
        desc = row[desc_col]
        if ACTIVITY_KEYWORDS.search(desc):
            activity_name[row[code_col]] = desc
    print(f"→ {len(activity_name)} interior-related activity codes")

    # 2. Licenses holding those activities
    license_activities: dict[str, list[str]] = {}
    lic_col = act_col = None
    for row in read_csv("license_activities.csv"):
        if lic_col is None:
            lic_col = find_col(row, "LICENSE_NUMBER", "LICENSENUMBER", "LICENSE_NO", "BL_NUMBER", "LICENSE")
            act_col = find_col(row, "ACTIVITY_CODE", "ACTIVITYCODE", "CODE")
            if not lic_col or not act_col:
                sys.exit(f"Could not detect columns in license_activities.csv: {list(row)}")
        code = row[act_col]
        if code in activity_name:
            license_activities.setdefault(row[lic_col], []).append(activity_name[code])
    print(f"→ {len(license_activities)} licenses with interior activities")

    # 3. Join with master for trade name / status / dates
    results = []
    m_lic = m_name = m_status = m_issue = m_expiry = None
    for row in read_csv("license_master.csv"):
        if m_lic is None:
            m_lic = find_col(row, "LICENSE_NUMBER", "LICENSENUMBER", "LICENSE_NO", "BL_NUMBER", "LICENSE")
            m_name = find_col(row, "BL_NAME_EN", "TRADE_NAME_EN", "NAME_EN", "BUSINESS_NAME", "BL_NAME")
            m_status = find_col(row, "STATUS", "LICENSE_STATUS", "BL_STATUS")
            m_issue = find_col(row, "ISSUE_DATE", "ISSUEDATE", "REGISTRATION_DATE")
            m_expiry = find_col(row, "EXPIRY_DATE", "EXPIRYDATE", "EXPIRE")
            if not m_lic or not m_name:
                sys.exit(f"Could not detect columns in license_master.csv: {list(row)}")
        lic = row[m_lic]
        if lic not in license_activities:
            continue
        status = row.get(m_status, "") if m_status else ""
        if status and not re.search(r"active|سار", status, re.IGNORECASE):
            continue
        results.append({
            "licenseNumber": lic,
            "name": row[m_name].title() if row[m_name].isupper() else row[m_name],
            "status": status or "Unknown",
            "issueDate": row.get(m_issue, "") if m_issue else "",
            "expiryDate": row.get(m_expiry, "") if m_expiry else "",
            "activities": sorted(set(license_activities[lic])),
        })
        if limit and len(results) >= limit:
            break

    results.sort(key=lambda r: r["name"])
    out = DATA_DIR / "interior_licenses.json"
    out.write_text(json.dumps(results, indent=2, ensure_ascii=False))
    print(f"\n✅ {len(results)} active interior licenses → {out}")

    stats: dict[str, int] = {}
    for r in results:
        for a in r["activities"]:
            stats[a] = stats.get(a, 0) + 1
    summary = "\n".join(f"{v:6d}  {k}" for k, v in sorted(stats.items(), key=lambda x: -x[1]))
    (DATA_DIR / "summary.txt").write_text(summary)
    print(f"Top activities:\n{summary[:800]}")


if __name__ == "__main__":
    lim = None
    if "--limit" in sys.argv:
        lim = int(sys.argv[sys.argv.index("--limit") + 1])
    main(lim)
