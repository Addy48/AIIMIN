/**
 * Extended scientific layer for Elite / Pro prototypes.
 * Synthetic QS composite — methods language mirrors common self-tracking stats
 * (Spearman + BH-FDR, simple change-point narrative, effect-size labels).
 * Not clinical. Not live user data.
 */
window.AIIMIN_SCIENCE = {
  methods: {
    windowDays: 90,
    nDaysObserved: 87,
    missingDays: 3,
    lifeScoreDef:
      "Composite 0–100 from mood (25%), habit completion (25%), focus minutes (20%), journal consistency (15%), finance budget flag (15%).",
    correlation: "Spearman ρ on day-aligned series; Benjamini–Hochberg FDR at q=0.10.",
    weakRule: "|ρ| < 0.30 labeled exploratory; not used for recommendations.",
    effectSizes: "Cliff's δ for binary habit contrasts; Cohen-style labels for mean diffs (small/medium/large heuristic).",
    disclaimer:
      "Observational self-tracking. No clinical diagnosis. Causal language is hypothesis-grade only.",
  },

  weekly: [
    { w: 1, score: 61, mood: 5.9, focusH: 12.1, habits: 0.62, spend: 8200 },
    { w: 2, score: 63, mood: 6.1, focusH: 13.4, habits: 0.66, spend: 7900 },
    { w: 3, score: 59, mood: 5.4, focusH: 10.2, habits: 0.58, spend: 9100 },
    { w: 4, score: 65, mood: 6.3, focusH: 14.0, habits: 0.70, spend: 7600 },
    { w: 5, score: 67, mood: 6.4, focusH: 15.1, habits: 0.72, spend: 7400 },
    { w: 6, score: 64, mood: 6.0, focusH: 13.8, habits: 0.68, spend: 8100 },
    { w: 7, score: 69, mood: 6.6, focusH: 16.2, habits: 0.74, spend: 7200 },
    { w: 8, score: 70, mood: 6.7, focusH: 16.8, habits: 0.76, spend: 7000 },
    { w: 9, score: 68, mood: 6.3, focusH: 15.4, habits: 0.71, spend: 7800 },
    { w: 10, score: 72, mood: 6.9, focusH: 17.5, habits: 0.79, spend: 6900 },
    { w: 11, score: 73, mood: 7.0, focusH: 18.1, habits: 0.81, spend: 6800 },
    { w: 12, score: 71, mood: 6.8, focusH: 17.0, habits: 0.78, spend: 7100 },
    { w: 13, score: 74, mood: 7.0, focusH: 18.5, habits: 0.82, spend: 6650 },
  ],

  changePoints: [
    {
      date: "2026-05-12",
      signal: "Life Score level shift +4.1",
      method: "Binary segmentation on weekly means",
      drivers: "Mobility streak locked; caffeine misses halved",
    },
    {
      date: "2026-06-20",
      signal: "Delivery spend regime −28%",
      method: "Mean shift on evening food-delivery ₹",
      drivers: "Walk-before-dinner protocol adherence ↑",
    },
  ],

  matrix: [
    // row/col labels for small correlation matrix display
    { a: "Sleep h", b: "Mood+1", r: 0.54, p: 0.008, q: 0.03, sig: true },
    { a: "Mobility", b: "Life Score", r: 0.48, p: 0.014, q: 0.04, sig: true },
    { a: "Deep work AM", b: "Life Score", r: 0.46, p: 0.011, q: 0.04, sig: true },
    { a: "Walk", b: "Eve mood", r: 0.44, p: 0.019, q: 0.05, sig: true },
    { a: "Delivery ₹", b: "Eve low mood", r: 0.41, p: 0.031, q: 0.07, sig: true },
    { a: "Caffeine late", b: "Focus next", r: -0.39, p: 0.028, q: 0.07, sig: true },
    { a: "Journal", b: "Mood+1", r: 0.33, p: 0.052, q: 0.11, sig: false },
    { a: "Pomodoros", b: "Journal tone", r: 0.22, p: 0.18, q: 0.28, sig: false },
  ],

  effects: [
    {
      contrast: "Mobility done vs missed",
      outcome: "Life Score",
      delta: "+6.1 points",
      cliffs: 0.42,
      label: "medium",
      n: "62 vs 25 days",
    },
    {
      contrast: "Deep work AM vs none",
      outcome: "Life Score",
      delta: "+5.4 points",
      cliffs: 0.38,
      label: "medium",
      n: "48 vs 39 days",
    },
    {
      contrast: "Walk evening vs none",
      outcome: "Delivery ₹",
      delta: "−35%",
      cliffs: 0.31,
      label: "small–medium",
      n: "40 vs 47 evenings",
    },
    {
      contrast: "Caffeine after 14:00",
      outcome: "Next-day focus h",
      delta: "−0.7 h",
      cliffs: -0.29,
      label: "small",
      n: "31 exposure days",
    },
  ],

  subscales: [
    { name: "Energy", score: 71, alpha: 0.78, items: "mood morning, steps, sleep hours" },
    { name: "Execution", score: 74, alpha: 0.81, items: "deep work, pomodoro %, habit rate" },
    { name: "Regulation", score: 66, alpha: 0.74, items: "urge resist, caffeine rule, delivery control" },
    { name: "Reflection", score: 69, alpha: 0.76, items: "journal days, CBT tags, tone stability" },
    { name: "Solvency", score: 77, alpha: 0.72, items: "budget delta, SIP pace, category concentration" },
  ],

  dagNodes: [
    { id: "sleep", label: "Sleep hours" },
    { id: "caffeine", label: "Late caffeine" },
    { id: "mobility", label: "Morning mobility" },
    { id: "deep", label: "AM deep work" },
    { id: "walk", label: "Eve walk" },
    { id: "mood", label: "Mood" },
    { id: "focus", label: "Focus hours" },
    { id: "spend", label: "Delivery spend" },
    { id: "score", label: "Life Score" },
  ],
  dagEdges: [
    ["sleep", "mood"],
    ["sleep", "focus"],
    ["caffeine", "focus"],
    ["caffeine", "sleep"],
    ["mobility", "deep"],
    ["mobility", "score"],
    ["deep", "score"],
    ["walk", "mood"],
    ["walk", "spend"],
    ["mood", "spend"],
    ["mood", "score"],
    ["focus", "score"],
  ],

  interventions: [
    {
      name: "I1 · 14:00 caffeine cutoff",
      target: "Late caffeine → focus/sleep path",
      protocol: "No caffeine after 14:00 Mon–Fri; tag exceptions in journal.",
      expected: "Next-day focus +0.5–0.8 h; Life Score +2–4 on adherence weeks",
      measure: "Habit ‘No late caffeine’ + next-day focus minutes",
      weeks: 4,
    },
    {
      name: "I2 · Mobility non-negotiable",
      target: "Mobility → score path",
      protocol: "10-min mobility before any screen work; travel = hotel-room variant.",
      expected: "Hold score floor ≥68",
      measure: "Mobility completion · weekly mean Life Score",
      weeks: 6,
    },
    {
      name: "I3 · Walk-before-dinner",
      target: "Walk → mood/spend path",
      protocol: "20-min walk Wed–Fri before ordering food.",
      expected: "Delivery −25–35%; evening mood +0.4",
      measure: "Walk flag · delivery ₹ · eve mood",
      weeks: 4,
    },
  ],

  sops: [
    {
      name: "Boot sequence (morning)",
      steps: ["Mobility 10m", "Water + no caffeine decision", "90m deep work block", "Log focus cycles"],
    },
    {
      name: "Midday checkpoint",
      steps: ["Life Score glance", "If score &lt;65 → walk or nap 20m", "Protect afternoon from meetings if AM deep work missed"],
    },
    {
      name: "Shutdown (evening)",
      steps: ["Walk or substitute", "Journal 3 lines", "Caffeine already closed", "Tomorrow deep-work block on calendar"],
    },
  ],

  kpiTree: [
    {
      kpi: "Life Score (weekly mean)",
      children: ["Mood mean", "Habit completion", "Focus hours", "Journal consistency", "Budget flag"],
    },
    {
      kpi: "Execution capacity",
      children: ["AM deep-work days", "Pomodoro completion", "Urge resistance"],
    },
    {
      kpi: "Solvency buffer",
      children: ["Weekly surplus", "Delivery ₹", "SIP pace"],
    },
  ],

  evidenceGrades: [
    { id: "E1", claim: "Mobility raises Life Score", grade: "B+", basis: "ρ=0.48, q&lt;0.05, medium Cliff's δ, replicates across halves" },
    { id: "E2", claim: "Late caffeine harms next-day focus", grade: "B", basis: "ρ=−0.39, temporal precedence in dips, small–medium effect" },
    { id: "E3", claim: "Walks cut delivery spend", grade: "B−", basis: "−35% contrast; mood mediation plausible" },
    { id: "E4", claim: "Pomodoro improves journal tone", grade: "D", basis: "ρ=0.22, q=0.28 — exploratory only" },
  ],

  atlasDomains: [
    {
      id: "life",
      name: "Life Score",
      color: "#ff6b35",
      summary: "Dependent composite. Floor lifted after May change-point; recent weeks 71–74.",
      metrics: [
        { k: "90d mean", v: "66" },
        { k: "30d mean", v: "68" },
        { k: "This week", v: "74" },
        { k: "WoW Δ", v: "+4" },
      ],
      findings: [
        "Volatility clusters on late-caffeine + short-sleep dyads.",
        "Peaks align with mobility + AM deep work co-occurrence.",
      ],
    },
    {
      id: "habits",
      name: "Habits",
      color: "#10b981",
      summary: "Mobility is load-bearing; caffeine rule is the leak.",
      metrics: [
        { k: "90d rate", v: "71%" },
        { k: "Top", v: "Mobility 93%" },
        { k: "Miss", v: "Caffeine 64%" },
        { k: "Streak", v: "12d mob." },
      ],
      findings: [
        "Missed caffeine days precede 2 largest score drops in last 14d.",
        "Walk couples habits to finance and mood systems.",
      ],
    },
    {
      id: "focus",
      name: "Focus & Discipline",
      color: "#3b82f6",
      summary: "Sequencing &gt; volume. 198h logged; mornings win.",
      metrics: [
        { k: "90d hours", v: "198h" },
        { k: "Pomodoro", v: "72%" },
        { k: "Urge resist", v: "61%" },
        { k: "Avg session", v: "48m" },
      ],
      findings: [
        "Urge resistance rises on walk days.",
        "AM deep work predicts score independent of evening mood.",
      ],
    },
    {
      id: "mood",
      name: "Mood & Journal",
      color: "#8b5cf6",
      summary: "Steady mid-high band; dips explainable.",
      metrics: [
        { k: "90d mood", v: "6.2" },
        { k: "Consistency", v: "78%" },
        { k: "Journal days", v: "79% /14d" },
        { k: "CBT", v: "all-or-nothing" },
      ],
      findings: [
        "Sleep&lt;6.5h → next-day mood ≈ −1.2 points.",
        "Journal presence &gt; length for next-day mood.",
      ],
    },
    {
      id: "money",
      name: "Finance",
      color: "#eab308",
      summary: "Under budget; delivery is behavioral leak.",
      metrics: [
        { k: "14d surplus", v: "₹10.2k" },
        { k: "Top leak", v: "Delivery" },
        { k: "SIP", v: "On track" },
        { k: "90d spend", v: "₹97.8k" },
      ],
      findings: [
        "Delivery bunches on low-mood evenings.",
        "Walk protocol is higher leverage than another budget rule.",
      ],
    },
    {
      id: "goals",
      name: "Goals & Career",
      color: "#ec4899",
      summary: "Side-project velocity up with AM deep work; fund on pace.",
      metrics: [
        { k: "MVP", v: "62%" },
        { k: "Fund", v: "71%" },
        { k: "5k run", v: "44%" },
        { k: "Apps", v: "11" },
      ],
      findings: [
        "Interview prep days cluster with locked morning blocks.",
        "Run goal limited by consistency not recovery.",
      ],
    },
  ],
};
