"""Pipecat voice pipeline — Deepgram STT → OpenAI LLM → ElevenLabs TTS."""
from __future__ import annotations

import os
from typing import Any, Awaitable, Callable

from loguru import logger
from pipecat.audio.vad.silero import SileroVADAnalyzer
from pipecat.frames.frames import LLMRunFrame, LLMTextFrame, TranscriptionFrame
from pipecat.observers.base_observer import BaseObserver, FramePushed
from pipecat.pipeline.pipeline import Pipeline
from pipecat.pipeline.worker import PipelineParams, PipelineWorker
from pipecat.processors.aggregators.llm_context import LLMContext
from pipecat.processors.aggregators.llm_response_universal import (
    LLMContextAggregatorPair,
    LLMUserAggregatorParams,
)
from pipecat.services.deepgram.stt import DeepgramSTTService
from pipecat.services.elevenlabs.tts import ElevenLabsTTSService
from pipecat.services.openai.llm import OpenAILLMService
from pipecat.transports.base_transport import BaseTransport
from pipecat.transports.livekit.transport import LiveKitTransport
from pipecat.transports.websocket.fastapi import FastAPIWebsocketTransport
from pipecat.workers.runner import WorkerRunner

TranscriptCallback = Callable[[str, str, str], Awaitable[None]]
LifecycleCallback = Callable[[str, dict[str, Any]], Awaitable[None]]


class TranscriptObserver(BaseObserver):
    """Capture user/bot turns and forward to Laravel."""

    def __init__(
        self,
        *,
        on_turn: TranscriptCallback,
        session_id: str,
    ) -> None:
        super().__init__()
        self._on_turn = on_turn
        self._session_id = session_id

    async def on_push_frame(self, data: FramePushed) -> None:
        frame = data.frame
        if isinstance(frame, TranscriptionFrame) and frame.text.strip():
            await self._on_turn(self._session_id, "user", frame.text.strip())
        elif isinstance(frame, LLMTextFrame) and frame.text.strip():
            await self._on_turn(self._session_id, "assistant", frame.text.strip())


def _require_keys() -> None:
    missing = [
        key
        for key in ("DEEPGRAM_API_KEY", "OPENAI_API_KEY", "ELEVENLABS_API_KEY")
        if not os.getenv(key)
    ]
    if missing:
        raise RuntimeError(f"Missing required voice pipeline env vars: {', '.join(missing)}")


def _message_content(content: object) -> str:
    if isinstance(content, str):
        return content
    if isinstance(content, list):
        parts: list[str] = []
        for part in content:
            if isinstance(part, dict):
                text = part.get("text")
                if isinstance(text, str):
                    parts.append(text)
            elif isinstance(part, str):
                parts.append(part)
        return " ".join(parts)
    return str(content) if content is not None else ""


def _format_transcript(context: LLMContext) -> str:
    lines: list[str] = []
    for message in context.get_messages():
        role = message.get("role", "unknown")
        content = _message_content(message.get("content", ""))
        if role in {"user", "assistant"} and content:
            lines.append(f"[{role}]: {content}")
    return "\n".join(lines)


def _build_pipeline(
    transport: BaseTransport,
    system_prompt: str,
    *,
    on_turn: TranscriptCallback | None,
    session_id: str,
) -> tuple[LLMContext, PipelineWorker]:
    _require_keys()

    stt = DeepgramSTTService(api_key=os.environ["DEEPGRAM_API_KEY"])
    llm = OpenAILLMService(
        api_key=os.environ["OPENAI_API_KEY"],
        settings=OpenAILLMService.Settings(
            model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
            system_instruction=system_prompt,
        ),
    )
    tts = ElevenLabsTTSService(
        api_key=os.environ["ELEVENLABS_API_KEY"],
        voice_id=os.getenv("ELEVENLABS_VOICE_ID", "21m00Tcm4TlvDq8ikWAM"),
    )

    context = LLMContext()
    context.add_message("system", system_prompt)

    user_aggregator, assistant_aggregator = LLMContextAggregatorPair(
        context,
        user_params=LLMUserAggregatorParams(
            vad_analyzer=SileroVADAnalyzer(),
        ),
    )

    pipeline = Pipeline(
        [
            transport.input(),
            stt,
            user_aggregator,
            llm,
            tts,
            transport.output(),
            assistant_aggregator,
        ]
    )

    observers: list[BaseObserver] = []
    if on_turn:
        observers.append(TranscriptObserver(on_turn=on_turn, session_id=session_id))

    worker = PipelineWorker(
        pipeline,
        params=PipelineParams(
            enable_metrics=True,
            enable_usage_metrics=True,
        ),
        observers=observers or None,
    )

    return context, worker


async def run_voice_bot(
    transport: BaseTransport,
    *,
    session_id: str,
    system_prompt: str,
    on_lifecycle: LifecycleCallback,
    on_turn: TranscriptCallback | None = None,
) -> None:
    """Run the full Pipecat voice loop until the transport disconnects."""
    context, worker = _build_pipeline(
        transport,
        system_prompt,
        on_turn=on_turn,
        session_id=session_id,
    )

    async def _start_conversation() -> None:
        context.add_message("developer", "Greet the caller briefly and offer to help.")
        await worker.queue_frames([LLMRunFrame()])

    async def _finish() -> None:
        transcript = _format_transcript(context)
        await on_lifecycle(
            session_id,
            {
                "event": "session.ended",
                "transcript": transcript,
            },
        )
        await worker.cancel()

    if isinstance(transport, LiveKitTransport):

        @transport.event_handler("on_first_participant_joined")
        async def _on_first_participant_joined(_transport, _participant_id):  # noqa: ANN001
            await on_lifecycle(session_id, {"event": "session.connected"})
            await _start_conversation()

        @transport.event_handler("on_participant_disconnected")
        async def _on_participant_disconnected(_transport, _participant_id):  # noqa: ANN001
            await _finish()

    elif isinstance(transport, FastAPIWebsocketTransport):

        @transport.event_handler("on_client_connected")
        async def _on_client_connected(_transport, _client):  # noqa: ANN001
            await on_lifecycle(session_id, {"event": "session.connected"})
            await _start_conversation()

        @transport.event_handler("on_client_disconnected")
        async def _on_client_disconnected(_transport, _client):  # noqa: ANN001
            await _finish()

    else:
        await on_lifecycle(session_id, {"event": "session.connected"})
        await _start_conversation()

    logger.info(f"Starting Pipecat voice bot for session {session_id}")
    runner = WorkerRunner(handle_sigint=False)
    await runner.run(worker)
