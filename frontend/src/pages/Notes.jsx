import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  FileText,
  FolderOpen,
  History,
  Link2,
  Mic,
  Plus,
  Search,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import useMediaQuery from '../hooks/useMediaQuery';
import {
  fetchNotes,
  createNote,
  deleteNote,
  suggestNoteLinks,
  fetchNoteAnchors,
  confirmAnchor,
  fetchRecallDue,
  recallOutcome,
  fetchDriveStatus,
  saveDriveWatch,
  syncDriveFolder,
} from '../api/notes';
import toast from '../utils/toast';
import { extractTextFromPDF } from '../utils/pdfUtils';
import { formatDate } from '../utils/formatDate';
import { NOTE_SOURCE_LABELS, labelEnum } from '../utils/enumLabels';
import '../styles/notesStudio.css';

function previewText(note) {
  return note.body_text || note.transcript || note.ocr_text || '';
}

function snippet(note, n = 96) {
  const raw = previewText(note).replace(/\s+/g, ' ').trim();
  if (!raw) return 'Empty source';
  return raw.length > n ? `${raw.slice(0, n)}…` : raw;
}

function formatWhen(iso) {
  return formatDate(iso, '');
}

function sourceBadgeLabel(sourceType) {
  if (!sourceType || sourceType === 'admin_simulated') return null;
  return labelEnum(sourceType, NOTE_SOURCE_LABELS);
}

const SOURCE_OPTS = [
  { id: 'text', label: 'Text', Icon: FileText },
  { id: 'voice', label: 'Voice', Icon: Mic },
  { id: 'pdf', label: 'PDF', Icon: Upload },
];

function VoiceRecallBanner({ items, onOutcome }) {
  if (!items?.length) return null;
  const item = items[0];
  const srcLabel = sourceBadgeLabel(item.source_type) || 'Source';
  return (
    <div className="voice-recall" role="region" aria-label="Voice recall">
      <div>
        <p className="voice-recall__title">Quiet recall</p>
        <p className="voice-recall__meta">
          {srcLabel} · box {item.box} — recalled clean, or had to think?
        </p>
      </div>
      <div className="voice-recall__actions">
        <button type="button" className="notes-btn notes-btn--accent" onClick={() => onOutcome(item.id, 'clean')}>
          Recalled clean
        </button>
        <button type="button" className="notes-btn" onClick={() => onOutcome(item.id, 'think')}>
          Had to think
        </button>
      </div>
    </div>
  );
}

export default function NotesPage() {
  const isTabletTier = useMediaQuery('(max-width: 1099px)');
  const [notes, setNotes] = useState([]);
  const [q, setQ] = useState('');
  const [selected, setSelected] = useState(null);
  const [anchors, setAnchors] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [composing, setComposing] = useState(false);
  const [driveOpen, setDriveOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [sourceType, setSourceType] = useState('text');
  const [recall, setRecall] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pdfBusy, setPdfBusy] = useState(false);
  const [driveStatus, setDriveStatus] = useState(null);
  const [folderId, setFolderId] = useState('');
  const [folderName, setFolderName] = useState('');
  const [driveBusy, setDriveBusy] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const [list, due] = await Promise.all([
        fetchNotes({ q: q || undefined }),
        fetchRecallDue().catch(() => []),
      ]);
      setNotes(Array.isArray(list)
        ? list.filter((n) => n.source_type !== 'admin_simulated' || process.env.NODE_ENV === 'development')
        : []);
      setRecall(Array.isArray(due) ? due : []);
    } catch (err) {
      console.error('[Notes]', err);
      toast.error('Could not load notes');
    } finally {
      setLoading(false);
    }
  }, [q]);

  useEffect(() => {
    const t = setTimeout(refresh, 200);
    return () => clearTimeout(t);
  }, [refresh]);

  useEffect(() => {
    fetchDriveStatus()
      .then((s) => {
        setDriveStatus(s);
        const w = s?.watches?.[0];
        if (w?.folder_id) {
          setFolderId(w.folder_id);
          setFolderName(w.folder_name || '');
        }
      })
      .catch(() => setDriveStatus(null));
  }, []);

  const startCompose = (type = 'text') => {
    setSourceType(type);
    setComposing(true);
    setSelected(null);
    setAnchors([]);
    if (isTabletTier) setDrawerOpen(false);
  };

  const openNote = async (note) => {
    setComposing(false);
    setSelected(note);
    if (isTabletTier) setDrawerOpen(false);
    try {
      const a = await fetchNoteAnchors(note.id);
      setAnchors(Array.isArray(a) ? a : []);
    } catch {
      setAnchors([]);
    }
  };

  const handleCreate = async () => {
    if (!title.trim() && !body.trim()) {
      toast.error('Add a title or body');
      return;
    }
    try {
      const text = body.trim();
      const isVoice = sourceType === 'voice';
      const created = await createNote({
        source_type: sourceType === 'pdf' ? 'text' : sourceType,
        title: title.trim() || 'Untitled',
        body_text: isVoice ? (text || null) : (text || ''),
        transcript: isVoice ? text : null,
      });
      setTitle('');
      setBody('');
      setComposing(false);
      toast.success('Saved');
      await refresh();
      if (created?.id) openNote(created);
      else if (created?.error) throw new Error(created.error);
    } catch (err) {
      toast.error(err?.message || 'Create failed');
    }
  };

  const handlePdfFile = async (file) => {
    if (!file) return;
    if (file.type !== 'application/pdf' && !file.name?.toLowerCase().endsWith('.pdf')) {
      toast.error('PDF only');
      return;
    }
    setPdfBusy(true);
    try {
      const buffer = await file.arrayBuffer();
      let extracted = '';
      try {
        extracted = await extractTextFromPDF(buffer);
      } catch {
        extracted = '';
      }

      const bytes = new Uint8Array(buffer);
      let binary = '';
      const chunk = 0x8000;
      for (let i = 0; i < bytes.length; i += chunk) {
        binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
      }
      const pdf_base64 = btoa(binary);

      const created = await createNote({
        source_type: 'pdf',
        title: title.trim() || file.name.replace(/\.pdf$/i, '') || 'PDF note',
        body_text: extracted ? extracted.slice(0, 8000) : (body.trim() || null),
        ocr_text: extracted || null,
        source_filename: file.name,
        pdf_base64: extracted && extracted.trim().length > 20 ? undefined : pdf_base64,
      });
      setTitle('');
      setBody('');
      setComposing(false);
      toast.success(extracted?.trim() ? 'PDF imported + text extracted' : 'PDF imported — server OCR attempt');
      await refresh();
      if (created) openNote(created);
    } catch (err) {
      toast.error(err?.message || 'PDF import failed');
    } finally {
      setPdfBusy(false);
    }
  };

  const handleSaveWatch = async () => {
    if (!folderId.trim()) {
      toast.error('Paste a Drive folder ID');
      return;
    }
    setDriveBusy(true);
    try {
      await saveDriveWatch({
        folder_id: folderId.trim(),
        folder_name: folderName.trim() || null,
        enabled: true,
      });
      const s = await fetchDriveStatus();
      setDriveStatus(s);
      toast.success('Drive folder watch saved');
    } catch (err) {
      toast.error(err?.message || 'Could not save watch');
    } finally {
      setDriveBusy(false);
    }
  };

  const handleDriveSync = async () => {
    setDriveBusy(true);
    try {
      const res = await syncDriveFolder({
        folder_id: folderId.trim() || undefined,
      });
      toast.success(`Synced · imported ${res.imported || 0}, skipped ${res.skipped || 0}`);
      const s = await fetchDriveStatus();
      setDriveStatus(s);
      await refresh();
    } catch (err) {
      toast.error(err?.message || err?.reconnectHint || 'Drive sync failed');
    } finally {
      setDriveBusy(false);
    }
  };

  const handleSuggest = async () => {
    if (!selected?.id) return;
    try {
      const res = await suggestNoteLinks(selected.id);
      const n = res?.suggested?.length || 0;
      toast.success(n ? `${n} link suggestion(s)` : 'No habit name matches');
      const a = await fetchNoteAnchors(selected.id);
      setAnchors(Array.isArray(a) ? a : []);
      refresh();
    } catch (err) {
      toast.error(err?.message || 'Suggest failed');
    }
  };

  const handleConfirm = async (edgeId) => {
    try {
      await confirmAnchor(edgeId);
      const a = await fetchNoteAnchors(selected.id);
      setAnchors(Array.isArray(a) ? a : []);
      toast.success('Link confirmed');
    } catch (err) {
      toast.error(err?.message || 'Confirm failed');
    }
  };

  const handleDelete = async () => {
    if (!selected?.id) return;
    try {
      await deleteNote(selected.id);
      setSelected(null);
      setAnchors([]);
      refresh();
    } catch (err) {
      toast.error(err?.message || 'Delete failed');
    }
  };

  const onRecallOutcome = async (id, outcome) => {
    try {
      await recallOutcome(id, outcome);
      setRecall((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      toast.error(err?.message || 'Recall update failed');
    }
  };

  const driveConnected = Boolean(driveStatus?.driveScope);
  const lastSync = driveStatus?.watches?.[0]?.last_synced_at;

  const listPanel = (
    <div className="notes-rail">
      <div className="notes-rail__search">
        <Search size={16} className="notes-rail__search-icon" aria-hidden />
        <input
          type="search"
          placeholder="Search sources…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Search notes"
        />
      </div>

      <div className="notes-rail__scroll custom-scrollbar">
        {loading && (
          <div className="notes-rail__skeletons" aria-hidden>
            {[0, 1, 2].map((i) => <div key={i} className="notes-skel" />)}
          </div>
        )}
        {!loading && notes.length === 0 && (
          <div className="notes-rail__empty">
            <p>No sources yet</p>
            <button type="button" className="notes-btn notes-btn--accent" onClick={() => startCompose('text')}>
              Capture first note
            </button>
          </div>
        )}
        <div className="notes-rail__list">
          {notes.map((note, idx) => (
            <motion.button
              key={note.id}
              type="button"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18, delay: Math.min(idx * 0.03, 0.24), ease: [0.16, 1, 0.3, 1] }}
              className={`notes-row${selected?.id === note.id && !composing ? ' is-active' : ''}`}
              onClick={() => openNote(note)}
            >
              <div className="notes-row__top">
                {sourceBadgeLabel(note.source_type) && (
                  <span className={`notes-tag notes-tag--${note.source_type || 'text'}`}>
                    {sourceBadgeLabel(note.source_type)}
                  </span>
                )}
                <span className="notes-row__date">{formatWhen(note.created_at || note.updated_at)}</span>
              </div>
              <div className="notes-row__title">{note.title || 'Untitled'}</div>
              <div className="notes-row__preview">{snippet(note)}</div>
              {note.status === 'linked' && (
                <span className="notes-row__linked">
                  <Link2 size={12} aria-hidden /> Linked
                </span>
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );

  const composePanel = (
    <div className="notes-compose">
      <div className="notes-compose__head">
        <h2>New source</h2>
        <button type="button" className="notes-icon-btn" aria-label="Cancel compose" onClick={() => setComposing(false)}>
          <X size={18} />
        </button>
      </div>

      <div className="notes-source-tabs" role="tablist" aria-label="Source type">
        {SOURCE_OPTS.map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={sourceType === id}
            className={`notes-source-tab${sourceType === id ? ' is-active' : ''}`}
            onClick={() => setSourceType(id)}
          >
            <Icon size={16} strokeWidth={2} />
            {label}
          </button>
        ))}
      </div>

      <input
        className="notes-compose__title"
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        autoFocus
      />

      {sourceType === 'pdf' ? (
        <div className="notes-drop">
          <label className={`notes-drop__zone${pdfBusy ? ' is-busy' : ''}`}>
            <Upload size={22} strokeWidth={1.75} />
            <span>{pdfBusy ? 'Extracting text…' : 'Drop PDF or click to upload'}</span>
            <span className="notes-drop__hint">Scanned PDFs run server OCR when needed</span>
            <input
              type="file"
              accept="application/pdf,.pdf"
              disabled={pdfBusy}
              onChange={(e) => handlePdfFile(e.target.files?.[0])}
              aria-label="Upload PDF"
            />
          </label>
          <textarea
            className="notes-compose__body"
            placeholder="Optional caption if the PDF is a scan…"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </div>
      ) : (
        <>
          <textarea
            className="notes-compose__body notes-compose__body--tall"
            placeholder={sourceType === 'voice' ? 'Transcript…' : 'Paste lecture notes, excerpts, references…'}
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <div className="notes-compose__footer">
            <button type="button" className="notes-btn" onClick={() => setComposing(false)}>Cancel</button>
            <button type="button" className="notes-btn notes-btn--accent" onClick={handleCreate}>
              <Plus size={16} /> Save note
            </button>
          </div>
        </>
      )}
    </div>
  );

  const emptyCanvas = (
    <div className="notes-empty">
      <p className="notes-empty__kicker">Reference layer</p>
      <h2 className="notes-empty__title">Sources, not a second journal</h2>
      <p className="notes-empty__body">
        Capture PDFs, voice recordings, and text you want to keep alongside your habits and journal. Add a source to get started.
      </p>
      <div className="notes-empty__actions">
        {SOURCE_OPTS.map(({ id, label, Icon }) => (
          <button key={id} type="button" className="notes-empty__card" onClick={() => startCompose(id)}>
            <Icon size={20} strokeWidth={1.75} />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const detailPanel = selected && (
    <article className="notes-reader">
      <header className="notes-reader__head">
        <div className="notes-reader__meta">
          <span className={`notes-tag notes-tag--${selected.source_type || 'text'}`}>
            {sourceBadgeLabel(selected.source_type) || 'Text'}
          </span>
          {selected.status && (
            <span className={`notes-tag${selected.status === 'linked' ? ' notes-tag--accent' : ''}`}>
              {selected.status}
            </span>
          )}
          <span className="notes-reader__when">{formatWhen(selected.created_at)}</span>
        </div>
        <div className="notes-reader__actions">
          <button type="button" className="notes-btn" onClick={handleSuggest}>
            <Link2 size={14} /> Suggest links
          </button>
          <button type="button" className="notes-btn notes-btn--danger" onClick={handleDelete}>
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </header>

      <h2 className="notes-reader__title">{selected.title}</h2>
      <div className="notes-reader__body">
        {previewText(selected) || <span className="notes-reader__muted">No text extracted yet.</span>}
      </div>

      <section className="notes-anchors">
        <h3>Linked entities</h3>
        {!anchors.length && (
          <p className="notes-anchors__empty">
            No links yet. Name a habit in the text, then suggest — confirm on first link.
          </p>
        )}
        {anchors.map((a) => (
          <div key={a.id} className="notes-anchor">
            <span>
              {a.target_type} · {String(a.target_id).slice(0, 8)}…
              {a.confirmed ? ' · confirmed' : ' · pending'}
            </span>
            {!a.confirmed && (
              <button type="button" className="notes-btn notes-btn--sm notes-btn--accent" onClick={() => handleConfirm(a.id)}>
                Confirm
              </button>
            )}
          </div>
        ))}
      </section>
    </article>
  );

  const countLabel = useMemo(() => {
    if (loading) return 'Loading…';
    if (notes.length === 1) return '1 source';
    return `${notes.length} sources`;
  }, [loading, notes.length]);

  return (
    <div className="notes-studio">
      <header className="notes-studio__mast">
        <div className="notes-studio__identity">
          <h1 className="notes-studio__title">Notes</h1>
          <p className="notes-studio__count">{countLabel}</p>
        </div>
        <div className="notes-studio__toolbar">
          {isTabletTier && (
            <button type="button" className="notes-btn" onClick={() => setDrawerOpen(true)} aria-label="Open list">
              <History size={16} /> List
            </button>
          )}
          <button
            type="button"
            className={`notes-btn${driveOpen ? ' is-pressed' : ''}`}
            onClick={() => setDriveOpen((o) => !o)}
            aria-expanded={driveOpen}
          >
            <FolderOpen size={16} /> Drive
            {!driveConnected && <span className="notes-dot" title="Reconnect Google for Drive" />}
          </button>
          <button type="button" className="notes-btn notes-btn--accent" onClick={() => startCompose('text')}>
            <Plus size={16} /> New
          </button>
        </div>
      </header>

      <AnimatePresence initial={false}>
        {driveOpen && (
          <motion.div
            className="notes-drive"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="notes-drive__inner">
              <div className="notes-drive__copy">
                <strong>Drive folder watch</strong>
                <p>
                  Paste the folder ID (last segment of the Drive URL). Reconnect Google once if Drive read is missing.
                </p>
                {!driveConnected && (
                  <p className="notes-drive__warn">
                    {driveStatus?.reconnectHint || 'Reconnect Google (Calendar) to grant Drive read access.'}
                  </p>
                )}
              </div>
              <div className="notes-drive__form">
                <input
                  type="text"
                  placeholder="Folder ID"
                  value={folderId}
                  onChange={(e) => setFolderId(e.target.value)}
                  aria-label="Drive folder ID"
                />
                <input
                  type="text"
                  placeholder="Label (optional)"
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  aria-label="Folder label"
                />
                <div className="notes-drive__actions">
                  <button type="button" className="notes-btn" disabled={driveBusy} onClick={handleSaveWatch}>
                    Save watch
                  </button>
                  <button type="button" className="notes-btn notes-btn--accent" disabled={driveBusy} onClick={handleDriveSync}>
                    Sync now
                  </button>
                </div>
                {lastSync && (
                  <p className="notes-drive__meta">
                    Last sync {new Date(lastSync).toLocaleString()}
                    {driveStatus?.watches?.[0]?.last_sync_status
                      ? ` · ${driveStatus.watches[0].last_sync_status}`
                      : ''}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <VoiceRecallBanner items={recall} onOutcome={onRecallOutcome} />

      <div className={`notes-studio__shell${isTabletTier ? ' is-drawer-tier' : ''}`}>
        {!isTabletTier && listPanel}

        <main className="notes-canvas custom-scrollbar">
          {composing && composePanel}
          {!composing && !selected && emptyCanvas}
          {!composing && selected && detailPanel}
        </main>
      </div>

      <AnimatePresence>
        {isTabletTier && drawerOpen && (
          <>
            <motion.button
              type="button"
              className="notes-drawer-scrim"
              aria-label="Close list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
            />
            <motion.aside
              className="notes-drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="notes-drawer__bar">
                <button type="button" className="notes-icon-btn" aria-label="Close" onClick={() => setDrawerOpen(false)}>
                  <X size={18} />
                </button>
              </div>
              {listPanel}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
