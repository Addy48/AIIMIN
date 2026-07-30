/**
 * routes/notes.js — source-grounded notes + voice recall + anchor helpers + Drive watch
 */
import { Hono } from 'hono';
import { pool } from '../lib/db.js';
import { requireAuth } from '../middleware/auth.js';
import { resolveNotePdfText } from '../lib/notesOcr.js';
import { syncDriveFolderForUser, hasDriveScope } from '../lib/notesDrive.js';
import { getIntegrationStatus } from '../lib/googleClient.js';

const app = new Hono();

const BOX_DAYS = { 1: 1, 2: 3, 3: 7, 4: 14 };

app.get('/recall/due', requireAuth, async (c) => {
    const userId = c.get('userId');
    try {
        const { rows } = await pool.query(
            `SELECT * FROM public.voice_recall_queue
             WHERE user_id = $1 AND next_review_at <= NOW()
             ORDER BY next_review_at ASC
             LIMIT 5`,
            [userId]
        );
        return c.json(rows);
    } catch (err) {
        return c.json({ error: err.message }, 500);
    }
});

app.post('/recall/enqueue', requireAuth, async (c) => {
    const userId = c.get('userId');
    try {
        const { source_type, source_id } = await c.req.json();
        if (!['journal', 'notes'].includes(source_type) || !source_id) {
            return c.json({ error: 'source_type and source_id required' }, 400);
        }
        const { rows } = await pool.query(
            `INSERT INTO public.voice_recall_queue (user_id, source_type, source_id, box, next_review_at)
             VALUES ($1, $2, $3, 1, NOW() + INTERVAL '1 day')
             ON CONFLICT (user_id, source_type, source_id)
             DO UPDATE SET updated_at = NOW()
             RETURNING *`,
            [userId, source_type, source_id]
        );
        return c.json(rows[0], 201);
    } catch (err) {
        return c.json({ error: err.message }, 500);
    }
});

app.post('/recall/:id/outcome', requireAuth, async (c) => {
    const userId = c.get('userId');
    const id = c.req.param('id');
    try {
        const { outcome } = await c.req.json();
        if (!['clean', 'think'].includes(outcome)) {
            return c.json({ error: 'outcome must be clean|think' }, 400);
        }
        const { rows: cur } = await pool.query(
            `SELECT * FROM public.voice_recall_queue WHERE id = $1 AND user_id = $2`,
            [id, userId]
        );
        if (!cur.length) return c.json({ error: 'Not found' }, 404);

        let box = 1;
        if (outcome === 'clean') {
            box = Math.min(4, (cur[0].box || 1) + 1);
        }
        const days = BOX_DAYS[box] || 1;
        const { rows } = await pool.query(
            `UPDATE public.voice_recall_queue
             SET box = $1,
                 last_outcome = $2,
                 next_review_at = NOW() + ($3 || ' days')::interval,
                 updated_at = NOW()
             WHERE id = $4 AND user_id = $5
             RETURNING *`,
            [box, outcome, String(days), id, userId]
        );
        return c.json(rows[0]);
    } catch (err) {
        return c.json({ error: err.message }, 500);
    }
});

app.get('/', requireAuth, async (c) => {
    const userId = c.get('userId');
    try {
        const q = (c.req.query('q') || '').trim();
        const limit = Math.min(parseInt(c.req.query('limit') || '50', 10), 100);
        let sql = `SELECT id, source_type, title,
                          COALESCE(body_text, content) AS body_text,
                          ocr_text, transcript, status,
                          source_filename, created_at, updated_at
                   FROM public.notes WHERE user_id = $1`;
        const params = [userId];
        if (q) {
            params.push(`%${q}%`);
            sql += ` AND (
                title ILIKE $${params.length}
                OR COALESCE(body_text, content, '') ILIKE $${params.length}
                OR COALESCE(ocr_text,'') ILIKE $${params.length}
                OR COALESCE(transcript,'') ILIKE $${params.length}
            )`;
        }
        params.push(limit);
        sql += ` ORDER BY created_at DESC LIMIT $${params.length}`;
        const { rows } = await pool.query(sql, params);
        return c.json(rows);
    } catch (err) {
        return c.json({ error: err.message }, 500);
    }
});

/* ── Drive folder watch (must be before /:id) ── */
app.get('/drive/status', requireAuth, async (c) => {
    const userId = c.get('userId');
    try {
        const status = await getIntegrationStatus(userId, 'google');
        const driveOk = hasDriveScope((status.scopes || []).join(' '));
        const { rows } = await pool.query(
            `SELECT * FROM public.note_drive_watches WHERE user_id = $1 ORDER BY created_at DESC`,
            [userId]
        );
        return c.json({
            googleConnected: !!status.connected,
            driveScope: driveOk,
            scopes: status.scopes || [],
            watches: rows,
            reconnectHint: driveOk
                ? null
                : 'Reconnect Google from Calendar settings to grant Drive read access for Notes sync.',
        });
    } catch (err) {
        return c.json({ error: err.message }, 500);
    }
});

app.put('/drive/watch', requireAuth, async (c) => {
    const userId = c.get('userId');
    try {
        const body = await c.req.json();
        const folderId = String(body.folder_id || '').trim();
        if (!folderId || folderId.length > 128) {
            return c.json({ error: 'folder_id required' }, 400);
        }
        const folderName = body.folder_name ? String(body.folder_name).slice(0, 200) : null;
        const enabled = body.enabled !== false;

        const { rows } = await pool.query(
            `INSERT INTO public.note_drive_watches (user_id, folder_id, folder_name, enabled, updated_at)
             VALUES ($1, $2, $3, $4, NOW())
             ON CONFLICT (user_id, folder_id) DO UPDATE SET
               folder_name = COALESCE(EXCLUDED.folder_name, public.note_drive_watches.folder_name),
               enabled = EXCLUDED.enabled,
               updated_at = NOW()
             RETURNING *`,
            [userId, folderId, folderName, enabled]
        );
        return c.json(rows[0]);
    } catch (err) {
        return c.json({ error: err.message }, 500);
    }
});

app.delete('/drive/watch/:id', requireAuth, async (c) => {
    const userId = c.get('userId');
    const id = c.req.param('id');
    try {
        await pool.query(
            `DELETE FROM public.note_drive_watches WHERE id = $1 AND user_id = $2`,
            [id, userId]
        );
        return c.json({ deleted: true });
    } catch (err) {
        return c.json({ error: err.message }, 500);
    }
});

app.post('/drive/sync', requireAuth, async (c) => {
    const userId = c.get('userId');
    try {
        const body = await c.req.json().catch(() => ({}));
        let folderId = body.folder_id ? String(body.folder_id).trim() : null;

        if (!folderId) {
            const { rows } = await pool.query(
                `SELECT folder_id FROM public.note_drive_watches
                 WHERE user_id = $1 AND enabled = true
                 ORDER BY updated_at DESC LIMIT 1`,
                [userId]
            );
            folderId = rows[0]?.folder_id || null;
        }
        if (!folderId) return c.json({ error: 'No Drive folder watch configured' }, 400);

        const result = await syncDriveFolderForUser(userId, {
            folderId,
            limit: Math.min(Number(body.limit) || 15, 25),
        });

        await pool.query(
            `UPDATE public.note_drive_watches
             SET last_synced_at = NOW(),
                 last_sync_status = $1,
                 last_sync_error = $2,
                 updated_at = NOW()
             WHERE user_id = $3 AND folder_id = $4`,
            [
                result.errors?.length ? 'partial' : 'ok',
                result.errors?.length ? JSON.stringify(result.errors).slice(0, 2000) : null,
                userId,
                folderId,
            ]
        );

        return c.json(result);
    } catch (err) {
        const code = err.code === 'NOT_CONNECTED' || err.code === 'TOKEN_REFRESH_ERROR' ? 401 : 500;
        return c.json({
            error: err.message,
            code: err.code || null,
            reconnectHint: 'Connect/reconnect Google (Calendar) including Drive read permission.',
        }, code);
    }
});

app.get('/:id/anchors', requireAuth, async (c) => {
    const userId = c.get('userId');
    const id = c.req.param('id');
    try {
        const { rows } = await pool.query(
            `SELECT * FROM public.anchor_edges
             WHERE user_id = $1 AND source_type = 'note' AND source_id = $2
             ORDER BY created_at DESC`,
            [userId, id]
        );
        return c.json(rows);
    } catch (err) {
        return c.json({ error: err.message }, 500);
    }
});

app.get('/:id', requireAuth, async (c) => {
    const userId = c.get('userId');
    const id = c.req.param('id');
    try {
        const { rows } = await pool.query(
            `SELECT * FROM public.notes WHERE id = $1 AND user_id = $2`,
            [id, userId]
        );
        if (!rows.length) return c.json({ error: 'Not found' }, 404);
        return c.json(rows[0]);
    } catch (err) {
        return c.json({ error: err.message }, 500);
    }
});

app.post('/', requireAuth, async (c) => {
    const userId = c.get('userId');
    try {
        const body = await c.req.json();
        const sourceType = ['pdf', 'voice', 'text'].includes(body.source_type)
            ? body.source_type
            : 'text';
        const title = String(body.title || 'Untitled').trim().slice(0, 200) || 'Untitled';
        let bodyText = body.body_text != null ? String(body.body_text).slice(0, 50000) : null;
        const transcript = body.transcript != null ? String(body.transcript).slice(0, 50000) : null;
        const filename = body.source_filename ? String(body.source_filename).slice(0, 260) : null;
        let ocrText = body.ocr_text != null ? String(body.ocr_text).slice(0, 100000) : null;
        let status = 'unlinked';
        let ocrMethod = body.ocr_method || null;
        let meta = body.meta && typeof body.meta === 'object' ? body.meta : {};

        if (sourceType === 'pdf') {
            let buffer = null;
            if (body.pdf_base64) {
                const raw = String(body.pdf_base64).replace(/^data:application\/pdf;base64,/, '');
                buffer = Buffer.from(raw, 'base64');
                if (buffer.length > 12 * 1024 * 1024) {
                    return c.json({ error: 'PDF too large (max 12MB)' }, 400);
                }
            }

            const resolved = await resolveNotePdfText({
                buffer,
                filename,
                clientText: ocrText || bodyText,
            });
            ocrText = resolved.text || null;
            ocrMethod = resolved.method;
            if (ocrText && !bodyText) bodyText = ocrText.slice(0, 8000);
            status = ocrText ? 'unlinked' : 'indexing';
            meta = { ...meta, ocr_method: ocrMethod, ocr_error: resolved.error || null };
        }

        // Legacy `content` is NOT NULL — dual-write from body/transcript/ocr, never null.
        const content = String(bodyText ?? transcript ?? ocrText ?? '').slice(0, 50000);

        const { rows } = await pool.query(
            `INSERT INTO public.notes
                (user_id, source_type, title, body_text, content, ocr_text, transcript, status, source_filename, meta)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10::jsonb)
             RETURNING *`,
            [
                userId,
                sourceType,
                title,
                bodyText,
                content,
                ocrText,
                transcript,
                status,
                filename,
                JSON.stringify(meta),
            ]
        );
        return c.json(rows[0], 201);
    } catch (err) {
        return c.json({ error: err.message }, 500);
    }
});

app.patch('/:id', requireAuth, async (c) => {
    const userId = c.get('userId');
    const id = c.req.param('id');
    try {
        const body = await c.req.json();
        const sets = [];
        const params = [];
        if (body.title !== undefined) {
            params.push(String(body.title).trim().slice(0, 200));
            sets.push(`title = $${params.length}`);
        }
        if (body.body_text !== undefined) {
            const nextBody = String(body.body_text).slice(0, 50000);
            params.push(nextBody);
            sets.push(`body_text = $${params.length}`);
            params.push(nextBody);
            sets.push(`content = $${params.length}`);
        }
        if (body.status !== undefined && ['indexing', 'linked', 'unlinked'].includes(body.status)) {
            params.push(body.status);
            sets.push(`status = $${params.length}`);
        }
        if (sets.length === 0) return c.json({ error: 'No fields' }, 400);
        sets.push('updated_at = NOW()');
        params.push(id, userId);
        const { rows } = await pool.query(
            `UPDATE public.notes SET ${sets.join(', ')}
             WHERE id = $${params.length - 1} AND user_id = $${params.length}
             RETURNING *`,
            params
        );
        if (!rows.length) return c.json({ error: 'Not found' }, 404);
        return c.json(rows[0]);
    } catch (err) {
        return c.json({ error: err.message }, 500);
    }
});

app.delete('/:id', requireAuth, async (c) => {
    const userId = c.get('userId');
    const id = c.req.param('id');
    try {
        await pool.query(`DELETE FROM public.notes WHERE id = $1 AND user_id = $2`, [id, userId]);
        return c.json({ deleted: true });
    } catch (err) {
        return c.json({ error: err.message }, 500);
    }
});

app.post('/:id/link-suggest', requireAuth, async (c) => {
    const userId = c.get('userId');
    const id = c.req.param('id');
    try {
        const { rows: notes } = await pool.query(
            `SELECT * FROM public.notes WHERE id = $1 AND user_id = $2`,
            [id, userId]
        );
        if (!notes.length) return c.json({ error: 'Not found' }, 404);
        const hay = `${notes[0].title || ''} ${notes[0].body_text || ''} ${notes[0].ocr_text || ''} ${notes[0].transcript || ''}`.toLowerCase();

        const { rows: habits } = await pool.query(
            `SELECT id, name FROM habits WHERE user_id = $1 AND status = 'active'`,
            [userId]
        );

        const suggested = [];
        for (const h of habits) {
            const name = String(h.name || '').trim();
            if (name.length < 3) continue;
            if (!hay.includes(name.toLowerCase())) continue;
            const { rows } = await pool.query(
                `INSERT INTO public.anchor_edges
                    (user_id, source_type, source_id, target_type, target_id, relationship, confidence, confirmed)
                 VALUES ($1, 'note', $2, 'habit', $3, 'reinforces', 0.5, false)
                 ON CONFLICT DO NOTHING
                 RETURNING *`,
                [userId, id, String(h.id)]
            );
            if (rows[0]) suggested.push({ ...rows[0], habit_name: name });
        }

        if (suggested.length) {
            await pool.query(
                `UPDATE public.notes SET status = 'linked', updated_at = NOW() WHERE id = $1 AND user_id = $2`,
                [id, userId]
            );
        }
        return c.json({ suggested });
    } catch (err) {
        return c.json({ error: err.message }, 500);
    }
});

app.post('/anchors/:edgeId/confirm', requireAuth, async (c) => {
    const userId = c.get('userId');
    const edgeId = c.req.param('edgeId');
    try {
        const { rows } = await pool.query(
            `UPDATE public.anchor_edges SET confirmed = true
             WHERE id = $1 AND user_id = $2
             RETURNING *`,
            [edgeId, userId]
        );
        if (!rows.length) return c.json({ error: 'Not found' }, 404);
        return c.json(rows[0]);
    } catch (err) {
        return c.json({ error: err.message }, 500);
    }
});

export default app;
