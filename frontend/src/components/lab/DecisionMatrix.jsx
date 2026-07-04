import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateWithGemini } from '../../utils/serverAi';

export default function DecisionMatrix({ onBack }) {
  const [step, setStep] = useState(0);
  const [dilemma, setDilemma] = useState('');
  const [inversion, setInversion] = useState('');
  const [secondOrder, setSecondOrder] = useState('');
  const [regret, setRegret] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiSynthesis, setAiSynthesis] = useState('');
  const [error, setError] = useState('');
  
  const steps = [
    {
      title: "The Dilemma",
      subtitle: "What is the specific, high-stakes decision you are facing?",
      placeholder: "e.g., Should I quit my job to start a company?",
      value: dilemma,
      setter: setDilemma,
      icon: "🤔",
      color: "#3B82F6"
    },
    {
      title: "Inversion (Worst-Case)",
      subtitle: "If you make this choice and it goes completely wrong, what does that look like? How can you prevent it?",
      placeholder: "e.g., I run out of money in 6 months. Prevention: Save 12 months runway first.",
      value: inversion,
      setter: setInversion,
      icon: "🔄",
      color: "#EF4444"
    },
    {
      title: "Second-Order Effects",
      subtitle: "What are the consequences 1 month, 1 year, and 5 years from now? Look past the immediate result.",
      placeholder: "e.g., 1M: High stress. 1Y: Product launch. 5Y: Financial independence or back to corporate with new skills.",
      value: secondOrder,
      setter: setSecondOrder,
      icon: "🦋",
      color: "#10B981"
    },
    {
      title: "Regret Minimization",
      subtitle: "Project yourself to age 80. Will you regret NOT making this choice?",
      placeholder: "e.g., Yes, I would always wonder 'what if' I never tried to build my own thing.",
      value: regret,
      setter: setRegret,
      icon: "⏳",
      color: "#8B5CF6"
    }
  ];

  const handleNext = () => {
    if (step < steps.length) {
      setStep(step + 1);
    }
  };

  const generateSynthesis = async () => {
    setIsAnalyzing(true);
    setError('');
    setAiSynthesis('');
    
    try {
      const prompt = `You are an elite decision-making strategist. Synthesize this decision matrix bluntly (max 3 paragraphs).

Dilemma: ${dilemma}
Inversion: ${inversion}
Second-Order Effects: ${secondOrder}
Regret Minimization: ${regret}`;

      const text = await generateWithGemini({ prompt, maxTokens: 900, temperature: 0.3 });
      setAiSynthesis(text);
    } catch (err) {
      setError(err.message || 'Failed to synthesize decision');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      style={{ maxWidth: '700px', margin: '0 auto', width: '100%' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem' }}>
        <button 
          onClick={onBack}
          style={{
            background: 'transparent', border: 'none', color: 'var(--color-text-2)',
            cursor: 'pointer', fontSize: '1.25rem', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: '50%'
          }}
        >
          ←
        </button>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-text-1)', margin: 0 }}>Decision Matrix</h2>
          <p style={{ color: 'var(--color-text-3)', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>De-bias your thinking through structured mental models.</p>
        </div>
      </div>

      <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '16px', padding: '2rem', overflow: 'hidden', position: 'relative' }}>
        {/* Progress Bar */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '2rem' }}>
          {steps.map((_, i) => (
            <div key={i} style={{ height: '4px', flex: 1, background: i <= step ? steps[i].color : 'var(--color-border)', borderRadius: '2px', transition: 'background 0.3s ease' }} />
          ))}
          <div style={{ height: '4px', flex: 1, background: step === steps.length ? '#10B981' : 'var(--color-border)', borderRadius: '2px', transition: 'background 0.3s ease' }} />
        </div>

        <AnimatePresence mode="wait">
          {step < steps.length ? (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{steps[step].icon}</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-text-1)', marginBottom: '0.5rem' }}>{steps[step].title}</h3>
              <p style={{ color: 'var(--color-text-2)', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>{steps[step].subtitle}</p>
              
              <textarea
                value={steps[step].value}
                onChange={(e) => steps[step].setter(e.target.value)}
                placeholder={steps[step].placeholder}
                style={{
                  width: '100%', minHeight: '120px', background: 'var(--color-bg)', border: '1px solid var(--color-border)',
                  color: 'var(--color-text-1)', padding: '1rem', borderRadius: '12px', fontSize: '1rem',
                  resize: 'vertical', outline: 'none', transition: 'border-color 0.2s', fontFamily: 'inherit'
                }}
                onFocus={(e) => e.target.style.borderColor = steps[step].color}
                onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button
                  onClick={handleNext}
                  disabled={!steps[step].value.trim()}
                  style={{
                    background: steps[step].value.trim() ? steps[step].color : 'var(--color-border)',
                    color: steps[step].value.trim() ? '#fff' : 'var(--color-text-3)',
                    border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', fontSize: '0.95rem', fontWeight: 500,
                    cursor: steps[step].value.trim() ? 'pointer' : 'not-allowed', transition: 'all 0.2s'
                  }}
                >
                  {step === steps.length - 1 ? 'Analyze Decision' : 'Next Model →'}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              style={{ textAlign: 'center', padding: '2rem 0' }}
            >
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔮</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-text-1)', marginBottom: '1rem' }}>Decision Synthesized</h3>
              <p style={{ color: 'var(--color-text-2)', marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem', lineHeight: 1.6 }}>
                You have processed your dilemma through 3 critical mental models. Review your inputs to ensure your decision is driven by logic, not emotion.
              </p>
              
              <div style={{ textAlign: 'left', background: 'var(--color-bg)', padding: '1.5rem', borderRadius: '12px', border: `1px solid ${steps[0].color}40`, marginBottom: '1rem' }}>
                <strong style={{ color: steps[0].color, display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>The Dilemma</strong>
                <p style={{ margin: 0, color: 'var(--color-text-1)' }}>{dilemma}</p>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                {[1, 2, 3].map(i => (
                  <div key={i} style={{ textAlign: 'left', background: 'var(--color-bg)', padding: '1.25rem', borderRadius: '12px', border: `1px solid ${steps[i].color}40` }}>
                    <strong style={{ color: steps[i].color, display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{steps[i].title}</strong>
                    <p style={{ margin: 0, color: 'var(--color-text-1)', fontSize: '0.9rem', lineHeight: 1.5 }}>{steps[i].value}</p>
                  </div>
                ))}
              </div>

              {/* AI Synthesis Section */}
              <div style={{ textAlign: 'left', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <h4 style={{ margin: 0, color: 'var(--color-text-1)', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.2rem' }}>🧠</span> AI Synthesis
                  </h4>
                  {!aiSynthesis && !isAnalyzing && (
                    <button
                      onClick={generateSynthesis}
                      style={{
                        background: 'var(--color-accent)', color: '#fff', border: 'none', padding: '0.5rem 1rem',
                        borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '6px'
                      }}
                    >
                      Generate Objective Analysis
                    </button>
                  )}
                </div>

                {isAnalyzing && (
                  <div style={{ color: 'var(--color-text-2)', fontSize: '0.95rem', fontStyle: 'italic' }}>
                    Analyzing mental models and searching for cognitive biases...
                  </div>
                )}

                {error && (
                  <div style={{ color: '#EF4444', fontSize: '0.9rem', padding: '0.75rem', background: '#EF444410', borderRadius: '8px' }}>
                    {error}
                  </div>
                )}

                {aiSynthesis && (
                  <div style={{ color: 'var(--color-text-1)', fontSize: '0.95rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                    {aiSynthesis}
                  </div>
                )}
              </div>

              <button
                onClick={() => { setStep(0); setDilemma(''); setInversion(''); setSecondOrder(''); setRegret(''); setAiSynthesis(''); setError(''); }}
                style={{
                  background: 'transparent', border: '1px solid var(--color-border)',
                  color: 'var(--color-text-1)', padding: '0.75rem 1.5rem', borderRadius: '8px', fontSize: '0.95rem',
                  cursor: 'pointer', transition: 'all 0.2s'
                }}
              >
                Start New Decision
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
