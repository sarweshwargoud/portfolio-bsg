#!/usr/bin/env python3
"""
Gmail OAuth 2.0 Refresh Token Generator for Portfolio Contact System
-------------------------------------------------------------------
This interactive script helps you obtain a production-ready GOOGLE_REFRESH_TOKEN
with the minimal required scope: https://www.googleapis.com/auth/gmail.send

Instructions:
1. Go to Google Cloud Console (https://console.cloud.google.com/)
2. Create or select a project.
3. Enable 'Gmail API' under APIs & Services -> Library.
4. Go to APIs & Services -> OAuth consent screen:
   - Select 'External'
   - Add your email as Developer contact
   - Under Scopes, add 'https://www.googleapis.com/auth/gmail.send'
   - Under Test Users, add your personal Gmail address: b.sarweshwar445@gmail.com
5. Go to APIs & Services -> Credentials -> Create Credentials -> OAuth client ID:
   - Application type: 'Web application' (or Desktop app)
   - Name: Portfolio Contact Gmail
   - Authorized redirect URIs: http://localhost:8085/callback
6. Copy Client ID and Client Secret into backend/.env (or input them when prompted).
7. Run this script: python backend/scripts/get_gmail_token.py
"""

import http.server
import os
import sys
import urllib.parse
import webbrowser
from pathlib import Path
import requests

BACKEND_DIR = Path(__file__).resolve().parent.parent
ENV_PATH = BACKEND_DIR / ".env"

SCOPE = "https://www.googleapis.com/auth/gmail.send"
REDIRECT_URI = "http://localhost:8085/callback"
PORT = 8085

def load_env() -> dict[str, str]:
    env_vars = {}
    if ENV_PATH.exists():
        for line in ENV_PATH.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                key, val = line.split("=", 1)
                env_vars[key.strip()] = val.strip().strip("'").strip('"')
    return env_vars

def update_env(key: str, value: str):
    lines = []
    found = False
    if ENV_PATH.exists():
        lines = ENV_PATH.read_text(encoding="utf-8").splitlines()
        for idx, line in enumerate(lines):
            stripped = line.strip()
            if stripped.startswith(f"{key}="):
                lines[idx] = f"{key}={value}"
                found = True
                break

    if not found:
        lines.append(f"{key}={value}")

    ENV_PATH.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"✅ Successfully saved {key} to {ENV_PATH}")

def main():
    print("=" * 65)
    print("📬 Gmail API OAuth Token Generator for Portfolio Contact Me")
    print("=" * 65)

    env = load_env()
    client_id = env.get("GOOGLE_CLIENT_ID")
    client_secret = env.get("GOOGLE_CLIENT_SECRET")

    if not client_id:
        print("\nEnter your Google OAuth Client ID:")
        client_id = input("> ").strip()
        if client_id:
            update_env("GOOGLE_CLIENT_ID", client_id)

    if not client_secret:
        print("\nEnter your Google OAuth Client Secret:")
        client_secret = input("> ").strip()
        if client_secret:
            update_env("GOOGLE_CLIENT_SECRET", client_secret)

    if not client_id or not client_secret:
        print("❌ Error: Both GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are required.")
        sys.exit(1)

    auth_code_holder = {"code": None}

    class OAuthCallbackHandler(http.server.BaseHTTPRequestHandler):
        def do_GET(self):
            parsed = urllib.parse.urlparse(self.path)
            params = urllib.parse.parse_qs(parsed.query)

            if "code" in params:
                auth_code_holder["code"] = params["code"][0]
                self.send_response(200)
                self.send_header("Content-type", "text/html")
                self.end_headers()
                html_resp = """
                <html>
                <body style="font-family: sans-serif; text-align: center; padding: 50px; background: #09090b; color: #fff;">
                  <h1 style="color: #22c55e;">🎉 Authorization Successful!</h1>
                  <p>You can close this tab and return to your terminal.</p>
                </body>
                </html>
                """
                self.wfile.write(html_resp.encode("utf-8"))
            else:
                error = params.get("error", ["Unknown error"])[0]
                self.send_response(400)
                self.send_header("Content-type", "text/html")
                self.end_headers()
                self.wfile.write(f"<h1>Authorization Failed</h1><p>{error}</p>".encode("utf-8"))

        def log_message(self, format, *args):
            return  # Suppress console log spam

    server = http.server.HTTPServer(("localhost", PORT), OAuthCallbackHandler)

    params = {
        "client_id": client_id,
        "redirect_uri": REDIRECT_URI,
        "response_type": "code",
        "scope": SCOPE,
        "access_type": "offline",
        "prompt": "consent",
    }
    auth_url = "https://accounts.google.com/o/oauth2/v2/auth?" + urllib.parse.urlencode(params)

    print("\n🌐 Opening browser for Google OAuth authorization...")
    print(f"🔗 URL: {auth_url}\n")
    webbrowser.open(auth_url)

    print(f"Waiting for authorization on {REDIRECT_URI}...")
    while not auth_code_holder["code"]:
        server.handle_request()

    code = auth_code_holder["code"]
    print("🔑 Authorization code received! Exchanging for refresh token...")

    token_url = "https://oauth2.googleapis.com/token"
    token_payload = {
        "client_id": client_id,
        "client_secret": client_secret,
        "code": code,
        "grant_type": "authorization_code",
        "redirect_uri": REDIRECT_URI,
    }

    resp = requests.post(token_url, data=token_payload, timeout=20)
    if not resp.ok:
        print(f"❌ Token exchange failed: {resp.status_code} - {resp.text}")
        sys.exit(1)

    tokens = resp.json()
    refresh_token = tokens.get("refresh_token")

    if not refresh_token:
        print("⚠️ Warning: Google did not return a refresh token.")
        print("This usually happens if the app was already authorized without prompt=consent.")
        print(f"Response: {tokens}")
        sys.exit(1)

    update_env("GOOGLE_REFRESH_TOKEN", refresh_token)
    print("\n" + "=" * 65)
    print("🎉 SUCCESS! Your Gmail API is now configured and production-ready!")
    print(f"Refresh Token saved to {ENV_PATH}")
    print("=" * 65)

if __name__ == "__main__":
    main()
