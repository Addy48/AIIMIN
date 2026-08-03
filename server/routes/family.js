/**
 * server/routes/family.js
 * Hono router — Family Vault CRUD
 * Tables: family_members, family_documents, family_insurance,
 *         family_health, family_reminders, family_emergency_contacts
 */
import { Hono } from 'hono';
import { pool } from '../lib/db.js';
import { requireAuth } from '../middleware/auth.js';

const app = new Hono();

/* ══════════════════════════════════════════════════════════
   MEMBERS
══════════════════════════════════════════════════════════ */
app.get('/members', requireAuth, async (c) => {
  const uid = c.get('userId');
  const { rows } = await pool.query(
    `SELECT * FROM family_members WHERE user_id = $1 ORDER BY created_at ASC`, [uid]
  );
  return c.json(rows);
});

app.post('/members', requireAuth, async (c) => {
  const uid = c.get('userId');
  const { name, relation, dob, phone, blood_group } = await c.req.json();
  if (!name?.trim()) return c.json({ error: 'name required' }, 400);
  const { rows } = await pool.query(
    `INSERT INTO family_members (user_id,name,relation,dob,phone,blood_group)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [uid, name.trim(), relation||null, dob||null, phone||null, blood_group||null]
  );
  return c.json(rows[0], 201);
});

app.put('/members/:id', requireAuth, async (c) => {
  const uid = c.get('userId'); const id = c.req.param('id');
  const fields = await c.req.json();
  const cols = ['name','relation','dob','phone','blood_group'];
  const sets = []; const params = [];
  cols.forEach(col => { if (fields[col] !== undefined) { params.push(fields[col]); sets.push(`${col}=$${params.length}`); } });
  if (!sets.length) return c.json({ error: 'Nothing to update' }, 400);
  params.push(id, uid);
  const { rows } = await pool.query(
    `UPDATE family_members SET ${sets.join(',')} WHERE id=$${params.length-1} AND user_id=$${params.length} RETURNING *`, params
  );
  if (!rows.length) return c.json({ error: 'Not found' }, 404);
  return c.json(rows[0]);
});

app.delete('/members/:id', requireAuth, async (c) => {
  const uid = c.get('userId'); const id = c.req.param('id');
  await pool.query(`DELETE FROM family_members WHERE id=$1 AND user_id=$2`, [id, uid]);
  return c.json({ deleted: true });
});

/* ══════════════════════════════════════════════════════════
   DOCUMENTS
══════════════════════════════════════════════════════════ */
app.get('/documents', requireAuth, async (c) => {
  const uid = c.get('userId');
  const { rows } = await pool.query(
    `SELECT d.*, m.name as member_name, m.relation as member_relation
     FROM family_documents d
     JOIN family_members m ON m.id = d.member_id
     WHERE d.user_id=$1 ORDER BY d.created_at DESC`, [uid]
  );
  return c.json(rows);
});

app.post('/documents', requireAuth, async (c) => {
  const uid = c.get('userId');
  const { member_id, doc_type, doc_number, issue_date, expiry_date, issuing_country, notes } = await c.req.json();
  if (!member_id || !doc_type) return c.json({ error: 'member_id and doc_type required' }, 400);
  const { rows } = await pool.query(
    `INSERT INTO family_documents (user_id,member_id,doc_type,doc_number,issue_date,expiry_date,issuing_country,notes)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [uid, member_id, doc_type, doc_number||null, issue_date||null, expiry_date||null, issuing_country||'India', notes||null]
  );
  // Auto-create reminder if expiry_date within 365 days
  if (expiry_date) {
    const daysUntil = Math.ceil((new Date(expiry_date) - new Date()) / 86400000);
    if (daysUntil > 0 && daysUntil <= 365) {
      await pool.query(
        // source_type/source_id are this table's generic link columns.
        `INSERT INTO family_reminders (user_id,title,source_type,due_date,source_id,description,is_auto_generated)
         VALUES ($1,$2,'doc_expiry',$3,$4,$5,true)
         ON CONFLICT DO NOTHING`,
        [uid, `${doc_type.toUpperCase()} expiry`, expiry_date, rows[0].id, `Document expires on ${expiry_date}`]
      );
    }
  }
  return c.json(rows[0], 201);
});

app.put('/documents/:id', requireAuth, async (c) => {
  const uid = c.get('userId'); const id = c.req.param('id');
  const fields = await c.req.json();
  const cols = ['doc_type','doc_number','issue_date','expiry_date','issuing_country','notes'];
  const sets = ['updated_at=NOW()']; const params = [];
  cols.forEach(col => { if (fields[col] !== undefined) { params.push(fields[col]); sets.push(`${col}=$${params.length}`); } });
  params.push(id, uid);
  const { rows } = await pool.query(
    `UPDATE family_documents SET ${sets.join(',')} WHERE id=$${params.length-1} AND user_id=$${params.length} RETURNING *`, params
  );
  if (!rows.length) return c.json({ error: 'Not found' }, 404);
  return c.json(rows[0]);
});

app.delete('/documents/:id', requireAuth, async (c) => {
  const uid = c.get('userId'); const id = c.req.param('id');
  await pool.query(`DELETE FROM family_documents WHERE id=$1 AND user_id=$2`, [id, uid]);
  return c.json({ deleted: true });
});

/* ══════════════════════════════════════════════════════════
   INSURANCE
══════════════════════════════════════════════════════════ */
app.get('/insurance', requireAuth, async (c) => {
  const uid = c.get('userId');
  const { rows } = await pool.query(
    // nominee is stored as free text on this table, not a member reference.
    `SELECT i.*, i.nominee AS nominee_name
     FROM family_insurance i
     WHERE i.user_id=$1 ORDER BY i.created_at DESC`, [uid]
  );
  return c.json(rows);
});

app.post('/insurance', requireAuth, async (c) => {
  const uid = c.get('userId');
  // Accept the legacy field names too, so existing callers keep working.
  const body = await c.req.json();
  const { policy_name, member_id, policy_number, premium_amount, nominee } = body;
  const provider = body.provider ?? body.insurer;
  const next_premium_date = body.renewal_date ?? body.next_premium_date;
  if (!policy_name?.trim()) return c.json({ error: 'policy_name required' }, 400);
  const { rows } = await pool.query(
    `INSERT INTO family_insurance
       (user_id,member_id,policy_name,provider,policy_number,premium_amount,renewal_date,nominee)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [uid, member_id||null, policy_name.trim(), provider||null, policy_number||null,
     premium_amount||null, next_premium_date||null, nominee||null]
  );
  // Auto-reminder for premium
  if (next_premium_date) {
    const daysUntil = Math.ceil((new Date(next_premium_date) - new Date()) / 86400000);
    if (daysUntil > 0 && daysUntil <= 60) {
      await pool.query(
        `INSERT INTO family_reminders (user_id,title,source_type,due_date,source_id,description,is_auto_generated)
         VALUES ($1,$2,'premium_due',$3,$4,$5,true)
         ON CONFLICT DO NOTHING`,
        [uid, `${policy_name} premium due`, next_premium_date, rows[0].id, `Premium of ₹${premium_amount || '?'} due`]
      );
    }
  }
  return c.json(rows[0], 201);
});

app.put('/insurance/:id', requireAuth, async (c) => {
  const uid = c.get('userId'); const id = c.req.param('id');
  const fields = await c.req.json();
  const cols = ['member_id','policy_name','provider','policy_number','premium_amount','renewal_date','nominee'];
  const sets = []; const params = [];
  cols.forEach(col => { if (fields[col] !== undefined) { params.push(fields[col]); sets.push(`${col}=$${params.length}`); } });
  if (!sets.length) return c.json({ error: 'Nothing to update' }, 400);
  params.push(id, uid);
  const { rows } = await pool.query(
    `UPDATE family_insurance SET ${sets.join(',')} WHERE id=$${params.length-1} AND user_id=$${params.length} RETURNING *`, params
  );
  if (!rows.length) return c.json({ error: 'Not found' }, 404);
  return c.json(rows[0]);
});

app.delete('/insurance/:id', requireAuth, async (c) => {
  const uid = c.get('userId'); const id = c.req.param('id');
  await pool.query(`DELETE FROM family_insurance WHERE id=$1 AND user_id=$2`, [id, uid]);
  return c.json({ deleted: true });
});

/* ══════════════════════════════════════════════════════════
   HEALTH
══════════════════════════════════════════════════════════ */
app.get('/health-records', requireAuth, async (c) => {
  const uid = c.get('userId');
  const { rows } = await pool.query(
    `SELECT h.*, m.name as member_name FROM family_health h
     JOIN family_members m ON m.id = h.member_id
     WHERE h.user_id=$1`, [uid]
  );
  return c.json(rows);
});

app.post('/health-records', requireAuth, async (c) => {
  const uid = c.get('userId');
  const body = await c.req.json();
  const { member_id, allergies, medications, doctor_name, doctor_phone } = body;
  // Legacy field name accepted; the column is `conditions`.
  const conditions = body.conditions ?? body.chronic_conditions;
  if (!member_id) return c.json({ error: 'member_id required' }, 400);

  // These columns are TEXT, and there is no UNIQUE (user_id, member_id) on this
  // table, so upsert by hand rather than with ON CONFLICT.
  const asText = (v) => (Array.isArray(v) ? v.filter(Boolean).join(', ') : v) || null;
  const values = [asText(allergies), asText(conditions), asText(medications), doctor_name || null, doctor_phone || null];

  const { rows: existing } = await pool.query(
    `SELECT id FROM family_health WHERE user_id=$1 AND member_id=$2 LIMIT 1`, [uid, member_id]
  );
  const { rows } = existing.length
    ? await pool.query(
        `UPDATE family_health SET allergies=$1,conditions=$2,medications=$3,doctor_name=$4,doctor_phone=$5
         WHERE id=$6 AND user_id=$7 RETURNING *`,
        [...values, existing[0].id, uid]
      )
    : await pool.query(
        `INSERT INTO family_health (allergies,conditions,medications,doctor_name,doctor_phone,user_id,member_id)
         VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
        [...values, uid, member_id]
      );
  return c.json(rows[0], 201);
});

/* ══════════════════════════════════════════════════════════
   REMINDERS
══════════════════════════════════════════════════════════ */
app.get('/reminders', requireAuth, async (c) => {
  const uid = c.get('userId');
  const { done = 'false' } = c.req.query();
  const { rows } = await pool.query(
    // source_id is generic (member / document / policy); the join only resolves
    // when it happens to point at a member.
    `SELECT r.*, m.name as member_name
     FROM family_reminders r
     LEFT JOIN family_members m ON m.id = r.source_id
     WHERE r.user_id=$1 AND r.completed=$2
     ORDER BY r.due_date ASC`,
    [uid, done === 'true']
  );
  return c.json(rows);
});

app.post('/reminders', requireAuth, async (c) => {
  const uid = c.get('userId');
  const body = await c.req.json();
  const { title, due_date } = body;
  const source_type = body.source_type ?? body.reminder_type;
  const source_id = body.source_id ?? body.linked_member_id;
  const description = body.description ?? body.notes;
  if (!title?.trim() || !due_date) return c.json({ error: 'title and due_date required' }, 400);
  const { rows } = await pool.query(
    `INSERT INTO family_reminders (user_id,title,source_type,due_date,source_id,description)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [uid, title.trim(), source_type||'custom', due_date, source_id||null, description||null]
  );
  return c.json(rows[0], 201);
});

app.patch('/reminders/:id/done', requireAuth, async (c) => {
  const uid = c.get('userId'); const id = c.req.param('id');
  const body = await c.req.json();
  const done = body.completed ?? body.is_done;
  const { rows } = await pool.query(
    `UPDATE family_reminders SET completed=$1 WHERE id=$2 AND user_id=$3 RETURNING *`,
    [!!done, id, uid]
  );
  if (!rows.length) return c.json({ error: 'Not found' }, 404);
  return c.json(rows[0]);
});

app.delete('/reminders/:id', requireAuth, async (c) => {
  const uid = c.get('userId'); const id = c.req.param('id');
  await pool.query(`DELETE FROM family_reminders WHERE id=$1 AND user_id=$2`, [id, uid]);
  return c.json({ deleted: true });
});

/* ══════════════════════════════════════════════════════════
   EMERGENCY CONTACTS
══════════════════════════════════════════════════════════ */
app.get('/emergency', requireAuth, async (c) => {
  const uid = c.get('userId');
  const { rows } = await pool.query(
    `SELECT * FROM family_emergency_contacts WHERE user_id=$1 ORDER BY is_pinned DESC, name ASC`, [uid]
  );
  return c.json(rows);
});

app.post('/emergency', requireAuth, async (c) => {
  const uid = c.get('userId');
  const body = await c.req.json();
  const { name, phone, is_pinned, notes } = body;
  const relationOrRole = body.relation_or_role ?? body.relation;
  if (!name?.trim() || !phone?.trim()) return c.json({ error: 'name and phone required' }, 400);
  const { rows } = await pool.query(
    `INSERT INTO family_emergency_contacts (user_id,name,relation_or_role,phone,is_pinned,notes)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [uid, name.trim(), relationOrRole||null, phone.trim(), !!is_pinned, notes||null]
  );
  return c.json(rows[0], 201);
});

app.patch('/emergency/:id/pin', requireAuth, async (c) => {
  const uid = c.get('userId'); const id = c.req.param('id');
  const { is_pinned } = await c.req.json();
  await pool.query(`UPDATE family_emergency_contacts SET is_pinned=$1 WHERE id=$2 AND user_id=$3`, [!!is_pinned, id, uid]);
  return c.json({ ok: true });
});

app.delete('/emergency/:id', requireAuth, async (c) => {
  const uid = c.get('userId'); const id = c.req.param('id');
  await pool.query(`DELETE FROM family_emergency_contacts WHERE id=$1 AND user_id=$2`, [id, uid]);
  return c.json({ deleted: true });
});

export default app;
