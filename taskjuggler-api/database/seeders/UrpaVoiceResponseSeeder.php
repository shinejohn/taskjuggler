<?php

namespace Database\Seeders;

use App\Modules\Urpa\Models\UrpaVoiceResponse;
use Illuminate\Database\Seeder;

class UrpaVoiceResponseSeeder extends Seeder
{
    /**
     * Seed universal pre-recorded voice responses for 90% coverage
     */
    public function run(): void
    {
        $responses = [
            // Greetings
            [
                'category' => 'greeting',
                'intent' => 'morning_greeting',
                'text_content' => 'Good morning! How can I help you today?',
                'trigger_phrases' => ['good morning', 'morning', 'hello', 'hi'],
                'context_requirements' => ['time_of_day' => 'morning'],
                'has_personalization' => false,
            ],
            [
                'category' => 'greeting',
                'intent' => 'afternoon_greeting',
                'text_content' => 'Good afternoon! How can I assist you?',
                'trigger_phrases' => ['good afternoon', 'afternoon', 'hello', 'hi'],
                'context_requirements' => ['time_of_day' => 'afternoon'],
                'has_personalization' => false,
            ],
            [
                'category' => 'greeting',
                'intent' => 'evening_greeting',
                'text_content' => 'Good evening! What can I do for you?',
                'trigger_phrases' => ['good evening', 'evening', 'hello', 'hi'],
                'context_requirements' => ['time_of_day' => 'evening'],
                'has_personalization' => false,
            ],
            [
                'category' => 'greeting',
                'intent' => 'general_greeting',
                'text_content' => 'Hello! How can I help you today?',
                'trigger_phrases' => ['hello', 'hi', 'hey', 'greetings'],
                'context_requirements' => [],
                'has_personalization' => true,
                'personalization_slots' => [['slot' => 'name', 'default' => 'there']],
            ],

            // Scheduling
            [
                'category' => 'scheduling',
                'intent' => 'schedule_appointment',
                'text_content' => 'I\'d be happy to help you schedule an appointment. What day works best for you?',
                'trigger_phrases' => ['schedule', 'appointment', 'meeting', 'book', 'set up'],
                'context_requirements' => [],
                'has_personalization' => false,
            ],
            [
                'category' => 'scheduling',
                'intent' => 'confirm_appointment',
                'text_content' => 'Perfect! I\'ve scheduled your appointment for {date} at {time}. You\'ll receive a confirmation email shortly.',
                'trigger_phrases' => ['confirm', 'yes', 'that works', 'sounds good'],
                'context_requirements' => ['call_state' => 'scheduling'],
                'has_personalization' => true,
                'personalization_slots' => [
                    ['slot' => 'date', 'default' => 'that day'],
                    ['slot' => 'time', 'default' => 'that time'],
                ],
            ],
            [
                'category' => 'scheduling',
                'intent' => 'reschedule_appointment',
                'text_content' => 'I can help you reschedule. What new date and time would work better for you?',
                'trigger_phrases' => ['reschedule', 'change', 'move', 'different time'],
                'context_requirements' => [],
                'has_personalization' => false,
            ],

            // Business Info
            [
                'category' => 'business_info',
                'intent' => 'hours',
                'text_content' => 'Our business hours are {hours}. Is there anything else I can help you with?',
                'trigger_phrases' => ['hours', 'open', 'when are you', 'what time'],
                'context_requirements' => [],
                'has_personalization' => true,
                'personalization_slots' => [['slot' => 'hours', 'default' => 'Monday through Friday, 9am to 5pm']],
            ],
            [
                'category' => 'business_info',
                'intent' => 'location',
                'text_content' => 'We\'re located at {address}. Would you like directions?',
                'trigger_phrases' => ['where', 'location', 'address', 'directions'],
                'context_requirements' => [],
                'has_personalization' => true,
                'personalization_slots' => [['slot' => 'address', 'default' => 'our main location']],
            ],
            [
                'category' => 'business_info',
                'intent' => 'contact',
                'text_content' => 'You can reach us at {phone} or {email}. Is there anything specific you\'d like to know?',
                'trigger_phrases' => ['contact', 'phone', 'email', 'reach', 'call'],
                'context_requirements' => [],
                'has_personalization' => true,
                'personalization_slots' => [
                    ['slot' => 'phone', 'default' => 'our main number'],
                    ['slot' => 'email', 'default' => 'our email'],
                ],
            ],

            // FAQs
            [
                'category' => 'faq',
                'intent' => 'pricing',
                'text_content' => 'Our pricing varies depending on your needs. Let me connect you with someone who can provide specific pricing information.',
                'trigger_phrases' => ['price', 'cost', 'how much', 'pricing', 'fee'],
                'context_requirements' => [],
                'has_personalization' => false,
            ],
            [
                'category' => 'faq',
                'intent' => 'services',
                'text_content' => 'We offer {services}. Would you like more information about any specific service?',
                'trigger_phrases' => ['services', 'what do you', 'offer', 'provide'],
                'context_requirements' => [],
                'has_personalization' => true,
                'personalization_slots' => [['slot' => 'services', 'default' => 'a variety of services']],
            ],

            // Call Handling
            [
                'category' => 'transfer',
                'intent' => 'transfer_to_human',
                'text_content' => 'Let me transfer you to a team member who can better assist you. Please hold for just a moment.',
                'trigger_phrases' => ['transfer', 'human', 'person', 'speak to someone'],
                'context_requirements' => [],
                'has_personalization' => false,
            ],
            [
                'category' => 'transfer',
                'intent' => 'take_message',
                'text_content' => 'I\'d be happy to take a message. What would you like me to tell {name}?',
                'trigger_phrases' => ['message', 'leave a message', 'tell them'],
                'context_requirements' => [],
                'has_personalization' => true,
                'personalization_slots' => [['slot' => 'name', 'default' => 'them']],
            ],

            // Confirmations
            [
                'category' => 'confirmation',
                'intent' => 'appointment_confirmed',
                'text_content' => 'Your appointment has been confirmed. You\'ll receive a confirmation email with all the details.',
                'trigger_phrases' => [],
                'context_requirements' => ['call_state' => 'scheduling'],
                'has_personalization' => false,
            ],
            [
                'category' => 'confirmation',
                'intent' => 'message_received',
                'text_content' => 'I\'ve received your message and will make sure {name} gets it right away. Is there anything else I can help with?',
                'trigger_phrases' => [],
                'context_requirements' => ['call_state' => 'message'],
                'has_personalization' => true,
                'personalization_slots' => [['slot' => 'name', 'default' => 'they']],
            ],

            // Goodbyes
            [
                'category' => 'goodbye',
                'intent' => 'thank_you_goodbye',
                'text_content' => 'Thank you for calling! Have a great day!',
                'trigger_phrases' => ['thank you', 'thanks', 'bye', 'goodbye'],
                'context_requirements' => ['call_state' => 'closing'],
                'has_personalization' => false,
            ],
            [
                'category' => 'goodbye',
                'intent' => 'helpful_goodbye',
                'text_content' => 'I\'m glad I could help! Feel free to call again if you need anything else. Goodbye!',
                'trigger_phrases' => ['bye', 'goodbye', 'thanks'],
                'context_requirements' => ['call_state' => 'closing'],
                'has_personalization' => false,
            ],

            // Errors
            [
                'category' => 'error',
                'intent' => 'did_not_understand',
                'text_content' => 'I apologize, but I didn\'t quite understand that. Could you please repeat or rephrase?',
                'trigger_phrases' => [],
                'context_requirements' => [],
                'has_personalization' => false,
            ],
            [
                'category' => 'error',
                'intent' => 'unavailable',
                'text_content' => 'I\'m sorry, but that information isn\'t available right now. Let me transfer you to someone who can help.',
                'trigger_phrases' => [],
                'context_requirements' => [],
                'has_personalization' => false,
            ],
        ];

        foreach ($responses as $response) {
            UrpaVoiceResponse::updateOrCreate(
                [
                    'category' => $response['category'],
                    'intent' => $response['intent'],
                ],
                [
                    'text_content' => $response['text_content'],
                    'trigger_phrases' => $response['trigger_phrases'],
                    'context_requirements' => $response['context_requirements'],
                    'has_personalization' => $response['has_personalization'],
                    'personalization_slots' => $response['personalization_slots'] ?? [],
                    'is_active' => true,
                ]
            );
        }

        $this->command->info('Seeded ' . count($responses) . ' universal voice responses');
    }
}

