import hashlib
import logging
import time
from datetime import datetime, timezone
from typing import Any
from supabase import create_client, Client
from app.config import settings
from app.services.gmail import (
    is_gmail_configured,
    send_notification_to_owner,
    send_thank_you_to_visitor,
)

logger = logging.getLogger(__name__)

# In-memory IP rate limiter (IP hash -> list of timestamps)
_rate_limit_records: dict[str, list[float]] = {}
RATE_LIMIT_WINDOW = 600  # 10 minutes
MAX_REQUESTS_PER_WINDOW = 5

def get_supabase_client() -> Client:
    """Initialize Supabase client using privileged service role key."""
    return create_client(settings.supabase_url, settings.supabase_service_role_key)

def check_rate_limit(client_ip: str) -> bool:
    """
    Check if the client IP has exceeded max requests in the current time window.
    Returns True if allowed, False if rate-limited.
    """
    if not client_ip:
        return True

    now = time.time()
    ip_hash = hashlib.sha256(client_ip.encode()).hexdigest()
    timestamps = _rate_limit_records.get(ip_hash, [])

    # Keep only timestamps within window
    timestamps = [t for t in timestamps if now - t < RATE_LIMIT_WINDOW]
    _rate_limit_records[ip_hash] = timestamps

    if len(timestamps) >= MAX_REQUESTS_PER_WINDOW:
        logger.warning(f"Rate limit exceeded for IP hash: {ip_hash[:8]}")
        return False

    timestamps.append(now)
    return True

def hash_ip(client_ip: str | None) -> str | None:
    """Hash client IP with SHA-256 for privacy protection."""
    if not client_ip:
        return None
    return hashlib.sha256(client_ip.encode()).hexdigest()

def process_contact_submission(
    name: str,
    email: str,
    subject: str,
    message: str,
    phone: str | None = None,
    hp_field: str | None = None,
    client_ip: str | None = None,
    user_agent: str | None = None,
) -> dict[str, Any]:
    """
    Process incoming contact form submission:
    1. Honeypot check (reject bot submissions silently)
    2. Rate limiting check
    3. Persist contact inquiry in Supabase table
    4. Send Gmail notification to owner (Reply-To visitor)
    5. Send personalized thank-you greeting to visitor
    6. Update submission delivery status in Supabase
    """
    # 1. Honeypot bot protection
    if hp_field and hp_field.strip():
        logger.info("Bot submission trapped by honeypot field. Silently ignoring.")
        return {
            "success": True,
            "message": "Your message has been sent successfully."
        }

    # 2. Rate limiting
    if client_ip and not check_rate_limit(client_ip):
        return {
            "success": False,
            "message": "Too many requests. Please wait a few minutes before submitting again."
        }

    submission_time = datetime.now(timezone.utc)
    timestamp_str = submission_time.strftime("%B %d, %Y at %I:%M %p UTC")
    ip_hashed = hash_ip(client_ip)

    # 3. Save to Supabase first so data is NEVER lost
    supabase_record_id: str | None = None
    try:
        supabase = get_supabase_client()
        row_data = {
            "name": name.strip(),
            "email": email.strip().lower(),
            "phone": phone.strip() if phone else None,
            "subject": subject.strip(),
            "message": message.strip(),
            "status": "received",
            "notification_sent": False,
            "thank_you_sent": False,
            "ip_hash": ip_hashed,
            "user_agent": (user_agent or "")[:300],
            "source": "portfolio_contact_form"
        }
        res = supabase.table("contact_submissions").insert(row_data).execute()
        if res.data and len(res.data) > 0:
            supabase_record_id = res.data[0].get("id")
            logger.info(f"Saved contact submission to Supabase with ID: {supabase_record_id}")
    except Exception as db_err:
        logger.error(f"Failed to persist contact submission in Supabase: {db_err}", exc_info=True)
        # Even if DB fails, continue attempting to dispatch emails or return error
        return {
            "success": False,
            "message": "Unable to save your message right now. Please try again in a few moments."
        }

    # 4. Attempt Gmail API delivery
    notification_sent = False
    thank_you_sent = False

    if is_gmail_configured():
        # A. Notification email to owner
        try:
            notification_sent = send_notification_to_owner(
                visitor_name=name.strip(),
                visitor_email=email.strip(),
                visitor_phone=phone.strip() if phone else None,
                subject=subject.strip(),
                message=message.strip(),
                timestamp_str=timestamp_str,
            )
        except Exception as notif_err:
            logger.error(f"Failed to dispatch notification email to owner: {notif_err}", exc_info=True)

        # B. Automatic thank-you greeting email to visitor
        try:
            thank_you_sent = send_thank_you_to_visitor(
                visitor_name=name.strip(),
                visitor_email=email.strip(),
            )
        except Exception as thank_err:
            logger.error(f"Failed to dispatch thank-you email to visitor: {thank_err}", exc_info=True)
    else:
        logger.warning("Gmail API credentials are not yet configured in backend/.env. Submission safely preserved in Supabase.")

    # 5. Update delivery flags in Supabase
    if supabase_record_id:
        try:
            status_val = "processed" if (notification_sent and thank_you_sent) else (
                "notification_sent" if notification_sent else "saved_pending_email"
            )
            supabase.table("contact_submissions").update({
                "notification_sent": notification_sent,
                "thank_you_sent": thank_you_sent,
                "status": status_val
            }).eq("id", supabase_record_id).execute()
        except Exception as update_err:
            logger.warning(f"Could not update delivery status on Supabase record: {update_err}")

    # 6. Response to visitor
    if is_gmail_configured() and not (notification_sent or thank_you_sent):
        return {
            "success": True,
            "message": "We received your message, but there was a temporary issue sending the confirmation email. I will get back to you soon!"
        }

    return {
        "success": True,
        "message": "Message sent successfully! 🚀 Thanks for reaching out. I'll get back to you soon."
    }
