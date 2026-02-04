#!/bin/bash

# Quick script to verify Valkey/Redis service name

echo "🔍 Checking Valkey/Redis Service Configuration"
echo "=============================================="
echo ""

cd /Users/johnshine/Dropbox/Fibonacco/taskjuggler/Code/taskjuggler-api

echo "Current REDIS_HOST setting:"
railway variables --json 2>/dev/null | jq -r '.REDIS_HOST // "Not set"'

echo ""
echo "Testing connection with current settings..."
railway run "php artisan tinker --execute='
try {
    \Illuminate\Support\Facades\Redis::set(\"test\", \"connection_works\");
    \$result = \Illuminate\Support\Facades\Redis::get(\"test\");
    echo \"✅ Redis connection successful! Value: \" . \$result . \"\n\";
} catch (\Exception \$e) {
    echo \"❌ Redis connection failed: \" . \$e->getMessage() . \"\n\";
    echo \"Current REDIS_HOST: \" . env(\"REDIS_HOST\") . \"\n\";
}
'" 2>&1

echo ""
echo "=============================================="
echo ""
echo "If connection failed, check Railway dashboard for exact service name:"
echo "  https://railway.app/project/7e7372dd-373a-4e78-a51e-15eab332b67d"
echo ""
echo "Then update REDIS_HOST:"
echo "  railway variables --set \"REDIS_HOST=Valkey-CTyp.railway.internal\""
echo "  OR"
echo "  railway variables --set \"REDIS_HOST=Valkey.railway.internal\""
echo ""
