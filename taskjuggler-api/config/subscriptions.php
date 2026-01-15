<?php

return [
    'apps' => [
        'scanner' => [
            'plans' => [
                'pro' => [
                    'monthly' => 'price_scanner_pro_monthly',
                    'annual' => 'price_scanner_pro_annual',
                ],
                'enterprise' => [
                    'monthly' => 'price_scanner_enterprise_monthly',
                    'annual' => 'price_scanner_enterprise_annual',
                ],
            ],
            'addons' => [],
        ],
        'ideacircuit' => [
            'plans' => [
                'starter' => [
                    'monthly' => 'price_ideacircuit_starter_monthly',
                    'annual' => 'price_ideacircuit_starter_annual',
                ],
                'pro' => [
                    'monthly' => 'price_ideacircuit_pro_monthly',
                    'annual' => 'price_ideacircuit_pro_annual',
                ],
                'enterprise' => [
                    'monthly' => 'price_ideacircuit_enterprise_monthly',
                    'annual' => 'price_ideacircuit_enterprise_annual',
                ],
            ],
            'addons' => [],
        ],
        'urpa' => [
            'plans' => [
                'starter' => [
                    'monthly' => 'price_urpa_starter_monthly',
                    'annual' => 'price_urpa_starter_annual',
                ],
                'professional' => [
                    'monthly' => 'price_urpa_professional_monthly',
                    'annual' => 'price_urpa_professional_annual',
                ],
                'enterprise' => [
                    'monthly' => 'price_urpa_enterprise_monthly',
                    'annual' => 'price_urpa_enterprise_annual',
                ],
            ],
            'addons' => [
                'texting' => 'price_urpa_addon_texting_monthly',
                'phone' => 'price_urpa_addon_phone_monthly',
                'team' => 'price_urpa_addon_team_monthly',
            ],
        ],
        'taskjuggler' => [
            'plans' => [],
            'addons' => [],
        ],
        'projects' => [
            'plans' => [],
            'addons' => [],
        ],
        'process' => [
            'plans' => [],
            'addons' => [],
        ],
        'coordinator' => [
            'plans' => [],
            'addons' => [],
        ],
    ],
];

