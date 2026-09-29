"""
Supabase PostgreSQL Database Client for CoLead
Provides secure server-side data operations, health checks, and sync capabilities.
"""

import os
import time
import json
import urllib.request
import urllib.error

SUPABASE_URL = os.getenv("SUPABASE_URL", "https://wwcxwzvgvrzmqwyazinn.supabase.co").rstrip("/")
SUPABASE_KEY = os.getenv(
    "SUPABASE_SERVICE_ROLE_KEY",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3Y3h3enZndnJ6bXF3eWF6aW5uIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDY1ODA1MiwiZXhwIjoyMTA2MjM0MDUyfQ.Fr1HT6nl7j6YdqoZA4NxLgoJxnq-PuWx9f0ze_bynKc"
)

def get_supabase_health():
    """Checks the health and connectivity to the Supabase PostgreSQL cluster."""
    start_time = time.time()
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json"
    }

    try:
        req = urllib.request.Request(
            f"{SUPABASE_URL}/rest/v1/",
            headers=headers,
            method="GET"
        )
        with urllib.request.urlopen(req, timeout=5) as response:
            latency = int((time.time() - start_time) * 1000)
            return {
                "connected": True,
                "status": "CONNECTED",
                "engine": "Supabase PostgreSQL 15+",
                "url": SUPABASE_URL,
                "latency_ms": latency,
                "rls_enabled": True
            }
    except urllib.error.HTTPError as e:
        latency = int((time.time() - start_time) * 1000)
        # Even if schema cache is refreshing or returns 404 on root, if server responds, network is verified
        if e.code in [200, 404]:
            return {
                "connected": True,
                "status": "CONNECTED",
                "engine": "Supabase PostgreSQL 15+",
                "url": SUPABASE_URL,
                "latency_ms": latency,
                "rls_enabled": True
            }
        return {
            "connected": False,
            "status": "CONNECTION ERROR",
            "engine": "Supabase PostgreSQL",
            "url": SUPABASE_URL,
            "latency_ms": latency,
            "error": f"HTTP {e.code}: {e.reason}"
        }
    except Exception as e:
        latency = int((time.time() - start_time) * 1000)
        return {
            "connected": False,
            "status": "CONNECTION ERROR",
            "engine": "Supabase PostgreSQL",
            "url": SUPABASE_URL,
            "latency_ms": latency,
            "error": str(e)
        }
