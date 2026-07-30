import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import Modal from '../ui/Modal';

/**
 * TriggerModal — Identifies trigger after a streak reset.
 * Cannot be closed until all 3 steps are completed.
 * No X button, no backdrop click to close.
 */
const TRIGGER_TYPES = ['Stress', 'Boredom', 'Social Pressure', 'Physical', 'Other'];
const TIME_OF_DAY = ['Morning', 'Afternoon', 'Evening', 'Late Night'];
const HALT_OPTIONS = ['Hungry', 'Angry', 'Lonely', 'Tired'];

const TriggerModal = ({ isOpen, onSubmit, onCancel }) => {
  const [step, setStep] = useState(1);
  const [triggerType, setTriggerType] = useState([]);
  const [timeOfDay, setTimeOfDay] = useState('');
  const [haltCheck, setHaltCheck] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const canProceed = () => {
    if (step === 1) return triggerType.length > 0;
    if (step === 2) return timeOfDay !== '';
    if (step === 3) return haltCheck.length > 0;
    return false;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await onSubmit({
        trigger_type: triggerType.join(', '),
        time_of_day: timeOfDay,
        hal_check: haltCheck,
      });
      // Show success message for 2 seconds, then close
      setTimeout(() => {
        setStep(1);
        setTriggerType([]);
        setTimeOfDay('');
        setHaltCheck([]);
      }, 2000);
    } catch (err) {
      console.error('Trigger log failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChipToggle = (value, current) => {
    if (current.includes(value)) {
      return current.filter(v => v !== value);
    }
    return [...current, value];
  };

  return (
    <Modal isOpen={isOpen} hideCloseButton maxWidth="520px">
      <AnimatePresence mode="wait">
        {step <= 3 ? (
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            style={{ padding: '8px 0' }}
          >
            {/* Progress indicator */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '28px', justifyContent: 'center' }}>
              {[1, 2, 3].map(i => (
                <div
                  key={i}
                  style={{
                    height: '4px',
                    flex: 1,
                    borderRadius: '2px',
                    background: i <= step ? 'var(--color-accent)' : 'var(--color-border)',
                    transition: 'background 0.3s',
                  }}
                />
              ))}
            </div>

            {/* Step 1: Trigger Type */}
            {step === 1 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <div style={{ padding: '12px', background: 'rgba(239,68,68,0.1)', borderRadius: '50%' }}>
                    <AlertTriangle size={24} color="#EF4444" />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: 'var(--color-text-1)' }}>
                      What triggered the relapse?
                    </h3>
                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-text-3)' }}>
                      Select all that apply
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '20px' }}>
                  {TRIGGER_TYPES.map(type => (
                    <button
                      key={type}
                      onClick={() => setTriggerType(handleChipToggle(type, triggerType))}
                      style={{
                        padding: '12px 20px',
                        borderRadius: '10px',
                        border: triggerType.includes(type)
                          ? '1px solid rgba(239,68,68,0.5)'
                          : '1px solid var(--color-border)',
                        background: triggerType.includes(type) ? 'rgba(239,68,68,0.1)' : 'transparent',
                        color: triggerType.includes(type) ? '#EF4444' : 'var(--color-text-2)',
                        fontSize: '14px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Time of Day */}
            {step === 2 && (
              <div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 800, color: 'var(--color-text-1)' }}>
                  When did it happen?
                </h3>
                <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: 'var(--color-text-3)' }}>
                  Select the time of day
                </p>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {TIME_OF_DAY.map(time => (
                    <button
                      key={time}
                      onClick={() => setTimeOfDay(time)}
                      style={{
                        padding: '14px 24px',
                        borderRadius: '10px',
                        border: timeOfDay === time
                          ? '1px solid var(--color-accent)'
                          : '1px solid var(--color-border)',
                        background: timeOfDay === time ? 'var(--color-accent-dim)' : 'transparent',
                        color: timeOfDay === time ? 'var(--color-accent)' : 'var(--color-text-2)',
                        fontSize: '14px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        flex: '1 1 auto',
                        textAlign: 'center',
                      }}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: HALT Check */}
            {step === 3 && (
              <div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 800, color: 'var(--color-text-1)' }}>
                  HALT Check
                </h3>
                <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: 'var(--color-text-3)' }}>
                  How were you feeling? (Hungry, Angry, Lonely, Tired)
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {HALT_OPTIONS.map(option => (
                    <button
                      key={option}
                      onClick={() => setHaltCheck(handleChipToggle(option, haltCheck))}
                      style={{
                        padding: '12px 20px',
                        borderRadius: '10px',
                        border: haltCheck.includes(option)
                          ? '1px solid rgba(59,130,246,0.5)'
                          : '1px solid var(--color-border)',
                        background: haltCheck.includes(option) ? 'rgba(59,130,246,0.1)' : 'transparent',
                        color: haltCheck.includes(option) ? '#3B82F6' : 'var(--color-text-2)',
                        fontSize: '14px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
              {step > 1 && (
                <button
                  onClick={() => setStep(step - 1)}
                  style={{
                    flex: 1,
                    padding: '14px',
                    background: 'var(--color-base)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: 700,
                    color: 'var(--color-text-2)',
                    cursor: 'pointer',
                  }}
                >
                  Back
                </button>
              )}
              <button
                onClick={step === 3 ? handleSubmit : () => setStep(step + 1)}
                disabled={!canProceed() || submitting}
                style={{
                  flex: step > 1 ? 2 : 1,
                  padding: '14px',
                  background: canProceed() && !submitting ? 'var(--color-accent)' : 'var(--color-base)',
                  border: canProceed() && !submitting ? 'none' : '1px solid var(--color-border)',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: 800,
                  color: canProceed() && !submitting ? '#fff' : 'var(--color-text-3)',
                  cursor: canProceed() && !submitting ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s',
                }}
              >
                {submitting ? 'Saving...' : step === 3 ? 'Submit' : 'Next'}
              </button>
            </div>
          </motion.div>
        ) : (
          /* Success state */
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: 'center', padding: '40px 0' }}
          >
            <div style={{
              padding: '20px',
              background: 'rgba(16,185,129,0.1)',
              borderRadius: '50%',
              width: '64px',
              height: '64px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
            }}>
              <span style={{ fontSize: '32px' }}>✓</span>
            </div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 800, color: 'var(--color-text-1)' }}>
              Data saved
            </h3>
            <p style={{ margin: 0, fontSize: '14px', color: 'var(--color-text-2)', lineHeight: 1.6 }}>
              Over time, we'll identify your patterns.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  );
};

export default TriggerModal;