<template>
  <div class="min-h-screen bg-[#0a0a0f] text-[#f0ede6] overflow-x-hidden">
    <!-- Grain Overlay -->
    <div class="fixed inset-0 pointer-events-none z-[9999] opacity-[0.03]" 
         :style="{ backgroundImage: `url('data:image/svg+xml,%3Csvg viewBox=\\'0 0 256 256\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cfilter id=\\'noise\\'%3E%3CfeTurbulence type=\\'fractalNoise\\' baseFrequency=\\'0.9\\' numOctaves=\\'4\\' stitchTiles=\\'stitch\\'/%3E%3C/filter%3E%3Crect width=\\'100%25\\' height=\\'100%25\\' filter=\\'url(%23noise)\\' opacity=\\'0.03\\'/%3E%3C/svg%3E')` }">
    </div>

    <!-- Navigation -->
    <nav class="fixed top-0 left-0 right-0 z-[100] px-8 md:px-12 py-5 flex items-center justify-between backdrop-blur-[20px] bg-[rgba(10,10,15,0.8)] border-b border-[rgba(255,255,255,0.06)] transition-all">
      <router-link to="/" class="flex items-center gap-3 no-underline">
        <div class="w-9 h-9 bg-[#e8a034] rounded-lg flex items-center justify-center font-['DM_Serif_Display',serif] text-lg text-[#0a0a0f] font-bold">
          ON
        </div>
        <div class="font-bold text-lg text-[#f0ede6] tracking-tight">Official Notice</div>
      </router-link>
      
      <ul class="hidden md:flex items-center gap-8 list-none">
        <li><a href="#how-it-works" class="text-sm text-[#9a9aab] hover:text-[#f0ede6] transition-colors no-underline">How It Works</a></li>
        <li><a href="#who-its-for" class="text-sm text-[#9a9aab] hover:text-[#f0ede6] transition-colors no-underline">Who It's For</a></li>
        <li><a href="#features" class="text-sm text-[#9a9aab] hover:text-[#f0ede6] transition-colors no-underline">Features</a></li>
        <li><a href="#pricing" class="text-sm text-[#9a9aab] hover:text-[#f0ede6] transition-colors no-underline">Pricing</a></li>
        <li>
          <router-link to="/register" class="bg-[#e8a034] text-[#0a0a0f] px-6 py-2.5 rounded-lg text-sm font-semibold no-underline transition-all hover:-translate-y-[1px] hover:shadow-[0_4px_20px_rgba(232,160,52,0.3)]">
            Get Started Free
          </router-link>
        </li>
      </ul>
    </nav>

    <!-- Hero Section -->
    <section class="hero min-h-screen flex flex-col items-center justify-center text-center px-8 pt-32 pb-24 relative overflow-hidden">
      <div class="absolute inset-0 pointer-events-none"
           :style="{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(232,160,52,0.08) 0%, transparent 60%), radial-gradient(circle at 20% 80%, rgba(96,165,250,0.04) 0%, transparent 40%), radial-gradient(circle at 80% 80%, rgba(167,139,250,0.04) 0%, transparent 40%)' }">
      </div>
      
      <div class="absolute inset-0 pointer-events-none opacity-30"
           :style="{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '60px 60px', maskImage: 'radial-gradient(ellipse 70% 50% at 50% 50%, black, transparent)' }">
      </div>
      
      <div class="inline-flex items-center gap-2 px-5 py-2 bg-[rgba(232,160,52,0.06)] border border-[rgba(232,160,52,0.2)] rounded-full text-sm font-medium text-[#e8a034] mb-8 animate-[fadeUp_0.8s_ease_both]">
        <span class="w-1.5 h-1.5 bg-[#e8a034] rounded-full animate-[pulse_2s_ease_infinite]"></span>
        Transaction Infrastructure
      </div>
      
      <h1 class="font-['DM_Serif_Display',serif] text-[clamp(3rem,7vw,5.5rem)] leading-[1.05] tracking-tight max-w-[900px] mb-6 animate-[fadeUp_0.8s_ease_0.1s_both]">
        You've been <em class="italic text-[#e8a034]">officially</em> noticed.
      </h1>
      
      <p class="text-[clamp(1.1rem,2vw,1.35rem)] text-[#9a9aab] max-w-[620px] mx-auto mb-10 font-light leading-relaxed animate-[fadeUp_0.8s_ease_0.2s_both]">
        Every important document. Every critical deadline. Everyone who needs to know. 
        Transaction infrastructure for life's important moments.
      </p>
      
      <div class="flex flex-col sm:flex-row gap-4 justify-center animate-[fadeUp_0.8s_ease_0.3s_both]">
        <router-link to="/register" class="inline-flex items-center gap-2 px-9 py-4 bg-[#e8a034] text-[#0a0a0f] rounded-xl text-base font-bold no-underline transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(232,160,52,0.35)]">
          Start Free Trial →
        </router-link>
        <a href="#how-it-works" class="inline-flex items-center gap-2 px-9 py-4 bg-transparent text-[#f0ede6] border border-[rgba(255,255,255,0.12)] rounded-xl text-base font-semibold no-underline transition-all hover:bg-[#1a1a24] hover:border-[rgba(255,255,255,0.2)]">
          See How It Works
        </a>
      </div>
      
      <div class="flex flex-col md:flex-row gap-12 mt-20 pt-12 border-t border-[rgba(255,255,255,0.06)] animate-[fadeUp_0.8s_ease_0.5s_both]">
        <div class="text-center">
          <div class="font-['DM_Serif_Display',serif] text-4xl text-[#e8a034] leading-none">67%</div>
          <div class="text-xs text-[#5a5a6e] mt-2 max-w-[140px] mx-auto">of businesses miss critical contract deadlines</div>
        </div>
        <div class="text-center">
          <div class="font-['DM_Serif_Display',serif] text-4xl text-[#e8a034] leading-none">9.2%</div>
          <div class="text-xs text-[#5a5a6e] mt-2 max-w-[140px] mx-auto">average revenue lost to contract mismanagement</div>
        </div>
        <div class="text-center">
          <div class="font-['DM_Serif_Display',serif] text-4xl text-[#e8a034] leading-none">$0</div>
          <div class="text-xs text-[#5a5a6e] mt-2 max-w-[140px] mx-auto">tools that notify all parties to a deal today</div>
        </div>
      </div>
    </section>

    <!-- Problem Section -->
    <section id="problem" class="py-28 px-8 max-w-[1200px] mx-auto">
      <div class="inline-flex items-center gap-2 font-['JetBrains_Mono',monospace] text-xs text-[#e8a034] uppercase tracking-wider mb-4">
        <div class="w-5 h-px bg-[#e8a034]"></div>
        The Problem
      </div>
      <h2 class="font-['DM_Serif_Display',serif] text-[clamp(2rem,4vw,3rem)] leading-tight tracking-tight mb-4">
        Nobody serves all parties to a deal.
      </h2>
      <p class="text-lg text-[#9a9aab] max-w-[600px] font-light leading-relaxed mb-12">
        When a commercial lease is signed, seven people need to track what happens next. Today, zero tools connect them.
      </p>
      
      <div class="grid md:grid-cols-2 gap-16 mt-12">
        <div class="bg-[#111118] border border-[rgba(255,255,255,0.06)] rounded-2xl p-10 relative overflow-hidden">
          <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#e05252] to-[#e8a034]"></div>
          <div class="font-['DM_Serif_Display',serif] text-2xl mb-6">A typical commercial lease involves:</div>
          <ul class="flex flex-col gap-3 list-none">
            <li class="flex items-center gap-3 px-4 py-3 bg-[#1a1a24] rounded-lg text-sm">
              <span class="w-8 h-8 rounded-lg bg-[rgba(96,165,250,0.15)] text-[#60a5fa] flex items-center justify-center text-xs flex-shrink-0">🏢</span>
              Landlord
            </li>
            <li class="flex items-center gap-3 px-4 py-3 bg-[#1a1a24] rounded-lg text-sm">
              <span class="w-8 h-8 rounded-lg bg-[rgba(74,222,128,0.15)] text-[#4ade80] flex items-center justify-center text-xs flex-shrink-0">🏪</span>
              Tenant
            </li>
            <li class="flex items-center gap-3 px-4 py-3 bg-[#1a1a24] rounded-lg text-sm">
              <span class="w-8 h-8 rounded-lg bg-[rgba(167,139,250,0.15)] text-[#a78bfa] flex items-center justify-center text-xs flex-shrink-0">⚖️</span>
              Landlord's Attorney
            </li>
            <li class="flex items-center gap-3 px-4 py-3 bg-[#1a1a24] rounded-lg text-sm">
              <span class="w-8 h-8 rounded-lg bg-[rgba(167,139,250,0.15)] text-[#a78bfa] flex items-center justify-center text-xs flex-shrink-0">⚖️</span>
              Tenant's Attorney
            </li>
            <li class="flex items-center gap-3 px-4 py-3 bg-[#1a1a24] rounded-lg text-sm">
              <span class="w-8 h-8 rounded-lg bg-[rgba(232,160,52,0.15)] text-[#e8a034] flex items-center justify-center text-xs flex-shrink-0">📋</span>
              Property Manager
            </li>
            <li class="flex items-center gap-3 px-4 py-3 bg-[#1a1a24] rounded-lg text-sm">
              <span class="w-8 h-8 rounded-lg bg-[rgba(224,82,82,0.15)] text-[#e05252] flex items-center justify-center text-xs flex-shrink-0">🤝</span>
              Broker
            </li>
            <li class="flex items-center gap-3 px-4 py-3 bg-[#1a1a24] rounded-lg text-sm">
              <span class="w-8 h-8 rounded-lg bg-[rgba(232,160,52,0.15)] text-[#e8a034] flex items-center justify-center text-xs flex-shrink-0">🔐</span>
              Guarantor
            </li>
          </ul>
        </div>
        
        <div class="bg-[#111118] border border-[rgba(255,255,255,0.06)] rounded-2xl p-10">
          <div class="font-['DM_Serif_Display',serif] text-3xl leading-snug mb-8">
            Who needs to know the renewal window opens September 1st? <em class="italic text-[#e8a034]">All of them.</em>
          </div>
          
          <table class="w-full border-collapse">
            <thead>
              <tr>
                <th class="text-left text-xs uppercase tracking-wider text-[#5a5a6e] pb-3 border-b border-[rgba(255,255,255,0.06)]">Tool</th>
                <th class="text-left text-xs uppercase tracking-wider text-[#5a5a6e] pb-3 border-b border-[rgba(255,255,255,0.06)]">What it does</th>
                <th class="text-left text-xs uppercase tracking-wider text-[#5a5a6e] pb-3 border-b border-[rgba(255,255,255,0.06)]">The gap</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="py-3 border-b border-[rgba(255,255,255,0.06)] font-semibold text-[#f0ede6] pr-4 whitespace-nowrap">DocuSign</td>
                <td class="py-3 border-b border-[rgba(255,255,255,0.06)] text-[#9a9aab] pr-4">Gets it signed</td>
                <td class="py-3 border-b border-[rgba(255,255,255,0.06)] text-[#e05252] text-sm">Done after signature</td>
              </tr>
              <tr>
                <td class="py-3 border-b border-[rgba(255,255,255,0.06)] font-semibold text-[#f0ede6] pr-4 whitespace-nowrap">Deal Rooms</td>
                <td class="py-3 border-b border-[rgba(255,255,255,0.06)] text-[#9a9aab] pr-4">M&A transactions</td>
                <td class="py-3 border-b border-[rgba(255,255,255,0.06)] text-[#e05252] text-sm">Closes when deal closes</td>
              </tr>
              <tr>
                <td class="py-3 border-b border-[rgba(255,255,255,0.06)] font-semibold text-[#f0ede6] pr-4 whitespace-nowrap">CLM Tools</td>
                <td class="py-3 border-b border-[rgba(255,255,255,0.06)] text-[#9a9aab] pr-4">Internal storage</td>
                <td class="py-3 border-b border-[rgba(255,255,255,0.06)] text-[#e05252] text-sm">Single-party, inward-facing</td>
              </tr>
              <tr>
                <td class="py-3 border-b border-[rgba(255,255,255,0.06)] font-semibold text-[#f0ede6] pr-4 whitespace-nowrap">Google Drive</td>
                <td class="py-3 border-b border-[rgba(255,255,255,0.06)] text-[#9a9aab] pr-4">File sharing</td>
                <td class="py-3 border-b border-[rgba(255,255,255,0.06)] text-[#e05252] text-sm">No deadline awareness</td>
              </tr>
              <tr>
                <td class="py-3 border-b border-[rgba(255,255,255,0.06)] font-semibold text-[#f0ede6] pr-4 whitespace-nowrap">Calendar</td>
                <td class="py-3 border-b border-[rgba(255,255,255,0.06)] text-[#9a9aab] pr-4">Reminders</td>
                <td class="py-3 border-b border-[rgba(255,255,255,0.06)] text-[#e05252] text-sm">No documents, no coordination</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-px bg-[rgba(255,255,255,0.06)] rounded-2xl overflow-hidden mt-12">
        <div class="bg-[#111118] p-10 text-center">
          <div class="font-['DM_Serif_Display',serif] text-5xl text-[#e05252] leading-none">67%</div>
          <div class="text-sm text-[#9a9aab] mt-2">of businesses miss critical deadlines</div>
        </div>
        <div class="bg-[#111118] p-10 text-center">
          <div class="font-['DM_Serif_Display',serif] text-5xl text-[#e05252] leading-none">9.2%</div>
          <div class="text-sm text-[#9a9aab] mt-2">average annual revenue lost</div>
        </div>
        <div class="bg-[#111118] p-10 text-center">
          <div class="font-['DM_Serif_Display',serif] text-5xl text-[#e05252] leading-none">$1.5T</div>
          <div class="text-sm text-[#9a9aab] mt-2">global impact of poor contract management</div>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section id="how-it-works" class="py-28 px-8 max-w-[1200px] mx-auto">
      <div class="inline-flex items-center gap-2 font-['JetBrains_Mono',monospace] text-xs text-[#e8a034] uppercase tracking-wider mb-4">
        <div class="w-5 h-px bg-[#e8a034]"></div>
        How It Works
      </div>
      <h2 class="font-['DM_Serif_Display',serif] text-[clamp(2rem,4vw,3rem)] leading-tight tracking-tight mb-4">
        Five steps. Every party connected.
      </h2>
      <p class="text-lg text-[#9a9aab] max-w-[600px] font-light leading-relaxed mb-12">
        From upload to notification, Official Notice keeps everyone in the loop for the life of any agreement.
      </p>
      
      <div class="mt-12">
        <div class="grid grid-cols-1 md:grid-cols-5 gap-0 relative">
          <div v-for="(step, index) in steps" :key="index" class="text-center px-4 relative">
            <div v-if="index < 4" class="hidden md:block absolute right-[-0.5rem] top-8 text-[#e8a034] text-2xl opacity-50">→</div>
            <div class="w-14 h-14 rounded-2xl bg-[rgba(232,160,52,0.06)] border border-[rgba(232,160,52,0.2)] flex items-center justify-center mx-auto mb-4 font-['DM_Serif_Display',serif] text-xl text-[#e8a034]">
              {{ index + 1 }}
            </div>
            <div class="font-semibold text-sm mb-2">{{ step.title }}</div>
            <div class="text-xs text-[#9a9aab] leading-relaxed">{{ step.desc }}</div>
          </div>
        </div>
        
        <div class="flex items-center justify-center gap-6 mt-16 p-10 bg-[#111118] border border-[rgba(255,255,255,0.06)] rounded-2xl">
          <div class="text-center">
            <div class="text-3xl mb-2">📄</div>
            <div class="font-semibold text-sm">Document</div>
            <div class="text-xs text-[#5a5a6e] mt-1">The evidence</div>
          </div>
          <div class="font-['DM_Serif_Display',serif] text-3xl text-[#5a5a6e]">+</div>
          <div class="text-center">
            <div class="text-3xl mb-2">⏰</div>
            <div class="font-semibold text-sm">Deadline</div>
            <div class="text-xs text-[#5a5a6e] mt-1">The value</div>
          </div>
          <div class="font-['DM_Serif_Display',serif] text-3xl text-[#5a5a6e]">+</div>
          <div class="text-center">
            <div class="text-3xl mb-2">👥</div>
            <div class="font-semibold text-sm">All Parties</div>
            <div class="text-xs text-[#5a5a6e] mt-1">The team</div>
          </div>
          <div class="font-['DM_Serif_Display',serif] text-3xl text-[#e8a034]">=</div>
          <div class="text-center">
            <div class="w-12 h-12 bg-[#e8a034] rounded-xl flex items-center justify-center mx-auto mb-2 font-['DM_Serif_Display',serif] text-lg text-[#0a0a0f] font-bold">ON</div>
            <div class="font-semibold text-sm text-[#e8a034]">Official Notice</div>
            <div class="text-xs text-[#5a5a6e] mt-1">Transaction infrastructure</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Savings Section -->
    <section class="py-28 px-8 max-w-[1200px] mx-auto">
      <div class="inline-flex items-center gap-2 font-['JetBrains_Mono',monospace] text-xs text-[#e8a034] uppercase tracking-wider mb-4">
        <div class="w-5 h-px bg-[#e8a034]"></div>
        What You Save
      </div>
      <h2 class="font-['DM_Serif_Display',serif] text-[clamp(2rem,4vw,3rem)] leading-tight tracking-tight mb-4">
        The cost of missed deadlines is real.
      </h2>
      <p class="text-lg text-[#9a9aab] max-w-[600px] font-light leading-relaxed mb-12">
        Whether you're an attorney, a business, or a family — Official Notice prevents the consequences that matter most.
      </p>
      
      <div class="grid md:grid-cols-3 gap-6 mt-12">
        <div v-for="saving in savings" :key="saving.title" class="bg-[#111118] border border-[rgba(255,255,255,0.06)] rounded-2xl p-8 text-center">
          <div class="text-4xl mb-4">{{ saving.icon }}</div>
          <div class="font-['DM_Serif_Display',serif] text-xl mb-2">{{ saving.title }}</div>
          <div class="text-sm text-[#e05252] mb-1">✕ {{ saving.before }}</div>
          <div class="text-sm text-[#4ade80] mb-4">✓ {{ saving.after }}</div>
          <div class="text-sm text-[#9a9aab] leading-relaxed">{{ saving.desc }}</div>
        </div>
      </div>
    </section>

    <!-- Who It's For Section -->
    <section id="who-its-for" class="py-28 px-8 max-w-[1200px] mx-auto">
      <div class="inline-flex items-center gap-2 font-['JetBrains_Mono',monospace] text-xs text-[#e8a034] uppercase tracking-wider mb-4">
        <div class="w-5 h-px bg-[#e8a034]"></div>
        Who It's For
      </div>
      <h2 class="font-['DM_Serif_Display',serif] text-[clamp(2rem,4vw,3rem)] leading-tight tracking-tight mb-4">
        Three audiences. One platform.
      </h2>
      <p class="text-lg text-[#9a9aab] max-w-[600px] font-light leading-relaxed mb-12">
        Whether you create documents, manage them, or just need them safe — Official Notice has you covered.
      </p>
      
      <div class="grid md:grid-cols-3 gap-6 mt-12">
        <div v-for="userType in userTypes" :key="userType.type" 
             :class="['bg-[#111118] border border-[rgba(255,255,255,0.06)] rounded-[20px] p-10 transition-all hover:border-[rgba(255,255,255,0.12)] hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)] relative overflow-hidden', userType.class]">
          <div :class="['absolute top-0 left-0 right-0 h-1', userType.accent]"></div>
          <div class="flex items-center gap-4 mb-6">
            <div :class="['w-12 h-12 rounded-xl flex items-center justify-center text-2xl', userType.iconBg]">{{ userType.icon }}</div>
            <div>
              <div class="font-['JetBrains_Mono',monospace] text-xs uppercase tracking-wider text-[#5a5a6e]">{{ userType.type }}</div>
              <div class="font-['DM_Serif_Display',serif] text-2xl">{{ userType.name }}</div>
            </div>
          </div>
          <div class="text-base text-[#e8a034] font-medium mb-5">{{ userType.tagline }}</div>
          <div class="text-sm text-[#9a9aab] leading-relaxed mb-5">{{ userType.body }}</div>
          <ul class="flex flex-col gap-2.5 mb-8 list-none">
            <li v-for="benefit in userType.benefits" :key="benefit" class="flex items-start gap-2.5 text-sm text-[#9a9aab]">
              <span class="text-[#4ade80] font-bold flex-shrink-0 mt-0.5">✓</span>
              <span>{{ benefit }}</span>
            </li>
          </ul>
          <div class="pt-5 border-t border-[rgba(255,255,255,0.06)]">
            <div class="text-xs uppercase tracking-wider text-[#5a5a6e] mb-3">{{ userType.docsTitle }}</div>
            <div class="flex flex-wrap gap-2">
              <span v-for="tag in userType.docs" :key="tag" class="px-3 py-1.5 bg-[#1a1a24] rounded-md text-xs text-[#9a9aab]">{{ tag }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-28 px-8 max-w-[1200px] mx-auto">
      <div class="inline-flex items-center gap-2 font-['JetBrains_Mono',monospace] text-xs text-[#e8a034] uppercase tracking-wider mb-4">
        <div class="w-5 h-px bg-[#e8a034]"></div>
        Platform Features
      </div>
      <h2 class="font-['DM_Serif_Display',serif] text-[clamp(2rem,4vw,3rem)] leading-tight tracking-tight mb-4">
        Built for the life of any agreement.
      </h2>
      <p class="text-lg text-[#9a9aab] max-w-[600px] font-light leading-relaxed mb-12">
        Powerful features that work together to ensure nothing falls through the cracks.
      </p>
      
      <div class="grid md:grid-cols-2 gap-6 mt-12">
        <div class="md:col-span-2 grid md:grid-cols-2 gap-12 bg-gradient-to-br from-[#111118] to-[#1a1a24] border border-[rgba(255,255,255,0.06)] rounded-2xl p-12">
          <div>
            <div class="w-11 h-11 rounded-xl bg-[rgba(232,160,52,0.06)] flex items-center justify-center text-2xl mb-5">🧠</div>
            <div class="font-['DM_Serif_Display',serif] text-xl mb-3">AI-Powered Intelligence</div>
            <div class="text-sm text-[#9a9aab] leading-relaxed">Upload any document and our AI instantly extracts critical dates, identifies all parties and their roles, generates plain-language summaries, and suggests milestones based on document type. You review and confirm — we handle the heavy lifting.</div>
          </div>
          <div>
            <div class="w-11 h-11 rounded-xl bg-[rgba(232,160,52,0.06)] flex items-center justify-center text-2xl mb-5">🔔</div>
            <div class="font-['DM_Serif_Display',serif] text-xl mb-3">Multi-Channel Notifications</div>
            <div class="text-sm text-[#9a9aab] leading-relaxed">Email, SMS, and push notifications — customizable per person, per milestone. Alerts go out at 90, 60, 30, 14, 7, and 1 day before deadlines. Escalation protocols for urgent dates. The right person, right time, right channel.</div>
          </div>
        </div>
        
        <div v-for="feature in features" :key="feature.title" class="bg-[#111118] border border-[rgba(255,255,255,0.06)] rounded-2xl p-8 transition-all hover:border-[rgba(255,255,255,0.12)]">
          <div class="w-11 h-11 rounded-xl bg-[rgba(232,160,52,0.06)] flex items-center justify-center text-2xl mb-5">{{ feature.icon }}</div>
          <div class="font-['DM_Serif_Display',serif] text-xl mb-3">{{ feature.title }}</div>
          <div class="text-sm text-[#9a9aab] leading-relaxed">{{ feature.desc }}</div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section id="get-started" class="py-32 px-8 text-center relative">
      <div class="absolute inset-0 pointer-events-none"
           :style="{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(232,160,52,0.06) 0%, transparent 60%)' }">
      </div>
      
      <div class="inline-flex items-center gap-2 font-['JetBrains_Mono',monospace] text-xs text-[#e8a034] uppercase tracking-wider mb-4">
        <div class="w-5 h-px bg-[#e8a034]"></div>
        Get Started
      </div>
      <h2 class="font-['DM_Serif_Display',serif] text-[clamp(2rem,4vw,3rem)] leading-tight tracking-tight mb-4 max-w-[700px] mx-auto">
        Every important document. Every critical deadline. Everyone who needs to know.
      </h2>
      <p class="text-lg text-[#9a9aab] max-w-[500px] mx-auto mb-10 font-light leading-relaxed">
        Choose the experience that fits your needs. Every plan starts with a 90-day free trial.
      </p>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-[900px] mx-auto">
        <router-link to="/register?type=attorney" class="bg-[#111118] border border-[rgba(255,255,255,0.06)] rounded-2xl p-8 text-center no-underline transition-all hover:border-[#e8a034] hover:-translate-y-1">
          <div class="text-3xl mb-3">⚖️</div>
          <div class="font-bold text-base mb-1">Attorneys</div>
          <div class="text-xs text-[#5a5a6e] mb-3">14-day free trial</div>
          <div class="font-['JetBrains_Mono',monospace] text-xs text-[#e8a034]">attorney.officialnotice.com</div>
        </router-link>
        <router-link to="/register?type=business" class="bg-[#111118] border border-[rgba(255,255,255,0.06)] rounded-2xl p-8 text-center no-underline transition-all hover:border-[#e8a034] hover:-translate-y-1">
          <div class="text-3xl mb-3">🏢</div>
          <div class="font-bold text-base mb-1">Business</div>
          <div class="text-xs text-[#5a5a6e] mb-3">Free to start</div>
          <div class="font-['JetBrains_Mono',monospace] text-xs text-[#e8a034]">business.officialnotice.com</div>
        </router-link>
        <router-link to="/register?type=personal" class="bg-[#111118] border border-[rgba(255,255,255,0.06)] rounded-2xl p-8 text-center no-underline transition-all hover:border-[#e8a034] hover:-translate-y-1">
          <div class="text-3xl mb-3">🏠</div>
          <div class="font-bold text-base mb-1">Personal & Family</div>
          <div class="text-xs text-[#5a5a6e] mb-3">Free forever plan</div>
          <div class="font-['JetBrains_Mono',monospace] text-xs text-[#e8a034]">my.officialnotice.com</div>
        </router-link>
      </div>
    </section>

    <!-- Footer -->
    <footer class="py-12 px-8 max-w-[1200px] mx-auto border-t border-[rgba(255,255,255,0.06)] flex flex-col md:flex-row items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <div class="w-7 h-7 bg-[#e8a034] rounded-lg flex items-center justify-center font-['DM_Serif_Display',serif] text-sm text-[#0a0a0f] font-bold">ON</div>
        <div class="font-['DM_Serif_Display',serif] text-sm italic text-[#5a5a6e]">"You've been officially noticed."</div>
      </div>
      <ul class="flex gap-8 list-none">
        <li><a href="#" class="text-sm text-[#5a5a6e] hover:text-[#9a9aab] transition-colors no-underline">About</a></li>
        <li><a href="#" class="text-sm text-[#5a5a6e] hover:text-[#9a9aab] transition-colors no-underline">Contact</a></li>
        <li><a href="#" class="text-sm text-[#5a5a6e] hover:text-[#9a9aab] transition-colors no-underline">Privacy</a></li>
        <li><a href="#" class="text-sm text-[#5a5a6e] hover:text-[#9a9aab] transition-colors no-underline">Terms</a></li>
        <li><a href="mailto:info@officialnotice.com" class="text-sm text-[#5a5a6e] hover:text-[#9a9aab] transition-colors no-underline">info@officialnotice.com</a></li>
      </ul>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const steps = [
  {
    title: 'Upload Documents',
    desc: 'You or your attorney uploads the signed agreement, lease, or contract.'
  },
  {
    title: 'AI Extracts Deadlines',
    desc: 'Our AI reads every page and finds critical dates, parties, and key terms.'
  },
  {
    title: 'Connect All Parties',
    desc: 'Invite every stakeholder — landlords, tenants, attorneys, managers.'
  },
  {
    title: 'Notifications Go Out',
    desc: 'Email, SMS, push — the right person, right time, right channel.'
  },
  {
    title: 'Agreement Lives On',
    desc: 'Unlike deal rooms, we stay open for the life of the agreement. 5-year lease? We\'re there.'
  }
]

const savings = [
  {
    icon: '💰',
    title: 'Missed Renewals',
    before: 'Auto-renewed at unfavorable terms',
    after: '90-day advance notice to all parties',
    desc: 'One missed lease renewal can cost tens of thousands. We alert every party at 90, 60, 30, 14, 7, and 1 day before.'
  },
  {
    icon: '📋',
    title: 'Compliance Failures',
    before: '$4M average regulatory penalty',
    after: 'Automated compliance tracking',
    desc: 'Compliance deadlines don\'t care about your spreadsheet. Multi-channel alerts ensure nothing falls through the cracks.'
  },
  {
    icon: '🛂',
    title: 'Expired Visas & Permits',
    before: 'Career and life disruption',
    after: 'Critical date alerts for the whole family',
    desc: 'Visa expirations are life-altering. We track every immigration deadline and alert both you and your attorney.'
  },
  {
    icon: '📞',
    title: 'Support Call Overload',
    before: '"Where\'s my document?" calls daily',
    after: '24/7 client access to their vault',
    desc: 'Attorneys spend hours fielding document requests. Client vaults give 24/7 access and your name on every notification.'
  },
  {
    icon: '🔄',
    title: 'Coordination Chaos',
    before: '7 parties, 7 spreadsheets, 0 alignment',
    after: 'One platform, everyone connected',
    desc: 'Stop emailing PDFs back and forth. Every party sees the same deadlines with role-based permissions.'
  },
  {
    icon: '🔐',
    title: 'Disputed Signatures',
    before: '"I didn\'t sign that" — email link only',
    after: 'ID-verified signing with face match',
    desc: 'Our Verified Signing proves identity at the moment of signing — not just that someone clicked an email link.'
  }
]

const userTypes = [
  {
    type: 'For Attorneys',
    name: 'Create & Share',
    tagline: 'Stop fielding "where\'s my document?" calls.',
    body: 'Share documents directly to client vaults. Stay connected through the life of every agreement. Your firm\'s name and contact info on every notification.',
    icon: '⚖️',
    iconBg: 'bg-[rgba(167,139,250,0.12)]',
    accent: 'bg-gradient-to-r from-[#a78bfa] to-[#60a5fa]',
    class: 'attorney',
    benefits: [
      'Secure client vault delivery — no email attachments',
      'Your name on every deadline notification',
      'Multi-client dashboard with all upcoming dates',
      'AI extracts parties, dates, and key terms automatically',
      'Professional firm branding on all communications'
    ],
    docsTitle: 'Practice areas',
    docs: ['Commercial Leases', 'Estate Planning', 'Immigration', 'Family Law', 'Contracts']
  },
  {
    type: 'For Business',
    name: 'Manage & Track',
    tagline: 'Never miss a renewal across all your locations.',
    body: 'Track deadlines across locations, teams, and transactions. Receive documents from attorneys. Add your own. See everything in one dashboard.',
    icon: '🏢',
    iconBg: 'bg-[rgba(232,160,52,0.12)]',
    accent: 'bg-gradient-to-r from-[#e8a034] to-[#f4c366]',
    class: 'business',
    benefits: [
      'Multi-location lease and contract tracking',
      'Team coordination with role-based access',
      'Receive documents directly from attorneys',
      'AI-powered deadline extraction from any document',
      'API access for integration with existing systems'
    ],
    docsTitle: 'Ideal for',
    docs: ['Property Managers', 'Retail Chains', 'Franchise Ops', 'Healthcare', 'Professional Services']
  },
  {
    type: 'For Personal & Family',
    name: 'Store & Protect',
    tagline: 'Your life\'s important documents, finally organized.',
    body: 'One secure vault for everything. Receive documents from your attorney. Add leases, insurance, passports. Share with family. Get alerts before deadlines hit.',
    icon: '🏠',
    iconBg: 'bg-[rgba(74,222,128,0.12)]',
    accent: 'bg-gradient-to-r from-[#4ade80] to-[#60a5fa]',
    class: 'personal',
    benefits: [
      'Receive wills, trusts, and legal documents securely',
      'Store leases, insurance, passports, licenses',
      'Family sharing with spouse, children, caregivers',
      'Emergency access for designated contacts',
      'Plain-language AI summaries of complex documents'
    ],
    docsTitle: 'Who it\'s for',
    docs: ['Families', 'Caregivers', 'Immigrants', 'Renters', 'Professionals']
  }
]

const features = [
  {
    icon: '✍️',
    title: 'Verified Signing',
    desc: 'Government ID verification plus live facial recognition at the moment of signing. Not just "someone clicked a link" — proof that the actual person signed the actual document. If any party verifies, all parties must verify.'
  },
  {
    icon: '👥',
    title: 'Multi-Party by Design',
    desc: 'Every transaction supports unlimited parties with distinct roles — landlord, tenant, attorneys, property manager, guarantor. Role-based permissions control who sees what, who can edit, and who administers.'
  },
  {
    icon: '🔒',
    title: 'Enterprise Security',
    desc: 'End-to-end encryption, SOC 2 Type 2 compliance, GDPR and CCPA compliant, complete audit trails. Attorney-client privilege protected. Your documents are safer here than in a filing cabinet.'
  },
  {
    icon: '💚',
    title: 'Life Check',
    desc: 'A dead man\'s switch for your documents. Designate who gets access if you can\'t check in. Family, attorneys, even journalists. Estate planning meets document security meets peace of mind.'
  }
]

onMounted(() => {
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute('href') || '')
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    })
  })
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Outfit', sans-serif;
  -webkit-font-smoothing: antialiased;
}
</style>
