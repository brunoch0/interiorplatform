#!/usr/bin/env python3
"""ElevenLabs text-to-speech with full emotional control.

Unlike the Higgsfield route, this exposes voice_settings — stability is the lever
that decides whether a line sounds read or acted. Low stability = more emotional
range (and more variance between takes).

Usage:
  python3 scripts/tts.py --voice Harry --text "..." --out anger.mp3 --stability 0.25 --style 0.8
  python3 scripts/tts.py --list

eleven_v3 supports inline audio tags: [angry] [shouting] [sighs] [whispers].
Reads ELEVENLABS_API_KEY from web/.env.local.
"""
import argparse, json, pathlib, subprocess, sys

API = "https://api.elevenlabs.io/v1"
ENV = pathlib.Path("web/.env.local")


def key() -> str:
    for line in ENV.read_text().splitlines():
        if line.startswith("ELEVENLABS_API_KEY="):
            return line.split("=", 1)[1].strip()
    sys.exit("ELEVENLABS_API_KEY not found in web/.env.local")


def curl(url: str, k: str, data: str | None = None, out: str | None = None) -> bytes:
    cmd = ["curl", "-s", "--max-time", "180", "-H", f"xi-api-key: {k}"]
    if data:
        cmd += ["-H", "Content-Type: application/json", "-d", data]
    if out:
        cmd += ["-o", out]
    cmd.append(url)
    r = subprocess.run(cmd, capture_output=True)
    return r.stdout


def voices(k: str) -> dict:
    return {v["name"].split(" - ")[0]: v["voice_id"]
            for v in json.loads(curl(f"{API}/voices", k))["voices"]}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--list", action="store_true")
    ap.add_argument("--voice", help="voice name, e.g. Harry")
    ap.add_argument("--text")
    ap.add_argument("--out")
    ap.add_argument("--model", default="eleven_v3")
    # 0.0-0.35 = expressive/volatile · 0.5 = natural · 1.0 = flat but consistent
    ap.add_argument("--stability", type=float, default=0.35)
    ap.add_argument("--similarity", type=float, default=0.75)
    ap.add_argument("--style", type=float, default=0.6, help="0-1; higher = more dramatic")
    ap.add_argument("--speed", type=float, default=1.0)
    args = ap.parse_args()

    k = key()
    vs = voices(k)
    if args.list:
        for n, i in vs.items():
            print(f"{i}  {n}")
        return

    if not (args.voice and args.text and args.out):
        sys.exit("--voice, --text and --out are required")
    if args.voice not in vs:
        sys.exit(f"unknown voice {args.voice!r}. Available: {', '.join(vs)}")

    body = json.dumps({
        "text": args.text,
        "model_id": args.model,
        "voice_settings": {
            "stability": args.stability,
            "similarity_boost": args.similarity,
            "style": args.style,
            "use_speaker_boost": True,
            "speed": args.speed,
        },
    })
    curl(f"{API}/text-to-speech/{vs[args.voice]}", k, data=body, out=args.out)

    p = pathlib.Path(args.out)
    if not p.exists() or p.stat().st_size < 2000:
        # the API returns a JSON error body instead of audio on failure
        print("FAILED:", p.read_text()[:300] if p.exists() else "no output")
        sys.exit(1)
    print(f"{args.out}  {p.stat().st_size // 1024}KB  voice={args.voice} "
          f"stability={args.stability} style={args.style}")


if __name__ == "__main__":
    main()
