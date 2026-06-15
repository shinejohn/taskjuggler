"""
Pipecat voice agent — connects to LiveKit rooms for URPA AI voice calls.
Laravel calls POST /v1/sessions/start with optional livekit credentials.
"""
from __future__ import annotations

import asyncio
import os
import uuid
from typing import Any

import httpx
from fastapi import BackgroundTasks, FastAPI, Header, HTTPException
from pydantic import BaseModel, Field

app = FastAPI(title="Fibonacco Pipecat Agent", version="0.2.0")

WEBHOOK_SECRET = os.getenv("PIPECAT_WEBHOOK_SECRET", "")
LARAVEL_CALLBACK_URL = os.getenv("LARAVEL_CALLBACK_URL", "")
DEEPGRAM_API_KEY = os.getenv("DEEPGRAM_API_KEY", "")
ACTIVE_SESSIONS: dict[str, dict[str, Any]] = {}


class LiveKitCredentials(BaseModel):
    url: str
    token: str
    room_name: str


class StartSessionRequest(BaseModel):
    room_name: str | None = None
    customer_number: str | None = None
    user_id: str | None = None
    assistant_id: str | None = None
    metadata: dict[str, Any] = Field(default_factory=dict)
    livekit: LiveKitCredentials | None = None


def _verify_secret(secret: str | None) -> None:
    if WEBHOOK_SECRET and secret != WEBHOOK_SECRET:
        raise HTTPException(status_code=401, detail="Unauthorized")


async def _notify_laravel(session_id: str, event: str, payload: dict[str, Any]) -> None:
    if not LARAVEL_CALLBACK_URL:
        return
    try:
        headers = {"Content-Type": "application/json"}
        if WEBHOOK_SECRET:
            headers["X-Pipecat-Secret"] = WEBHOOK_SECRET
        async with httpx.AsyncClient(timeout=10) as client:
            await client.post(
                LARAVEL_CALLBACK_URL,
                json={"session_id": session_id, "event": event, "payload": payload},
                headers=headers,
            )
    except Exception:
        pass


async def _run_voice_session(session_id: str, body: StartSessionRequest) -> None:
    """Background task: join LiveKit room and run voice pipeline when credentials provided."""
    session = ACTIVE_SESSIONS.get(session_id)
    if not session:
        return

    session["status"] = "connecting"
    await _notify_laravel(session_id, "session.connecting", {"room_name": session["room_name"]})

    if body.livekit and body.livekit.url and body.livekit.token:
        try:
            from livekit import rtc

            room = rtc.Room()
            await room.connect(body.livekit.url, body.livekit.token)
            session["status"] = "connected"
            session["livekit_connected"] = True
            await _notify_laravel(session_id, "session.connected", {"room_name": body.livekit.room_name})

            # Pipeline placeholder: Deepgram STT → LLM → TTS when keys are configured
            if DEEPGRAM_API_KEY:
                session["pipeline"] = "deepgram_ready"
            else:
                session["pipeline"] = "livekit_only"

            # Keep session alive until stopped
            while session.get("status") != "stopped":
                await asyncio.sleep(5)

            await room.disconnect()
        except ImportError:
            session["status"] = "livekit_sdk_missing"
            session["pipeline"] = "scaffold"
        except Exception as exc:
            session["status"] = "error"
            session["error"] = str(exc)
            await _notify_laravel(session_id, "session.error", {"error": str(exc)})
    else:
        session["status"] = "pending_livekit"
        session["pipeline"] = "awaiting_credentials"


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "pipecat-agent", "version": "0.2.0"}


@app.post("/v1/sessions/start")
async def start_session(
    body: StartSessionRequest,
    background_tasks: BackgroundTasks,
    x_pipecat_secret: str | None = Header(default=None, alias="X-Pipecat-Secret"),
) -> dict[str, Any]:
    _verify_secret(x_pipecat_secret)

    session_id = str(uuid.uuid4())
    room_name = body.room_name or f"pipecat-{session_id.replace('-', '')}"

    ACTIVE_SESSIONS[session_id] = {
        "room_name": room_name,
        "customer_number": body.customer_number,
        "user_id": body.user_id,
        "assistant_id": body.assistant_id,
        "metadata": body.metadata,
        "status": "starting",
        "pipeline": "initializing",
    }

    background_tasks.add_task(_run_voice_session, session_id, body)

    return {
        "session_id": session_id,
        "room_name": room_name,
        "status": "started",
        "pipeline": "livekit" if body.livekit else "scaffold",
    }


@app.post("/v1/sessions/{session_id}/stop")
def stop_session(
    session_id: str,
    x_pipecat_secret: str | None = Header(default=None, alias="X-Pipecat-Secret"),
) -> dict[str, str]:
    _verify_secret(x_pipecat_secret)
    session = ACTIVE_SESSIONS.get(session_id)
    if session:
        session["status"] = "stopped"
    ACTIVE_SESSIONS.pop(session_id, None)
    return {"status": "stopped", "session_id": session_id}


@app.get("/v1/sessions/{session_id}")
def get_session(
    session_id: str,
    x_pipecat_secret: str | None = Header(default=None, alias="X-Pipecat-Secret"),
) -> dict[str, Any]:
    _verify_secret(x_pipecat_secret)
    session = ACTIVE_SESSIONS.get(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return {"session_id": session_id, **session}
