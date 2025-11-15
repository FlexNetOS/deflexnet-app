from __future__ import annotations

import os
from contextlib import asynccontextmanager
from functools import lru_cache
from pathlib import Path
from typing import Any

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

PACK_ROOT = Path(os.getenv("CONSTITUTIONAL_PACK", "/constitutional_pack"))
VLLM_API_BASE = os.getenv("VLLM_API_BASE", "http://vllm:8000")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Validate the constitutional pack is present when the service boots."""
    if not PACK_ROOT.exists():
        raise RuntimeError(f"constitutional pack not found at {PACK_ROOT}")
    load_constitutional_pack()
    yield


app = FastAPI(title="DeflexNet Gateway", lifespan=lifespan)

# CORS is configured to allow all origins without credentials for local development.
# This is intentional for the current use case; if credentials become necessary in the
# future, specific origins should be configured instead of using wildcard.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"]
)


class CourtPlan(BaseModel):
    """Minimal payload accepted by the court trifecta endpoint."""

    case: str | None = None
    evidence: list[str] | None = None
    verdict: str | None = None
    metadata: dict[str, Any] | None = None


def _read_section(section: str) -> dict[str, str]:
    section_dir = PACK_ROOT / section
    doc = section_dir / "README.md"
    if doc.exists():
        return {
            "name": section,
            "content": doc.read_text(encoding="utf-8")
        }
    return {"name": section, "content": ""}


@lru_cache(maxsize=1)
def load_constitutional_pack() -> dict[str, Any]:
    """Load and cache the constitutional pack. Cache persists until service restart.
    
    Note: If pack files are updated at runtime, the service must be restarted for
    changes to take effect due to LRU caching.
    """
    if not PACK_ROOT.exists():
        raise FileNotFoundError(f"constitutional pack not found at {PACK_ROOT}")

    sections = ["Scripture", "Geometry", "Law"]
    payload = {
        "root": str(PACK_ROOT),
        "sections": [_read_section(section) for section in sections],
    }
    return payload


@app.get("/healthz")
async def healthz() -> dict[str, Any]:
    pack = load_constitutional_pack()
    return {
        "status": "ok",
        "pack_sections": [section["name"] for section in pack["sections"]],
        "vllm_api_base": VLLM_API_BASE,
    }


@app.post("/court/trifecta")
async def court_trifecta(payload: CourtPlan) -> dict[str, Any]:
    pack = load_constitutional_pack()

    verdict = "PASS"
    conditions: list[str] = []

    if payload.verdict and payload.verdict.upper() != "PASS":
        verdict = "PASS_WITH_CONDITIONS"
        conditions.append("Existing verdict is not PASS, carrying forward as a condition.")

    summary = {
        "case": payload.case,
        "evidence_items": len(payload.evidence or []),
    }

    return {
        "result": verdict,
        "conditions": conditions,
        "pack": pack,
        "summary": summary,
        "payload": payload.model_dump(),
    }


# WARNING: The 'path' parameter is not validated or sanitized.
# If this endpoint is expanded to perform file or database operations using 'path',
# proper validation/sanitization must be implemented to prevent path traversal or injection vulnerabilities.
@app.get("/agent/{path:path}")
async def agent_stub(path: str) -> dict[str, str]:
    return {"path": path, "status": "stub"}


# WARNING: The 'path' parameter is not validated or sanitized.
# If this endpoint is expanded to perform file or database operations using 'path',
# proper validation/sanitization must be implemented to prevent path traversal or injection vulnerabilities.
@app.get("/tools/{path:path}")
async def tools_stub(path: str) -> dict[str, str]:
    return {"path": path, "status": "stub"}

