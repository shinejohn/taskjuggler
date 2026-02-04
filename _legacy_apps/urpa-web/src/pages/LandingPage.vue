<template>
  <div class="min-h-screen bg-[#FFFDF5] text-slate-900 overflow-hidden font-sans selection:bg-yellow-300">
    <!-- Fun Background Elements -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden">
      <!-- Floating helper animations -->
      <div
        v-for="(helper, idx) in floatingHelpers"
        :key="idx"
        :class="['absolute opacity-20', helper.color]"
        :style="{
          animation: `floatUp ${helper.duration}s linear infinite`,
          animationDelay: `${helper.delay}s`,
          left: `${20 + idx * 15}vw`,
          bottom: '-10vh',
        }"
      >
        <component :is="helper.icon" :size="40" />
      </div>

      <div class="absolute top-20 left-10 text-yellow-400 opacity-20 animate-bounce-slow">
        <Sun :size="120" />
      </div>
      <div class="absolute top-40 right-20 text-pink-400 opacity-20 animate-float-x">
        <Cloud :size="100" />
      </div>
      <div class="absolute top-1/3 left-1/4 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
      <div class="absolute top-1/3 right-1/4 w-64 h-64 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
      <div class="absolute bottom-1/3 left-1/3 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
    </div>

    <!-- Navigation -->
    <nav
      :class="[
        'fixed top-0 left-0 right-0 z-50 transition-all duration-200',
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
      ]"
    >
      <div class="max-w-7xl mx-auto px-6 h-20">
        <div class="flex items-center justify-between h-full">
          <!-- Logo -->
          <router-link to="/" class="flex items-center gap-2">
            <div class="h-12 w-12 rounded-2xl bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 flex items-center justify-center shadow-lg transform -rotate-6 hover:rotate-0 transition-transform">
              <Command class="h-7 w-7 text-white" />
            </div>
            <span class="text-2xl font-black tracking-tight text-slate-900">
              URPa<span class="text-orange-600">.</span><span class="text-orange-600">ai</span>
            </span>
          </router-link>

          <!-- Desktop Nav -->
          <div class="hidden md:flex items-center gap-8">
            <a
              v-for="item in navItems"
              :key="item"
              :href="`#${item.toLowerCase()}`"
              class="text-slate-800 font-bold text-lg hover:text-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded px-2 py-1"
            >
              {{ item }}
            </a>
          </div>

          <!-- CTA Buttons -->
          <div class="hidden md:flex items-center gap-4">
            <router-link
              to="/login"
              class="text-slate-800 font-bold hover:text-orange-600 transition-colors px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 min-h-[44px]"
            >
              Log In
            </router-link>
            <button
              @click="handleGetStarted"
              class="px-6 py-3 bg-slate-900 text-white font-bold rounded-full shadow-lg hover:bg-slate-800 transition-all border-b-4 border-slate-700 active:border-b-0 active:translate-y-1 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 min-h-[44px]"
            >
              Start Free Trial 🚀
            </button>
          </div>

          <!-- Mobile Menu Button -->
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="md:hidden p-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500 rounded min-h-[44px] min-w-[44px]"
            :aria-label="mobileMenuOpen ? 'Close menu' : 'Open menu'"
          >
            <X v-if="mobileMenuOpen" class="h-8 w-8" />
            <Menu v-else class="h-8 w-8" />
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <Transition name="slide-down">
        <div v-if="mobileMenuOpen" class="md:hidden bg-white border-b-4 border-slate-200">
          <div class="px-6 py-6 space-y-4">
            <a
              v-for="item in navItems"
              :key="item"
              :href="`#${item.toLowerCase()}`"
              class="block text-xl font-bold text-slate-800 hover:text-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 rounded px-2 py-2"
              @click="mobileMenuOpen = false"
            >
              {{ item }}
            </a>
            <div class="pt-4 space-y-3">
              <router-link
                to="/login"
                class="block w-full py-3 bg-slate-100 text-slate-900 font-bold rounded-xl hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 min-h-[44px] text-center"
                @click="mobileMenuOpen = false"
              >
                Log In
              </router-link>
              <button
                @click="handleGetStarted"
                class="w-full py-3 bg-orange-600 text-white font-bold rounded-xl shadow-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-2 min-h-[44px]"
              >
                Start Free Trial 🚀
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </nav>

    <!-- Hero Section -->
    <section class="relative min-h-screen flex items-center justify-center pt-32 pb-20 px-6 overflow-hidden">
      <div class="relative z-10 max-w-5xl mx-auto text-center">
        <!-- Badge -->
        <div class="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-yellow-100 border-2 border-yellow-500 text-yellow-900 font-bold mb-8 shadow-md transform -rotate-2 hover:rotate-2 transition-transform cursor-default">
          <Sparkles class="h-5 w-5 text-yellow-700" />
          <span class="text-base">Now with AI Phone Powers! 📞</span>
        </div>

        <!-- Headline -->
        <h1 class="text-6xl md:text-8xl font-black mb-8 leading-tight tracking-tight text-slate-900">
          Your Life, <br />
          <span class="relative inline-block">
            <span class="relative z-10 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Supercharged
            </span>
            <svg class="absolute -bottom-2 left-0 w-full h-4 text-yellow-400 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
              <path d="M0 5 Q 50 10 100 5" stroke="currentColor" stroke-width="8" fill="none" />
            </svg>
          </span>
          <span class="inline-block animate-bounce ml-4">⚡</span>
        </h1>

        <!-- Subheadline -->
        <p class="text-2xl text-slate-700 mb-12 max-w-3xl mx-auto font-medium leading-relaxed">
          One magical dashboard for everything. Emails, calls, texts, and tasks — all managed by your new AI bestie.
        </p>

        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
          <button
            @click="handleGetStarted"
            class="px-10 py-5 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-black rounded-full shadow-xl text-xl border-b-4 border-pink-800 active:border-b-0 active:translate-y-1 focus:outline-none focus:ring-2 focus:ring-pink-600 focus:ring-offset-2 min-h-[56px] hover:scale-105 transition-transform"
          >
            Get Started for Free! 🎉
          </button>
          <button
            @click="handleWatchDemo"
            class="px-10 py-5 bg-white text-slate-900 font-bold rounded-full border-2 border-slate-300 shadow-lg text-xl flex items-center gap-3 hover:border-purple-500 hover:text-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 min-h-[56px] hover:scale-105 transition-transform"
          >
            <Play class="h-6 w-6 fill-current" />
            Watch the Magic
          </button>
        </div>

        <!-- Social Proof -->
        <div class="flex flex-col items-center gap-4">
          <div class="flex items-center -space-x-4">
            <div
              v-for="i in 5"
              :key="i"
              :class="['h-12 w-12 rounded-full border-4 border-white flex items-center justify-center text-white font-bold text-sm shadow-md', avatarColors[i - 1]]"
            >
              {{ String.fromCharCode(65 + i - 1) }}
            </div>
            <div class="h-12 w-12 rounded-full bg-slate-200 border-4 border-white flex items-center justify-center text-slate-900 font-bold text-xs shadow-md">
              +2k
            </div>
          </div>
          <p class="text-slate-700 font-semibold text-lg">
            Trusted by 2,000+ happy humans! 🌟
          </p>
        </div>
      </div>
    </section>

    <!-- Trust Bar -->
    <section class="py-12 bg-white border-y-4 border-slate-200 transform -skew-y-2">
      <div class="max-w-7xl mx-auto px-6 transform skew-y-2">
        <p class="text-center text-slate-600 mb-8 font-bold uppercase tracking-widest text-base">
          Best Friends With
        </p>
        <div class="flex flex-wrap items-center justify-center gap-12 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
          <div
            v-for="tool in integrationLogos"
            :key="tool"
            class="text-slate-900 font-black text-2xl cursor-pointer hover:scale-125 hover:rotate-3 transition-transform"
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
        <div class="bg-red-50 p-10 rounded-[3rem] border-4 border-red-200 relative">
          <div class="absolute -top-6 -left-6 text-6xl animate-bounce">😫</div>
          <h3 class="text-3xl font-black text-red-700 mb-6">The Old Way</h3>
          <ul class="space-y-4 text-lg text-slate-800 font-medium leading-relaxed">
            <li class="flex items-center gap-3">
              <X class="text-red-600 h-6 w-6 flex-shrink-0" /> Too many notifications
            </li>
            <li class="flex items-center gap-3">
              <X class="text-red-600 h-6 w-6 flex-shrink-0" /> Missed important calls
            </li>
            <li class="flex items-center gap-3">
              <X class="text-red-600 h-6 w-6 flex-shrink-0" /> Inbox anxiety (it's real!)
            </li>
            <li class="flex items-center gap-3">
              <X class="text-red-600 h-6 w-6 flex-shrink-0" /> Boring admin work
            </li>
          </ul>
        </div>

        <!-- Solution -->
        <div class="bg-green-50 p-10 rounded-[3rem] border-4 border-green-200 relative shadow-lg">
          <div class="absolute -top-6 -right-6 text-6xl animate-bounce animation-delay-1000">🤩</div>
          <h3 class="text-3xl font-black text-green-700 mb-6">The URPA Way</h3>
          <ul class="space-y-4 text-lg text-slate-800 font-medium leading-relaxed">
            <li class="flex items-center gap-3">
              <Check class="text-green-600 h-6 w-6 flex-shrink-0" /> One happy feed
            </li>
            <li class="flex items-center gap-3">
              <Check class="text-green-600 h-6 w-6 flex-shrink-0" /> AI answers your phone
            </li>
            <li class="flex items-center gap-3">
              <Check class="text-green-600 h-6 w-6 flex-shrink-0" /> Zero stress, max chill
            </li>
            <li class="flex items-center gap-3">
              <Check class="text-green-600 h-6 w-6 flex-shrink-0" /> Fun again!
            </li>
          </ul>
          <button
            @click="scrollToFeatures"
            class="mt-8 inline-block px-8 py-4 bg-green-600 text-white font-bold rounded-2xl shadow-lg hover:bg-green-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 min-h-[48px] hover:scale-105 transition-transform"
          >
            See How It Works <ArrowRight class="inline h-5 w-5 ml-2" />
          </button>
        </div>
      </div>
    </section>

    <!-- Features Grid -->
    <section id="features" class="py-32 px-6 bg-slate-50 relative overflow-hidden">
      <!-- Decorative blobs -->
      <div class="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 translate-x-1/2 -translate-y-1/2" />
      <div class="absolute bottom-0 left-0 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -translate-x-1/2 translate-y-1/2" />

      <div class="max-w-7xl mx-auto relative z-10">
        <div class="text-center mb-20">
          <h2 class="text-5xl md:text-6xl font-black mb-6 text-slate-900">
            Everything You Need <br />
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              In One Happy Hub
            </span>
          </h2>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="(feature, idx) in features"
            :key="idx"
            :class="['bg-white p-8 rounded-[2rem] shadow-xl border-2 border-slate-100 hover:border-transparent hover:shadow-2xl transition-all group relative overflow-hidden', `hover:-rotate-${feature.rotate}`]"
          >
            <div :class="['absolute top-0 right-0 w-32 h-32 rounded-bl-[4rem] -mr-8 -mt-8 transition-transform group-hover:scale-150', feature.lightColor]" />

            <div v-if="feature.badge" class="absolute top-6 right-6 px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-bold z-10">
              {{ feature.badge }}
            </div>

            <div :class="['h-16 w-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg transform group-hover:rotate-12 transition-transform relative z-10', feature.color]">
              <component :is="feature.icon" class="h-8 w-8 text-white" />
            </div>

            <h3 :class="['text-2xl font-black mb-3 relative z-10', feature.textColor]">
              {{ feature.title }}
            </h3>
            <p class="text-slate-500 font-medium leading-relaxed relative z-10 text-lg">
              {{ feature.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Phone Assistant Feature Section -->
    <section class="py-32 px-6 bg-gradient-to-br from-green-50 to-emerald-50 relative overflow-hidden">
      <div class="absolute top-0 left-0 w-96 h-96 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
      <div class="absolute bottom-0 right-0 w-96 h-96 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />

      <div class="max-w-7xl mx-auto relative z-10">
        <div class="grid lg:grid-cols-2 gap-16 items-center">
          <!-- Left: Content -->
          <div>
            <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 font-bold mb-6">
              <Phone class="h-5 w-5" />
              <span>AI Phone Assistant</span>
            </div>

            <h2 class="text-5xl md:text-6xl font-black mb-6 text-slate-900">
              Never Miss a Call <br />
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                Ever Again
              </span>
            </h2>

            <p class="text-xl text-slate-600 mb-8 leading-relaxed">
              Your AI receptionist answers calls, screens spam, takes messages, and even schedules meetings. It's like having a personal assistant who never sleeps! ☎️
            </p>

            <div class="space-y-4 mb-8">
              <div
                v-for="(feature, idx) in phoneFeatures"
                :key="idx"
                class="flex items-center gap-4"
              >
                <div class="h-12 w-12 rounded-xl bg-green-500 flex items-center justify-center shadow-lg">
                  <component :is="feature.icon" class="h-6 w-6 text-white" />
                </div>
                <span class="text-lg font-bold text-slate-700">
                  {{ feature.text }}
                </span>
              </div>
            </div>

            <button
              @click="handleGetStarted"
              class="px-8 py-4 bg-green-500 text-white font-bold rounded-2xl shadow-xl shadow-green-500/30 hover:shadow-2xl transition-all hover:scale-105"
            >
              Try Phone Assistant <ArrowRight class="inline h-5 w-5 ml-2" />
            </button>
          </div>

          <!-- Right: Phone Mockup -->
          <div class="relative">
            <div class="relative w-full max-w-sm mx-auto">
              <!-- Phone Frame -->
              <div class="bg-slate-900 rounded-[3rem] p-4 shadow-2xl ring-8 ring-slate-200">
                <div class="bg-slate-800 rounded-[2.5rem] overflow-hidden">
                  <!-- Status Bar -->
                  <div class="bg-slate-900 px-6 py-3 flex items-center justify-between text-white text-xs">
                    <span>9:41</span>
                    <div class="flex gap-1">
                      <div class="w-4 h-3 bg-white rounded-sm" />
                      <div class="w-4 h-3 bg-white rounded-sm" />
                      <div class="w-4 h-3 bg-white rounded-sm" />
                    </div>
                  </div>

                  <!-- Call Screen -->
                  <div class="bg-gradient-to-br from-green-600 to-emerald-600 p-8 text-center text-white min-h-[500px] flex flex-col items-center justify-center">
                    <div class="mb-8 animate-pulse-scale">
                      <div class="h-24 w-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <Phone class="h-12 w-12" />
                      </div>
                    </div>

                    <h3 class="text-2xl font-bold mb-2">Incoming Call</h3>
                    <p class="text-green-100 mb-8">Unknown Number</p>

                    <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-8 text-left">
                      <p class="text-sm font-bold mb-2">
                        🤖 ARIA is handling this:
                      </p>
                      <p class="text-xs text-green-100">
                        "Hi! You've reached John's assistant. How can I help you today?"
                      </p>
                    </div>

                    <div class="flex gap-4">
                      <div class="h-16 w-16 rounded-full bg-red-500 flex items-center justify-center">
                        <X class="h-8 w-8" />
                      </div>
                      <div class="h-16 w-16 rounded-full bg-green-500 flex items-center justify-center">
                        <Phone class="h-8 w-8" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Floating notification -->
              <div class="absolute -right-4 top-1/4 bg-white rounded-2xl p-4 shadow-xl max-w-xs animate-slide-in">
                <div class="flex items-start gap-3">
                  <div class="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Bot class="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p class="font-bold text-sm text-slate-900">
                      Call Screened ✓
                    </p>
                    <p class="text-xs text-slate-600">
                      Sales call blocked. You're welcome! 😎
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Timeline -->
    <section class="py-32 px-6 bg-white">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-20">
          <h2 class="text-5xl md:text-6xl font-black mb-6 text-slate-900">
            Get Started in{' '}
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
              4 Easy Steps
            </span>
          </h2>
          <p class="text-xl text-slate-600 max-w-2xl mx-auto">
            From zero to hero in less time than it takes to make coffee ☕
          </p>
        </div>

        <div class="relative">
          <!-- Timeline Line -->
          <div class="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-200 via-purple-200 via-pink-200 to-green-200 -translate-y-1/2" />

          <div class="grid md:grid-cols-4 gap-8 relative">
            <div
              v-for="(step, idx) in howItWorksSteps"
              :key="idx"
              class="relative"
            >
              <div class="bg-white rounded-3xl p-8 border-4 border-slate-100 hover:border-transparent hover:shadow-2xl transition-all text-center">
                <!-- Number Badge -->
                <div :class="['absolute -top-6 left-1/2 -translate-x-1/2 h-12 w-12 rounded-full text-white font-black text-xl flex items-center justify-center shadow-lg z-10', step.color]">
                  {{ step.number }}
                </div>

                <!-- Icon -->
                <div :class="['mx-auto mb-6 mt-4 h-20 w-20 rounded-2xl flex items-center justify-center', step.lightColor]">
                  <component :is="step.icon" :class="['h-10 w-10', step.color.replace('bg-', 'text-')]" />
                </div>

                <h3 class="text-xl font-black text-slate-900 mb-3">
                  {{ step.title }}
                </h3>
                <p class="text-slate-600 font-medium leading-relaxed">
                  {{ step.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Integration Showcase -->
    <section id="integrations" class="py-32 px-6 bg-gradient-to-br from-purple-50 to-pink-50">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-5xl md:text-6xl font-black mb-6 text-slate-900">
            Plays Nice With <br />
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              Everyone You Love
            </span>
          </h2>
          <p class="text-xl text-slate-600 max-w-2xl mx-auto">
            Connect all your favorite tools. We're the Switzerland of productivity apps! 🇨🇭
          </p>
        </div>

        <!-- Category Tabs -->
        <div class="flex flex-wrap items-center justify-center gap-3 mb-12">
          <button
            v-for="category in integrationCategories"
            :key="category.id"
            @click="activeIntegrationTab = category.id"
            :class="['flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all hover:scale-105', activeIntegrationTab === category.id ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' : 'bg-white text-slate-600 hover:bg-slate-50']"
          >
            <component :is="category.icon" class="h-5 w-5" />
            {{ category.label }}
          </button>
        </div>

        <!-- Integration Grid -->
        <Transition name="fade" mode="out-in">
          <div :key="activeIntegrationTab" class="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div
              v-for="integration in integrationCategories.find(cat => cat.id === activeIntegrationTab)?.integrations"
              :key="integration"
              class="bg-white rounded-2xl p-6 border-2 border-slate-100 hover:border-purple-300 hover:shadow-xl transition-all text-center cursor-pointer hover:scale-105 hover:rotate-1"
            >
              <div class="h-16 w-16 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 mx-auto mb-4 flex items-center justify-center">
                <Globe class="h-8 w-8 text-purple-600" />
              </div>
              <p class="font-bold text-slate-900">{{ integration }}</p>
            </div>
          </div>
        </Transition>

        <div class="text-center mt-12">
          <p class="text-slate-600 font-bold mb-4">
            Don't see your tool? We probably support it!
          </p>
          <button class="text-purple-600 hover:text-purple-700 font-bold underline">
            View all 200+ integrations →
          </button>
        </div>
      </div>
    </section>

    <!-- AI Assistant Showcase -->
    <section class="py-32 px-6">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16">
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-600 font-bold mb-6">
            <Bot class="h-5 w-5" />
            <span>Meet ARIA 🤖</span>
          </div>
          <h2 class="text-5xl md:text-6xl font-black mb-6 text-slate-900">
            Your New Digital Bestie
          </h2>
          <p class="text-2xl text-slate-500 max-w-2xl mx-auto font-medium">
            She's smart, she's fast, and she actually likes doing your paperwork.
          </p>
        </div>

        <div class="grid lg:grid-cols-12 gap-12 items-center">
          <!-- Left Column: Controls -->
          <div class="lg:col-span-4 space-y-4">
            <button
              v-for="tab in showcaseTabs"
              :key="tab.id"
              @click="activeShowcase = tab.id"
              :class="['w-full text-left p-6 rounded-3xl transition-all duration-300 border-2', activeShowcase === tab.id ? 'bg-white border-slate-900 shadow-xl scale-105 z-10' : 'bg-slate-50 border-transparent hover:bg-white hover:border-slate-200']"
            >
              <div class="flex items-center gap-4">
                <div :class="['p-4 rounded-2xl', activeShowcase === tab.id ? tab.bg : 'bg-slate-200']">
                  <component :is="tab.icon" :class="['h-6 w-6', activeShowcase === tab.id ? tab.color : 'text-slate-500']" />
                </div>
                <div>
                  <h3 :class="['font-bold text-xl', activeShowcase === tab.id ? 'text-slate-900' : 'text-slate-500']">
                    {{ tab.label }}
                  </h3>
                </div>
              </div>
            </button>
          </div>

          <!-- Right Column: Interactive Visual -->
          <div class="lg:col-span-8">
            <div class="relative aspect-[4/3] md:aspect-[16/9] bg-slate-900 rounded-[2.5rem] border-8 border-slate-900 overflow-hidden shadow-2xl ring-4 ring-slate-200">
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
                        "I drafted a reply to Sarah! Want me to send it with a gif? 🐱"
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
                        <p class="font-bold">Conflict Detected! 🚨</p>
                        <p class="text-sm text-slate-500">
                          Moving "Nap Time" to 3 PM.
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Voice View -->
                  <div v-else-if="activeShowcase === 'voice'" key="voice" class="flex flex-col items-center justify-center h-full">
                    <div class="relative">
                      <div
                        v-for="i in 3"
                        :key="i"
                        class="absolute inset-0 rounded-full bg-pink-500/30"
                        :style="{
                          animation: `ping 2s cubic-bezier(0, 0, 0.2, 1) infinite`,
                          animationDelay: `${i * 0.6}s`
                        }"
                      />
                      <div class="relative h-32 w-32 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-2xl z-10">
                        <Phone class="h-12 w-12 text-white animate-bounce" />
                      </div>
                    </div>
                    <h3 class="mt-8 text-2xl font-bold text-white">
                      Incoming Call...
                    </h3>
                    <p class="text-slate-400">
                      ARIA is handling it like a boss 😎
                    </p>
                  </div>
                </Transition>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing Section -->
    <section id="pricing" class="py-32 px-6 bg-yellow-50 relative">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-5xl md:text-6xl font-black mb-6 text-slate-900">
            Pick Your Power Up 🍄
          </h2>

          <!-- Pricing Toggle -->
          <div class="inline-flex items-center gap-2 p-2 bg-white rounded-full border-2 border-slate-100 shadow-lg">
            <button
              @click="pricingAnnual = false"
              :class="['px-6 py-3 rounded-full font-bold transition-all', !pricingAnnual ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900']"
            >
              Monthly
            </button>
            <button
              @click="pricingAnnual = true"
              :class="['px-6 py-3 rounded-full font-bold transition-all', pricingAnnual ? 'bg-green-500 text-white' : 'text-slate-500 hover:text-slate-900']"
            >
              Annual{' '}
              <span class="text-xs ml-1 opacity-80">(Save 20%!)</span>
            </button>
          </div>
        </div>

        <!-- Pricing Cards -->
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="(plan, idx) in pricingPlans"
            :key="idx"
            :class="['relative p-8 rounded-[2rem] border-4 flex flex-col', plan.popular ? 'shadow-2xl scale-105 z-10' : 'shadow-xl', plan.color, plan.bg]"
          >
            <div
              v-if="plan.popular"
              class="absolute -top-5 left-1/2 -translate-x-1/2 px-6 py-2 bg-purple-600 text-white text-sm font-black rounded-full shadow-lg uppercase tracking-wider"
            >
              Most Popular
            </div>

            <component :is="plan.icon" :class="['h-10 w-10 mb-4', plan.popular ? 'text-purple-600' : 'text-slate-400']" />
            <h3 class="text-2xl font-black text-slate-900">
              {{ plan.name }}
            </h3>
            <div class="flex items-baseline gap-1">
              <span class="text-4xl font-black text-slate-900">
                {{ typeof plan.price === 'number' ? `$${plan.price}` : plan.price }}
              </span>
              <span v-if="typeof plan.price === 'number'" class="text-slate-500 font-bold">/mo</span>
            </div>

            <ul class="space-y-4 mb-8 flex-1">
              <li
                v-for="(feature, i) in plan.features"
                :key="i"
                class="flex items-center gap-3 text-sm font-bold text-slate-600"
              >
                <div :class="['h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0', plan.popular ? 'bg-purple-100 text-purple-600' : 'bg-white text-slate-400']">
                  <Check class="h-4 w-4" />
                </div>
                <span>{{ feature }}</span>
              </li>
            </ul>

            <button
              :class="['w-full py-4 rounded-xl font-black text-white shadow-lg transition-transform active:scale-95', plan.btn]"
              @click="handleGetStarted"
            >
              Choose {{ plan.name }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="py-32 px-6 bg-white overflow-hidden">
      <div class="max-w-7xl mx-auto">
        <h2 class="text-5xl md:text-6xl font-black text-center mb-20 text-slate-900">
          Fan Mail 💌
        </h2>

        <div class="grid md:grid-cols-3 gap-8">
          <div
            v-for="(t, idx) in testimonials"
            :key="idx"
            :class="['p-8 rounded-[2rem] border-4 relative', t.borderColor, t.bgColor, idx % 2 === 0 ? '-rotate-2' : 'rotate-2']"
          >
            <div class="text-4xl mb-4">❝</div>
            <p class="text-xl font-bold text-slate-800 mb-6 leading-relaxed">
              {{ t.quote }}
            </p>
            <div class="flex items-center gap-4">
              <div :class="['h-12 w-12 rounded-full border-2 border-slate-900 flex items-center justify-center font-bold text-xl shadow-md', t.avatarBg]">
                {{ t.author[0] }}
              </div>
              <div>
                <p class="font-black text-slate-900">{{ t.author }}</p>
                <p class="text-sm font-bold text-slate-500 uppercase tracking-wide">
                  {{ t.role }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="py-32 px-6 bg-slate-50">
      <div class="max-w-3xl mx-auto">
        <h2 class="text-4xl md:text-5xl font-black text-center mb-16 text-slate-900">
          Curious Minds Ask... 🤔
        </h2>

        <div class="space-y-4">
          <div
            v-for="(faq, idx) in faqs"
            :key="idx"
            class="bg-white rounded-2xl border-2 border-slate-100 overflow-hidden"
          >
            <button
              @click="activeFaq = activeFaq === idx ? null : idx"
              class="w-full p-6 text-left flex items-center justify-between hover:bg-slate-50 transition-colors"
            >
              <span class="font-bold text-xl text-slate-800">{{ faq.question }}</span>
              <ChevronDown
                :class="['h-6 w-6 text-slate-400 transition-transform', activeFaq === idx ? 'rotate-180' : '']"
              />
            </button>
            <Transition name="slide-down">
              <div v-if="activeFaq === idx" class="overflow-hidden">
                <p class="px-6 pb-6 text-slate-600 font-medium leading-relaxed">
                  {{ faq.answer }}
                </p>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </section>

    <!-- Final CTA -->
    <section class="py-32 px-6 relative overflow-hidden bg-slate-900 text-white">
      <div class="absolute inset-0 opacity-10" :style="patternStyle" />
      <div class="relative z-10 max-w-4xl mx-auto text-center">
        <h2 class="text-5xl md:text-7xl font-black mb-8 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500">
          Ready to Join the Fun? 🎢
        </h2>
        <p class="text-2xl text-slate-300 mb-12 font-medium">
          Stop drowning in work. Start surfing the wave of productivity!
        </p>
        <button
          @click="handleGetStarted"
          class="px-12 py-6 bg-white text-slate-900 font-black rounded-full shadow-[0_0_40px_-10px_rgba(255,255,255,0.5)] text-2xl hover:shadow-[0_0_60px_-10px_rgba(255,255,255,0.7)] transition-shadow hover:scale-110 transition-transform"
        >
          Start Free Trial Now! 🚀
        </button>
        <p class="mt-8 text-slate-400 font-bold uppercase tracking-widest text-sm">
          No Credit Card • Cancel Anytime • 100% Fun
        </p>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-slate-50 pt-20 pb-10 px-6 border-t-4 border-slate-200">
      <div class="max-w-7xl mx-auto">
        <div class="grid md:grid-cols-4 gap-12 mb-16">
          <div class="col-span-1 md:col-span-1">
            <div class="flex items-center gap-2 mb-6">
              <div class="h-10 w-10 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
                <Command class="h-6 w-6 text-white" />
              </div>
              <span class="text-xl font-black text-slate-900">
                URPa.ai
              </span>
            </div>
            <p class="text-slate-500 font-medium">
              Making work feel less like work since 2024. 🎈
            </p>
          </div>

          <div v-for="(col, idx) in footerColumns" :key="idx">
            <h4 class="font-black text-slate-900 mb-6 uppercase tracking-wider">
              {{ col.title }}
            </h4>
            <ul class="space-y-3">
              <li v-for="link in col.links" :key="link">
                <a
                  href="#"
                  class="text-slate-500 hover:text-orange-500 font-bold transition-colors"
                >
                  {{ link }}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div class="text-center pt-10 border-t-2 border-slate-200">
          <p class="text-slate-400 font-bold">
            © 2025 URPa.ai. Made with ❤️ and ☕️ in San Francisco.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  Command,
  Mail,
  MessageSquare,
  Calendar,
  CheckSquare,
  Phone,
  Share2,
  Sparkles,
  Play,
  Star,
  Check,
  ChevronDown,
  Menu,
  X,
  Mic,
  Bot,
  ArrowRight,
  Heart,
  Zap,
  Smile,
  Sun,
  Cloud,
  Coffee,
  Clock,
  Voicemail,
  PhoneForwarded,
  PhoneIncoming,
  Code,
  Palette,
  Globe,
} from 'lucide-vue-next'

const router = useRouter()

const isScrolled = ref(false)
const mobileMenuOpen = ref(false)
const pricingAnnual = ref(false)
const activeFaq = ref<number | null>(null)
const activeShowcase = ref('inbox')
const activeIntegrationTab = ref('productivity')

const navItems = ['Features', 'Pricing', 'Integrations', 'About']

const avatarColors = [
  'bg-pink-500',
  'bg-blue-500',
  'bg-green-500',
  'bg-yellow-500',
  'bg-purple-500',
]

const integrationLogos = ['Gmail', 'Outlook', 'Slack', 'Calendar', 'Dropbox', 'Teams']

const floatingHelpers = [
  { icon: Coffee, color: 'text-amber-500', delay: 0, duration: 8 },
  { icon: Clock, color: 'text-blue-500', delay: 2, duration: 10 },
  { icon: Heart, color: 'text-pink-500', delay: 4, duration: 9 },
  { icon: Smile, color: 'text-yellow-500', delay: 1, duration: 11 },
  { icon: Zap, color: 'text-purple-500', delay: 3, duration: 7 },
]

const features = [
  {
    icon: Mail,
    title: 'Unified Inbox',
    description: 'All your chats in one happy place! 📬',
    color: 'bg-blue-500',
    lightColor: 'bg-blue-100',
    textColor: 'text-blue-600',
    rotate: -2,
  },
  {
    icon: Sparkles,
    title: 'AI Magic',
    description: 'Your genie in a bottle (well, browser)! ✨',
    color: 'bg-purple-500',
    lightColor: 'bg-purple-100',
    textColor: 'text-purple-600',
    rotate: 2,
  },
  {
    icon: Calendar,
    title: 'Smart Calendar',
    description: 'Never double-book your fun time again! 📅',
    color: 'bg-pink-500',
    lightColor: 'bg-pink-100',
    textColor: 'text-pink-600',
    rotate: -1,
  },
  {
    icon: CheckSquare,
    title: 'Task Whiz',
    description: 'Crush your to-do list like a superhero! 🦸‍♀️',
    color: 'bg-orange-500',
    lightColor: 'bg-orange-100',
    textColor: 'text-orange-600',
    rotate: 3,
  },
  {
    icon: Phone,
    title: 'Phone Pal',
    description: 'Your friendly AI receptionist! ☎️',
    color: 'bg-green-500',
    lightColor: 'bg-green-100',
    textColor: 'text-green-600',
    badge: 'POPULAR',
    rotate: -3,
  },
  {
    icon: Share2,
    title: 'Social Butterfly',
    description: 'Spread your wings across all platforms! 🦋',
    color: 'bg-yellow-500',
    lightColor: 'bg-yellow-100',
    textColor: 'text-yellow-600',
    badge: 'SOON',
    rotate: 1,
  },
]

const testimonials = [
  {
    quote: 'OMG! URPA is literally a lifesaver. I have so much free time now!',
    author: 'Sarah Chen',
    role: 'Super Agent 🏠',
    bgColor: 'bg-pink-100',
    borderColor: 'border-pink-300',
    avatarBg: 'bg-pink-500',
  },
  {
    quote: 'My AI assistant is cooler than me. It booked 3 meetings while I was napping!',
    author: 'Marcus Johnson',
    role: 'Legal Eagle ⚖️',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-300',
    avatarBg: 'bg-blue-500',
  },
  {
    quote: 'I used to drown in emails. Now I surf on them! 🏄‍♂️ Cowabunga!',
    author: 'David Park',
    role: 'Startup Guru 🚀',
    bgColor: 'bg-yellow-100',
    borderColor: 'border-yellow-300',
    avatarBg: 'bg-yellow-500',
  },
]

const showcaseTabs = [
  {
    id: 'inbox',
    label: 'Inbox Party 🎉',
    icon: Mail,
    color: 'text-blue-500',
    bg: 'bg-blue-100',
  },
  {
    id: 'calendar',
    label: 'Time Travel ⏳',
    icon: Calendar,
    color: 'text-purple-500',
    bg: 'bg-purple-100',
  },
  {
    id: 'voice',
    label: 'Chatterbox 🗣️',
    icon: Mic,
    color: 'text-pink-500',
    bg: 'bg-pink-100',
  },
]

const howItWorksSteps = [
  {
    number: '1',
    title: 'Sign Up in Seconds',
    description: 'Create your account faster than you can say "productivity"!',
    icon: Sparkles,
    color: 'bg-blue-500',
    lightColor: 'bg-blue-100',
  },
  {
    number: '2',
    title: 'Connect Your Tools',
    description: 'Link your email, calendar, and favorite apps. We play nice with everyone!',
    icon: Share2,
    color: 'bg-purple-500',
    lightColor: 'bg-purple-100',
  },
  {
    number: '3',
    title: 'Meet Your AI',
    description: "Say hi to ARIA! She'll learn your style and preferences in no time.",
    icon: Bot,
    color: 'bg-pink-500',
    lightColor: 'bg-pink-100',
  },
  {
    number: '4',
    title: 'Enjoy Your Freedom',
    description: 'Sit back and watch the magic happen. Your time is yours again!',
    icon: Heart,
    color: 'bg-green-500',
    lightColor: 'bg-green-100',
  },
]

const phoneFeatures = [
  { icon: PhoneIncoming, text: 'AI answers and screens calls' },
  { icon: Voicemail, text: 'Transcribes voicemails instantly' },
  { icon: PhoneForwarded, text: 'Forwards important calls to you' },
  { icon: Calendar, text: 'Books meetings automatically' },
]

const integrationCategories = [
  {
    id: 'productivity',
    label: 'Productivity',
    icon: CheckSquare,
    integrations: ['Gmail', 'Outlook', 'Slack', 'Teams', 'Notion', 'Asana', 'Trello', 'Monday'],
  },
  {
    id: 'communication',
    label: 'Communication',
    icon: MessageSquare,
    integrations: ['Zoom', 'Discord', 'Telegram', 'WhatsApp', 'Signal', 'Skype', 'Meet', 'Webex'],
  },
  {
    id: 'calendar',
    label: 'Calendar',
    icon: Calendar,
    integrations: ['Google Cal', 'Outlook', 'Apple Cal', 'Calendly', 'Cal.com', 'Fantastical', 'Cron', 'Reclaim'],
  },
  {
    id: 'social',
    label: 'Social Media',
    icon: Share2,
    integrations: ['Twitter', 'LinkedIn', 'Facebook', 'Instagram', 'TikTok', 'YouTube', 'Reddit', 'Medium'],
  },
  {
    id: 'dev',
    label: 'Developer',
    icon: Code,
    integrations: ['GitHub', 'GitLab', 'Bitbucket', 'Jira', 'Linear', 'Figma', 'VS Code', 'Postman'],
  },
  {
    id: 'design',
    label: 'Design',
    icon: Palette,
    integrations: ['Figma', 'Sketch', 'Adobe XD', 'Canva', 'Framer', 'InVision', 'Miro', 'FigJam'],
  },
]

const pricingPlans = computed(() => [
  {
    name: 'Starter',
    price: pricingAnnual.value ? 31 : 39,
    color: 'border-blue-200',
    bg: 'bg-blue-50',
    btn: 'bg-blue-500',
    icon: Smile,
    features: ['Awesome feature 1', 'Awesome feature 2', 'Awesome feature 3', 'Awesome feature 4'],
  },
  {
    name: 'Pro',
    price: pricingAnnual.value ? 79 : 99,
    color: 'border-purple-500',
    bg: 'bg-white',
    btn: 'bg-purple-600',
    popular: true,
    icon: Zap,
    features: ['Awesome feature 1', 'Awesome feature 2', 'Awesome feature 3', 'Awesome feature 4'],
  },
  {
    name: 'Business',
    price: pricingAnnual.value ? 143 : 179,
    color: 'border-orange-200',
    bg: 'bg-orange-50',
    btn: 'bg-orange-500',
    icon: Star,
    features: ['Awesome feature 1', 'Awesome feature 2', 'Awesome feature 3', 'Awesome feature 4'],
  },
  {
    name: 'Enterprise',
    price: '???',
    color: 'border-slate-200',
    bg: 'bg-slate-50',
    btn: 'bg-slate-800',
    icon: Heart,
    features: ['Awesome feature 1', 'Awesome feature 2', 'Awesome feature 3', 'Awesome feature 4'],
  },
])

const faqs = [
  {
    question: 'Is my data safe? (Spoiler: YES!)',
    answer: 'Absolutely! We use bank-level encryption and pinky-promise to never sell your data. Plus, our AI is trained to be helpful, not evil. 🦸‍♂️',
  },
  {
    question: 'Can I cancel anytime?',
    answer: 'Yes! Cancel anytime, no questions asked. We want you to be happy, not trapped.',
  },
  {
    question: 'Does it work with my weird calendar?',
    answer: 'Probably! We integrate with Google Calendar, Outlook, Apple Calendar, Calendly, and many more. Check our integrations page!',
  },
  {
    question: 'Will the AI take over the world?',
    answer: 'Only if you want it to! 😉 But seriously, ARIA is designed to help, not replace you. You stay in control.',
  },
]

const footerColumns = [
  {
    title: 'Product',
    links: ['Features', 'Pricing', 'Roadmap', 'Changelog'],
  },
  {
    title: 'Company',
    links: ['About Us', 'Careers', 'Blog', 'Contact'],
  },
  {
    title: 'Legal',
    links: ['Privacy', 'Terms', 'Security', 'Cookies'],
  },
]

const patternStyle = computed(() => ({
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
}))

function handleScroll() {
  isScrolled.value = window.scrollY > 10
}

function handleGetStarted() {
  router.push('/signup')
}

function handleWatchDemo() {
  scrollToFeatures()
}

function scrollToFeatures() {
  const element = document.getElementById('features')
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
/* Animations */
@keyframes floatUp {
  0% {
    transform: translateY(100vh) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-20vh) rotate(360deg);
    opacity: 0;
  }
}

@keyframes blob {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

@keyframes bounce-slow {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(10deg);
  }
}

@keyframes float-x {
  0%, 100% {
    transform: translateX(0) translateY(0);
  }
  50% {
    transform: translateX(30px) translateY(10px);
  }
}

@keyframes pulse-scale {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes ping {
  75%, 100% {
    transform: scale(2.5);
    opacity: 0;
  }
}

.animate-bounce-slow {
  animation: bounce-slow 5s ease-in-out infinite;
}

.animate-float-x {
  animation: float-x 8s ease-in-out infinite;
}

.animate-blob {
  animation: blob 7s ease-in-out infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

.animation-delay-1000 {
  animation-delay: 1s;
}

.animate-pulse-scale {
  animation: pulse-scale 2s ease-in-out infinite;
}

.animate-slide-in {
  animation: slide-in 0.5s ease-out 0.5s both;
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(-20px) scale(0.8);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(20px) scale(0.8);
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
