/**
 * journal_entries.mode — one shared deriver.
 *
 * Entries are stored one row per (user, date, mode); see migration 049. The mode
 * lives inside the v2 JSON envelope the client serialises into
 * encrypted_content, so every write path must derive it the same way. Rows
 * written before the v2 envelope are plain text and count as 'legacy'.
 *
 * This lives here rather than in a route because more than one route writes
 * journal_entries — /api/journal and the mobile sync in /api/mobile. If they
 * disagree, two entries for the same day collide on the unique index.
 */
export function deriveJournalMode(encryptedContent) {
    try {
        const parsed = JSON.parse(encryptedContent);
        if (parsed && parsed.v === 2 && typeof parsed.mode === 'string' && parsed.mode) {
            return parsed.mode;
        }
    } catch {
        // legacy plain-text entry
    }
    return 'legacy';
}

export default deriveJournalMode;
