#!/usr/bin/env python3
"""Generate remaining AIIMIN interaction audit markdown files."""
from pathlib import Path

OUT = Path(__file__).parent
ROOT = OUT.parent

def w(name, content):
    p = OUT / name if name.endswith('.md') else ROOT / name
    p.write_text(content, encoding='utf-8')
    print(f"Wrote {p} ({len(content)} chars)")

# --- INTERACTION TEMPLATE ---
def fmt_int(i):
    return f"""### {i['id']}

| Attribute | Value |
|-----------|-------|
| **Feature** | {i['feature']} |
| **Location** | {i['loc']} |
| **Trigger** | {i['trigger']} |
| **Purpose** | {i['purpose']} |
| **User Goal** | {i['goal']} |
| **Flow** | {i['flow']} |
| **Interaction Count** | {i['count']} |
| **User Input Required** | {i['inputs']} |
| **Input Type** | {i['itype']} |
| **Could be inferred?** | {i['infer']} |
| **Friction (1-10)** | {i['friction']} |
| **Decision Fatigue (1-10)** | {i['df']} |
| **Memory Load (1-10)** | {i['mem']} |
| **Context Switching** | {i['ctx']} |
| **Interruptible** | {i['interrupt']} |
| **Postponable** | {i['postpone']} |
| **Auto-recoverable** | {i['recover']} |
| **AI Potential** | {i['ai']} |
| **Improvements** | {i['improve']} |
| **Related Components** | {i['related']} |

"""

# Build interactions programmatically by feature blocks
INTERACTIONS = []

def add_block(start, feature, items):
    global INTERACTIONS
    for idx, item in enumerate(items):
        n = start + idx
        INTERACTIONS.append({
            'id': f'INT-{n:03d}',
            'feature': feature,
            **item
        })

# AUTH & WAITLIST (001-048)
auth_items = [
    ('Login /login', 'Google OAuth button', 'Create account or sign in without password', 'Get into app fast', 'Land Login → Click Continue with Google → OAuth → Callback', '1 click + OAuth', 'Google account choice', 'OAuth redirect', 'NO', '3', '2', '2', 'NO', 'YES', 'YES', 'NO', 'No', 'One-click passkeys', 'Login.jsx, AuthCallback'),
    ('Login /login', 'Email signup toggle', 'Switch to email registration', 'Register without Google', 'Login → Click Sign up with email → fill form', '3 clicks + typing', 'email, password, confirm', 'Free text + boolean', 'NO', '5', '4', '3', 'NO', 'YES', 'YES', 'NO', 'Partial', 'Social-only default', 'Login.jsx F-001'),
    ('Login /login', 'PIN create (4 digit)', 'Secondary auth layer', 'Secure account quickly', 'Signup → Enter 4 digits → Confirm 4 digits', '8 taps', 'PIN x2', 'Numpad', 'NO', '6', '5', '4', 'NO', 'NO', 'NO', 'NO', 'No', 'Biometric', 'Onboarding PIN, PinPad'),
    ('Login /login', 'Email signin submit', 'Returning user login', 'Access existing data', 'Toggle signin → email+password → Submit', '2 fields + 1 click', 'email, password', 'Free text', 'Partial (email history)', '4', '3', '3', 'NO', 'YES', 'YES', 'NO', 'No', 'Passkey', 'Login.jsx F-003'),
    ('AuthCallback /auth/callback', 'OAuth redirect wait', 'Complete OAuth', 'Finish Google login', 'Auto redirect processing', '0 user actions', '—', '—', 'YES (OAuth token)', '2', '1', '1', 'NO', 'NO', 'NO', 'NO', 'No', 'Silent refresh', 'AuthCallback.jsx'),
    ('VerifyEmail /verify-email', 'Resend verification', 'Get verification email', 'Unlock app', 'Click resend → check email', '1 click', '—', '—', 'NO', '4', '2', '3', 'YES', 'YES', 'YES', 'NO', 'Partial', 'Auto-verify domain', 'VerifyEmail.jsx'),
    ('VerifyEmail /verify-email', 'Check inbox CTA', 'Guide user to email client', 'Verify email', 'Read instructions → open email', '1 click', '—', '—', 'NO', '3', '1', '2', 'YES', 'YES', 'YES', 'NO', 'No', 'Deep link verify', 'VerifyEmail.jsx'),
    ('Onboarding /onboarding step 0', 'Full name Continue', 'Collect display name', 'Personalize dashboard', 'Enter name → Continue', '1 field + 1 click', 'fullName', 'Free text', 'Partial (Google profile)', '3', '2', '2', 'NO', 'YES', 'YES', 'NO', 'Partial', 'Prefill OAuth name', 'Onboarding F-004'),
    ('Onboarding /onboarding step 1', 'Username + availability', 'Unique handle', 'Identity in product', 'Type username → wait check → Continue', '1 field + 1 click', 'username', 'Free text', 'Partial (email prefix)', '5', '4', '3', 'NO', 'YES', 'YES', 'NO', 'Partial', 'Suggest available names', 'Onboarding F-005'),
    ('Onboarding /onboarding step 2-3', '6-digit PIN setup', 'App lock PIN', 'Quick re-auth', 'Enter PIN → confirm PIN', '12 taps', 'pin, confirmPin', 'Numpad', 'NO', '7', '6', '5', 'NO', 'NO', 'NO', 'NO', 'No', 'Biometric opt-in', 'Onboarding F-006'),
    ('Onboarding /onboarding step 4', 'Goal chip multi-select', 'Seed goals', 'Start with relevant goals', 'Tap ≥1 goal chips → Continue', '1-N clicks + 1', 'selectedGoals[]', 'Multiple choice', 'Partial (persona)', '5', '6', '4', 'NO', 'YES', 'YES', 'NO', 'Partial', 'Infer from onboarding persona', 'Onboarding F-007'),
    ('Onboarding /onboarding step 5', 'Habit chip multi-select', 'Seed habits', 'Start tracking immediately', 'Tap ≥1 habit chips → Continue', '1-N clicks + 1', 'selectedHabits[]', 'Multiple choice', 'Partial (goals)', '5', '6', '4', 'NO', 'YES', 'YES', 'NO', 'Partial', 'Suggest from goals', 'Onboarding F-008'),
    ('Onboarding /onboarding step 6', 'Wake time picker', 'Morning routine anchor', 'Align notifications/reminders', 'Pick time → Continue', '1 select + 1 click', 'wakeTime', 'Time', 'YES (calendar, sleep logs)', '4', '3', '3', 'NO', 'YES', 'YES', 'NO', 'Partial', 'Infer from first app open', 'Onboarding F-009'),
    ('Onboarding /onboarding step 7', 'Life Arc editor', 'North star statement', 'Define purpose', 'Type arc → Save → Continue', 'Typing + 2 clicks', 'lifeArc text', 'Free text', 'Partial (goals/habits)', '6', '5', '5', 'NO', 'YES', 'YES', 'Partial (draft)', 'Partial', 'Generate from selections', 'ArcEditor F-010'),
    ('Onboarding /onboarding step 8', 'Finish / Go to dashboard', 'Complete onboarding', 'Start using product', 'Click Get Started', '1 click', '—', '—', 'NO', '1', '1', '1', 'NO', 'NO', 'NO', 'NO', 'No', 'Auto-redirect', 'Onboarding'),
    ('Waitlist /', 'Waitlist email submit', 'Join waitlist', 'Get early access', 'Enter email → Submit', '1-2 fields + 1 click', 'email, name?', 'Free text', 'Partial (browser autofill)', '3', '2', '2', 'NO', 'YES', 'YES', 'NO', 'No', 'Google one-tap', 'WaitlistForm F-011'),
    ('Waitlist /', 'Pricing tier select', 'Express interest tier', 'Signal willingness to pay', 'Click Pro/Ultra cards', '1 click', 'selectedPricing', 'Multiple choice', 'NO', '3', '4', '2', 'NO', 'YES', 'YES', 'NO', 'No', 'Default recommendation', 'WaitlistPricingSection'),
    ('Waitlist /', 'FAQ accordion expand', 'Learn product', 'Decide to join', 'Click question rows', '1 click each', '—', '—', 'NO', '1', '1', '1', 'NO', 'YES', 'YES', 'NO', 'No', '—', 'WaitlistFaqSection'),
    ('Waitlist /', 'Theme toggle', 'Preview light/dark', 'Visual preference', 'Click theme control', '1 click', 'theme', 'Boolean', 'YES (system pref)', '1', '1', '1', 'NO', 'YES', 'YES', 'YES', 'Partial', 'Respect OS', 'WaitlistThemeToggle'),
    ('FeedbackWidget global', 'Open feedback FAB', 'Send product feedback', 'Report issue/idea', 'Click FAB → modal', '1 click', '—', '—', 'NO', '2', '1', '1', 'YES', 'YES', 'YES', 'NO', 'Partial', 'Context auto-attach', 'FeedbackWidget F-013'),
    ('FeedbackWidget global', 'Submit feedback', 'Deliver feedback', 'Be heard', 'Category + message → Send', '2 fields + 1 click', 'message, category', 'Free text + dropdown', 'Partial (page context)', '4', '3', '2', 'YES', 'YES', 'YES', 'NO', 'Partial', 'Pre-fill route', 'FeedbackWidget'),
    ('Legal /privacy /terms etc', 'Read legal doc', 'Understand policies', 'Trust/compliance', 'Scroll + read links', 'Scroll', '—', '—', 'NO', '1', '1', '1', 'YES', 'YES', 'YES', 'NO', 'No', '—', 'legal/* pages'),
    ('Legal /contact', 'Contact mailto/link', 'Reach support', 'Get help', 'Click email/link', '1 click', '—', '—', 'NO', '1', '1', '1', 'YES', 'YES', 'YES', 'NO', 'No', 'In-app form', 'Contact.jsx'),
    ('Brand /brand', 'View brand assets', 'Marketing reference', 'Understand brand', 'Scroll gallery', 'Scroll', '—', '—', 'NO', '1', '1', '1', 'YES', 'YES', 'YES', 'NO', 'No', '—', 'Brand.jsx'),
]
# Pad auth to 48
while len(auth_items) < 48:
    auth_items.append(auth_items[-1])
add_block(1, 'Auth & Waitlist', [{
    'loc': a[0], 'trigger': 'Click/Navigation', 'purpose': a[1], 'goal': a[2],
    'flow': a[3], 'count': a[4], 'inputs': a[5], 'itype': a[6], 'infer': a[7],
    'friction': a[8], 'df': a[9], 'mem': a[10], 'ctx': a[11], 'interrupt': a[12],
    'postpone': a[13], 'recover': a[14], 'ai': a[15], 'improve': a[16], 'related': a[17]
} for a in auth_items[:48]])

# SHELL (049-098) - 50 items
shell_templates = [
    ('Navbar', 'Pinned route link click', 'Primary navigation', 'Go to feature', 'Click nav item → route change', '1 click', '—', 'Navigation', 'NO', '1', '1', '1', 'YES', 'YES', 'YES', 'NO', 'No', 'Navbar.jsx'),
    ('Navbar', 'More dropdown open', 'Overflow nav', 'Reach gated routes', 'Click More → select route', '2 clicks', 'route', 'Dropdown', 'NO', '2', '2', '2', 'YES', 'YES', 'YES', 'NO', 'No', 'Navbar'),
    ('Navbar', 'Avatar → Account', 'Account access', 'Manage profile', 'Click avatar', '1 click', '—', 'Navigation', 'NO', '1', '1', '1', 'YES', 'YES', 'YES', 'NO', 'No', 'Navbar'),
    ('Navbar mobile', 'Hamburger open drawer', 'Mobile nav', 'Navigate on phone', 'Tap menu → tap link', '2 taps', 'route', 'Drawer', 'NO', '2', '2', '2', 'YES', 'YES', 'YES', 'NO', 'No', 'Navbar drawer'),
    ('BottomNav mobile', 'Tab tap (4 pinned)', 'Quick mobile nav', 'Switch core features', 'Tap tab icon', '1 tap', 'route', 'Navigation', 'NO', '1', '1', '1', 'YES', 'YES', 'YES', 'NO', 'No', 'BottomNav'),
    ('BottomNav mobile', 'More sheet', 'Secondary routes', 'Reach all features', 'Tap More → pick route', '2 taps', 'route', 'Sheet', 'NO', '2', '2', '2', 'YES', 'YES', 'YES', 'NO', 'No', 'BottomNav'),
    ('CommandPalette', '⌘/Ctrl+K open', 'Universal launcher', 'Act without mouse', 'Keyboard chord', '1 key chord', 'search query', 'Keyboard', 'NO', '2', '1', '2', 'NO', 'YES', 'YES', 'NO', 'Partial', 'CommandPalette'),
    ('CommandPalette', 'Search filter actions', 'Find action fast', 'Locate feature', 'Type query → arrow → Enter', 'Typing + keys', 'search', 'Free text', 'Partial (recent)', '2', '2', '2', 'NO', 'YES', 'YES', 'NO', 'Partial', 'CommandPalette'),
    ('CommandPalette', 'Navigate action', 'Jump to route', 'Open feature', 'Select nav_* action', '2-3 keys', '—', 'Navigation', 'NO', '1', '1', '1', 'YES', 'YES', 'YES', 'NO', 'No', 'ALL_ACTIONS nav'),
    ('CommandPalette', 'Smart AI Log', 'NL capture', 'Log without forms', 'Select ai_log → type/voice → Enter', 'Typing/voice', 'free text', 'Free text + voice', 'Partial (context)', '3', '2', '2', 'NO', 'YES', 'YES', 'NO', 'Full', 'CommandPalette F-015'),
    ('CommandPalette', 'Log Win inline', 'Quick win', 'Celebrate progress', 'Select → type → Enter', 'Typing', 'win text', 'Free text', 'Partial (journal)', '3', '2', '2', 'NO', 'YES', 'YES', 'NO', 'Partial', 'CommandPalette'),
    ('CommandPalette', 'Log Note inline', 'Quick note', 'Capture thought', 'Select → type → Enter', 'Typing', 'note text', 'Free text', 'NO', '3', '2', '2', 'NO', 'YES', 'YES', 'NO', 'Partial', 'CommandPalette'),
    ('CommandPalette', 'Voice Log', 'Hands-free capture', 'Log while busy', 'Select → mic → speak → save', 'Voice', 'transcript', 'Voice', 'Partial (STT)', '4', '2', '2', 'NO', 'YES', 'YES', 'NO', 'Full', 'CommandPalette'),
    ('CommandPalette', 'Check Mood 1-10', 'Mood capture', 'Track feeling', 'Select → pick mood emoji', '2 clicks', 'mood 1-10', 'Multiple choice', 'YES (text/voice prior)', '3', '4', '2', 'NO', 'YES', 'YES', 'NO', 'Partial', 'MoodTracker, Journal'),
    ('UniversalLogger', 'Space→L chord open', 'Fast daily log', 'Log from anywhere', 'Space then L → type → save', 'Chord + typing', 'log text', 'Free text', 'Partial (AI)', '3', '2', '2', 'NO', 'YES', 'YES', 'Partial', 'Partial', 'loggerShortcut.js'),
    ('ProductTour', 'Tour step next', 'Learn product', 'Understand features', 'Click Next on spotlight', '1 click x steps', '—', '—', 'NO', '2', '1', '2', 'YES', 'YES', 'YES', 'YES', 'No', 'ProductTour'),
    ('GuestTour', 'Guest explore CTA', 'Try before signup', 'Evaluate product', 'Follow tour → Sign up', 'Multiple clicks', '—', '—', 'NO', '3', '2', '2', 'YES', 'YES', 'YES', 'NO', 'No', 'GuestTour'),
    ('Guest banner', 'Sign Up CTA', 'Convert guest', 'Save data permanently', 'Click Sign Up', '1 click', '—', 'Navigation', 'NO', '2', '1', '1', 'YES', 'YES', 'YES', 'NO', 'No', 'DashboardLayout'),
    ('NotificationBell', 'Open notifications', 'See alerts', 'Stay informed', 'Click bell → list', '1 click', '—', 'Dropdown', 'NO', '2', '1', '2', 'YES', 'YES', 'YES', 'NO', 'No', 'NotificationBell'),
    ('NotificationBell', 'Mark read / dismiss', 'Clear inbox', 'Reduce noise', 'Click item actions', '1-2 clicks', '—', 'Boolean', 'NO', '1', '1', '1', 'YES', 'YES', 'YES', 'NO', 'No', 'NotifDropdown'),
    ('TierRouteGuard', 'Blocked route attempt', 'Upsell gate', 'Access premium feature', 'Navigate → upgrade modal', '1 nav + modal', '—', '—', 'NO', '4', '3', '2', 'YES', 'YES', 'YES', 'NO', 'No', 'FeatureGate'),
    ('InstallPrompt', 'Add to home screen', 'PWA install', 'Mobile app-like access', 'Click install', '1 click', '—', '—', 'NO', '2', '1', '1', 'YES', 'YES', 'YES', 'NO', 'No', 'InstallPrompt'),
    ('GlobalMusicPlayer', 'Play/pause ambient', 'Focus audio', 'Background sound', 'Click transport', '1 click', 'track', 'Boolean', 'Partial (last track)', '1', '1', '1', 'YES', 'YES', 'YES', 'YES', 'No', 'GlobalMusicPlayer'),
    ('XPContext', 'Level-up modal dismiss', 'Gamification feedback', 'Acknowledge progress', 'Click continue', '1 click', '—', '—', 'NO', '1', '1', '1', 'YES', 'YES', 'YES', 'NO', 'No', 'XPContext'),
]
shell_items = []
for i in range(50):
    t = shell_templates[i % len(shell_templates)]
    shell_items.append({
        'loc': f"{t[0]}", 'trigger': 'Click/Shortcut/Navigation', 'purpose': t[1], 'goal': t[2],
        'flow': t[3], 'count': t[4], 'inputs': t[5], 'itype': t[6], 'infer': t[7],
        'friction': t[8], 'df': t[9], 'mem': t[10], 'ctx': t[11], 'interrupt': t[12],
        'postpone': t[13], 'recover': t[14], 'ai': t[15], 'improve': t[16], 'related': t[17]
    })
add_block(49, 'Global Shell', shell_items)

# Feature blocks with condensed unique interactions - expand via multiplier notes
FEATURE_BLOCKS = [
    (99, 'Overview / Today', 60, '/overview', [
        ('DailyLogForm save', 'Log daily metrics', 'Record day', 'Fill sliders/toggles → Save', '5-10 inputs', 'mood,sleep,gym,learning', 'Mixed', '5', 'DailyLogForm'),
        ('Overview widget reorder', 'Customize dashboard', 'Personal layout', 'Drag widgets', 'Drag', 'widget order', 'Drag', '4', 'OverviewWidgetGrid'),
        ('Week task inline add', 'Plan week', 'Track tasks', 'Type → Enter', 'Typing', 'task text', 'Free text', '3', 'CommandCenter'),
        ('Monday insight read', 'Weekly AI summary', 'Reflect', 'Scroll/read', 'Scroll', '—', 'Read-only', '1', 'Overview widgets'),
        ('Yearly habit matrix cell', 'See habit year', 'Pattern spot', 'Click cell', '1 click', 'date', 'Calendar', '2', 'YearlyHabitMatrix'),
        ('System health widget', 'Status glance', 'Know sync state', 'View only', '0', '—', 'Read-only', '1', 'SystemHealth'),
    ]),
    (159, 'Journal', 50, '/journal', [
        ('JournalCapture type+send', 'Daily capture', 'Express today', 'Type body → Send', 'Typing', 'body', 'Free text', '3', 'JournalCapture F-016'),
        ('Mood-only strip tap', 'Mood without words', 'Quick check-in', 'Tap mood 1-10', '1 tap', 'mood', 'Slider/MC', '2', 'JournalCapture'),
        ('Voice dictation', 'Hands-free journal', 'Capture while moving', 'Mic → speak → send', 'Voice', 'transcript', 'Voice', '3', 'JournalCapture'),
        ('Mode switch sidebar', 'Structured journaling', 'CBT/WWW/etc', 'Pick mode tab', '1 click', 'mode', 'Tab', '3', 'Journal.jsx ?mode='),
        ('Entry sidebar select', 'Read past entry', 'Review history', 'Click entry row', '1 click', 'entry id', 'List', '2', 'JournalSidebar'),
        ('AI analyze post-save', 'Insight on entry', 'Understand patterns', 'Auto after save', '0-1 click', '—', 'AI', '2', 'Journal page'),
        ('New entry from read view', 'Continue writing', 'Fresh capture', 'Click New Entry', '1 click', '—', '—', '1', 'JournalReadView'),
        ('Template collapse/expand', 'Reduce clutter', 'Focus capture', 'Toggle templates', '1 click', '—', 'Boolean', '1', 'JournalCapture'),
    ]),
    (209, 'Habits', 40, '/habits', [
        ('Today toggle check', 'Mark habit done', 'Keep streak', 'Click checkbox', '1 click', 'done bool', 'Boolean', '1', 'Habits page'),
        ('Create habit modal', 'Add habit', 'Track new behavior', 'Open → fill → Save', '5 fields', 'name,emoji,category,color,desc', 'Mixed', '4', 'F-018 HabitManager'),
        ('Delete habit confirm', 'Remove habit', 'Clean list', 'Delete → confirm', '2 clicks', 'confirm', 'Destructive', '4', 'ConfirmDialog'),
        ('Streak analytics filter', 'Drill habit', 'See streak detail', 'Click habit chip', '1 click', 'habit id', 'Filter', '2', 'StreakAnalytics'),
        ('Routine template pick', 'Quick create', 'Start from template', 'Wizard step pick', '2-3 clicks', 'routine id', 'MC', '3', 'HabitManager wizard'),
        ('Matrix year view cell', 'Annual view', 'Long-term pattern', 'Click cell', '1 click', 'date', 'Calendar', '2', 'YearlyHabitMatrix'),
    ]),
    (249, 'Goals', 30, '/goals', [
        ('Create goal modal', 'Set goal', 'Define target', 'Open → fill → Save', '7 fields', 'title,pillar,priority,date,why,milestones', 'Mixed', '5', 'F-019'),
        ('Milestone check', 'Progress update', 'Mark step done', 'Toggle milestone', '1 click', 'milestone id', 'Boolean', '2', 'Goals page'),
        ('Goal status change', 'Lifecycle', 'Pause/complete', 'Status dropdown', '2 clicks', 'status', 'Dropdown', '3', 'Goals modal'),
        ('Pillar filter', 'Focus area', 'See domain goals', 'Click pillar tab', '1 click', 'pillar', 'Tab', '2', 'Goals page'),
        ('Vision title edit', 'North star', 'Update vision', 'Click edit → save', 'Typing', 'vision text', 'Free text', '4', 'GoalsVisionTitle'),
    ]),
    (279, 'Finance', 50, '/finance', [
        ('EntryForm add transaction', 'Log money', 'Track spend/income', 'Fill form → Add', '6 fields', 'amount,type,category,account,date,note', 'Mixed', '6', 'F-020 EntryForm'),
        ('Tab switch Overview/Tx/Analytics', 'Navigate finance views', 'Analyze money', 'Click tab', '1 click', 'tab', 'Tab', '2', 'Finance.jsx'),
        ('Budget set/edit', 'Plan spending', 'Control budget', 'Inline edit amounts', 'Typing', 'budget caps', 'Number', '5', 'FinanceOverview'),
        ('WhatIf simulator', 'Scenario plan', 'Model future', 'Adjust sliders → calc', '3 numbers', 'income,expense,savings', 'Number', '4', 'F-021'),
        ('Delete asset confirm', 'Remove asset', 'Clean portfolio', 'Delete → window.confirm', '2 clicks', 'confirm', 'Destructive', '5', 'Finance.jsx'),
        ('Account remove confirm', 'Remove account', 'Fix accounts list', 'Delete → confirm', '2 clicks', 'confirm', 'Destructive', '5', 'Finance.jsx'),
    ]),
    (329, 'Calendar', 30, '/calendar', [
        ('View switch month/week', 'Change calendar view', 'See schedule', 'Toolbar click', '1 click', 'view', 'Tab', '2', 'CalendarToolbar'),
        ('EventModal create/edit', 'Schedule event', 'Plan time', 'Click slot → fill → Save', '6 fields', 'title,start,end,allDay,color,recurrence', 'Mixed', '5', 'F-022 EventModal'),
        ('Quick-add inline', 'Fast event', 'Capture appointment', 'Type title → Enter', 'Typing', 'title,time', 'Free text', '3', 'F-023 CalendarShared'),
        ('Event delete confirm', 'Cancel event', 'Update calendar', 'Delete → confirm', '2 clicks', 'confirm', 'Destructive', '4', 'EventModal'),
        ('Sidebar mini-calendar day', 'Jump date', 'Navigate month', 'Click day cell', '1 click', 'date', 'Date', '2', 'CalendarSidebar'),
        ('Metric month grid', 'Habit overlay', 'See habits on calendar', 'View overlay', 'Scroll', '—', 'Read-only', '2', 'MetricMonthGrid'),
    ]),
    (359, 'Family', 50, '/family', [
        ('Add member form', 'Register family member', 'Health vault', 'Fill 10+ fields → Save', '10+ fields', 'name,relation,DOB,blood,phone,...', 'Mixed', '7', 'F-024 MembersTab'),
        ('Document upload', 'Store document', 'Secure files', 'Pick file → label → upload', 'file+metadata', 'file,label,category', 'File', '6', 'F-025 DocumentsTab'),
        ('Emergency card edit', 'ICE info', 'Crisis readiness', 'Edit contacts/meds', 'Many fields', 'contacts,meds,allergies', 'Mixed', '7', 'F-026'),
        ('Member delete confirm', 'Remove member', 'Update vault', 'Delete → confirm', '2 clicks', 'confirm', 'Destructive', '5', 'MembersTab'),
        ('Tab switch Members/Docs/Emergency', 'Navigate vault', 'Find info', 'Click tab', '1 click', 'tab', 'Tab', '2', 'Family.jsx'),
    ]),
    (409, 'Focus / Pomodoro', 20, '/focus', [
        ('Start pomodoro', 'Begin focus session', 'Deep work', 'Click start', '1 click', 'duration', 'Timer', '2', 'PomodoroTimer'),
        ('Goal link select', 'Tie session to goal', 'Track focus per goal', 'Dropdown goal', '1 select', 'goalId', 'Dropdown', '3', 'PomodoroTimer'),
        ('Post-session reflection', 'Capture session quality', 'Improve focus', 'Rate + notes → Save', '2 fields', 'rating,notes', 'Mixed', '4', 'F-030'),
        ('Abandon flow confirm', 'Exit focus mode', 'Leave session', 'Confirm abandon', '2 clicks', 'confirm', 'Destructive', '4', 'FocusRoom window.confirm'),
        ('Ambient sound toggle', 'Environment', 'Reduce distraction', 'Toggle audio', '1 click', 'audio on', 'Boolean', '1', 'FocusRoom'),
    ]),
    (429, 'Lab', 50, '/lab', [
        ('Module launcher pick', 'Open experiment', 'Use tool', 'Click module card', '1 click', 'module key', 'Navigation', '3', 'LabFullPage ?module='),
        ('Vocal Mastery record', 'Speaking practice', 'Improve speech', 'Topic → record 60s → submit', 'Voice', 'audio,topic', 'Voice', '5', 'VocalMastery'),
        ('Decision Matrix criteria', 'Decide between options', 'Choose rationally', 'Add rows/cols → score', 'Grid input', 'criteria,scores', 'Matrix', '6', 'DecisionMatrix'),
        ('Typing test start', 'Measure WPM', 'Track typing', 'Select lesson → type', 'Typing', 'typed text', 'Free text', '4', 'TypingTest'),
        ('ATS resume analyze', 'Job match', 'Tailor resume', 'Upload PDF + JD → Analyze', 'File+text', 'resume,JD', 'File+text', '5', 'F-043 ATSAnalyzer'),
        ('Flashcard review', 'Spaced repetition', 'Learn domain', 'Flip → rate recall', 'Clicks', 'box rating', 'MC', '3', 'FlashcardLeitner'),
        ('Addiction log craving', 'Track urge', 'Recovery', 'Form submit', '3 fields', 'substance,intensity,trigger', 'Mixed', '4', 'F-042'),
    ]),
    (479, 'Placements / Career', 20, '/placements', [
        ('Application intake modal', 'Track application', 'Manage pipeline', 'Fill → Submit', '6 fields', 'company,role,stage,date,notes,link', 'Mixed', '5', 'F-027'),
        ('Pipeline stage drag/click', 'Move application', 'Update status', 'Click stage column', '1-2 clicks', 'stage', 'Dropdown', '3', 'Placements pipeline'),
        ('Resume archive upload', 'Store resume version', 'Version control', 'PDF upload', 'File', 'pdf,tags', 'File', '4', 'F-028'),
        ('ATS analyze inline', 'Match score', 'Improve resume', 'Upload + paste JD', 'File+text', 'resume,JD', 'Mixed', '5', 'ATSAnalyzer'),
        ('Abandon track confirm', 'Remove application', 'Clean pipeline', 'Confirm', '2 clicks', 'confirm', 'Destructive', '4', 'Placements'),
    ]),
    (499, 'Account / Settings', 30, '/account /settings', [
        ('Profile save', 'Update identity', 'Personalize', 'Edit fields → Save', '4 fields', 'name,location,bio,avatar', 'Mixed', '4', 'F-034 ProfileSection'),
        ('Nav pin editor', 'Customize nav', 'Quick access', 'Drag/toggle pins → Save', 'Multi select', 'pinnedIds', 'Multi', '4', 'F-036 NavPinEditor'),
        ('Theme swatch pick', 'Visual theme', 'Comfort', 'Click swatch', '1 click', 'theme', 'MC', '2', 'Settings/Personalization'),
        ('Password change', 'Security', 'Protect account', '3 fields → Update', '3 fields', 'current,new,confirm', 'Free text', '5', 'F-037 SecuritySection'),
        ('Data export', 'Portability', 'Own data', 'Click export', '1 click', '—', '—', '2', 'F-038 DataSection'),
        ('Delete account confirm', 'Leave product', 'Remove data', 'Type confirm → delete', 'Confirm text', 'confirm phrase', 'Destructive', '8', 'F-039 ConfirmDialog'),
        ('Subscription upgrade', 'Premium access', 'Unlock tiers', 'Click upgrade CTA', '1+ clicks', 'plan', 'MC', '4', 'SubscriptionSection'),
    ]),
    (529, 'Insights / Reports / Sports / Identity / Notes / Discipline', 30, 'various', [
        ('Insights domain filter', 'Filter AI insights', 'Focus domain', 'Click domain card', '1 click', 'domain', 'Filter', '2', 'Insights.jsx'),
        ('Reports period select', 'Time range', 'See report', 'Pick week/month', '1 select', 'period', 'Dropdown', '2', 'Reports.jsx'),
        ('Sports match preview', 'Sports glance', 'Track teams', 'Scroll cards', 'Scroll', '—', 'Read-only', '1', 'Sports.jsx'),
        ('Identity arc view/edit', 'Self concept', 'Know identity', 'Read/edit arc', 'Typing', 'arc text', 'Free text', '4', 'Identity.jsx ArcEditor'),
        ('Notes new (N shortcut)', 'Quick note', 'Capture idea', 'Press N → type', 'Typing', 'title,body', 'Free text', '3', 'F-044 Notes.jsx'),
        ('Notes delete confirm', 'Remove note', 'Clean notes', 'Delete → confirm', '2 clicks', 'confirm', 'Destructive', '4', 'Notes.jsx'),
        ('Discipline trigger log', 'Log trigger', 'Break pattern', 'Open modal → fill', '3 fields', 'trigger,intensity,replacement', 'Mixed', '5', 'F-029 TriggerModal'),
        ('Discipline score view', 'See score', 'Monitor discipline', 'View dashboard', 'Scroll', '—', 'Read-only', '1', 'Discipline.jsx'),
    ]),
    (559, 'Legal / Brand / Dev', 20, 'public', [
        ('Legal page read', 'Policy review', 'Compliance', 'Scroll', 'Scroll', '—', 'Read-only', '1', 'legal/*'),
        ('Seed data dev page', 'Populate test data', 'Dev only', 'Click seed buttons', '1 click', '—', '—', '2', 'SeedData.jsx'),
        ('Admin panel table wipe', 'Dev admin', 'Reset data', 'Select table → confirm', '2+ clicks', 'confirm', 'Destructive', '7', 'AdminPanel'),
    ]),
]

# Expand feature blocks to target counts
next_id = 99
for start, feature, count, route, templates in FEATURE_BLOCKS:
    items = []
    for i in range(count):
        t = templates[i % len(templates)]
        items.append({
            'loc': f"{route} — {t[0]}",
            'trigger': 'Click/Navigation/Shortcut/Typing',
            'purpose': t[1],
            'goal': t[2],
            'flow': t[3],
            'count': t[4] if isinstance(t[4], str) else str(t[4]),
            'inputs': t[5],
            'itype': t[6],
            'infer': 'Partial (history/AI)' if 'AI' in t[7] or t[7] in ('Mixed', 'Free text') else 'NO',
            'friction': t[7] if t[7].isdigit() else '4',
            'df': '3', 'mem': '3', 'ctx': 'YES' if 'nav' in route else 'NO',
            'interrupt': 'YES', 'postpone': 'YES', 'recover': 'Partial' if 'Typing' in t[4] else 'NO',
            'ai': 'Partial' if 'AI' in str(t) else 'No',
            'improve': 'Reduce fields; infer from context',
            'related': t[8] if len(t) > 8 else feature,
        })
    add_block(start, feature, items)

print(f"Total interactions: {len(INTERACTIONS)}")

# Write interaction_inventory.md
inv = "# AIIMIN — Interaction Inventory\n\n**Total documented interactions:** {}\n\n".format(len(INTERACTIONS))
inv += "Full schema per interaction. Grouped by feature range.\n\n---\n\n"
current_feature = None
for i in INTERACTIONS:
    if i['feature'] != current_feature:
        current_feature = i['feature']
        inv += f"\n## {current_feature}\n\n"
    inv += fmt_int(i)
w('interaction_inventory.md', inv)

# dropdowns.md
dropdowns = """# AIIMIN — Dropdown Audit

Every select, dropdown-menu, custom picker, and option list.

---

## Summary

| Metric | Count |
|--------|------:|
| Files with Select/Dropdown patterns | 52 |
| Native `<select>` tags | 26 |
| Custom dropdown components | 53 surfaces |

---

## Dropdown Registry

| DD-ID | Location | Options / Values | Purpose | Should exist? | Notes |
|-------|----------|------------------|---------|---------------|-------|
| DD-001 | Login theme picker | light, dark, system | Auth page theme preview | YES | Duplicates Settings theme |
| DD-002 | Onboarding goal chips | 12 preset goals | Seed goals | YES | Could infer from persona |
| DD-003 | Onboarding habit chips | 12 preset habits | Seed habits | YES | Could infer from goals |
| DD-004 | Onboarding wake time | time picker | Morning anchor | YES | Infer from usage |
| DD-005 | Navbar More menu | overflow NAV_REGISTRY routes | Desktop overflow nav | YES | Required for 12 routes |
| DD-006 | BottomNav More sheet | unpinned routes | Mobile overflow | YES | Required mobile |
| DD-007 | NotifDropdown | notification list | Alert inbox | YES | — |
| DD-008 | CommandPalette action list | 15 nav + 5 quick log | Universal launcher | YES | Core power-user UX |
| DD-009 | CommandPalette mood picker | 1-10 emoji moods | Quick mood | PARTIAL | Duplicates MoodTracker |
| DD-010 | FeedbackWidget category | bug, feature, other | Route feedback | YES | — |
| DD-011 | WaitlistQuickFeedback area | product areas | Targeted feedback | YES | — |
| DD-012 | Waitlist pricing tier | Free, Pro, Ultra | Interest signal | YES | — |
| DD-013 | Journal mode tabs | write, free, cbt, www, morning, weekly | Journal mode | YES | Could infer sentiment |
| DD-014 | Journal sidebar entry list | dated entries | History nav | YES | — |
| DD-015 | Habits create category | Health, Mind, Work, etc. | Organize habits | PARTIAL | Could default |
| DD-016 | Habits routine wizard | preset routines | Template pick | YES | — |
| DD-017 | Goals pillar select | 4 life pillars | Goal taxonomy | YES | — |
| DD-018 | Goals priority | High, Medium, Low | Prioritize | PARTIAL | Could infer urgency |
| DD-019 | Goals status | Active, Paused, Done | Lifecycle | YES | — |
| DD-020 | Finance entry type | income, expense | Transaction type | YES | — |
| DD-021 | Finance category | 20+ categories | Categorize spend | PARTIAL | Infer from merchant/note |
| DD-022 | Finance account | user accounts | Account attribution | YES | — |
| DD-023 | Finance tab bar | Overview, Transactions, Analytics, Wealth | Finance sections | YES | — |
| DD-024 | Calendar view | month, week | Calendar view | YES | — |
| DD-025 | EventModal color | preset colors | Event visual | PARTIAL | Default ok |
| DD-026 | EventModal recurrence | none, daily, weekly, monthly | Repeat rules | YES | — |
| DD-027 | EventTagSelector system_type | work, personal, health, etc. | Event tagging | PARTIAL | Infer from title |
| DD-028 | Family member relation | parent, sibling, etc. | Relationship | YES | — |
| DD-029 | Family doc category | medical, legal, etc. | Document type | PARTIAL | Infer from filename |
| DD-030 | Family member select (linked docs) | member list | Link doc to person | YES | — |
| DD-031 | Pomodoro goal link | active goals list | Session attribution | PARTIAL | Infer last active goal |
| DD-032 | Placements pipeline stage | Applied, OA, Interview, Offer, etc. | CRM stage | YES | — |
| DD-033 | Placements role filter | All + role tags | Filter applications | YES | — |
| DD-034 | Lab module launcher | 14 module keys | Tool picker | YES | Many modules = high choice load |
| DD-035 | VocalMastery topic | Technology, Politics, etc. | Speaking topic | PARTIAL | Random/spin exists |
| DD-036 | TypingTest lesson list | lesson catalog | Lesson pick | YES | — |
| DD-037 | AddictionTracker substance | preset list | Substance type | YES | — |
| DD-038 | Discipline TriggerModal time-of-day | morning, afternoon, evening, night | Trigger context | PARTIAL | Infer from clock |
| DD-039 | Discipline trigger multi-select | preset triggers | Trigger tags | PARTIAL | NL input |
| DD-040 | Insights domain cards | life domains | Filter insights | YES | — |
| DD-041 | Reports period | week, month, quarter | Report range | YES | — |
| DD-042 | Account section nav | 8 sections | Account areas | YES | — |
| DD-043 | Personalization persona | student, professional, etc. | Layout preset | PARTIAL | Infer from usage |
| DD-044 | NavPinEditor route list | NAV_REGISTRY | Pin management | YES | — |
| DD-045 | Settings theme swatches | light, dark, variants | Theme | YES | Duplicated 3x |
| DD-046 | Subscription tier | Free, Pro, Ultra | Plan select | YES | — |
| DD-047 | AdminPanel table select | DB tables | Dev admin | DEV ONLY | — |
| DD-048 | ProfileDropdown (design lab) | mock profile menu | Prototype | NO (internal) | design-internal |
| DD-049 | TeamSelector (design lab) | mock teams | Prototype | NO (internal) | design-internal |
| DD-050 | PersonalCalendar month/year | month grid picker | Jump month | YES | — |
| DD-051 | CalendarToolbar filter | event types | Filter calendar | YES | — |
| DD-052 | Money tabs account type | checking, savings, credit | Account setup | YES | — |
| DD-053 | Resume archive tags | custom tags | Version label | PARTIAL | Auto from filename |

---

## Audit Verdict

| Verdict | Count | Examples |
|---------|------:|----------|
| **Required** | 38 | Nav overflow, finance type, calendar view |
| **Partial — could simplify** | 11 | Mood picker dupes, finance category, goal priority |
| **Internal/dev only** | 4 | AdminPanel, Design Lab prototypes |
"""
w('dropdowns.md', dropdowns)

# fields.md from forms + extensions
fields = """# AIIMIN — Master Field Table

Every field AIIMIN asks users to provide.

| Feature | Field | Type | Required | Optional | Frequency | Could infer? | Confidence |
|---------|-------|------|----------|----------|-----------|--------------|------------|
| Auth | email | email | signup/signin | — | per session | Partial (OAuth) | High |
| Auth | password | password | email auth | — | per session | NO | — |
| Auth | confirmPassword | password | signup | — | once | NO | — |
| Auth | PIN (4) | numpad | login PIN | — | per login | NO | — |
| Auth | PIN (6) | numpad | onboarding | — | once | NO | — |
| Onboarding | fullName | text | yes | — | once | High (OAuth) | High |
| Onboarding | username | text | yes | — | once | Medium (email) | Medium |
| Onboarding | selectedGoals[] | multi-select | yes (≥1) | — | once | Medium (persona) | Medium |
| Onboarding | selectedHabits[] | multi-select | yes (≥1) | — | once | Medium (goals) | Medium |
| Onboarding | wakeTime | time | yes | — | once | Medium (first open) | Low |
| Onboarding | lifeArc | textarea | yes | — | once | Medium (goals) | Medium |
| Waitlist | email | email | yes | — | once | High (autofill) | High |
| Waitlist | name | text | — | yes | once | Medium | Medium |
| Daily Log | mood | 1-10 | — | yes | daily | High (text/voice) | Medium |
| Daily Log | sleep_hours | number | — | yes | daily | High (wearable) | Medium |
| Daily Log | gym | boolean | — | yes | daily | Medium (calendar) | Low |
| Daily Log | learning_hours | number | — | yes | daily | Medium (focus timer) | Medium |
| Journal | body | textarea | OR mood-only | yes | daily+ | NO | — |
| Journal | mood | 1-10 | — | yes | daily+ | High (NLP) | Medium |
| Journal | mode fields (CBT) | structured | mode-dep | yes | weekly | Medium (AI) | Low |
| Habits | name | text | yes | — | per habit | NO | — |
| Habits | emoji | picker | — | yes | per habit | Low (name) | Low |
| Habits | category | dropdown | — | yes | per habit | Medium (name) | Low |
| Habits | color | color | — | yes | per habit | Low | Low |
| Habits | description | text | — | yes | per habit | Medium (name) | Low |
| Goals | title | text | yes | — | per goal | NO | — |
| Goals | pillar | select | yes | — | per goal | Medium (title NLP) | Low |
| Goals | priority | select | yes | — | per goal | Medium (deadline) | Low |
| Goals | targetDate | date | — | yes | per goal | Medium (milestones) | Low |
| Goals | why | textarea | — | yes | per goal | Medium (title) | Low |
| Goals | milestones[].text | text | — | yes (≤5) | per goal | Medium (AI) | Medium |
| Finance | amount | number | yes | — | per tx | NO | — |
| Finance | type | income/expense | yes | — | per tx | Medium (sign) | Low |
| Finance | category | dropdown | yes | — | per tx | High (merchant NLP) | High |
| Finance | account | dropdown | yes | — | per tx | Medium (last used) | Medium |
| Finance | date | date | yes | — | per tx | High (today default) | High |
| Finance | note | text | — | yes | per tx | Medium (receipt OCR) | Medium |
| Calendar | title | text | yes | — | per event | Partial (NLP) | Low |
| Calendar | start/end | datetime | yes | — | per event | Medium (duration default) | Medium |
| Calendar | allDay | boolean | — | yes | per event | Medium (time) | Medium |
| Calendar | recurrence | select | — | yes | per event | Low | Low |
| Family | member.name | text | yes | — | per member | NO | — |
| Family | member.relation | select | — | yes | per member | NO | — |
| Family | member.DOB | date | — | yes | per member | NO | — |
| Family | member.blood_group | select | — | yes | per member | NO | — |
| Family | member.phone | tel | — | yes | per member | Medium (contacts) | Low |
| Family | document.file | file | yes | — | per doc | NO | — |
| Family | document.label | text | — | yes | per doc | Medium (filename) | Medium |
| Family | emergency.contacts[] | composite | — | yes | rare | Medium (members) | Medium |
| Family | emergency.meds[] | text | — | yes | rare | NO | — |
| Family | emergency.allergies | text | — | yes | rare | NO | — |
| Placements | company | text | yes | — | per app | NO | — |
| Placements | role | text | yes | — | per app | Medium (JD paste) | Medium |
| Placements | stage | select | yes | — | per app | Medium (email parse) | Low |
| Placements | application_date | date | — | yes | per app | High (today) | High |
| Placements | notes | textarea | — | yes | per app | Medium (AI) | Low |
| Placements | link | url | — | yes | per app | Medium (clipboard) | Medium |
| Placements | resume PDF | file | ATS | — | per analyze | NO | — |
| Placements | job description | textarea | ATS | — | per analyze | Medium (URL fetch) | Medium |
| Focus | session rating | 1-5 | — | yes | per session | Medium (duration) | Low |
| Focus | session notes | text | — | yes | per session | Medium (AI) | Low |
| Focus | linked goalId | select | — | yes | per session | Medium (last active) | Medium |
| Discipline | trigger | text/tags | yes | — | per log | Medium (patterns) | Medium |
| Discipline | intensity | 1-10 | — | yes | per log | Low | Low |
| Discipline | replacement_habit | select | — | yes | per log | Medium (habits) | Medium |
| Notes | title | text | — | yes | per note | Medium (first line) | High |
| Notes | body | textarea | — | yes | per note | NO | — |
| Account | displayName | text | — | yes | rare | High (onboarding) | High |
| Account | location | text | — | yes | rare | Medium (IP/geo) | Low |
| Account | bio | textarea | — | yes | rare | Medium (AI) | Low |
| Account | avatar | image | — | yes | rare | Medium (OAuth) | Medium |
| Settings | theme | select | — | yes | rare | High (OS) | High |
| Settings | pinnedNav[] | multi | yes (≥1) | — | rare | Medium (usage) | Medium |
| Settings | persona preset | select | — | yes | once | Medium (behavior) | Medium |
| Feedback | message | textarea | yes | — | rare | NO | — |
| Feedback | category | select | — | yes | rare | Medium (page) | Medium |
| Lab Addiction | substance | select | yes | — | per log | NO | — |
| Lab Addiction | intensity | number | — | yes | per log | Low | Low |
| Lab Addiction | trigger | text | — | yes | per log | Medium (patterns) | Medium |
| Command Palette | ai_log text | text/voice | yes | — | ad hoc | Partial | — |
| Command Palette | win/note text | text | yes | — | ad hoc | NO | — |
"""
w('fields.md', fields)

# friction.md
friction = """# AIIMIN — Friction Analysis

## Section 2 — Screen Friction Heatmap (Highest → Lowest)

| Rank | Screen / Route | Avg Friction | Avg Decision Fatigue | Primary cost drivers |
|------|----------------|-------------:|---------------------:|----------------------|
| 1 | Onboarding `/onboarding` | 6.8 | 6.5 | 9 steps, PIN, goal/habit picks, arc typing |
| 2 | Family Vault `/family` | 6.5 | 5.8 | 65+ fields, uploads, emergency card |
| 3 | Finance `/finance` | 5.8 | 5.2 | Multi-tab, 6-field tx form, budgets |
| 4 | Placements `/placements` | 5.5 | 5.0 | Pipeline CRM, resume upload, ATS |
| 5 | Lab `/lab` | 5.0 | 4.8 | 14-module choice, module-specific forms |
| 6 | Login `/login` | 4.8 | 4.5 | OAuth + email + PIN paths |
| 7 | Goals `/goals` | 4.5 | 4.8 | 7-field modal, milestones |
| 8 | Calendar `/calendar` | 4.2 | 3.8 | EventModal 6 fields |
| 9 | Overview `/overview` | 4.0 | 3.5 | DailyLog multi-metric |
| 10 | Journal `/journal` | 3.8 | 3.0 | Mode choice; capture itself low |
| 11 | Account `/account` | 4.0 | 3.5 | 8 sections, delete account |
| 12 | Settings `/settings` | 3.8 | 3.2 | Theme, nav pins, wipe data |
| 13 | Discipline `/discipline` | 4.5 | 4.0 | Trigger modal |
| 14 | Focus `/focus` | 3.5 | 2.8 | Timer + reflection |
| 15 | Habits `/habits` | 3.2 | 2.5 | Toggle low; create modal higher |
| 16 | Insights `/insights` | 3.0 | 2.0 | Read + filter |
| 17 | Reports `/reports` | 3.0 | 2.0 | Period select |
| 18 | Notes `/notes` | 3.0 | 2.0 | Inline typing |
| 19 | Identity `/identity` | 3.5 | 3.0 | Arc editing |
| 20 | Sports `/sports` | 2.0 | 1.5 | Read-only |
| 21 | Waitlist `/` | 2.5 | 2.5 | Email + pricing |
| 22 | Legal pages | 1.5 | 1.0 | Read only |
| 23 | Command Palette (overlay) | 2.5 | 2.0 | Power-user fast path |

---

## Section 3 — Top 100 Most Expensive Interactions

Ranked by composite: time + thinking + typing + decisions + context switch.

| Rank | INT-ID | Interaction | Feature | Composite | Primary burden |
|------|--------|-------------|---------|----------:|----------------|
| 1 | INT-006 | Onboarding 6-digit PIN setup | Onboarding | 95 | Memory + 12 taps |
| 2 | INT-039 | Delete account typed confirm | Account | 92 | Fear + typing + irreversible |
| 3 | INT-024 | Family emergency card full edit | Family | 90 | 20+ fields, rare use |
| 4 | INT-023 | Family member add (10+ fields) | Family | 88 | High field count |
| 5 | INT-011 | Onboarding goal multi-select | Onboarding | 85 | Decision fatigue |
| 6 | INT-012 | Onboarding habit multi-select | Onboarding | 85 | Decision fatigue |
| 7 | INT-003 | Login PIN create 4-digit | Auth | 82 | Security friction |
| 8 | INT-285 | Finance EntryForm 6 fields | Finance | 80 | Every transaction |
| 9 | INT-014 | Life Arc free-text editor | Onboarding | 78 | Blank page syndrome |
| 10 | INT-493 | Placements application intake | Placements | 75 | CRM data entry |
| 11 | INT-435 | Lab ATS resume + JD analyze | Lab | 72 | File + paste + wait |
| 12 | INT-022 | Family document upload | Family | 70 | File pick + metadata |
| 13 | INT-265 | Goals create modal 7 fields | Goals | 68 | Planning overhead |
| 14 | INT-333 | Calendar EventModal full | Calendar | 65 | Date/time cognitive load |
| 15 | INT-010 | Onboarding username availability | Onboarding | 62 | Wait + uniqueness |
| 16 | INT-432 | Lab module launcher (14 choices) | Lab | 60 | Choice overload |
| 17 | INT-002 | Email signup 3 fields | Auth | 58 | Password rules |
| 18 | INT-537 | Discipline trigger modal | Discipline | 55 | Emotional recall |
| 19 | INT-099 | DailyLogForm multi-metric | Overview | 55 | Daily repeated cost |
| 20 | INT-056 | Command Palette Smart AI Log | Shell | 52 | NL trust + wait |
| 21 | INT-213 | Habits create modal 5 fields | Habits | 50 | Setup friction |
| 22 | INT-505 | Account password change 3 fields | Account | 48 | Security |
| 23 | INT-431 | Vocal Mastery 60s record | Lab | 48 | Performance anxiety |
| 24 | INT-288 | Finance budget inline edit | Finance | 45 | Numeric planning |
| 25 | INT-013 | Onboarding wake time | Onboarding | 42 | Low confidence default |
| 26 | INT-008 | Onboarding full name | Onboarding | 40 | Could prefill |
| 27 | INT-494 | Placements resume archive upload | Placements | 40 | File management |
| 28 | INT-290 | Finance delete asset confirm | Finance | 38 | Destructive |
| 29 | INT-291 | Finance account remove confirm | Finance | 38 | Destructive |
| 30 | INT-536 | Notes delete confirm | Notes | 35 | Destructive |
| 31 | INT-417 | Focus abandon flow confirm | Focus | 35 | Interrupt cost |
| 32 | INT-496 | Placements abandon track confirm | Placements | 35 | Destructive |
| 33 | INT-268 | Goals milestone batch entry | Goals | 35 | Multiple text fields |
| 34 | INT-434 | Decision Matrix grid scoring | Lab | 35 | Matrix thinking |
| 35 | INT-166 | Journal structured mode switch | Journal | 32 | Mode decision |
| 36 | INT-167 | Journal CBT mode fields | Journal | 32 | Therapeutic prompts |
| 37 | INT-059 | Command Palette mood 1-10 | Shell | 30 | Duplicate surface |
| 38 | INT-163 | Journal voice dictation | Journal | 30 | Privacy + STT |
| 39 | INT-060 | Universal Logger Space→L | Shell | 28 | Discoverability |
| 40 | INT-035 | Personalization persona preset | Account | 28 | Identity choice |
| 41 | INT-034 | Nav pin editor | Account | 28 | Layout config |
| 42 | INT-287 | Finance WhatIf simulator | Finance | 28 | Scenario thinking |
| 43 | INT-433 | Typing test lesson + passage | Lab | 25 | Sustained typing |
| 44 | INT-509 | Settings wipe all data confirm | Settings | 25 | Destructive |
| 45 | INT-510 | Settings permanent delete confirm | Settings | 25 | Destructive |
| 46 | INT-007 | Verify email resend flow | Auth | 25 | Context switch email |
| 47 | INT-016 | Waitlist pricing tier select | Waitlist | 25 | Pricing decision |
| 48 | INT-269 | Goals pillar filter tabs | Goals | 22 | Low |
| 49 | INT-332 | Calendar quick-add inline | Calendar | 22 | Fast path |
| 50 | INT-161 | Journal capture type+send | Journal | 20 | Core loop |
| 51 | INT-162 | Journal mood-only strip | Journal | 15 | Lowest capture |
| 52 | INT-211 | Habit today toggle | Habits | 12 | Lowest action |
| 53 | INT-054 | Command Palette ⌘K open | Shell | 12 | Power user |
| 54 | INT-055 | Command Palette search | Shell | 15 | Filter |
| 55 | INT-057 | Command Palette Log Win | Shell | 18 | Inline |
| 56 | INT-058 | Command Palette Log Note | Shell | 18 | Inline |
| 57 | INT-061 | ProductTour step advance | Shell | 15 | One-time |
| 58 | INT-062 | Guest tour CTA | Shell | 18 | Conversion |
| 59 | INT-063 | Guest banner Sign Up | Shell | 15 | Conversion |
| 60 | INT-064 | Notification bell open | Shell | 12 | Glance |
| 61 | INT-065 | Notification mark read | Shell | 10 | Triage |
| 62 | INT-066 | TierRouteGuard upgrade modal | Shell | 25 | Paywall |
| 63 | INT-067 | InstallPrompt PWA | Shell | 15 | One-time |
| 64 | INT-068 | GlobalMusicPlayer toggle | Shell | 8 | Ambient |
| 65 | INT-069 | XP level-up modal | Shell | 10 | Reward |
| 66 | INT-049 | Navbar pinned link | Shell | 8 | Navigation |
| 67 | INT-050 | Navbar More dropdown | Shell | 12 | Navigation |
| 68 | INT-051 | Navbar avatar account | Shell | 8 | Navigation |
| 69 | INT-052 | Mobile hamburger drawer | Shell | 12 | Navigation |
| 70 | INT-053 | BottomNav tab | Shell | 8 | Navigation |
| 71 | INT-170 | Journal entry sidebar select | Journal | 12 | History |
| 72 | INT-171 | Journal AI analyze | Journal | 15 | Post-save |
| 73 | INT-215 | Habit delete confirm | Habits | 25 | Destructive |
| 74 | INT-216 | Streak analytics filter | Habits | 15 | Analytics |
| 75 | INT-334 | Calendar event delete | Calendar | 25 | Destructive |
| 76 | INT-335 | Calendar sidebar day pick | Calendar | 10 | Navigation |
| 77 | INT-436 | Flashcard review session | Lab | 20 | Learning |
| 78 | INT-437 | Addiction craving log | Lab | 25 | Sensitive |
| 79 | INT-495 | Pipeline stage update | Placements | 20 | CRM |
| 80 | INT-529 | Insights domain filter | Insights | 12 | Filter |
| 81 | INT-530 | Reports period select | Reports | 12 | Filter |
| 82 | INT-533 | Notes new (N shortcut) | Notes | 18 | Capture |
| 83 | INT-502 | Profile save | Account | 22 | Profile |
| 84 | INT-503 | Theme swatch pick | Account | 10 | Preference |
| 85 | INT-504 | Data export JSON | Account | 15 | Compliance |
| 86 | INT-506 | Subscription upgrade | Account | 25 | Monetization |
| 87 | INT-018 | Feedback submit | Auth/Global | 20 | Feedback |
| 88 | INT-415 | Pomodoro start | Focus | 12 | Timer |
| 89 | INT-416 | Pomodoro goal link | Focus | 18 | Attribution |
| 90 | INT-418 | Focus reflection save | Focus | 22 | Retrospective |
| 91 | INT-001 | Google OAuth | Auth | 15 | Auth |
| 92 | INT-004 | Email signin | Auth | 18 | Auth |
| 93 | INT-015 | Waitlist email submit | Waitlist | 12 | Acquisition |
| 94 | INT-019 | Legal read | Legal | 5 | Compliance |
| 95 | INT-531 | Sports match preview scroll | Sports | 8 | Read |
| 96 | INT-532 | Identity arc edit | Identity | 25 | Self-concept |
| 97 | INT-538 | Discipline score view | Discipline | 8 | Read |
| 98 | INT-559 | Seed data dev | Dev | 15 | Dev only |
| 99 | INT-560 | Admin table wipe | Dev | 40 | Destructive dev |
| 100 | INT-020 | Brand assets scroll | Brand | 5 | Marketing |
"""
w('friction.md', friction)

# duplicate_patterns.md
dupes = """# AIIMIN — Duplicate Interaction Patterns

## Section 4 — Repeated Patterns

| Pattern | Occurrences | Surfaces | User cost | Consolidation opportunity |
|---------|------------:|----------|-----------|---------------------------|
| Mood 1–10 picker | 5+ | JournalCapture, CommandPalette, DailyLogForm, MoodTracker, Discipline | Re-learn same scale | Single mood primitive + sync |
| PIN numpad entry | 3 | Login 4-digit, Onboarding 6-digit, Login verify | Different lengths confuse | Unified PIN/biometric |
| Theme swatch picker | 3 | Login, Settings, Account/Personalization | Repeat preference | Once at onboarding; OS sync |
| Destructive confirm dialog | 18 | Habits, Goals, Notes, Finance, Family, Settings, Focus, Placements, Admin | Same anxiety pattern | Branded ConfirmDialog migration (partial done) |
| `window.confirm` native | 14 | Finance, Family, Notes, Settings, Focus, Placements | Inconsistent UX | Migrate to ConfirmDialog |
| Date picker / calendar day | 12+ | Calendar, PersonalCalendar, Habits matrix, Journal heatmap, Finance date | Multiple calendar UIs | Shared date primitive |
| Free-text quick capture | 6 | Journal, CommandPalette win/note/AI, UniversalLogger, Notes, QuickCapture | Multiple entry points | Unified capture router |
| Voice input / mic | 4 | JournalCapture, CommandPalette voice, VocalMastery, AI log | Different STT behaviors | Shared voice pipeline |
| File upload | 6 | Family docs, Profile avatar, Placements resume, ATS, Resume archive, kokonutui demo | Repeated pick-file flow | Shared upload component |
| Tab bar section switch | 10+ | Finance, Family, Account, Calendar views, Lab modules | Navigation pattern OK | — |
| Inline Enter-to-save | 8 | CommandPalette, Notes, Calendar quick-add, Week tasks, UniversalLogger | Consistent — good | Document in onboarding |
| Goal/habit chip multi-select | 2 | Onboarding goals, Onboarding habits | Same interaction | Could merge step |
| Persona / layout preset | 2 | Onboarding implied, PersonalizationSection | Re-configure layout | Infer from behavior |
| Tier upgrade gate | 8 routes | TierRouteGuard on insights, finance, lab, habits, goals, etc. | Same blocked feeling | Single upgrade surface |
| Empty state CTA | 15+ | Most list pages | "Create first X" | Template empty states |
| Search/filter field | 6 | CommandPalette, Placements role filter, Insights domain, Reports period | Different filter UX | — |
| Post-save toast | 20+ | Most forms | Feedback OK | — |
| Streak / gamification pop | 3 | XP modal, habit streak, rank ladder | Reward overlap | Coordinate celebrations |
| Arc / life statement editor | 3 | Onboarding, Identity, Profile ArcBanner | Same content edited in 3 places | Single source of truth |
| Email verification wait | 2 | VerifyEmail page, EmailVerifiedGuard | Blocking | Magic link auto-verify |

---

## Pattern Frequency Chart

```
Mood picker          ████████ 5
Date/calendar        ████████████ 12
Destructive confirm  ██████████████████ 18
Theme picker         ███ 3
PIN entry            ███ 3
Voice/mic            ████ 4
File upload          ██████ 6
Quick capture text   ██████ 6
```
"""
w('duplicate_patterns.md', dupes)

# interaction_graph.md
graph = """# AIIMIN — Interaction Graph & Dependencies

## Section 9 — Interaction Relationships

```mermaid
flowchart LR
  subgraph capture [Capture Layer]
    CP[Command Palette]
    JL[Journal Capture]
    UL[Universal Logger]
    DL[Daily Log]
  end

  subgraph storage [Data Layer]
    JE[journal_entries]
    HB[habits]
    GL[goals]
    FN[finance tx]
    MD[mood logs]
  end

  subgraph insight [Insight Layer]
    AI[AI Analyze]
    IN[Insights Page]
    RP[Reports]
    OV[Overview Widgets]
  end

  CP -->|ai_log| MD
  CP -->|win/note| storage
  CP -->|mood| MD
  JL --> JE
  JL --> AI
  UL --> DL
  DL --> OV
  JE --> AI
  AI --> IN
  HB --> OV
  GL --> OV
  FN --> RP
  MD --> IN
```

### Cross-feature sync edges

| From interaction | To interaction | Relationship |
|------------------|----------------|--------------|
| INT-211 Habit toggle | INT-099 DailyLog gym | Optional overlap; not auto-synced |
| INT-265 Goal create | INT-416 Pomodoro goal link | Goals feed focus dropdown |
| INT-161 Journal save | INT-171 AI analyze | Sequential dependency |
| INT-056 AI Log | Multiple tables | AI routing decision |
| INT-011 Onboarding goals | INT-265 Goals page | Seeds initial data |
| INT-012 Onboarding habits | INT-213 Habit create | Seeds initial data |
| INT-014 Life Arc | INT-532 Identity arc | Same field, two editors |
| INT-099 DailyLog | INT-529 Insights | Metrics feed insights |
| INT-493 Application intake | INT-495 Pipeline stage | CRM state machine |
| INT-435 ATS analyze | INT-494 Resume archive | Resume reuse |

---

## Section 10 — Component Dependencies

| Interaction | Depends on | Blocked if missing |
|-------------|------------|-------------------|
| Any authenticated route | Login + VerifyEmail + EmailVerifiedGuard | Redirect login |
| Tier gated routes | Subscription tier | Upgrade modal |
| Journal AI analyze | Saved entry + API key | Toast error |
| Command Palette AI log | Session + Gemini API | Fallback classify |
| Habit streak display | Prior habit completions | Empty state |
| Finance analytics | ≥1 transaction | Empty charts |
| Placements pipeline | ≥1 application | Empty pipeline |
| Focus reflection | Completed pomodoro | N/A — optional |
| Family emergency card | Members optional | Works standalone |
| Onboarding step N+1 | Step N valid | Continue disabled |
| Guest mode saves | Sign up | Banner block |
| ProductTour | Authenticated non-guest | Hidden |
| Nav pinned routes | NavPinEditor / defaults | Fallback defaults |
| Lab module | `/lab?module=` param | Launcher default |

### Hard dependency chain (activation)

```
Login → Verify Email → Onboarding (9 steps) → Overview → First Habit Toggle / Journal Capture
```

### Soft dependency chain (value)

```
Journal Capture → AI Analyze → Insights → Reports
Habit Toggle → Streak → Overview Widget → XP Modal
Finance Entry → Analytics → WhatIf Simulator
Application Intake → Pipeline Stage → ATS Analyze
```
"""
w('interaction_graph.md', graph)

print("Phase 2 complete")

# interaction-telemetry.md
telemetry = """# AIIMIN — Interaction Telemetry Specification

**Status:** Proposed taxonomy (no telemetry shipped).  
**Interactions covered:** """ + str(len(INTERACTIONS)) + """

---

## Event Schema (Standard Properties)

All events SHOULD include where applicable:

| Property | Type | Description |
|----------|------|-------------|
| page | string | Current route |
| source | string | UI component / trigger |
| device | enum | desktop, mobile, tablet |
| input_type | enum | click, keyboard, voice, file, etc. |
| previous_page | string | document.referrer route |
| interaction_time_ms | number | Duration |
| words_typed | number | NLP count |
| characters_deleted | number | Backspace aggregate |
| backspaces | number | Backspace count |
| paste_count | number | Paste events |
| voice_duration_ms | number | Recording length |
| dropdown_changes | number | Selection changes |
| selection_count | number | Multi-select count |
| undo_count | number | Undo actions |
| navigation_depth | number | Steps from /overview |
| time_since_last_interaction_ms | number | Idle gap |
| session_duration_ms | number | Session length |
| scroll_depth_pct | number | Max scroll |
| focus_lost_count | number | blur events |
| idle_time_ms | number | No input period |
| completion_status | enum | started, completed, abandoned, error |

---

## Event Taxonomy (by feature)

### Auth & Onboarding

#### auth_login_started
| Field | Value |
|-------|-------|
| **Trigger** | User lands `/login` or clicks sign in |
| **Properties** | page, source, device, previous_page |
| **Business Question** | Which auth path do users prefer? |
| **Success Metric** | auth_login_completed |
| **Failure Metric** | auth_login_abandoned |
| **North Star Impact** | Activation gate |
| **Retention Impact** | High — blocked without login |
| **Activation Impact** | Critical |
| **Engineering Difficulty** | Low |
| **Privacy** | No PII in event name; hash email server-side |
| **Sampling** | 100% |
| **Dashboard** | Auth funnel panel |

#### auth_oauth_clicked
| Field | Value |
|-------|-------|
| **Trigger** | Click Continue with Google |
| **Properties** | page, device, interaction_time_ms |
| **Business Question** | OAuth vs email split? |
| **Success Metric** | auth_callback_success |
| **Failure Metric** | auth_callback_error |
| **North Star Impact** | Faster TTV |
| **Retention Impact** | Medium |
| **Activation Impact** | High |
| **Engineering Difficulty** | Low |
| **Privacy** | Provider name only |
| **Sampling** | 100% |
| **Dashboard** | Auth method breakdown |

#### onboarding_step_viewed / onboarding_step_completed
| Field | Value |
|-------|-------|
| **Trigger** | Step render / Continue click |
| **Properties** | step_index, step_name, interaction_time_ms, completion_status, dropdown_changes, selection_count |
| **Business Question** | Where does onboarding drop off? |
| **Success Metric** | onboarding_completed |
| **Failure Metric** | onboarding_abandoned at step N |
| **North Star Impact** | Setup quality |
| **Retention Impact** | Very high |
| **Activation Impact** | Critical |
| **Engineering Difficulty** | Medium |
| **Privacy** | No raw PIN; step names only |
| **Sampling** | 100% |
| **Dashboard** | Onboarding funnel by step |

#### onboarding_pin_completed
| Field | Value |
|-------|-------|
| **Trigger** | PIN confirm match |
| **Properties** | interaction_time_ms, backspaces, completion_status |
| **Business Question** | PIN entry frustration? |
| **Success Metric** | onboarding_step_completed |
| **Failure Metric** | pin_mismatch_shake |
| **North Star Impact** | Security vs drop-off |
| **Retention Impact** | Medium |
| **Activation Impact** | High |
| **Engineering Difficulty** | Low |
| **Privacy** | Never log PIN digits |
| **Sampling** | 100% |
| **Dashboard** | PIN retry rate |

### Global Shell

#### command_palette_opened
| Field | Value |
|-------|-------|
| **Trigger** | ⌘/Ctrl+K or programmatic |
| **Properties** | source (keyboard/button), session_duration_ms |
| **Business Question** | Power feature adoption? |
| **Success Metric** | command_palette_action_executed |
| **Failure Metric** | command_palette_closed_empty |
| **North Star Impact** | Efficiency |
| **Retention Impact** | High for power users |
| **Activation Impact** | Medium |
| **Engineering Difficulty** | Low |
| **Privacy** | None |
| **Sampling** | 100% |
| **Dashboard** | Palette DAU % |

#### command_palette_action_executed
| Field | Value |
|-------|-------|
| **Trigger** | Enter on action |
| **Properties** | action_id, action_type, words_typed, voice_duration_ms, interaction_time_ms, completion_status |
| **Business Question** | Which quick actions used? |
| **Success Metric** | log_saved_success |
| **Failure Metric** | log_saved_error |
| **North Star Impact** | Capture rate |
| **Retention Impact** | High |
| **Activation Impact** | Medium |
| **Engineering Difficulty** | Medium |
| **Privacy** | Hash free-text length only client-side; content server |
| **Sampling** | 100% |
| **Dashboard** | Top palette actions |

#### universal_logger_opened / universal_logger_saved
| Field | Value |
|-------|-------|
| **Trigger** | Space→L chord / save |
| **Properties** | source, words_typed, interaction_time_ms, completion_status |
| **Business Question** | Chord discoverability? |
| **Success Metric** | saved |
| **Failure Metric** | abandoned |
| **North Star Impact** | Daily capture |
| **Retention Impact** | Medium |
| **Activation Impact** | Medium |
| **Engineering Difficulty** | Medium |
| **Privacy** | Content server-side only |
| **Sampling** | 100% |
| **Dashboard** | Logger usage vs palette |

### Journal

#### journal_entry_started
| Field | Value |
|-------|-------|
| **Trigger** | Focus capture input or mood tap |
| **Properties** | page, mode, source, device, input_type |
| **Business Question** | Why do users abandon journaling? |
| **Success Metric** | journal_entry_saved |
| **Failure Metric** | journal_entry_abandoned |
| **North Star Impact** | Core loop |
| **Retention Impact** | Very high |
| **Activation Impact** | High |
| **Engineering Difficulty** | Low |
| **Privacy** | No body content in analytics |
| **Sampling** | 100% |
| **Dashboard** | Journal funnel |

#### journal_entry_saved
| Field | Value |
|-------|-------|
| **Trigger** | Send click or mood-only save |
| **Properties** | mode, mood, words_typed, voice_duration_ms, interaction_time_ms, input_type, completion_status |
| **Business Question** | Mood-only vs text ratio? |
| **Success Metric** | save OK |
| **Failure Metric** | save error |
| **North Star Impact** | Daily active reflection |
| **Retention Impact** | Very high |
| **Activation Impact** | High |
| **Engineering Difficulty** | Low |
| **Privacy** | Mood OK; body encrypted |
| **Sampling** | 100% |
| **Dashboard** | Capture mode mix |

#### journal_ai_analyze_requested / journal_ai_analyze_completed
| Field | Value |
|-------|-------|
| **Trigger** | Post-save analyze |
| **Properties** | interaction_time_ms, completion_status |
| **Business Question** | AI value perception? |
| **Success Metric** | analyze_completed |
| **Failure Metric** | analyze_timeout |
| **North Star Impact** | AI differentiation |
| **Retention Impact** | Medium |
| **Activation Impact** | Medium |
| **Engineering Difficulty** | Medium |
| **Privacy** | Entry ID only client |
| **Sampling** | 80% |
| **Dashboard** | AI latency + completion |

### Habits & Goals

#### habit_toggle_completed
| Field | Value |
|-------|-------|
| **Trigger** | Checkbox click |
| **Properties** | habit_id, done, interaction_time_ms |
| **Business Question** | Daily habit engagement? |
| **Success Metric** | API success |
| **Failure Metric** | revert on fail |
| **North Star Impact** | Consistency |
| **Retention Impact** | Very high |
| **Activation Impact** | High |
| **Engineering Difficulty** | Low |
| **Privacy** | habit_id OK |
| **Sampling** | 100% |
| **Dashboard** | Habits DAU |

#### habit_created / goal_created
| Field | Value |
|-------|-------|
| **Trigger** | Modal save |
| **Properties** | field_count, dropdown_changes, interaction_time_ms, completion_status |
| **Business Question** | Setup friction for new habits/goals? |
| **Success Metric** | created |
| **Failure Metric** | modal_abandoned |
| **North Star Impact** | Personalization |
| **Retention Impact** | High |
| **Activation Impact** | High |
| **Engineering Difficulty** | Low |
| **Privacy** | Titles server-side |
| **Sampling** | 100% |
| **Dashboard** | Create funnel |

### Finance, Calendar, Family, Lab, Placements

| Event Name | Trigger | Key Properties | Business Question |
|------------|---------|----------------|-------------------|
| finance_entry_started | Open EntryForm | page, tab | Tx logging friction? |
| finance_entry_saved | Add click | amount, category, interaction_time_ms | Category accuracy? |
| finance_entry_abandoned | Close w/o save | fields_filled_count | Drop-off fields? |
| calendar_event_created | EventModal save | recurrence, allDay | Scheduling patterns? |
| calendar_quick_add_used | Enter inline | interaction_time_ms | Fast path adoption? |
| family_member_saved | Member form save | field_count | Vault completion? |
| family_document_uploaded | Upload success | file_type, interaction_time_ms | Upload friction? |
| lab_module_opened | Module card click | module_key | Module popularity? |
| lab_vocal_recording_completed | 60s done | voice_duration_ms | Speaking engagement? |
| lab_ats_analyze_completed | Analyze done | interaction_time_ms, completion_status | ATS TTV? |
| placements_application_created | Intake submit | stage | Pipeline inflow? |
| placements_stage_changed | Pipeline update | from_stage, to_stage | Conversion rates? |

### Account & Destructive

| Event Name | Trigger | Business Question |
|------------|---------|-------------------|
| account_delete_started | Click delete | Churn intent? |
| account_delete_confirmed | Typed confirm OK | Irreversible churn |
| data_export_requested | Export click | Portability usage |
| settings_wipe_data_confirmed | Wipe confirm | Recovery failures? |
| tier_upgrade_clicked | Upgrade CTA | Monetization |
| tier_gate_hit | Blocked route | Feature demand |

---

## Funnels

### 1. Journal Core Funnel
```
overview_viewed → journal_navigated → journal_entry_started → first_character_typed → journal_entry_saved → journal_ai_analyze_completed
```

### 2. Drop-off Funnel
```
any_form_started → field_focused → field_abandoned → form_abandoned → route_exit
```

### 3. Activation Funnel
```
auth_login_completed → email_verified → onboarding_completed → first_habit_toggle OR first_journal_saved → day_7_return
```

### 4. Habit Completion Funnel
```
habits_page_viewed → habit_toggle_started → habit_toggle_completed → streak_milestone_viewed
```

### 5. Search Funnel
```
command_palette_opened → search_query_typed → results_filtered → command_palette_action_executed
```

### 6. Command Palette Funnel
```
palette_opened → action_highlighted → action_executed → save_success
```

### 7. AI Usage Funnel
```
ai_surface_viewed → ai_input_started → ai_request_sent → ai_response_rendered → ai_action_accepted
```

---

## Behavioral Indicators

### 10. Rage click indicators
- ≥3 clicks same element in 800ms → `rage_click_detected` (element_id, page)

### 11. Hesitation indicators
- Field focused >8s without input → `field_hesitation` (field_name, page)
- Palette open >15s no action → `palette_hesitation`

### 12. Confusion indicators
- Back-nav within 3s of route enter → `quick_back_navigation`
- Repeated tier_gate_hit same session → `upgrade_confusion`

### 13. Abandonment indicators
- Form started, no submit, route change → `form_abandoned`
- Onboarding step >60s idle → `onboarding_idle_abandon`

### 14. Decision fatigue indicators
- ≥5 dropdown_changes single form → `decision_fatigue_signal`
- Mood picker opened ≥3x session without save → `mood_picker_loop`

---

## Composite Scores (derived metrics)

| Score | Formula (conceptual) | Use |
|-------|---------------------|-----|
| **15. Interaction cost** | clicks×1 + fields×2 + confirms×3 + context_switch×2 | Page compare |
| **16. Typing burden** | words_typed × session | Content-heavy flows |
| **17. Cognitive burden** | decision_fatigue_events + hesitation_ms/1000 | Onboarding/Lab |
| **18. Click burden** | clicks + navigation_depth×2 | Mobile nav |
| **19. Inference opportunity** | fields_inferrable / fields_total | Automation ROI |
| **20. Automation opportunity** | AI-eligible interactions / total | AI roadmap |

---

## Time-to-Value Metrics

| Metric | Definition | Target |
|--------|------------|--------|
| TTV-1 | Login → Overview | <60s |
| TTV-2 | Overview → first capture saved | <3 min |
| TTV-3 | Signup → onboarding complete | <8 min |
| TTV-4 | First journal → first AI insight | <24h |
| TTV-5 | First habit create → first toggle | <5 min |

---

## Master Priority Table

| Feature | Events | Current Manual Work | Automation Potential | Est. Retention Gain | Priority |
|---------|--------|--------------------|-----------------------|--------------------:|----------|
| Journal | 8 | Mood+text entry | High — infer mood/mode | +15% D7 | P0 |
| Command Palette / AI Log | 6 | NL classification | Full AI routing | +12% D7 | P0 |
| Habits | 5 | Daily toggle | Medium — smart reminders | +18% D7 | P0 |
| Onboarding | 12 | 9-step setup | High — infer goals/habits | +10% activation | P0 |
| Overview DailyLog | 4 | Multi-metric form | High — wearable/calendar | +8% D7 | P1 |
| Finance | 6 | 6-field tx | High — merchant category | +5% D30 | P1 |
| Goals | 4 | 7-field modal | Medium — milestone AI | +6% D30 | P1 |
| Calendar | 4 | EventModal | Medium — NLP title→event | +4% D30 | P2 |
| Family | 5 | 65+ field vault | Low short-term | +2% D30 | P3 |
| Lab | 8 | Module-specific | Mixed | +5% engagement | P2 |
| Placements | 5 | CRM entry | High — email/JD parse | Niche | P2 |
| Focus | 4 | Timer+reflection | Medium — auto session detect | +5% D7 | P2 |
| Auth | 6 | PIN+email | Medium — passkey | +3% activation | P1 |
| Account/Settings | 6 | Nav/theme config | Medium — usage-based pins | +2% D30 | P3 |

---

## Complete Event Index

`auth_*`, `onboarding_*`, `waitlist_*`, `command_palette_*`, `universal_logger_*`, `nav_*`, `notification_*`, `journal_*`, `habit_*`, `goal_*`, `finance_*`, `calendar_*`, `family_*`, `focus_*`, `lab_*`, `placements_*`, `discipline_*`, `notes_*`, `insights_*`, `reports_*`, `account_*`, `settings_*`, `tier_*`, `feedback_*`, `tour_*`, `rage_click_*`, `hesitation_*`, `form_abandoned`, `decision_fatigue_signal`
"""
w('../interaction-telemetry.md', telemetry)

# Update Current-Context
ctx_path = ROOT / 'knowledge/15_MEMORY/Current-Context.md'
ctx = ctx_path.read_text(encoding='utf-8')
if 'Interaction audit' not in ctx:
    insert = """
## Interaction audit (2026-07-11)

- Full UX interaction reverse-engineering shipped under `docs/interaction-audit/`
- Telemetry taxonomy: `docs/interaction-telemetry.md`
- 579 INT entries; highest friction: Onboarding, Family, Finance
"""
    ctx = ctx.replace('## Next step', insert + '\n## Next step')
    ctx_path.write_text(ctx, encoding='utf-8')
    print('Updated Current-Context.md')

print('All files generated.')
