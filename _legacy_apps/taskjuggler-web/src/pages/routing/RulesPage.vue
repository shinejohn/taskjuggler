<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Routing Rules</h1>
      <button @click="showCreateModal = true" class="btn btn-primary">
        Create Rule
      </button>
    </div>

    <div v-if="loading" class="text-center py-8">Loading...</div>
    <div v-else-if="rules.length === 0" class="text-center py-8 text-gray-500">
      No routing rules yet. Create your first rule to get started.
    </div>
    <div v-else class="space-y-4">
      <div
        v-for="rule in sortedRules"
        :key="rule.id"
        class="card"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-2">
              <h3 class="font-semibold">{{ rule.name }}</h3>
              <span
                :class="[
                  'px-2 py-1 rounded text-xs font-medium',
                  rule.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800',
                ]"
              >
                {{ rule.is_active ? 'Active' : 'Inactive' }}
              </span>
              <span class="text-xs text-gray-500">Priority: {{ rule.priority }}</span>
            </div>
            <p v-if="rule.description" class="text-sm text-gray-600 mb-2">{{ rule.description }}</p>
            <div class="text-sm">
              <p class="text-gray-700">
                <strong>Match:</strong> {{ rule.conditions.match_type === 'all' ? 'All conditions' : 'Any condition' }}
              </p>
              <p class="text-gray-700">
                <strong>Conditions:</strong> {{ rule.conditions.rules.length }} condition(s)
              </p>
              <p class="text-gray-700">
                <strong>Action:</strong> Assign to {{ rule.actions.assignee_type.replace('_', ' ') }}
              </p>
              <p class="text-gray-700">
                <strong>Priority:</strong> {{ rule.actions.priority }}
              </p>
              <p v-if="rule.times_matched > 0" class="text-gray-500 mt-1">
                Matched {{ rule.times_matched }} time(s)
                <span v-if="rule.last_matched_at">
                  (last: {{ new Date(rule.last_matched_at).toLocaleString() }})
                </span>
              </p>
            </div>
          </div>
          <div class="flex gap-2 ml-4">
            <button
              @click="editRule(rule)"
              class="btn btn-secondary btn-sm"
            >
              Edit
            </button>
            <button
              @click="deleteRule(rule.id)"
              class="btn btn-danger btn-sm"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Rule Modal -->
    <div
      v-if="showCreateModal || editingRule"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-start mb-4">
            <h2 class="text-xl font-bold">{{ editingRule ? 'Edit Rule' : 'Create Routing Rule' }}</h2>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div>
              <label class="label">Rule Name *</label>
              <input
                v-model="ruleForm.name"
                type="text"
                required
                class="input"
                placeholder="e.g., High Priority Email Tasks"
              />
            </div>

            <div>
              <label class="label">Description</label>
              <textarea
                v-model="ruleForm.description"
                rows="2"
                class="input"
                placeholder="Optional description"
              />
            </div>

            <div>
              <label class="label">Match Type *</label>
              <select v-model="ruleForm.conditions.match_type" class="input" required>
                <option value="all">All conditions must match</option>
                <option value="any">Any condition can match</option>
              </select>
            </div>

            <div>
              <label class="label">Conditions *</label>
              <div class="space-y-2">
                <div
                  v-for="(condition, index) in ruleForm.conditions.rules"
                  :key="index"
                  class="flex gap-2 items-end p-3 bg-gray-50 rounded"
                >
                  <div class="flex-1">
                    <select v-model="condition.field" class="input" required>
                      <option value="">Select field</option>
                      <option value="source_type">Source Type</option>
                      <option value="from_identifier">From (Email/Phone)</option>
                      <option value="subject">Subject</option>
                      <option value="body">Body Content</option>
                      <option value="extracted_data.category">Category</option>
                      <option value="extracted_data.sentiment">Sentiment</option>
                    </select>
                  </div>
                  <div class="flex-1">
                    <select v-model="condition.operator" class="input" required>
                      <option value="">Select operator</option>
                      <option value="equals">Equals</option>
                      <option value="contains">Contains</option>
                      <option value="starts_with">Starts With</option>
                      <option value="ends_with">Ends With</option>
                      <option value="regex">Matches Regex</option>
                    </select>
                  </div>
                  <div class="flex-1">
                    <input
                      v-model="condition.value"
                      type="text"
                      required
                      class="input"
                      placeholder="Value"
                    />
                  </div>
                  <button
                    type="button"
                    @click="removeCondition(index)"
                    class="btn btn-danger btn-sm"
                  >
                    Remove
                  </button>
                </div>
                <button
                  type="button"
                  @click="addCondition"
                  class="btn btn-secondary btn-sm"
                >
                  + Add Condition
                </button>
              </div>
            </div>

            <div>
              <label class="label">Actions</label>
              <div class="space-y-4">
                <div>
                  <label class="label">Assignee Type *</label>
                  <select v-model="ruleForm.actions.assignee_type" class="input" required>
                    <option value="self">Assign to me</option>
                    <option value="team_member">Assign to team member</option>
                    <option value="marketplace_human">Post to marketplace (human)</option>
                    <option value="marketplace_ai">Post to marketplace (AI tool)</option>
                  </select>
                </div>

                <div v-if="ruleForm.actions.assignee_type === 'team_member'">
                  <label class="label">Team Member</label>
                  <select v-model="ruleForm.actions.assignee_id" class="input">
                    <option value="">Select team member</option>
                    <option v-for="member in teamMembers" :key="member.id" :value="member.id">
                      {{ member.name }}
                    </option>
                  </select>
                </div>

                <div>
                  <label class="label">Task Priority *</label>
                  <select v-model="ruleForm.actions.priority" class="input" required>
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label class="label">Tags (comma-separated)</label>
                  <input
                    v-model="tagsInput"
                    type="text"
                    class="input"
                    placeholder="tag1, tag2, tag3"
                  />
                </div>

                <div>
                  <label class="label">Auto Response (optional)</label>
                  <textarea
                    v-model="ruleForm.actions.auto_response"
                    rows="3"
                    class="input"
                    placeholder="Auto response message to send"
                  />
                </div>
              </div>
            </div>

            <div class="flex items-center">
              <input
                id="is_active"
                v-model="ruleForm.is_active"
                type="checkbox"
                class="mr-2"
              />
              <label for="is_active" class="text-sm text-gray-700">Rule is active</label>
            </div>

            <div class="flex gap-2 pt-4 border-t">
              <button type="submit" :disabled="loading" class="btn btn-primary flex-1">
                {{ loading ? 'Saving...' : (editingRule ? 'Update Rule' : 'Create Rule') }}
              </button>
              <button type="button" @click="closeModal" class="btn btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRulesStore } from '@/stores/rules'
import { useTeamStore } from '@/stores/team'
import type { RoutingRule, RuleCondition, RuleActions } from '@/types'

const rulesStore = useRulesStore()
const teamStore = useTeamStore()

const loading = computed(() => rulesStore.loading)
const rules = computed(() => rulesStore.rules)
const teamMembers = computed(() => teamStore.teamMembers)

const sortedRules = computed(() => {
  return [...rules.value].sort((a, b) => a.priority - b.priority)
})

const showCreateModal = ref(false)
const editingRule = ref<RoutingRule | null>(null)
const tagsInput = ref('')

const ruleForm = ref<{
  name: string;
  description: string;
  is_active: boolean;
  conditions: {
    match_type: 'all' | 'any';
    rules: RuleCondition[];
  };
  actions: RuleActions;
}>({
  name: '',
  description: '',
  is_active: true,
  conditions: {
    match_type: 'all',
    rules: [],
  },
  actions: {
    create_task: true,
    assignee_type: 'self',
    assignee_id: '',
    priority: 'normal',
    notifications: [],
    auto_response: '',
    tags: [],
  },
})

onMounted(async () => {
  await rulesStore.fetchRules()
  await teamStore.fetchTeamMembers()
})

function addCondition() {
  ruleForm.value.conditions.rules.push({
    field: '',
    operator: '',
    value: '',
  })
}

function removeCondition(index: number) {
  ruleForm.value.conditions.rules.splice(index, 1)
}

function editRule(rule: RoutingRule) {
  editingRule.value = rule
  ruleForm.value = {
    name: rule.name,
    description: rule.description || '',
    is_active: rule.is_active,
    conditions: {
      match_type: rule.conditions.match_type,
      rules: [...rule.conditions.rules],
    },
    actions: {
      create_task: rule.actions.create_task,
      assignee_type: rule.actions.assignee_type,
      assignee_id: rule.actions.assignee_id || '',
      priority: rule.actions.priority,
      notifications: rule.actions.notifications || [],
      auto_response: rule.actions.auto_response || '',
      tags: rule.actions.tags || [],
    },
  }
  tagsInput.value = rule.actions.tags?.join(', ') || ''
  showCreateModal.value = true
}

function closeModal() {
  showCreateModal.value = false
  editingRule.value = null
  ruleForm.value = {
    name: '',
    description: '',
    is_active: true,
    conditions: {
      match_type: 'all',
      rules: [],
    },
    actions: {
      create_task: true,
      assignee_type: 'self',
      assignee_id: '',
      priority: 'normal',
      notifications: [],
      auto_response: '',
      tags: [],
    },
  }
  tagsInput.value = ''
}

async function handleSubmit() {
  if (ruleForm.value.conditions.rules.length === 0) {
    if ((window as any).$toast) {
      (window as any).$toast.error('Please add at least one condition')
    }
    return
  }

  const formData = {
    ...ruleForm.value,
    actions: {
      ...ruleForm.value.actions,
      tags: tagsInput.value
        ? tagsInput.value.split(',').map(t => t.trim()).filter(Boolean)
        : [],
    },
  }

  try {
    if (editingRule.value) {
      await rulesStore.updateRule(editingRule.value.id, formData)
      if ((window as any).$toast) {
        (window as any).$toast.success('Rule updated successfully')
      }
    } else {
      await rulesStore.createRule(formData)
      if ((window as any).$toast) {
        (window as any).$toast.success('Rule created successfully')
      }
    }
    closeModal()
  } catch (error) {
    // Error handled by API interceptor
  }
}

async function deleteRule(id: string) {
  if (!confirm('Are you sure you want to delete this rule?')) return
  
  try {
    await rulesStore.deleteRule(id)
    if ((window as any).$toast) {
      (window as any).$toast.success('Rule deleted successfully')
    }
  } catch (error) {
    // Error handled by API interceptor
  }
}
</script>
