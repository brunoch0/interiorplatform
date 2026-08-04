#!/usr/bin/env python3
"""GA4 + Search Console numbers for a venture, straight to the terminal.

  python3 scripts/analytics.py --venture interior --days 7
  python3 scripts/analytics.py --list          # discover GA4 property ids

Auth reuses the existing service-account key (already a viewer on every
venture's GA4 property and Search Console site). No pip installs: the JWT is
signed with openssl, everything else is urllib.
"""
import argparse, base64, json, os, subprocess, sys, tempfile, time, urllib.parse, urllib.request
from datetime import date, timedelta

KEY = os.path.expanduser("~/.config/growtoday-gsc.json")

# ga4: numeric property id (not the G- measurement id). site: exact Search
# Console property string — "sc-domain:" and trailing slashes matter.
VENTURES = {
    "interior": {"ga4": "547174942", "site": "sc-domain:onepassinterior.com"},
    "pet":      {"ga4": None,        "site": "https://onepasspet.com/"},
    "wedding":  {"ga4": None,        "site": "sc-domain:onepasswedding.com"},
    "eat":      {"ga4": None,        "site": "sc-domain:dubaitoday.org"},
    "holdings": {"ga4": None,        "site": "sc-domain:growtodayholdings.com"},
}

SCOPES = ("https://www.googleapis.com/auth/webmasters.readonly "
          "https://www.googleapis.com/auth/analytics.readonly")


def token() -> str:
    d = json.load(open(KEY))
    b64 = lambda x: base64.urlsafe_b64encode(x).rstrip(b"=")
    now = int(time.time())
    signing = (b64(json.dumps({"alg": "RS256", "typ": "JWT"}).encode()) + b"." +
               b64(json.dumps({"iss": d["client_email"], "scope": SCOPES,
                               "aud": "https://oauth2.googleapis.com/token",
                               "exp": now + 3600, "iat": now}).encode()))
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pem") as f:
        f.write(d["private_key"].encode())
        pem = f.name
    try:
        sig = subprocess.run(["openssl", "dgst", "-sha256", "-sign", pem],
                             input=signing, capture_output=True, check=True).stdout
    finally:
        os.unlink(pem)
    body = urllib.parse.urlencode({
        "grant_type": "urn:ietf:params:oauth:grant-type:jwt-bearer",
        "assertion": (signing + b"." + b64(sig)).decode()}).encode()
    return json.load(urllib.request.urlopen(
        "https://oauth2.googleapis.com/token", data=body))["access_token"]


def api(tok, url, payload=None):
    data = json.dumps(payload).encode() if payload is not None else None
    req = urllib.request.Request(url, data=data, headers={
        "Authorization": f"Bearer {tok}", "Content-Type": "application/json"})
    try:
        return json.load(urllib.request.urlopen(req))
    except urllib.error.HTTPError as e:
        return {"_error": e.read().decode()[:400]}


def rows_ga4(res):
    """GA4 returns rows only when there is data; missing key means zero."""
    return res.get("rows", [])


def table(title, headers, rows):
    print(f"\n── {title}")
    if not rows:
        print("   (데이터 없음)")
        return
    w = [max(len(str(r[i])) for r in [headers] + rows) for i in range(len(headers))]
    print("   " + "  ".join(str(h).ljust(w[i]) for i, h in enumerate(headers)))
    for r in rows:
        print("   " + "  ".join(str(c).ljust(w[i]) for i, c in enumerate(r)))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--venture", default="interior", choices=sorted(VENTURES))
    ap.add_argument("--days", type=int, default=7)
    ap.add_argument("--list", action="store_true", help="list GA4 properties and exit")
    args = ap.parse_args()
    tok = token()

    if args.list:
        res = api(tok, "https://analyticsadmin.googleapis.com/v1beta/accountSummaries?pageSize=200")
        if "_error" in res:
            sys.exit(res["_error"])
        for acc in res.get("accountSummaries", []):
            for p in acc.get("propertySummaries", []):
                print(f'{p["property"].split("/")[-1]:<12} {p.get("displayName","")}  ({acc.get("displayName","")})')
        return

    v = VENTURES[args.venture]
    end, start = date.today() - timedelta(days=1), date.today() - timedelta(days=args.days)
    print(f"\n=== {args.venture} · {start} ~ {end} ===")

    # ---- Search Console: impressions/clicks are the pre-visit funnel ----
    base = f"https://www.googleapis.com/webmasters/v3/sites/{urllib.parse.quote(v['site'], safe='')}/searchAnalytics/query"
    body = {"startDate": str(start), "endDate": str(end), "rowLimit": 10}
    tot = api(tok, base, body)
    if "_error" in tot:
        print("\n── Search Console\n   " + tot["_error"])
    else:
        r = rows_ga4(tot)
        if r:
            m = r[0]
            print(f"\n── Search Console 합계\n   노출 {m['impressions']:,} · 클릭 {m['clicks']:,} "
                  f"· CTR {m['ctr']*100:.2f}% · 평균순위 {m['position']:.1f}")
        else:
            print("\n── Search Console 합계\n   (아직 노출 데이터 없음)")
        for dim, label in (("query", "검색어 TOP"), ("page", "페이지 TOP")):
            res = api(tok, base, {**body, "dimensions": [dim]})
            table(label, [dim, "노출", "클릭", "순위"],
                  [[x["keys"][0][:60], f"{x['impressions']:,}", f"{x['clicks']:,}", f"{x['position']:.1f}"]
                   for x in rows_ga4(res)])

    # ---- GA4: what people did once they arrived ----
    if not v["ga4"]:
        print(f"\n── GA4\n   {args.venture}의 속성 ID 미설정 — `--list`로 찾아서 VENTURES에 넣을 것")
        return
    ga = f"https://analyticsdata.googleapis.com/v1beta/properties/{v['ga4']}:runReport"
    rng = [{"startDate": str(start), "endDate": str(end)}]

    res = api(tok, ga, {"dateRanges": rng, "metrics": [
        {"name": "sessions"}, {"name": "totalUsers"},
        {"name": "averageSessionDuration"}, {"name": "engagementRate"}]})
    if "_error" in res:
        print("\n── GA4\n   " + res["_error"])
        return
    r = rows_ga4(res)
    if r:
        m = [x["value"] for x in r[0]["metricValues"]]
        print(f"\n── GA4 합계\n   세션 {int(float(m[0])):,} · 사용자 {int(float(m[1])):,} "
              f"· 평균체류 {float(m[2]):.0f}초 · 참여율 {float(m[3])*100:.1f}%")

    for dim, label in (("sessionSource", "유입 소스"), ("country", "국가"), ("pagePath", "페이지")):
        res = api(tok, ga, {"dateRanges": rng, "dimensions": [{"name": dim}],
                            "metrics": [{"name": "sessions"}, {"name": "averageSessionDuration"}],
                            "orderBys": [{"metric": {"metricName": "sessions"}, "desc": True}],
                            "limit": 10})
        table(label, [dim, "세션", "평균체류(초)"],
              [[x["dimensionValues"][0]["value"][:50],
                int(float(x["metricValues"][0]["value"])),
                f'{float(x["metricValues"][1]["value"]):.0f}'] for x in rows_ga4(res)])


if __name__ == "__main__":
    main()
