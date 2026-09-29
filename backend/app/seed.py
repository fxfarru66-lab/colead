import uuid
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.models import Team, Person, Project, WorkRecord, Contribution, MemoryReference

def seed_database(db: Session):
    """
    Seeds initial foundational records demonstrating the core principle:
    'Ownership is not the same as contribution.'
    """
    if db.query(Project).first():
        # Already seeded
        return

    # 1. Teams
    core_infra = Team(
        id="team_infra",
        name="Core Infrastructure",
        department="Engineering",
        mission="Build resilient, distributed backend primitives and foundational services."
    )
    payments_team = Team(
        id="team_payments",
        name="Commerce & Payments",
        department="Product Engineering",
        mission="Empower frictionless global transactions, billing, and settlement."
    )
    design_systems = Team(
        id="team_design",
        name="Product Design",
        department="User Experience",
        mission="Deliver intuitive, accessible enterprise interfaces."
    )
    db.add_all([core_infra, payments_team, design_systems])
    db.commit()

    # 2. People
    elena = Person(
        id="person_elena",
        name="Elena Vance",
        email="elena.vance@company.internal",
        role="Senior Engineer",
        title="Staff Software Architect",
        team_id=core_infra.id
    )
    marcus = Person(
        id="person_marcus",
        name="Marcus Chen",
        email="marcus.chen@company.internal",
        role="Junior Engineer",
        title="Software Engineer I",
        team_id=payments_team.id
    )
    aisha = Person(
        id="person_aisha",
        name="Aisha Patel",
        email="aisha.patel@company.internal",
        role="Engineer",
        title="Software Engineer II",
        team_id=payments_team.id
    )
    sofia = Person(
        id="person_sofia",
        name="Sofia Morales",
        email="sofia.morales@company.internal",
        role="Product Designer",
        title="Senior UX Designer",
        team_id=design_systems.id
    )
    david = Person(
        id="person_david",
        name="David Ross",
        email="david.ross@company.internal",
        role="Security Engineer",
        title="Senior Security Architect",
        team_id=core_infra.id
    )
    db.add_all([elena, marcus, aisha, sofia, david])
    db.commit()

    # 3. Projects
    # Notice: Elena is the Project Lead, but Marcus, Aisha, Elena, and Sofia all contribute!
    payment_platform = Project(
        id="proj_payment_plat",
        name="Payment Platform",
        code="PAY-PLAT",
        description="Next-generation multi-processor payment routing, webhook idempotency, and automated ledger reconciliation.",
        status="Completed",
        project_lead_id=elena.id,
        created_at=datetime.utcnow() - timedelta(days=90)
    )
    identity_v2 = Project(
        id="proj_auth_v2",
        name="Identity & Access 2.0",
        code="AUTH-V2",
        description="Centralized OAuth 2.0 PKCE authentication layer and granular role-based policy federation.",
        status="Active",
        project_lead_id=david.id,
        created_at=datetime.utcnow() - timedelta(days=45)
    )
    db.add_all([payment_platform, identity_v2])
    db.commit()

    # 4. Work Records (Key Milestones)
    wr_webhook = WorkRecord(
        id="work_webhook_idemp",
        project_id=payment_platform.id,
        title="Webhook Reliability & Distributed Idempotency",
        summary="Engineered zero-loss webhook ingestion pipeline handling bursty payment gateway retries.",
        problem_statement="Network dropouts and downstream latency spikes caused duplicate webhook deliveries, risking dual balance decrements.",
        technical_decision="Adopted Redis distributed lock + SQLite atomic state transition with cryptographic payload hashing before invocation.",
        outcome="Processed 1.4M transactions over peak season with 0 duplicate ledger updates and sub-40ms handler latency.",
        artifact_url="https://github.com/internal/payments/pull/1428",
        created_at=datetime.utcnow() - timedelta(days=70)
    )
    wr_checkout = WorkRecord(
        id="work_checkout_flow",
        project_id=payment_platform.id,
        title="Resilient Multi-Currency Checkout Experience",
        summary="Redesigned the frontend checkout modal to handle asynchronous 3D Secure challenges gracefully.",
        problem_statement="Customers were confused by slow bank iframe handoffs, resulting in a 28% drop-off during fraud challenge steps.",
        technical_decision="Engineered optimistic UI polling with localized fallback instructions and transparent status states.",
        outcome="Drop-off decreased by 34% across European and APAC payment methods.",
        artifact_url="https://figma.com/@company/checkout-system-v2",
        created_at=datetime.utcnow() - timedelta(days=60)
    )
    db.add_all([wr_webhook, wr_checkout])
    db.commit()

    # 5. Distinct Contributions
    # Notice: Each person's distinct technical and design contribution is preserved.
    # Junior Engineer Marcus implemented the critical payment webhook service.
    # Aisha solved the race conditions.
    # Elena provided the architecture.
    # Sofia built the checkout UX.
    c1 = Contribution(
        id="contrib_webhook_svc",
        person_id=marcus.id,
        project_id=payment_platform.id,
        work_record_id=wr_webhook.id,
        team_id=payments_team.id,
        title="Implemented Payment Webhook Ingestion Service",
        contribution_type="Implementation",
        problem_solved="Third-party payment gateways (Stripe/Adyen) sent out-of-order retries that overloaded worker queues.",
        technical_decision="Built an asynchronous queue worker with exponential backoff jitter and SHA-256 payload deduplication.",
        outcome="Eliminated webhook dropouts; scaled to 800 events/sec with zero queue stalling.",
        artifact_reference="PR #1428 (pkg/webhooks/ingest.go)",
        collaborators="Aisha Patel (code review), Elena Vance (architecture guidance)",
        created_at=datetime.utcnow() - timedelta(days=68)
    )
    c2 = Contribution(
        id="contrib_oauth_race",
        person_id=aisha.id,
        project_id=payment_platform.id,
        work_record_id=wr_webhook.id,
        team_id=payments_team.id,
        title="Solved OAuth Token Refresh Race Condition in Multi-Tab Sessions",
        contribution_type="Debugging & Reliability",
        problem_solved="Multiple concurrent browser tabs attempted simultaneous token rotation, causing invalid grant errors and kicking users out.",
        technical_decision="Implemented Web Locks API mutex coordinating single-flight token refresh across browser tabs.",
        outcome="Reduced authentication eviction errors from 4.2% to under 0.01% across 120,000 active sessions.",
        artifact_reference="PR #1440 (src/auth/token-broker.ts)",
        collaborators="David Ross (security validation)",
        created_at=datetime.utcnow() - timedelta(days=65)
    )
    c3 = Contribution(
        id="contrib_lead_arch",
        person_id=elena.id,
        project_id=payment_platform.id,
        work_record_id=wr_webhook.id,
        team_id=core_infra.id,
        title="Architected Multi-Region Distributed Payment Schema & Failover",
        contribution_type="Architecture",
        problem_solved="Single-region database outage risked halting payment capture operations during cloud provider incidents.",
        technical_decision="Designed dual-write transactional ledger with eventual consistency replication and deterministic conflict resolution.",
        outcome="Survives single-datacenter outages with automatic 1.8-second warm failover and zero data divergence.",
        artifact_reference="RFC-104: Multi-Region Payment Ledger Topology",
        collaborators="Marcus Chen, David Ross",
        created_at=datetime.utcnow() - timedelta(days=80)
    )
    c4 = Contribution(
        id="contrib_checkout_ux",
        person_id=sofia.id,
        project_id=payment_platform.id,
        work_record_id=wr_checkout.id,
        team_id=design_systems.id,
        title="Designed Checkout UX & Progressive Error Guidance",
        contribution_type="UX Design",
        problem_solved="Cryptic bank decline error messages ('Error 4022') confused users, prompting repetitive failed card attempts.",
        technical_decision="Mapped 42 bank error codes to actionable plain-language remediation steps directly in the modal viewport.",
        outcome="Reduced failed re-attempt churn by 41% and improved user customer-satisfaction score from 3.2 to 4.8.",
        artifact_reference="Figma: Components/Checkout/ErrorGuidance/v2",
        collaborators="Elena Vance (API error taxonomy mapping)",
        created_at=datetime.utcnow() - timedelta(days=58)
    )
    db.add_all([c1, c2, c3, c4])
    db.commit()

    # 6. Memory References (Connecting to Hindsight Cloud retain targets)
    mr1 = MemoryReference(
        id="mem_ref_1428",
        contribution_id=c1.id,
        work_record_id=wr_webhook.id,
        hindsight_memory_id="pending_hindsight_mem_001",
        hindsight_bank_id="bank_memorygrid_org",
        document_type="contribution_evidence",
        status="pending_retain",
        metadata_json='{"tags": ["payments", "webhooks", "idempotency"], "author": "Marcus Chen"}'
    )
    mr2 = MemoryReference(
        id="mem_ref_1440",
        contribution_id=c2.id,
        work_record_id=wr_webhook.id,
        hindsight_memory_id="pending_hindsight_mem_002",
        hindsight_bank_id="bank_memorygrid_org",
        document_type="contribution_evidence",
        status="pending_retain",
        metadata_json='{"tags": ["oauth", "race-condition", "security"], "author": "Aisha Patel"}'
    )
    db.add_all([mr1, mr2])
    db.commit()
