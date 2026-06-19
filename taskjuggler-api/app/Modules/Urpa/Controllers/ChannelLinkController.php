<?php

declare(strict_types=1);

namespace App\Modules\Urpa\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Urpa\Models\UrpaChannelLink;
use App\Modules\Urpa\Services\UrpaChannelOutboundService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

/**
 * Lets each user register and manage their own messaging channels for URPA.
 * Credentials (per-user bot tokens / API keys) are stored encrypted.
 */
final class ChannelLinkController extends Controller
{
    public function __construct(
        private UrpaChannelOutboundService $outbound
    ) {}

    /** GET /api/urpa/channels/links */
    public function index(Request $request): JsonResponse
    {
        $links = UrpaChannelLink::where('user_id', $request->user()->id)
            ->orderBy('channel')
            ->get();

        return response()->json(['data' => $links]);
    }

    /** POST /api/urpa/channels/links */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'channel' => ['required', 'string', Rule::in(config('urpa.channels'))],
            'external_user_id' => ['required', 'string'],
            'external_chat_id' => ['required', 'string'],
            'display_name' => ['nullable', 'string', 'max:255'],
            'credentials' => ['nullable', 'array'],
            'auto_reply' => ['sometimes', 'boolean'],
        ]);

        $link = UrpaChannelLink::updateOrCreate(
            [
                'channel' => $validated['channel'],
                'external_user_id' => $validated['external_user_id'],
            ],
            [
                'user_id' => $request->user()->id,
                'external_chat_id' => $validated['external_chat_id'],
                'display_name' => $validated['display_name'] ?? null,
                'credentials' => $validated['credentials'] ?? null,
                'auto_reply' => $validated['auto_reply'] ?? true,
                'is_active' => true,
            ]
        );

        return response()->json($link, 201);
    }

    /** PUT /api/urpa/channels/links/{id} */
    public function update(Request $request, string $id): JsonResponse
    {
        $link = UrpaChannelLink::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $validated = $request->validate([
            'external_chat_id' => ['sometimes', 'string'],
            'display_name' => ['nullable', 'string', 'max:255'],
            'credentials' => ['nullable', 'array'],
            'is_active' => ['sometimes', 'boolean'],
            'auto_reply' => ['sometimes', 'boolean'],
        ]);

        $link->fill($validated)->save();

        return response()->json($link);
    }

    /** DELETE /api/urpa/channels/links/{id} */
    public function destroy(Request $request, string $id): JsonResponse
    {
        $link = UrpaChannelLink::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $link->delete();

        return response()->json(['deleted' => true]);
    }

    /** POST /api/urpa/channels/links/{id}/send — send an outbound message now */
    public function send(Request $request, string $id): JsonResponse
    {
        $link = UrpaChannelLink::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $validated = $request->validate([
            'text' => ['required', 'string'],
        ]);

        $result = $this->outbound->send($link, $validated['text']);

        return response()->json(['sent' => true, 'result' => $result]);
    }
}
