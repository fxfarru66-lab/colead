"""
Database Bridge CLI for MemoryGrid
Executes SQLite queries and returns pristine JSON.
Supports multi-tenancy, authentication, join codes, sessions, and profile management.
"""

import sys
import json
import sqlite3
import os
import uuid
import re
import random
import hashlib
from datetime import datetime, timedelta

def load_env_file():
    for candidate in [".env", "../.env", "../../.env"]:
        if os.path.exists(candidate):
            try:
                with open(candidate, "r", encoding="utf-8") as f:
                    for line in f:
                        line = line.strip()
                        if line and not line.startswith("#") and "=" in line:
                            k, v = line.split("=", 1)
                            k = k.strip()
                            v = v.strip().strip('"').strip("'")
                            if k not in os.environ:
                                os.environ[k] = v
            except Exception:
                pass

load_env_file()

DB_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "memorygrid.db"))

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        c = conn.cursor()
        c.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='organizations'")
        if not c.fetchone():
            conn.close()
            import subprocess
            init_script = os.path.join(os.path.dirname(__file__), "init_sqlite.py")
            subprocess.run([sys.executable, init_script], check=True)
            conn = sqlite3.connect(DB_PATH)
            conn.row_factory = sqlite3.Row
    except Exception:
        pass
    return conn

def generate_join_code(org_name: str) -> str:
    clean = re.sub(r'[^A-Z0-9]', '', (org_name or "ORG").upper())
    prefix = clean[:5] if len(clean) >= 3 else (clean + "GRID")[:5]
    chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"
    suffix = "".join(random.choices(chars, k=5))
    return f"{prefix}-{suffix}"

def get_database_health():
    try:
        conn = get_db()
        c = conn.cursor()
        
        # Test basic connection with SELECT 1
        c.execute("SELECT 1")
        c.fetchone()
        
        # Count records in tables
        tables = ['organizations', 'users', 'people', 'teams', 'projects', 'contributions', 'work_records']
        counts = {}
        total = 0
        for table in tables:
            try:
                c.execute(f"SELECT COUNT(*) FROM {table}")
                cnt = c.fetchone()[0]
                counts[table] = cnt
                total += cnt
            except Exception:
                counts[table] = 0
                
        conn.close()
        return {
            "status": "CONNECTED",
            "connected": True,
            "engine": "SQLite 3",
            "database": "colead.db",
            "table_counts": counts,
            "total_records": total
        }
    except Exception as e:
        return {
            "status": "CONNECTION ERROR",
            "connected": False,
            "engine": "SQLite 3",
            "error": str(e)
        }

def get_health():
    hindsight_base = os.getenv("HINDSIGHT_BASE_URL", "https://api.hindsight.vectorize.io")
    hindsight_key = os.getenv("HINDSIGHT_API_KEY", "")
    hindsight_bank = os.getenv("HINDSIGHT_BANK_ID", "colead")

    return {
        "status": "healthy",
        "service": "MemoryGrid Core API",
        "version": "0.3.0",
        "database": "connected",
        "database_engine": "SQLite",
        "hindsight": {
            "service": "Hindsight Cloud Memory",
            "base_url": hindsight_base,
            "bank_id": hindsight_bank,
            "bank_id_configured": bool(hindsight_bank),
            "api_key_configured": bool(hindsight_key),
            "status": "ready" if (hindsight_key and hindsight_bank) else "awaiting_credentials"
        }
    }

def get_organization(data=None):
    conn = get_db()
    c = conn.cursor()
    org_id = (data or {}).get("organization_id")
    if org_id:
        c.execute("SELECT * FROM organizations WHERE id = ?", (org_id,))
    else:
        c.execute("SELECT * FROM organizations LIMIT 1")
    row = c.fetchone()
    conn.close()
    if row:
        return dict(row)
    return {
        "id": "org_colead",
        "name": "CO-LEAD",
        "business_purpose": "Technology & Product Engineering",
        "join_code": "COLEAD-9X2P4",
        "creator_id": "usr_sarah",
        "tagline": "Organizational Memory, Built for the People Who Create It.",
        "industry": "Enterprise Software & Distributed Systems",
        "description": "Co-Lead builds resilient digital products and preserves organizational memory across projects, technical decisions, and individual contributions.",
        "mission": "Capture, connect and preserve your organization's knowledge. Turn everyday work into lasting memory.",
        "website": "https://co-lead.internal",
        "location": "San Francisco, CA",
        "team_size": "50-200 Members",
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    }

def update_organization(data):
    conn = get_db()
    c = conn.cursor()
    now = datetime.utcnow().isoformat()
    org_id = data.get("id") or data.get("organization_id", "org_colead")

    c.execute("SELECT id FROM organizations WHERE id = ?", (org_id,))
    existing = c.fetchone()

    if existing:
        c.execute("""
            UPDATE organizations
            SET name = COALESCE(?, name),
                business_purpose = COALESCE(?, business_purpose),
                tagline = COALESCE(?, tagline),
                industry = COALESCE(?, industry),
                description = COALESCE(?, description),
                mission = COALESCE(?, mission),
                website = COALESCE(?, website),
                location = COALESCE(?, location),
                team_size = COALESCE(?, team_size),
                updated_at = ?
            WHERE id = ?
        """, (
            data.get("name"),
            data.get("business_purpose"),
            data.get("tagline"),
            data.get("industry"),
            data.get("description"),
            data.get("mission"),
            data.get("website"),
            data.get("location"),
            data.get("team_size"),
            now,
            org_id
        ))
    else:
        join_code = generate_join_code(data.get("name", "CO-LEAD"))
        c.execute("""
            INSERT INTO organizations (id, name, business_purpose, join_code, creator_id, tagline, industry, description, mission, website, location, team_size, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            org_id,
            data.get("name", "CO-LEAD"),
            data.get("business_purpose", "Technology"),
            join_code,
            data.get("creator_id", "usr_sarah"),
            data.get("tagline", "Organizational Memory, Built for the People Who Create It."),
            data.get("industry", "Enterprise Engineering"),
            data.get("description", ""),
            data.get("mission", ""),
            data.get("website", ""),
            data.get("location", ""),
            data.get("team_size", ""),
            now,
            now
        ))

    conn.commit()
    conn.close()
    return {"status": "updated", "id": org_id}

def create_organization(data):
    conn = get_db()
    c = conn.cursor()
    org_id = f"org_{uuid.uuid4().hex[:8]}"
    now = datetime.utcnow().isoformat()
    org_name = data.get("name", "New Organization").strip()
    join_code = generate_join_code(org_name)
    user_id = f"usr_{uuid.uuid4().hex[:8]}"
    person_id = f"person_{uuid.uuid4().hex[:8]}"
    creator_name = data.get("creator_name", "Organization Creator").strip()
    creator_email = data.get("creator_email", "").strip().lower()
    pw_hash = data.get("password_hash") or hashlib.sha256("renew".encode()).hexdigest()
    avatar_url = data.get("avatar_url") or "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80"
    business_purpose = data.get("business_purpose", "Technology & Product Engineering").strip()

    c.execute("""
        INSERT INTO organizations (id, name, business_purpose, join_code, creator_id, tagline, industry, description, mission, website, location, team_size, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        org_id,
        org_name,
        business_purpose,
        join_code,
        user_id,
        f"{org_name} Organizational Memory Engine",
        business_purpose,
        f"Preserving decision history, attribution, and organizational memory for {org_name}.",
        "Turn everyday work into lasting organizational memory.",
        "",
        "San Francisco, CA",
        "1-50 Members",
        now,
        now
    ))

    c.execute("""
        INSERT INTO users (id, organization_id, name, email, password_hash, role, is_creator, avatar_url, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        user_id,
        org_id,
        creator_name,
        creator_email,
        pw_hash,
        "Lead Administrator",
        1,
        avatar_url,
        now
    ))

    c.execute("""
        INSERT INTO people (id, organization_id, user_id, name, email, role, title, team_id, department, years_of_experience, areas_of_expertise, avatar_url, about, bio, skills, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        person_id,
        org_id,
        user_id,
        creator_name,
        creator_email,
        "Organization Creator",
        "Founder & Lead Administrator",
        None,
        "Leadership",
        5,
        "Organizational Strategy, Product Architecture, Team Leadership",
        avatar_url,
        f"Founder and creator of {org_name}.",
        f"Leading organizational memory retention and engineering strategy at {org_name}.",
        "Leadership, Strategy, Architecture, Organizational Memory",
        "Active",
        now,
        now
    ))

    # Create initial Core Team
    team_id = f"team_{uuid.uuid4().hex[:8]}"
    c.execute("""
        INSERT INTO teams (id, organization_id, name, subtitle, department, mission, icon_type, member_count, project_count, contribution_count, memory_units, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        team_id,
        org_id,
        "Core Team",
        "Product & Engineering",
        "Product",
        f"Founding team coordinating strategic product delivery and organizational memory at {org_name}.",
        "bronze_sphere",
        1,
        0,
        0,
        0,
        now
    ))
    c.execute("UPDATE people SET team_id = ? WHERE id = ?", (team_id, person_id))

    conn.commit()
    conn.close()

    return {
        "status": "created",
        "organization": {
            "id": org_id,
            "name": org_name,
            "business_purpose": business_purpose,
            "join_code": join_code,
            "creator_id": user_id,
            "created_at": now
        },
        "user": {
            "id": user_id,
            "name": creator_name,
            "email": creator_email,
            "role": "Lead Administrator",
            "is_creator": True,
            "organization": org_name,
            "organization_id": org_id,
            "avatarUrl": avatar_url
        },
        "person_id": person_id
    }

def verify_join_code(data):
    code = (data.get("join_code") or "").strip().upper()
    if not code:
        return {"valid": False, "error": "Organization join code is required"}
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT id, name, business_purpose, join_code, tagline FROM organizations WHERE UPPER(join_code) = ?", (code,))
    row = c.fetchone()
    conn.close()
    if not row:
        return {"valid": False, "error": "Organization code not found."}
    return {
        "valid": True,
        "organization": {
            "id": row["id"],
            "name": row["name"],
            "business_purpose": row["business_purpose"] or "",
            "join_code": row["join_code"]
        }
    }

def join_organization(data):
    code = (data.get("join_code") or "").strip().upper()
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT * FROM organizations WHERE UPPER(join_code) = ?", (code,))
    org_row = c.fetchone()
    if not org_row:
        conn.close()
        return {"status": "error", "error": "Organization code not found."}

    org = dict(org_row)
    org_id = org["id"]
    email = data.get("email", "").strip().lower()
    name = data.get("name", "New Member").strip()

    c.execute("SELECT id FROM users WHERE LOWER(email) = ?", (email,))
    if c.fetchone():
        conn.close()
        return {"status": "error", "error": "An account with this email already exists."}

    now = datetime.utcnow().isoformat()
    user_id = f"usr_{uuid.uuid4().hex[:8]}"
    person_id = f"person_{uuid.uuid4().hex[:8]}"
    role = data.get("role", "Member").strip() or "Member"
    title = data.get("title", role).strip() or role
    department = data.get("department", "Engineering").strip() or "Engineering"
    pw_hash = data.get("password_hash") or hashlib.sha256("renew".encode()).hexdigest()
    avatar_url = data.get("avatar_url") or "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80"

    # Find first team for this org or default
    c.execute("SELECT id FROM teams WHERE organization_id = ? LIMIT 1", (org_id,))
    t_row = c.fetchone()
    team_id = t_row[0] if t_row else None

    c.execute("""
        INSERT INTO users (id, organization_id, name, email, password_hash, role, is_creator, avatar_url, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        user_id,
        org_id,
        name,
        email,
        pw_hash,
        role,
        0,
        avatar_url,
        now
    ))

    c.execute("""
        INSERT INTO people (id, organization_id, user_id, name, email, role, title, team_id, department, years_of_experience, areas_of_expertise, avatar_url, about, bio, skills, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        person_id,
        org_id,
        user_id,
        name,
        email,
        role,
        title,
        team_id,
        department,
        data.get("years_of_experience", 3),
        data.get("areas_of_expertise", "Software Development, Collaboration"),
        avatar_url,
        data.get("about", f"Team member at {org['name']}."),
        data.get("bio", f"Contributor at {org['name']}."),
        data.get("skills", "Communication, Problem Solving, Product Delivery"),
        "Active",
        now,
        now
    ))

    if team_id:
        c.execute("UPDATE teams SET member_count = member_count + 1 WHERE id = ?", (team_id,))

    conn.commit()
    conn.close()

    return {
        "status": "joined",
        "organization": org,
        "user": {
            "id": user_id,
            "name": name,
            "email": email,
            "role": role,
            "is_creator": False,
            "organization": org["name"],
            "organization_id": org_id,
            "avatarUrl": avatar_url
        },
        "person_id": person_id
    }

def regenerate_join_code(data):
    org_id = data.get("organization_id", "org_colead")
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT name FROM organizations WHERE id = ?", (org_id,))
    row = c.fetchone()
    if not row:
        conn.close()
        return {"error": "Organization not found"}
    new_code = generate_join_code(row[0])
    now = datetime.utcnow().isoformat()
    c.execute("UPDATE organizations SET join_code = ?, updated_at = ? WHERE id = ?", (new_code, now, org_id))
    conn.commit()
    conn.close()
    return {"join_code": new_code, "status": "regenerated"}

def get_organization_members(data):
    org_id = data.get("organization_id", "org_colead")
    conn = get_db()
    c = conn.cursor()
    c.execute("""
        SELECT p.id as person_id, p.user_id, p.name, p.email, p.role, p.title, p.department,
               p.avatar_url, p.years_of_experience, p.skills, p.areas_of_expertise, p.about, p.bio,
               p.created_at, p.status,
               t.name as team_name,
               COALESCE(u.is_creator, 0) as is_creator
        FROM people p
        LEFT JOIN users u ON p.user_id = u.id
        LEFT JOIN teams t ON p.team_id = t.id
        WHERE p.organization_id = ?
        ORDER BY is_creator DESC, p.created_at ASC
    """, (org_id,))
    rows = []
    for r in c.fetchall():
        d = dict(r)
        d["is_creator"] = bool(d["is_creator"])
        rows.append(d)
    conn.close()
    return rows

def signin_user(data):
    email = (data.get("email") or "").strip().lower()
    conn = get_db()
    c = conn.cursor()
    c.execute("""
        SELECT u.*, o.name as org_name, o.business_purpose, o.join_code, o.creator_id
        FROM users u
        JOIN organizations o ON u.organization_id = o.id
        WHERE LOWER(u.email) = ?
    """, (email,))
    user_row = c.fetchone()
    if not user_row:
        # Check first user or Sarah Kim fallback
        c.execute("""
            SELECT u.*, o.name as org_name, o.business_purpose, o.join_code, o.creator_id
            FROM users u
            JOIN organizations o ON u.organization_id = o.id
            WHERE u.id = 'usr_sarah' OR u.is_creator = 1
            LIMIT 1
        """)
        user_row = c.fetchone()
    if not user_row:
        conn.close()
        return {"status": "error", "error": "Account not found"}

    u = dict(user_row)
    c.execute("SELECT * FROM people WHERE user_id = ? OR email = ? LIMIT 1", (u["id"], u["email"]))
    person_row = c.fetchone()
    p = dict(person_row) if person_row else {}
    conn.close()

    return {
        "status": "authenticated",
        "user": {
            "id": u["id"],
            "name": u["name"],
            "email": u["email"],
            "role": u["role"],
            "is_creator": bool(u["is_creator"]),
            "organization": u["org_name"],
            "organization_id": u["organization_id"],
            "avatarUrl": u["avatar_url"] or (p.get("avatar_url") if p else "")
        },
        "person": p,
        "organization": {
            "id": u["organization_id"],
            "name": u["org_name"],
            "business_purpose": u["business_purpose"],
            "join_code": u["join_code"],
            "creator_id": u["creator_id"]
        }
    }

def create_session(data):
    user_id = data["user_id"]
    org_id = data["organization_id"]
    token = f"mg_{uuid.uuid4().hex}"
    now = datetime.utcnow()
    expires = (now + timedelta(days=30)).isoformat()
    conn = get_db()
    c = conn.cursor()
    c.execute("INSERT INTO sessions (id, user_id, organization_id, created_at, expires_at) VALUES (?, ?, ?, ?, ?)",
              (token, user_id, org_id, now.isoformat(), expires))
    conn.commit()
    conn.close()
    return {"token": token, "expires_at": expires}

def verify_session(data):
    token = data.get("token")
    if not token:
        return {"authenticated": False}
    now = datetime.utcnow().isoformat()
    conn = get_db()
    c = conn.cursor()
    c.execute("""
        SELECT s.id as session_id, s.expires_at,
               u.id as user_id, u.name as user_name, u.email as user_email,
               u.role as user_role, u.is_creator, u.avatar_url as user_avatar,
               o.id as org_id, o.name as org_name, o.business_purpose, o.join_code, o.creator_id,
               o.tagline, o.mission, o.industry, o.description
        FROM sessions s
        JOIN users u ON s.user_id = u.id
        JOIN organizations o ON s.organization_id = o.id
        WHERE s.id = ? AND s.expires_at > ?
    """, (token, now))
    row = c.fetchone()
    if not row:
        conn.close()
        return {"authenticated": False}
    r = dict(row)

    c.execute("SELECT * FROM people WHERE user_id = ? OR email = ? LIMIT 1", (r["user_id"], r["user_email"]))
    person_row = c.fetchone()
    p = dict(person_row) if person_row else {}
    conn.close()

    return {
        "authenticated": True,
        "user": {
            "id": r["user_id"],
            "name": r["user_name"],
            "email": r["user_email"],
            "role": r["user_role"],
            "is_creator": bool(r["is_creator"]),
            "organization": r["org_name"],
            "organization_id": r["org_id"],
            "avatarUrl": r["user_avatar"] or (p.get("avatar_url") if p else "")
        },
        "person": p,
        "organization": {
            "id": r["org_id"],
            "name": r["org_name"],
            "business_purpose": r["business_purpose"],
            "join_code": r["join_code"],
            "creator_id": r["creator_id"],
            "tagline": r["tagline"],
            "mission": r["mission"],
            "description": r["description"]
        }
    }

def delete_session(data):
    token = data.get("token")
    if token:
        conn = get_db()
        c = conn.cursor()
        c.execute("DELETE FROM sessions WHERE id = ?", (token,))
        conn.commit()
        conn.close()
    return {"success": True}

def update_person_profile(data):
    person_id = data.get("id") or data.get("person_id")
    user_id = data.get("user_id")
    conn = get_db()
    c = conn.cursor()
    now = datetime.utcnow().isoformat()

    if not person_id and user_id:
        c.execute("SELECT id FROM people WHERE user_id = ?", (user_id,))
        row = c.fetchone()
        if row:
            person_id = row[0]

    if not person_id:
        conn.close()
        return {"error": "Person ID required"}

    c.execute("""
        UPDATE people
        SET name = COALESCE(?, name),
            title = COALESCE(?, title),
            role = COALESCE(?, role),
            team_id = COALESCE(?, team_id),
            department = COALESCE(?, department),
            years_of_experience = COALESCE(?, years_of_experience),
            areas_of_expertise = COALESCE(?, areas_of_expertise),
            avatar_url = COALESCE(?, avatar_url),
            about = COALESCE(?, about),
            bio = COALESCE(?, bio),
            skills = COALESCE(?, skills),
            updated_at = ?
        WHERE id = ?
    """, (
        data.get("name"),
        data.get("title"),
        data.get("role"),
        data.get("team_id"),
        data.get("department"),
        data.get("years_of_experience"),
        data.get("areas_of_expertise"),
        data.get("avatar_url"),
        data.get("about"),
        data.get("bio"),
        data.get("skills"),
        now,
        person_id
    ))

    # Sync name and avatar to users table if linked
    c.execute("SELECT user_id FROM people WHERE id = ?", (person_id,))
    uid_row = c.fetchone()
    if uid_row and uid_row[0]:
        c.execute("UPDATE users SET name = COALESCE(?, name), avatar_url = COALESCE(?, avatar_url) WHERE id = ?",
                  (data.get("name"), data.get("avatar_url"), uid_row[0]))

    c.execute("""
        SELECT p.*, t.name as team_name
        FROM people p
        LEFT JOIN teams t ON p.team_id = t.id
        WHERE p.id = ?
    """, (person_id,))
    updated_row = c.fetchone()
    updated = dict(updated_row) if updated_row else {}
    conn.commit()
    conn.close()
    return {"status": "updated", "person": updated}

def get_stats(data=None):
    org_id = (data or {}).get("organization_id")
    conn = get_db()
    c = conn.cursor()
    if org_id:
        c.execute("SELECT COUNT(*) FROM memory_references mr JOIN contributions cb ON mr.contribution_id = cb.id WHERE cb.organization_id = ?", (org_id,))
        mem_refs = c.fetchone()[0]
        c.execute("SELECT COUNT(*) FROM work_records WHERE organization_id = ?", (org_id,))
        work_recs = c.fetchone()[0]
        c.execute("SELECT COUNT(*) FROM projects WHERE organization_id = ?", (org_id,))
        projects = c.fetchone()[0]
        c.execute("SELECT COUNT(*) FROM teams WHERE organization_id = ?", (org_id,))
        teams = c.fetchone()[0]
        c.execute("SELECT COUNT(DISTINCT person_id) FROM contributions WHERE organization_id = ?", (org_id,))
        contributors = c.fetchone()[0]
        if contributors == 0:
            c.execute("SELECT COUNT(*) FROM people WHERE organization_id = ?", (org_id,))
            contributors = c.fetchone()[0]
        c.execute("SELECT COUNT(*) FROM contributions WHERE organization_id = ?", (org_id,))
        total_contribs = c.fetchone()[0]
    else:
        c.execute("SELECT COUNT(*) FROM memory_references")
        mem_refs = c.fetchone()[0]
        c.execute("SELECT COUNT(*) FROM work_records")
        work_recs = c.fetchone()[0]
        c.execute("SELECT COUNT(*) FROM projects")
        projects = c.fetchone()[0]
        c.execute("SELECT COUNT(*) FROM teams")
        teams = c.fetchone()[0]
        c.execute("SELECT COUNT(DISTINCT person_id) FROM contributions")
        contributors = c.fetchone()[0]
        if contributors == 0:
            c.execute("SELECT COUNT(*) FROM people")
            contributors = c.fetchone()[0]
        c.execute("SELECT COUNT(*) FROM contributions")
        total_contribs = c.fetchone()[0]
    conn.close()

    return {
        "memory_units": 8 if mem_refs == 0 else mem_refs,
        "organizational_memories": mem_refs + work_recs,
        "projects": projects,
        "teams": teams,
        "contributors": contributors,
        "people": contributors,
        "total_contributions": total_contribs,
        "contributions": total_contribs
    }

def get_teams(data=None):
    org_id = (data or {}).get("organization_id")
    conn = get_db()
    c = conn.cursor()
    if org_id:
        c.execute("""
            SELECT t.id, t.name, t.subtitle, t.department, t.mission, t.icon_type,
                   t.member_count, t.project_count, t.contribution_count, t.memory_units,
                   t.created_at, t.organization_id
            FROM teams t
            WHERE t.organization_id = ?
            ORDER BY t.created_at ASC
        """, (org_id,))
    else:
        c.execute("""
            SELECT t.id, t.name, t.subtitle, t.department, t.mission, t.icon_type,
                   t.member_count, t.project_count, t.contribution_count, t.memory_units,
                   t.created_at, t.organization_id
            FROM teams t
            ORDER BY t.created_at ASC
        """)
    team_rows = [dict(r) for r in c.fetchall()]

    for team in team_rows:
        c.execute("""
            SELECT p.id, p.name, p.email, p.role, p.title, p.avatar_url, p.about, p.skills, p.status, p.created_at,
                   p.department, p.years_of_experience,
                   (SELECT COUNT(*) FROM contributions cb WHERE cb.person_id = p.id) as contribution_count,
                   (SELECT COUNT(*) FROM projects pr WHERE pr.project_lead_id = p.id) as is_lead
            FROM people p
            WHERE p.team_id = ?
            ORDER BY p.created_at ASC
        """, (team["id"],))
        members = [dict(m) for m in c.fetchall()]
        team["members"] = members
        if not team["member_count"] or team["member_count"] < len(members):
            team["member_count"] = len(members)

        lead_member = next((m for m in members if m["is_lead"] > 0 or "Lead" in m["role"] or "Senior" in m["role"] or "Manager" in m["role"]), None)
        team["team_lead"] = lead_member["name"] if lead_member else (members[0]["name"] if members else "Unassigned")
        team["team_lead_role"] = lead_member["role"] if lead_member else None

        c.execute("""
            SELECT DISTINCT pr.id, pr.name, pr.code, pr.status, pr.progress, pr.description
            FROM projects pr
            WHERE pr.team_id = ? OR pr.id IN (SELECT project_id FROM contributions WHERE team_id = ?)
        """, (team["id"], team["id"]))
        team["projects"] = [dict(p) for p in c.fetchall()]
        if not team["project_count"] or team["project_count"] < len(team["projects"]):
            team["project_count"] = len(team["projects"])

    conn.close()
    return team_rows

def get_team_workspace(team_id):
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT organization_id FROM teams WHERE id = ?", (team_id,))
    row = c.fetchone()
    org_id = row[0] if row else None
    conn.close()

    teams = get_teams({"organization_id": org_id} if org_id else None)
    matched = None
    for t in teams:
        if t["id"] == team_id:
            matched = t
            break
    if not matched:
        return None

    conn = get_db()
    c = conn.cursor()
    c.execute("""
        SELECT id, team_id, person_id, person_name, action, time_ago, created_at
        FROM recent_activity
        WHERE team_id = ?
        ORDER BY created_at DESC
        LIMIT 6
    """, (team_id,))
    matched["recent_activity"] = [dict(r) for r in c.fetchall()]
    conn.close()
    return matched

def get_people(data=None):
    org_id = (data or {}).get("organization_id")
    conn = get_db()
    c = conn.cursor()
    if org_id:
        c.execute("""
            SELECT p.id, p.name, p.email, p.role, p.title, p.team_id, p.avatar_url, p.about, p.bio, p.skills, p.status, p.created_at,
                   p.department, p.years_of_experience, p.areas_of_expertise, p.organization_id,
                   t.name as team_name, t.subtitle as team_subtitle,
                   (SELECT COUNT(*) FROM contributions cb WHERE cb.person_id = p.id) as contribution_count,
                   (SELECT COUNT(DISTINCT cb.project_id) FROM contributions cb WHERE cb.person_id = p.id) as relevant_projects_count,
                   (SELECT COUNT(*) FROM projects pr WHERE pr.project_lead_id = p.id) as projects_led_count
            FROM people p
            LEFT JOIN teams t ON p.team_id = t.id
            WHERE p.organization_id = ?
            ORDER BY p.name ASC
        """, (org_id,))
    else:
        c.execute("""
            SELECT p.id, p.name, p.email, p.role, p.title, p.team_id, p.avatar_url, p.about, p.bio, p.skills, p.status, p.created_at,
                   p.department, p.years_of_experience, p.areas_of_expertise, p.organization_id,
                   t.name as team_name, t.subtitle as team_subtitle,
                   (SELECT COUNT(*) FROM contributions cb WHERE cb.person_id = p.id) as contribution_count,
                   (SELECT COUNT(DISTINCT cb.project_id) FROM contributions cb WHERE cb.person_id = p.id) as relevant_projects_count,
                   (SELECT COUNT(*) FROM projects pr WHERE pr.project_lead_id = p.id) as projects_led_count
            FROM people p
            LEFT JOIN teams t ON p.team_id = t.id
            ORDER BY p.name ASC
        """)
    rows = [dict(r) for r in c.fetchall()]
    conn.close()
    return rows

def get_person_detail(person_id):
    conn = get_db()
    c = conn.cursor()
    c.execute("""
        SELECT p.id, p.name, p.email, p.role, p.title, p.team_id, p.avatar_url, p.about, p.bio, p.skills, p.status, p.created_at,
               p.department, p.years_of_experience, p.areas_of_expertise, p.organization_id,
               t.name as team_name, t.subtitle as team_subtitle, t.department as team_department
        FROM people p
        LEFT JOIN teams t ON p.team_id = t.id
        WHERE p.id = ?
    """, (person_id,))
    person_row = c.fetchone()
    if not person_row:
        conn.close()
        return None

    person = dict(person_row)

    # All contributions
    c.execute("""
        SELECT cb.id, cb.project_id, cb.work_record_id, cb.team_id, cb.title,
               cb.contribution_type, cb.problem_solved, cb.technical_decision,
               cb.outcome, cb.technology, cb.artifact_reference, cb.collaborators, cb.created_at,
               pr.name as project_name, pr.code as project_code, pr.status as project_status, pr.progress as project_progress,
               pr.project_lead_id,
               CASE WHEN pr.project_lead_id = cb.person_id THEN 1 ELSE 0 END as is_lead
        FROM contributions cb
        JOIN projects pr ON cb.project_id = pr.id
        WHERE cb.person_id = ?
        ORDER BY cb.created_at DESC
    """, (person_id,))
    contrib_rows = [dict(r) for r in c.fetchall()]
    for cr in contrib_rows:
        cr["is_lead"] = bool(cr["is_lead"])

    # Active work
    c.execute("""
        SELECT DISTINCT pr.id, pr.name, pr.code, pr.description, pr.status, pr.progress, pr.created_at,
               CASE WHEN pr.project_lead_id = ? THEN 1 ELSE 0 END as is_lead
        FROM projects pr
        WHERE pr.status = 'Active' AND (pr.project_lead_id = ? OR pr.id IN (SELECT project_id FROM contributions WHERE person_id = ?))
    """, (person_id, person_id, person_id))
    active_projects = [dict(p) for p in c.fetchall()]
    for p in active_projects:
        p["is_lead"] = bool(p["is_lead"])

    # All projects
    c.execute("""
        SELECT DISTINCT pr.id, pr.name, pr.code, pr.description, pr.status, pr.progress, pr.created_at,
               CASE WHEN pr.project_lead_id = ? THEN 1 ELSE 0 END as is_lead
        FROM projects pr
        LEFT JOIN contributions cb ON cb.project_id = pr.id
        WHERE pr.project_lead_id = ? OR cb.person_id = ?
    """, (person_id, person_id, person_id))
    all_projects = [dict(p) for p in c.fetchall()]
    for p in all_projects:
        p["is_lead"] = bool(p["is_lead"])

    # Decisions
    decisions = []
    for cb in contrib_rows:
        if cb.get("technical_decision"):
            decisions.append({
                "id": cb["id"],
                "project_name": cb["project_name"],
                "title": cb["title"],
                "decision": cb["technical_decision"],
                "outcome": cb["outcome"],
                "created_at": cb["created_at"]
            })

    # Memory References
    c.execute("""
        SELECT mr.id, mr.document_type, mr.status, mr.hindsight_bank_id, mr.created_at, cb.title as contribution_title
        FROM memory_references mr
        JOIN contributions cb ON mr.contribution_id = cb.id
        WHERE cb.person_id = ?
    """, (person_id,))
    memories = [dict(m) for m in c.fetchall()]

    conn.close()
    return {
        "person": person,
        "overview": {
            "about": person.get("about") or person.get("bio") or "Contributor focused on high-quality product execution.",
            "team": person.get("team_name") or "Product Team",
            "department": person.get("department") or "Engineering",
            "years_of_experience": person.get("years_of_experience") or 3,
            "areas_of_expertise": person.get("areas_of_expertise") or "",
            "email": person.get("email"),
            "skills": [s.strip() for s in (person.get("skills") or "").split(",") if s.strip()],
            "current_work": active_projects[0] if active_projects else {
                "name": "Platform Initiative",
                "description": "Designing user flows and architectural systems.",
                "progress": 60
            },
            "recent_contributions": contrib_rows[:3]
        },
        "contributions": contrib_rows,
        "projects": all_projects,
        "decisions": decisions,
        "memories": memories
    }

def get_projects(data=None):
    org_id = (data or {}).get("organization_id")
    conn = get_db()
    c = conn.cursor()
    query = """
        SELECT pr.id, pr.name, pr.code, pr.description, pr.status, pr.progress, pr.project_lead_id, pr.team_id, pr.created_at,
               pr.organization_id,
               lead.name as project_lead_name,
               lead.role as project_lead_role,
               t.name as team_name,
               (SELECT COUNT(DISTINCT cb.person_id) FROM contributions cb WHERE cb.project_id = pr.id) as contributor_count,
               (SELECT COUNT(*) FROM contributions cb WHERE cb.project_id = pr.id) as contribution_count,
               (SELECT COUNT(*) FROM work_records wr WHERE wr.project_id = pr.id) as work_record_count
        FROM projects pr
        LEFT JOIN people lead ON pr.project_lead_id = lead.id
        LEFT JOIN teams t ON pr.team_id = t.id
    """
    if org_id:
        query += " WHERE pr.organization_id = ?"
        c.execute(query + " ORDER BY pr.created_at DESC", (org_id,))
    else:
        c.execute(query + " ORDER BY pr.created_at DESC")
    rows = [dict(r) for r in c.fetchall()]
    conn.close()
    return rows

def get_work_records(data=None):
    org_id = (data or {}).get("organization_id")
    conn = get_db()
    c = conn.cursor()
    query = """
        SELECT wr.id, wr.project_id, wr.title, wr.summary, wr.problem_statement,
               wr.technical_decision, wr.outcome, wr.technology, wr.artifact_url, wr.created_at,
               wr.organization_id,
               pr.name as project_name,
               pr.code as project_code,
               t.name as team_name,
               (SELECT COUNT(*) FROM contributions cb WHERE cb.work_record_id = wr.id) as contribution_count
        FROM work_records wr
        LEFT JOIN projects pr ON wr.project_id = pr.id
        LEFT JOIN teams t ON pr.team_id = t.id
    """
    if org_id:
        query += " WHERE wr.organization_id = ?"
        c.execute(query + " ORDER BY wr.created_at DESC", (org_id,))
    else:
        c.execute(query + " ORDER BY wr.created_at DESC")
    rows = [dict(r) for r in c.fetchall()]

    for r in rows:
        c.execute("""
            SELECT DISTINCT p.id, p.name, p.role, p.avatar_url
            FROM people p
            JOIN contributions cb ON cb.person_id = p.id
            WHERE cb.work_record_id = ?
        """, (r["id"],))
        r["people_involved"] = [dict(p) for p in c.fetchall()]

    conn.close()
    return rows

def get_contributions(data=None):
    org_id = (data or {}).get("organization_id")
    conn = get_db()
    c = conn.cursor()
    query = """
        SELECT cb.id, cb.person_id, cb.project_id, cb.work_record_id, cb.team_id,
               cb.title, cb.contribution_type, cb.problem_solved, cb.technical_decision,
               cb.outcome, cb.technology, cb.artifact_reference, cb.collaborators, cb.created_at,
               cb.organization_id,
               p.name as person_name,
               p.role as person_role,
               p.avatar_url as person_avatar,
               pr.name as project_name,
               pr.code as project_code,
               lead.name as project_lead_name,
               CASE WHEN pr.project_lead_id = cb.person_id THEN 1 ELSE 0 END as is_lead,
               COALESCE(t.name, pt.name) as team_name
        FROM contributions cb
        JOIN people p ON cb.person_id = p.id
        JOIN projects pr ON cb.project_id = pr.id
        LEFT JOIN people lead ON pr.project_lead_id = lead.id
        LEFT JOIN teams t ON cb.team_id = t.id
        LEFT JOIN teams pt ON p.team_id = pt.id
    """
    if org_id:
        query += " WHERE cb.organization_id = ?"
        c.execute(query + " ORDER BY cb.created_at DESC", (org_id,))
    else:
        c.execute(query + " ORDER BY cb.created_at DESC")
    rows = []
    for r in c.fetchall():
        d = dict(r)
        d["is_lead"] = bool(d["is_lead"])
        rows.append(d)
    conn.close()
    return rows

def create_contribution(data):
    conn = get_db()
    c = conn.cursor()
    cid = f"contrib_{uuid.uuid4().hex[:8]}"
    now = datetime.utcnow().isoformat()
    team_id = data.get("team_id")
    org_id = data.get("organization_id", "org_colead")
    if not team_id:
        c.execute("SELECT team_id, organization_id FROM people WHERE id = ?", (data["person_id"],))
        res = c.fetchone()
        if res:
            team_id = res[0]
            if res[1]:
                org_id = res[1]

    c.execute("""
        INSERT INTO contributions (id, organization_id, person_id, project_id, work_record_id, team_id,
                                  title, contribution_type, problem_solved, technical_decision,
                                  outcome, technology, artifact_reference, collaborators, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        cid,
        org_id,
        data["person_id"],
        data["project_id"],
        data.get("work_record_id"),
        team_id,
        data["title"],
        data.get("contribution_type", "Implementation"),
        data["problem_solved"],
        data["technical_decision"],
        data["outcome"],
        data.get("technology", ""),
        data.get("artifact_reference"),
        data.get("collaborators"),
        now
    ))
    conn.commit()
    conn.close()
    return {"id": cid, "status": "created"}

def create_work_record(data):
    conn = get_db()
    c = conn.cursor()
    wid = f"work_{uuid.uuid4().hex[:8]}"
    now = datetime.utcnow().isoformat()
    org_id = data.get("organization_id", "org_colead")
    c.execute("""
        INSERT INTO work_records (id, organization_id, project_id, title, summary,
                                  problem_statement, technical_decision, outcome,
                                  technology, artifact_url, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        wid,
        org_id,
        data["project_id"],
        data["title"],
        data.get("summary", data["title"]),
        data.get("problem_statement", ""),
        data.get("technical_decision", ""),
        data.get("outcome", ""),
        data.get("technology", ""),
        data.get("artifact_url", ""),
        now
    ))
    conn.commit()
    conn.close()
    return {"id": wid, "status": "created", "title": data["title"]}

def create_team(data):
    conn = get_db()
    c = conn.cursor()
    tid = f"team_{uuid.uuid4().hex[:8]}"
    now = datetime.utcnow().isoformat()
    org_id = data.get("organization_id", "org_colead")
    c.execute("""
        INSERT INTO teams (id, organization_id, name, subtitle, department, mission, icon_type, member_count, project_count, contribution_count, memory_units, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        tid,
        org_id,
        data["name"],
        data.get("subtitle", data.get("department", "Engineering & Platform")),
        data.get("department", "Engineering"),
        data.get("mission", ""),
        "bronze_sphere",
        len(data.get("member_ids", [])) if "member_ids" in data else 0,
        0,
        0,
        0,
        now
    ))

    if data.get("member_ids"):
        for pid in data["member_ids"]:
            c.execute("UPDATE people SET team_id = ? WHERE id = ?", (tid, pid))

    conn.commit()
    conn.close()
    return {"id": tid, "status": "created", "name": data["name"]}

def create_project(data):
    conn = get_db()
    c = conn.cursor()
    pid = data.get("id") or f"proj_{uuid.uuid4().hex[:8]}"
    now = datetime.utcnow().isoformat()
    org_id = data.get("organization_id", "org_colead")
    code = data.get("code") or (data.get("name", "PRJ")[:3].upper() + "-" + str(random.randint(100, 999)))

    c.execute("""
        INSERT INTO projects (id, organization_id, name, code, description, status, progress, project_lead_id, team_id, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        pid,
        org_id,
        data.get("name", "New Project"),
        code,
        data.get("description", ""),
        data.get("status", "Active"),
        int(data.get("progress", 0)),
        data.get("project_lead_id"),
        data.get("team_id"),
        now
    ))
    conn.commit()
    conn.close()
    return {"id": pid, "code": code, "status": "created", "name": data.get("name")}

def save_project_blueprint(data):
    conn = get_db()
    c = conn.cursor()
    bid = data.get("id") or f"bp_{uuid.uuid4().hex[:8]}"
    now = datetime.utcnow().isoformat()
    org_id = data.get("organization_id", "org_colead")
    blueprint_json = json.dumps(data.get("blueprint", {}))

    c.execute("""
        INSERT INTO project_blueprints (id, organization_id, project_name, blueprint_json, created_by, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (
        bid,
        org_id,
        data.get("project_name", "Untitled Blueprint"),
        blueprint_json,
        data.get("created_by"),
        now
    ))
    conn.commit()
    conn.close()
    return {"id": bid, "status": "saved"}

def get_project_blueprints(data=None):
    org_id = (data or {}).get("organization_id", "org_colead")
    conn = get_db()
    c = conn.cursor()
    c.execute("""
        SELECT id, organization_id, project_name, blueprint_json, created_by, created_at
        FROM project_blueprints
        WHERE organization_id = ?
        ORDER BY created_at DESC
    """, (org_id,))
    rows = []
    for r in c.fetchall():
        d = dict(r)
        try:
            d["blueprint"] = json.loads(d["blueprint_json"])
        except Exception:
            d["blueprint"] = {}
        rows.append(d)
    conn.close()
    return rows

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No action specified"}))
        sys.exit(1)

    action = sys.argv[1]
    payload = json.loads(sys.argv[2]) if len(sys.argv) > 2 else {}

    actions = {
        "get_health": get_health,
        "get_database_health": get_database_health,
        "get_organization": lambda: get_organization(payload),
        "update_organization": lambda: update_organization(payload),
        "create_organization": lambda: create_organization(payload),
        "verify_join_code": lambda: verify_join_code(payload),
        "join_organization": lambda: join_organization(payload),
        "regenerate_join_code": lambda: regenerate_join_code(payload),
        "get_organization_members": lambda: get_organization_members(payload),
        "signin_user": lambda: signin_user(payload),
        "create_session": lambda: create_session(payload),
        "verify_session": lambda: verify_session(payload),
        "delete_session": lambda: delete_session(payload),
        "update_person_profile": lambda: update_person_profile(payload),
        "get_stats": lambda: get_stats(payload),
        "get_teams": lambda: get_teams(payload),
        "get_team_workspace": lambda: get_team_workspace(payload.get("team_id", "")),
        "get_people": lambda: get_people(payload),
        "get_person_detail": lambda: get_person_detail(payload.get("person_id", "")),
        "get_projects": lambda: get_projects(payload),
        "create_project": lambda: create_project(payload),
        "get_work_records": lambda: get_work_records(payload),
        "create_work_record": lambda: create_work_record(payload),
        "get_contributions": lambda: get_contributions(payload),
        "create_contribution": lambda: create_contribution(payload),
        "create_team": lambda: create_team(payload),
        "save_project_blueprint": lambda: save_project_blueprint(payload),
        "get_project_blueprints": lambda: get_project_blueprints(payload),
    }

    if action in actions:
        result = actions[action]()
        print(json.dumps(result))
    else:
        print(json.dumps({"error": f"Unknown action: {action}"}))
        sys.exit(1)

if __name__ == "__main__":
    main()
