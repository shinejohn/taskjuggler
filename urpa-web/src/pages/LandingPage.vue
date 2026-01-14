<template>
  <div class="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden font-sans">
    <!-- Animated Background Elements -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden">
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse" />
      <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s" />
      <div class="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style="animation-delay: 2s" />
    </div>

    <!-- Navigation Bar -->
    <nav class="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b-2 border-slate-800">
      <div class="max-w-7xl mx-auto px-6 h-20">
        <div class="flex items-center justify-between h-full">
          <!-- Logo -->
          <div class="flex items-center gap-2 cursor-pointer" @click="scrollToTop">
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-blue-600 shadow-lg shadow-teal-500/20">
              <Command class="h-7 w-7 text-white" />
            </div>
            <span class="text-2xl font-bold tracking-tight text-white">
              URPa<span class="text-teal-400">.ai</span>
            </span>
          </div>

          <!-- Desktop Nav -->
          <div class="hidden md:flex items-center gap-8">
            <a
              v-for="item in navItems"
              :key="item"
              :href="`#${item.toLowerCase()}`"
              class="text-slate-300 font-semibold text-lg hover:text-teal-400 transition-colors"
            >
              {{ item }}
            </a>
          </div>

          <!-- CTA Buttons -->
          <div class="hidden md:flex items-center gap-4">
            <router-link
              to="/login"
              class="text-slate-300 font-semibold hover:text-teal-400 transition-colors"
            >
              Log In
            </router-link>
            <Button
              @click="handleGetStarted"
              class="px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white font-bold rounded-full shadow-lg shadow-teal-500/30 hover:shadow-xl hover:shadow-teal-500/40 transition-all"
            >
              Start Free Trial
            </Button>
          </div>

          <!-- Mobile Menu Button -->
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="md:hidden p-2 text-slate-300"
          >
            <Menu v-if="!mobileMenuOpen" class="h-8 w-8" />
            <X v-else class="h-8 w-8" />
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <Transition name="slide-down">
        <div v-if="mobileMenuOpen" class="md:hidden bg-slate-950 border-b-2 border-slate-800">
          <div class="px-6 py-6 space-y-4">
            <a
              v-for="item in navItems"
              :key="item"
              :href="`#${item.toLowerCase()}`"
              class="block text-xl font-bold text-slate-300"
              @click="mobileMenuOpen = false"
            >
              {{ item }}
            </a>
            <div class="pt-4 space-y-3">
              <router-link
                to="/login"
                class="block w-full py-3 bg-slate-800 text-slate-300 font-bold rounded-xl text-center"
                @click="mobileMenuOpen = false"
              >
                Log In
              </router-link>
              <Button
                @click="handleGetStarted"
                class="w-full py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white font-bold rounded-xl shadow-lg"
              >
                Start Free Trial
              </Button>
            </div>
          </div>
        </div>
      </Transition>
    </nav>

    <!-- Hero Section -->
    <section class="relative min-h-screen flex items-center justify-center pt-32 pb-20 px-6 overflow-hidden">
      <div class="relative z-10 max-w-5xl mx-auto text-center">
        <!-- Badge -->
        <div class="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-teal-500/10 border-2 border-teal-500/50 text-teal-400 font-bold mb-8 shadow-lg backdrop-blur-sm">
          <Sparkles class="h-5 w-5" />
          <span>Now with AI Phone Assistant</span>
        </div>

        <!-- Headline -->
        <h1 class="text-6xl md:text-8xl font-black mb-8 leading-tight tracking-tight text-white">
          Your AI-Powered<br />
          <span class="relative inline-block">
            <span class="relative z-10 bg-gradient-to-r from-teal-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Command Center
            </span>
          </span>
        </h1>

        <!-- Subheadline -->
        <p class="text-2xl text-slate-300 mb-12 max-w-3xl mx-auto font-medium leading-relaxed">
          One dashboard. Every conversation. Email, calls, texts, calendar, tasks — all managed by your personal AI assistant.
        </p>

        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
          <Button
            size="lg"
            @click="handleGetStarted"
            class="px-10 py-5 bg-gradient-to-r from-teal-600 to-blue-600 text-white font-black rounded-full shadow-xl shadow-teal-500/30 text-xl hover:shadow-2xl hover:shadow-teal-500/40 transition-all"
          >
            Get Started for Free
          </Button>
          <Button
            variant="outline"
            size="lg"
            @click="handleWatchDemo"
            class="px-10 py-5 bg-slate-800/50 text-white font-bold rounded-full border-2 border-slate-700 shadow-lg text-xl flex items-center gap-3 hover:border-teal-500 hover:text-teal-400"
          >
            <Play class="h-6 w-6 fill-current" />
            Watch Demo
          </Button>
        </div>

        <!-- Social Proof -->
        <div class="flex flex-col items-center gap-4">
          <div class="flex items-center -space-x-4">
            <div
              v-for="i in 5"
              :key="i"
              :class="['h-12 w-12 rounded-full border-4 border-slate-800 flex items-center justify-center text-white font-bold text-sm shadow-md', avatarColors[i - 1]]"
            >
              {{ String.fromCharCode(65 + i - 1) }}
            </div>
            <div class="h-12 w-12 rounded-full bg-slate-800 border-4 border-slate-800 flex items-center justify-center text-slate-300 font-bold text-xs shadow-md">
              +2k
            </div>
          </div>
          <p class="text-slate-400 font-semibold">
            Trusted by 2,000+ professionals
          </p>
        </div>
      </div>
    </section>

    <!-- Trust Bar -->
    <section class="py-12 bg-slate-900/50 border-y-2 border-slate-800">
      <div class="max-w-7xl mx-auto px-6">
        <p class="text-center text-slate-400 mb-8 font-bold uppercase tracking-widest text-sm">
          Integrates with your favorite tools
        </p>
        <div class="flex flex-wrap items-center justify-center gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          <div
            v-for="tool in integrationLogos"
            :key="tool"
            class="text-slate-300 font-black text-2xl cursor-pointer hover:text-teal-400 transition-colors"
          >
            {{ tool }}
          </div>
        </div>
      </div>
    </section>

    <!-- Problem/Solution -->
    <section class="py-32 px-6">
      <div class="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <!-- Problem -->
        <Card class="bg-red-500/10 border-2 border-red-500/30 p-10 rounded-[3rem] relative">
          <div class="absolute -top-6 -left-6 text-6xl animate-bounce">😫</div>
          <CardContent class="p-0">
            <h3 class="text-3xl font-black text-red-400 mb-6">The Old Way</h3>
            <ul class="space-y-4 text-lg text-slate-300 font-medium">
              <li class="flex items-center gap-3">
                <X class="text-red-400 h-6 w-6" /> Too many notifications
              </li>
              <li class="flex items-center gap-3">
                <X class="text-red-400 h-6 w-6" /> Missed important calls
              </li>
              <li class="flex items-center gap-3">
                <X class="text-red-400 h-6 w-6" /> Inbox anxiety (it's real!)
              </li>
              <li class="flex items-center gap-3">
                <X class="text-red-400 h-6 w-6" /> Boring admin work
              </li>
            </ul>
          </CardContent>
        </Card>

        <!-- Solution -->
        <Card class="bg-teal-500/10 border-2 border-teal-500/30 p-10 rounded-[3rem] relative shadow-xl">
          <div class="absolute -top-6 -right-6 text-6xl animate-bounce" style="animation-delay: 1s">✨</div>
          <CardContent class="p-0">
            <h3 class="text-3xl font-black text-teal-400 mb-6">The URPA Way</h3>
            <ul class="space-y-4 text-lg text-slate-300 font-medium">
              <li class="flex items-center gap-3">
                <Check class="text-teal-400 h-6 w-6" /> One unified feed
              </li>
              <li class="flex items-center gap-3">
                <Check class="text-teal-400 h-6 w-6" /> AI answers your phone
              </li>
              <li class="flex items-center gap-3">
                <Check class="text-teal-400 h-6 w-6" /> Zero stress, max productivity
              </li>
              <li class="flex items-center gap-3">
                <Check class="text-teal-400 h-6 w-6" /> Focus on what matters
              </li>
            </ul>
            <Button
              @click="scrollToFeatures"
              class="mt-8 px-8 py-4 bg-teal-600 text-white font-bold rounded-2xl shadow-lg shadow-teal-500/20 hover:shadow-xl hover:shadow-teal-500/30 transition-all"
            >
              See How It Works
              <ArrowRight class="inline h-5 w-5 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>

    <!-- Features Grid -->
    <section id="features" class="py-32 px-6 bg-slate-900/30 relative overflow-hidden">
      <div class="max-w-7xl mx-auto relative z-10">
        <h2 class="text-5xl md:text-6xl font-black mb-6 text-center text-white">
          Everything You Need<br />
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-400">
            In One Intelligent Hub
          </span>
        </h2>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-20">
          <Card
            v-for="feature in features"
            :key="feature.title"
            class="bg-slate-800/50 backdrop-blur-xl p-8 rounded-[2rem] border-2 border-slate-700 hover:border-teal-500/50 shadow-xl hover:shadow-2xl transition-all group relative overflow-hidden"
          >
            <div
              :class="['absolute top-0 right-0 w-32 h-32 rounded-bl-[4rem] -mr-8 -mt-8 transition-transform group-hover:scale-150', feature.lightColor]"
            />
            <CardContent class="p-0 relative z-10">
              <div
                v-if="feature.badge"
                class="absolute top-6 right-6 px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-bold z-10"
              >
                {{ feature.badge }}
              </div>
              <div
                :class="['h-16 w-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg transform group-hover:rotate-12 transition-transform', feature.color]"
              >
                <component :is="feature.icon" class="h-8 w-8 text-white" />
              </div>
              <h3 :class="['text-2xl font-black mb-3', feature.textColor]">
                {{ feature.title }}
              </h3>
              <p class="text-slate-400 font-medium leading-relaxed text-lg">
                {{ feature.description }}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>

    <!-- AI Assistant Showcase -->
    <section class="py-32 px-6">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16">
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/50 text-purple-400 font-bold mb-6">
            <Bot class="h-5 w-5" />
            <span>Meet ARIA</span>
          </div>
          <h2 class="text-5xl md:text-6xl font-black mb-6 text-white">
            An Assistant That<br />
            Actually Gets You
          </h2>
          <p class="text-2xl text-slate-400 max-w-2xl mx-auto font-medium">
            ARIA learns your communication style, knows your schedule, and handles the busywork so you can focus on what matters.
          </p>
        </div>

        <div class="grid lg:grid-cols-12 gap-12 items-center">
          <!-- Left Column: Controls -->
          <div class="lg:col-span-4 space-y-4">
            <button
              v-for="tab in showcaseTabs"
              :key="tab.id"
              @click="activeShowcase = tab.id"
              :class="['w-full text-left p-6 rounded-3xl transition-all duration-300 border-2', activeShowcase === tab.id ? 'bg-slate-800 border-teal-500 shadow-xl scale-105 z-10' : 'bg-slate-900/50 border-transparent hover:bg-slate-800 hover:border-slate-700']"
            >
              <div class="flex items-center gap-4">
                <div :class="['p-4 rounded-2xl', activeShowcase === tab.id ? tab.bg : 'bg-slate-700']">
                  <component :is="tab.icon" :class="['h-6 w-6', activeShowcase === tab.id ? tab.color : 'text-slate-400']" />
                </div>
                <div>
                  <h3 :class="['font-bold text-xl', activeShowcase === tab.id ? 'text-white' : 'text-slate-400']">
                    {{ tab.label }}
                  </h3>
                </div>
              </div>
            </button>
          </div>

          <!-- Right Column: Interactive Visual -->
          <div class="lg:col-span-8">
            <div class="relative aspect-[16/9] bg-slate-900 rounded-[2.5rem] border-8 border-slate-800 overflow-hidden shadow-2xl ring-4 ring-slate-700">
              <!-- Window Controls -->
              <div class="absolute top-0 left-0 right-0 h-12 bg-slate-800 flex items-center px-6 gap-2">
                <div class="h-3 w-3 rounded-full bg-red-400" />
                <div class="h-3 w-3 rounded-full bg-yellow-400" />
                <div class="h-3 w-3 rounded-full bg-green-400" />
              </div>

              <!-- Content Area -->
              <div class="absolute top-12 inset-0 p-8 flex items-center justify-center bg-slate-800">
                <Transition name="fade-slide" mode="out-in">
                  <!-- Inbox View -->
                  <div v-if="activeShowcase === 'inbox'" key="inbox" class="w-full max-w-md space-y-4">
                    <div
                      v-for="i in 3"
                      :key="i"
                      class="bg-slate-700 p-4 rounded-2xl flex gap-4 items-center hover:bg-slate-600 transition-colors cursor-pointer"
                    >
                      <div
                        :class="['h-10 w-10 rounded-full flex-shrink-0', i === 1 ? 'bg-pink-500' : i === 2 ? 'bg-blue-500' : 'bg-green-500']"
                      />
                      <div class="flex-1 space-y-2">
                        <div class="h-3 w-24 bg-slate-500 rounded-full" />
                        <div class="h-2 w-full bg-slate-600 rounded-full" />
                      </div>
                    </div>
                    <div class="bg-gradient-to-r from-pink-500 to-purple-600 p-6 rounded-2xl text-white shadow-lg">
                      <div class="flex items-center gap-2 mb-2 font-bold">
                        <Sparkles class="h-5 w-5" />
                        ARIA Suggestion
                      </div>
                      <p class="text-sm opacity-90">
                        "I drafted a reply to Sarah! Want me to send it?"
                      </p>
                    </div>
                  </div>

                  <!-- Calendar View -->
                  <div v-else-if="activeShowcase === 'calendar'" key="calendar" class="w-full h-full p-4 grid grid-cols-7 gap-3">
                    <div
                      v-for="i in 28"
                      :key="i"
                      :class="['rounded-lg', i === 14 ? 'bg-purple-500 animate-pulse' : 'bg-slate-700/50']"
                    />
                    <div class="absolute inset-x-12 bottom-12 bg-white text-slate-900 p-6 rounded-2xl shadow-xl flex items-center gap-4">
                      <div class="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                        <Bot class="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <p class="font-bold">Conflict Detected!</p>
                        <p class="text-sm text-slate-500">Moving "Meeting" to 3 PM.</p>
                      </div>
                    </div>
                  </div>

                  <!-- Voice View -->
                  <div v-else-if="activeShowcase === 'voice'" key="voice" class="flex flex-col items-center justify-center h-full">
                    <div class="relative">
                      <div
                        v-for="i in 3"
                        :key="i"
                        class="absolute inset-0 rounded-full bg-pink-500/30 animate-ping"
                        :style="{ animationDelay: `${i * 0.6}s`, animationDuration: '2s' }"
                      />
                      <div class="relative h-32 w-32 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-2xl z-10">
                        <Phone class="h-12 w-12 text-white animate-bounce" />
                      </div>
                    </div>
                    <h3 class="mt-8 text-2xl font-bold text-white">Incoming Call...</h3>
                    <p class="text-slate-400">ARIA is handling it</p>
                  </div>
                </Transition>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section class="py-32 px-6 bg-slate-900/30">
      <div class="max-w-7xl mx-auto">
        <h2 class="text-5xl md:text-6xl font-black mb-16 text-center text-white">
          Up and Running in 5 Minutes
        </h2>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div
            v-for="(step, index) in steps"
            :key="index"
            class="flex flex-col items-center text-center"
          >
            <div class="w-16 h-16 rounded-full bg-gradient-to-r from-teal-600 to-blue-600 flex items-center justify-center text-white text-2xl font-bold mb-6 shadow-lg">
              {{ index + 1 }}
            </div>
            <div class="text-4xl mb-4">{{ step.icon }}</div>
            <h3 class="text-xl font-bold text-white mb-3">{{ step.title }}</h3>
            <p class="text-slate-400 leading-relaxed">{{ step.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Phone Assistant Feature Section -->
    <section class="py-32 px-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
      <div class="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <!-- Left Content -->
        <div>
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/50 text-red-400 font-bold mb-6">
            Premium Add-on
          </div>
          <h2 class="text-5xl md:text-6xl font-black mb-6 text-white">
            Never Miss Another<br />
            Important Call
          </h2>
          <p class="text-xl text-slate-300 mb-8 leading-relaxed">
            Your AI phone assistant answers calls 24/7, schedules appointments, takes detailed messages, and only interrupts you when it truly matters.
          </p>
          <ul class="space-y-4 mb-8">
            <li
              v-for="feature in phoneFeatures"
              :key="feature"
              class="flex items-center gap-3 text-lg text-slate-300"
            >
              <Check class="h-6 w-6 text-teal-400 flex-shrink-0" />
              {{ feature }}
            </li>
          </ul>
          <Button
            size="lg"
            @click="handleGetStarted"
            class="px-8 py-4 bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold rounded-xl shadow-lg shadow-red-500/30"
          >
            Add Phone Assistant - $49/mo
          </Button>
        </div>

        <!-- Right Visual -->
        <div class="relative">
          <div class="bg-slate-800 rounded-3xl p-8 border-2 border-slate-700 shadow-2xl">
            <div class="aspect-[9/16] bg-slate-900 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden">
              <div class="absolute inset-0 bg-gradient-to-br from-red-500/20 to-rose-500/20" />
              <div class="relative z-10 text-center">
                <div class="h-24 w-24 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <Phone class="h-12 w-12 text-white" />
                </div>
                <h3 class="text-2xl font-bold text-white mb-2">Incoming Call</h3>
                <p class="text-slate-400">ARIA is answering...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing Section -->
    <section id="pricing" class="py-32 px-6">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-5xl md:text-6xl font-black mb-6 text-white">
            Simple, Transparent Pricing
          </h2>
          <p class="text-xl text-slate-400 mb-8">
            Start free. Upgrade when you're ready.
          </p>

          <!-- Pricing Toggle -->
          <div class="inline-flex items-center gap-2 p-2 bg-slate-800 rounded-full border-2 border-slate-700 shadow-lg">
            <button
              @click="pricingAnnual = false"
              :class="['px-6 py-3 rounded-full font-bold transition-all', !pricingAnnual ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-white']"
            >
              Monthly
            </button>
            <button
              @click="pricingAnnual = true"
              :class="['px-6 py-3 rounded-full font-bold transition-all', pricingAnnual ? 'bg-green-500 text-white' : 'text-slate-400 hover:text-white']"
            >
              Annual
              <span class="text-xs ml-1 opacity-80">(Save 20%!)</span>
            </button>
          </div>
        </div>

        <!-- Pricing Cards -->
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card
            v-for="plan in pricingPlans"
            :key="plan.id"
            :class="['relative p-8 rounded-[2rem] border-2 flex flex-col', plan.popular ? 'border-teal-500 bg-slate-800/80 shadow-2xl scale-105 z-10' : 'border-slate-700 bg-slate-800/50 shadow-xl']"
          >
            <div
              v-if="plan.popular"
              class="absolute -top-5 left-1/2 -translate-x-1/2 px-6 py-2 bg-gradient-to-r from-teal-600 to-blue-600 text-white text-sm font-black rounded-full shadow-lg uppercase tracking-wider"
            >
              Most Popular
            </div>
            <CardContent class="p-0">
              <component :is="plan.icon" :class="['h-10 w-10 mb-4', plan.popular ? 'text-teal-400' : 'text-slate-400']" />
              <h3 class="text-2xl font-black text-white mb-2">{{ plan.name }}</h3>
              <div class="flex items-baseline gap-1 mb-6">
                <span class="text-4xl font-black text-white">
                  ${{ plan.price }}
                </span>
                <span class="text-slate-400 font-bold">/mo</span>
              </div>
              <ul class="space-y-4 mb-8 flex-1">
                <li
                  v-for="(feature, i) in plan.features"
                  :key="i"
                  class="flex items-center gap-3 text-sm font-bold text-slate-300"
                >
                  <Check :class="['h-4 w-4 flex-shrink-0', plan.popular ? 'text-teal-400' : 'text-slate-500']" />
                  {{ feature }}
                </li>
              </ul>
              <Button
                :class="['w-full py-4 rounded-xl font-black text-white shadow-lg transition-transform active:scale-95', plan.popular ? 'bg-gradient-to-r from-teal-600 to-blue-600' : 'bg-slate-700 hover:bg-slate-600']"
                @click="handleGetStarted"
              >
                Choose {{ plan.name }}
              </Button>
            </CardContent>
          </Card>
        </div>

        <!-- Add-ons -->
        <div class="mt-12 text-center">
          <p class="text-slate-400 font-bold mb-6">Supercharge with add-ons:</p>
          <div class="flex flex-wrap items-center justify-center gap-4">
            <Button
              v-for="addon in addons"
              :key="addon.id"
              variant="outline"
              class="px-6 py-3 bg-slate-800/50 border-2 border-slate-700 text-white hover:border-teal-500"
            >
              {{ addon.icon }} {{ addon.name }} - ${{ addon.price }}/mo
            </Button>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="py-32 px-6 bg-slate-900/30">
      <div class="max-w-7xl mx-auto">
        <h2 class="text-5xl md:text-6xl font-black text-center mb-20 text-white">
          Loved by Professionals Everywhere
        </h2>

        <div class="grid md:grid-cols-3 gap-8">
          <Card
            v-for="(testimonial, idx) in testimonials"
            :key="idx"
            :class="['p-8 rounded-[2rem] border-2', testimonial.borderColor, testimonial.bgColor]"
          >
            <CardContent class="p-0">
              <div class="text-4xl mb-4">❝</div>
              <p class="text-xl font-bold text-slate-200 mb-6 leading-relaxed">
                {{ testimonial.quote }}
              </p>
              <div class="flex items-center gap-4">
                <div
                  :class="['h-12 w-12 rounded-full border-2 border-slate-800 flex items-center justify-center font-bold text-xl shadow-md', testimonial.avatarBg]"
                >
                  {{ testimonial.author[0] }}
                </div>
                <div>
                  <p class="font-black text-white">{{ testimonial.author }}</p>
                  <p class="text-sm font-bold text-slate-400 uppercase tracking-wide">
                    {{ testimonial.role }}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section id="faq" class="py-32 px-6">
      <div class="max-w-3xl mx-auto">
        <h2 class="text-4xl md:text-5xl font-black text-center mb-16 text-white">
          Questions? We've Got Answers
        </h2>

        <div class="space-y-4">
          <div
            v-for="(faq, idx) in faqs"
            :key="idx"
            class="bg-slate-800/50 backdrop-blur-xl rounded-2xl border-2 border-slate-700 overflow-hidden"
          >
            <button
              @click="activeFaq = activeFaq === idx ? null : idx"
              class="w-full p-6 text-left flex items-center justify-between hover:bg-slate-800/50 transition-colors"
            >
              <span class="font-bold text-xl text-white">{{ faq.question }}</span>
              <ChevronDown
                :class="['h-6 w-6 text-slate-400 transition-transform', activeFaq === idx ? 'rotate-180' : '']"
              />
            </button>
            <Transition name="slide-down">
              <div v-if="activeFaq === idx" class="overflow-hidden">
                <p class="px-6 pb-6 text-slate-400 font-medium leading-relaxed">
                  {{ faq.answer }}
                </p>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </section>

    <!-- Final CTA Section -->
    <section class="py-32 px-6 relative overflow-hidden bg-gradient-to-r from-teal-600 via-blue-600 to-purple-600">
      <div class="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.05\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-10" />
      <div class="relative z-10 max-w-4xl mx-auto text-center">
        <h2 class="text-5xl md:text-7xl font-black mb-8 text-white">
          Ready to Take Back<br />
          Your Time?
        </h2>
        <p class="text-2xl text-white/90 mb-12 font-medium">
          Join thousands of professionals who've simplified their work life with URPA.
        </p>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Button
            size="lg"
            @click="handleGetStarted"
            class="px-12 py-6 bg-white text-slate-900 font-black rounded-full shadow-[0_0_40px_-10px_rgba(255,255,255,0.5)] text-2xl hover:shadow-[0_0_60px_-10px_rgba(255,255,255,0.7)] transition-shadow"
          >
            Start Your Free Trial
          </Button>
          <Button
            variant="outline"
            size="lg"
            @click="handleScheduleDemo"
            class="px-12 py-6 bg-transparent text-white font-bold rounded-full border-2 border-white/50 hover:border-white"
          >
            Schedule a Demo
          </Button>
        </div>
        <p class="mt-8 text-white/80 font-bold uppercase tracking-widest text-sm">
          ✓ 14-day free trial  ✓ No credit card required  ✓ Cancel anytime
        </p>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-slate-950 pt-20 pb-10 px-6 border-t-2 border-slate-800">
      <div class="max-w-7xl mx-auto">
        <div class="grid md:grid-cols-5 gap-12 mb-16">
          <!-- Brand -->
          <div class="col-span-1">
            <div class="flex items-center gap-2 mb-6">
              <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-blue-600 shadow-lg">
                <Command class="h-6 w-6 text-white" />
              </div>
              <span class="text-xl font-black text-white">URPa.ai</span>
            </div>
            <p class="text-slate-400 font-medium">
              Your AI-powered command center
            </p>
          </div>

          <!-- Product -->
          <div>
            <h4 class="font-black text-white mb-6 uppercase tracking-wider">Product</h4>
            <ul class="space-y-3">
              <li v-for="link in footerLinks.product" :key="link">
                <a href="#" class="text-slate-400 hover:text-teal-400 font-bold transition-colors">
                  {{ link }}
                </a>
              </li>
            </ul>
          </div>

          <!-- Company -->
          <div>
            <h4 class="font-black text-white mb-6 uppercase tracking-wider">Company</h4>
            <ul class="space-y-3">
              <li v-for="link in footerLinks.company" :key="link">
                <a href="#" class="text-slate-400 hover:text-teal-400 font-bold transition-colors">
                  {{ link }}
                </a>
              </li>
            </ul>
          </div>

          <!-- Resources -->
          <div>
            <h4 class="font-black text-white mb-6 uppercase tracking-wider">Resources</h4>
            <ul class="space-y-3">
              <li v-for="link in footerLinks.resources" :key="link">
                <a href="#" class="text-slate-400 hover:text-teal-400 font-bold transition-colors">
                  {{ link }}
                </a>
              </li>
            </ul>
          </div>

          <!-- Legal -->
          <div>
            <h4 class="font-black text-white mb-6 uppercase tracking-wider">Legal</h4>
            <ul class="space-y-3">
              <li v-for="link in footerLinks.legal" :key="link">
                <a href="#" class="text-slate-400 hover:text-teal-400 font-bold transition-colors">
                  {{ link }}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div class="text-center pt-10 border-t-2 border-slate-800">
          <p class="text-slate-400 font-bold">
            © 2025 URPA.ai. All rights reserved.<br />
            Part of the Shine AI Ecosystem: TaskJuggler • 4Calls • Fibonacci
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  Command,
  Sparkles,
  Play,
  Mail,
  MessageSquare,
  Calendar,
  CheckSquare,
  Phone,
  Share2,
  Bot,
  Mic,
  Check,
  X,
  Menu,
  ChevronDown,
  ArrowRight,
  Zap,
  Crown,
  Heart,
  Star,
} from 'lucide-vue-next'
import { Card, CardContent, Button } from '@taskjuggler/ui'

const router = useRouter()

const mobileMenuOpen = ref(false)
const pricingAnnual = ref(false)
const activeFaq = ref<number | null>(null)
const activeShowcase = ref('inbox')

const navItems = ['Features', 'Pricing', 'Integrations', 'About']

const avatarColors = [
  'bg-pink-500',
  'bg-blue-500',
  'bg-green-500',
  'bg-yellow-500',
  'bg-purple-500',
]

const integrationLogos = ['Gmail', 'Outlook', 'Slack', 'Calendar', 'Dropbox', 'Teams']

const features = [
  {
    icon: Mail,
    title: 'Unified Inbox',
    description: 'All your emails, texts, and messages in one smart feed. AI prioritizes what matters.',
    color: 'bg-blue-500',
    lightColor: 'bg-blue-500/10',
    textColor: 'text-blue-400',
  },
  {
    icon: Sparkles,
    title: 'AI Assistant',
    description: 'Chat or talk with your personal AI. Draft emails, schedule meetings, manage tasks — hands-free.',
    color: 'bg-purple-500',
    lightColor: 'bg-purple-500/10',
    textColor: 'text-purple-400',
  },
  {
    icon: Calendar,
    title: 'Smart Calendar',
    description: 'AI-powered scheduling that knows your preferences. Never double-book or miss a meeting again.',
    color: 'bg-pink-500',
    lightColor: 'bg-pink-500/10',
    textColor: 'text-pink-400',
  },
  {
    icon: CheckSquare,
    title: 'Task Automation',
    description: 'AI creates tasks from emails and calls automatically. Integrates with TaskJuggler for power users.',
    color: 'bg-orange-500',
    lightColor: 'bg-orange-500/10',
    textColor: 'text-orange-400',
  },
  {
    icon: Phone,
    title: 'Phone Assistant',
    description: 'Your AI answers calls 24/7. Schedules appointments, takes messages, screens spam. You stay in control.',
    color: 'bg-green-500',
    lightColor: 'bg-green-500/10',
    textColor: 'text-green-400',
    badge: 'POPULAR',
  },
  {
    icon: Share2,
    title: 'Social & Publishing',
    description: 'Manage social accounts and content creation. Full publishing platform launching Q2 2025.',
    color: 'bg-yellow-500',
    lightColor: 'bg-yellow-500/10',
    textColor: 'text-yellow-400',
    badge: 'SOON',
  },
]

const showcaseTabs = [
  {
    id: 'inbox',
    label: 'Unified Inbox',
    icon: Mail,
    color: 'text-blue-400',
    bg: 'bg-blue-500/20',
  },
  {
    id: 'calendar',
    label: 'Smart Calendar',
    icon: Calendar,
    color: 'text-purple-400',
    bg: 'bg-purple-500/20',
  },
  {
    id: 'voice',
    label: 'Voice Assistant',
    icon: Mic,
    color: 'text-pink-400',
    bg: 'bg-pink-500/20',
  },
]

const steps = [
  {
    icon: '🔗',
    title: 'Connect Your Accounts',
    description: 'Link your email, calendar, and messaging apps with secure OAuth. No passwords stored.',
  },
  {
    icon: '👋',
    title: 'Meet Your AI Assistant',
    description: 'ARIA introduces herself and learns your preferences through a quick setup chat.',
  },
  {
    icon: '✨',
    title: 'Watch the Magic Happen',
    description: 'Your inbox organizes itself. Tasks appear automatically. Calls get answered.',
  },
  {
    icon: '🎯',
    title: 'Take Back Your Time',
    description: 'Focus on high-value work while URPA handles the rest. Average user saves 10+ hrs/week.',
  },
]

const phoneFeatures = [
  'Dedicated phone number',
  'AI answers in your voice style',
  'Books appointments directly to your calendar',
  'Transcribes and summarizes every call',
  'Screens spam and robocalls',
  'Instant alerts for VIP callers',
]

const pricingPlans = computed(() => [
  {
    id: 'starter',
    name: 'Starter',
    price: pricingAnnual.value ? 31 : 39,
    icon: Zap,
    features: [
      '1,000 AI requests/month',
      'Email & calendar integration',
      '5 connected integrations',
      '10 GB storage',
      'Email support',
      '2 AI personas',
    ],
  },
  {
    id: 'professional',
    name: 'Professional',
    price: pricingAnnual.value ? 79 : 99,
    icon: Crown,
    popular: true,
    features: [
      '5,000 AI requests/month',
      'All integrations',
      '15 connected integrations',
      '50 GB storage',
      'Priority support',
      'All 4 AI personas',
      'Publishing platform access',
      'API access (read-only)',
    ],
  },
  {
    id: 'business',
    name: 'Business',
    price: pricingAnnual.value ? 143 : 179,
    icon: Star,
    features: [
      '15,000 AI requests/month',
      'Everything in Professional',
      '50 connected integrations',
      '200 GB storage',
      'Priority + chat support',
      'Custom AI personas',
      '5 team members included',
      'Advanced analytics',
      'Full API access',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: pricingAnnual.value ? 239 : 299,
    icon: Heart,
    features: [
      'Unlimited AI requests',
      'Everything in Business',
      'Unlimited integrations',
      '1 TB storage',
      'Dedicated CSM',
      'SSO/SAML',
      '20 team members included',
      'White-label options',
      'Custom training',
    ],
  },
])

const addons = [
  { id: 'text', icon: '📱', name: 'AI Text', price: 19 },
  { id: 'phone', icon: '📞', name: 'AI Phone', price: 49 },
  { id: 'team', icon: '👥', name: 'Team Seats', price: 15 },
]

const testimonials = [
  {
    quote: 'URPA saved me 12 hours a week. My inbox is finally under control and I haven\'t missed a client call in months.',
    author: 'Sarah Chen',
    role: 'Real Estate Agent',
    bgColor: 'bg-pink-500/10',
    borderColor: 'border-pink-500/30',
    avatarBg: 'bg-pink-500',
  },
  {
    quote: 'The AI phone assistant paid for itself in the first week. It booked 3 appointments while I was in meetings.',
    author: 'Marcus Johnson',
    role: 'Attorney',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    avatarBg: 'bg-blue-500',
  },
  {
    quote: 'I was skeptical about AI managing my communications, but ARIA feels like having a real executive assistant.',
    author: 'Emily Rodriguez',
    role: 'Consultant',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    avatarBg: 'bg-purple-500',
  },
]

const faqs = [
  {
    question: 'Is my data secure?',
    answer: 'Absolutely. We use enterprise-grade encryption, never store your passwords, and are SOC 2 Type II compliant. Your data is yours — we never sell or share it.',
  },
  {
    question: 'Can I try before I buy?',
    answer: 'Yes! Every plan includes a 14-day free trial with full features. No credit card required to start.',
  },
  {
    question: 'How does the AI phone assistant work?',
    answer: 'You get a dedicated phone number that your AI answers. It can schedule appointments, take messages, screen calls, and transfer important calls to you. You stay in control.',
  },
  {
    question: 'Will the AI sound robotic?',
    answer: 'Not at all. ARIA uses advanced voice synthesis and learns your communication style. Callers often can\'t tell they\'re speaking with AI.',
  },
  {
    question: 'Can I use URPA with my team?',
    answer: 'Yes! Business and Enterprise plans include team seats. Each member gets their own AI assistant while sharing organizational settings.',
  },
  {
    question: 'What happens if I exceed my AI request limit?',
    answer: 'We\'ll notify you when you\'re approaching your limit. You can upgrade your plan or purchase additional request packs without losing access.',
  },
  {
    question: 'Do you offer refunds?',
    answer: 'Yes, we offer a 30-day money-back guarantee on all plans. If URPA isn\'t right for you, we\'ll refund your payment — no questions asked.',
  },
]

const footerLinks = {
  product: ['Features', 'Pricing', 'Integrations', 'What\'s New', 'Roadmap'],
  company: ['About', 'Blog', 'Careers', 'Press', 'Contact'],
  resources: ['Help Center', 'Documentation', 'API Reference', 'Status', 'Community'],
  legal: ['Privacy Policy', 'Terms of Service', 'Security', 'GDPR', 'Cookie Settings'],
}

function handleGetStarted() {
  router.push('/signup')
}

function handleWatchDemo() {
  // Scroll to features or open demo video
  scrollToFeatures()
}

function handleScheduleDemo() {
  // Navigate to demo scheduling
  router.push('/signup?demo=true')
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function scrollToFeatures() {
  const element = document.getElementById('features')
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<style scoped>
/* Animations */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Transitions */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

/* Responsive */
@media (max-width: 768px) {
  .text-6xl {
    font-size: 3rem;
  }
  
  .text-8xl {
    font-size: 4rem;
  }
}
</style>

