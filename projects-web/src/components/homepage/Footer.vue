<template>
  <footer class="bg-slate-900 text-slate-400 py-16 border-t border-slate-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
        <div v-for="(col, index) in columns" :key="index">
          <h3 class="text-white font-bold mb-4">{{ col.title }}</h3>
          <ul class="space-y-2">
            <li v-for="(link, i) in col.links" :key="i">
              <a href="#" class="hover:text-cyan-400 transition-colors">
                {{ link }}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div
        class="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4"
      >
        <div class="flex items-center gap-2">
          <span class="text-white font-bold">4 Projects.ai</span>
        </div>

        <div class="text-sm">Copyright © 2025 4 Projects Inc.</div>

        <div class="flex gap-4">
          <a href="#" class="hover:text-white transition-colors"> Twitter </a>
          <a href="#" class="hover:text-white transition-colors"> LinkedIn </a>
          <a href="#" class="hover:text-white transition-colors"> YouTube </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const columns = [
  {
    title: 'Product',
    links: [
      'Features',
      'Pricing',
      'Integrations',
      'API Documentation',
      "What's New",
    ],
  },
  {
    title: 'Resources',
    links: [
      'Help Center',
      'Community Forum',
      'Blog',
      'Case Studies',
      'TEF Specification',
    ],
  },
  {
    title: 'Company',
    links: ['About Us', 'Careers', 'Press', 'Contact'],
  },
  {
    title: 'Legal',
    links: [
      'Privacy Policy',
      'Terms of Service',
      'Cookie Policy',
      'GDPR',
      'Security',
    ],
  },
]
</script>

