<?php

namespace App\Services\Export;

use App\Models\Task;
use App\Services\Calendar\CalendarService;

class TaskExportService
{
    public function __construct(
        private CalendarService $calendarService
    ) {}

    /**
     * Export tasks to CSV format
     */
    public function exportToCsv($tasks): string
    {
        $csv = [];
        
        // Headers
        $csv[] = ['Title', 'Description', 'Status', 'Priority', 'Due Date', 'Contact Name', 'Contact Email', 'Contact Phone', 'Created At', 'Updated At'];
        
        // Data rows
        foreach ($tasks as $task) {
            $csv[] = [
                $task->title,
                $task->description ?? '',
                $task->status,
                $task->priority,
                $task->due_date ? $task->due_date->format('Y-m-d H:i:s') : '',
                $task->contact_name ?? '',
                $task->contact_email ?? '',
                $task->contact_phone ?? '',
                $task->created_at->format('Y-m-d H:i:s'),
                $task->updated_at->format('Y-m-d H:i:s'),
            ];
        }
        
        // Convert to CSV string
        $output = fopen('php://temp', 'r+');
        foreach ($csv as $row) {
            fputcsv($output, $row);
        }
        rewind($output);
        $csvString = stream_get_contents($output);
        fclose($output);
        
        return $csvString;
    }

    /**
     * Export tasks to PDF (basic text format, can be enhanced with PDF library)
     */
    public function exportToPdf($tasks): string
    {
        $html = '<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Tasks Export</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #333; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; font-weight: bold; }
        tr:nth-child(even) { background-color: #f9f9f9; }
    </style>
</head>
<body>
    <h1>Tasks Export</h1>
    <p>Generated: ' . now()->format('Y-m-d H:i:s') . '</p>
    <table>
        <thead>
            <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Due Date</th>
                <th>Contact</th>
                <th>Created</th>
            </tr>
        </thead>
        <tbody>';
        
        foreach ($tasks as $task) {
            $html .= '<tr>';
            $html .= '<td>' . htmlspecialchars($task->title) . '</td>';
            $html .= '<td>' . htmlspecialchars($task->description ?? '') . '</td>';
            $html .= '<td>' . htmlspecialchars($task->status) . '</td>';
            $html .= '<td>' . htmlspecialchars($task->priority) . '</td>';
            $html .= '<td>' . ($task->due_date ? $task->due_date->format('Y-m-d') : '') . '</td>';
            $html .= '<td>' . htmlspecialchars($task->contact_name ?? '') . '</td>';
            $html .= '<td>' . $task->created_at->format('Y-m-d') . '</td>';
            $html .= '</tr>';
        }
        
        $html .= '</tbody>
    </table>
</body>
</html>';
        
        return $html;
    }
}
