import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, RefreshCw, Send, BrainCircuit, CheckCircle2 } from 'lucide-react';

const QUESTIONS = [
  {
    title: "Conflict with a Team Member",
    text: "Tell me about a time you disagreed with a colleague on a technical decision. How did you handle it?",
  },
  {
    title: "Failing to Meet a Deadline",
    text: "Tell me about a time you realized you were not going to meet a project deadline. What did you do?",
  },
  {
    title: "Overcoming a Steep Learning Curve",
    text: "Describe a situation where you had to learn a new technology or domain very quickly to complete a task.",
  },
  {
    title: "Handling Ambiguity",
    text: "Tell me about a time you were given a task with very vague requirements.",
  },
  {
    title: "Dealing with a Production Incident",
    text: "Tell me about a time your code broke production. How did you react?",
  },
  {
    title: "Going Above and Beyond",
    text: "Tell me about a time you stepped outside your official role to help the company.",
  },
  {
    title: "Pushing Back on Requirements",
    text: "Tell me about a time a stakeholder asked for a feature that was technically unfeasible or a bad idea.",
  },
  {
    title: "Giving Difficult Feedback",
    text: "Tell me about a time you had to give critical feedback to a peer.",
  },
  {
    title: "Working Under Pressure",
    text: "Describe a situation where you had to work under intense pressure.",
  },
  {
    title: "A Time You Failed",
    text: "Tell me about a time you failed.",
  }
];

export default function STARMethod({ onClose }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [starResponse, setStarResponse] = useState({ s: '', t: '', a: '', r: '' });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  
  const question = QUESTIONS[currentIdx];
  const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

  const handleAnalyze = async () => {
    const combinedResponse = `Situation: ${starResponse.s}\nTask: ${starResponse.t}\nAction: ${starResponse.a}\nResult: ${starResponse.r}`;
    if (!starResponse.s.trim() && !starResponse.t.trim() && !starResponse.a.trim() && !starResponse.r.trim()) return;
    if (!GEMINI_API_KEY) {
      setFeedback("API Key missing. Cannot analyze.");
      return;
    }
    
    setIsAnalyzing(true);

    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: "You are an expert tech interviewer and career coach. The user is practicing the STAR method (Situation, Task, Action, Result) for behavioral interviews. You will be given the interviewer's question, and the user's response. Evaluate the response strictly based on the STAR method framework. Provide a score out of 10. Keep your feedback highly constructive, actionable, and formatted cleanly. Point out what was good, and what was missing (e.g., if they forgot the 'Result' part). Return a JSON response with two keys: 'score' (number) and 'feedback' (string with markdown or text)." }]
          },
          generationConfig: { responseMimeType: "application/json" },
          contents: [{
            role: "user",
            parts: [{ text: `Question: ${question.text}\nUser Response:\n${combinedResponse}` }]
          }]
        })
      });

      const data = await res.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (rawText) {
         const parsed = JSON.parse(rawText);
         setFeedback(parsed.feedback);
         setScore(parsed.score);
      }
    } catch (err) {
      console.error(err);
      setFeedback("Failed to analyze response. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleNext = () => {
    if (currentIdx < QUESTIONS.length - 1) {
      setCurrentIdx(c => c + 1);
      setStarResponse({ s: '', t: '', a: '', r: '' });
      setFeedback(null);
      setScore(0);
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '60px 20px 40px', height: '100%', overflowY: 'auto', position: 'relative' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text-3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Behavioral Scenario {currentIdx + 1} of {QUESTIONS.length}
        </div>
      </div>

      <div style={{ fontSize: '36px', fontWeight: 800, color: 'var(--color-text-1)', marginBottom: '16px', lineHeight: 1.3 }}>
        {question.title}
      </div>
      <div style={{ fontSize: '22px', color: 'var(--color-text-2)', marginBottom: '40px', lineHeight: 1.6, fontStyle: 'italic', borderLeft: '4px solid var(--color-border)', paddingLeft: '24px' }}>
        "{question.text}"
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '40px' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '16px', padding: '20px' }}>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#3B82F6', marginBottom: '8px' }}>S - Situation</div>
                <div style={{ fontSize: '13px', color: 'var(--color-text-3)', marginBottom: '16px' }}>Set the scene and give the necessary details of your example.</div>
                <textarea
                  value={starResponse.s}
                  onChange={(e) => setStarResponse({ ...starResponse, s: e.target.value })}
                  placeholder="e.g., We were launching a new feature and..."
                  disabled={isAnalyzing || feedback !== null}
                  style={{ width: '100%', minHeight: '120px', padding: '16px', background: 'var(--color-elevated)', border: '1px solid var(--color-border)', borderRadius: '12px', fontSize: '15px', color: 'var(--color-text-1)', lineHeight: 1.5, resize: 'vertical', outline: 'none', transition: 'all 0.2s', opacity: (isAnalyzing || feedback) ? 0.7 : 1 }}
                />
            </div>

            <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '16px', padding: '20px' }}>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#F59E0B', marginBottom: '8px' }}>T - Task</div>
                <div style={{ fontSize: '13px', color: 'var(--color-text-3)', marginBottom: '16px' }}>Describe your responsibility in that situation.</div>
                <textarea
                  value={starResponse.t}
                  onChange={(e) => setStarResponse({ ...starResponse, t: e.target.value })}
                  placeholder="e.g., I was responsible for migrating the database..."
                  disabled={isAnalyzing || feedback !== null}
                  style={{ width: '100%', minHeight: '120px', padding: '16px', background: 'var(--color-elevated)', border: '1px solid var(--color-border)', borderRadius: '12px', fontSize: '15px', color: 'var(--color-text-1)', lineHeight: 1.5, resize: 'vertical', outline: 'none', transition: 'all 0.2s', opacity: (isAnalyzing || feedback) ? 0.7 : 1 }}
                />
            </div>

            <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '16px', padding: '20px' }}>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#10B981', marginBottom: '8px' }}>A - Action</div>
                <div style={{ fontSize: '13px', color: 'var(--color-text-3)', marginBottom: '16px' }}>Explain exactly what steps you took to address it.</div>
                <textarea
                  value={starResponse.a}
                  onChange={(e) => setStarResponse({ ...starResponse, a: e.target.value })}
                  placeholder="e.g., I organized a standup, broke down the tickets..."
                  disabled={isAnalyzing || feedback !== null}
                  style={{ width: '100%', minHeight: '120px', padding: '16px', background: 'var(--color-elevated)', border: '1px solid var(--color-border)', borderRadius: '12px', fontSize: '15px', color: 'var(--color-text-1)', lineHeight: 1.5, resize: 'vertical', outline: 'none', transition: 'all 0.2s', opacity: (isAnalyzing || feedback) ? 0.7 : 1 }}
                />
            </div>

            <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '16px', padding: '20px' }}>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#8B5CF6', marginBottom: '8px' }}>R - Result</div>
                <div style={{ fontSize: '13px', color: 'var(--color-text-3)', marginBottom: '16px' }}>Share what outcomes your actions achieved.</div>
                <textarea
                  value={starResponse.r}
                  onChange={(e) => setStarResponse({ ...starResponse, r: e.target.value })}
                  placeholder="e.g., We launched 2 days early and increased retention by 15%..."
                  disabled={isAnalyzing || feedback !== null}
                  style={{ width: '100%', minHeight: '120px', padding: '16px', background: 'var(--color-elevated)', border: '1px solid var(--color-border)', borderRadius: '12px', fontSize: '15px', color: 'var(--color-text-1)', lineHeight: 1.5, resize: 'vertical', outline: 'none', transition: 'all 0.2s', opacity: (isAnalyzing || feedback) ? 0.7 : 1 }}
                />
            </div>
        </div>

        <div style={{ position: 'relative', display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
            {(!feedback && !isAnalyzing) && (
              <button
                onClick={handleAnalyze}
                disabled={!starResponse.s.trim() && !starResponse.t.trim() && !starResponse.a.trim() && !starResponse.r.trim()}
                style={{
                  padding: '16px 32px',
                  background: (starResponse.s.trim() || starResponse.t.trim() || starResponse.a.trim() || starResponse.r.trim()) ? 'var(--color-accent)' : 'var(--color-surface-hover)',
                  color: (starResponse.s.trim() || starResponse.t.trim() || starResponse.a.trim() || starResponse.r.trim()) ? '#fff' : 'var(--color-text-3)',
                  borderRadius: '100px',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '16px',
                  cursor: (starResponse.s.trim() || starResponse.t.trim() || starResponse.a.trim() || starResponse.r.trim()) ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  transition: 'all 0.2s',
                  boxShadow: (starResponse.s.trim() || starResponse.t.trim() || starResponse.a.trim() || starResponse.r.trim()) ? '0 10px 30px rgba(99, 179, 237, 0.3)' : 'none'
                }}
              >
                <BrainCircuit size={20} /> Analyze my STAR Response
              </button>
            )}
        </div>

      </div>

      <AnimatePresence>
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden', marginBottom: '32px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '24px', background: 'var(--color-surface)', borderRadius: '16px', border: '1px solid var(--color-border)' }}>
              <RefreshCw size={24} color="var(--color-accent)" className="animate-spin" />
              <div style={{ fontSize: '18px', color: 'var(--color-text-1)', fontWeight: 600 }}>AI is evaluating your response...</div>
            </div>
          </motion.div>
        )}

        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '16px', padding: '32px', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: '#3B82F6', borderRadius: '16px 0 0 16px' }} />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#3B82F6', fontWeight: 800, fontSize: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <Sparkles size={24} /> AI Interview Coach
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '36px', fontWeight: 900, color: 'var(--color-text-1)', lineHeight: 1 }}>{score}<span style={{ fontSize: '20px', color: 'var(--color-text-3)' }}>/10</span></div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-2)', textTransform: 'uppercase', fontWeight: 700, marginTop: '4px' }}>STAR Score</div>
                </div>
              </div>
              
              <div style={{ fontSize: '18px', color: 'var(--color-text-1)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                  {feedback}
              </div>

              <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
                 <button 
                    onClick={() => { setFeedback(null); setStarResponse({ s: '', t: '', a: '', r: '' }); setScore(0); }}
                    style={{ padding: '14px 28px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-1)', borderRadius: '100px', fontSize: '16px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}
                 >
                    Try Again
                 </button>
                 
                 {currentIdx < QUESTIONS.length - 1 && (
                    <button 
                        onClick={handleNext} 
                        style={{ padding: '14px 28px', background: 'var(--color-text-1)', border: 'none', color: 'var(--color-base)', borderRadius: '100px', fontSize: '16px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s' }}
                    >
                        Next Scenario <ArrowRight size={18} />
                    </button>
                 )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
