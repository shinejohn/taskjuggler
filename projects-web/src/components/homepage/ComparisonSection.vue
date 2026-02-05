<template>
  <section class="py-24 bg-slate-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          Why Teams Switch to 4 Projects
        </h2>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full min-w-[800px]">
          <thead>
            <tr>
              <th class="p-4 text-left text-slate-500 font-medium">Feature</th>
              <th class="p-4 text-center bg-indigo-50 rounded-t-xl">
                <span class="text-indigo-600 font-bold text-lg"> 4 Projects </span>
              </th>
              <th
                v-for="comp in competitors"
                :key="comp"
                class="p-4 text-center text-slate-500 font-medium"
              >
                {{ comp }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(feature, index) in features"
              :key="index"
              class="border-b border-slate-200"
            >
              <td class="p-4 text-slate-900 font-medium">
                {{ feature.name }}
              </td>
              <td class="p-4 text-center bg-indigo-50">
                <div class="flex justify-center">
                  <div
                    class="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center"
                  >
                    ✓
                  </div>
                </div>
              </td>
              <td
                v-for="(val, i) in feature.others"
                :key="i"
                class="p-4 text-center text-slate-400"
              >
                {{ val ? '✓' : '—' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="text-center mt-12">
        <p class="text-xl font-medium text-slate-900">
          Stop fighting your tools. Start shipping your work.
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const competitors = ['Asana', 'Monday', 'Jira', 'Wrike']

const features = [
  {
    name: 'Voice Task Creation',
    us: true,
    others: [false, false, false, false],
  },
  {
    name: 'SMS Integration',
    us: true,
    others: [false, false, false, false],
  },
  {
    name: 'Task Exchange Format',
    us: true,
    others: [false, false, false, false],
  },
  {
    name: 'Question Forum',
    us: true,
    others: [false, false, false, false],
  },
  {
    name: 'Requestor/Owner Model',
    us: true,
    others: [false, false, true, false],
  },
  {
    name: 'Complete Audit Trail',
    us: true,
    others: [true, true, true, true],
  },
]
</script>

