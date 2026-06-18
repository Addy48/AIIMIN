import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const QUESTIONS = [
  {
    id: 1,
    title: "Design a URL Shortener (like TinyURL)",
    text: "You are designing a URL shortening service. Which base encoding is typically used to convert the unique database integer ID into the short string, and why?",
    options: [
      "Base2 (Binary) - to save space in the database.",
      "Base10 (Decimal) - because it is easiest to parse.",
      "Base62 - using [A-Z, a-z, 0-9] provides a very short string for billions of URLs while avoiding special characters.",
      "Base64 - standard encoding used for all web URLs."
    ],
    correct: 2,
    aiExplanation: "Base62 uses 62 characters (26 lowercase, 26 uppercase, 10 digits). A 7-character Base62 string can encode 62^7 (~3.5 trillion) unique URLs. Unlike Base64, Base62 omits characters like '+' and '/' which are not URL-safe and require URL encoding."
  },
  {
    id: 2,
    title: "Design Twitter Newsfeed",
    text: "A celebrity with 50 million followers tweets. If you use a 'push' (fanout-on-write) model to update every follower's newsfeed timeline in a database, it causes massive lag. What is the standard solution for this?",
    options: [
      "Switch entirely to a 'pull' (fanout-on-load) model for all users.",
      "Use a hybrid model: Push for normal users, but Pull (on-demand merge) for celebrities.",
      "Increase the size of the database connection pool.",
      "Cache the 50 million feeds in Redis."
    ],
    correct: 1,
    aiExplanation: "This is known as the 'Justin Bieber problem'. Pushing a tweet to 50M timelines takes too long and wastes resources. Instead, a hybrid approach is used: the celebrity's tweet is NOT pushed. When a user loads their feed, the system 'pulls' the celebrity's tweet and merges it with their pre-computed (pushed) feed in memory."
  },
  {
    id: 3,
    title: "Design a Rate Limiter",
    text: "You need to implement a distributed rate limiter that allows 10 requests per minute per IP. Which algorithm provides a smooth rate limit without burst issues at the start of a new minute window?",
    options: [
      "Fixed Window Counter",
      "Sliding Window Log",
      "Token Bucket or Leaky Bucket",
      "Round Robin"
    ],
    correct: 2,
    aiExplanation: "Fixed Window allows bursts at the edges (e.g., 10 requests at 1:00:59 and 10 at 1:01:01, totaling 20 in 2 seconds). Sliding Window Log is memory intensive. Token Bucket provides a smooth rate limit, allows short bursts up to the bucket capacity, and is highly efficient to implement in Redis using Lua scripts."
  },
  {
    id: 4,
    title: "Design a Web Crawler",
    text: "Your distributed web crawler needs to ensure it does not crawl the same URL twice. With billions of URLs, storing them in a standard hash set requires too much memory. What data structure should you use?",
    options: [
      "B-Tree",
      "Bloom Filter",
      "Linked List",
      "Trie"
    ],
    correct: 1,
    aiExplanation: "A Bloom Filter is a highly space-efficient probabilistic data structure. It can tell you if an element is 'definitely not' in the set or 'possibly' in the set. False positives might cause you to skip a URL occasionally, but it saves gigabytes of RAM when checking billions of URLs."
  },
  {
    id: 5,
    title: "Design a Key-Value Store",
    text: "In a distributed NoSQL database like Cassandra or DynamoDB, how is data partitioned across multiple servers so that adding or removing a node requires minimal data movement?",
    options: [
      "Consistent Hashing",
      "Modulo Hashing (Hash % N)",
      "Alphabetical Range Partitioning",
      "Round Robin"
    ],
    correct: 0,
    aiExplanation: "Modulo hashing requires moving almost all data when a node is added (because N changes). Consistent Hashing maps both data and servers to a logical ring. When a node is added or removed, only the data mapped to that specific node (and its immediate neighbor) needs to be moved."
  },
  {
    id: 6,
    title: "Design YouTube (Video Storage)",
    text: "Users upload 500 hours of video to YouTube every minute. Video files are huge. Where should these actual video files be stored?",
    options: [
      "In a relational database (PostgreSQL) as BLOBs.",
      "In a NoSQL database (MongoDB) using GridFS.",
      "In an Object Store (like AWS S3 or Google Cloud Storage).",
      "In local server hard drives."
    ],
    correct: 2,
    aiExplanation: "Relational and NoSQL databases are optimized for structured/semi-structured data and queries, not massive binary files. Object storage (S3/GCS) is designed specifically for unstructured data, offering infinite scalability, high durability, and direct integration with CDNs for fast video streaming."
  },
  {
    id: 7,
    title: "Design WhatsApp (Chat History)",
    text: "WhatsApp needs to store billions of chat messages. Queries are always 'Give me the most recent messages for Chat X'. Which database architecture is best suited for this access pattern?",
    options: [
      "A normalized PostgreSQL database with heavy joins.",
      "A Wide-Column Store (like Cassandra or HBase) partitioned by Chat ID and sorted by Timestamp.",
      "A Graph Database (like Neo4j).",
      "An In-Memory Database (like Redis) with disk persistence."
    ],
    correct: 1,
    aiExplanation: "Wide-column stores excel at time-series and sequential data. By partitioning on the Chat ID, all messages for a chat are stored together on the same node. By clustering (sorting) on the timestamp in descending order, fetching the most recent 50 messages is a highly efficient O(1) sequential disk read."
  },
  {
    id: 8,
    title: "Design Uber/Lyft (Location Tracking)",
    text: "Millions of drivers send their GPS coordinates every 5 seconds. How should you index this spatial data to quickly find drivers near a rider?",
    options: [
      "Use a standard B-Tree index on latitude and longitude columns.",
      "Use Geohash, S2 Geometry, or QuadTrees to map 2D coordinates into a 1D string/integer.",
      "Use a HashMap with the Driver ID as the key.",
      "Calculate the Haversine distance for all drivers in the database on every request."
    ],
    correct: 1,
    aiExplanation: "Standard B-Trees cannot efficiently query 2D space. Spatial indexing (Geohash, S2, QuadTrees) divides the Earth into grids. Nearby locations share the same prefix (e.g., Geohash '9q8yy'). Finding nearby drivers becomes a simple and fast string prefix match in the database or Redis."
  },
  {
    id: 9,
    title: "Design Ticketmaster",
    text: "Taylor Swift tickets go on sale. 1 million people try to buy 50,000 tickets at exactly 10:00 AM. What is the best way to handle this massive concurrent write surge?",
    options: [
      "Write directly to a MySQL database and let ACID transactions handle it.",
      "Use a Message Queue (like Kafka or RabbitMQ) to buffer the requests and process them asynchronously.",
      "Scale up the web servers to 10,000 instances.",
      "Put the database in read-only mode."
    ],
    correct: 1,
    aiExplanation: "Direct writes to a database during a massive surge will cause connection pool exhaustion and lock contention, bringing the database down. A Message Queue acts as a shock absorber. The web servers quickly push the request to the queue (fast) and return 'Processing'. Worker nodes then consume the queue at a rate the database can safely handle."
  },
  {
    id: 10,
    title: "Design a Typeahead/Autocomplete System",
    text: "When a user types 'sys' in a search bar, you want to suggest 'system design', 'systemctl', etc., in under 50ms. What data structure is ideal for prefix-based searching?",
    options: [
      "Hash Map",
      "Trie (Prefix Tree)",
      "Linked List",
      "Stack"
    ],
    correct: 1,
    aiExplanation: "A Trie (Prefix Tree) is the optimal data structure for autocomplete. Each node represents a character. Navigating to the node for 's-y-s' takes O(L) time where L is the prefix length (3 operations). From there, you can cache and retrieve the top 5 most frequent search queries branching from that node."
  }
];

export default function SystemDesign({ onClose }) {
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
        <div style={{ fontSize: '64px', marginBottom: '24px' }}>🏗️</div>
        <h2 style={{ fontSize: '28px', color: 'var(--color-text-1)', marginBottom: '16px' }}>Interview Complete</h2>
        <div style={{ fontSize: '48px', fontWeight: 900, color: 'var(--color-accent)', marginBottom: '24px' }}>
          {score} / {QUESTIONS.length}
        </div>
        <p style={{ fontSize: '15px', color: 'var(--color-text-2)', lineHeight: 1.6, marginBottom: '32px' }}>
          System Design is about understanding trade-offs. Review the AI explanations to master these architectural patterns.
        </p>
        <button onClick={() => { setCurrentIdx(0); setScore(0); setShowResult(false); setSelectedOpt(null); }} style={{ padding: '14px 32px', background: 'var(--color-text-1)', color: 'var(--color-base)', borderRadius: '12px', fontSize: '15px', fontWeight: 800, border: 'none', cursor: 'pointer', marginRight: '12px' }}>
          Retry Scenarios
        </button>

      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 20px', height: '100%', overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text-3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Scenario {currentIdx + 1} of {QUESTIONS.length}
        </div>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--color-accent)' }}>Score: {score}</div>
        </div>
      </div>

      <div style={{ fontSize: '36px', fontWeight: 800, color: 'var(--color-text-1)', marginBottom: '24px', lineHeight: 1.3 }}>{question.title}</div>
      <div style={{ fontSize: '22px', color: 'var(--color-text-2)', marginBottom: '40px', lineHeight: 1.6, background: 'var(--color-surface)', padding: '24px', borderRadius: '12px', border: '1px solid var(--color-border)' }}>{question.text}</div>

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
            <div style={{ background: 'rgba(14, 165, 233, 0.05)', border: '1px solid rgba(14, 165, 233, 0.2)', borderRadius: '16px', padding: '24px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: '#0EA5E9' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#0284C7', fontWeight: 800, fontSize: '15px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <span style={{ fontSize: '20px' }}>✨</span> AI Architectural Review
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
