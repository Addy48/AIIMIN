import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const QUESTIONS = [
  {
    id: 1,
    title: "Scenario: High Memory Usage in Node.js",
    text: "Your Node.js microservice crashes with an OOM (Out of Memory) error under heavy load. You took a heap snapshot and noticed that a massive array of objects is not being garbage collected. What is the most likely cause?",
    options: [
      "The array is declared inside a short-lived function.",
      "The objects are stored in an in-memory cache without a TTL (Time To Live).",
      "V8 Engine memory limit is too low, you just need to increase --max-old-space-size.",
      "You are using synchronous database queries."
    ],
    correct: 1,
    aiExplanation: "In-memory caches without limits or TTLs (Time To Live) will continue to grow indefinitely, holding references to objects and preventing the Garbage Collector from freeing them. While increasing --max-old-space-size delays the crash, it doesn't fix the underlying memory leak."
  },
  {
    id: 2,
    title: "Scenario: Database Deadlock",
    text: "Two concurrent transactions are trying to update the same two rows in a PostgreSQL database, but they acquire the row locks in reverse order. What happens next?",
    options: [
      "Both transactions wait forever.",
      "PostgreSQL detects the deadlock, aborts one transaction, and lets the other proceed.",
      "The database crashes and restarts.",
      "The transactions merge and update both rows simultaneously."
    ],
    correct: 1,
    aiExplanation: "PostgreSQL has a built-in deadlock detector. When it notices a cycle in the lock wait graph (e.g., Transaction A waits for B, and B waits for A), it will automatically abort one of the transactions (usually the one that detects the deadlock first) with an error, allowing the other to proceed."
  },
  {
    id: 3,
    title: "Scenario: Frontend Rendering Optimization",
    text: "You have a React component rendering a massive list of 10,000 items. The browser becomes unresponsive when the user scrolls. How should you fix this?",
    options: [
      "Wrap the list component in React.memo().",
      "Use server-side rendering (SSR) for the list.",
      "Implement windowing/virtualization (e.g., react-window) to only render visible items.",
      "Move the list rendering to a Web Worker."
    ],
    correct: 2,
    aiExplanation: "DOM nodes are expensive. Rendering 10,000 DOM nodes at once will block the main thread. Virtualization (or windowing) solves this by only rendering the 10-20 items currently visible in the viewport, and swapping their data as the user scrolls, keeping the DOM tiny and performant."
  },
  {
    id: 4,
    title: "Scenario: N+1 Query Problem",
    text: "Your GraphQL API is extremely slow when fetching a list of 50 users and their associated posts. Checking the database logs, you see 51 queries were executed. What is the standard solution?",
    options: [
      "Use a GraphQL DataLoader to batch and cache the queries.",
      "Denormalize the database so posts are stored in the user record.",
      "Scale the database vertically.",
      "Turn off database indexing to speed up read times."
    ],
    correct: 0,
    aiExplanation: "The N+1 problem occurs when an application makes 1 query to get a list of items, and N additional queries to fetch related data for each item. A DataLoader batches these N queries into a single query (e.g., SELECT * FROM posts WHERE user_id IN (...)), executing 2 queries total instead of 51."
  },
  {
    id: 5,
    title: "Scenario: Distributed System Split-Brain",
    text: "In a distributed cluster, a network partition isolates half of the nodes from the other half. Both halves elect a new primary node and start accepting writes. What is this phenomenon called?",
    options: [
      "Eventual Consistency",
      "Split-Brain",
      "Byzantine Fault",
      "Thundering Herd"
    ],
    correct: 1,
    aiExplanation: "Split-brain occurs when a cluster loses communication across a partition and both sides act as the 'primary', causing diverging data states. This is typically prevented using consensus algorithms (Raft/Paxos) that require a strict majority (quorum) to elect a leader."
  },
  {
    id: 6,
    title: "Scenario: Thundering Herd",
    text: "A popular cached API response expires. Suddenly, 1,000 concurrent requests miss the cache simultaneously and hit your backend database, knocking it offline. How do you prevent this?",
    options: [
      "Increase the cache TTL to 30 days.",
      "Implement cache stampede prevention using a lock or 'Promise' caching.",
      "Restart the database instance automatically.",
      "Remove caching entirely to ensure predictable load."
    ],
    correct: 1,
    aiExplanation: "This is a cache stampede (or thundering herd). By implementing a lock, the first request that misses the cache acquires a lock and queries the DB. The other 999 requests wait for the first one to repopulate the cache, preventing the database from being overwhelmed."
  },
  {
    id: 7,
    title: "Scenario: Eventual Consistency",
    text: "You post a photo to Instagram. You see it on your feed, but your friend doesn't see it for another 2 seconds. What architectural trade-off is responsible for this?",
    options: [
      "Strong Consistency vs Network Partitioning",
      "Availability and Partition Tolerance over Strong Consistency (CAP Theorem)",
      "Database Deadlocks",
      "Synchronous Replication"
    ],
    correct: 1,
    aiExplanation: "In the CAP Theorem, systems like Instagram choose Availability and Partition Tolerance (AP). Writes are accepted quickly and replicated asynchronously to read replicas. This means the system is Eventually Consistent—users might see stale data for a few seconds, but the system stays highly available."
  },
  {
    id: 8,
    title: "Scenario: Race Condition",
    text: "Two users click 'Buy' on the last remaining ticket for a concert at the exact same millisecond. They both get an order confirmation, but only one ticket existed. What is missing in your backend?",
    options: [
      "Horizontal Scaling",
      "A NoSQL Database",
      "Transactional Locks or Optimistic Concurrency Control (OCC)",
      "A Content Delivery Network (CDN)"
    ],
    correct: 2,
    aiExplanation: "A race condition occurred. To fix this, the database must enforce ACID properties. You can use pessimistic locking (SELECT ... FOR UPDATE) to lock the row during the transaction, or Optimistic Concurrency Control (using version numbers) to fail the second transaction."
  },
  {
    id: 9,
    title: "Scenario: JWT vs Session Tokens",
    text: "A user is banned by an admin, but their mobile app remains logged in and they continue to cause havoc. Your API uses stateless JSON Web Tokens (JWTs). Why is this happening?",
    options: [
      "The JWT algorithm was hacked.",
      "Stateless JWTs cannot be invalidated before they expire unless you maintain a blacklist.",
      "The database is down.",
      "The JWT signature was missing."
    ],
    correct: 1,
    aiExplanation: "Because standard JWTs are stateless, the backend validates the signature locally without checking the database. If a token is valid for 24 hours, the user remains authenticated until it expires. You must use short-lived tokens, maintain a token blacklist (e.g., in Redis), or check user status on critical actions."
  },
  {
    id: 10,
    title: "Scenario: CI/CD Pipeline Failure",
    text: "Your build pipeline passed all unit tests, but broke production because a required environment variable was missing on the production server. What practice prevents this?",
    options: [
      "Writing more unit tests.",
      "Manual deployments via FTP.",
      "Infrastructure as Code (IaC) and configuration validation during deployment.",
      "Disabling environment variables."
    ],
    correct: 2,
    aiExplanation: "Unit tests don't catch environment configuration errors. Infrastructure as Code (e.g., Terraform, Ansible) ensures that environments are reproducible. Additionally, your deployment script should validate that all required environment variables are present before starting the app."
  }
];

export default function TechSimulator({ onClose }) {
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
        <div style={{ fontSize: '64px', marginBottom: '24px' }}>💻</div>
        <h2 style={{ fontSize: '28px', color: 'var(--color-text-1)', marginBottom: '16px' }}>Simulation Complete</h2>
        <div style={{ fontSize: '48px', fontWeight: 900, color: 'var(--color-accent)', marginBottom: '24px' }}>
          {score} / {QUESTIONS.length}
        </div>
        <p style={{ fontSize: '15px', color: 'var(--color-text-2)', lineHeight: 1.6, marginBottom: '32px' }}>
          Understanding the "why" behind system behaviors is key to senior engineering. Check the AI notes for deeper context.
        </p>
        <button onClick={() => { setCurrentIdx(0); setScore(0); setShowResult(false); setSelectedOpt(null); }} style={{ padding: '14px 32px', background: 'var(--color-text-1)', color: 'var(--color-base)', borderRadius: '12px', fontSize: '15px', fontWeight: 800, border: 'none', cursor: 'pointer', marginRight: '12px' }}>
          Restart Simulator
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
      <div style={{ fontSize: '22px', color: 'var(--color-text-2)', marginBottom: '40px', lineHeight: 1.6, background: 'var(--color-surface)', padding: '24px', borderRadius: '12px', border: '1px solid var(--color-border)', fontFamily: 'var(--font-mono)' }}>{question.text}</div>

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
            <div style={{ background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '16px', padding: '24px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: '#F59E0B' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#D97706', fontWeight: 800, fontSize: '15px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <span style={{ fontSize: '20px' }}>✨</span> AI Root Cause Analysis
              </div>
              <div style={{ fontSize: '18px', color: 'var(--color-text-1)', lineHeight: 1.6 }}>{question.aiExplanation}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {selectedOpt !== null && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingBottom: '40px' }}>
          <button onClick={handleNext} style={{ padding: '16px 40px', background: 'var(--color-text-1)', color: 'var(--color-base)', borderRadius: '12px', fontSize: '18px', fontWeight: 800, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {currentIdx < QUESTIONS.length - 1 ? 'Next Scenario →' : 'View Results'}
          </button>
        </div>
      )}
    </div>
  );
}
