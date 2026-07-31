#!/usr/bin/env python3
"""Send a Telegram notification to Bruno's ops chat.

Usage:
  python3 scripts/notify.py "가이드 5편 발행 완료"
  python3 scripts/notify.py --file report.md          # send a file's contents
  python3 scripts/notify.py --resolve-chat            # print chat ids the bot can see

Reads TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID from web/.env.local.
Scheduled tasks use this so notifications land on the phone, not just in the app.
"""
import argparse, json, pathlib, subprocess, sys

ENV = pathlib.Path("web/.env.local")
API = "https://api.telegram.org"


def env(name: str) -> str | None:
    if not ENV.exists():
        return None
    for line in ENV.read_text().splitlines():
        if line.startswith(f"{name}="):
            return line.split("=", 1)[1].strip()
    return None


def api(token: str, method: str, params: dict | None = None) -> dict:
    cmd = ["curl", "-s", "--max-time", "30", f"{API}/bot{token}/{method}"]
    for k, v in (params or {}).items():
        cmd += ["--data-urlencode", f"{k}={v}"]
    return json.loads(subprocess.run(cmd, capture_output=True, text=True).stdout or "{}")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("text", nargs="?")
    ap.add_argument("--file")
    ap.add_argument("--resolve-chat", action="store_true")
    ap.add_argument("--silent", action="store_true", help="deliver without a sound")
    args = ap.parse_args()

    token = env("TELEGRAM_BOT_TOKEN")
    if not token:
        sys.exit("TELEGRAM_BOT_TOKEN not found in web/.env.local")

    if args.resolve_chat:
        seen = {}
        for u in api(token, "getUpdates").get("result", []):
            c = (u.get("message") or u.get("channel_post") or {}).get("chat", {})
            if c.get("id"):
                seen[c["id"]] = f"{c.get('type')} · {c.get('title') or c.get('first_name')}"
        if not seen:
            print("no chats yet — send the bot a message first, then re-run")
        for cid, label in seen.items():
            print(f"{cid}  {label}")
        return

    chat = env("TELEGRAM_CHAT_ID")
    if not chat:
        sys.exit("TELEGRAM_CHAT_ID not set — run: python3 scripts/notify.py --resolve-chat")

    text = pathlib.Path(args.file).read_text() if args.file else args.text
    if not text:
        sys.exit("nothing to send")
    # Telegram rejects messages over 4096 chars
    text = text[:4000] + ("\n…(잘림)" if len(text) > 4000 else "")

    r = api(token, "sendMessage", {
        "chat_id": chat,
        "text": text,
        "disable_notification": "true" if args.silent else "false",
        "link_preview_options": json.dumps({"is_disabled": True}),
    })
    if not r.get("ok"):
        sys.exit(f"send failed: {r.get('description')}")
    print("sent")


if __name__ == "__main__":
    main()
