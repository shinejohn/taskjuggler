<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use Illuminate\Http\Request;

class AuditLogController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 50);
        
        $query = AuditLog::orderBy('created_at', 'desc');
        
        if ($request->has('user_id')) {
            $query->where('user_id', $request->input('user_id'));
        }
        
        if ($request->has('action')) {
            $query->where('action', $request->input('action'));
        }
        
        return $query->paginate($perPage);
    }
    
    public function show($id)
    {
        return AuditLog::findOrFail($id);
    }
}
