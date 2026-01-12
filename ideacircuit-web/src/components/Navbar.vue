<template>
  <nav class="glass-subtle py-4 px-6 lg:px-12 sticky top-0 z-50 border-b border-border transition-all duration-normal">
    <div class="max-w-7xl mx-auto">
      <div class="flex justify-between items-center">
        <div class="flex items-center">
          <router-link to="/" class="text-display-small font-bold text-primary hover:text-primary-hover transition-colors duration-fast">
            IdeaCircuit
          </router-link>
        </div>
        <div class="hidden md:flex items-center space-x-8">
          <a href="#features" class="text-text-secondary hover:text-primary font-medium text-body-medium transition-colors duration-fast">
            Features
          </a>
          <a href="#pricing" class="text-text-secondary hover:text-primary font-medium text-body-medium transition-colors duration-fast">
            Pricing
          </a>
          <a href="#testimonials" class="text-text-secondary hover:text-primary font-medium text-body-medium transition-colors duration-fast">
            Reviews
          </a>
          <!-- Application Pages -->
          <div class="flex items-center space-x-4 border-l border-border pl-4">
            <router-link 
              to="/presentation" 
              class="flex items-center space-x-1 text-text-secondary hover:text-primary font-medium text-body-medium transition-colors duration-fast"
            >
              <PresentationIcon :size="16" />
              <span>Presentation</span>
            </router-link>
            <router-link 
              to="/report" 
              class="flex items-center space-x-1 text-text-secondary hover:text-primary font-medium text-body-medium transition-colors duration-fast"
            >
              <BarChart2Icon :size="16" />
              <span>Reports</span>
            </router-link>
            <router-link 
              v-if="isAuthenticated"
              to="/profile" 
              class="flex items-center space-x-1 text-text-secondary hover:text-primary font-medium text-body-medium transition-colors duration-fast"
            >
              <UserIcon :size="16" />
              <span>Profile</span>
            </router-link>
            <router-link 
              v-else
              to="/login" 
              class="flex items-center space-x-1 text-text-secondary hover:text-primary font-medium text-body-medium transition-colors duration-fast"
            >
              <UserIcon :size="16" />
              <span>Login</span>
            </router-link>
          </div>
          <Button
            v-if="!isAuthenticated"
            as-child
            variant="default"
            class="min-h-[44px]"
          >
            <router-link to="/signup">
              Get Started
            </router-link>
          </Button>
        </div>
        <div class="md:hidden">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            class="min-h-[44px] min-w-[44px]"
            @click="isMenuOpen = !isMenuOpen"
            aria-label="Toggle menu"
          >
            <XIcon v-if="isMenuOpen" :size="24" />
            <MenuIcon v-else :size="24" />
          </Button>
        </div>
      </div>
      
      <!-- Mobile menu -->
      <div v-if="isMenuOpen" class="md:hidden mt-4 glass-subtle border-t border-border pt-4">
        <div class="flex flex-col space-y-4 pb-4">
          <a 
            href="#features" 
            class="text-text-secondary hover:text-primary font-medium text-body-medium transition-colors duration-fast" 
            @click="isMenuOpen = false"
          >
            Features
          </a>
          <a 
            href="#pricing" 
            class="text-text-secondary hover:text-primary font-medium text-body-medium transition-colors duration-fast" 
            @click="isMenuOpen = false"
          >
            Pricing
          </a>
          <a 
            href="#testimonials" 
            class="text-text-secondary hover:text-primary font-medium text-body-medium transition-colors duration-fast" 
            @click="isMenuOpen = false"
          >
            Reviews
          </a>
          <!-- Application Pages -->
          <div class="border-t border-border pt-4">
            <div class="text-caption font-semibold text-text-tertiary mb-2">Application</div>
            <router-link 
              to="/presentation" 
              class="flex items-center space-x-2 text-text-secondary hover:text-primary font-medium text-body-medium py-2 transition-colors duration-fast" 
              @click="isMenuOpen = false"
            >
              <PresentationIcon :size="16" />
              <span>Presentation</span>
            </router-link>
            <router-link 
              to="/report" 
              class="flex items-center space-x-2 text-text-secondary hover:text-primary font-medium text-body-medium py-2 transition-colors duration-fast" 
              @click="isMenuOpen = false"
            >
              <BarChart2Icon :size="16" />
              <span>Reports</span>
            </router-link>
            <router-link 
              v-if="isAuthenticated"
              to="/profile" 
              class="flex items-center space-x-2 text-text-secondary hover:text-primary font-medium text-body-medium py-2 transition-colors duration-fast" 
              @click="isMenuOpen = false"
            >
              <UserIcon :size="16" />
              <span>Profile</span>
            </router-link>
            <router-link 
              v-else
              to="/login" 
              class="flex items-center space-x-2 text-text-secondary hover:text-primary font-medium text-body-medium py-2 transition-colors duration-fast" 
              @click="isMenuOpen = false"
            >
              <UserIcon :size="16" />
              <span>Login</span>
            </router-link>
          </div>
          <Button
            v-if="!isAuthenticated"
            as-child
            variant="default"
            class="min-h-[44px]"
            @click="isMenuOpen = false"
          >
            <router-link to="/signup">
              Get Started
            </router-link>
          </Button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { MenuIcon, XIcon, PresentationIcon, BarChart2Icon, UserIcon } from 'lucide-vue-next';
import { useAuth } from '@/composables/useAuth';
import { Button } from '@/components/ui';

const { isAuthenticated } = useAuth();
const isMenuOpen = ref(false);
</script>

