import base64
import html
import logging
import time
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import Any
import requests
from app.config import settings

logger = logging.getLogger(__name__)

# In-memory token cache
_cached_access_token: str | None = None
_token_expiry_timestamp: float = 0.0

def is_gmail_configured() -> bool:
    """Check whether all required Google OAuth credentials exist."""
    return bool(
        settings.google_client_id
        and settings.google_client_secret
        and settings.google_refresh_token
        and settings.gmail_sender_email
    )

def get_access_token() -> str:
    """
    Retrieve valid OAuth 2.0 access token using refresh token.
    Caches token in memory until 60 seconds before expiration.
    """
    global _cached_access_token, _token_expiry_timestamp

    now = time.time()
    if _cached_access_token and now < (_token_expiry_timestamp - 60):
        return _cached_access_token

    if not is_gmail_configured():
        raise RuntimeError("Google Gmail OAuth credentials are not configured.")

    token_url = "https://oauth2.googleapis.com/token"
    payload = {
        "client_id": settings.google_client_id,
        "client_secret": settings.google_client_secret,
        "refresh_token": settings.google_refresh_token,
        "grant_type": "refresh_token",
    }

    try:
        response = requests.post(token_url, data=payload, timeout=15)
        response.raise_for_status()
        data = response.json()
        
        access_token = data.get("access_token")
        expires_in = data.get("expires_in", 3600)

        if not access_token:
            raise RuntimeError(f"No access_token returned by Google OAuth: {data}")

        _cached_access_token = access_token
        _token_expiry_timestamp = now + expires_in
        logger.info(f"Successfully refreshed Gmail OAuth access token (expires in {expires_in}s)")
        return access_token
    except Exception as e:
        logger.error(f"Failed to refresh Google OAuth access token: {e}", exc_info=True)
        raise

def send_raw_email(mime_msg: MIMEMultipart) -> dict[str, Any]:
    """Base64 urlsafe encode MIME message and send via Gmail REST API."""
    access_token = get_access_token()
    raw_b64 = base64.urlsafe_b64encode(mime_msg.as_bytes()).decode("utf-8")

    send_url = "https://gmail.googleapis.com/gmail/v1/users/me/messages/send"
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json",
    }

    resp = requests.post(send_url, json={"raw": raw_b64}, headers=headers, timeout=20)
    if not resp.ok:
        err_text = resp.text
        logger.error(f"Gmail API send failed with HTTP {resp.status_code}: {err_text}")
        raise RuntimeError(f"Gmail API error {resp.status_code}")

    return resp.json()

def send_notification_to_owner(
    visitor_name: str,
    visitor_email: str,
    visitor_phone: str | None,
    subject: str,
    message: str,
    timestamp_str: str,
) -> bool:
    """
    Send contact notification email to Sarweshwar's Gmail.
    Sets Reply-To to visitor's email for instant reply in Gmail.
    """
    sender_email = settings.gmail_sender_email
    recipient_email = settings.gmail_notification_email or sender_email

    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"New Portfolio Contact — {visitor_name}: {subject}"
    msg["From"] = f"Portfolio Contact <{sender_email}>"
    msg["To"] = recipient_email
    # Crucial: Reply-To is visitor's email so replying in Gmail replies directly to visitor!
    msg["Reply-To"] = f"{visitor_name} <{visitor_email}>"

    # Plain text version
    text_content = (
        f"New contact received from your portfolio.\n\n"
        f"Name: {visitor_name}\n"
        f"Email: {visitor_email}\n"
        f"Phone: {visitor_phone or 'Not provided'}\n"
        f"Subject: {subject}\n\n"
        f"Message:\n{message}\n\n"
        f"Submitted: {timestamp_str}\n"
        f"Portfolio: {settings.portfolio_url}\n"
    )

    # Sanitized HTML version
    safe_name = html.escape(visitor_name)
    safe_email = html.escape(visitor_email)
    safe_phone = html.escape(visitor_phone) if visitor_phone else "Not provided"
    safe_subject = html.escape(subject)
    safe_message = html.escape(message).replace("\n", "<br/>")
    safe_portfolio = html.escape(settings.portfolio_url)

    html_content = f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #09090b; color: #f4f4f5; margin: 0; padding: 24px; }}
    .card {{ max-width: 600px; margin: 0 auto; background: #18181b; border: 1px solid rgba(255,255,255,0.12); border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.5); }}
    .header {{ background: linear-gradient(135deg, #06b6d4, #3b82f6); padding: 24px; color: #ffffff; }}
    .header h2 {{ margin: 0; font-size: 20px; font-weight: 700; }}
    .header p {{ margin: 4px 0 0 0; font-size: 13px; opacity: 0.9; }}
    .content {{ padding: 24px; }}
    .field {{ margin-bottom: 16px; }}
    .label {{ font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #a1a1aa; margin-bottom: 4px; font-weight: 600; }}
    .value {{ font-size: 15px; color: #ffffff; background: #27272a; padding: 10px 14px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.06); word-break: break-word; }}
    .message-box {{ font-size: 14px; color: #f4f4f5; line-height: 1.6; background: #27272a; padding: 14px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08); white-space: pre-wrap; }}
    .footer {{ padding: 16px 24px; background: #121215; border-top: 1px solid rgba(255,255,255,0.08); font-size: 12px; color: #71717a; display: flex; justify-content: space-between; align-items: center; }}
    .btn {{ display: inline-block; background: #3b82f6; color: #ffffff !important; text-decoration: none; padding: 8px 16px; border-radius: 8px; font-weight: 600; font-size: 13px; }}
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h2>📬 New Portfolio Inquiry</h2>
      <p>Submitted via {safe_portfolio}</p>
    </div>
    <div class="content">
      <div class="field">
        <div class="label">Sender Name</div>
        <div class="value"><strong>{safe_name}</strong></div>
      </div>
      <div class="field">
        <div class="label">Email Address (Click reply to write back)</div>
        <div class="value"><a href="mailto:{safe_email}" style="color:#38bdf8; text-decoration:none;">{safe_email}</a></div>
      </div>
      <div class="field">
        <div class="label">Phone</div>
        <div class="value">{safe_phone}</div>
      </div>
      <div class="field">
        <div class="label">Subject</div>
        <div class="value">{safe_subject}</div>
      </div>
      <div class="field">
        <div class="label">Message</div>
        <div class="message-box">{safe_message}</div>
      </div>
    </div>
    <div class="footer">
      <span>Timestamp: {timestamp_str}</span>
      <a href="mailto:{safe_email}?subject=Re: {safe_subject}" class="btn">Reply to {safe_name}</a>
    </div>
  </div>
</body>
</html>
"""

    msg.attach(MIMEText(text_content, "plain", "utf-8"))
    msg.attach(MIMEText(html_content, "html", "utf-8"))

    send_raw_email(msg)
    logger.info(f"Notification email sent to owner for inquiry from {visitor_email}")
    return True

def send_thank_you_to_visitor(visitor_name: str, visitor_email: str) -> bool:
    """
    Send personalized thank-you greeting email to the visitor from Sarweshwar's Gmail.
    Visitor can simply reply back to continue the discussion.
    """
    sender_email = settings.gmail_sender_email

    msg = MIMEMultipart("alternative")
    msg["Subject"] = "Thanks for visiting my portfolio! 🚀"
    msg["From"] = f"Sarweshwar Goud <{sender_email}>"
    msg["To"] = f"{visitor_name} <{visitor_email}>"
    msg["Reply-To"] = f"Sarweshwar Goud <{sender_email}>"

    # Plain text version matching user's exact specification
    text_content = (
        f"Hi {visitor_name},\n\n"
        f"Thanks for visiting my portfolio! 👋\n\n"
        f"I'm Sarweshwar, an aspiring AI Engineer passionate about AI, Generative AI, Machine Learning, RAG, and AI-powered applications.\n\n"
        f"I received your message through my portfolio and really appreciate you taking the time to reach out.\n\n"
        f"If you'd like to discuss an idea, project, collaboration, opportunity, or simply connect, feel free to reply to this email. I'd be happy to connect and discuss! 🤝\n\n"
        f"Looking forward to hearing from you.\n\n"
        f"Best regards,\n\n"
        f"Sarweshwar Goud\n"
        f"Aspiring AI Engineer\n"
        f"{settings.portfolio_url}\n"
    )

    safe_name = html.escape(visitor_name)
    safe_portfolio = html.escape(settings.portfolio_url)

    html_content = f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #09090b; color: #f4f4f5; margin: 0; padding: 24px; }}
    .card {{ max-width: 600px; margin: 0 auto; background: #18181b; border: 1px solid rgba(255,255,255,0.12); border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.5); }}
    .header {{ background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #8b5cf6 100%); padding: 28px 24px; color: #ffffff; text-align: center; }}
    .header h1 {{ margin: 0; font-size: 22px; font-weight: 700; }}
    .header p {{ margin: 6px 0 0 0; font-size: 13px; opacity: 0.95; }}
    .content {{ padding: 28px 24px; line-height: 1.7; font-size: 15px; color: #e4e4e7; }}
    .content p {{ margin: 0 0 16px 0; }}
    .highlight-box {{ background: rgba(59, 130, 246, 0.1); border-left: 3px solid #3b82f6; padding: 14px 16px; border-radius: 0 8px 8px 0; margin: 20px 0; font-size: 14px; color: #93c5fd; }}
    .signature {{ margin-top: 28px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); }}
    .sig-name {{ font-size: 16px; font-weight: 700; color: #ffffff; }}
    .sig-title {{ font-size: 13px; color: #38bdf8; font-weight: 500; }}
    .footer {{ padding: 16px 24px; background: #121215; border-top: 1px solid rgba(255,255,255,0.08); font-size: 12px; color: #71717a; text-align: center; }}
    .footer a {{ color: #38bdf8; text-decoration: none; }}
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>Thanks for reaching out! 🚀</h1>
      <p>Sarweshwar Goud • AI Engineer Portfolio</p>
    </div>
    <div class="content">
      <p>Hi <strong>{safe_name}</strong>,</p>
      <p>Thanks for visiting my portfolio! 👋</p>
      <p>I'm Sarweshwar, an aspiring AI Engineer passionate about AI, Generative AI, Machine Learning, RAG, and AI-powered applications.</p>
      <p>I received your message through my portfolio and really appreciate you taking the time to reach out.</p>
      <div class="highlight-box">
        💡 <strong>Let's connect:</strong> If you'd like to discuss an idea, project, collaboration, opportunity, or simply connect, feel free to reply directly to this email. I'd be delighted to discuss! 🤝
      </div>
      <p>Looking forward to hearing from you.</p>
      <div class="signature">
        <div class="sig-name">Sarweshwar Goud</div>
        <div class="sig-title">Aspiring AI Engineer</div>
      </div>
    </div>
    <div class="footer">
      <span>Sent from <a href="{safe_portfolio}">{safe_portfolio}</a></span>
    </div>
  </div>
</body>
</html>
"""

    msg.attach(MIMEText(text_content, "plain", "utf-8"))
    msg.attach(MIMEText(html_content, "html", "utf-8"))

    send_raw_email(msg)
    logger.info(f"Thank-you greeting email successfully sent to visitor: {visitor_email}")
    return True
