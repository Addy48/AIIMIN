
# AIIMIN P8 — Interaction Layer Pre-Design Study

**Type:** Architectural design research (not specification)  
**Status:** Research complete — precedes Chapters 09–12 authoring  
**Date:** 2026-07-22  
**Constraint:** Frozen P8 Chapters 01–08 are law. This document informs — does not override — identity, philosophy, capture, AI, surfaces, navigation, or objects.

---

## Why this exists

Chapters 09–12 define how AIIMIN *feels*. Average interaction architecture produces average products regardless of backend quality. This study extracts timeless interaction principles from exemplary systems, names their failure modes, and maps where AIIMIN must diverge because it is a **Personal Life OS under cognitive load** — not a task manager, not a chatbot, not a dashboard.

---

## Method

Twenty reference systems were analyzed across twelve dimensions: interaction philosophy, editing, navigation, density, motion, cognitive load, discoverability, expert workflows, beginner workflows, keyboard, touch, failure recovery, and delight. Products were chosen for paradigm diversity — platform guidelines, calm personal software, builder tools, command surfaces, and AI-native interfaces.

Principles were extracted, not copied. AIIMIN already owns capture-first ceremony-free save, mixed-initiative AI, connected graph memory, and an emotional contract (relief after capture, clarity after review, agency after coaching). Recommendations below must serve those frozen commitments.

---

## Comparative analysis

### Platform foundations

#### Apple Human Interface Guidelines

**Interaction philosophy.** Direct manipulation, physical metaphor where honest, deference to content. The interface recedes; the user's material is foreground.

**Editing.** Inline where possible; modal only when scope is narrow and stakes are clear. System provides undo at OS level; apps inherit recovery expectations.

**Navigation.** Hierarchical with clear back affordance. Tab bars for peer sections. Deep links respect stack.

**Density.** Generous whitespace on phone; progressive disclosure on compact widths.

**Motion.** Purposeful, tied to spatial model. Transitions explain where you came from.

**Cognitive load.** One primary task per screen. Settings are secondary real estate.

**Discoverability.** Affordances visible; power features often hidden behind long-press or share sheet.

**Expert vs beginner.** Beginners succeed with defaults; experts gain Shortcuts, gestures, hardware keys.

**Keyboard / touch.** Touch-first on iOS; pointer precision on Mac. Platform wins.

**Failure recovery.** Alerts sparingly; destructive actions require explicit confirm.

**Delight.** Haptics, subtle feedback, craftsmanship in transitions — never at expense of speed.

**Lesson for AIIMIN.** Platform vernacular is non-negotiable on native. AIIMIN must not fight system back, share sheets, or biometrics. Calm deference to life content — not chrome — aligns with review-mode surfaces.

---

#### Material Design 3

**Interaction philosophy.** Adaptive components with semantic roles. Motion expresses hierarchy and state. Personalization through dynamic color while preserving role meaning.

**Editing.** Text fields, chips, menus — componentized patterns with consistent state layers.

**Navigation.** Navigation bar, rail, drawer — tiered by width. Predictable component behavior across apps.

**Density.** Compact / comfortable / spacious modes — density as first-class.

**Motion.** Shared axis transitions; emphasis on continuity and elevation.

**Cognitive load.** Component library reduces one-off decisions; risk of sameness across products.

**Discoverability.** FAB and extended FAB — strong affordance for primary creation.

**Expert vs beginner.** Beginners learn Material once; experts still hunt for app-specific shortcuts.

**Keyboard / touch.** Touch-optimized targets; desktop secondary in many Google apps.

**Failure recovery.** Snackbars for undo; dialogs for destructive.

**Delight.** Ripple, elevation, shape — can become decorative noise if over-applied.

**Lesson for AIIMIN.** Native Android must map AIIMIN token *meaning* onto M3 roles without becoming a cousin brand. Density modes (capture vs command vs review) are validated by M3's adaptive density — but AIIMIN's modes are **cognitive**, not just breakpoint-driven.

---

### Calm personal software

#### Things 3

**Interaction philosophy.** Calm confidence. The product assumes you are overwhelmed; it whispers.

**Editing.** Lightweight item edit; projects and areas as gentle structure. No database theater.

**Navigation.** Inbox → Today → Upcoming → Anytime → Someday → Logbook. Predictable temporal mental model.

**Density.** Low. Generous spacing. One list breathes.

**Motion.** Subtle, almost invisible. List moves feel physical.

**Cognitive load.** Ruthlessly low. No gamification. No analytics guilt.

**Discoverability.** Obvious for core loop; power features (headings, checklists) discovered slowly.

**Expert vs beginner.** Same UI for both — mastery is organizational habit, not shortcut memorization.

**Keyboard.** Mac app respects arrows and return; not a keyboard product.

**Touch.** Large targets; swipe to complete is iconic.

**Failure recovery.** Undo toast on delete. Gentle.

**Delight.** Completion sound and animation — proportional, not casino.

**Lesson for AIIMIN.** Today/review surfaces should feel like Things, not like Jira. Temporal clarity without punishing empty states.

---

#### Bear

**Interaction philosophy.** Writing is the app. Tags replace folders. Beauty serves focus.

**Editing.** Markdown-native, inline. Formatting stays out of the way until invoked.

**Navigation.** Sidebar tags + notes list. Shallow hierarchy.

**Density.** Medium-low. Typography carries mood.

**Motion.** Minimal. Editor is king.

**Cognitive load.** Low entry — open and type. Tag discovery is the main conceptual hurdle.

**Discoverability.** Markdown shortcuts and tag conventions are semi-hidden curriculum.

**Expert vs beginner.** Beginners type plain text; experts build tag taxonomies.

**Keyboard.** Strong on Mac — formatting shortcuts matter.

**Touch.** iOS editor is good but not keyboard-competitive.

**Failure recovery.** Version history / sync conflict handling — trust issue when wrong.

**Delight.** Themes, typography — aesthetic pleasure as retention.

**Lesson for AIIMIN.** Journal/Knowledge capture benefits from Bear's "typing is enough" — but AIIMIN must structure without forcing taxonomy first (frozen capture law).

---

#### Craft

**Interaction philosophy.** Documents as beautiful objects. Block structure with publishing polish.

**Editing.** Block-based, WYSIWYG, pleasant micro-interactions on blocks.

**Navigation.** Space → folder → doc. Visual browse.

**Density.** Medium. White space as luxury signal.

**Motion.** Block insert, page transitions — crafted, slightly slow.

**Cognitive load.** Higher than Bear — structure choices appear early.

**Discoverability.** Slash commands and block menu — learned interface.

**Expert vs beginner.** Beginners make pretty notes quickly; experts hit block limits and export needs.

**Keyboard.** Decent shortcuts; still pointer-forward.

**Touch.** iPad-first energy; phone secondary.

**Failure recovery.** Sync and export anxiety in user reviews — beauty doesn't forgive data loss.

**Delight.** Typography, covers, share links — emotional ownership of documents.

**Lesson for AIIMIN.** Craft proves people want *pride* in their life record — but AIIMIN's delight must come from relief and clarity, not from decorative document chrome.

---

#### Fantastical

**Interaction philosophy.** Natural language as input layer. Calendar should understand human phrases.

**Editing.** Sentence parsing for events; inline edit of parsed fields.

**Navigation.** Calendar views (day/week/month/year) — spatial time.

**Density.** High information in month view; cleaner in day view.

**Motion.** View transitions orient in time.

**Cognitive load.** Low for scheduling if NLP works; spikes when parse wrong.

**Discoverability.** Parser is the magic — invisible until you try.

**Expert vs beginner.** Beginners type "lunch with Sam Friday"; experts use chips to correct parse.

**Keyboard.** Mac app strong; iOS relies on typing + taps.

**Touch.** Drag to reschedule — direct manipulation of time blocks.

**Failure recovery.** Chip correction for misparsed fields — **infer then correct**, not interrogate first.

**Delight.** Weather, travel time, icons — helpful context without nagging.

**Lesson for AIIMIN.** Fantastical is the best reference for **structured inference with inline chips** on life data. Directly aligns with frozen AIIMIN correction model — but calendar is narrow domain; AIIMIN is whole-life.

---

### Graph and knowledge tools

#### Obsidian

**Interaction philosophy.** Your files, your graph. Local-first trust. Links create meaning.

**Editing.** Markdown source with optional WYSIWYG. Power users live in links and plugins.

**Navigation.** File explorer, backlinks, graph view, quick switcher.

**Density.** User-controlled via CSS — from minimal to dashboard chaos.

**Motion.** Minimal in core; plugin-dependent.

**Cognitive load.** **High** for beginners. Vault setup, linking syntax, plugin maze.

**Discoverability.** Poor for novices; excellent for experts who invest.

**Expert vs beginner.** Bimodal — beginners bounce; experts never leave.

**Keyboard.** Command palette, hotkeys — essential for fluency.

**Touch.** Mobile capture exists; serious work is desktop.

**Failure recovery.** Git sync, file system — user owns recovery.

**Delight.** Graph reveal, custom themes — mastery rewards.

**Lesson for AIIMIN.** Graph memory is AIIMIN's backend truth — but Obsidian proves **graph UI is not capture UI**. Connection should emerge in review, not gate ingress.

---

#### Notion

**Interaction philosophy.** Blocks + databases = infinite flexibility. Workspace as OS.

**Editing.** Slash commands, inline blocks, relational databases, templates.

**Navigation.** Sidebar tree, search, recent. Deep nesting common.

**Density.** Wildly variable — same app from sparse wiki to dense CRM.

**Motion.** Light page transitions; block drag feedback.

**Cognitive load.** **Very high** — blank page anxiety, schema design burden, workspace hygiene labor.

**Discoverability.** Slash menu teaches; true power needs YouTube curriculum.

**Expert vs beginner.** Experts build systems; beginners drown in empty databases.

**Keyboard.** Cmd+K, slash, markdown — strong on desktop.

**Touch.** Usable but second-class; mobile app historically fought desktop parity.

**Failure recovery.** Version history, trash — good when you find them.

**Delight.** Templates, aesthetics, "I built my life OS" — until maintenance hell.

**Lesson for AIIMIN.** Notion is the **anti-pattern for capture under load**. Flexibility without inference defaults to configuration theater — exactly what AIIMIN philosophy forbids.

---

### Command surfaces and speed tools

#### Raycast

**Interaction philosophy.** Intent in, action out. macOS as substrate. Extensions compose.

**Editing.** Often none — actions are atomic. Forms appear only when necessary.

**Navigation.** No persistent app chrome — ephemeral panel.

**Density.** Ultra-high in results list; zero elsewhere.

**Motion.** Instant panel, minimal flourish.

**Cognitive load.** Low once muscle memory exists; high first week.

**Discoverability.** Poor without onboarding — command palette is the whole UI.

**Expert vs beginner.** Expert-native; beginners need curated store and docs.

**Keyboard.** **Everything.** Keyboard is the product.

**Touch.** N/A on Mac.

**Failure recovery.** Retry command; little undo narrative.

**Delight.** Speed dopamine, extension ecosystem, "I feel like a wizard."

**Lesson for AIIMIN.** Command palette is spine for **power routing** — but AIIMIN capture must remain reachable without Raycast-grade memorization (frozen progressive enhancement law).

---

#### Superhuman

**Interaction philosophy.** Email at speed of thought. Split inbox, keyboard choreography, forced onboarding.

**Editing.** Compose inline; AI assist for drafts.

**Navigation.** Inbox triage as flow state — next, archive, snooze.

**Density.** Very high. Information-rich rows.

**Motion.** Snappy, almost gamified swipe/keyboard feedback.

**Cognitive load.** Low **after** expensive onboarding; high during onboarding.

**Discoverability.** Deliberately **taught** — 30-minute onboarding call. Not self-serve discovery.

**Expert vs beginner.** Product is expert-only by design; beginners pay time tax.

**Keyboard.** Legendary — every action chorded.

**Touch.** Mobile exists; brand is desktop speed.

**Failure recovery.** Undo send, shortcuts — fast correction culture.

**Delight.** Inbox zero rituals, streaks, speed metrics — **engagement mechanics**.

**Lesson for AIIMIN.** Superhuman proves onboarding can teach chords — but its engagement and density model **conflicts** with AIIMIN's anti-nag, anti-casino, interruptibility respect. Borrow speed honesty; reject streak theater.

---

#### Linear

**Interaction philosophy.** Opinionated, fast, aesthetically cold. Issue tracking without Jira soul.

**Editing.** Inline issue fields; minimal modal use.

**Navigation.** Team → project → issue. Keyboard jump everywhere.

**Density.** Medium-high. Information per pixel optimized.

**Motion.** Fast, tight transitions — speed as brand.

**Cognitive load.** Low for defined workflow; fights you if workflow doesn't match.

**Discoverability.** Keyboard hints on hover; `/` commands.

**Expert vs beginner.** Experts fly; beginners need Linear-specific mental model.

**Keyboard.** `C` create, `Cmd+K` search — muscle memory product.

**Touch.** Mobile companion — not primary.

**Failure recovery.** Undo on many actions; optimistic UI with rollback.

**Delight.** Crafted dark UI, satisfying micro-interactions — **taste as moat**.

**Lesson for AIIMIN.** Linear proves **one primary action per view** and optimistic commit with undo — directly portable. Linear's cold aesthetics are wrong for Human Momentum warmth.

---

### Browser and spatial reorganization

#### Arc Browser

**Interaction philosophy.** The browser is a spatial OS — spaces, profiles, sidebar as home.

**Editing.** URL bar, little boxes, notes in sidebar — capture to web context.

**Navigation.** Vertical sidebar, spaces switcher, command bar.

**Density.** Medium — sidebar always visible.

**Motion.** Space transitions, sidebar expand — orienting.

**Cognitive load.** High setup — reorganizing the internet is a project.

**Discoverability.** Clever but non-standard — learning curve vs Chrome.

**Expert vs beginner.** Experts customize spaces; beginners use "like Chrome but pretty."

**Keyboard.** Shortcuts for spaces and tabs; mouse-heavy culture.

**Touch.** iOS Arc — different product energy.

**Failure recovery.** Tab restore; space loss is catastrophic UX.

**Delight.** Aesthetic joy, personalization — identity through tool.

**Lesson for AIIMIN.** Spatial organization works for **regions of life** (IA alignment) — but Arc's setup cost is anti-pattern for someone capturing a thought in six seconds.

---

### Design and build tools

#### Figma

**Interaction philosophy.** Multiplayer canvas. Direct manipulation of design objects. Constraints over absolute positioning.

**Editing.** Select, drag, resize, property panels. Inline text edit on canvas.

**Navigation.** File browser, pages, layers panel, prototype flows.

**Density.** Very high in panels; canvas breathes.

**Motion.** Prototype mode only — production UI is static.

**Cognitive load.** High skill ceiling; beginners use templates.

**Discoverability.** Industry tutorials; tooltips on everything.

**Expert vs beginner.** Bimodal — templates vs design systems team.

**Keyboard.** Extensive — modifier keys for duplicate, group, nudge.

**Touch.** iPad app — touch-first variant of desktop model.

**Failure recovery.** Version history, multiplayer undo — gold standard for collaborative recovery.

**Delight.** Multiplayer cursors, smooth zoom — **shared presence**.

**Lesson for AIIMIN.** Figma's constraint model mirrors **component contracts** — behavior encoded in structure. AIIMIN isn't multiplayer design — but **correctable inference** should feel as direct as dragging a handle, not filing a ticket.

---

#### Framer

**Interaction philosophy.** Design and ship. Motion is first-class in authoring.

**Editing.** Canvas + property panels + code components.

**Navigation.** Project pages, breakpoints.

**Density.** High in editor; published sites vary.

**Motion.** **Central** — scroll, variant, page transitions as product value.

**Cognitive load.** High — design + interaction + deploy in one tool.

**Discoverability.** Tutorial-heavy; power features deep.

**Expert vs beginner.** Beginners publish fast with templates; experts hit code.

**Keyboard.** Standard design shortcuts.

**Touch.** Preview on device; author on desktop.

**Failure recovery.** Publish rollback; less granular than Figma history for content.

**Delight.** Published motion quality — wow factor.

**Lesson for AIIMIN.** Motion communicates on marketing surfaces — but frozen law says motion must never delay capture. Framer's delight is for **brand surfaces**, not capture path.

---

### AI-native interfaces

#### Cursor

**Interaction philosophy.** IDE + agent. AI inline in the editing flow, not a separate chat room.

**Editing.** Code editor remains sovereign; AI proposes diffs.

**Navigation.** Files, tabs, composer, agent panel — multi-surface IDE.

**Density.** Very high — developer expected to absorb panels.

**Motion.** Minimal — speed over flourish.

**Cognitive load.** High — agent can do wrong things at scale.

**Discoverability.** Cmd+K, @ symbols, rules files — learned power.

**Expert vs beginner.** Experts orchestrate agents; beginners accept bad diffs.

**Keyboard.** IDE-first.

**Touch.** N/A.

**Failure recovery.** Git, reject diff, checkpoint — **recovery is version control**.

**Delight.** "It wrote it for me" — agency mixed with anxiety.

**Lesson for AIIMIN.** **Mixed-initiative** is correct model — AI proposes, human remains sovereign. Cursor fails when users stop reading — AIIMIN must keep correction chips visible, not hidden in diff view.

---

#### ChatGPT

**Interaction philosophy.** Conversation as universal interface. Thread history as memory.

**Editing.** Regenerate, edit prompt, branch informally.

**Navigation.** Sidebar threads, model picker, GPT store.

**Density.** Low in chat bubble UI; high in long threads.

**Motion.** Typing indicator, stream tokens — **performance theater**.

**Cognitive load.** Low to start; high over time — thread archaeology, lost context.

**Discoverability.** Obvious text box; plugins and tools buried.

**Expert vs beginner.** Same UI — experts write system prompts; beginners chat.

**Keyboard.** Enter to send; Shift+Enter newline.

**Touch.** Mobile app = chat.

**Failure recovery.** Regenerate, edit — no strong undo on life actions outside chat.

**Delight.** Streaming, voice, personality — **companionship**.

**Lesson for AIIMIN.** Chat is a **surface**, not the OS. Thread amnesia and prompt labor are anti-patterns for life memory. AIIMIN AI must attach to **objects**, not only messages.

---

#### Claude

**Interaction philosophy.** Calmer, longer-context assistant. Artifacts as sidecar outputs.

**Editing.** Chat + artifact pane — structured output separated from dialogue.

**Navigation.** Projects, conversations, artifacts.

**Density.** Medium — artifact panel adds second column.

**Motion.** Restrained compared to ChatGPT marketing.

**Cognitive load.** Lower emotional noise; still thread-centric.

**Discoverability.** Projects help organization — manual curation burden.

**Expert vs beginner.** Artifacts help beginners see structure; experts use API.

**Keyboard.** Standard chat.

**Touch.** Mobile reasonable.

**Failure recovery.** Retry, edit message — conversational recovery only.

**Delight.** Thoughtful tone, artifacts — **clarity without dashboard**.

**Lesson for AIIMIN.** Artifacts parallel **structured capture results** — show inferred object beside source, editable. Closer to AIIMIN than pure chat.

---

#### Perplexity

**Interaction philosophy.** Answer-first search. Citations as trust layer.

**Editing.** Refine query, follow-ups — not document editing.

**Navigation.** Minimal — search box dominant.

**Density.** Medium — sources listed, answer concise.

**Motion.** Light.

**Cognitive load.** Low for lookup; no life persistence story.

**Discoverability.** Obvious — Google replacement frame.

**Expert vs beginner.** Same entry point.

**Keyboard.** Standard.

**Touch.** Mobile-first search.

**Failure recovery.** New search — little state to recover.

**Delight.** Fast answers with sources — **trust through provenance**.

**Lesson for AIIMIN.** When AIIMIN surfaces coaching or insight, **provenance chips** (why this suggestion, linked entities) borrow Perplexity's trust model — not answer-only black boxes.

---

### Developer environments

#### VS Code

**Interaction philosophy.** Editor core + extension universe. Command palette as universal router.

**Editing.** Text editor sovereignty; extensions patch behavior.

**Navigation.** Explorer, tabs, breadcrumbs, SCM, problems panel.

**Density.** User-tuned — Zen mode to panel hell.

**Motion.** Minimal core; extension-dependent.

**Cognitive load.** Extreme variance — vanilla vs power user.

**Discoverability.** Command palette, marketplace — self-directed learning.

**Expert vs beginner.** Beginners install; experts live in keybindings.json.

**Keyboard.** Fully remappable — philosophy of user ownership.

**Touch.** Not relevant.

**Failure recovery.** Local history, git, undo stack — deep.

**Delight.** Extensions, themes — personalization without brand unity.

**Lesson for AIIMIN.** Palette + logger as **command router** — but AIIMIN must stay opinionated. VS Code's infinite configurability is the wrong north star for life OS under load.

---

#### JetBrains IDEs

**Interaction philosophy.** Semantic understanding of code. Refactor-first, not text-first.

**Editing.** AST-aware transforms; intentions lightbulb.

**Navigation.** Find usages, hierarchy, structure view — **navigate meaning not files**.

**Density.** Very high — professional tool assumption.

**Motion.** Heavy dialogs; not motion-forward.

**Cognitive load.** Brutal learning curve; immense payoff for experts.

**Discoverability.** Intentions popup, search everywhere — discoverable if you know IDE patterns.

**Expert vs beginner.** Beginners fight the IDE; experts refuse to leave.

**Keyboard.** Chord paradise.

**Touch.** N/A.

**Failure recovery.** Local history, refactor preview, rollback — **preview before commit**.

**Delight.** "It understood my code" — **competence delight**, not visual delight.

**Lesson for AIIMIN.** **Preview before destructive commit** and **navigate by meaning** (intent graph, entity jump) are JetBrains lessons for life data — find the habit, not the table name.

---

## Cross-cutting patterns

### What the best systems share

**Sovereign editing surface.** Things, Bear, Figma, VS Code — one place where the user's work lives; tools orbit it.

**Optimistic commit with honest rollback.** Linear, Things, Figma — act fast, undo available, don't fake durability.

**Command layer as accelerator, not gate.** Raycast, VS Code, Linear — keyboard makes you faster; it doesn't unlock basics.

**Infer-then-correct beats forms-first.** Fantastical, Cursor diffs, Claude artifacts — structure appears; human fixes chips.

**Density matches mode.** Things (calm) vs Linear (command) vs Superhuman (triage) — same human, different cognitive modes.

**Motion explains state.** Apple, Material — never decorative on critical paths.

**Platform respect.** HIG, Material — fight the OS and you lose trust.

### What even great products get wrong

**Blank canvas as empowerment.** Notion, Obsidian, Craft — freedom becomes homework. Under load, empty workspace is guilt.

**Chat as memory.** ChatGPT, Claude threads — context evaporates, organization is manual, life doesn't live in messages.

**Speed without sovereignty.** Cursor agents, Superhuman triage — throughput rises; user stops understanding what changed.

**Expertise as onboarding tax.** Superhuman calls, Obsidian plugins, JetBrains learning cliff — power requires pilgrimage.

**Engagement metrics as success.** Superhuman streaks, Notion template hype — optimize taps not outcomes.

**Infinite configurability.** VS Code, Notion, Obsidian CSS — identity dissolves; maintenance becomes the hobby.

**AI magic without provenance.** ChatGPT confidence — fluent wrongness erodes long-term trust (violates AIIMIN silent-wrongness ban).

**Desktop-first life capture.** Many tools treat mobile as read-only sibling — misses the moment capture actually happens.

**Graph as homepage.** Obsidian graph — beautiful, useless for daily capture. Connection is review-time insight, not ingress gate.

**Notification-as-interface.** Fantastical reminders, Superhuman inbox — interruptibility abused for engagement.

**Aesthetic delight over emotional contract.** Craft, Arc — beautiful tools that don't guarantee relief after capture.

### Opportunities none of them solve

**Whole-life capture without schema homework.** Fantastical solves dates; banking apps solve money; notes apps solve text. None infer cross-domain life objects with uniform correction UX.

**Memory that compounds without curator labor.** Notion databases require gardening. AIIMIN graph memory should grow from capture, not weekend organization sessions.

**Mixed-initiative AI that stays interruptible.** Cursor is always-on in dev flow; coaching must wait for open windows (frozen AI law) — no product exemplifies respectful life coaching at OS scale.

**Emotional contract as design spec.** Most products optimize engagement or efficiency — not *relief, clarity, agency* as measurable interaction outcomes.

**Ceremony-free save across modalities.** Voice, photo, quick text, structured logger — one convergence pipeline (AIIMIN frozen) — competitors silo modalities into separate apps.

**Correctable inference on personal stakes.** Fantastical chips for calendar; nothing does this for money + habits + relationships + documents with one chip language.

**Density mode per cognitive moment on one account.** Linear is always command-dense; Things is always calm. AIIMIN needs capture-sparse and command-dense **in one day** without feeling like two products.

**Trust through life-long continuity.** Switching costs are data export — AIIMIN opportunity is decade-scale memory with humane correction, not vendor lock-in anxiety.

### Where AIIMIN should deliberately diverge

**Not a chatbot wearing a dashboard.** Perplexity/ChatGPT answer; AIIMIN persists objects and shows coaching only when interruptibility allows.

**Not Notion-flexible.** Blocks and databases are downstream views; ingress is always ceremony-free.

**Not Superhuman-onboarding.** Progressive keyboard enhancement — never gate capture behind training.

**Not Obsidian-expert.** Graph power without graph homework at capture time.

**Not Linear-cold.** Speed and opinion yes; warmth and Human Momentum narrative on brand/review surfaces.

**Not Arc-setup.** Spatial IA exists (frozen) but zero setup tax before first capture.

**Not Framer-motion on capture path.** Motion serves orientation on review; capture path is instant truth.

**Primitive across clients.** Unlike VS Code extensions, AIIMIN shared interaction contract (frozen) — same verbs, same correction chips, platform-native chrome only.

---

## Synthesis — deliverables

### Interaction principles worth preserving

**Defer decisions until stakes demand them.** If inference can proceed with visible correction, do not interrogate. (Fantastical, frozen AIIMIN)

**One primary action per moment.** Every great focused product picks a hero — capture on Today, triage in inbox, command in palette. (Things, Linear, Raycast)

**Optimistic commit, honest pending, undo over fear.** Act fast; show skeleton when sync pending; never fake saved. (Linear, Apple, frozen capture)

**Command as accelerator.** Palette/logger routes intent — never the only door. (Raycast, VS Code, frozen GOV)

**Infer-then-chip as universal correction language.** Same interaction for date parse, category guess, entity link. (Fantastical generalized)

**Density follows cognitive mode.** Capture = low chrome; command = dense; review = calm scan; brand = expressive sparse. (Things vs Linear vs Material density)

**Platform gestures win.** Back, share sheet, biometrics — don't reinvent. (HIG, Material, frozen)

**Navigate meaning not coordinates.** Jump to entity, habit, document — JetBrains for life. (JetBrains, Obsidian backlinks — but simplified)

**Provenance on AI output.** Why this suggestion; what entity; confidence band visible. (Perplexity, frozen AI)

**Interruptibility is respect.** Coaching waits; Focus protected. (Opposite of Superhuman nag)

**Verb consistency across surfaces.** Same action, same word. (Professional tool hygiene)

**Accessibility is interaction quality.** Focus order, hit targets, announcements designed in — not audited later. (Apple, Material baseline)

**Reduced motion honored with meaning preserved.** State change visible without animation. (HIG, frozen)

**Failure recovery without shame.** Undo, gentle empty states, no punitive copy. (Things, frozen emotional contract)

### Anti-patterns to avoid

Blank-page life OS setup before value.

Chat thread as system of record.

Forms before inference when chips would work.

Configuration theater and boolean-prop mega-components.

Speed metrics, streaks, casino motion on calm surfaces.

Decorative motion and "AI breathing" idle animations.

Fake instant success while outbox pending.

Competing primary buttons in one view.

Icon-only critical actions (save, capture, delete).

Expert-only capture paths (chord-only, palette-only).

Graph or dashboard as first-run experience.

Siloed modality apps inside one product skin.

Silent AI wrongness — high confidence, no correction path.

Shame empty states ("You haven't logged in 7 days!").

Purple-SaaS / cream-editorial / generic glass-card dashboard personality.

Reinventing platform navigation physics.

Mega-settings as procrastination destination.

Treating mobile web `/m` as analytics surface (frozen product lock).

### Opportunities unique to AIIMIN

**Universal capture convergence** — one pipeline, every ingress class, ceremony-free save — meets the user at the moment of life, not the moment of organization.

**Connected graph memory** — capture creates edges automatically; review surfaces reveal connection without Obsidian syntax.

**Mixed-initiative life coach** — not chat companion — roles bounded, interruptibility windows, Kill List skips noise fields.

**Emotional contract as acceptance test** — every interaction review asks: does this produce relief, clarity, or agency?

**Human Momentum** — longitudinal identity story — interaction supports momentum without gamified streak theater.

**Correctable inference everywhere** — one chip language across finance, journal, habits, family — category-defining if executed.

**Multi-density single product** — same user, same day: six-second phone capture and evening calm review without mode whiplash.

**Primitive parity** — web, native, desktop share verbs and contracts — rare in life tools fragmented across apps.

**Provenance + privacy stakes** — life data demands branded destructive confirm and honest sync — trust as interaction feature.

### Proposed first-principles interaction philosophy for AIIMIN

**Name:** *Relief-first interaction*

The user arrives overloaded. The system's job is to **remove a decision**, **remember something**, or **show one clear next step** — then get out of the way.

**Core tenets:**

**Capture is reflex, not ritual.** The fastest path from intent to durable raw save is sacred. Nothing — animation, onboarding, taxonomy, AI coaching — may insert steps before commit. Structure follows capture, never blocks it.

**Structure is offered, not demanded.** Inference proposes; chips correct; undo recovers. The user never feels interrogated for metadata they didn't care about yet.

**One hero per screen.** Primary action is obvious; secondary tools whisper. Command density is earned by mode, not default.

**Truth before polish.** Pending states look pending. Success looks success. AI confidence looks uncertain when it is.

**Accelerators are gifts, not gates.** Keyboard, palette, logger — faster for those who learn; invisible requirement for those who don't.

**Platform-native body, AIIMIN soul.** Gestures and shells follow OS; verbs, chips, correction, and emotional tone follow AIIMIN.

**Review is calm; command is dense; brand is expressive.** Mode mismatch is a design bug.

**Coaching knocks; it doesn't break in.** Interruptibility is love.

**Recovery is dignity.** Undo, honest errors, no shame — recoverable mistakes never use fear copy.

This philosophy implements frozen Chapters 02, 06, 07, 08 — it does not replace them.

### Recommended architectural direction for Chapters 09–12

*Direction for future authoring. Not specification. Existing Ch 09–12 drafts should be rewritten against this study.*

#### Chapter 09 — Interaction System

Center the **interaction state machine**: idle → capturing → committing → pending → confirmed → correctable → reviewed. Own primary-action declaration per surface context (reference Ch 08 jobs, don't redefine). Specify **correction chip interaction** as the universal infer-then-correct primitive. Own commit matrix (optimistic / confirm / typed confirm). Own undo windows and interruption rules. Own keyboard/gesture/focus/latency-honesty invariants. Explicitly **exclude** component APIs, token values, motion durations.

**North star test:** Can a tired human capture in six seconds and trust what happened?

#### Chapter 10 — Component System

Define **canonical families** tied to interaction states: CaptureInput, CorrectionChip, EntityRow, ConfirmGate, EmptyCoach, CommandSurface, PendingHonesty, UndoToast. Behavior contracts first — mandatory states (default, loading, error, empty, pending, disabled). Composition over boolean explosion. Capture family is **sacred** — no wrapper components that add steps. Navigation chrome components bind Ch 04 locks without owning routes. A11y ships in API (labels, focus return, hit targets).

**North star test:** Can engineering implement a new surface without inventing a fourth button variant?

#### Chapter 11 — Visual System

Token architecture: primitive → semantic → component. Lock semantic meaning across themes and native M3 mapping. Typography roles (display ritual, UI body, measure mono) — no font buffet. Density modes as **first-class tokens** tied to cognitive mode (capture/command/review/brand). Contrast and color-only status rules. Palette.md holds hex; chapter holds meaning. Iconography: words on critical paths.

**North star test:** Does this look like AIIMIN with logo removed — not interchangeable SaaS?

#### Chapter 12 — Motion System

Motion allowlist tied to emotional contract — feedback, continuity, hierarchy, state only. Duration band ~150–250ms on productivity paths; brand surfaces may breathe longer. **Hard ban:** motion before capture commit. Reduced motion = instant state with alternate cue. Loading motion honest; no token-stream theater for life saves. Celebration proportional — no casino. Interruption cancels non-critical animation.

**North star test:** If all motion were removed, would capture still feel instant and review still feel clear?

#### Dependency order (unchanged)

Interaction → Component → Visual → Motion. Each layer consumes upstream law; never redefines frozen operational model.

---

## Closing note

The products studied are excellent at their chosen fights. AIIMIN's fight is different: **one human's whole life, under load, for years**. The interaction layer wins if capture feels like exhaling, review feels like clarity, and AI feels like a competent assistant who knows when to speak — not a chatty co-pilot or an empty Notion page.

Write Chapters 09–12 only after this study is founder-reviewed. Specifications should encode these principles — not generic design-system boilerplate.

---

*End of pre-design study. No P8 rules. No chapter text. Research only.*
