<?php

declare(strict_types=1);

namespace App\Modules\Urpa\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Urpa\Jobs\SyncSocialEngagementJob;
use App\Modules\Urpa\Models\UrpaSocialAccount;
use App\Modules\Urpa\Models\UrpaSocialPost;
use App\Modules\Urpa\Services\SocialContentService;
use App\Modules\Urpa\Services\SocialOAuthService;
use App\Modules\Urpa\Services\SocialPublisherService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

/**
 * Per-user/per-business social account + post management for URPA.
 */
final class SocialController extends Controller
{
    public function __construct(
        private SocialOAuthService $oauth,
        private SocialContentService $content,
        private SocialPublisherService $publisher
    ) {}

    private function providers(): array
    {
        return array_keys(config('social.providers'));
    }

    /** GET /api/urpa/social/accounts */
    public function accounts(Request $request): JsonResponse
    {
        $accounts = UrpaSocialAccount::where('user_id', $request->user()->id)
            ->orderBy('provider')
            ->get();

        return response()->json(['data' => $accounts]);
    }

    /** GET /api/urpa/social/oauth/{provider}/redirect */
    public function oauthRedirect(Request $request, string $provider): JsonResponse
    {
        abort_unless(in_array($provider, $this->providers(), true), 404);

        $url = $this->oauth->authorizeUrl($provider, $request->user()->id);

        return response()->json(['authorize_url' => $url]);
    }

    /** GET /api/urpa/social/oauth/{provider}/callback (public — provider redirect) */
    public function oauthCallback(Request $request, string $provider): RedirectResponse|JsonResponse
    {
        abort_unless(in_array($provider, $this->providers(), true), 404);

        $code = $request->query('code');
        $state = $request->query('state');

        if (! $code || ! $state) {
            return response()->json(['error' => 'Missing code or state'], 400);
        }

        try {
            [, $account] = $this->oauth->handleCallback($provider, $code, $state);
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }

        $return = config('social.frontend_return_url');

        return $return
            ? redirect()->away($return.'?connected='.$provider.'&account='.$account->id)
            : response()->json(['connected' => true, 'account' => $account]);
    }

    /** POST /api/urpa/social/accounts — connect with an existing token (no OAuth round-trip) */
    public function connectManual(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'provider' => ['required', 'string', Rule::in($this->providers())],
            'provider_account_id' => ['required', 'string'],
            'account_name' => ['nullable', 'string', 'max:255'],
            'fibonacco_business_id' => ['nullable', 'uuid'],
            'credentials' => ['required', 'array'],
            'credentials.access_token' => ['required', 'string'],
        ]);

        $account = UrpaSocialAccount::updateOrCreate(
            [
                'user_id' => $request->user()->id,
                'provider' => $validated['provider'],
                'provider_account_id' => $validated['provider_account_id'],
            ],
            [
                'account_name' => $validated['account_name'] ?? null,
                'fibonacco_business_id' => $validated['fibonacco_business_id'] ?? null,
                'credentials' => $validated['credentials'],
                'is_active' => true,
            ]
        );

        return response()->json($account, 201);
    }

    /** PUT /api/urpa/social/accounts/{id} */
    public function updateAccount(Request $request, string $id): JsonResponse
    {
        $account = $this->findAccount($request, $id);

        $validated = $request->validate([
            'account_name' => ['nullable', 'string', 'max:255'],
            'fibonacco_business_id' => ['nullable', 'uuid'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $account->fill($validated)->save();

        return response()->json($account);
    }

    /** DELETE /api/urpa/social/accounts/{id} */
    public function disconnect(Request $request, string $id): JsonResponse
    {
        $this->findAccount($request, $id)->delete();

        return response()->json(['disconnected' => true]);
    }

    /** POST /api/urpa/social/accounts/{id}/sync */
    public function syncEngagement(Request $request, string $id): JsonResponse
    {
        $account = $this->findAccount($request, $id);

        SyncSocialEngagementJob::dispatch($account->id);

        return response()->json(['queued' => true]);
    }

    /** GET /api/urpa/social/posts */
    public function posts(Request $request): JsonResponse
    {
        $query = UrpaSocialPost::where('user_id', $request->user()->id);

        if ($request->filled('status')) {
            $query->where('status', $request->query('status'));
        }
        if ($request->filled('account_id')) {
            $query->where('social_account_id', $request->query('account_id'));
        }

        $posts = $query->orderByDesc('created_at')->paginate((int) $request->query('per_page', 20));

        return response()->json([
            'data' => $posts->items(),
            'total' => $posts->total(),
            'page' => $posts->currentPage(),
        ]);
    }

    /** POST /api/urpa/social/posts — create a manual draft/scheduled post */
    public function createPost(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'social_account_id' => ['required', 'uuid'],
            'content' => ['required', 'string'],
            'media' => ['nullable', 'array'],
            'scheduled_at' => ['nullable', 'date', 'after:now'],
        ]);

        $account = $this->findAccount($request, $validated['social_account_id']);

        $post = UrpaSocialPost::create([
            'user_id' => $request->user()->id,
            'social_account_id' => $account->id,
            'fibonacco_business_id' => $account->fibonacco_business_id,
            'content' => $validated['content'],
            'media' => $validated['media'] ?? null,
            'status' => isset($validated['scheduled_at']) ? 'scheduled' : 'draft',
            'source' => 'manual',
            'scheduled_at' => $validated['scheduled_at'] ?? null,
        ]);

        return response()->json($post, 201);
    }

    /** POST /api/urpa/social/posts/generate — AI draft grounded in business data */
    public function generatePost(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'social_account_id' => ['required', 'uuid'],
            'brief' => ['nullable', 'string'],
            'tone' => ['nullable', 'string', 'max:60'],
            'scheduled_at' => ['nullable', 'date', 'after:now'],
        ]);

        $account = $this->findAccount($request, $validated['social_account_id']);

        $post = $this->content->generate($account, [
            'brief' => $validated['brief'] ?? null,
            'tone' => $validated['tone'] ?? null,
            'scheduled_at' => $validated['scheduled_at'] ?? null,
        ]);

        return response()->json($post, 201);
    }

    /** PUT /api/urpa/social/posts/{id} */
    public function updatePost(Request $request, string $id): JsonResponse
    {
        $post = $this->findPost($request, $id);

        abort_if(in_array($post->status, ['published', 'publishing'], true), 422, 'Cannot edit a published post');

        $validated = $request->validate([
            'content' => ['sometimes', 'string'],
            'media' => ['nullable', 'array'],
            'scheduled_at' => ['nullable', 'date', 'after:now'],
        ]);

        if (array_key_exists('scheduled_at', $validated)) {
            $post->status = $validated['scheduled_at'] ? 'scheduled' : 'draft';
        }
        $post->fill($validated)->save();

        return response()->json($post);
    }

    /** POST /api/urpa/social/posts/{id}/publish — publish now */
    public function publishNow(Request $request, string $id): JsonResponse
    {
        $post = $this->findPost($request, $id);

        abort_if($post->status === 'published', 422, 'Already published');

        $this->publisher->publish($post);

        return response()->json($post->fresh());
    }

    /** POST /api/urpa/social/posts/{id}/cancel */
    public function cancelPost(Request $request, string $id): JsonResponse
    {
        $post = $this->findPost($request, $id);

        abort_if($post->status === 'published', 422, 'Already published');

        $post->update(['status' => 'cancelled']);

        return response()->json($post);
    }

    private function findAccount(Request $request, string $id): UrpaSocialAccount
    {
        return UrpaSocialAccount::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();
    }

    private function findPost(Request $request, string $id): UrpaSocialPost
    {
        return UrpaSocialPost::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();
    }
}
