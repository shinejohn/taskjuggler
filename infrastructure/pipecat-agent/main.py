"""
Pipecat voice agent — Phase 4 comms modernization scaffold.
Run on Railway as pipecat-agent service. Laravel calls POST /v1/sessions/start.
"""
from __future__ import annotations

import os
import uuid
from typing import Any

from fastapi import FastAPI, Header, HTTPException
from pydantic import BaseModel, Field

app = FastAPI(title="Fibonacco Pipecat Agent", version="0.1.0")

WEBHOOK_SECRET = os.getenv("PIPECAT_WEBHOOK_SECRET", "")
ACTIVE_SESSIONS: dict[str, dict[str, Any]] = {}


class StartSessionRequest(BaseModel):
    room_name: str | None = None
    customer_number: str | None = None
    user_id: str | None = None
    assistant_id: str | None = None
    metadata: dict[str, Any] = Field(default_factory=dict)


def _verify_secret(secret: str | None) -> None:
    if WEBHOOK_SECRET and secret != WEBHOOK_SECRET:
        raise HTTPException(status_code=401, detail="Unauthorized")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "pipecat-agent"}


@app.post("/v1/sessions/start")
def start_session(
    body: StartSessionRequest,
    x_pipecat_secret: str | None = Header(default=None, alias="X-Pipecat-Secret"),
) -> dict[str, Any]:
    _verify_secret(x_pipecat_secret)

    session_id = str(uuid.uuid4())
    room_name = body.room_name or f"pipecat-{session_id.replace('-', '')}"

    # TODO: spawn Pipecat pipeline (Deepgram STT → LLM → ElevenLabs TTS → LiveKit transport)
    ACTIVE_SESSIONS[session_id] = {
        "room_name": room_name,
        "customer_number": body.customer_number,
        "user_id": body.user_id,
        "assistant_id": body.assistant_id,
        "metadata": body.metadata,
        "status": "pending_pipeline",
    }

    return {
        "session_id": session_id,
        "room_name": room_name,
        "status": "started",
        "pipeline": "scaffold",
    }


@app.post("/v1/sessions/{session_id}/stop")
def stop_session(
    session_id: str,
    x_pipecat_secret: str | None = Header(default=None, alias="X-Pipecat-Secret"),
) -> dict[str, str]:
    _verify_secret(x_pipecat_secret)
    ACTIVE_SESSIONS.pop(session_id, None)
    return {"status": "stopped", "session_id": session_id}
