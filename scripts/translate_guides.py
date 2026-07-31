#!/usr/bin/env python3
"""Translate the renovation guides into a target locale, one guide per API call.

Usage:
  npx tsx scripts/dump-guides.ts > data/guides.json     # refresh the source
  python3 scripts/translate_guides.py --locale ar               # all pending
  python3 scripts/translate_guides.py --locale ar --limit 3      # smoke test

Writes web/src/lib/guide-i18n/<locale>.json keyed by slug. Resume-safe: slugs
already present are skipped, so a crash or restart never loses finished work.
"""
import argparse, json, os, pathlib, subprocess, sys, time

MODEL = "claude-sonnet-5"
SRC = pathlib.Path("data/guides.json")
OUT_DIR = pathlib.Path("web/src/lib/guide-i18n")

LANG = {
    "ar": "Arabic (Modern Standard, as used in UAE media)",
    "ru": "Russian",
    "ko": "Korean",
}

# Translated per guide; everything else (slug, dates, images, official link hrefs)
# stays untouched so the English original remains the single source of structure.
FIELDS = ("title", "description", "intro", "sections", "faqs")

PROMPT = """Translate this Dubai home-renovation guide into {lang}.

The reader is a homeowner or tenant in Dubai planning a renovation. They are relying on this to make decisions involving significant money and legal obligations, so accuracy matters more than elegance. Translate faithfully — never soften, summarise, generalise, or omit a caveat, and never add advice that is not in the source.

Keep unchanged, in Latin script:
- All monetary figures and units exactly as written (AED 2,000 to 5,000, 80-150/sqft, percentages, dates, week/day counts)
- Names of authorities and official documents: Dubai Municipality, DM, DEWA, Trakhees, DDA, DET, NOC, MEP, RERA, Dubai Land Department, Ejari
- Place names: Dubai Marina, Palm Jumeirah, JVC, Business Bay, Al Quoz, Arabian Ranches, Downtown, DIFC
- Anything inside a URL

Structural rules — the output is rendered by a template, so shape must match exactly:
- Return ONLY a JSON object, no prose, no markdown fence
- Same keys as the input; same array lengths everywhere
- Each section keeps its "h2", the same number of "paragraphs", and if present the same "list" length and the same "table" header/row/column counts
- Do not translate the JSON keys themselves

Input:
{payload}"""


def call_api(key: str, prompt: str) -> str:
    body = json.dumps({
        "model": MODEL,
        "max_tokens": 16000,
        "messages": [{"role": "user", "content": prompt}],
    })
    # 900s: Arabic output for the longest guides runs past a 300s budget and a
    # curl timeout returns a truncated body that looks like malformed JSON.
    r = subprocess.run(
        ["curl", "-s", "--max-time", "900", "-X", "POST", "https://api.anthropic.com/v1/messages",
         "-H", f"x-api-key: {key}", "-H", "anthropic-version: 2023-06-01",
         "-H", "content-type: application/json", "-d", body],
        capture_output=True, text=True,
    )
    data = json.loads(r.stdout)
    if "content" not in data:
        raise RuntimeError(f"API error: {json.dumps(data)[:300]}")
    text = "".join(b.get("text", "") for b in data["content"])
    if not text.strip():
        raise RuntimeError(f"empty response (stop_reason={data.get('stop_reason')}, blocks={[b.get('type') for b in data['content']]})")
    return text


def parse_json(text: str) -> dict:
    t = text.strip()
    if t.startswith("```"):
        t = t.split("\n", 1)[1].rsplit("```", 1)[0]
    return json.loads(t)


def shape_ok(src: dict, out: dict) -> str | None:
    """Reject a translation whose structure drifted — a silent shape change would
    render as missing content on the page."""
    if len(out.get("intro", [])) != len(src["intro"]):
        return "intro length"
    if len(out.get("sections", [])) != len(src["sections"]):
        return "sections length"
    for i, (a, b) in enumerate(zip(src["sections"], out["sections"])):
        if len(b.get("paragraphs", [])) != len(a["paragraphs"]):
            return f"section {i} paragraphs"
        if ("list" in a) != ("list" in b) or (a.get("list") and len(a["list"]) != len(b.get("list", []))):
            return f"section {i} list"
        if ("table" in a) != ("table" in b):
            return f"section {i} table presence"
        if a.get("table"):
            if len(a["table"]["headers"]) != len(b["table"].get("headers", [])):
                return f"section {i} table headers"
            if len(a["table"]["rows"]) != len(b["table"].get("rows", [])):
                return f"section {i} table rows"
    if len(out.get("faqs", [])) != len(src["faqs"]):
        return "faqs length"
    return None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--locale", required=True, choices=sorted(LANG))
    ap.add_argument("--limit", type=int, default=0)
    args = ap.parse_args()

    key = None
    for line in open("web/.env.local"):
        if line.startswith("ANTHROPIC_API_KEY="):
            key = line.split("=", 1)[1].strip()
    if not key:
        sys.exit("ANTHROPIC_API_KEY not found in web/.env.local")

    guides = json.loads(SRC.read_text())
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    out_path = OUT_DIR / f"{args.locale}.json"
    done = json.loads(out_path.read_text()) if out_path.exists() else {}

    pending = [g for g in guides if g["slug"] not in done]
    if args.limit:
        pending = pending[: args.limit]
    print(f"{args.locale}: {len(done)} done · {len(pending)} to translate", flush=True)

    for i, g in enumerate(pending, 1):
        src = {k: g[k] for k in FIELDS}
        prompt = PROMPT.format(lang=LANG[args.locale], payload=json.dumps(src, ensure_ascii=False))
        for attempt in (1, 2):
            try:
                out = parse_json(call_api(key, prompt))
                bad = shape_ok(src, out)
                if bad:
                    raise RuntimeError(f"shape mismatch: {bad}")
                break
            except Exception as e:  # noqa: BLE001 — retry once, then skip this guide
                print(f"  ! {g['slug']} attempt {attempt}: {e}", flush=True)
                out = None
                time.sleep(3)
        if not out:
            print(f"  SKIPPED {g['slug']}", flush=True)
            continue

        done[g["slug"]] = out
        # write after every guide so a crash keeps everything finished so far
        out_path.write_text(json.dumps(done, ensure_ascii=False, indent=1))
        print(f"  {i}/{len(pending)} {g['slug']}", flush=True)

    print(f"DONE {args.locale}: {len(done)}/{len(guides)} guides in {out_path}")


if __name__ == "__main__":
    main()
