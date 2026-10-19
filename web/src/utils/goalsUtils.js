/** Map UI status labels ↔ API status values */
const STATUS_TO_API = {
  Active: 'in_progress',
  'On Track': 'in_progress',
  'At Risk': 'at_risk',
  Achieved: 'completed',
};

const API_TO_STATUS = {
  in_progress: 'Active',
  at_risk: 'At Risk',
  completed: 'Achieved',
  active: 'Active',
};

export function goalProgress(milestones = []) {
  if (!milestones.length) return 0;
  const done = milestones.filter((m) => m.done).length;
  return Math.round((done / milestones.length) * 100);
}

/** Normalize API row → UI goal shape */
export function normalizeGoalFromApi(row) {
  if (!row) return null;
  const meta = row.meta || {};
  return {
    id: row.id,
    title: row.title || '',
    pillar: meta.pillar || row.category || 'career',
    priority: meta.priority || 'Medium',
    targetDate: meta.targetDate || '',
    why: meta.why || '',
    milestones: meta.milestones || [{ text: '', done: false }],
    status: meta.uiStatus || API_TO_STATUS[row.status] || row.status || 'Active',
    linkedHabitId: meta.linkedHabitId || null,
    focusSessionsPerWeek: meta.focusSessionsPerWeek ?? 3,
    createdAt: row.created_at || meta.createdAt,
    progress: row.progress ?? goalProgress(meta.milestones),
  };
}

/** UI goal → API payload */
export function goalToApiPayload(g) {
  const progress = goalProgress(g.milestones);
  let status = STATUS_TO_API[g.status] || 'in_progress';
  if (progress === 100 && g.milestones?.length) status = 'completed';

  return {
    title: g.title,
    category: g.pillar || 'career',
    status,
    progress,
    meta: {
      pillar: g.pillar,
      priority: g.priority,
      targetDate: g.targetDate,
      why: g.why,
      milestones: g.milestones,
      linkedHabitId: g.linkedHabitId || null,
      focusSessionsPerWeek: Number(g.focusSessionsPerWeek) || 0,
      uiStatus: g.status,
      createdAt: g.createdAt,
    },
  };
}
