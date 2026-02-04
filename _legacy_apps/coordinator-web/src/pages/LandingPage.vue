<template>
  <div class="min-h-screen bg-white">
    <Navigation />
    <HeroSection />

    <!-- Social Proof Bar -->
    <section class="py-12 bg-white border-y border-slate-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <p class="text-slate-500 mb-6">
            Trusted by 500+ small businesses
          </p>
          <div class="flex flex-wrap justify-center items-center gap-8 opacity-50">
            <div v-for="(emoji, i) in industryEmojis" :key="i" class="text-4xl">
              {{ emoji }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <PersonaShowcase />

    <!-- How It Works -->
    <section class="py-24 bg-slate-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-heading font-bold text-[#1B4F72] mb-4">
            Live in 60 Seconds. Seriously.
          </h2>
          <p class="text-xl text-slate-600">
            The fastest setup in the industry
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div
            v-for="(step, i) in howItWorksSteps"
            :key="i"
            class="text-center"
          >
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#1B4F72] text-white font-bold text-2xl mb-6">
              {{ step.step }}
            </div>
            <div class="mb-4">
              <component :is="step.icon" :size="48" class="mx-auto text-[#F59E0B]" :stroke-width="1.5" />
            </div>
            <h3 class="text-xl font-bold text-slate-900 mb-3">
              {{ step.title }}
            </h3>
            <p class="text-slate-600">{{ step.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section id="features" class="py-24 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-heading font-bold text-[#1B4F72] mb-4">
            Everything Works Together
          </h2>
          <p class="text-xl text-slate-600">
            No integrations. No Zapier. No headaches.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="(feature, i) in features"
            :key="i"
            class="p-6 rounded-xl border-2 border-slate-100 hover:border-[#1B4F72] hover:shadow-lg transition-all duration-300"
          >
            <div class="w-12 h-12 rounded-lg bg-blue-50 text-[#1B4F72] flex items-center justify-center mb-4">
              <component :is="feature.icon" :size="24" />
            </div>
            <h3 class="text-lg font-bold text-slate-900 mb-2">
              {{ feature.title }}
            </h3>
            <p class="text-slate-600 text-sm">{{ feature.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Industries -->
    <section id="industries" class="py-24 bg-slate-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-heading font-bold text-[#1B4F72] mb-4">
            Built for Your Industry
          </h2>
          <p class="text-xl text-slate-600">
            4 Calls trained for specific business types
          </p>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            v-for="(industry, i) in industries"
            :key="i"
            class="p-6 bg-white rounded-xl border-2 border-slate-100 hover:border-[#1B4F72] hover:shadow-lg transition-all duration-300 text-center group"
          >
            <div class="text-4xl mb-3 group-hover:scale-110 transition-transform">
              {{ industry.emoji }}
            </div>
            <p class="font-medium text-slate-900">{{ industry.name }}</p>
          </button>
        </div>
      </div>
    </section>

    <PricingSection />

    <!-- Testimonials -->
    <section class="py-24 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-heading font-bold text-[#1B4F72] mb-4">
            What Business Owners Say
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            v-for="(testimonial, i) in testimonials"
            :key="i"
            class="bg-slate-50 rounded-2xl p-8 border-2 border-slate-100"
          >
            <div class="flex gap-1 mb-4">
              <Star v-for="j in 5" :key="j" :size="16" fill="#F59E0B" class="text-[#F59E0B]" />
            </div>
            <p class="text-slate-700 mb-6 italic">
              "{{ testimonial.quote }}"
            </p>
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-2xl">
                {{ testimonial.avatar }}
              </div>
              <div>
                <p class="font-semibold text-slate-900">
                  {{ testimonial.name }}
                </p>
                <p class="text-sm text-slate-500">
                  {{ testimonial.business }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Final CTA -->
    <section class="py-24 bg-gradient-to-br from-[#1B4F72] to-[#2563EB] text-white">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-4xl md:text-5xl font-heading font-bold mb-4">
          Ready to Hire Your First 4 Call?
        </h2>
        <p class="text-xl text-blue-100 mb-8">
          Join 500+ businesses already saving time and never missing calls.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <router-link
            to="/register"
            class="px-8 py-4 bg-[#F59E0B] hover:bg-[#D97706] text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 text-lg"
          >
            Start Your Free Trial
          </router-link>
          <button class="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-2">
            Or schedule a demo
            <ArrowRight :size="20" />
          </button>
        </div>
        <p class="text-blue-100 text-sm">
          14-day free trial · No credit card · Setup in 60 seconds
        </p>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { Users, ClipboardCheck, Rocket, Calendar, MessageSquare, Lightbulb, Clock, Brain, Star, ArrowRight } from 'lucide-vue-next';
import Navigation from '@/components/landing/Navigation.vue';
import HeroSection from '@/components/landing/HeroSection.vue';
import PersonaShowcase from '@/components/landing/PersonaShowcase.vue';
import PricingSection from '@/components/landing/PricingSection.vue';
import Footer from '@/components/landing/Footer.vue';

const industryEmojis = ['🦷', '🔧', '🍽️', '⚖️', '✂️', '🏠', '🚗', '💼'];

const howItWorksSteps = [
  {
    step: '1',
    icon: Users,
    title: 'Choose Your 4 Call',
    description: 'Pick the role you need — Receptionist, Scheduler, Collector, or more. Each is trained for specific tasks.',
  },
  {
    step: '2',
    icon: ClipboardCheck,
    title: 'Quick Business Setup',
    description: 'Answer 5-7 questions about your business. We automatically create your FAQ and knowledge base.',
  },
  {
    step: '3',
    icon: Rocket,
    title: 'Go Live',
    description: 'Forward your phone and start receiving calls. Your 4 Call is ready to work.',
  },
];

const features = [
  {
    icon: Users,
    title: 'Built-In CRM',
    desc: 'Customer database, interaction history, and follow-up tracking included.',
  },
  {
    icon: Calendar,
    title: 'Built-In Calendar',
    desc: 'Appointment scheduling, availability management, and automatic reminders.',
  },
  {
    icon: MessageSquare,
    title: 'Voice, Text & Email',
    desc: 'Inbound and outbound communication across all channels.',
  },
  {
    icon: Lightbulb,
    title: 'Industry Intelligence',
    desc: "Each 4 Call knows your industry's terminology and workflows.",
  },
  {
    icon: Clock,
    title: '24/7 Availability',
    desc: 'Never miss a call, even nights, weekends, and holidays.',
  },
  {
    icon: Brain,
    title: 'Real Conversations',
    desc: 'Natural AI that handles complex questions, not just scripted responses.',
  },
];

const industries = [
  { name: 'Dental Practices', emoji: '🦷' },
  { name: 'Medical Offices', emoji: '🏥' },
  { name: 'Plumbing & HVAC', emoji: '🔧' },
  { name: 'Restaurants', emoji: '🍽️' },
  { name: 'Law Firms', emoji: '⚖️' },
  { name: 'Salons & Spas', emoji: '✂️' },
  { name: 'Auto Repair', emoji: '🚗' },
  { name: 'Real Estate', emoji: '🏠' },
];

const testimonials = [
  {
    quote: 'Sally has answered over 2,000 calls for us. Our patients love her, and we never miss a call anymore.',
    name: 'Dr. Sarah Chen',
    business: 'Bright Smile Dental',
    avatar: '👩‍⚕️',
  },
  {
    quote: 'We hired Ed to confirm appointments. No-shows dropped from 25% to 8% in the first month.',
    name: 'Mike Rodriguez',
    business: 'Rodriguez Plumbing',
    avatar: '👨‍🔧',
  },
  {
    quote: 'Marcus recovered $15,000 in overdue invoices in 60 days. Paid for itself 10x over.',
    name: 'Jennifer Walsh',
    business: 'Walsh Accounting',
    avatar: '👩‍💼',
  },
];
</script>
