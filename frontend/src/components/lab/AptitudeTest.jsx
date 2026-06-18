import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const QUESTIONS = [
  {
    id: 1,
    text: "Find the next number in the series: 3, 6, 12, 24, ...",
    options: ["36", "48", "30", "42"],
    correct: 1,
    aiExplanation: "This is a geometric sequence where each term is multiplied by 2 to get the next term. 3 × 2 = 6, 6 × 2 = 12, 12 × 2 = 24. Therefore, the next number is 24 × 2 = 48."
  },
  {
    id: 2,
    text: "If A is the brother of B, B is the sister of C, and C is the father of D, how is D related to A?",
    options: ["Nephew/Niece", "Cousin", "Uncle", "Brother"],
    correct: 0,
    aiExplanation: "Let's break it down: A and B are siblings (A is male, B is female). B and C are siblings, which means A, B, and C are all siblings. Since C is the father of D, D is the child of A's brother (C). Therefore, D is A's nephew or niece."
  },
  {
    id: 3,
    text: "A train running at the speed of 60 km/hr crosses a pole in 9 seconds. What is the length of the train?",
    options: ["120 meters", "180 meters", "324 meters", "150 meters"],
    correct: 3,
    aiExplanation: "First, convert the speed from km/hr to m/s: 60 × (5/18) = 50/3 m/s. The distance covered by the train in 9 seconds (which equals its own length) is Speed × Time = (50/3) × 9 = 150 meters."
  },
  {
    id: 4,
    text: "Look at this series: 7, 10, 8, 11, 9, 12, ... What number should come next?",
    options: ["7", "10", "12", "13"],
    correct: 1,
    aiExplanation: "This is an alternating addition and subtraction series. The pattern is: +3, -2, +3, -2. So, 7+3=10, 10-2=8, 8+3=11, 11-2=9, 9+3=12. Following this, the next step is 12-2=10."
  },
  {
    id: 5,
    text: "If 5 machines take 5 minutes to make 5 widgets, how long would it take 100 machines to make 100 widgets?",
    options: ["100 minutes", "5 minutes", "20 minutes", "1 minute"],
    correct: 1,
    aiExplanation: "It takes 1 machine 5 minutes to make 1 widget (the rate is 1 widget per machine per 5 minutes). Therefore, 100 machines working simultaneously will also take exactly 5 minutes to make 100 widgets."
  },
  {
    id: 6,
    text: "Which word does NOT belong with the others?",
    options: ["Leopard", "Cougar", "Elephant", "Lion"],
    correct: 2,
    aiExplanation: "Leopard, Cougar, and Lion are all felines (cats), whereas an Elephant is a pachyderm. Therefore, Elephant is the odd one out."
  },
  {
    id: 7,
    text: "Odometer is to mileage as compass is to:",
    options: ["Speed", "Hiking", "Needle", "Direction"],
    correct: 3,
    aiExplanation: "An odometer is an instrument used to measure mileage. Similarly, a compass is an instrument used to determine direction."
  },
  {
    id: 8,
    text: "If SOME cats are dogs, and ALL dogs are birds, which of the following MUST be true?",
    options: ["All cats are birds", "Some cats are birds", "No cats are birds", "All birds are dogs"],
    correct: 1,
    aiExplanation: "Since some cats are dogs, and all of those dogs are birds, it logically follows that those specific cats (which are dogs) must also be birds. Hence, some cats are birds."
  },
  {
    id: 9,
    text: "A clock shows the time as 3:15. What is the angle between the hour and the minute hands?",
    options: ["0 degrees", "7.5 degrees", "15 degrees", "22.5 degrees"],
    correct: 1,
    aiExplanation: "The minute hand is exactly at 3 (90 degrees from 12). The hour hand moves 30 degrees every hour, and in 15 minutes, it moves (15/60) × 30 = 7.5 degrees past the 3. Thus, the angle between them is 7.5 degrees."
  },
  {
    id: 10,
    text: "Which number replaces the question mark in the sequence: 2, 5, 11, 23, 47, ?",
    options: ["94", "95", "96", "97"],
    correct: 1,
    aiExplanation: "The pattern is multiply by 2 and add 1. (2×2)+1=5, (5×2)+1=11, (11×2)+1=23, (23×2)+1=47. Therefore, (47×2)+1 = 95."
  }
];

export default function AptitudeTest({ onClose }) {
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
        <div style={{ fontSize: '64px', marginBottom: '24px' }}>🎯</div>
        <h2 style={{ fontSize: '28px', color: 'var(--color-text-1)', marginBottom: '16px' }}>Test Complete</h2>
        <div style={{ fontSize: '48px', fontWeight: 900, color: 'var(--color-accent)', marginBottom: '24px' }}>
          {score} / {QUESTIONS.length}
        </div>
        <p style={{ fontSize: '15px', color: 'var(--color-text-2)', lineHeight: 1.6, marginBottom: '32px' }}>
          Consistent practice improves pattern recognition. Review the AI explanations for the questions you missed.
        </p>
        <button onClick={() => { setCurrentIdx(0); setScore(0); setShowResult(false); setSelectedOpt(null); }} style={{ padding: '14px 32px', background: 'var(--color-text-1)', color: 'var(--color-base)', borderRadius: '12px', fontSize: '15px', fontWeight: 800, border: 'none', cursor: 'pointer', marginRight: '12px' }}>
          Retry Test
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '80px 20px 40px', height: '100%', overflowY: 'auto', position: 'relative' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text-3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Question {currentIdx + 1} of {QUESTIONS.length}
        </div>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--color-accent)' }}>Score: {score}</div>
        </div>
      </div>

      <div style={{ fontSize: '36px', fontWeight: 700, color: 'var(--color-text-1)', marginBottom: '40px', lineHeight: 1.5 }}>
        {question.text}
      </div>

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
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
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
            <div style={{ background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '16px', padding: '24px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: '#3B82F6' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#3B82F6', fontWeight: 800, fontSize: '15px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <span style={{ fontSize: '20px' }}>✨</span> AI Explanation
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
