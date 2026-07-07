import React, { useMemo, useState } from 'react';
import { curveNatural } from '@visx/curve';
import { motion, AnimatePresence } from 'framer-motion';
import { LabCard } from './PrototypePrimitives';
import { shouldShip } from '../../../../utils/designVoteShip';
import ApprovalVote, { useDesignVotes } from './ApprovalVote';
import PrototypeErrorBoundary from './PrototypeErrorBoundary';
import { buildHeatmapDemoData, buildXpSeries } from './chartDemoData';

/* Bklit charts */
import { AreaChart, Area } from '../../../../components/charts/area-chart';
import { LineChart } from '../../../../components/charts/line-chart';
import { Line } from '../../../../components/charts/line';
import { Grid } from '../../../../components/charts/grid';
import { XAxis } from '../../../../components/charts/x-axis';
import AreaChartLoading from '../../../../components/charts/area-chart-loading';
import LineChartLoading from '../../../../components/charts/line-chart-loading';
import { HeatmapChart } from '../../../../components/charts/heatmap/heatmap-chart';
import { HeatmapCells } from '../../../../components/charts/heatmap/heatmap-cells';
import { HeatmapXAxis } from '../../../../components/charts/heatmap/heatmap-x-axis';
import { HeatmapYAxis } from '../../../../components/charts/heatmap/heatmap-y-axis';
import HeatmapChartLoading from '../../../../components/charts/heatmap/heatmap-chart-loading';
import { ShimmeringText } from '../../../../components/shimmering-text';

/* Kokonut — buttons */
import GradientButton from '../../../../components/kokonutui/gradient-button';
import V0Button from '../../../../components/kokonutui/v0-button';
import ParticleButton from '../../../../components/kokonutui/particle-button';
import HoldButton from '../../../../components/kokonutui/hold-button';
import SocialButton from '../../../../components/kokonutui/social-button';
import CommandButton from '../../../../components/kokonutui/command-button';
import SwitchButton from '../../../../components/kokonutui/switch-button';
import SlideTextButton from '../../../../components/kokonutui/slide-text-button';

/* Kokonut — text */
import ScrollText from '../../../../components/kokonutui/scroll-text';
import ShimmerText from '../../../../components/kokonutui/shimmer-text';
import DynamicText from '../../../../components/kokonutui/dynamic-text';
import MatrixText from '../../../../components/kokonutui/matrix-text';
import GlitchText from '../../../../components/kokonutui/glitch-text';
import SlicedText from '../../../../components/kokonutui/sliced-text';
import SwooshText from '../../../../components/kokonutui/swoosh-text';

/* Kokonut — backgrounds */
import BeamsBackground from '../../../../components/kokonutui/beams-background';
import BackgroundPaths from '../../../../components/kokonutui/background-paths';
import FlowField from '../../../../components/kokonutui/flow-field';

/* Kokonut — cards */
import CardFlip from '../../../../components/kokonutui/card-flip';
import AppleActivityCard from '../../../../components/kokonutui/apple-activity-card';
import MouseEffectCard from '../../../../components/kokonutui/mouse-effect-card';
import SpotlightCards from '../../../../components/kokonutui/spotlight-cards';
import CurrencyTransfer from '../../../../components/kokonutui/currency-transfer';
import CarouselCards from '../../../../components/kokonutui/carousel-cards';
import BentoGrid from '../../../../components/kokonutui/bento-grid';

/* Kokonut — nav */
import MorphicNavbar from '../../../../components/kokonutui/morphic-navbar';
import Toolbar from '../../../../components/kokonutui/toolbar';
import SmoothTab from '../../../../components/kokonutui/smooth-tab';
import ProfileDropdown from '../../../../components/kokonutui/profile-dropdown';
import ActionSearchBar from '../../../../components/kokonutui/action-search-bar';
import SmoothDrawer from '../../../../components/kokonutui/smooth-drawer';

/* Kokonut — inputs */
import FileUpload from '../../../../components/kokonutui/file-upload';
import AvatarPicker from '../../../../components/kokonutui/avatar-picker';
import TeamSelector from '../../../../components/kokonutui/team-selector';
import Loader from '../../../../components/kokonutui/loader';

/* Kokonut — AI */
import AiInputSearch from '../../../../components/kokonutui/ai-input-search';
import AiTextLoading from '../../../../components/kokonutui/ai-text-loading';
import AiVoice from '../../../../components/kokonutui/ai-voice';

const SECTIONS = [
  { id: 'charts', label: 'Bklit charts' },
  { id: 'kokonut', label: 'Kokonut UI' },
  { id: 'motion', label: 'Free motion' },
];

const SKIPPED = [
  'magnet-button', 'typing-text', 'shapes-hero', 'stack', 'liquid-glass',
  'x-card', 'ai-input-selector', 'ai-state-loading',
  'bar / pie / radar / sankey / funnel charts (not installed)',
];

function DemoShell({ id, title, use, note, votes, setVote, children, tall }) {
  const shipped = shouldShip(id);
  return (
    <div className={`ui-lab-demo ${tall ? 'ui-lab-demo--tall' : ''} ${shipped ? 'ui-lab-demo--shipped' : ''}`}>
      <div className="ui-lab-demo__head">
        <div>
          <h4 className="ui-lab-demo__title">
            {title}
            {shipped && <span className="ui-lab-demo__shipped">Shipped</span>}
          </h4>
          <p className="ui-lab-demo__use">{use}</p>
          {note && <p className="ui-lab-demo__note">{note}</p>}
        </div>
        <ApprovalVote id={id} label={title} votes={votes} setVote={setVote} />
      </div>
      <PrototypeErrorBoundary name={title}>
        <div className="ui-lab-demo__stage">{children}</div>
      </PrototypeErrorBoundary>
    </div>
  );
}

function ChartsSection({ votes, setVote }) {
  const series = useMemo(() => buildXpSeries(14), []);
  const heatmap = useMemo(() => buildHeatmapDemoData(20), []);

  return (
    <>
      <LabCard
        title="Bklit chart library"
        desc="Installed: area, line, heatmap + shimmering text. Other Bklit types skipped — install on demand."
        badge="Charts"
        badgeVariant="proposed"
      >
        <p style={{ padding: '0 18px 14px', margin: 0, fontSize: 12, color: 'var(--color-text-2)', lineHeight: 1.6 }}>
          AIIMIN fits: sleep/XP trends (area), focus minutes (line), yearly habit grid (heatmap), loading skeletons on slow API.
        </p>
      </LabCard>

      <div className="ui-lab-grid">
        <DemoShell id="chart-area-live" title="Area chart — live" use="Sleep hours, XP velocity, SIP corpus" votes={votes} setVote={setVote}>
          <AreaChart data={series} xDataKey="date" status="ready" margin={{ top: 24, right: 16, bottom: 32, left: 48 }}>
            <Grid horizontal />
            <XAxis />
            <Area dataKey="xp" curve={curveNatural} fill="var(--color-accent)" fillOpacity={0.18} stroke="var(--color-accent)" strokeWidth={2} />
          </AreaChart>
        </DemoShell>

        <DemoShell id="chart-line-live" title="Line chart — dual series" use="Focus vs learning minutes" votes={votes} setVote={setVote}>
          <LineChart data={series} xDataKey="date" status="ready" margin={{ top: 24, right: 16, bottom: 32, left: 48 }}>
            <Grid horizontal />
            <XAxis />
            <Line dataKey="xp" curve={curveNatural} stroke="var(--color-accent)" strokeWidth={2.5} />
            <Line dataKey="focus" curve={curveNatural} stroke="#10b981" strokeWidth={2} strokeDasharray="6 4" />
          </LineChart>
        </DemoShell>

        <DemoShell id="chart-area-loading-pulse" title="Area loading — pulse" use="Dashboard skeleton while logs fetch" votes={votes} setVote={setVote}>
          <AreaChartLoading loadingStyle="pulse" label="Syncing metrics…" />
        </DemoShell>

        <DemoShell id="chart-line-loading-sweep" title="Line loading — sweep" use="Finance / reports placeholder" votes={votes} setVote={setVote}>
          <LineChartLoading loadingStyle="sweep" label="Loading chart…" />
        </DemoShell>

        <DemoShell id="chart-heatmap-live" title="Heatmap — contribution grid" use="Yearly heatmap, gym streaks, DSA days" votes={votes} setVote={setVote} tall>
          <div style={{ maxWidth: 720 }}>
            <HeatmapChart data={heatmap} status="ready" gap={3} margin={{ top: 8, right: 8, bottom: 0, left: 36 }}>
              <HeatmapCells cornerRadius={2} />
              <HeatmapXAxis />
              <HeatmapYAxis />
            </HeatmapChart>
          </div>
        </DemoShell>

        <DemoShell id="chart-heatmap-loading" title="Heatmap loading" use="Heatmap before daily_logs load" votes={votes} setVote={setVote}>
          <HeatmapChartLoading data={heatmap} label="Building grid…" />
        </DemoShell>

        <DemoShell id="chart-shimmering-text" title="Bklit shimmering text" use="Chart loading label, rank-up teaser" votes={votes} setVote={setVote}>
          <ShimmeringText text="Grandmaster incoming" className="text-2xl font-bold" />
        </DemoShell>
      </div>
    </>
  );
}

function KokonutSection({ votes, setVote }) {
  const [tab, setTab] = useState('buttons');

  const groups = [
    { id: 'buttons', label: 'Buttons' },
    { id: 'text', label: 'Text FX' },
    { id: 'backgrounds', label: 'Backgrounds' },
    { id: 'cards', label: 'Cards' },
    { id: 'nav', label: 'Nav & search' },
    { id: 'inputs', label: 'Inputs' },
    { id: 'ai', label: 'AI chrome' },
  ];

  return (
    <>
      <LabCard title="Kokonut UI" desc="45 components installed. Next.js deps shimmed for CRA. Vote approve / maybe / skip." badge="Components" badgeVariant="proposed">
        <div style={{ padding: '0 18px 14px' }}>
          <p style={{ margin: '0 0 10px', fontSize: 12, color: 'var(--color-text-2)' }}>
            Skipped (not in registry or install failed): {SKIPPED.join(', ')}.
          </p>
          <nav className="ui-lab-subtabs">
            {groups.map((g) => (
              <button key={g.id} type="button" className={`ui-lab-subtab ${tab === g.id ? 'is-active' : ''}`} onClick={() => setTab(g.id)}>
                {g.label}
              </button>
            ))}
          </nav>
        </div>
      </LabCard>

      {tab === 'buttons' && (
        <div className="ui-lab-grid ui-lab-grid--compact">
          {[
            { id: 'k-gradient-btn', title: 'Gradient button', use: 'Primary CTA — waitlist, save', C: GradientButton, props: { label: 'Start tracking', variant: 'orange' } },
            { id: 'k-particle-btn', title: 'Particle button', use: 'Quest complete, level-up confirm', C: ParticleButton, props: { children: 'Claim XP' } },
            { id: 'k-v0-btn', title: 'V0 button', use: 'Secondary actions', C: V0Button, props: { children: 'Open studio' } },
            { id: 'k-hold-btn', title: 'Hold button', use: 'Destructive confirm (delete log)', C: HoldButton, props: { children: 'Hold to reset streak' } },
            { id: 'k-social-btn', title: 'Social button', use: 'Google OAuth row', C: SocialButton, props: {} },
            { id: 'k-cmd-btn', title: 'Command button', use: '⌘K quick capture', C: CommandButton, props: {} },
            { id: 'k-switch-btn', title: 'Switch button', use: 'Theme toggle (wired to AIIMIN theme)', C: SwitchButton, props: {} },
            { id: 'k-slide-btn', title: 'Slide text button', use: 'Hover-reveal CTA', C: SlideTextButton, props: { text: 'Save day', hoverText: 'Saved ✓' } },
          ].map(({ id, title, use, C, props }) => (
            <DemoShell key={id} id={id} title={title} use={use} votes={votes} setVote={setVote}>
              <div className="ui-lab-center"><C {...props} /></div>
            </DemoShell>
          ))}
        </div>
      )}

      {tab === 'text' && (
        <div className="ui-lab-grid">
          <DemoShell id="k-scroll-text" title="Scroll text" use="Landing hero, waitlist headline" votes={votes} setVote={setVote}>
            <ScrollText text="Track. Improve. Repeat." />
          </DemoShell>
          <DemoShell id="k-shimmer-text" title="Shimmer text" use="Rank name, section headers" votes={votes} setVote={setVote}>
            <ShimmerText text="AIIMIN" />
          </DemoShell>
          <DemoShell id="k-dynamic-text" title="Dynamic text" use="Rotating quest hints" votes={votes} setVote={setVote}>
            <DynamicText />
          </DemoShell>
          <DemoShell id="k-matrix-text" title="Matrix text" use="Easter egg / loading" votes={votes} setVote={setVote}>
            <MatrixText />
          </DemoShell>
          <DemoShell id="k-glitch-text" title="Glitch text" use="Achievement unlock flash" votes={votes} setVote={setVote}>
            <GlitchText text="LEVEL UP" />
          </DemoShell>
          <DemoShell id="k-sliced-text" title="Sliced text" use="Editorial hero accent" votes={votes} setVote={setVote}>
            <SlicedText text="Day Control" />
          </DemoShell>
          <DemoShell id="k-swoosh-text" title="Swoosh text" use="Navbar wordmark motion" votes={votes} setVote={setVote}>
            <SwooshText text="AIIMIN" />
          </DemoShell>
        </div>
      )}

      {tab === 'backgrounds' && (
        <div className="ui-lab-grid">
          <DemoShell id="k-beams" title="Beams background" use="Waitlist landing, login" votes={votes} setVote={setVote} tall>
            <div className="ui-lab-clip"><BeamsBackground /></div>
          </DemoShell>
          <DemoShell id="k-paths" title="Background paths" use="Empty state, 404" votes={votes} setVote={setVote} tall>
            <div className="ui-lab-clip"><BackgroundPaths /></div>
          </DemoShell>
          <DemoShell id="k-flow" title="Flow field" use="Focus mode backdrop" votes={votes} setVote={setVote} tall>
            <div className="ui-lab-clip"><FlowField /></div>
          </DemoShell>
        </div>
      )}

      {tab === 'cards' && (
        <div className="ui-lab-grid">
          <DemoShell id="k-card-flip" title="Card flip" use="Habit detail / quest card" votes={votes} setVote={setVote}>
            <CardFlip title="Morning stack" subtitle="3 habits" description="Gym · Journal · Steps" />
          </DemoShell>
          <DemoShell id="k-activity" title="Apple activity rings" use="Daily completion rings" votes={votes} setVote={setVote}>
            <AppleActivityCard />
          </DemoShell>
          <DemoShell id="k-mouse-card" title="Mouse effect card" use="Finance summary hover" votes={votes} setVote={setVote}>
            <MouseEffectCard title="Net worth" description="Hover for glow" />
          </DemoShell>
          <DemoShell id="k-spotlight" title="Spotlight cards" use="Feature highlights" votes={votes} setVote={setVote} tall>
            <SpotlightCards />
          </DemoShell>
          <DemoShell id="k-currency" title="Currency transfer" use="Money manager animation" votes={votes} setVote={setVote}>
            <CurrencyTransfer />
          </DemoShell>
          <DemoShell id="k-carousel" title="Carousel cards" use="Weekly wins carousel" votes={votes} setVote={setVote} tall>
            <CarouselCards />
          </DemoShell>
          <DemoShell id="k-bento" title="Bento grid" use="Waitlist / marketing layout" votes={votes} setVote={setVote} tall note="Marketing-scale block — don’t drop full-bleed into dashboard cards.">
            <div className="ui-lab-scale"><BentoGrid /></div>
          </DemoShell>
        </div>
      )}

      {tab === 'nav' && (
        <div className="ui-lab-stack">
          <DemoShell id="k-morphic-nav" title="Morphic navbar" use="Alternative masthead concept" votes={votes} setVote={setVote}>
            <MorphicNavbar />
          </DemoShell>
          <DemoShell id="k-toolbar" title="Floating toolbar" use="Mobile quick actions" votes={votes} setVote={setVote}>
            <Toolbar />
          </DemoShell>
          <DemoShell id="k-smooth-tab" title="Smooth tab" use="Finance / habits sub-nav" votes={votes} setVote={setVote}>
            <SmoothTab />
          </DemoShell>
          <DemoShell id="k-profile-dd" title="Profile dropdown" use="Account menu variant" votes={votes} setVote={setVote}>
            <div className="ui-lab-center"><ProfileDropdown /></div>
          </DemoShell>
          <DemoShell id="k-search" title="Action search bar" use="⌘K global search" votes={votes} setVote={setVote}>
            <ActionSearchBar />
          </DemoShell>
          <DemoShell id="k-drawer" title="Smooth drawer" use="Mobile filters / settings" votes={votes} setVote={setVote}>
            <SmoothDrawer />
          </DemoShell>
        </div>
      )}

      {tab === 'inputs' && (
        <div className="ui-lab-grid">
          <DemoShell id="k-upload" title="File upload" use="Excel import, family vault" votes={votes} setVote={setVote}>
            <FileUpload />
          </DemoShell>
          <DemoShell id="k-avatar" title="Avatar picker" use="Account settings" votes={votes} setVote={setVote}>
            <AvatarPicker />
          </DemoShell>
          <DemoShell id="k-team" title="Team selector" use="Tester groups (future)" votes={votes} setVote={setVote}>
            <TeamSelector />
          </DemoShell>
          <DemoShell id="k-loader" title="Loader" use="Auth callback, save states" votes={votes} setVote={setVote}>
            <Loader title="Saving your day…" subtitle="XP and streaks updating" size="md" />
          </DemoShell>
        </div>
      )}

      {tab === 'ai' && (
        <div className="ui-lab-grid">
          <DemoShell id="k-ai-search" title="AI input search" use="Journal / insight prompt" votes={votes} setVote={setVote}>
            <AiInputSearch />
          </DemoShell>
          <DemoShell id="k-ai-text-load" title="AI text loading" use="Insight engine placeholder" votes={votes} setVote={setVote}>
            <AiTextLoading />
          </DemoShell>
          <DemoShell id="k-ai-voice" title="AI voice" use="Voice journal (experimental)" votes={votes} setVote={setVote} note="May request mic permission.">
            <AiVoice />
          </DemoShell>
        </div>
      )}
    </>
  );
}

const STAGGER = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const ITEM = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 380, damping: 28 } },
};

function MotionSection({ votes, setVote }) {
  const [expanded, setExpanded] = useState(false);
  const [activeCard, setActiveCard] = useState(null);

  return (
    <>
      <LabCard
        title="Free motion (framer-motion)"
        desc="No Motion+ token needed. Use for dashboard micro-interactions — keep intensity low on data-heavy views."
        badge="Motion"
        badgeVariant="proposed"
      />

      <div className="ui-lab-grid">
        <DemoShell id="motion-stagger" title="Stagger reveal" use="Dashboard section mount" votes={votes} setVote={setVote}>
          <motion.ul className="ui-lab-stagger-list" variants={STAGGER} initial="hidden" animate="show">
            {['Sleep', 'Gym', 'Focus', 'Spend'].map((label) => (
              <motion.li key={label} variants={ITEM} className="ui-lab-stagger-item">{label}</motion.li>
            ))}
          </motion.ul>
        </DemoShell>

        <DemoShell id="motion-hover-lift" title="Hover lift card" use="Stat cards, habit tiles" votes={votes} setVote={setVote}>
          <motion.div className="ui-lab-hover-card" whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(0,0,0,0.12)' }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}>
            <span className="ui-lab-hover-card__label">Clean streak</span>
            <span className="ui-lab-hover-card__value">22 days</span>
          </motion.div>
        </DemoShell>

        <DemoShell id="motion-layout" title="Layout expand" use="Accordion sections, mobile panels" votes={votes} setVote={setVote}>
          <button type="button" className="ui-lab-expand-btn" onClick={() => setExpanded((v) => !v)}>
            {expanded ? 'Collapse' : 'Expand'} details
          </button>
          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                key="body"
                className="ui-lab-expand-body"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
              >
                Sleep debt −1.2h · Gym done · 8.4k steps
              </motion.div>
            )}
          </AnimatePresence>
        </DemoShell>

        <DemoShell id="motion-spring-number" title="Spring counter" use="XP gain, money totals" votes={votes} setVote={setVote}>
          <motion.span
            className="ui-lab-spring-num"
            key={activeCard}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 18 }}
            onClick={() => setActiveCard((n) => (n ?? 120) + 15)}
            style={{ cursor: 'pointer' }}
            title="Click to bump"
          >
            +{(activeCard ?? 120)} XP
          </motion.span>
        </DemoShell>

        <DemoShell id="motion-progress" title="Progress tween" use="Goal bars, XP to next rank" votes={votes} setVote={setVote}>
          <div className="ui-lab-progress-track">
            <motion.div
              className="ui-lab-progress-fill"
              initial={{ width: 0 }}
              animate={{ width: '72%' }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </DemoShell>

        <DemoShell id="motion-page-fade" title="Page fade" use="Tab switch, modal enter" votes={votes} setVote={setVote}>
          <motion.div
            className="ui-lab-fade-panel"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            Overview content fades in — no bounce on data pages.
          </motion.div>
        </DemoShell>
      </div>
    </>
  );
}

export default function UILibraryPanel() {
  const [section, setSection] = useState('charts');
  const { votes, setVote, approved, skipped, total } = useDesignVotes();

  return (
    <div className="design-lab__panel ui-lab">
      <LabCard
        title="UI Library showcase"
        desc="Every installed Bklit chart, Kokonut block, and free framer-motion pattern. Approve / Maybe / Skip — votes persist in this browser."
        badge={`${approved} approved · ${skipped} skipped`}
        badgeVariant="current"
      >
        <div style={{ padding: '12px 18px 16px' }}>
          <p style={{ margin: '0 0 12px', fontSize: 12, color: 'var(--color-text-2)', lineHeight: 1.6 }}>
            Taste skills (enable in Cursor before approving): design-taste-frontend, animation-vocabulary, emil-design-eng.
            Motion+ AI Kit is paid — use framer-motion only.
          </p>
          <nav className="ui-lab-subtabs">
            {SECTIONS.map((s) => (
              <button key={s.id} type="button" className={`ui-lab-subtab ${section === s.id ? 'is-active' : ''}`} onClick={() => setSection(s.id)}>
                {s.label}
              </button>
            ))}
          </nav>
          {total > 0 && (
            <p style={{ margin: '12px 0 0', fontSize: 11, color: 'var(--color-text-3)' }}>
              {total} votes recorded in this browser.
            </p>
          )}
        </div>
      </LabCard>

      {section === 'charts' && <ChartsSection votes={votes} setVote={setVote} />}
      {section === 'kokonut' && <KokonutSection votes={votes} setVote={setVote} />}
      {section === 'motion' && <MotionSection votes={votes} setVote={setVote} />}
    </div>
  );
}
