import React from 'react';
import { LabCard } from './PrototypePrimitives';

const PERSONAS = [
  {
    name: 'Student',
    intent: 'Keep studies, placement prep, routines, money, and focus visible.',
    nav: ['Today', 'Habits', 'Goals', 'Journal', 'Calendar', 'Career', 'Focus', 'Finance'],
    hidden: ['Family optional'],
    ai: 'Nudges around exams, missed habits, applications, and study blocks.',
  },
  {
    name: 'Working professional',
    intent: 'Treat AIIMIN as a personal operating system after office hours.',
    nav: ['Today', 'Calendar', 'Goals', 'Finance', 'Journal', 'Family', 'Focus'],
    hidden: ['Sports optional', 'Lab optional'],
    ai: 'Career growth, health consistency, money review, and weekly planning.',
  },
  {
    name: 'Founder / builder',
    intent: 'Prioritise execution loops, experiments, cash, discipline, and shipping.',
    nav: ['Today', 'Goals', 'Finance', 'Calendar', 'Lab', 'Journal', 'Focus', 'Discipline'],
    hidden: ['Family optional', 'Sports optional'],
    ai: 'Turns logs into product momentum, follow-ups, and execution risks.',
  },
  {
    name: 'Family / household',
    intent: 'Make planning, money, shared routines, and family records first-class.',
    nav: ['Today', 'Family', 'Finance', 'Calendar', 'Journal', 'Goals', 'Habits'],
    hidden: ['Career optional', 'Lab hidden'],
    ai: 'Weekly family overview, bill rhythm, document reminders, and routine drift.',
  },
  {
    name: 'Athlete / fitness',
    intent: 'Use the product as a training consistency and discipline tracker.',
    nav: ['Today', 'Habits', 'Sports', 'Discipline', 'Focus', 'Journal', 'Goals'],
    hidden: ['Family optional', 'Career optional'],
    ai: 'Training streaks, recovery notes, match context, and consistency warnings.',
  },
];

const LAYERS = [
  ['Life mode', 'A preset that chooses the first useful shape of the app.'],
  ['Active sections', 'The modules that exist for this user. Hidden modules leave nav and More.'],
  ['Pinned order', 'The exact order of the masthead and first four mobile tabs.'],
  ['AI priorities', 'What summaries, nudges, weekly digests, and suggestions should care about.'],
  ['Section variants', 'Career can mean placements for students and growth tracking for professionals.'],
];

export default function PersonalizationPrototypesPanel() {
  return (
    <div className="design-lab__panel">
      <LabCard
        title="Personalized AIIMIN model"
        desc="The platform should adapt to a user's life instead of assuming everyone is a student. This prototype defines the system now powering Account -> Personalization."
        badge="New direction"
        badgeVariant="proposed"
      >
        <div className="persona-flow">
          {LAYERS.map(([title, desc], index) => (
            <div key={title} className="persona-flow__step">
              <span className="persona-flow__num">{index + 1}</span>
              <div>
                <h4>{title}</h4>
                <p>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </LabCard>

      <LabCard
        title="Persona prototype matrix"
        desc="Each user gets a different product surface: same platform, different defaults."
        badge="Prototype"
        badgeVariant="current"
      >
        <div className="persona-grid">
          {PERSONAS.map((persona) => (
            <article key={persona.name} className="persona-card">
              <div className="persona-card__head">
                <h4>{persona.name}</h4>
                <p>{persona.intent}</p>
              </div>
              <div className="persona-card__section">
                <span>Default navbar</span>
                <div className="persona-pills">
                  {persona.nav.map((item) => (
                    <strong key={item}>{item}</strong>
                  ))}
                </div>
              </div>
              <div className="persona-card__section">
                <span>Usually hidden</span>
                <p>{persona.hidden.join(', ')}</p>
              </div>
              <div className="persona-card__section">
                <span>AI behavior</span>
                <p>{persona.ai}</p>
              </div>
            </article>
          ))}
        </div>
      </LabCard>

      <LabCard
        title="Career replaces student-only placement"
        desc="The route can stay /placements for now, but the user-facing concept should become Career so professionals and founders are not alienated."
        badge="IA"
        badgeVariant="proposed"
      >
        <div className="career-split">
          <div>
            <h4>Student variant</h4>
            <p>Campus placements, applications, DSA/interview prep, deadlines, company notes.</p>
          </div>
          <div>
            <h4>Professional variant</h4>
            <p>Job-switch tracking, certifications, networking, performance review goals, promotion evidence.</p>
          </div>
          <div>
            <h4>Founder variant</h4>
            <p>Hiring pipeline, investor follow-ups, operator network, advisory conversations.</p>
          </div>
        </div>
      </LabCard>
    </div>
  );
}
