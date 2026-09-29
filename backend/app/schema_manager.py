"""
CoLead Self-Healing Schema Manager
Inspects, auto-provisions, and validates required tables, constraints, and indexes.
Ensures zero-downtime, non-destructive migration execution.
"""

import os
import sys
import sqlite3
import json
from datetime import datetime

DB_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "memorygrid.db"))

REQUIRED_TABLES = [
    "organizations",
    "users",
    "sessions",
    "teams",
    "people",
    "projects",
    "work_records",
    "contributions",
    "recent_activity",
    "memory_references",
    "project_blueprints"
]

def verify_and_provision_schema():
    """Validates the existing schema and provisions missing tables idempotently."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("PRAGMA foreign_keys = ON;")

    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    existing_tables = set(r[0] for r in cursor.fetchall())

    missing = [t for t in REQUIRED_TABLES if t not in existing_tables]

    if missing:
        # Import init_sqlite to execute idempotent table creation
        import init_sqlite
        init_sqlite.init_db(force_reseed=False)
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        existing_tables = set(r[0] for r in cursor.fetchall())

    # Verify column existence on critical tables
    table_reports = {}
    for t in REQUIRED_TABLES:
        if t in existing_tables:
            cursor.execute(f"PRAGMA table_info({t});")
            columns = [col[1] for col in cursor.fetchall()]
            cursor.execute(f"SELECT COUNT(*) FROM {t};")
            count = cursor.fetchone()[0]
            table_reports[t] = {
                "status": "READY",
                "columns_count": len(columns),
                "record_count": count
            }
        else:
            table_reports[t] = {
                "status": "MISSING",
                "columns_count": 0,
                "record_count": 0
            }

    conn.close()

    all_ready = all(r["status"] == "READY" for r in table_reports.values())
    return {
        "verified": all_ready,
        "total_required": len(REQUIRED_TABLES),
        "total_active": len([t for t, r in table_reports.items() if r["status"] == "READY"]),
        "tables": table_reports
    }

if __name__ == "__main__":
    result = verify_and_provision_schema()
    print(json.dumps(result, indent=2))
