<template>
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-slate-200">
      <thead class="bg-slate-50">
        <tr>
          <th v-for="col in columns" :key="col.key" 
              class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700"
              @click="$emit('sort', col.key)">
            {{ col.label }}
          </th>
          <th v-if="$slots.actions" class="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-slate-200">
        <tr v-for="(row, idx) in data" :key="idx" class="hover:bg-slate-50 transition-colors">
          <td v-for="col in columns" :key="col.key" class="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
             <slot :name="`cell-${col.key}`" :row="row">
                 {{ row[col.key] }}
             </slot>
          </td>
          <td v-if="$slots.actions" class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
             <slot name="actions" :row="row"></slot>
          </td>
        </tr>
        <tr v-if="data.length === 0">
            <td :colspan="columns.length + ($slots.actions ? 1 : 0)" class="px-6 py-12 text-center text-slate-500">
                <slot name="empty">No data available</slot>
            </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
defineProps<{
    columns: { key: string; label: string }[];
    data: any[];
}>();

defineEmits(['sort']);
</script>
