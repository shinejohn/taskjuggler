<template>
  <DashboardLayout>
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-heading font-bold text-[#1B4F72]">Learning Center</h1>
          <p class="text-slate-500 mt-1">Knowledge base and AI training for your ecosystem.</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <BookOpen :size="20" class="text-[#F59E0B]" />
              Knowledge Base
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-sm text-slate-600 mb-4">Manage FAQs and business information that your AI assistants use to answer customer questions.</p>
            <Button variant="outline" class="w-full">Manage Knowledge</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <GraduationCap :size="20" class="text-[#F59E0B]" />
              AI Training
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-sm text-slate-600 mb-4">Review AI interactions and provide feedback to improve accuracy and performance.</p>
            <Button variant="outline" class="w-full">Train AI</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <FileText :size="20" class="text-[#F59E0B]" />
              Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-sm text-slate-600 mb-4">Upload and manage documents, manuals, and price lists for the AI to reference.</p>
            <Button variant="outline" class="w-full">Manage Documents</Button>
          </CardContent>
        </Card>
      </div>

      <Card class="mt-8">
        <CardHeader>
          <CardTitle>Recent FAQ Suggestions</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-center py-8 text-slate-500">
            No new suggestions from recent calls.
          </div>
        </CardContent>
      </Card>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { BookOpen, GraduationCap, FileText } from 'lucide-vue-next';
import DashboardLayout from '@/components/layout/DashboardLayout.vue';
import { Card, CardHeader, CardTitle, CardContent, Button } from '@taskjuggler/ui';
</script>
