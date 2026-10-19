import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { apiPost } from '../../utils/api';

import Modal from '../ui/Modal';

const QUESTIONS = [
  "I have felt cheerful and in good spirits",
  "I have felt calm and relaxed",
  "I have felt active and vigorous",
  "I woke up feeling fresh and rested",
  "My daily life has been filled with things that interest me"
];

const OPTIONS = [
  { value: 5, label: "All of the time" },
  { value: 4, label: "Most of the time" },
  { value: 3, label: "More than half of the time" },
  { value: 2, label: "Less than half of the time" },
  { value: 1, label: "Some of the time" },
  { value: 0, label: "At no time" }
];

export default function PulseCheckModal({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    if (!user || user.isGuest) return;
    
    // Check if today is Sunday
    const now = new Date();
    if (now.getDay() !== 0) return; // 0 is Sunday
    
    // Check if already completed this week
    const lastCompleted = localStorage.getItem('aiimin_last_pulse_check');
    if (lastCompleted) {
      const lastDate = new Date(lastCompleted);
      // If it was completed in the last 6 days, don't show
      if (now.getTime() - lastDate.getTime() < 6 * 86400000) {
        return;
      }
    }
    
    // Show after 2 seconds
    const timer = setTimeout(() => setIsOpen(true), 2000);
    return () => clearTimeout(timer);
  }, [user]);

  const handleAnswer = (val) => {
    const newAnswers = [...answers, val];
    setAnswers(newAnswers);
    
    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      // Finished
      const totalScore = newAnswers.reduce((a, b) => a + b, 0) * 4; // Max 100
      console.log('WHO-5 Score:', totalScore);
      localStorage.setItem('aiimin_last_pulse_check', new Date().toISOString());
      
      // Attempt to save to API (silent fail if no endpoint yet)
      try {
        apiPost('/user/pulse-check', { score: totalScore, answers: newAnswers });
      } catch (e) {}
      
      setIsOpen(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Weekly Pulse Check" maxWidth="400px">
        <h3 style={{ margin: '0 0 24px 0', fontSize: '20px', fontWeight: 800 }}>
          Over the last two weeks...
        </h3>
        
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '13px', color: 'var(--color-text-1)', marginBottom: '16px', fontWeight: 600 }}>
            Question {currentQ + 1} of 5
          </div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text-1)' }}>
            "{QUESTIONS[currentQ]}"
          </div>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleAnswer(opt.value)}
              style={{
                background: 'var(--color-elevated)', border: '2px solid var(--color-border)', borderRadius: '12px',
                padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: 600, color: 'var(--color-text-1)',
                cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '12px',
                minHeight: '48px',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-accent)'; e.currentTarget.style.background = 'var(--color-surface)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.background = 'var(--color-elevated)'; }}
            >
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--color-surface)', border: '2px solid var(--color-text-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800, color: 'var(--color-text-1)', flexShrink: 0 }}>
                {opt.value}
              </div>
              {opt.label}
            </button>
          ))}
        </div>
    </Modal>
  );
}
