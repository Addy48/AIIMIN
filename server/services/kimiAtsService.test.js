import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildFallbackAnalysis,
  extractJsonObject,
  normalizeAtsAnalysis,
} from './kimiAtsService.js';

test('extractJsonObject parses fenced Kimi JSON responses', () => {
  const raw = '```json\n{"overallFeedback":"ok","missingSkills":[],"bulletPoints":[]}\n```';

  assert.deepEqual(extractJsonObject(raw), {
    overallFeedback: 'ok',
    missingSkills: [],
    bulletPoints: [],
  });
});

test('normalizeAtsAnalysis limits malformed model output to safe fields', () => {
  const normalized = normalizeAtsAnalysis({
    missingSkills: [
      { skill: 'Kubernetes', reason: 'Needed for deployment ownership.' },
      { skill: '', reason: 'empty skill should be ignored' },
      'bad row',
    ],
    bulletPoints: ['Built APIs with measurable impact.', '', 42],
    overallFeedback: 'Strong base.',
    ignored: '<script>alert(1)</script>',
  });

  assert.deepEqual(normalized, {
    missingSkills: [
      { skill: 'Kubernetes', reason: 'Needed for deployment ownership.' },
    ],
    bulletPoints: ['Built APIs with measurable impact.'],
    overallFeedback: 'Strong base.',
  });
});

test('buildFallbackAnalysis returns professional fallback content', () => {
  const fallback = buildFallbackAnalysis(['postgres', 'calendar sync'], 42, false);

  assert.equal(fallback.missingSkills.length, 5);
  assert.equal(fallback.bulletPoints.length, 5);
  assert.match(fallback.overallFeedback, /42%/);
});
