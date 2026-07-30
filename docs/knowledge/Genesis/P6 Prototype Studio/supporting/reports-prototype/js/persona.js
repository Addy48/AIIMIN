/**
 * Synthetic Quantified-Self composite for AIIMIN report prototypes.
 * Inspired by public patterns from: Quantified Self forums, r/dataisbeautiful
 * habit-tracking threads, anonymized Open Humans–style timelines.
 * Not a real person. No scraped PII.
 */
window.AIIMIN_PERSONA = {
  meta: {
    fullName: "Kabir Mehta",
    firstName: "Kabir",
    osId: "OS-7F2A91",
    city: "Bengaluru",
    timezone: "Asia/Kolkata",
    tierAtGeneration: "elite",
    email: "kabir@example.invalid",
    supportEmail: "support@aiimin.in",
    reportRef: {
      snapshot: "SNP-2026-07-16-7F2A",
      standard: "STD-2026-07-16-7F2A",
      deep: "DEEP-2026-07-16-7F2A",
    },
    generatedOn: "2026-07-16",
    dataNote:
      "Synthetic composite. Mood / habit / spend shapes mirror common QS + Reddit self-tracking distributions, not live user data.",
  },

  ranges: {
    snapshot: { label: "10 Jul – 16 Jul 2026", days: 7, start: "2026-07-10", end: "2026-07-16" },
    standard: { label: "03 Jul – 16 Jul 2026", days: 14, start: "2026-07-03", end: "2026-07-16" },
    deep: { label: "18 Apr – 16 Jul 2026", days: 90, start: "2026-04-18", end: "2026-07-16" },
  },

  lifeScore: {
    week: 74,
    weekDelta: 4,
    priorWeek: 70,
    avg14: 71,
    avg30: 68,
    avg90: 66,
    daily14: [62, 65, 58, 70, 72, 68, 74, 71, 69, 73, 76, 70, 72, 74],
    daily90Sample: [
      58, 60, 55, 62, 64, 61, 66, 63, 59, 67, 70, 68, 65, 71, 69, 72, 70, 68, 74, 71, 66, 69, 73, 75, 72,
      68, 70, 74, 71, 69, 67, 72, 76, 74, 70, 68, 71, 73, 75, 72, 69, 71, 74, 77, 73, 70, 72, 75, 74, 71,
      69, 72, 76, 78, 74, 71, 73, 75, 72, 70, 68, 71, 74, 76, 73, 71, 69, 72, 75, 74, 70, 72, 76, 74, 71,
      69, 73, 75, 72, 70, 68, 71, 74, 73, 71, 69, 72, 74, 76, 74,
    ],
  },

  mood: {
    avg7: 6.8,
    avg14: 6.5,
    avg90: 6.2,
    consistency14: 0.78,
    sparkline7: [5.5, 6.0, 5.0, 7.0, 7.5, 6.5, 7.0],
    bars14: [5.2, 5.8, 4.9, 6.5, 7.1, 6.2, 6.8, 6.4, 6.0, 7.0, 7.4, 6.6, 6.9, 7.0],
    toneDistribution: {
      steady: 42,
      energized: 18,
      anxious: 14,
      low: 11,
      focused: 15,
    },
  },

  habits: {
    completionRate7: 0.81,
    completionRate14: 0.76,
    completionRate90: 0.71,
    totalLogged14: 86,
    items: [
      { name: "Morning mobility", rate: 0.93, streak: 12, missed: 1 },
      { name: "Deep work block", rate: 0.79, streak: 4, missed: 3 },
      { name: "No late caffeine", rate: 0.64, streak: 2, missed: 5 },
      { name: "Evening journal", rate: 0.71, streak: 3, missed: 4 },
      { name: "Walk 6k steps", rate: 0.86, streak: 7, missed: 2 },
    ],
    topHabit: "Morning mobility",
    mostMissed: "No late caffeine",
  },

  focus: {
    hours7: 18.5,
    hours14: 34.2,
    hours90: 198,
    pomodoroCompletion: 0.72,
    avgSessionMin: 48,
    disciplineUrgeResist: 0.61,
  },

  journal: {
    consistency7: 0.86,
    consistency14: 0.79,
    daysWithEntry14: 11,
    insights: [
      "Sleep debt after 1am nights predicts next-day mood drops of ~1.2 points.",
      "Deep-work mornings cluster with higher Life Score even when evening mood is flat.",
      "Finance stress language spikes on Wednesdays after mid-week spend reviews.",
      "Walk days show lower urge intensity in the discipline log.",
      "Journal tone turns sharper when caffeine habit breaks two days in a row.",
    ],
    cbtPattern:
      "Recurring ‘all-or-nothing’ frame around missed deep-work blocks; reframe attempts improve when walks land before 6pm.",
  },

  finance: {
    status7: "under",
    income14: 42000,
    expenses14: 31840,
    budgetDelta14: 10160,
    income90: 126000,
    expenses90: 97820,
    topCategories: [
      { name: "Food delivery", amount: 6420 },
      { name: "Transit / auto", amount: 4180 },
      { name: "Subscriptions", amount: 2890 },
    ],
    sipStatus: "On track — ₹8,000/mo SIP, 2 months ahead of annual target pace",
    aiSentence:
      "Delivery spend bunches on low-mood evenings; walk days cut delivery by ~35%.",
  },

  callouts: {
    topStreak: "Morning mobility — 12 days",
    biggestWin: "Life Score +4 vs prior week while holding focus hours steady",
    watchItem: "Late caffeine breaks correlating with next-day focus collapse",
  },

  ai: {
    snapshotPattern:
      "Your week lifts when mobility and walks lock early; late caffeine is the single leak that pulls the rest of the day down.",
    execSummary14:
      "Over these fourteen days you ran a steadier Life Score than the prior fortnight, with mobility as the reliable anchor and deep work recovering after a mid-period dip. Mood stayed mostly in the mid-to-high band, with sharper drops after late nights and caffeine slips. Money stayed under budget, though delivery clustered on low-energy evenings. The clearest story is simple: mornings that start with movement buy you the afternoon; evenings that open with caffeine spend it.",
    lifeScoreNarrative14:
      "Scores climbed from the low sixties into the mid-seventies as mobility streak held and walk days increased. The sharpest dips sit on Jul 5 and Jul 12 — both follow late caffeine and short sleep. Peaks on Jul 13–14 line up with completed deep-work blocks and journal entries the night before.",
    recommendations14: [
      {
        action: "Hard stop caffeine after 2pm on deep-work days",
        why: "Missed ‘No late caffeine’ days precede the two largest Life Score drops in the window.",
      },
      {
        action: "Keep morning mobility non-negotiable even on travel days",
        why: "93% completion habit is your strongest positive correlate with weekly score.",
      },
      {
        action: "Pre-order a walk before evening meals on Wednesdays",
        why: "Walk days cut delivery spend and lower urge intensity the same evening.",
      },
      {
        action: "Protect one 90-minute deep-work block before noon Mon–Thu",
        why: "Morning deep work clusters with higher Life Score independent of evening mood.",
      },
      {
        action: "Journal three lines before closing the laptop",
        why: "Days with journal entries show better next-day mood consistency (+0.6 avg).",
      },
    ],
  },

  correlations: [
    {
      a: "Sleep hours",
      b: "Next-day mood",
      r: 0.54,
      p: 0.008,
      label: "Moderate",
      plain:
        "When you sleep under 6.5h, next-day mood drops about a point on average — the strongest sleep link in this window.",
    },
    {
      a: "Morning mobility",
      b: "Life Score",
      r: 0.48,
      p: 0.014,
      label: "Moderate",
      plain:
        "Completed mobility days sit ~6 Life Score points higher than missed ones across the fortnight.",
    },
    {
      a: "Delivery spend",
      b: "Evening low mood",
      r: 0.41,
      p: 0.031,
      label: "Moderate",
      plain:
        "Higher delivery evenings co-occur with low mood tags — direction unclear, but the cluster is consistent.",
    },
    {
      a: "Pomodoro count",
      b: "Journal tone positivity",
      r: 0.22,
      p: 0.18,
      label: "Weak signal, exploratory only",
      plain: "Weak positive drift — treat as exploratory until more weeks accumulate.",
    },
  ],

  goals: [
    {
      name: "Ship side project MVP",
      target: "Public beta by 31 Aug",
      progress: 0.62,
      projected: "2026-09-12",
      observation: "Velocity up after deep-work mornings returned; still ~12 days behind original plan.",
    },
    {
      name: "₹1.5L emergency fund",
      target: "₹1,50,000",
      progress: 0.71,
      projected: "2026-09-01",
      observation: "SIP pace healthy; delivery spikes are the main drag on surplus.",
    },
    {
      name: "5k run under 28 min",
      target: "28:00",
      progress: 0.44,
      projected: "2026-10-20",
      observation: "Training load light; recovery scores fine — consistency, not intensity, is the gap.",
    },
  ],

  sports: {
    hasData: true,
    trainingLoad: "Moderate — 3 run sessions / week avg",
    recovery: 72,
    performanceTrend: "Flat-to-up; best 5k split improved 18s vs April baseline",
  },

  career: {
    hasData: true,
    applications: 11,
    skillHours: 46,
    interviewPrepDays: 9,
    note: "Prep consistency higher in weeks with locked morning deep work.",
  },

  behavioralProfile90: [
    "Across ninety days you look like someone who builds stability from the morning outward. Mobility and early walks are not side habits — they are the load-bearing wall. When they hold, Life Score, focus, and even spend discipline tend to follow. When they slip, the rest of the system frays in the same afternoon.",
    "Your attention economy is honest: deep work thrives before noon and collapses when caffeine stretches into evening. The data does not show a motivation problem so much as a sequencing problem. Protect the morning block and the evening takes care of itself more often than not.",
    "Emotionally you run steady with sharp, explainable dips — sleep debt, late stimulants, mid-week money reviews. Journal language gets harsher on those days, then softens after a walk. That recoverability is a strength; the opportunity is catching the dip one decision earlier.",
    "Money behavior is mostly aligned with goals, with one clear leak: delivery as mood regulation. It is not catastrophic, but it is predictable. Pairing walks with evenings already reduces it — making that pairing explicit would likely do more than another budget rule.",
    "Taken together, the ninety-day profile is of a builder who responds well to structural constraints and poorly to vague intentions. You do not need more tracking. You need fewer, sharper rules at the two hinge points: morning start and evening stimulant cutoff.",
  ],
};
