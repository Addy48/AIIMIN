/**
 * Google Drive folder watch → import PDFs into notes.
 */
import { google } from 'googleapis';
import { getOAuthClient } from './googleClient.js';
import { pool } from './db.js';
import { resolveNotePdfText } from './notesOcr.js';

export async function getDriveClient(userId) {
  const auth = await getOAuthClient(userId, 'google');
  return google.drive({ version: 'v3', auth });
}

export function hasDriveScope(scopeStr = '') {
  const s = String(scopeStr || '');
  return s.includes('drive.readonly') || s.includes('drive.file') || s.includes('auth/drive');
}

export async function listWatchablePdfFiles(drive, folderId, pageToken) {
  const q = [
    `'${folderId}' in parents`,
    'trashed = false',
    "(mimeType = 'application/pdf' or mimeType = 'application/vnd.google-apps.document')",
  ].join(' and ');

  const res = await drive.files.list({
    q,
    pageSize: 25,
    pageToken: pageToken || undefined,
    fields: 'nextPageToken, files(id, name, mimeType, modifiedTime, md5Checksum)',
    supportsAllDrives: true,
    includeItemsFromAllDrives: true,
  });

  return {
    files: res.data.files || [],
    nextPageToken: res.data.nextPageToken || null,
  };
}

async function downloadFileBuffer(drive, file) {
  if (file.mimeType === 'application/vnd.google-apps.document') {
    const res = await drive.files.export(
      { fileId: file.id, mimeType: 'application/pdf' },
      { responseType: 'arraybuffer' },
    );
    return Buffer.from(res.data);
  }
  const res = await drive.files.get(
    { fileId: file.id, alt: 'media' },
    { responseType: 'arraybuffer' },
  );
  return Buffer.from(res.data);
}

/**
 * Sync a watched folder into notes. Skips already-imported drive file ids (meta).
 */
export async function syncDriveFolderForUser(userId, { folderId, limit = 15 } = {}) {
  const drive = await getDriveClient(userId);
  const { files } = await listWatchablePdfFiles(drive, folderId);
  const slice = files.slice(0, Math.min(limit, 25));

  const imported = [];
  const skipped = [];
  const errors = [];

  for (const file of slice) {
    try {
      const { rows: existing } = await pool.query(
        `SELECT id FROM public.notes
         WHERE user_id = $1
           AND source_type = 'pdf'
           AND meta->>'drive_file_id' = $2
         LIMIT 1`,
        [userId, file.id],
      );
      if (existing.length) {
        skipped.push({ id: file.id, name: file.name, reason: 'already_imported' });
        continue;
      }

      const buffer = await downloadFileBuffer(drive, file);
      const resolved = await resolveNotePdfText({
        buffer,
        filename: file.name,
        clientText: null,
      });

      const ocrText = resolved.text || null;
      const status = ocrText ? 'unlinked' : 'indexing';
      const bodyText = ocrText ? ocrText.slice(0, 8000) : null;
      const content = String(bodyText ?? ocrText ?? '');

      const { rows } = await pool.query(
        `INSERT INTO public.notes
           (user_id, source_type, title, body_text, content, ocr_text, status, source_filename, meta)
         VALUES ($1, 'pdf', $2, $3, $4, $5, $6, $7,
                 jsonb_build_object(
                   'drive_file_id', $8::text,
                   'drive_folder_id', $9::text,
                   'ocr_method', $10::text,
                   'modified_time', $11::text
                 ))
         RETURNING id, title, status, source_filename`,
        [
          userId,
          String(file.name || 'Drive PDF').slice(0, 200),
          bodyText,
          content,
          ocrText,
          status,
          String(file.name || '').slice(0, 260),
          file.id,
          folderId,
          resolved.method || 'pending',
          file.modifiedTime || null,
        ],
      );
      imported.push(rows[0]);
    } catch (err) {
      errors.push({ id: file.id, name: file.name, error: err.message });
    }
  }

  return {
    scanned: slice.length,
    imported: imported.length,
    skipped: skipped.length,
    errors,
    items: imported,
  };
}
