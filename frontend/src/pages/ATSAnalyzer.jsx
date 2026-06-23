import React, { useState, useRef, useCallback, useEffect } from 'react';
import { FileSearch, Upload, Copy, Check, AlertCircle, X, Zap, FolderSearch, FileText } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { apiPost, apiGet } from '../utils/api';
import { extractTextFromPDF } from '../utils/pdfUtils';

// ── Helpers ────────────────────────────────────────────────────────────────
const MOCK_RESULT = {
  matchScore: 62,
  matchedKeywords: ['python','sql','machine','learning','data','api','rest','agile','docker','postgres','git','analytics','dashboard','pipeline','model'],
  missingKeywords: ['kubernetes','typescript','spark','airflow','mlops','terraform','grafana','prometheus','redis','kafka'],
  aiAnalysis: {
    missingSkills: [
      { skill: 'Kubernetes / Container Orchestration', reason: 'Cloud-native deployments are the standard. The JD explicitly lists Kubernetes as a requirement that most ATS scanners filter on.' },
      { skill: 'Apache Spark / Data Engineering', reason: 'Large-scale data processing is central to this role. Without Spark experience, your application may not clear the algorithmic pre-screen.' },
      { skill: 'MLOps & Model Lifecycle', reason: 'Modern ML roles expect you to own models in production, not just build them. Absence of MLflow, Seldon, or similar tools is a gap.' },
      { skill: 'TypeScript', reason: 'Full-stack data teams increasingly use TypeScript for tooling and dashboards. The JD lists it under "nice to have" but ATS may weight it.' },
      { skill: 'Infrastructure as Code (Terraform)', reason: 'DevOps self-sufficiency is expected at senior IC levels. Terraform lets you provision your own infra without blocking on platform teams.' },
    ],
    bulletPoints: [
      'Orchestrated end-to-end ML pipelines on Kubernetes using KubeFlow, reducing model retraining time by 65% and achieving 99.9% scheduler uptime.',
      'Built Apache Spark ETL jobs processing 500GB+ daily across 50+ data sources, enabling near-real-time analytics dashboards for 12 business units.',
      'Implemented MLOps lifecycle with MLflow tracking, automated model versioning, and shadow deployments — cutting regression incidents by 80%.',
      'Migrated data infrastructure from on-prem to GCP using Terraform IaC, reducing provisioning overhead from 3 days to 30 minutes.',
      'Developed TypeScript/React monitoring dashboard surfacing model drift alerts and A/B experiment results for non-technical stakeholders.',
    ],
    _note: 'Demo mode — sign in to analyze your actual resume with AI.',
  },
};

// ── Circular Score Ring (SVG) ──────────────────────────────────────────────
const ScoreRing = ({ score }) => {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color =
    score >= 75 ? 'var(--color-success)' :
    score >= 50 ? 'var(--color-warning)' :
    'var(--color-danger)';

  return (
    <div style={{ position: 'relative', width: 140, height: 140, flexShrink: 0 }}>
      <svg width={140} height={140} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={70} cy={70} r={radius} fill="none" stroke="var(--color-border)" strokeWidth={10} />
        <circle
          cx={70} cy={70} r={radius}
          fill="none"
          stroke={color}
          strokeWidth={10}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.16,1,0.3,1)' }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontSize: 36, fontWeight: 800, color, fontFamily: 'var(--font-sans)', lineHeight: 1 }}>
          {score}%
        </span>
        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-3)', fontFamily: 'var(--font-sans)', marginTop: 6, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          ATS Match
        </span>
      </div>
    </div>
  );
};

// ── Keyword Chip ───────────────────────────────────────────────────────────
const Chip = ({ label, variant }) => {
  const styles = {
    matched: {
      background: 'var(--color-success-dim)',
      color: 'var(--color-success)',
      border: '1px solid rgba(34,197,94,0.18)',
    },
    missing: {
      background: 'var(--color-danger-dim)',
      color: 'var(--color-danger)',
      border: '1px solid rgba(239,68,68,0.18)',
    },
  };

  return (
    <span style={{
      display: 'inline-block',
      padding: '6px 14px',
      borderRadius: '9999px',
      fontSize: 13,
      fontWeight: 600,
      fontFamily: 'var(--font-mono)',
      ...styles[variant],
    }}>
      {label}
    </span>
  );
};

// ── Copy Button ────────────────────────────────────────────────────────────
const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const handle = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };
  return (
    <button
      onClick={handle}
      title="Copy to clipboard"
      style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '6px 14px', borderRadius: 8,
        border: '1px solid var(--color-border)',
        background: copied ? 'var(--color-success-dim)' : 'var(--color-elevated)',
        color: copied ? 'var(--color-success)' : 'var(--color-text-2)',
        fontSize: 13, fontWeight: 600,
        cursor: 'pointer', flexShrink: 0,
        transition: 'all 0.15s ease',
      }}
    >
      {copied ? <Check size={11} /> : <Copy size={11} />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
};

// ── Skeleton Loader ────────────────────────────────────────────────────────
const SkeletonBlock = ({ width = '100%', height = 16, style = {} }) => (
  <div className="skeleton" style={{ width, height, borderRadius: 6, ...style }} />
);

const ResultSkeleton = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
    <div style={{
      background: 'var(--color-surface)', border: '1px solid var(--color-border)',
      borderRadius: 12, padding: 24, display: 'flex', alignItems: 'center', gap: 24,
    }}>
      <SkeletonBlock width={140} height={140} style={{ borderRadius: '50%' }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <SkeletonBlock width="60%" height={18} />
        <SkeletonBlock width="80%" height={14} />
        <SkeletonBlock width="40%" height={14} />
      </div>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      {[1,2].map(i => (
        <div key={i} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 12, padding: 20 }}>
          <SkeletonBlock width="40%" height={14} style={{ marginBottom: 14 }} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {Array(8).fill(0).map((_, j) => (
              <SkeletonBlock key={j} width={`${50 + Math.random() * 40}px`} height={24} style={{ borderRadius: 9999 }} />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ── Drop Zone ──────────────────────────────────────────────────────────────
const DropZone = ({ textValue, onTextChange, onFileRead, label, placeholder, vaultAction }) => {
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const fileRef = useRef(null);

  const readFile = useCallback(async (file) => {
    if (!file) return;
    setFileName(file.name);

    if (file.type === 'application/pdf') {
      setIsExtracting(true);
      try {
        const arrayBuffer = await file.arrayBuffer();
        const extractedText = await extractTextFromPDF(arrayBuffer);
        onFileRead(extractedText);
      } catch (err) {
        console.error('PDF parsing error', err);
        alert(`Failed to extract text from "${file.name}". Please copy and paste manually.`);
        onFileRead('');
      } finally {
        setIsExtracting(false);
      }
    } else if (file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => onFileRead(e.target.result);
      reader.readAsText(file);
    } else {
      // For DOC: instruct user to paste text (pdfjs-dist handles PDF)
      onFileRead('');
      alert(`"${file.name}" uploaded. To extract text, please open the document, select-all, copy, then paste it into the text area below.`);
    }
  }, [onFileRead]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) readFile(file);
  }, [readFile]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Drop target */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        style={{
          border: `2px dashed ${dragOver ? 'var(--color-accent)' : 'rgba(255,255,255,0.1)'}`,
          borderRadius: 16,
          padding: '24px 16px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: 12, cursor: 'pointer',
          background: dragOver ? 'rgba(99, 102, 241, 0.05)' : 'rgba(255,255,255,0.02)',
          backdropFilter: 'blur(16px)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          minHeight: 120,
        }}
      >
        <Upload size={28} color={dragOver ? 'var(--color-accent)' : 'var(--color-text-3)'} />
        <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text-2)', fontFamily: 'var(--font-sans)', textAlign: 'center' }}>
          {isExtracting ? (
            <><div className="spinner" style={{ width: 14, height: 14, display: 'inline-block', marginRight: 8 }} /> Extracting text...</>
          ) : fileName ? (
            <><strong style={{ color: 'var(--color-text-1)' }}>{fileName}</strong> — paste text below</>
          ) : (
            <>Drop {label.includes('JD') ? 'Job Description' : 'Resume'} PDF/TXT here</>
          )}
        </span>
        {!fileName && !isExtracting ? (
          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            <button
              onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }}
              disabled={isExtracting}
              style={{
                padding: '10px 24px', background: 'var(--color-accent)', color: '#fff',
                border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700,
                cursor: isExtracting ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-sans)',
                transition: 'all 0.2s',
                boxShadow: '0 4px 12px var(--color-accent-dim)'
              }}
            >
              Browse Files
            </button>
            {vaultAction && (
              <div onClick={(e) => e.stopPropagation()}>
                {vaultAction}
              </div>
            )}
          </div>
        ) : fileName && !isExtracting ? (
          <button
            onClick={(e) => { e.stopPropagation(); setFileName(''); onFileRead(''); }}
            style={{
              marginTop: 16, padding: '8px 16px', background: 'var(--color-danger-dim)',
              color: 'var(--color-danger)', border: 'none', borderRadius: 8,
              fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-sans)',
            }}
          >
            Remove File
          </button>
        ) : null}
        <span style={{ fontSize: 13, color: 'var(--color-text-3)', fontFamily: 'var(--font-sans)', marginTop: '4px' }}>
          or paste text manually below
        </span>
        <input ref={fileRef} type="file" accept=".pdf,.txt,.doc,.docx" style={{ display: 'none' }} onChange={e => readFile(e.target.files?.[0])} />
      </div>

      {/* Text area */}
      <textarea
        value={textValue}
        onChange={e => onTextChange(e.target.value)}
        placeholder={placeholder}
        spellCheck={false}
        style={{
          width: '100%', minHeight: 280,
          padding: '20px 24px',
          background: 'rgba(255,255,255,0.02)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: 16,
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
          color: 'var(--color-text-1)',
          fontSize: 14,
          fontFamily: 'var(--font-mono)',
          lineHeight: 1.6,
          resize: 'vertical',
          outline: 'none',
        }}
      />
    </div>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────
export default function ATSAnalyzer({ onClose }) {
  const { user } = useAuth();
  const isGuest = user?.isGuest;

  const [jd, setJd] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const [vaultResumes, setVaultResumes] = useState([]);
  const [showVault, setShowVault] = useState(false);
  const [fetchingVault, setFetchingVault] = useState(false);

  useEffect(() => {
    if (isGuest) {
      setVaultResumes([
        { _id: 'mock1', title: 'Software Engineer Resume (Guest)', extractedText: 'John Doe\nSoftware Engineer\nSkills: React, Node.js, Python, JavaScript\nExperience: 5 years building scalable web applications.' }
      ]);
    } else {
      apiGet('/placements/resumes').then(data => {
        if (Array.isArray(data)) setVaultResumes(data);
      }).catch(err => console.error('Error fetching vault resumes', err));
    }
  }, [isGuest]);

  const handleSelectFromVault = async (resume) => {
    setShowVault(false);
    if (!resume.link_url) {
      setError("This resume doesn't have a valid file link.");
      return;
    }
    setFetchingVault(true);
    setError('');
    try {
      const res = await fetch(resume.link_url);
      if (!res.ok) throw new Error("Could not fetch file");
      const blob = await res.blob();
      const arrayBuffer = await blob.arrayBuffer();
      
      if (blob.type === 'application/pdf' || resume.link_url.toLowerCase().endsWith('.pdf')) {
        const text = await extractTextFromPDF(arrayBuffer);
        setResumeText(text);
      } else {
        setError("Selected file is not a PDF, or we don't have permission to read it automatically.");
      }
    } catch (err) {
      console.error(err);
      setError("Could not automatically extract text. It might be an external link like Google Drive. Please copy-paste it manually.");
    } finally {
      setFetchingVault(false);
    }
  };

  const handleAnalyze = async () => {
    if (!jd.trim()) { setError('Please paste a job description.'); return; }
    if (!resumeText.trim()) { setError('Please paste your resume text.'); return; }
    setError('');
    setLoading(true);
    setResult(null);

    // Guests always get mock data
    if (isGuest) {
      await new Promise(r => setTimeout(r, 1200));
      setResult(MOCK_RESULT);
      setLoading(false);
      return;
    }

    try {
      const data = await apiPost('/ats/analyze', {
        jd,
        resume_text: resumeText,
      });

      setResult(data);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const canAnalyze = jd.trim().length > 50 && resumeText.trim().length > 80;

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 28, position: 'relative' }}>


      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <FileSearch size={28} color="var(--color-accent)" />
            <h1 style={{ fontSize: 36, fontWeight: 800, fontFamily: 'var(--font-sans)', color: 'var(--color-text-1)', margin: 0 }}>
              ATS Resume Analyzer
            </h1>
          </div>
          <p style={{ margin: 0, fontSize: 16, color: 'var(--color-text-2)', fontFamily: 'var(--font-sans)', lineHeight: 1.6 }}>
            Paste the Job Description and your Resume text. We'll identify missing keywords and suggest tailored bullet points to beat the ATS.
          </p>
        </div>

      </div>
      {isGuest && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 14px', borderRadius: 8,
            background: 'var(--color-warning-dim)',
            border: '1px solid rgba(250,204,21,0.2)',
          }}>
            <AlertCircle size={14} color="var(--color-warning)" />
            <span style={{ fontSize: 12, color: 'var(--color-warning)', fontFamily: 'var(--font-sans)', fontWeight: 500 }}>
              Sign in to analyze your actual resume
            </span>
          </div>
        )}
      {/* ── Input panels ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: 24,
      }}>
        {/* Left: Job Description */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <label style={{
              fontSize: 13, fontWeight: 700, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: 'var(--color-text-3)',
              fontFamily: 'var(--font-mono)',
            }}>
              Job Description
            </label>
          </div>
          <DropZone
            textValue={jd}
            onTextChange={setJd}
            onFileRead={setJd}
            label="Drag & Drop JD PDF/TXT or click to extract text"
            placeholder="Paste the full job description here, or upload a file to extract its text..."
          />
          <span style={{ fontSize: 11, color: 'var(--color-text-3)', fontFamily: 'var(--font-sans)' }}>
            {jd.split(/\s+/).filter(Boolean).length} words
          </span>
        </div>

        {/* Right: Resume */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <label style={{
              fontSize: 13, fontWeight: 700, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: 'var(--color-text-3)',
              fontFamily: 'var(--font-mono)',
            }}>
              Your Resume
            </label>
            {fetchingVault && (
              <div style={{ fontSize: 12, color: 'var(--color-text-3)', display: 'flex', alignItems: 'center', gap: 8 }}>
                 <div className="spinner" style={{ width: 12, height: 12 }} /> Extracting from Vault...
              </div>
            )}
          </div>
          <DropZone
            textValue={resumeText}
            onTextChange={setResumeText}
            onFileRead={setResumeText}
            label="Drag & Drop Resume PDF/TXT or click to extract text"
            placeholder="Paste your full resume text here, or upload a PDF/TXT..."
            vaultAction={
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowVault(!showVault)}
                  style={{
                    background: 'transparent', border: `1px solid ${showVault ? 'var(--color-accent)' : 'var(--color-border)'}`,
                    color: showVault ? 'var(--color-accent)' : 'var(--color-text-1)', padding: '10px 24px', borderRadius: 8,
                    fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-sans)',
                    display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: showVault ? '0 4px 12px rgba(99, 102, 241, 0.1)' : 'none'
                  }}
                >
                  <FolderSearch size={16} /> Select from Vault
                </button>
                {showVault && (
                  <div style={{
                    position: 'absolute', top: '100%', right: 0, marginTop: 8,
                    background: 'var(--color-surface)', border: '1px solid var(--color-border)',
                    borderRadius: 12, padding: 8, width: 280, zIndex: 50,
                    boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                    display: 'flex', flexDirection: 'column', gap: 4,
                  }}>
                    <div style={{ padding: '8px 12px', fontSize: 11, fontWeight: 700, color: 'var(--color-text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Available Resumes
                    </div>
                    {vaultResumes.length > 0 ? (
                      vaultResumes.map(r => (
                        <button
                          key={r.id || r._id}
                          onClick={() => handleSelectFromVault(r)}
                          style={{
                            background: 'transparent', border: 'none', padding: '10px 12px',
                            color: 'var(--color-text-2)', fontSize: 13, fontFamily: 'var(--font-sans)',
                            textAlign: 'left', borderRadius: 8, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: 10,
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = 'var(--color-elevated)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <FileText size={16} color="var(--color-accent)" />
                          <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 600 }}>{r.title}</span>
                            {r.target_role && <span style={{ fontSize: 11, color: 'var(--color-text-3)' }}>{r.target_role}</span>}
                          </div>
                        </button>
                      ))
                    ) : (
                      <div style={{ padding: '12px', fontSize: 13, color: 'var(--color-text-3)', textAlign: 'center' }}>
                        No resumes archived. Upload one in the Placements tab.
                      </div>
                    )}
                  </div>
                )}
              </div>
            }
          />
          <span style={{ fontSize: 11, color: 'var(--color-text-3)', fontFamily: 'var(--font-sans)' }}>
            {resumeText.split(/\s+/).filter(Boolean).length} words
          </span>
        </div>
      </div>

      {/* ── Error ── */}
      {error && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '12px 16px', borderRadius: 8,
          background: 'var(--color-danger-dim)',
          border: '1px solid rgba(239,68,68,0.2)',
        }}>
          <AlertCircle size={14} color="var(--color-danger)" />
          <span style={{ fontSize: 12, color: 'var(--color-danger)', fontFamily: 'var(--font-sans)' }}>{error}</span>
          <button onClick={() => setError('')} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-danger)' }}>
            <X size={14} />
          </button>
        </div>
      )}

      {/* ── Analyze Button ── */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button
          onClick={handleAnalyze}
          disabled={!canAnalyze || loading}
          style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '16px 48px',
            background: canAnalyze && !loading ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(255,255,255,0.05)',
            color: canAnalyze && !loading ? '#ffffff' : 'var(--color-text-3)',
            border: 'none', borderRadius: 16,
            fontSize: 18, fontWeight: 800, fontFamily: 'var(--font-sans)',
            cursor: canAnalyze && !loading ? 'pointer' : 'not-allowed',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: canAnalyze && !loading ? '0 8px 24px rgba(99, 102, 241, 0.25)' : 'none',
          }}
        >
          {loading ? (
            <><div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Analyzing…</>
          ) : (
            <><Zap size={16} /> Analyze Match</>
          )}
        </button>
      </div>

      {/* ── Results ── */}
      {loading && <ResultSkeleton />}

      {result && result.aiStatus && result.aiStatus !== 'success' && !loading && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '12px 16px', borderRadius: 8,
          background: 'var(--color-warning-dim)',
          border: '1px solid rgba(250,204,21,0.2)',
          animation: 'fadeUp 0.3s var(--ease)',
        }}>
          <AlertCircle size={16} color="var(--color-warning)" />
          <span style={{ fontSize: 13, color: 'var(--color-warning)', fontFamily: 'var(--font-sans)', fontWeight: 500 }}>
            {result.aiStatus === 'limit_reached'
              ? 'AI limit reached. The system is showing standard fallback analysis. Please check your API usage limits.'
              : 'AI API key expired or unauthorized. Showing standard fallback analysis. Please update your API key.'}
          </span>
        </div>
      )}

      {result && !loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, animation: 'fadeUp 0.3s var(--ease)' }}>

          {/* Score Overview Card */}
          <div style={{
            background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
            backdropFilter: 'blur(16px)',
            borderRadius: 20, padding: '32px 36px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            display: 'flex', alignItems: 'center', gap: 36, flexWrap: 'wrap',
          }}>
            <ScoreRing score={result.matchScore} />
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-text-1)', fontFamily: 'var(--font-sans)', marginBottom: 8 }}>
                {result.matchScore >= 75 ? '🎯 Strong Match' : result.matchScore >= 50 ? '⚠️ Moderate Match' : '🔴 Low Match'}
              </div>
              <div style={{ fontSize: 16, color: 'var(--color-text-2)', fontFamily: 'var(--font-sans)', lineHeight: 1.6 }}>
                Your resume matches <strong style={{ color: 'var(--color-text-1)' }}>{result.matchedKeywords.length}</strong> of <strong style={{ color: 'var(--color-text-1)' }}>{result.matchedKeywords.length + result.missingKeywords.length}</strong> key terms.{' '}
                {result.matchScore < 75 && 'Add the missing keywords below to improve your ATS score.'}
              </div>
              {result.aiAnalysis?._note && (
                <div style={{ marginTop: 10, fontSize: 11, color: 'var(--color-warning)', fontFamily: 'var(--font-sans)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <AlertCircle size={11} /> {result.aiAnalysis._note}
                </div>
              )}
            </div>
          </div>

          {/* Keywords Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {/* Matched */}
            <div style={{
              background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
              backdropFilter: 'blur(16px)',
              borderRadius: 20, padding: '28px 32px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                <Check size={18} color="var(--color-success)" />
                <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-3)', fontFamily: 'var(--font-mono)' }}>
                  Matched ({result.matchedKeywords.length})
                </span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {result.matchedKeywords.length > 0
                  ? result.matchedKeywords.map(kw => <Chip key={kw} label={kw} variant="matched" />)
                  : <span style={{ fontSize: 12, color: 'var(--color-text-3)' }}>None found</span>
                }
              </div>
            </div>

            {/* Missing */}
            <div style={{
              background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
              backdropFilter: 'blur(16px)',
              borderRadius: 20, padding: '28px 32px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                <X size={18} color="var(--color-danger)" />
                <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-3)', fontFamily: 'var(--font-mono)' }}>
                  Missing ({result.missingKeywords.length})
                </span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {result.missingKeywords.length > 0
                  ? result.missingKeywords.map(kw => <Chip key={kw} label={kw} variant="missing" />)
                  : <span style={{ fontSize: 12, color: 'var(--color-success)' }}>Perfect match!</span>
                }
              </div>
            </div>
          </div>

          {/* AI Gap Analysis */}
          {result.aiAnalysis?.missingSkills?.length > 0 && (
            <div style={{
              background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
              backdropFilter: 'blur(16px)',
              borderRadius: 20, padding: '32px 36px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <Zap size={18} color="var(--color-accent)" />
                <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-3)', fontFamily: 'var(--font-mono)' }}>
                  AI Gap Analysis
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {result.aiAnalysis.missingSkills.map((item, idx) => (
                  <div key={idx} style={{
                    padding: '14px 16px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: 12,
                    display: 'flex', gap: 14, alignItems: 'flex-start',
                  }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 10, flexShrink: 0,
                      background: 'var(--color-danger-dim)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 14, fontWeight: 800, color: 'var(--color-danger)',
                      fontFamily: 'var(--font-mono)',
                    }}>
                      {idx + 1}
                    </div>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text-1)', fontFamily: 'var(--font-sans)', marginBottom: 6 }}>
                        {item.skill}
                      </div>
                      <div style={{ fontSize: 14, color: 'var(--color-text-2)', fontFamily: 'var(--font-sans)', lineHeight: 1.6 }}>
                        {item.reason}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tailored Bullets */}
          {result.aiAnalysis?.bulletPoints?.length > 0 && (
            <div style={{
              background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
              backdropFilter: 'blur(16px)',
              borderRadius: 20, padding: '32px 36px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <FileSearch size={18} color="var(--color-accent)" />
                <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-3)', fontFamily: 'var(--font-mono)' }}>
                  Tailored Resume Bullets
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {result.aiAnalysis.bulletPoints.map((bullet, idx) => (
                  <div key={idx} style={{
                    padding: '16px 20px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: 16,
                    display: 'flex', alignItems: 'flex-start', gap: 16,
                  }}>
                    <span style={{ color: 'var(--color-accent)', fontSize: 18, marginTop: 2, flexShrink: 0 }}>•</span>
                    <span style={{ flex: 1, fontSize: 14, color: 'var(--color-text-1)', fontFamily: 'var(--font-sans)', lineHeight: 1.65 }}>
                      {bullet}
                    </span>
                    <CopyButton text={bullet} />
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
