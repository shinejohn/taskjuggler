"""
Pipecat voice agent — Twilio Media Streams + optional LiveKit rooms.
Laravel calls POST /v1/sessions/start; Twilio connects via WebSocket /ws/twilio.
"""
from __future__ import annotations

import asyncio
import os
import uuid
from typing import Any

import httpx
from fastapi import BackgroundTasks, FastAPI, Header, HTTPException, WebSocket
from loguru import logger
from pydantic import BaseModel, Field

from voice_bot import run_voice_bot

app = FastAPI(title="Fibonacco Pipecat Agent", version="1.0.0")

WEBHOOK_SECRET = os.getenv("PIPECAT_WEBHOOK_SECRET", "")
LARAVEL_CALLBACK_URL = os.getenv("LARAVEL_CALLBACK_URL", "")
DEFAULT_SYSTEM_PROMPT = (
    "You are URPA, a concise AI phone assistant. "
    "Keep responses under 2 sentences. Greet callers warmly and offer to help."
)

ACTIVE_SESSIONS: dict[str, dict[str, Any]] = {}
SESSIONS_BY_ROOM: dict[str, str] = {}


class LiveKitCredentials(BaseModel):
    url: str
    token: str
    room_name: str


class StartSessionRequest(BaseModel):
    room_name: str | None = None
    customer_number: str | None = None
    user_id: str | None = None
    assistant_id: str | None = None
    system_prompt: str | None = None
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
    except Exception as exc:
        logger.warning(f"Laravel callback failed for {session_id}/{event}: {exc}")


async def _on_turn(session_id: str, role: str, text: str) -> None:
    session = ACTIVE_SESSIONS.get(session_id)
    if session is not None:
        session.setdefault("turns", []).append({"role": role, "text": text})
    await _notify_laravel(session_id, "transcript.turn", {"role": role, "text": text})


async def _on_lifecycle(session_id: str, data: dict[str, Any]) -> None:
    event = data.get("event", "session.update")
    payload = {key: value for key, value in data.items() if key != "event"}
    session = ACTIVE_SESSIONS.get(session_id)
    if session is not None:
        session["status"] = event.replace("session.", "")
        if "transcript" in payload:
            session["transcript"] = payload["transcript"]
    await _notify_laravel(session_id, event, payload)


def _system_prompt(session: dict[str, Any]) -> str:
    prompt = session.get("system_prompt")
    return prompt if isinstance(prompt, str) and prompt.strip() else DEFAULT_SYSTEM_PROMPT


def _cleanup_session(session_id: str) -> None:
    session = ACTIVE_SESSIONS.pop(session_id, None)
    if session:
        room_name = session.get("room_name")
        if isinstance(room_name, str):
            SESSIONS_BY_ROOM.pop(room_name, None)


async def _create_telephony_transport(
    websocket: WebSocket,
    transport_type: str,
    call_data: dict[str, Any],
):
    from pipecat.serializers.twilio import TwilioFrameSerializer
    from pipecat.transports.websocket.fastapi import (
        FastAPIWebsocketParams,
        FastAPIWebsocketTransport,
    )

    params = FastAPIWebsocketParams(
        audio_in_enabled=True,
        audio_out_enabled=True,
        add_wav_header=False,
    )

    if transport_type == "twilio":
        params.serializer = TwilioFrameSerializer(
            stream_sid=call_data["stream_id"],
            call_sid=call_data["call_id"],
            account_sid=os.getenv("TWILIO_ACCOUNT_SID", ""),
            auth_token=os.getenv("TWILIO_AUTH_TOKEN", ""),
        )
    else:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported telephony provider: {transport_type}",
        )

    return FastAPIWebsocketTransport(websocket=websocket, params=params)


async def _run_livekit_session(session_id: str) -> None:
    session = ACTIVE_SESSIONS.get(session_id)
    if not session:
        return

    livekit = session.get("livekit")
    if not isinstance(livekit, dict):
        return

    from pipecat.transports.livekit.transport import LiveKitParams, LiveKitTransport

    transport = LiveKitTransport(
        url=livekit["url"],
        token=livekit["token"],
        room_name=livekit["room_name"],
        params=LiveKitParams(audio_in_enabled=True, audio_out_enabled=True),
    )

    try:
        await run_voice_bot(
            transport,
            session_id=session_id,
            system_prompt=_system_prompt(session),
            on_lifecycle=_on_lifecycle,
            on_turn=_on_turn,
        )
    except Exception as exc:
        logger.exception(f"LiveKit session failed: {session_id}")
        await _notify_laravel(session_id, "session.error", {"error": str(exc)})
    finally:
        _cleanup_session(session_id)


async def _run_twilio_session(
    websocket: WebSocket,
    session_id: str,
    transport_type: str,
    call_data: dict[str, Any],
) -> None:
    session = ACTIVE_SESSIONS.get(session_id)
    if not session:
        logger.error(f"Twilio stream for unknown session: {session_id}")
        return

    transport = await _create_telephony_transport(websocket, transport_type, call_data)

    try:
        await run_voice_bot(
            transport,
            session_id=session_id,
            system_prompt=_system_prompt(session),
            on_lifecycle=_on_lifecycle,
            on_turn=_on_turn,
        )
    except Exception as exc:
        logger.exception(f"Twilio session failed: {session_id}")
        await _notify_laravel(session_id, "session.error", {"error": str(exc)})
    finally:
        _cleanup_session(session_id)


def _resolve_session_id(body: dict[str, Any]) -> str | None:
    session_id = body.get("session_id")
    if isinstance(session_id, str) and session_id in ACTIVE_SESSIONS:
        return session_id

    room_name = body.get("room_name")
    if isinstance(room_name, str):
        return SESSIONS_BY_ROOM.get(room_name)

    return None


@app.get("/health")
def health() -> dict[str, str]:
    has_pipeline = bool(
        os.getenv("DEEPGRAM_API_KEY")
        and os.getenv("OPENAI_API_KEY")
        and os.getenv("ELEVENLABS_API_KEY")
    )
    return {
        "status": "ok",
        "service": "pipecat-agent",
        "version": "1.0.0",
        "pipeline": "pipecat-ai" if has_pipeline else "missing_api_keys",
    }


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
        "system_prompt": body.system_prompt,
        "metadata": body.metadata,
        "livekit": body.livekit.model_dump() if body.livekit else None,
        "status": "starting",
        "turns": [],
    }
    SESSIONS_BY_ROOM[room_name] = session_id

    await _notify_laravel(session_id, "session.connecting", {"room_name": room_name})

    # Inbound Twilio calls run the pipeline when the media stream connects.
    # LiveKit sessions start immediately when credentials are provided.
    direction = body.metadata.get("direction")
    if body.livekit and direction != "inbound":
        background_tasks.add_task(_run_livekit_session, session_id)

    return {
        "session_id": session_id,
        "room_name": room_name,
        "status": "started",
        "pipeline": "pipecat-ai",
    }


@app.post("/v1/sessions/{session_id}/stop")
async def stop_session(
    session_id: str,
    x_pipecat_secret: str | None = Header(default=None, alias="X-Pipecat-Secret"),
) -> dict[str, str]:
    _verify_secret(x_pipecat_secret)
    _cleanup_session(session_id)
    await _notify_laravel(session_id, "session.ended", {"reason": "stopped"})
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


@app.websocket("/ws/twilio")
async def twilio_media_stream(websocket: WebSocket) -> None:
    """Twilio Media Streams — pipecat-ai pipeline with audio returned to caller."""
    await websocket.accept()

    from pipecat.runner.utils import parse_telephony_websocket

    transport_type, call_data = await parse_telephony_websocket(websocket)
    body = call_data.get("body", {})
    session_id = _resolve_session_id(body if isinstance(body, dict) else {})

    if not session_id:
        logger.error(f"No active session for Twilio stream: {body}")
        return

    await _run_twilio_session(websocket, session_id, transport_type, call_data)


@app.websocket("/ws/twilio/{room_name}")
async def twilio_media_stream_legacy(websocket: WebSocket, room_name: str) -> None:
    """Legacy path-based Twilio endpoint — resolves session by room name."""
    await websocket.accept()

    from pipecat.runner.utils import parse_telephony_websocket

    transport_type, call_data = await parse_telephony_websocket(websocket)
    session_id = SESSIONS_BY_ROOM.get(room_name)

    if not session_id:
        logger.error(f"No active session for room: {room_name}")
        return

    await _run_twilio_session(websocket, session_id, transport_type, call_data)
