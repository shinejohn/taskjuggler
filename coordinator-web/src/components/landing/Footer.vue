<template>
  <footer class="bg-slate-900 text-slate-300 pt-16 pb-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        <!-- Column 1 - Brand -->
        <div>
          <div class="flex items-center gap-2 mb-4">
            <div class="w-8 h-8 bg-[#1B4F72] rounded-lg flex items-center justify-center text-white font-bold text-sm">
              4C
            </div>
            <span class="text-xl font-heading font-bold text-white">
              4calls.ai
            </span>
          </div>
          <p class="text-sm text-slate-400 mb-4">
            AI virtual assistants that help small businesses never miss a call
            and grow faster.
          </p>
          <div class="flex gap-3">
            <a href="#" class="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-[#1B4F72] transition-colors">
              <Twitter :size="16" />
            </a>
            <a href="#" class="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-[#1B4F72] transition-colors">
              <Linkedin :size="16" />
            </a>
            <a href="#" class="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-[#1B4F72] transition-colors">
              <Github :size="16" />
            </a>
          </div>
        </div>

        <!-- Column 2 - Product -->
        <div>
          <h4 class="text-white font-semibold mb-4">Product</h4>
          <ul class="space-y-2 text-sm">
            <li>
              <a href="#features" class="hover:text-white transition-colors">
                Features
              </a>
            </li>
            <li>
              <a href="#pricing" class="hover:text-white transition-colors">
                Pricing
              </a>
            </li>
            <li>
              <a href="#industries" class="hover:text-white transition-colors">
                Industries
              </a>
            </li>
            <li>
              <a href="#" class="hover:text-white transition-colors">
                Integrations
              </a>
            </li>
            <li>
              <a href="#" class="hover:text-white transition-colors">
                API
              </a>
            </li>
          </ul>
        </div>

        <!-- Column 3 - Company -->
        <div>
          <h4 class="text-white font-semibold mb-4">Company</h4>
          <ul class="space-y-2 text-sm">
            <li>
              <a href="#about" class="hover:text-white transition-colors">
                About
              </a>
            </li>
            <li>
              <a href="#" class="hover:text-white transition-colors">
                Blog
              </a>
            </li>
            <li>
              <a href="#" class="hover:text-white transition-colors">
                Careers
              </a>
            </li>
            <li>
              <a href="#" class="hover:text-white transition-colors">
                Contact
              </a>
            </li>
            <li>
              <a href="#" class="hover:text-white transition-colors">
                Press Kit
              </a>
            </li>
          </ul>
        </div>

        <!-- Column 4 - Resources -->
        <div>
          <h4 class="text-white font-semibold mb-4">Resources</h4>
          <ul class="space-y-2 text-sm">
            <li>
              <a href="#" class="hover:text-white transition-colors">
                Help Center
              </a>
            </li>
            <li>
              <a href="#" class="hover:text-white transition-colors">
                API Docs
              </a>
            </li>
            <li>
              <a href="#" class="hover:text-white transition-colors">
                System Status
              </a>
            </li>
            <li>
              <a href="#" class="hover:text-white transition-colors">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" class="hover:text-white transition-colors">
                Terms of Service
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="pt-8 border-t border-slate-800 text-sm text-slate-400 text-center">
        <p>© 2025 4calls.ai. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { Twitter, Linkedin, Github } from 'lucide-vue-next';
</script>

