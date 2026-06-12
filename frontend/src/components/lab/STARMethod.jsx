import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const QUESTIONS = [
  {
    id: 1,
    title: "Conflict with a Team Member",
    text: "Tell me about a time you disagreed with a colleague on a technical decision. How did you handle it?",
    options: [
      "I escalated it to my manager immediately to avoid wasting time.",
      "I agreed with them to keep the peace, even though I knew they were wrong.",
      "I scheduled a meeting, presented data showing why my approach was better, listened to their concerns, and we compromised on a hybrid solution.",
      "I secretly built my version anyway to prove them wrong."
    ],
    correct: 2,
    aiExplanation: "S (Situation): Disagreement on technical approach. T (Task): Resolve conflict and move project forward. A (Action): Scheduled meeting, used data/metrics, actively listened, found compromise. R (Result): Successful hybrid implementation without damaging relationships."
  },
  {
    id: 2,
    title: "Failing to Meet a Deadline",
    text: "Tell me about a time you realized you were not going to meet a project deadline. What did you do?",
    options: [
      "I worked 20-hour days in secret hoping I would catch up before anyone noticed.",
      "I immediately notified stakeholders, explained the blockers, proposed a revised timeline, and prioritized the core MVP features.",
      "I blamed the QA team for taking too long to test my code.",
      "I waited until the deadline day to tell my manager."
    ],
    correct: 1,
    aiExplanation: "Proactive communication is key. S: Impending missed deadline. T: Mitigate impact. A: Notified stakeholders early, offered solutions, scoped down to MVP. R: Delivered core value on time, maintained trust through transparency."
  },
  {
    id: 3,
    title: "Overcoming a Steep Learning Curve",
    text: "Describe a situation where you had to learn a new technology or domain very quickly to complete a task.",
    options: [
      "I told my manager I couldn't do it because I wasn't trained.",
      "I spent 3 weeks reading a book cover-to-cover before writing any code.",
      "I read the official docs, built a small proof-of-concept over the weekend, asked a senior dev for a quick architecture review, and then integrated it.",
      "I just copied and pasted code from Stack Overflow until it worked."
    ],
    correct: 2,
    aiExplanation: "Shows initiative and practical learning. A: Hands-on PoC, leveraging documentation, and seeking targeted mentorship (code review) rather than spinning wheels."
  },
  {
    id: 4,
    title: "Handling Ambiguity",
    text: "Tell me about a time you were given a task with very vague requirements.",
    options: [
      "I wrote a comprehensive PRD, set up a meeting with the PM and design team to clarify edge cases, and got sign-off before coding.",
      "I built what I thought they wanted and waited for feedback during the demo.",
      "I refused to start work until the PM wrote a perfect Jira ticket.",
      "I built every possible feature just in case."
    ],
    correct: 0,
    aiExplanation: "Ambiguity requires leadership. A: Took ownership of requirement gathering, collaborated cross-functionally, secured alignment (sign-off). R: Prevented wasted engineering effort."
  },
  {
    id: 5,
    title: "Dealing with a Production Incident",
    text: "Tell me about a time your code broke production. How did you react?",
    options: [
      "I quietly reverted the PR and didn't tell anyone.",
      "I panicked and logged off for the day.",
      "I immediately rolled back the deployment to restore service, investigated the logs to find the root cause, deployed a fix, and wrote a post-mortem to prevent recurrence.",
      "I blamed the review process for not catching my bug."
    ],
    correct: 2,
    aiExplanation: "Incidents happen. The best engineers focus on MTTR (Mean Time To Recovery). A: Mitigated immediately (rollback), diagnosed (logs), fixed, and instituted preventative measures (post-mortem/systemic fix)."
  },
  {
    id: 6,
    title: "Going Above and Beyond",
    text: "Tell me about a time you stepped outside your official role to help the company.",
    options: [
      "I did my manager's job for them.",
      "I noticed the onboarding process for new hires was broken, so I stayed late to write a comprehensive onboarding wiki and created a setup script.",
      "I worked weekends without asking for overtime pay.",
      "I brought donuts to the office."
    ],
    correct: 1,
    aiExplanation: "Impact beyond immediate code. S: Poor onboarding. A: Documented and automated the process. R: Reduced setup time for future hires from days to hours, demonstrating leadership and cultural impact."
  },
  {
    id: 7,
    title: "Pushing Back on Requirements",
    text: "Tell me about a time a stakeholder asked for a feature that was technically unfeasible or a bad idea.",
    options: [
      "I said 'No' and closed the Jira ticket.",
      "I built it exactly as requested, even knowing it would crash the app.",
      "I explained the technical constraints, highlighted the risks, and proposed an alternative solution that achieved their business goal in a safer way.",
      "I ignored the request until they forgot about it."
    ],
    correct: 2,
    aiExplanation: "Shows consultative engineering. A: Educated the stakeholder without being dismissive, understood the underlying business need, and offered a viable alternative."
  },
  {
    id: 8,
    title: "Giving Difficult Feedback",
    text: "Tell me about a time you had to give critical feedback to a peer.",
    options: [
      "I left passive-aggressive comments on their Pull Request.",
      "I complained to our mutual manager.",
      "I asked for a 1-on-1 meeting, used the 'Situation-Behavior-Impact' framework to deliver the feedback privately, and offered to pair-program to help them improve.",
      "I called them out in the team standup so everyone would know."
    ],
    correct: 2,
    aiExplanation: "Constructive feedback requires empathy. A: Private setting, objective framework (SBI), and actionable support (pair-programming). R: Improved peer performance and strengthened trust."
  },
  {
    id: 9,
    title: "Working Under Pressure",
    text: "Describe a situation where you had to work under intense pressure.",
    options: [
      "I drank 5 energy drinks and worked 48 hours straight.",
      "The CEO wanted a demo for an investor in 2 days. I broke the project into micro-tasks, communicated clearly what could be done in 48 hours, and delivered a polished but limited prototype.",
      "I told them the pressure was toxic and threatened to quit.",
      "I rushed the code, deployed with no tests, and hoped it worked."
    ],
    correct: 1,
    aiExplanation: "Pressure requires prioritization. A: Scoped the work, managed expectations upwards, maintained quality on a reduced feature set. R: Successful demo without compromising core stability."
  },
  {
    id: 10,
    title: "A Time You Failed",
    text: "Tell me about a time you failed.",
    options: [
      "I have never failed.",
      "I worked too hard and cared too much.",
      "I over-engineered a feature that users didn't actually want. I learned to build smaller MVPs, measure user engagement, and iterate based on real feedback.",
      "I failed because my team didn't support me."
    ],
    correct: 2,
    aiExplanation: "Interviewers want self-awareness and growth. S/T: Built unwanted feature. A: Recognized the waste, reflected on the cause. R: Changed methodology to MVP/Agile, demonstrating maturity and learning from mistakes."
  }
];

export default function STARMethod({ onClose }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const question = QUESTIONS[currentIdx];

  const handleSelect = (idx) => {
    if (selectedOpt !== null) return;
    setSelectedOpt(idx);
    if (idx === question.correct) setScore(s => s + 1);
  };

  const handleNext = () => {
    if (currentIdx < QUESTIONS.length - 1) {
      setCurrentIdx(c => c + 1);
      setSelectedOpt(null);
    } else setShowResult(true);
  };

  if (showResult) {
    return (
      <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', padding: '40px 20px' }}>
        <div style={{ fontSize: '64px', marginBottom: '24px' }}>⭐</div>
        <h2 style={{ fontSize: '28px', color: 'var(--color-text-1)', marginBottom: '16px' }}>Interview Complete</h2>
        <div style={{ fontSize: '48px', fontWeight: 900, color: 'var(--color-accent)', marginBottom: '24px' }}>
          {score} / {QUESTIONS.length}
        </div>
        <p style={{ fontSize: '15px', color: 'var(--color-text-2)', lineHeight: 1.6, marginBottom: '32px' }}>
          The STAR method (Situation, Task, Action, Result) helps you structure your behavioral answers perfectly. Review the AI feedback to refine your stories.
        </p>
        <button onClick={() => { setCurrentIdx(0); setScore(0); setShowResult(false); setSelectedOpt(null); }} style={{ padding: '14px 32px', background: 'var(--color-text-1)', color: 'var(--color-base)', borderRadius: '12px', fontSize: '15px', fontWeight: 800, border: 'none', cursor: 'pointer', marginRight: '12px' }}>
          Practice Again
        </button>
        {onClose && (
          <button onClick={onClose} style={{ padding: '14px 32px', background: 'var(--color-surface)', color: 'var(--color-text-1)', border: '1px solid var(--color-border)', borderRadius: '12px', fontSize: '15px', fontWeight: 800, cursor: 'pointer' }}>
            Exit
          </button>
        )}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '80px 20px 40px', height: '100%', overflowY: 'auto', position: 'relative' }}>
      {onClose && (
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: '24px', right: '20px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '99px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-1)', cursor: 'pointer', fontSize: '13px', fontWeight: 600, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', transition: 'all 0.2s', zIndex: 100 }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <span>←</span> Back to Lab
        </button>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text-3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Scenario {currentIdx + 1} of {QUESTIONS.length}
        </div>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--color-accent)' }}>Score: {score}</div>
        </div>
      </div>

      <div style={{ fontSize: '36px', fontWeight: 800, color: 'var(--color-text-1)', marginBottom: '24px', lineHeight: 1.3 }}>{question.title}</div>
      <div style={{ fontSize: '22px', color: 'var(--color-text-2)', marginBottom: '40px', lineHeight: 1.6, fontStyle: 'italic', borderLeft: '4px solid var(--color-border)', paddingLeft: '24px' }}>"{question.text}"</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
        {question.options.map((opt, idx) => {
          let bg = 'var(--color-surface)';
          let border = 'var(--color-border)';
          let text = 'var(--color-text-1)';
          if (selectedOpt !== null) {
            if (idx === question.correct) {
              bg = 'rgba(34, 197, 94, 0.1)'; border = '#22C55E'; text = '#22C55E';
            } else if (idx === selectedOpt) {
              bg = 'rgba(239, 68, 68, 0.1)'; border = '#EF4444'; text = '#EF4444';
            }
          }
          return (
            <button
              key={idx} onClick={() => handleSelect(idx)} disabled={selectedOpt !== null}
              style={{
                width: '100%', padding: '24px 32px', background: bg, border: `2px solid ${border}`,
                borderRadius: '16px', textAlign: 'left', fontSize: '20px', fontWeight: 600, color: text,
                cursor: selectedOpt === null ? 'pointer' : 'default', transition: 'all 0.2s',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', lineHeight: 1.5
              }}
            >
              {opt}
              {selectedOpt !== null && idx === question.correct && <span>✓</span>}
              {selectedOpt !== null && idx === selectedOpt && idx !== question.correct && <span>✕</span>}
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedOpt !== null && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: 32 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ background: 'rgba(236, 72, 153, 0.05)', border: '1px solid rgba(236, 72, 153, 0.2)', borderRadius: '16px', padding: '24px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: '#EC4899' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#DB2777', fontWeight: 800, fontSize: '15px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <span style={{ fontSize: '20px' }}>✨</span> AI Interview Coach
              </div>
              <div style={{ fontSize: '18px', color: 'var(--color-text-1)', lineHeight: 1.6 }}>{question.aiExplanation}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {selectedOpt !== null && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingBottom: '40px' }}>
          <button onClick={handleNext} style={{ padding: '16px 40px', background: 'var(--color-text-1)', color: 'var(--color-base)', borderRadius: '12px', fontSize: '18px', fontWeight: 800, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {currentIdx < QUESTIONS.length - 1 ? 'Next Question →' : 'View Results'}
          </button>
        </div>
      )}
    </div>
  );
}
