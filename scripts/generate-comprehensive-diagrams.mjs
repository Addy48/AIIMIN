import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const REPO_ROOT = '/Users/aaditya/Desktop/DASHBOARD PROJECT';
const DIAGRAMS_DIR = path.join(REPO_ROOT, 'docs/diagrams');
const ARTIFACT_DIR = '/Users/aaditya/.gemini/antigravity-ide/brain/d1cb2f0d-419d-4ba6-94fe-df0af9376be3';

// Ensure output directories exist
if (!fs.existsSync(DIAGRAMS_DIR)) {
  fs.mkdirSync(DIAGRAMS_DIR, { recursive: true });
}

// ── 1. SVG: Web Life OS Full Architecture & Flow ──
const svgWebLifeOs = `<svg viewBox="0 0 1400 860" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="web-grad-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#14171A" />
      <stop offset="100%" stop-color="#0E1012" />
    </linearGradient>
    <linearGradient id="web-grad-card" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1E2228" />
      <stop offset="100%" stop-color="#16191E" />
    </linearGradient>
    <filter id="web-glow-spark" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
    <marker id="w-arrow-steel" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 8 5 L 0 9 z" fill="#749DC4" />
    </marker>
    <marker id="w-arrow-spark" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 8 5 L 0 9 z" fill="#FF6B35" />
    </marker>
    <marker id="w-arrow-green" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 8 5 L 0 9 z" fill="#10B981" />
    </marker>
    <marker id="w-arrow-gold" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 8 5 L 0 9 z" fill="#F5A623" />
    </marker>
    <pattern id="w-grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#22272E" stroke-width="1" stroke-opacity="0.5"/>
    </pattern>
  </defs>

  <rect width="1400" height="860" fill="url(#web-grad-bg)" rx="16" />
  <rect width="1400" height="860" fill="url(#w-grid)" rx="16" />

  <!-- SECTION 1: PUBLIC & ENTRY SURFACES (Top Left) -->
  <g transform="translate(40, 40)">
    <rect width="360" height="240" rx="14" fill="#1A1E24" stroke="#333942" stroke-width="1.5" />
    <text x="20" y="32" fill="#749DC4" font-family="'JetBrains Mono', monospace" font-weight="700" font-size="11" letter-spacing="0.1em">1. PUBLIC SURFACES & ONBOARDING</text>
    
    <g transform="translate(16, 48)">
      <rect width="156" height="76" rx="8" fill="#1E2228" stroke="#333942" />
      <text x="12" y="24" fill="#F0EDE8" font-family="'Inter', sans-serif" font-weight="700" font-size="13">Landing & Waitlist</text>
      <text x="12" y="42" fill="#9CA3AF" font-family="'JetBrains Mono', monospace" font-size="10">/ · /waitlist</text>
      <text x="12" y="60" fill="#749DC4" font-family="'Inter', sans-serif" font-size="9">Hero · Spec Matrix · QA</text>
    </g>

    <g transform="translate(188, 48)">
      <rect width="156" height="76" rx="8" fill="#1E2228" stroke="#333942" />
      <text x="12" y="24" fill="#F0EDE8" font-family="'Inter', sans-serif" font-weight="700" font-size="13">Brand & Companion</text>
      <text x="12" y="42" fill="#9CA3AF" font-family="'JetBrains Mono', monospace" font-size="10">/brand · /app</text>
      <text x="12" y="60" fill="#749DC4" font-family="'Inter', sans-serif" font-size="9">Brand DNA · APK Link</text>
    </g>

    <g transform="translate(16, 136)">
      <rect width="328" height="88" rx="8" fill="#1E2228" stroke="#333942" />
      <text x="12" y="24" fill="#F0EDE8" font-family="'Inter', sans-serif" font-weight="700" font-size="13">Legal & Governance Hub</text>
      <text x="12" y="42" fill="#9CA3AF" font-family="'JetBrains Mono', monospace" font-size="10">/privacy · /terms · /security · /data-deletion · /legal</text>
      <text x="12" y="64" fill="#6B7280" font-family="'Inter', sans-serif" font-size="10">Immutable Genesis governance · Consent Banner · Cookie compliance</text>
    </g>
  </g>

  <!-- SECTION 2: AUTHENTICATION & ACCESS GATE (Top Middle) -->
  <g transform="translate(440, 40)">
    <rect width="460" height="240" rx="14" fill="#1A1E24" stroke="#F5A623" stroke-width="1.5" />
    <text x="20" y="32" fill="#F5A623" font-family="'JetBrains Mono', monospace" font-weight="700" font-size="11" letter-spacing="0.1em">2. AUTHENTICATION & ACCESS GATEWAY</text>

    <!-- OS-ID Resolver -->
    <g transform="translate(16, 48)">
      <rect width="206" height="80" rx="8" fill="#1E2228" stroke="#333942" />
      <text x="12" y="24" fill="#F0EDE8" font-family="'Inter', sans-serif" font-weight="700" font-size="13">OS-ID Input & Resolver</text>
      <text x="12" y="44" fill="#FF6B35" font-family="'JetBrains Mono', monospace" font-weight="700" font-size="11">AADI0837 (Always Upper)</text>
      <text x="12" y="64" fill="#9CA3AF" font-family="'Inter', sans-serif" font-size="10">&lt;80ms auto-scan debounced</text>
    </g>

    <!-- PIN Keypad & Biometrics -->
    <g transform="translate(238, 48)">
      <rect width="206" height="80" rx="8" fill="#1E2228" stroke="#333942" />
      <text x="12" y="24" fill="#F0EDE8" font-family="'Inter', sans-serif" font-weight="700" font-size="13">Numpad PIN Keypad</text>
      <text x="12" y="44" fill="#10B981" font-family="'JetBrains Mono', monospace" font-weight="700" font-size="11">● ● ● ● (6-Digit PIN)</text>
      <text x="12" y="64" fill="#9CA3AF" font-family="'Inter', sans-serif" font-size="10">Argon2id Hash verification</text>
    </g>

    <!-- Guards Strip -->
    <g transform="translate(16, 140)">
      <rect width="428" height="84" rx="8" fill="#14171A" stroke="#262B33" />
      <text x="14" y="24" fill="#F5A623" font-family="'JetBrains Mono', monospace" font-weight="700" font-size="11">Security & Device Route Guards</text>
      <text x="14" y="46" fill="#F0EDE8" font-family="'Inter', sans-serif" font-size="11">TierRouteGuard: Explore / Pro / Sovereign Access Enforcement</text>
      <text x="14" y="66" fill="#9CA3AF" font-family="'Inter', sans-serif" font-size="11">DeviceGate: Phone redirected to /m capture · iPad / Desktop to full Life OS</text>
    </g>
  </g>

  <!-- SECTION 3: SESSION & TOKENS (Top Right) -->
  <g transform="translate(940, 40)">
    <rect width="420" height="240" rx="14" fill="#1A1E24" stroke="#10B981" stroke-width="1.5" />
    <text x="20" y="32" fill="#10B981" font-family="'JetBrains Mono', monospace" font-weight="700" font-size="11" letter-spacing="0.1em">3. BETTER AUTH SESSION TOKEN</text>

    <g transform="translate(16, 48)">
      <rect width="388" height="176" rx="8" fill="#1E2228" stroke="#333942" />
      <text x="16" y="28" fill="#F0EDE8" font-family="'Inter', sans-serif" font-weight="700" font-size="13">aiimin.session_token</text>
      <text x="16" y="48" fill="#10B981" font-family="'JetBrains Mono', monospace" font-size="11">HttpOnly · Secure · SameSite=Lax</text>
      
      <rect x="16" y="60" width="356" height="50" rx="6" fill="#14171A" stroke="#262B33" />
      <text x="24" y="80" fill="#749DC4" font-family="'JetBrains Mono', monospace" font-size="10">Bearer &lt;JWT_ACCESS_TOKEN&gt;</text>
      <text x="24" y="96" fill="#9CA3AF" font-family="'JetBrains Mono', monospace" font-size="9">Claims: { sub: UUID, os_id: "AADI0837", tier: "pro" }</text>

      <text x="16" y="130" fill="#F0EDE8" font-family="'Inter', sans-serif" font-size="11">TanStack Query Provider (QueryClient)</text>
      <text x="16" y="148" fill="#9CA3AF" font-family="'JetBrains Mono', monospace" font-size="10">refetchOnWindowFocus: false · staleTime: 60s</text>
    </g>
  </g>

  <!-- CONNECTING ARROWS (Top Tier) -->
  <path d="M 400 160 L 440 160" stroke="#749DC4" stroke-width="2.5" marker-end="url(#w-arrow-steel)" />
  <path d="M 900 160 L 940 160" stroke="#10B981" stroke-width="2.5" marker-end="url(#w-arrow-green)" />

  <!-- SECTION 4: WEB DASHBOARD MODULES & APP ROUTING (Middle Tier) -->
  <g transform="translate(40, 310)">
    <rect width="1320" height="260" rx="14" fill="#1A1E24" stroke="#333942" stroke-width="1.5" />
    <text x="20" y="30" fill="#749DC4" font-family="'JetBrains Mono', monospace" font-weight="700" font-size="11" letter-spacing="0.1em">4. AUTHENTICATED LIFE OS SHELL (DashboardLayout · Navbar · Masthead · CommandPalette)</text>

    <!-- Module 1: Overview -->
    <g transform="translate(16, 44)">
      <rect width="200" height="96" rx="8" fill="#1E2228" stroke="#333942" />
      <text x="12" y="24" fill="#F0EDE8" font-family="'Inter', sans-serif" font-weight="700" font-size="12">📈 Overview (/overview)</text>
      <text x="12" y="44" fill="#749DC4" font-family="'Inter', sans-serif" font-size="10">Life Score Radar (0-100)</text>
      <text x="12" y="60" fill="#9CA3AF" font-family="'Inter', sans-serif" font-size="10">Trajectory Projection Engine</text>
      <text x="12" y="76" fill="#6B7280" font-family="'JetBrains Mono', monospace" font-size="9">Daily quick log & ticker</text>
    </g>

    <!-- Module 2: Habits -->
    <g transform="translate(232, 44)">
      <rect width="200" height="96" rx="8" fill="#1E2228" stroke="#333942" />
      <text x="12" y="24" fill="#F0EDE8" font-family="'Inter', sans-serif" font-weight="700" font-size="12">⚡ Atomic Habits (/habits)</text>
      <text x="12" y="44" fill="#10B981" font-family="'Inter', sans-serif" font-size="10">7-Day Completion Matrix</text>
      <text x="12" y="60" fill="#9CA3AF" font-family="'Inter', sans-serif" font-size="10">Streak Momentum Counter</text>
      <text x="12" y="76" fill="#6B7280" font-family="'JetBrains Mono', monospace" font-size="9">Optimistic cache update</text>
    </g>

    <!-- Module 3: Finance -->
    <g transform="translate(448, 44)">
      <rect width="200" height="96" rx="8" fill="#1E2228" stroke="#333942" />
      <text x="12" y="24" fill="#F0EDE8" font-family="'Inter', sans-serif" font-weight="700" font-size="12">💰 Finance (/finance)</text>
      <text x="12" y="44" fill="#F5A623" font-family="'Inter', sans-serif" font-size="10">Net Worth Telemetry</text>
      <text x="12" y="60" fill="#9CA3AF" font-family="'Inter', sans-serif" font-size="10">Monthly Burn Velocity</text>
      <text x="12" y="76" fill="#6B7280" font-family="'JetBrains Mono', monospace" font-size="9">Encrypted Ledger Rows</text>
    </g>

    <!-- Module 4: Sports -->
    <g transform="translate(664, 44)">
      <rect width="200" height="96" rx="8" fill="#1E2228" stroke="#333942" />
      <text x="12" y="24" fill="#F0EDE8" font-family="'Inter', sans-serif" font-weight="700" font-size="12">🏆 Sports (/sports)</text>
      <text x="12" y="44" fill="#749DC4" font-family="'Inter', sans-serif" font-size="10">Cricket · Football · F1</text>
      <text x="12" y="60" fill="#9CA3AF" font-family="'Inter', sans-serif" font-size="10">Live Fixtures & Scores</text>
      <text x="12" y="76" fill="#6B7280" font-family="'JetBrains Mono', monospace" font-size="9">Cached Sports API Feed</text>
    </g>

    <!-- Module 5: Mindset / Journal -->
    <g transform="translate(880, 44)">
      <rect width="200" height="96" rx="8" fill="#1E2228" stroke="#333942" />
      <text x="12" y="24" fill="#F0EDE8" font-family="'Inter', sans-serif" font-weight="700" font-size="12">🧠 Journal (/journal)</text>
      <text x="12" y="44" fill="#FF6B35" font-family="'Inter', sans-serif" font-size="10">Multi-Mode Reflection</text>
      <text x="12" y="60" fill="#9CA3AF" font-family="'Inter', sans-serif" font-size="10">Voice Note Transcription</text>
      <text x="12" y="76" fill="#6B7280" font-family="'JetBrains Mono', monospace" font-size="9">AES-GCM Encrypted</text>
    </g>

    <!-- Module 6: Discipline -->
    <g transform="translate(1096, 44)">
      <rect width="208" height="96" rx="8" fill="#1E2228" stroke="#333942" />
      <text x="12" y="24" fill="#F0EDE8" font-family="'Inter', sans-serif" font-weight="700" font-size="12">🛡️ Discipline (/discipline)</text>
      <text x="12" y="44" fill="#EF4444" font-family="'Inter', sans-serif" font-size="10">Urge Surfing Timer</text>
      <text x="12" y="60" fill="#9CA3AF" font-family="'Inter', sans-serif" font-size="10">Friction Tracker & Triggers</text>
      <text x="12" y="76" fill="#6B7280" font-family="'JetBrains Mono', monospace" font-size="9">Delay Urge Modal</text>
    </g>

    <!-- Lower Row Modules -->
    <g transform="translate(16, 150)">
      <rect width="254" height="94" rx="8" fill="#1E2228" stroke="#333942" />
      <text x="12" y="24" fill="#F0EDE8" font-family="'Inter', sans-serif" font-weight="700" font-size="12">🔬 Behavioral Lab (/lab)</text>
      <text x="12" y="44" fill="#749DC4" font-family="'Inter', sans-serif" font-size="10">Vocal biomarkers · Typing speed</text>
      <text x="12" y="60" fill="#9CA3AF" font-family="'Inter', sans-serif" font-size="10">Cognitive hypothesis sandbox</text>
    </g>

    <g transform="translate(286, 150)">
      <rect width="254" height="94" rx="8" fill="#1E2228" stroke="#333942" />
      <text x="12" y="24" fill="#F0EDE8" font-family="'Inter', sans-serif" font-weight="700" font-size="12">🎯 Goals & Identity</text>
      <text x="12" y="44" fill="#F5A623" font-family="'Inter', sans-serif" font-size="10">Milestone velocity · Non-negotiables</text>
      <text x="12" y="60" fill="#9CA3AF" font-family="'Inter', sans-serif" font-size="10">Identity operating principles</text>
    </g>

    <g transform="translate(556, 150)">
      <rect width="254" height="94" rx="8" fill="#1E2228" stroke="#333942" />
      <text x="12" y="24" fill="#F0EDE8" font-family="'Inter', sans-serif" font-weight="700" font-size="12">📝 Notes & Second Brain</text>
      <text x="12" y="44" fill="#10B981" font-family="'Inter', sans-serif" font-size="10">Markdown notes & capture cards</text>
      <text x="12" y="60" fill="#9CA3AF" font-family="'Inter', sans-serif" font-size="10">Encrypted personal knowledge</text>
    </g>

    <g transform="translate(826, 150)">
      <rect width="254" height="94" rx="8" fill="#1E2228" stroke="#333942" />
      <text x="12" y="24" fill="#F0EDE8" font-family="'Inter', sans-serif" font-weight="700" font-size="12">👨‍👩‍👧 Family Vault (/family)</text>
      <text x="12" y="44" fill="#749DC4" font-family="'Inter', sans-serif" font-size="10">Medical records · Insurance</text>
      <text x="12" y="60" fill="#9CA3AF" font-family="'Inter', sans-serif" font-size="10">Emergency contacts & vehicles</text>
    </g>

    <g transform="translate(1096, 150)">
      <rect width="208" height="94" rx="8" fill="#1E2228" stroke="#333942" />
      <text x="12" y="24" fill="#F0EDE8" font-family="'Inter', sans-serif" font-weight="700" font-size="12">📊 Reports & Account</text>
      <text x="12" y="44" fill="#FF6B35" font-family="'Inter', sans-serif" font-size="10">Weekly life telemetry report</text>
      <text x="12" y="60" fill="#9CA3AF" font-family="'Inter', sans-serif" font-size="10">Theme engine & font scaling</text>
    </g>
  </g>

  <!-- FLOW ARROW (Modules to API Gateway) -->
  <path d="M 700 570 L 700 600" stroke="#749DC4" stroke-width="2.5" marker-end="url(#w-arrow-steel)" />

  <!-- SECTION 5: BACKEND CORE & PERSISTENCE (Bottom Tier) -->
  <g transform="translate(40, 600)">
    <rect width="1320" height="220" rx="14" fill="#1A1E24" stroke="#333942" stroke-width="1.5" />
    <text x="20" y="30" fill="#FF6B35" font-family="'JetBrains Mono', monospace" font-weight="700" font-size="11" letter-spacing="0.1em">5. API GATEWAY, REDIS IN-MEMORY CACHING & SUPABASE POSTGRESQL</text>

    <!-- Node/Express API Core -->
    <g transform="translate(16, 44)">
      <rect width="360" height="156" rx="8" fill="#1E2228" stroke="#749DC4" />
      <text x="14" y="26" fill="#F0EDE8" font-family="'Inter', sans-serif" font-weight="700" font-size="13">⚡ Express REST Core (api.aiimin.in)</text>
      <text x="14" y="46" fill="#9CA3AF" font-family="'JetBrains Mono', monospace" font-size="10">Port 3001 · Node.js v20+ ESM</text>
      
      <rect x="14" y="58" width="332" height="74" rx="4" fill="#14171A" stroke="#262B33" />
      <text x="20" y="78" fill="#749DC4" font-family="'JetBrains Mono', monospace" font-size="9">/api/habits · /api/finance · /api/sports</text>
      <text x="20" y="94" fill="#749DC4" font-family="'JetBrains Mono', monospace" font-size="9">/api/discipline · /api/journal · /api/lab</text>
      <text x="20" y="112" fill="#F5A623" font-family="'JetBrains Mono', monospace" font-size="9">Rate Limiter · Session Auth Middleware</text>
    </g>

    <!-- Redis Cache -->
    <g transform="translate(400, 44)">
      <rect width="320" height="156" rx="8" fill="#1E2228" stroke="#FF6B35" />
      <text x="14" y="26" fill="#F0EDE8" font-family="'Inter', sans-serif" font-weight="700" font-size="13">💾 Redis Cache Layer</text>
      <text x="14" y="46" fill="#9CA3AF" font-family="'Inter', sans-serif" font-size="10">Sub-5ms Query Returns</text>

      <rect x="14" y="58" width="292" height="74" rx="4" fill="#14171A" stroke="#262B33" />
      <text x="20" y="78" fill="#10B981" font-family="'JetBrains Mono', monospace" font-size="9">HIT: Return JSON payload (&lt;5ms)</text>
      <text x="20" y="96" fill="#FF6B35" font-family="'JetBrains Mono', monospace" font-weight="700" font-size="9">MISS: Query Postgres &amp; Fill Cache</text>
      <text x="20" y="114" fill="#9CA3AF" font-family="'JetBrains Mono', monospace" font-size="9">Key: user:{os_id}:{resource}</text>
    </g>

    <!-- Supabase PostgreSQL -->
    <g transform="translate(744, 44)">
      <rect width="560" height="156" rx="8" fill="#1E2228" stroke="#10B981" />
      <text x="14" y="26" fill="#F0EDE8" font-family="'Inter', sans-serif" font-weight="700" font-size="13">🗄️ Supabase PostgreSQL (USER_SCOPED_TABLES &amp; RLS)</text>
      <text x="14" y="46" fill="#9CA3AF" font-family="'Inter', sans-serif" font-size="10">Multi-tenant isolation · Row Level Security</text>

      <rect x="14" y="58" width="532" height="74" rx="4" fill="#14171A" stroke="#262B33" />
      <text x="20" y="78" fill="#10B981" font-family="'JetBrains Mono', monospace" font-size="9">user_profiles · daily_logs · habits · transactions · goals</text>
      <text x="20" y="96" fill="#10B981" font-family="'JetBrains Mono', monospace" font-size="9">journal_entries · discipline_events · family_vault · sports_feed</text>
      <text x="20" y="114" fill="#F5A623" font-family="'JetBrains Mono', monospace" font-size="9">AES-256-GCM encrypted notes &amp; secrets · Database backups</text>
    </g>
  </g>

  <!-- Flow between Backend nodes -->
  <path d="M 376 720 L 400 720" stroke="#749DC4" stroke-width="2.5" marker-end="url(#w-arrow-steel)" />
  <path d="M 720 720 L 744 720" stroke="#FF6B35" stroke-width="2.5" marker-end="url(#w-arrow-spark)" />
</svg>`;


// ── 2. SVG: Native Android Companion Full Architecture & Flow ──
const svgNativeAndroid = `<svg viewBox="0 0 1400 860" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="and-grad-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#12161A" />
      <stop offset="100%" stop-color="#0A0D10" />
    </linearGradient>
    <marker id="a-arrow-green" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 8 5 L 0 9 z" fill="#10B981" />
    </marker>
    <marker id="a-arrow-steel" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 8 5 L 0 9 z" fill="#749DC4" />
    </marker>
    <marker id="a-arrow-spark" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 8 5 L 0 9 z" fill="#FF6B35" />
    </marker>
    <pattern id="a-grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#22272E" stroke-width="1" stroke-opacity="0.5"/>
    </pattern>
  </defs>

  <rect width="1400" height="860" fill="url(#and-grad-bg)" rx="16" />
  <rect width="1400" height="860" fill="url(#a-grid)" rx="16" />

  <!-- SECTION 1: HARDWARE BOOT & SECURITY (Top Left) -->
  <g transform="translate(40, 40)">
    <rect width="400" height="250" rx="14" fill="#1A1E24" stroke="#10B981" stroke-width="1.5" />
    <text x="20" y="32" fill="#10B981" font-family="'JetBrains Mono', monospace" font-weight="700" font-size="11" letter-spacing="0.1em">1. HARDWARE TEE &amp; COLD BOOT GATE</text>

    <!-- StrongBox Keystore -->
    <g transform="translate(16, 48)">
      <rect width="368" height="86" rx="8" fill="#1E2228" stroke="#333942" />
      <text x="14" y="24" fill="#F0EDE8" font-family="'Inter', sans-serif" font-weight="700" font-size="13">🛡️ Android Keystore StrongBox TEE</text>
      <text x="14" y="44" fill="#10B981" font-family="'JetBrains Mono', monospace" font-size="10">Hardware-Isolated Private Key Storage</text>
      <text x="14" y="64" fill="#9CA3AF" font-family="'Inter', sans-serif" font-size="10">OS-ID Cryptographic Attestation &amp; Token Signing</text>
    </g>

    <!-- Biometrics Prompt -->
    <g transform="translate(16, 146)">
      <rect width="368" height="86" rx="8" fill="#1E2228" stroke="#333942" />
      <text x="14" y="24" fill="#F0EDE8" font-family="'Inter', sans-serif" font-weight="700" font-size="13">🔒 BiometricPrompt &amp; Master PIN</text>
      <text x="14" y="44" fill="#749DC4" font-family="'Inter', sans-serif" font-size="10">Fingerprint / Class 3 Biometric Unlock</text>
      <text x="14" y="64" fill="#6B7280" font-family="'JetBrains Mono', monospace" font-size="10">Fallback to 6-Digit Sovereign PIN</text>
    </g>
  </g>

  <!-- SECTION 2: JETPACK COMPOSE UI SURFACES (Top Middle) -->
  <g transform="translate(480, 40)">
    <rect width="440" height="250" rx="14" fill="#1A1E24" stroke="#749DC4" stroke-width="1.5" />
    <text x="20" y="32" fill="#749DC4" font-family="'JetBrains Mono', monospace" font-weight="700" font-size="11" letter-spacing="0.1em">2. JETPACK COMPOSE NATIVE SURFACES</text>

    <!-- Surface 1: Daily Focus -->
    <g transform="translate(16, 48)">
      <rect width="196" height="86" rx="8" fill="#1E2228" stroke="#333942" />
      <text x="12" y="24" fill="#F0EDE8" font-family="'Inter', sans-serif" font-weight="700" font-size="12">⚡ Quick Capture</text>
      <text x="12" y="44" fill="#749DC4" font-family="'Inter', sans-serif" font-size="10">1-Tap Habit Log</text>
      <text x="12" y="62" fill="#9CA3AF" font-family="'Inter', sans-serif" font-size="10">Urge Delay Modal</text>
    </g>

    <!-- Surface 2: Life Score & Telemetry -->
    <g transform="translate(228, 48)">
      <rect width="196" height="86" rx="8" fill="#1E2228" stroke="#333942" />
      <text x="12" y="24" fill="#F0EDE8" font-family="'Inter', sans-serif" font-weight="700" font-size="12">📊 Score Telemetry</text>
      <text x="12" y="44" fill="#10B981" font-family="'Inter', sans-serif" font-size="10">Daily Trajectory Ring</text>
      <text x="12" y="62" fill="#9CA3AF" font-family="'Inter', sans-serif" font-size="10">Momentum Metrics</text>
    </g>

    <!-- Surface 3: Glance Widgets -->
    <g transform="translate(16, 146)">
      <rect width="408" height="86" rx="8" fill="#1E2228" stroke="#333942" />
      <text x="14" y="24" fill="#F0EDE8" font-family="'Inter', sans-serif" font-weight="700" font-size="13">📱 Glance Android App Widgets</text>
      <text x="14" y="44" fill="#F5A623" font-family="'Inter', sans-serif" font-size="10">Home Screen Interactive Habit Ring &amp; Urge Surfer Widget</text>
      <text x="14" y="64" fill="#6B7280" font-family="'JetBrains Mono', monospace" font-size="10">Zero startup latency · Updates via GlanceStateDefinition</text>
    </g>
  </g>

  <!-- SECTION 3: SENSORS & HEALTH CONNECT (Top Right) -->
  <g transform="translate(960, 40)">
    <rect width="400" height="250" rx="14" fill="#1A1E24" stroke="#FF6B35" stroke-width="1.5" />
    <text x="20" y="32" fill="#FF6B35" font-family="'JetBrains Mono', monospace" font-weight="700" font-size="11" letter-spacing="0.1em">3. HARDWARE SENSORS &amp; TELEMETRY</text>

    <g transform="translate(16, 48)">
      <rect width="368" height="86" rx="8" fill="#1E2228" stroke="#333942" />
      <text x="14" y="24" fill="#F0EDE8" font-family="'Inter', sans-serif" font-weight="700" font-size="13">🏃 Android Health Connect API</text>
      <text x="14" y="44" fill="#FF6B35" font-family="'JetBrains Mono', monospace" font-size="10">Steps · Sleep Stages · Heart Rate · Calories</text>
      <text x="14" y="64" fill="#9CA3AF" font-family="'Inter', sans-serif" font-size="10">Privacy-governed local sensor aggregation</text>
    </g>

    <g transform="translate(16, 146)">
      <rect width="368" height="86" rx="8" fill="#1E2228" stroke="#333942" />
      <text x="14" y="24" fill="#F0EDE8" font-family="'Inter', sans-serif" font-weight="700" font-size="13">🎙️ Audio Engine &amp; Push Alerts</text>
      <text x="14" y="44" fill="#749DC4" font-family="'Inter', sans-serif" font-size="10">Low-latency vocal capture for voice reflection</text>
      <text x="14" y="64" fill="#6B7280" font-family="'JetBrains Mono', monospace" font-size="10">FCM high-priority commitment miss alarms</text>
    </g>
  </g>

  <!-- FLOW ARROWS (Top Tier) -->
  <path d="M 440 160 L 480 160" stroke="#10B981" stroke-width="2.5" marker-end="url(#a-arrow-green)" />
  <path d="M 920 160 L 960 160" stroke="#749DC4" stroke-width="2.5" marker-end="url(#a-arrow-steel)" />

  <!-- SECTION 4: OFFLINE ROOM DATABASE & REPOSITORIES (Middle Tier) -->
  <g transform="translate(40, 320)">
    <rect width="1320" height="240" rx="14" fill="#1A1E24" stroke="#10B981" stroke-width="1.5" />
    <text x="20" y="30" fill="#10B981" font-family="'JetBrains Mono', monospace" font-weight="700" font-size="11" letter-spacing="0.1em">4. OFFLINE-FIRST ARCHITECTURE (Room SQLite · Coroutines Flow · Domain Repositories)</text>

    <!-- Room SQLite -->
    <g transform="translate(16, 46)">
      <rect width="400" height="170" rx="8" fill="#1E2228" stroke="#333942" />
      <text x="14" y="26" fill="#F0EDE8" font-family="'Inter', sans-serif" font-weight="700" font-size="13">🗄️ Room Local SQLite Database</text>
      <text x="14" y="46" fill="#10B981" font-family="'JetBrains Mono', monospace" font-size="10">Offline-First Source of Truth</text>

      <rect x="14" y="58" width="372" height="96" rx="4" fill="#14171A" stroke="#262B33" />
      <text x="20" y="78" fill="#749DC4" font-family="'JetBrains Mono', monospace" font-size="9">HabitEntity · DailyLogEntity · UrgeEventEntity</text>
      <text x="20" y="96" fill="#749DC4" font-family="'JetBrains Mono', monospace" font-size="9">SyncQueueEntity (Pending Outbox mutations)</text>
      <text x="20" y="114" fill="#F5A623" font-family="'JetBrains Mono', monospace" font-size="9">SQLCipher AES-256 local database encryption</text>
      <text x="20" y="132" fill="#9CA3AF" font-family="'JetBrains Mono', monospace" font-size="9">Room TypeConverters for JSON metadata</text>
    </g>

    <!-- Kotlin Flow & Coroutines -->
    <g transform="translate(432, 46)">
      <rect width="430" height="170" rx="8" fill="#1E2228" stroke="#333942" />
      <text x="14" y="26" fill="#F0EDE8" font-family="'Inter', sans-serif" font-weight="700" font-size="13">🌊 Reactive StateFlow &amp; Coroutines</text>
      <text x="14" y="46" fill="#749DC4" font-family="'JetBrains Mono', monospace" font-size="10">Kotlin Structured Concurrency</text>

      <rect x="14" y="58" width="402" height="96" rx="4" fill="#14171A" stroke="#262B33" />
      <text x="20" y="78" fill="#F0EDE8" font-family="'JetBrains Mono', monospace" font-size="9">HabitsRepository: Flow&lt;List&lt;Habit&gt;&gt;</text>
      <text x="20" y="96" fill="#F0EDE8" font-family="'JetBrains Mono', monospace" font-size="9">LifeScoreRepository: StateFlow&lt;LifeScoreState&gt;</text>
      <text x="20" y="114" fill="#10B981" font-family="'JetBrains Mono', monospace" font-size="9">Instant UI feedback · Zero UI blocking</text>
      <text x="20" y="132" fill="#9CA3AF" font-family="'JetBrains Mono', monospace" font-size="9">Dispatchers.IO for background disk &amp; network operations</text>
    </g>

    <!-- WorkManager Sync Engine -->
    <g transform="translate(878, 46)">
      <rect width="426" height="170" rx="8" fill="#1E2228" stroke="#FF6B35" />
      <text x="14" y="26" fill="#F0EDE8" font-family="'Inter', sans-serif" font-weight="700" font-size="13">🔄 Android WorkManager Sync Engine</text>
      <text x="14" y="46" fill="#FF6B35" font-family="'JetBrains Mono', monospace" font-size="10">Reliable Background Synchronization</text>

      <rect x="14" y="58" width="398" height="96" rx="4" fill="#14171A" stroke="#262B33" />
      <text x="20" y="78" fill="#FF6B35" font-family="'JetBrains Mono', monospace" font-size="9">SyncCompanionWorker: /api/mobile/sync batch</text>
      <text x="20" y="96" fill="#749DC4" font-family="'JetBrains Mono', monospace" font-size="9">Network constraint: Connected &amp; BatteryNotLow</text>
      <text x="20" y="114" fill="#10B981" font-family="'JetBrains Mono', monospace" font-size="9">Exponential Backoff Retry Strategy</text>
      <text x="20" y="132" fill="#9CA3AF" font-family="'JetBrains Mono', monospace" font-size="9">Periodic sync every 15m + Instant sync on write</text>
    </g>
  </g>

  <!-- FLOW (Middle to Network Layer) -->
  <path d="M 700 560 L 700 600" stroke="#10B981" stroke-width="2.5" marker-end="url(#a-arrow-green)" />

  <!-- SECTION 5: NETWORKING & BACKEND SYNCHRONIZATION (Bottom Tier) -->
  <g transform="translate(40, 600)">
    <rect width="1320" height="220" rx="14" fill="#1A1E24" stroke="#333942" stroke-width="1.5" />
    <text x="20" y="30" fill="#749DC4" font-family="'JetBrains Mono', monospace" font-weight="700" font-size="11" letter-spacing="0.1em">5. NETWORK TELEMETRY BRIDGE (Retrofit 2 · OkHttp 4 · Bearer Auth Interceptor)</text>

    <!-- Retrofit 2 -->
    <g transform="translate(16, 44)">
      <rect width="400" height="156" rx="8" fill="#1E2228" stroke="#749DC4" />
      <text x="14" y="26" fill="#F0EDE8" font-family="'Inter', sans-serif" font-weight="700" font-size="13">🌐 Retrofit 2 &amp; Moshi JSON</text>
      <text x="14" y="46" fill="#9CA3AF" font-family="'JetBrains Mono', monospace" font-size="10">Type-Safe Kotlin Network Client</text>

      <rect x="14" y="58" width="372" height="74" rx="4" fill="#14171A" stroke="#262B33" />
      <text x="20" y="78" fill="#749DC4" font-family="'JetBrains Mono', monospace" font-size="9">@POST("api/mobile/sync") suspend fun syncBatch()</text>
      <text x="20" y="96" fill="#749DC4" font-family="'JetBrains Mono', monospace" font-size="9">@GET("api/mobile/bootstrap") suspend fun bootstrap()</text>
      <text x="20" y="114" fill="#10B981" font-family="'JetBrains Mono', monospace" font-size="9">Kotlin Result&lt;T&gt; error handling wrapper</text>
    </g>

    <!-- OkHttp 4 & Interceptor -->
    <g transform="translate(432, 44)">
      <rect width="430" height="156" rx="8" fill="#1E2228" stroke="#F5A623" />
      <text x="14" y="26" fill="#F0EDE8" font-family="'Inter', sans-serif" font-weight="700" font-size="13">🛡️ AuthInterceptor &amp; Authenticator</text>
      <text x="14" y="46" fill="#F5A623" font-family="'JetBrains Mono', monospace" font-size="10">Automatic Bearer Token Injection</text>

      <rect x="14" y="58" width="402" height="74" rx="4" fill="#14171A" stroke="#262B33" />
      <text x="20" y="78" fill="#F0EDE8" font-family="'JetBrains Mono', monospace" font-size="9">Header: Authorization: Bearer &lt;session_token&gt;</text>
      <text x="20" y="96" fill="#F5A623" font-family="'JetBrains Mono', monospace" font-size="9">HTTP 401: Automatic refresh with Better Auth</text>
      <text x="20" y="114" fill="#9CA3AF" font-family="'JetBrains Mono', monospace" font-size="9">TLS 1.3 Strict Certificate Pinning</text>
    </g>

    <!-- Cloud Gateway Destination -->
    <g transform="translate(878, 44)">
      <rect width="426" height="156" rx="8" fill="#1E2228" stroke="#10B981" />
      <text x="14" y="26" fill="#F0EDE8" font-family="'Inter', sans-serif" font-weight="700" font-size="13">☁️ AIIMIN Cloud Core (api.aiimin.in)</text>
      <text x="14" y="46" fill="#10B981" font-family="'JetBrains Mono', monospace" font-size="10">PostgreSQL + Redis Sync Endpoint</text>

      <rect x="14" y="58" width="398" height="74" rx="4" fill="#14171A" stroke="#262B33" />
      <text x="20" y="78" fill="#10B981" font-family="'JetBrains Mono', monospace" font-size="9">Processes Mobile Batch Mutations into DB</text>
      <text x="20" y="96" fill="#FF6B35" font-family="'JetBrains Mono', monospace" font-size="9">Invalidates Redis Cache for Web Client</text>
      <text x="20" y="114" fill="#9CA3AF" font-family="'JetBrains Mono', monospace" font-size="9">Returns 200 OK + Updated Server Vector Clock</text>
    </g>
  </g>
</svg>`;


// ── 3. SVG: Unified App + Website Inter-Communication & Cross-Platform Sync ──
const svgUnifiedSync = `<svg viewBox="0 0 1400 860" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="uni-grad-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#14171A" />
      <stop offset="100%" stop-color="#0D0F12" />
    </linearGradient>
    <marker id="u-arrow-green" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 8 5 L 0 9 z" fill="#10B981" />
    </marker>
    <marker id="u-arrow-steel" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 8 5 L 0 9 z" fill="#749DC4" />
    </marker>
    <marker id="u-arrow-spark" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 8 5 L 0 9 z" fill="#FF6B35" />
    </marker>
    <marker id="u-arrow-gold" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 8 5 L 0 9 z" fill="#F5A623" />
    </marker>
    <pattern id="u-grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#22272E" stroke-width="1" stroke-opacity="0.5"/>
    </pattern>
  </defs>

  <rect width="1400" height="860" fill="url(#uni-grad-bg)" rx="16" />
  <rect width="1400" height="860" fill="url(#u-grid)" rx="16" />

  <!-- LEFT COLUMN: NATIVE ANDROID COMPANION (Mobile Telemetry & Capture) -->
  <g transform="translate(40, 40)">
    <rect width="380" height="780" rx="16" fill="#1A1E24" stroke="#10B981" stroke-width="1.5" />
    <text x="20" y="36" fill="#10B981" font-family="'JetBrains Mono', monospace" font-weight="700" font-size="12" letter-spacing="0.1em">📱 NATIVE ANDROID COMPANION</text>
    <text x="20" y="56" fill="#9CA3AF" font-family="'Inter', sans-serif" font-size="11">Always-With-You Capture &amp; Sensor Hub</text>

    <!-- Component 1 -->
    <g transform="translate(16, 76)">
      <rect width="348" height="110" rx="10" fill="#1E2228" stroke="#333942" />
      <text x="14" y="28" fill="#F0EDE8" font-family="'Inter', sans-serif" font-weight="700" font-size="13">🛡️ StrongBox TEE &amp; Biometrics</text>
      <text x="14" y="50" fill="#10B981" font-family="'JetBrains Mono', monospace" font-size="10">Hardware-level OS-ID Token Protection</text>
      <text x="14" y="70" fill="#9CA3AF" font-family="'Inter', sans-serif" font-size="10">BiometricPrompt · EncryptedSharedPreferences</text>
      <text x="14" y="90" fill="#6B7280" font-family="'Inter', sans-serif" font-size="9">Auto-login with verified biometric token</text>
    </g>

    <!-- Component 2 -->
    <g transform="translate(16, 202)">
      <rect width="348" height="120" rx="10" fill="#1E2228" stroke="#333942" />
      <text x="14" y="28" fill="#F0EDE8" font-family="'Inter', sans-serif" font-weight="700" font-size="13">🏃 Health Connect &amp; Step Sensors</text>
      <text x="14" y="50" fill="#FF6B35" font-family="'Inter', sans-serif" font-size="10">Continuous Background Step Counter</text>
      <text x="14" y="68" fill="#FF6B35" font-family="'Inter', sans-serif" font-size="10">Sleep Stages &amp; Active Calorie Telemetry</text>
      <rect x="14" y="80" width="320" height="28" rx="4" fill="#14171A" stroke="#262B33" />
      <text x="20" y="98" fill="#749DC4" font-family="'JetBrains Mono', monospace" font-size="9">Aggregates into DailyLogEntity</text>
    </g>

    <!-- Component 3 -->
    <g transform="translate(16, 338)">
      <rect width="348" height="120" rx="10" fill="#1E2228" stroke="#333942" />
      <text x="14" y="28" fill="#F0EDE8" font-family="'Inter', sans-serif" font-weight="700" font-size="13">⚡ Glance Widgets &amp; Quick Capture</text>
      <text x="14" y="50" fill="#F5A623" font-family="'Inter', sans-serif" font-size="10">Home Screen 1-Tap Habit Log</text>
      <text x="14" y="68" fill="#F5A623" font-family="'Inter', sans-serif" font-size="10">Urge Delay Surfing Timer Overlay</text>
      <rect x="14" y="80" width="320" height="28" rx="4" fill="#14171A" stroke="#262B33" />
      <text x="20" y="98" fill="#10B981" font-family="'JetBrains Mono', monospace" font-size="9">Writes directly to Room SQLite Outbox</text>
    </g>

    <!-- Component 4 -->
    <g transform="translate(16, 474)">
      <rect width="348" height="130" rx="10" fill="#1E2228" stroke="#10B981" />
      <text x="14" y="28" fill="#F0EDE8" font-family="'Inter', sans-serif" font-weight="700" font-size="13">🔄 WorkManager Sync Engine</text>
      <text x="14" y="50" fill="#10B981" font-family="'JetBrains Mono', monospace" font-size="10">Retrofit 2 · POST /api/mobile/sync</text>
      <text x="14" y="70" fill="#9CA3AF" font-family="'Inter', sans-serif" font-size="10">Sends batch mutations with Vector Clock</text>
      <rect x="14" y="84" width="320" height="34" rx="4" fill="#14171A" stroke="#262B33" />
      <text x="20" y="104" fill="#FF6B35" font-family="'JetBrains Mono', monospace" font-size="9" font-weight="700">Syncs: Habits · Urges · Sensor Steps</text>
    </g>

    <!-- Native App Role -->
    <g transform="translate(16, 620)">
      <rect width="348" height="136" rx="10" fill="#14171A" stroke="#333942" />
      <text x="14" y="26" fill="#749DC4" font-family="'JetBrains Mono', monospace" font-weight="700" font-size="11">APP CORE RESPONSIBILITY</text>
      <text x="14" y="50" fill="#F0EDE8" font-family="'Inter', sans-serif" font-size="11">1. Frictionless, sub-second daily data capture</text>
      <text x="14" y="70" fill="#F0EDE8" font-family="'Inter', sans-serif" font-size="11">2. Hardware-backed security &amp; local encryption</text>
      <text x="14" y="90" fill="#F0EDE8" font-family="'Inter', sans-serif" font-size="11">3. Offline-first resilience without network dependence</text>
      <text x="14" y="110" fill="#F0EDE8" font-family="'Inter', sans-serif" font-size="11">4. Passive continuous Health Connect sync</text>
    </g>
  </g>

  <!-- MIDDLE COLUMN: AIIMIN CLOUD CORE & DATA HUB -->
  <g transform="translate(490, 40)">
    <rect width="420" height="780" rx="16" fill="#1A1E24" stroke="#FF6B35" stroke-width="1.5" />
    <text x="20" y="36" fill="#FF6B35" font-family="'JetBrains Mono', monospace" font-weight="700" font-size="12" letter-spacing="0.1em">⚡ SHARED CORE &amp; SYNC GATEWAY</text>
    <text x="20" y="56" fill="#9CA3AF" font-family="'Inter', sans-serif" font-size="11">Express API · Redis Caching · Supabase Postgres</text>

    <!-- Hub 1: Better Auth Gateway -->
    <g transform="translate(16, 76)">
      <rect width="388" height="130" rx="10" fill="#1E2228" stroke="#F5A623" />
      <text x="14" y="28" fill="#F0EDE8" font-family="'Inter', sans-serif" font-weight="700" font-size="13">🛡️ Better Auth Identity Anchor</text>
      <text x="14" y="50" fill="#F5A623" font-family="'JetBrains Mono', monospace" font-size="10">Single OS-ID Identifier (AADI0837)</text>
      <text x="14" y="70" fill="#9CA3AF" font-family="'Inter', sans-serif" font-size="10">Unified across Web, Android, and /m Capacitor</text>
      <rect x="14" y="82" width="360" height="34" rx="4" fill="#14171A" stroke="#262B33" />
      <text x="20" y="104" fill="#10B981" font-family="'JetBrains Mono', monospace" font-size="9">Instant revocation &amp; PIN synchronization</text>
    </g>

    <!-- Hub 2: Sync Engine & API -->
    <g transform="translate(16, 222)">
      <rect width="388" height="150" rx="10" fill="#1E2228" stroke="#749DC4" />
      <text x="14" y="28" fill="#F0EDE8" font-family="'Inter', sans-serif" font-weight="700" font-size="13">⚡ Express Core (api.aiimin.in)</text>
      <text x="14" y="50" fill="#749DC4" font-family="'JetBrains Mono', monospace" font-size="10">Routes: /api/mobile/* &amp; /api/*</text>
      
      <rect x="14" y="62" width="360" height="74" rx="4" fill="#14171A" stroke="#262B33" />
      <text x="20" y="82" fill="#F0EDE8" font-family="'JetBrains Mono', monospace" font-size="9">Resolves conflicts via updated_at timestamps</text>
      <text x="20" y="100" fill="#FF6B35" font-family="'JetBrains Mono', monospace" font-size="9">Batches mutations to PostgreSQL</text>
      <text x="20" y="118" fill="#10B981" font-family="'JetBrains Mono', monospace" font-size="9">Broadcasts cache invalidation</text>
    </g>

    <!-- Hub 3: Redis In-Memory Layer -->
    <g transform="translate(16, 388)">
      <rect width="388" height="150" rx="10" fill="#1E2228" stroke="#FF6B35" />
      <text x="14" y="28" fill="#F0EDE8" font-family="'Inter', sans-serif" font-weight="700" font-size="13">💾 Redis Cache &amp; Invalidation Hub</text>
      <text x="14" y="50" fill="#FF6B35" font-family="'JetBrains Mono', monospace" font-size="10">Sub-5ms Query Cache Layer</text>

      <rect x="14" y="62" width="360" height="74" rx="4" fill="#14171A" stroke="#262B33" />
      <text x="20" y="82" fill="#10B981" font-family="'JetBrains Mono', monospace" font-size="9">When Mobile Sync commits:</text>
      <text x="20" y="100" fill="#FF6B35" font-family="'JetBrains Mono', monospace" font-weight="700" font-size="9">DEL user:AADI0837:habits</text>
      <text x="20" y="118" fill="#749DC4" font-family="'JetBrains Mono', monospace" font-size="9">Web UI gets fresh data on next render</text>
    </g>

    <!-- Hub 4: Supabase PostgreSQL Storage -->
    <g transform="translate(16, 554)">
      <rect width="388" height="202" rx="10" fill="#1E2228" stroke="#10B981" />
      <text x="14" y="28" fill="#F0EDE8" font-family="'Inter', sans-serif" font-weight="700" font-size="13">🗄️ Supabase PostgreSQL (Master Source)</text>
      <text x="14" y="50" fill="#10B981" font-family="'JetBrains Mono', monospace" font-size="10">Row Level Security &amp; Tenant Scoped Tables</text>

      <rect x="14" y="62" width="360" height="126" rx="4" fill="#14171A" stroke="#262B33" />
      <text x="20" y="82" fill="#F0EDE8" font-family="'JetBrains Mono', monospace" font-size="9">habits (user_id, name, cadence, meta)</text>
      <text x="20" y="100" fill="#F0EDE8" font-family="'JetBrains Mono', monospace" font-size="9">daily_logs (user_id, date, metrics, steps)</text>
      <text x="20" y="118" fill="#F0EDE8" font-family="'JetBrains Mono', monospace" font-size="9">discipline_events (user_id, trigger, delay_sec)</text>
      <text x="20" y="136" fill="#F0EDE8" font-family="'JetBrains Mono', monospace" font-size="9">transactions (user_id, amount, category, date)</text>
      <text x="20" y="154" fill="#F5A623" font-family="'JetBrains Mono', monospace" font-size="9">journal_entries (encrypted_payload, iv, tag)</text>
      <text x="20" y="172" fill="#10B981" font-family="'JetBrains Mono', monospace" font-size="9">RLS: auth.uid() = user_id</text>
    </g>
  </g>

  <!-- RIGHT COLUMN: WEB LIFE OS (Deep Telemetry & Analysis Hub) -->
  <g transform="translate(980, 40)">
    <rect width="380" height="780" rx="16" fill="#1A1E24" stroke="#749DC4" stroke-width="1.5" />
    <text x="20" y="36" fill="#749DC4" font-family="'JetBrains Mono', monospace" font-weight="700" font-size="12" letter-spacing="0.1em">🖥️ WEB LIFE OS (DESKTOP &amp; IPAD)</text>
    <text x="20" y="56" fill="#9CA3AF" font-family="'Inter', sans-serif" font-size="11">Deep Telemetry, Planning &amp; Reflection Hub</text>

    <!-- Web 1 -->
    <g transform="translate(16, 76)">
      <rect width="348" height="110" rx="10" fill="#1E2228" stroke="#333942" />
      <text x="14" y="28" fill="#F0EDE8" font-family="'Inter', sans-serif" font-weight="700" font-size="13">📈 Full Life Score Radar &amp; Trajectory</text>
      <text x="14" y="50" fill="#749DC4" font-family="'Inter', sans-serif" font-size="10">Multi-Dimensional Life Score (0-100)</text>
      <text x="14" y="68" fill="#9CA3AF" font-family="'Inter', sans-serif" font-size="10">Trajectory Execution Projection Model</text>
      <text x="14" y="88" fill="#6B7280" font-family="'Inter', sans-serif" font-size="9">Reflects steps synced from mobile in real time</text>
    </g>

    <!-- Web 2 -->
    <g transform="translate(16, 202)">
      <rect width="348" height="120" rx="10" fill="#1E2228" stroke="#333942" />
      <text x="14" y="28" fill="#F0EDE8" font-family="'Inter', sans-serif" font-weight="700" font-size="13">💰 Wealth &amp; Strategic Goal Roadmaps</text>
      <text x="14" y="50" fill="#F5A623" font-family="'Inter', sans-serif" font-size="10">Net Worth Ledger &amp; Monthly Burn Velocity</text>
      <text x="14" y="68" fill="#F5A623" font-family="'Inter', sans-serif" font-size="10">Milestone Roadmaps &amp; Career Kanban</text>
      <rect x="14" y="80" width="320" height="28" rx="4" fill="#14171A" stroke="#262B33" />
      <text x="20" y="98" fill="#749DC4" font-family="'JetBrains Mono', monospace" font-size="9">Deep planning workspace</text>
    </g>

    <!-- Web 3 -->
    <g transform="translate(16, 338)">
      <rect width="348" height="120" rx="10" fill="#1E2228" stroke="#333942" />
      <text x="14" y="28" fill="#F0EDE8" font-family="'Inter', sans-serif" font-weight="700" font-size="13">🔬 Behavioral Lab &amp; Soundscapes</text>
      <text x="14" y="50" fill="#FF6B35" font-family="'Inter', sans-serif" font-size="10">Vocal Biomarker Analysis &amp; Typing Cadence</text>
      <text x="14" y="68" fill="#FF6B35" font-family="'Inter', sans-serif" font-size="10">Deep Focus Room with Pomodoro Soundscapes</text>
      <rect x="14" y="80" width="320" height="28" rx="4" fill="#14171A" stroke="#262B33" />
      <text x="20" y="98" fill="#10B981" font-family="'JetBrains Mono', monospace" font-size="9">High-cognitive immersion surfaces</text>
    </g>

    <!-- Web 4 -->
    <g transform="translate(16, 474)">
      <rect width="348" height="130" rx="10" fill="#1E2228" stroke="#749DC4" />
      <text x="14" y="28" fill="#F0EDE8" font-family="'Inter', sans-serif" font-weight="700" font-size="13">📊 Weekly Life Telemetry Reports</text>
      <text x="14" y="50" fill="#749DC4" font-family="'JetBrains Mono', monospace" font-size="10">Comprehensive 7-Day Life Audits</text>
      <text x="14" y="70" fill="#9CA3AF" font-family="'Inter', sans-serif" font-size="10">Correlates sleep, mood, habits, and spending</text>
      <rect x="14" y="84" width="320" height="34" rx="4" fill="#14171A" stroke="#262B33" />
      <text x="20" y="104" fill="#10B981" font-family="'JetBrains Mono', monospace" font-size="9" font-weight="700">PDF Report Export Engine</text>
    </g>

    <!-- Web Role -->
    <g transform="translate(16, 620)">
      <rect width="348" height="136" rx="10" fill="#14171A" stroke="#333942" />
      <text x="14" y="26" fill="#749DC4" font-family="'JetBrains Mono', monospace" font-weight="700" font-size="11">WEB CORE RESPONSIBILITY</text>
      <text x="14" y="50" fill="#F0EDE8" font-family="'Inter', sans-serif" font-size="11">1. Deep life trajectory analysis &amp; multi-radar</text>
      <text x="14" y="70" fill="#F0EDE8" font-family="'Inter', sans-serif" font-size="11">2. Financial budgeting, ledgers &amp; career pipelines</text>
      <text x="14" y="90" fill="#F0EDE8" font-family="'Inter', sans-serif" font-size="11">3. Long-form journaling &amp; second brain notes</text>
      <text x="14" y="110" fill="#F0EDE8" font-family="'Inter', sans-serif" font-size="11">4. Generating weekly &amp; monthly review reports</text>
    </g>
  </g>

  <!-- INTER-COLUMN SYNC FLOW ARROWS -->
  <!-- Android -> Cloud (Push Data) -->
  <path d="M 420 280 L 490 280" stroke="#10B981" stroke-width="3" marker-end="url(#u-arrow-green)" />
  <text x="432" y="270" fill="#10B981" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="700">Push Sync</text>

  <!-- Cloud -> Android (Receive Config/Auth) -->
  <path d="M 490 320 L 420 320" stroke="#749DC4" stroke-width="2" stroke-dasharray="4 4" marker-end="url(#u-arrow-steel)" />
  <text x="432" y="340" fill="#749DC4" font-family="'JetBrains Mono', monospace" font-size="9">Bootstrap</text>

  <!-- Cloud -> Web (Serve Data / Invalidate) -->
  <path d="M 910 280 L 980 280" stroke="#749DC4" stroke-width="3" marker-end="url(#u-arrow-steel)" />
  <text x="922" y="270" fill="#749DC4" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="700">Serve Data</text>

  <!-- Web -> Cloud (User Edits & Config) -->
  <path d="M 980 320 L 910 320" stroke="#FF6B35" stroke-width="2.5" marker-end="url(#u-arrow-spark)" />
  <text x="922" y="340" fill="#FF6B35" font-family="'JetBrains Mono', monospace" font-size="9" font-weight="700">Mutations</text>
</svg>`;


// Write SVGs to docs/diagrams and brain artifacts
fs.writeFileSync(path.join(DIAGRAMS_DIR, 'web-life-os-workflow.svg'), svgWebLifeOs, 'utf8');
fs.writeFileSync(path.join(DIAGRAMS_DIR, 'native-android-companion-workflow.svg'), svgNativeAndroid, 'utf8');
fs.writeFileSync(path.join(DIAGRAMS_DIR, 'unified-app-web-sync-workflow.svg'), svgUnifiedSync, 'utf8');

fs.writeFileSync(path.join(ARTIFACT_DIR, 'web-life-os-workflow.svg'), svgWebLifeOs, 'utf8');
fs.writeFileSync(path.join(ARTIFACT_DIR, 'native-android-companion-workflow.svg'), svgNativeAndroid, 'utf8');
fs.writeFileSync(path.join(ARTIFACT_DIR, 'unified-app-web-sync-workflow.svg'), svgUnifiedSync, 'utf8');

console.log('Successfully written SVG files to docs/diagrams/ and artifact directory.');

// ── 4. Generate Interactive Standalone HTML Visualizer ──
const htmlVisualizer = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AIIMIN — Complete Architectural & Workflow Diagrams</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Familjen+Grotesk:wght@600;700&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-base: #14171A;
      --bg-card: #1E2228;
      --bg-elevated: #262B33;
      --border: #333942;
      --border-lit: #434A54;
      --text-1: #F0EDE8;
      --text-2: #9CA3AF;
      --text-3: #6B7280;
      --accent: #749DC4;
      --accent-dark: #416180;
      --spark: #FF6B35;
      --success: #10B981;
      --danger: #EF4444;
      --gold: #F5A623;
      --font-sans: 'Inter', -apple-system, sans-serif;
      --font-mono: 'JetBrains Mono', monospace;
      --font-display: 'Familjen Grotesk', sans-serif;
    }

    [data-theme="light"] {
      --bg-base: #EDE4D3;
      --bg-card: #FFFFFF;
      --bg-elevated: #F7F1E6;
      --border: #D9CEB8;
      --border-lit: #C9BCA3;
      --text-1: #14171A;
      --text-2: #3F464E;
      --text-3: #6B7280;
      --accent: #416180;
      --accent-dark: #2A4259;
      --spark: #E85A24;
      --success: #1E5C3A;
      --danger: #DC2626;
      --gold: #D97706;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--bg-base);
      color: var(--text-1);
      font-family: var(--font-sans);
      padding: 40px 24px 80px;
      line-height: 1.5;
      transition: background 0.25s, color 0.25s;
    }

    .container {
      max-width: 1360px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 56px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 24px;
      border-bottom: 1px solid var(--border);
      flex-wrap: wrap;
      gap: 16px;
    }

    .brand-badge {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: var(--bg-card);
      padding: 8px 16px;
      border-radius: 99px;
      border: 1px solid var(--border);
    }

    .brand-dot {
      width: 10px; height: 10px; border-radius: 50%;
      background: var(--spark);
      box-shadow: 0 0 10px var(--spark);
    }

    .title-h1 {
      font-family: var(--font-display);
      font-size: 28px;
      font-weight: 700;
      letter-spacing: -0.02em;
    }

    .theme-toggle {
      background: var(--bg-card);
      border: 1px solid var(--border);
      color: var(--text-1);
      padding: 10px 18px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
    }
    .theme-toggle:hover {
      border-color: var(--border-lit);
      background: var(--bg-elevated);
    }

    .diagram-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 32px;
      display: flex;
      flex-direction: column;
      gap: 24px;
      box-shadow: 0 12px 40px rgba(0,0,0,0.15);
    }

    .diagram-tag {
      font-family: var(--font-mono);
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      padding: 4px 10px;
      border-radius: 6px;
      display: inline-block;
      margin-bottom: 8px;
    }

    .tag-spark { color: var(--spark); background: rgba(255,107,53,0.12); border: 1px solid rgba(255,107,53,0.25); }
    .tag-green { color: var(--success); background: rgba(16,185,129,0.12); border: 1px solid rgba(16,185,129,0.25); }
    .tag-steel { color: var(--accent); background: rgba(116,157,196,0.12); border: 1px solid rgba(116,157,196,0.25); }

    .diagram-title {
      font-size: 22px;
      font-weight: 700;
      letter-spacing: -0.01em;
    }

    .diagram-desc {
      color: var(--text-2);
      font-size: 14px;
      margin-top: 6px;
      max-width: 900px;
    }

    .svg-container {
      width: 100%;
      overflow-x: auto;
      background: var(--bg-base);
      border-radius: 14px;
      border: 1px solid var(--border);
      padding: 20px 14px;
    }

    svg {
      width: 100%;
      height: auto;
      display: block;
    }
  </style>
</head>
<body>
  <div class="container">
    
    <header class="header">
      <div style="display: flex; align-items: center; gap: 16px;">
        <div class="brand-badge">
          <div class="brand-dot"></div>
          <span style="font-family: var(--font-mono); font-size: 13px; font-weight: 700; letter-spacing: 0.05em;">AIIMIN · ARCHIFY SPEC</span>
        </div>
        <h1 class="title-h1">AIIMIN Complete System, App &amp; Web Interaction Flows</h1>
      </div>
      <button class="theme-toggle" onclick="toggleTheme()">🌓 Toggle Light / Dark</button>
    </header>

    <!-- ── DIAGRAM 1: Web Life OS Full Flow ── -->
    <section class="diagram-card" id="card-web-flow">
      <div>
        <span class="diagram-tag tag-steel">Diagram 1 · Web Life OS Architecture</span>
        <h2 class="diagram-title">Complete Web Life OS Architecture &amp; Data Request Pipeline</h2>
        <p class="diagram-desc">Traces public landing/waitlist/legal surfaces, OS-ID resolver authentication, TierRouteGuard &amp; DeviceGate, all 12+ authenticated dashboard modules, TanStack Query cache, Express API gateway, sub-5ms Redis caching, and Supabase PostgreSQL with RLS.</p>
      </div>
      <div class="svg-container">
        ${svgWebLifeOs}
      </div>
    </section>

    <!-- ── DIAGRAM 2: Native Android App Flow ── -->
    <section class="diagram-card" id="card-android-flow">
      <div>
        <span class="diagram-tag tag-green">Diagram 2 · Native Android Companion</span>
        <h2 class="diagram-title">Native Android Architecture, Hardware Keystore &amp; Offline Sync Flow</h2>
        <p class="diagram-desc">Traces cold boot StrongBox TEE security, BiometricPrompt gate, Jetpack Compose UI, Glance interactive home screen widgets, Android Health Connect step/sleep sensors, local Room SQLite encrypted cache, WorkManager background batch sync, and Retrofit 2 Bearer auth.</p>
      </div>
      <div class="svg-container">
        ${svgNativeAndroid}
      </div>
    </section>

    <!-- ── DIAGRAM 3: Unified App + Web Sync Flow ── -->
    <section class="diagram-card" id="card-unified-sync">
      <div>
        <span class="diagram-tag tag-spark">Diagram 3 · Cross-Platform Interaction Matrix</span>
        <h2 class="diagram-title">Unified App + Web Synchronization &amp; Inter-Communication Matrix</h2>
        <p class="diagram-desc">Traces the dual-way real-time data sync between Native Android (frictionless mobile capture, Health Connect steps, hardware security) and Web Life OS (deep multi-radar analytics, long-term trajectory projections, financial ledgers) via the shared Better Auth OS-ID anchor, Redis invalidation, and Supabase Postgres.</p>
      </div>
      <div class="svg-container">
        ${svgUnifiedSync}
      </div>
    </section>

  </div>

  <script>
    function toggleTheme() {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
    }
  </script>
</body>
</html>`;

fs.writeFileSync(path.join(DIAGRAMS_DIR, 'interactive-system-visualizer.html'), htmlVisualizer, 'utf8');
fs.writeFileSync(path.join(ARTIFACT_DIR, 'interactive-system-visualizer.html'), htmlVisualizer, 'utf8');
console.log('Written interactive-system-visualizer.html');

// ── 5. Render High-Resolution Retina PNGs ──
async function renderAllPngs() {
  try {
    const browser = await puppeteer.launch({
      executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--force-device-scale-factor=2']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1480, height: 1000, deviceScaleFactor: 2 });
    await page.goto('file://' + path.join(DIAGRAMS_DIR, 'interactive-system-visualizer.html'), { waitUntil: 'load' });
    await new Promise(r => setTimeout(r, 600));

    // Capture Diagram 1: Web Life OS
    const webElem = await page.$('#card-web-flow');
    if (webElem) {
      await webElem.screenshot({ path: path.join(DIAGRAMS_DIR, 'web-life-os-workflow.png'), type: 'png' });
      await webElem.screenshot({ path: path.join(ARTIFACT_DIR, 'web-life-os-workflow.png'), type: 'png' });
      console.log('Saved web-life-os-workflow.png');
    }

    // Capture Diagram 2: Native Android
    const andElem = await page.$('#card-android-flow');
    if (andElem) {
      await andElem.screenshot({ path: path.join(DIAGRAMS_DIR, 'native-android-companion-workflow.png'), type: 'png' });
      await andElem.screenshot({ path: path.join(ARTIFACT_DIR, 'native-android-companion-workflow.png'), type: 'png' });
      console.log('Saved native-android-companion-workflow.png');
    }

    // Capture Diagram 3: Unified Sync
    const syncElem = await page.$('#card-unified-sync');
    if (syncElem) {
      await syncElem.screenshot({ path: path.join(DIAGRAMS_DIR, 'unified-app-web-sync-workflow.png'), type: 'png' });
      await syncElem.screenshot({ path: path.join(ARTIFACT_DIR, 'unified-app-web-sync-workflow.png'), type: 'png' });
      console.log('Saved unified-app-web-sync-workflow.png');
    }

    await browser.close();
    console.log('All PNGs rendered and saved to docs/diagrams/ and artifact directory.');
  } catch (e) {
    console.error('Error rendering PNGs:', e);
  }
}

renderAllPngs();
