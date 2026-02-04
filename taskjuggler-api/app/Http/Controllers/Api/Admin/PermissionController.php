<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use Illuminate\Http\Request;

class PermissionController extends Controller
{
    public function index()
    {
        $permissions = Permission::orderBy('module')
            ->orderBy('category')
            ->orderBy('display_order')
            ->get()
            ->groupBy('module');
            
        return response()->json($permissions);
    }
}
