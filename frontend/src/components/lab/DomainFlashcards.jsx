import React, { useState } from 'react';
import { motion } from 'framer-motion';

const FLASHCARDS = [
  {
    id: 1,
    term: "CAP Theorem",
    definition: "A concept stating that a distributed data store can only provide two of the following three guarantees simultaneously: Consistency, Availability, and Partition Tolerance.",
    category: "System Design"
  },
  {
    id: 2,
    term: "Idempotency",
    definition: "The property of certain operations in mathematics and computer science whereby they can be applied multiple times without changing the result beyond the initial application (e.g., PUT or DELETE requests in REST).",
    category: "API Design"
  },
  {
    id: 3,
    term: "Closure",
    definition: "In JavaScript, a closure gives you access to an outer function's scope from an inner function. Closures are created every time a function is created, at function creation time.",
    category: "JavaScript"
  },
  {
    id: 4,
    term: "Virtual DOM",
    definition: "A programming concept where an ideal, or 'virtual', representation of a UI is kept in memory and synced with the 'real' DOM by a library such as ReactDOM. This process is called reconciliation.",
    category: "React"
  },
  {
    id: 5,
    term: "Event Loop",
    definition: "The mechanism that allows Node.js to perform non-blocking I/O operations despite being single-threaded, by offloading operations to the system kernel whenever possible.",
    category: "Node.js"
  },
  {
    id: 6,
    term: "ACID Properties",
    definition: "A set of properties of database transactions intended to guarantee data validity despite errors, power failures, etc.: Atomicity, Consistency, Isolation, Durability.",
    category: "Databases"
  },
  {
    id: 7,
    term: "JWT (JSON Web Token)",
    definition: "An open standard (RFC 7519) that defines a compact and self-contained way for securely transmitting information between parties as a JSON object. Often used for stateless authentication.",
    category: "Security"
  },
  {
    id: 8,
    term: "Polymorphism",
    definition: "In object-oriented programming, the ability of different classes to be treated as instances of the same class through inheritance. It allows functions to use objects of different types at different times.",
    category: "OOP"
  },
  {
    id: 9,
    term: "Docker Container",
    definition: "A lightweight, standalone, executable package of software that includes everything needed to run an application: code, runtime, system tools, system libraries and settings.",
    category: "DevOps"
  },
  {
    id: 10,
    term: "Big O Notation",
    definition: "Mathematical notation that describes the limiting behavior of a function when the argument tends towards a particular value or infinity. Used to classify algorithms according to how their run time or space requirements grow as the input size grows.",
    category: "Algorithms"
  }
];

export default function DomainFlashcards({ onClose }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const card = FLASHCARDS[currentIdx];

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIdx(c => (c + 1) % FLASHCARDS.length);
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIdx(c => (c - 1 + FLASHCARDS.length) % FLASHCARDS.length);
    }, 150);
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 20px', height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
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
          Flashcard {currentIdx + 1} of {FLASHCARDS.length}
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', perspective: '1000px' }}>
        <motion.div
          onClick={() => setIsFlipped(!isFlipped)}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
          style={{
            width: '100%',
            maxWidth: '900px',
            height: '550px',
            position: 'relative',
            transformStyle: 'preserve-3d',
            cursor: 'pointer'
          }}
        >
          {/* Front (Term) */}
          <div style={{
            position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden',
            background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '24px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '40px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', textAlign: 'center'
          }}>
            <div style={{ position: 'absolute', top: '32px', left: '32px', fontSize: '16px', fontWeight: 700, color: '#3B82F6', background: 'rgba(59, 130, 246, 0.1)', padding: '10px 20px', borderRadius: '24px' }}>
              {card.category}
            </div>
            <div style={{ fontSize: '56px', fontWeight: 800, color: 'var(--color-text-1)' }}>{card.term}</div>
            <div style={{ position: 'absolute', bottom: '32px', fontSize: '18px', color: 'var(--color-text-3)', fontStyle: 'italic' }}>Click to flip</div>
          </div>

          {/* Back (Definition) */}
          <div style={{
            position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden',
            background: 'var(--color-text-1)', color: 'var(--color-base)', borderRadius: '24px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '60px', transform: 'rotateY(180deg)', textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', lineHeight: 1.6, fontWeight: 500 }}>{card.definition}</div>
          </div>
        </motion.div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '60px', paddingBottom: '20px' }}>
        <button onClick={handlePrev} style={{ padding: '20px 40px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-1)', borderRadius: '16px', fontSize: '20px', fontWeight: 700, cursor: 'pointer' }}>
          ← Previous
        </button>
        <button onClick={handleNext} style={{ padding: '20px 48px', background: 'var(--color-text-1)', border: 'none', color: 'var(--color-base)', borderRadius: '16px', fontSize: '20px', fontWeight: 700, cursor: 'pointer' }}>
          Next Card →
        </button>
      </div>
    </div>
  );
}
