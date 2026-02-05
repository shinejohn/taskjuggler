<template>
  <div class="min-h-screen bg-slate-50 font-sans selection:bg-blue-200 selection:text-blue-900">
    
    <!-- Navigation -->
    <nav class="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 transition-all duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-20">
          <!-- Logo -->
          <div class="flex items-center gap-3 group cursor-pointer" @click="$router.push('/')">
            <div class="relative">
              <div class="absolute inset-0 bg-blue-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <div class="h-10 w-10 relative rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-900/10 border border-white/10">
                <Activity class="h-5 w-5 text-white" />
              </div>
            </div>
            <div class="flex flex-col">
              <span class="text-xl font-black tracking-tight text-slate-900 leading-none">4healthcare</span>
              <span class="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest">Platform</span>
            </div>
          </div>
          
          <!-- Desktop Menu -->
          <div class="hidden md:flex items-center gap-8">
            <a href="#features" class="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">Platform</a>
            <a href="#solutions" class="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">Solutions</a>
            <a href="#pricing" class="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">Pricing</a>
            <div class="h-4 w-px bg-slate-200"></div>
            <router-link to="/login" class="text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors">Log In</router-link>
            <router-link 
              to="/signup" 
              class="px-5 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            >
              Get Started
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <header class="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden perspective-distant">
      <!-- Background Gradients -->
      <div class="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[800px] h-[800px] bg-blue-400/20 rounded-full blur-[100px] opacity-50 animate-blob"></div>
      <div class="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[600px] h-[600px] bg-teal-400/20 rounded-full blur-[100px] opacity-50 animate-blob animation-delay-2000"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-indigo-400/10 rounded-full blur-[100px] opacity-30 animate-blob animation-delay-4000"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <!-- Badge -->
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm mb-8 animate-fade-in-up">
          <span class="flex h-2 w-2 rounded-full bg-green-500 relative">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          </span>
          <span class="text-xs font-bold text-slate-600 uppercase tracking-wide">New: URPA AI Assistant v2.0</span>
          <ArrowRight class="w-3 h-3 text-slate-400" />
        </div>
        
        <!-- Headline -->
        <h1 class="text-5xl lg:text-8xl font-black text-slate-900 tracking-tight mb-8 leading-[0.9] text-balance">
          The Operating System for <span class="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">Modern Medicine</span>
        </h1>
        
        <p class="text-xl lg:text-2xl text-slate-500 mb-12 max-w-3xl mx-auto leading-relaxed text-balance font-medium">
          Automate 80% of administrative work. AI Scribing, Claims, Prior Auth, and Patient scheduling—all seamlessly integrated into one beautiful platform.
        </p>
        
        <!-- CTAs -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <router-link 
            to="/signup"
            class="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white font-bold text-lg rounded-2xl shadow-xl shadow-slate-900/20 hover:bg-slate-800 hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
          >
            Start Free Trial
            <ArrowRight class="w-5 h-5" />
          </router-link>
          <button class="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 font-bold text-lg rounded-2xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all flex items-center justify-center gap-2 shadow-sm">
            <PlayCircle class="w-5 h-5 text-blue-600" />
            Watch Product Demo
          </button>
        </div>

        <!-- Visual Dashboard Mockup -->
        <div class="relative mt-20 mx-auto max-w-5xl group perspective-1000">
             <div class="absolute -inset-1 bg-gradient-to-r from-blue-600 to-teal-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
             <img 
               src="/images/dashboard-ui.png" 
               alt="4healthcare Dashboard" 
               class="relative rounded-2xl shadow-2xl border border-slate-200/50 transform rotate-x-12 group-hover:rotate-x-0 transition-transform duration-700 ease-out"
             />
        </div>

        <!-- Social Proof -->
        <div class="border-t border-slate-200 max-w-4xl mx-auto pt-16 mt-20">
          <p class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Trusted by innovative healthcare providers</p>
          <div class="flex flex-wrap justify-center gap-x-12 gap-y-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
           <!-- Placeholder Logos -->
           <div class="flex items-center gap-2 font-bold text-xl text-slate-800"><Hexagon class="w-6 h-6 text-indigo-600" /> ClinicOne</div>
           <div class="flex items-center gap-2 font-bold text-xl text-slate-800"><Triangle class="w-6 h-6 text-emerald-600" /> HealthFlow</div>
           <div class="flex items-center gap-2 font-bold text-xl text-slate-800"><Circle class="w-6 h-6 text-blue-600" /> WellSpring</div>
           <div class="flex items-center gap-2 font-bold text-xl text-slate-800"><Square class="w-6 h-6 text-purple-600" /> MedTech</div>
          </div>
        </div>
      </div>
    </header>

    <!-- Bento Grid Features -->
    <section id="solutions" class="py-32 bg-white relative">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16 max-w-3xl mx-auto">
          <h2 class="text-4xl lg:text-5xl font-black text-slate-900 mb-6 tracking-tight">Run your practice on autopilot.</h2>
          <p class="text-xl text-slate-500">Forget fragmented tools. 4healthcare unifies every aspect of your professional life into three powerful modes.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[800px]">
           <!-- URPA Card (Large, Left) -->
           <div class="col-span-1 md:col-span-8 md:row-span-2 rounded-[2.5rem] bg-gradient-to-br from-slate-900 to-slate-800 text-white p-10 relative overflow-hidden group shadow-2xl">
              <div class="relative z-10 flex flex-col h-full">
                <div class="mb-auto">
                  <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-bold uppercase tracking-wider mb-6 text-teal-300">
                    <Bot class="w-3 h-3" /> Core Technology
                  </div>
                  <h3 class="text-4xl font-black mb-4 group-hover:text-teal-300 transition-colors">Meet URPA.</h3>
                  <p class="text-lg text-slate-300 max-w-lg leading-relaxed">Your Universal Robotic Process Automation agent. URPA doesn't just chat—it *does*. It answers calls, navigates portals, files claims, and drafts notes while you sleep.</p>
                </div>
                
                <!-- Mock UI -->
                <div class="mt-8 bg-slate-800/50 rounded-xl border border-white/10 p-6 backdrop-blur-sm transform group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-500 ease-out">
                   <div class="flex gap-4">
                     <div class="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center border border-teal-500/30">
                        <Bot class="w-6 h-6 text-teal-400" />
                     </div>
                     <div class="flex-1">
                        <p class="text-sm font-medium text-teal-300 mb-1">URPA Agent</p>
                        <p class="text-lg font-light text-white">"I've verified insurance for Sarah Jones, drafted her prior authorization, and scheduled her MRI for Tuesday. Anything else, Doctor?"</p>
                     </div>
                   </div>
                </div>
              </div>
              
              <!-- Decor -->
              <div class="absolute -right-20 -bottom-20 w-96 h-96 bg-teal-500/20 rounded-full blur-[80px] group-hover:bg-teal-500/30 transition-all"></div>
           </div>

           <!-- Practice Mode (Right Top) -->
           <div class="col-span-1 md:col-span-4 rounded-[2.5rem] bg-blue-50 border border-blue-100 p-8 flex flex-col justify-between group hover:shadow-xl hover:border-blue-200 transition-all">
              <div class="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center mb-6 text-white shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform">
                <Stethoscope class="w-6 h-6" />
              </div>
              <div>
                <h3 class="text-2xl font-black text-slate-900 mb-2">Practice Mode</h3>
                <p class="text-slate-500 font-medium">Labs, referrals, and smart scheduling integrated with ScribeMD.</p>
              </div>
           </div>

           <!-- Business Mode (Right Middle) -->
           <div class="col-span-1 md:col-span-4 rounded-[2.5rem] bg-purple-50 border border-purple-100 p-8 flex flex-col justify-between group hover:shadow-xl hover:border-purple-200 transition-all">
              <div class="w-12 h-12 rounded-2xl bg-purple-600 flex items-center justify-center mb-6 text-white shadow-lg shadow-purple-600/20 group-hover:scale-110 transition-transform">
                <Building2 class="w-6 h-6" />
              </div>
              <div>
                <h3 class="text-2xl font-black text-slate-900 mb-2">Business Mode</h3>
                <p class="text-slate-500 font-medium">Staff management, payroll, vendor orders, and CME tracking.</p>
              </div>
           </div>

           <!-- Personal Mode (Right Bottom) -->
           <div class="col-span-1 md:col-span-4 rounded-[2.5rem] bg-emerald-50 border border-emerald-100 p-8 flex flex-col justify-between group hover:shadow-xl hover:border-emerald-200 transition-all">
              <div class="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center mb-6 text-white shadow-lg shadow-emerald-600/20 group-hover:scale-110 transition-transform">
                <Plane class="w-6 h-6" />
              </div>
              <div>
                <h3 class="text-2xl font-black text-slate-900 mb-2">Personal Mode</h3>
                <p class="text-slate-500 font-medium">Because you're human too. Travel, goals, and family time.</p>
              </div>
           </div>
        </div>
      </div>
    </section>

    <!-- Deep Dive Features -->
    <section class="py-24 bg-slate-50 border-t border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid md:grid-cols-2 gap-20 items-center">
            <div class="order-2 md:order-1 relative">
                <div class="absolute inset-0 bg-blue-600/5 rounded-[3rem] transform rotate-3 scale-105"></div>
                <div class="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 relative z-10 transform hover:scale-[1.02] transition-transform duration-500">
                    <img src="/images/scribe-ui.png" alt="ScribeMD Interface" class="w-full h-auto object-cover" />
                </div>
            </div>
            
            <div class="order-1 md:order-2">
                <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-6">
                    <Phone class="w-3 h-3" /> 4Calls Integration
                </div>
                <h2 class="text-4xl lg:text-5xl font-black text-slate-900 mb-6">The AI Receptionist that never sleeps.</h2>
                <p class="text-lg text-slate-500 mb-8 leading-relaxed">
                    Stop paying for after-hours services. URPA answers calls 24/7 with a friendly, custom voice. It screens solicitors, schedules patients directly into your calendar, and routes urgent clinical matters to your on-call phone.
                </p>
                <ul class="space-y-4">
                    <li class="flex items-center gap-3 text-slate-700 font-bold">
                        <div class="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600"><Check class="w-3 h-3" /></div>
                        HIPAA Compliant Conversation Recording
                    </li>
                    <li class="flex items-center gap-3 text-slate-700 font-bold">
                        <div class="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600"><Check class="w-3 h-3" /></div>
                        Automatic Insurance Verification
                    </li>
                    <li class="flex items-center gap-3 text-slate-700 font-bold">
                        <div class="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600"><Check class="w-3 h-3" /></div>
                        Customizable Office Hours & Routing
                    </li>
                </ul>
            </div>
        </div>

        <!-- Mobile App Section -->
        <div class="mt-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="bg-slate-900 rounded-[3rem] p-12 md:p-20 relative overflow-hidden text-white flex flex-col md:flex-row items-center gap-12">
                <!-- Content -->
                <div class="flex-1 relative z-10">
                    <h2 class="text-4xl lg:text-5xl font-black mb-6">Your practice in your pocket.</h2>
                    <p class="text-lg text-slate-400 mb-8 max-w-lg">
                        Access patient charts, approve requests, and communicate securely from anywhere. The 4doctors mobile app gives you freedom.
                    </p>
                    <div class="flex gap-4">
                        <button class="px-6 py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-100 transition-colors flex items-center gap-2">
                             Download for iOS
                        </button>
                    </div>
                </div>
                <!-- Image -->
                <div class="flex-1 relative z-10 flex justify-center">
                    <img src="/images/mobile-ui.png" alt="Mobile App" class="max-w-xs md:max-w-md drop-shadow-2xl transform rotate-[-5deg] hover:rotate-0 transition-transform duration-500" />
                </div>
                <!-- bg decor -->
                 <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px]"></div>
            </div>
        </div>
      </div>
    </section>

    <!-- Whitepaper CTA -->
    <section class="py-20 bg-blue-600 text-white relative overflow-hidden">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div class="max-w-2xl">
                <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500 text-blue-100 text-xs font-bold uppercase tracking-wider mb-4 border border-blue-400">
                    Free Research
                </div>
                <h2 class="text-3xl font-black mb-4">The 2026 Guide to Clinical Automation</h2>
                <p class="text-blue-100 text-lg">Learn how top clinics are saving 15 hours/week per provider. We analyzed 500+ practices to create this blueprint.</p>
            </div>
            <button class="px-8 py-4 bg-white text-blue-600 font-bold text-lg rounded-xl shadow-xl hover:bg-blue-50 transition-all whitespace-nowrap" onclick="document.getElementById('contact-form').scrollIntoView({behavior: 'smooth'})">
                Download Whitepaper
            </button>
        </div>
        <!-- BG Pattern -->
        <div class="absolute inset-0 opacity-10" :style="patternStyle"></div>
    </section>

    <!-- Pricing (Simplified from original but beautified) -->
    <section id="pricing" class="py-32 bg-slate-900 relative overflow-hidden text-white">
        <!-- Grid Pattern -->
        <div class="absolute inset-0 opacity-[0.03]" :style="patternStyle"></div>
        <div class="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-slate-900 to-transparent"></div>
        <div class="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-slate-900 to-transparent"></div>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div class="text-center mb-20">
                <h2 class="text-4xl font-black mb-4">Transparent Pricing.</h2>
                <p class="text-xl text-slate-400">Everything you need, nothing you don't.</p>
            </div>

            <div class="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <div class="bg-slate-800/50 backdrop-blur-sm border border-white/5 rounded-3xl p-8 hover:bg-slate-800 transition-colors">
                    <h3 class="text-lg font-bold text-slate-300 mb-4">Solo Provider</h3>
                    <div class="text-4xl font-black mb-8">$199<span class="text-base font-medium text-slate-500">/mo</span></div>
                    <ul class="space-y-4 mb-8 text-sm text-slate-300">
                        <li class="flex gap-3"><Check class="w-5 h-5 text-blue-500" /> Full Practice Mode</li>
                        <li class="flex gap-3"><Check class="w-5 h-5 text-blue-500" /> AI Scribe (Unlimited)</li>
                        <li class="flex gap-3"><Check class="w-5 h-5 text-blue-500" /> Basic URPA Agent</li>
                    </ul>
                    <button class="w-full py-3 rounded-xl border border-white/20 hover:bg-white/5 font-bold transition-colors">Start Trial</button>
                </div>

                <div class="bg-blue-600 rounded-3xl p-8 shadow-2xl shadow-blue-900/50 relative transform md:scale-110 z-10 border border-blue-400">
                    <div class="absolute top-0 right-0 bg-white text-blue-600 text-xs font-black px-3 py-1 rounded-bl-xl rounded-tr-2xl uppercase tracking-wider">Most Popular</div>
                    <h3 class="text-lg font-bold text-blue-100 mb-4">Clinic Team</h3>
                    <div class="text-4xl font-black mb-8">$499<span class="text-base font-medium text-blue-200">/mo</span></div>
                    <ul class="space-y-4 mb-8 text-sm text-white font-medium">
                        <li class="flex gap-3"><Check class="w-5 h-5 text-blue-200" /> Up to 5 Providers</li>
                        <li class="flex gap-3"><Check class="w-5 h-5 text-blue-200" /> Advanced URPA (Calls+Web)</li>
                        <li class="flex gap-3"><Check class="w-5 h-5 text-blue-200" /> Business Mode & Payroll</li>
                         <li class="flex gap-3"><Check class="w-5 h-5 text-blue-200" /> Priority Support</li>
                    </ul>
                    <button class="w-full py-3 rounded-xl bg-white text-blue-600 hover:bg-blue-50 font-bold transition-colors shadow-lg">Get Started</button>
                </div>

                <div class="bg-slate-800/50 backdrop-blur-sm border border-white/5 rounded-3xl p-8 hover:bg-slate-800 transition-colors">
                    <h3 class="text-lg font-bold text-slate-300 mb-4">Enterprise</h3>
                    <div class="text-4xl font-black mb-8">Custom</div>
                    <ul class="space-y-4 mb-8 text-sm text-slate-300">
                        <li class="flex gap-3"><Check class="w-5 h-5 text-blue-500" /> Unlimited Providers</li>
                        <li class="flex gap-3"><Check class="w-5 h-5 text-blue-500" /> Custom AI Training</li>
                        <li class="flex gap-3"><Check class="w-5 h-5 text-blue-500" /> Dedicated Success Manager</li>
                    </ul>
                    <button class="w-full py-3 rounded-xl border border-white/20 hover:bg-white/5 font-bold transition-colors">Contact Sales</button>
                </div>
            </div>
        </div>
    </section>

    <!-- Contact & Footer Section -->
    <section id="contact-form" class="py-24 bg-white border-t border-slate-200 relative overflow-hidden">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div class="grid lg:grid-cols-2 gap-16 items-center">
                <!-- Text -->
                <div>
                   <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider mb-6">
                        Contact Us
                    </div>
                    <h2 class="text-4xl font-black text-slate-900 mb-6">Ready to modernize your practice?</h2>
                    <p class="text-lg text-slate-500 mb-8 leading-relaxed">
                        Join hundreds of forward-thinking healthcare providers who have taken back their time. Whether you're a solo practitioner or a large clinic, 4healthcare scales with you.
                    </p>
                    
                    <div class="flex flex-col gap-6">
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                <Mail class="w-6 h-6" />
                            </div>
                            <div>
                                <h4 class="font-bold text-slate-900">Email Us</h4>
                                <p class="text-slate-500">support@4healthcare.ai</p>
                            </div>
                        </div>
                         <div class="flex items-center gap-4">
                            <div class="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                <Phone class="w-6 h-6" />
                            </div>
                            <div>
                                <h4 class="font-bold text-slate-900">Call Sales</h4>
                                <p class="text-slate-500">+1 (888) 555-0123</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Form Component -->
                <div>
                    <ContactForm />
                </div>
            </div>
        </div>
    </section>

    <!-- Unified Footer -->
    <footer class="bg-white border-t border-slate-200 py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
            <div class="flex items-center gap-2">
                 <div class="h-8 w-8 rounded-lg bg-slate-900 flex items-center justify-center">
                    <Activity class="h-4 w-4 text-white" />
                  </div>
                <span class="font-bold text-slate-900 text-lg">4healthcare</span>
            </div>
            
            <div class="flex gap-8 text-sm font-bold text-slate-500">
                <a href="#" class="hover:text-blue-600">Privacy</a>
                <a href="#" class="hover:text-blue-600">Terms</a>
                <a href="#" class="hover:text-blue-600">Status</a>
            </div>

            <p class="text-slate-400 text-sm">© 2026 4healthcare Inc.</p>
        </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { 
  Activity, 
  ArrowRight,
  PlayCircle,
  Bot,
  Stethoscope,
  Building2,
  Plane,
  Phone,
  Mail,
  Check,
  Hexagon,
  Triangle,
  Circle,
  Square
} from 'lucide-vue-next';

// Components
import ContactForm from '@/components/landing/ContactForm.vue';

const patternStyle = computed(() => ({
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
}));
</script>

<style>
@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}
.animate-blob {
  animation: blob 7s infinite;
}
.animation-delay-2000 {
  animation-delay: 2s;
}
.animation-delay-4000 {
  animation-delay: 4s;
}
</style>
