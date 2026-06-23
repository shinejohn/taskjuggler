<?php

declare(strict_types=1);

return [
    /*
    |--------------------------------------------------------------------------
    | Charge Per Execution
    |--------------------------------------------------------------------------
    |
    | When true, a successful AI tool execution that reports a non-null cost
    | will record an `ai_tool` Transaction for the requesting user (revenue
    | capture). Off by default so enabling billing is an explicit decision.
    |
    */
    'charge_per_execution' => env('MARKETPLACE_CHARGE_PER_EXECUTION', false),

    /*
    |--------------------------------------------------------------------------
    | AI Tool Markup Percent
    |--------------------------------------------------------------------------
    |
    | Percentage markup applied on top of the raw model cost when recording an
    | ai_tool Transaction. e.g. 20 => revenue = cost * 1.20. Default 0 (pass
    | through at cost).
    |
    */
    'ai_tool_markup_percent' => env('MARKETPLACE_AI_TOOL_MARKUP_PERCENT', 0),
];
