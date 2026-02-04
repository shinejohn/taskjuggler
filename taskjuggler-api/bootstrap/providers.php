<?php

return [
    App\Providers\AppServiceProvider::class,
    App\Providers\AuthServiceProvider::class,
    App\Providers\MessageRouterServiceProvider::class,
    App\Providers\ModuleServiceProvider::class,
    App\Modules\OfficialNotice\Providers\OfficialNoticeServiceProvider::class,
];
