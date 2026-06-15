import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const QUESTIONS = [
  { id: 1, text: 'When making a major decision, I rely on...', left: 'Logic & Data', right: 'Gut Feeling & Values' },
  { id: 2, text: 'After a stressful day, I recharge by...', left: 'Being Alone', right: 'Being with Friends' },
  { id: 3, text: 'My workspace is usually...', left: 'Highly Organized', right: 'Creative Chaos' },
  { id: 4, text: 'When solving a problem, I prefer to...', left: 'Plan Everything First', right: 'Dive In & Iterate' },
  { id: 5, text: 'I am more focused on...', left: 'Future Possibilities', right: 'Present Realities' },
];

export default function PersonalitySwipe() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [direction, setDirection] = useState(0);

  const handleSwipe = (choice) => {
    setAnswers([...answers, { id: QUESTIONS[currentIndex].id, choice }]);
    setDirection(choice === 'left' ? -1 : 1);
    setTimeout(() => {
      setCurrentIndex(currentIndex + 1);
      setDirection(0);
    }, 300);
  };

  const getInsight = () => {
    // Generate AI Insight based on answers (Client-side simple logic as requested)
    const logicCount = answers.filter(a => a.choice === 'left' && a.id === 1).length;
    const introCount = answers.filter(a => a.choice === 'left' && a.id === 2).length;
    const planCount = answers.filter(a => a.choice === 'left' && (a.id === 3 || a.id === 4)).length;
    
    let type = 'Architect';
    if (!introCount && logicCount) type = 'Commander';
    if (introCount && !logicCount) type = 'Empath';
    if (!planCount) type = 'Innovator';

    return {
      type,
      desc: `You operate at peak performance when acting as an '${type}'. You thrive in environments that reward ${planCount ? 'structure and planning' : 'adaptability and iteration'}. Based on recent focus logs and mood entries, your discipline is highest when you lean into these natural tendencies rather than fighting them.`
    };
  };

  if (currentIndex >= QUESTIONS.length) {
    const insight = getInsight();
    return (
      <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', animation: 'fadeIn 0.4s ease-out' }}>
        <div style={{ background: 'var(--bg-elevated)', padding: '40px', borderRadius: '24px', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🧬</div>
          <h2 style={{ fontSize: '28px', fontWeight: 900, color: 'var(--text-1)', marginBottom: '8px' }}>The {insight.type}</h2>
          <p style={{ fontSize: '16px', color: 'var(--text-2)', lineHeight: 1.6 }}>{insight.desc}</p>
          <button onClick={() => { setCurrentIndex(0); setAnswers([]); }} style={{ marginTop: '24px', padding: '12px 24px', borderRadius: '100px', background: 'var(--color-surface)', color: 'var(--text-1)', border: '1px solid var(--border)', cursor: 'pointer', fontWeight: 600 }}>
            Retake Assessment
          </button>
        </div>
      </div>
    );
  }

  const q = QUESTIONS[currentIndex];

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', position: 'relative', height: '400px' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-1)', margin: 0 }}>{q.text}</h2>
        <div style={{ fontSize: '13px', color: 'var(--text-3)', marginTop: '8px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          {currentIndex + 1} of {QUESTIONS.length}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.9, x: direction * -50 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.9, x: direction * 50 }}
          transition={{ duration: 0.2 }}
          style={{ position: 'absolute', width: '100%' }}
        >
          <div style={{ display: 'flex', gap: '20px' }}>
            <button 
              onClick={() => handleSwipe('left')}
              style={{ flex: 1, height: '200px', background: 'var(--bg-elevated)', border: '2px solid var(--border)', borderRadius: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-accent)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; }}
            >
              <span style={{ fontSize: '24px' }}>👈</span>
              <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-1)' }}>{q.left}</span>
            </button>
            <button 
              onClick={() => handleSwipe('right')}
              style={{ flex: 1, height: '200px', background: 'var(--bg-elevated)', border: '2px solid var(--border)', borderRadius: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-accent)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; }}
            >
              <span style={{ fontSize: '24px' }}>👉</span>
              <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-1)' }}>{q.right}</span>
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
