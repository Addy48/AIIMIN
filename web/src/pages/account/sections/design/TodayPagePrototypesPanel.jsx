import React from 'react';
import { CalendarDays, CircleDot, Compass, Flame, Layers3, ListChecks, ScanLine, Sparkles, Target, TimerReset } from 'lucide-react';
import { LabCard } from './PrototypePrimitives';

const PROTOTYPES = [
  {
    id: 'briefing',
    title: '01. Briefing Desk',
    badge: 'Recommended',
    thesis: 'Best SaaS default: one calm brief, one action stack, one context rail.',
    className: 'today-proto--briefing',
    nav: ['Today', 'Plan', 'Habits', 'Journal', 'Finance', 'Calendar'],
    metrics: [['Target', '21d'], ['Week', '27'], ['Calendar', '0']],
    heroTitle: 'Today needs a clean reset.',
    heroBody: 'Your week is quiet. Start with one priority, log one signal, and keep the active target visible without making it the whole product.',
    insight: 'Recommended next move: define the single outcome that makes today count.',
    actions: ['Set top priority', 'Log a quick update', 'Review target'],
    railTitle: 'Active target',
    railValue: 'Placement sprint',
    timeline: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  {
    id: 'operator',
    title: '02. Operator Console',
    badge: 'Power',
    thesis: 'For ambitious users who want execution pressure, but with sharper grouping.',
    className: 'today-proto--operator',
    nav: ['Today', 'Targets', 'Focus', 'Calendar', 'Review', 'More'],
    metrics: [['Execution', '63%'], ['Open loops', '3'], ['Next block', '45m']],
    heroTitle: 'Ship the next block.',
    heroBody: 'A tighter command surface for founders, students, and builders. Metrics become operational signals, not decorative cards.',
    insight: 'Risk: too intense for casual SaaS users unless chosen as a mode.',
    actions: ['Start focus block', 'Close one loop', 'Schedule deep work'],
    railTitle: 'Trajectory',
    railValue: 'On pace',
    timeline: ['08', '10', '12', '14', '16', '18', '20'],
  },
  {
    id: 'calendar',
    title: '03. Calendar First',
    badge: 'Planning',
    thesis: 'Best when calendar becomes the backbone and widgets orbit the day plan.',
    className: 'today-proto--calendar',
    nav: ['Today', 'Calendar', 'Tasks', 'Notes', 'Review'],
    metrics: [['Events', '0'], ['Free time', '6h'], ['Priority', '1']],
    heroTitle: 'Your day is mostly open.',
    heroBody: 'This layout makes time the primary object. Insights become annotations on the schedule, not a separate dashboard pile.',
    insight: 'Strong for professionals. Weaker for users without connected calendar data.',
    actions: ['Add time block', 'Plan priority', 'Quick note'],
    railTitle: 'Brief',
    railValue: 'Low friction day',
    timeline: ['Morning', 'Midday', 'Afternoon', 'Evening'],
  },
  {
    id: 'coach',
    title: '04. Coach Card',
    badge: 'Friendly',
    thesis: 'Guided SaaS onboarding: fewer numbers, more interpretation and next step.',
    className: 'today-proto--coach',
    nav: ['Today', 'Habits', 'Goals', 'Coach', 'Journal'],
    metrics: [['Readiness', '42'], ['Streak risk', '2'], ['Mood logs', '0']],
    heroTitle: 'Start small today.',
    heroBody: 'A coach-led layout that translates data into plain language. It reduces intimidation for new users.',
    insight: 'Best for consumer SaaS. Needs trust-building copy and clear data sources.',
    actions: ['Choose one habit', 'Write mood note', 'Set evening check-in'],
    railTitle: 'Coach signal',
    railValue: 'Low data week',
    timeline: ['Habit', 'Mood', 'Money', 'Focus'],
  },
  {
    id: 'modular',
    title: '05. Modular OS',
    badge: 'Scalable',
    thesis: 'A durable grid for SaaS: modules are grouped into Today, Target, Review, Capture.',
    className: 'today-proto--modular',
    nav: ['Today', 'Target', 'Review', 'Capture', 'Settings'],
    metrics: [['Today', '3'], ['Target', '21d'], ['Review', 'Sat']],
    heroTitle: 'Four modules, one page.',
    heroBody: 'Instead of letting every feature compete, each card belongs to a named job. This scales as product modules grow.',
    insight: 'Safest long-term architecture. Slightly less emotionally memorable.',
    actions: ['Today plan', 'Target progress', 'Weekly review', 'Quick capture'],
    railTitle: 'System health',
    railValue: 'Stable',
    timeline: ['Today', 'Target', 'Review', 'Capture'],
  },
  {
    id: 'minimal',
    title: '06. Minimal Ledger',
    badge: 'Quiet',
    thesis: 'Most restrained option: almost no cards, strong typography, summary plus list.',
    className: 'today-proto--minimal',
    nav: ['Today', 'Log', 'Review', 'Settings'],
    metrics: [['Day', 'Jul 4'], ['Week', '27'], ['Target', '21d']],
    heroTitle: 'One page. No noise.',
    heroBody: 'For users who hate dashboards. The product feels like a daily ledger with smart summaries instead of widget panels.',
    insight: 'Beautiful if executed well, but may hide too much product value for first-time SaaS users.',
    actions: ['One priority', 'One log', 'One review'],
    railTitle: 'Current signal',
    railValue: 'Quiet week',
    timeline: ['Priority', 'Log', 'Reflect'],
  },
];

function PrototypePreview({ proto }) {
  return (
    <article className={`today-proto ${proto.className}`}>
      <div className="today-proto__browser">
        <div className="today-proto__nav">
          <strong>AIIMIN</strong>
          <div>
            {proto.nav.map((item) => <span key={item}>{item}</span>)}
          </div>
          <CircleDot size={16} />
        </div>

        <div className="today-proto__metrics">
          {proto.metrics.map(([label, value]) => (
            <div key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>

        <main className="today-proto__page">
          <section className="today-proto__hero">
            <div className="today-proto__eyebrow"><Sparkles size={13} /> Today brief</div>
            <h3>{proto.heroTitle}</h3>
            <p>{proto.heroBody}</p>
            <div className="today-proto__insight">{proto.insight}</div>
          </section>

          <aside className="today-proto__rail">
            <span>{proto.railTitle}</span>
            <strong>{proto.railValue}</strong>
            <div className="today-proto__arc" />
          </aside>

          <section className="today-proto__actions">
            <div className="today-proto__section-title"><ListChecks size={14} /> Action stack</div>
            {proto.actions.map((action, index) => (
              <div key={action} className="today-proto__action">
                <span>{index + 1}</span>
                <p>{action}</p>
              </div>
            ))}
          </section>

          <section className="today-proto__timeline">
            <div className="today-proto__section-title"><CalendarDays size={14} /> Timeline</div>
            <div>
              {proto.timeline.map((item, index) => (
                <span key={item} className={index === proto.timeline.length - 2 ? 'is-active' : ''}>{item}</span>
              ))}
            </div>
          </section>
        </main>
      </div>
    </article>
  );
}

export default function TodayPagePrototypesPanel() {
  return (
    <div className="design-lab__panel today-prototypes-panel">
      <LabCard
        title="Today page redesign directions"
        desc="Six full-page prototypes for turning the personal dashboard into a SaaS-ready Today surface. Compare hierarchy, grid, density, and motion potential before production work."
        badge="Decision needed"
        badgeVariant="proposed"
      >
        <div className="today-proto-strategy">
          {[
            [Compass, 'Decision frame', 'Pick the default mental model first: brief, console, calendar, coach, modular OS, or ledger.'],
            [Layers3, 'No duplication rule', 'Every datum gets one owner: status strip, insight, action, target, or timeline.'],
            [TimerReset, 'Motion rule', 'One entrance choreography, layout transitions on module changes, and hover feedback only where it clarifies action.'],
            [ScanLine, 'SaaS rule', 'Placement-specific ideas become configurable targets, not global product language.'],
          ].map(([Icon, title, body]) => (
            <div key={title}>
              <Icon size={18} />
              <strong>{title}</strong>
              <p>{body}</p>
            </div>
          ))}
        </div>
      </LabCard>

      <div className="today-proto-grid">
        {PROTOTYPES.map((proto) => (
          <LabCard
            key={proto.id}
            title={proto.title}
            desc={proto.thesis}
            badge={proto.badge}
            badgeVariant={proto.badge === 'Recommended' ? 'proposed' : 'current'}
          >
            <PrototypePreview proto={proto} />
          </LabCard>
        ))}
      </div>

      <LabCard
        title="My recommendation"
        desc="Start from Briefing Desk, borrow the Active Target treatment from Operator Console, and use Modular OS as the implementation architecture."
        badge="Verdict"
        badgeVariant="proposed"
      >
        <div className="today-proto-verdict">
          <div>
            <Flame size={18} />
            <strong>Ship direction</strong>
            <p>Briefing Desk should become the default SaaS Today page because it gives the user one brief, one action stack, and one context rail without hiding the product.</p>
          </div>
          <div>
            <Target size={18} />
            <strong>What to preserve</strong>
            <p>Keep the execution-window idea, but turn it into a configurable Active Target. That honors your original placement workflow while making the product usable for everyone.</p>
          </div>
        </div>
      </LabCard>
    </div>
  );
}
