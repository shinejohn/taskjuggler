<?php

namespace App\Services\Tasks;

use App\Models\Task;
use App\Models\TaskInvitation;
use App\Models\User;
use App\Services\Notifications\NotificationService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TaskInvitationService
{
    public function __construct(
        private NotificationService $notificationService,
        private TaskStateMachine $stateMachine
    ) {}

    /**
     * Create an invitation for a task
     */
    public function createInvitation(
        Task $task,
        User $invitedBy,
        ?string $email = null,
        ?string $phone = null,
        ?string $name = null,
        string $role = TaskInvitation::ROLE_OWNER
    ): TaskInvitation {
        $invitation = TaskInvitation::create([
            'task_id' => $task->id,
            'invited_email' => $email,
            'invited_phone' => $phone,
            'invited_name' => $name,
            'role' => $role,
            'invited_by_user_id' => $invitedBy->id,
        ]);

        // Send invitation notification
        $this->sendInvitationNotification($invitation);

        // Log invitation creation
        \App\Models\TaskAction::create([
            'task_id' => $task->id,
            'user_id' => $invitedBy->id,
            'action_type' => 'invitation_created',
            'action_data' => [
                'invitation_id' => $invitation->id,
                'invite_code' => $invitation->invite_code,
                'invited_email' => $email,
                'invited_phone' => $phone,
                'role' => $role,
            ],
        ]);

        return $invitation;
    }

    /**
     * Get invitation by code
     */
    public function getByInviteCode(string $taskId, string $inviteCode): ?TaskInvitation
    {
        return TaskInvitation::where('task_id', $taskId)
            ->where('invite_code', $inviteCode)
            ->with(['task', 'invitedBy'])
            ->first();
    }

    /**
     * Accept an invitation
     */
    public function acceptInvitation(TaskInvitation $invitation, User $user): Task
    {
        return DB::transaction(function () use ($invitation, $user) {
            // Mark invitation as accepted
            $invitation->accept($user);

            $task = $invitation->task;

            // Apply role-based action
            switch ($invitation->role) {
                case TaskInvitation::ROLE_OWNER:
                    $this->stateMachine->acceptTask($task, $user, 'Accepted via invitation');
                    break;
                case TaskInvitation::ROLE_WATCHER:
                    $this->stateMachine->watchTask($task, $user, 'Watching via invitation');
                    break;
                case TaskInvitation::ROLE_COLLABORATOR:
                    // Add as collaborator (future feature - for now, accept as owner)
                    $this->stateMachine->acceptTask($task, $user, 'Accepted as collaborator via invitation');
                    break;
            }

            // Notify the inviter
            $this->notificationService->send(
                $invitation->invitedBy,
                'invitation_accepted',
                'Invitation Accepted',
                "{$user->name} has accepted your invitation to task: {$task->title}",
                ['task_id' => $task->id, 'invitation_id' => $invitation->id]
            );

            return $task->fresh();
        });
    }

    /**
     * Decline an invitation
     */
    public function declineInvitation(TaskInvitation $invitation, ?User $user = null): void
    {
        $invitation->decline();

        // Notify the inviter
        $declinerName = $user ? $user->name : ($invitation->invited_name ?? 'Someone');
        $this->notificationService->send(
            $invitation->invitedBy,
            'invitation_declined',
            'Invitation Declined',
            "{$declinerName} has declined your invitation to task: {$invitation->task->title}",
            ['task_id' => $invitation->task_id, 'invitation_id' => $invitation->id]
        );
    }

    /**
     * Send invitation notification via preferred channel
     */
    private function sendInvitationNotification(TaskInvitation $invitation): void
    {
        $task = $invitation->task;
        $inviteUrl = $invitation->getInviteUrl();

        $message = sprintf(
            "You've been invited to a task: \"%s\"\n\nClick to respond: %s",
            $task->title,
            $inviteUrl
        );

        // For now, just log - full email/SMS integration pending
        Log::info('Task invitation created', [
            'invitation_id' => $invitation->id,
            'task_id' => $task->id,
            'invited_email' => $invitation->invited_email,
            'invited_phone' => $invitation->invited_phone,
            'invite_url' => $inviteUrl,
        ]);

        // TODO: When email/SMS services are fully integrated:
        // if ($invitation->invited_email) {
        //     $this->notificationService->sendEmail(...);
        // }
        // if ($invitation->invited_phone) {
        //     $this->notificationService->sendSms(...);
        // }
    }
}
