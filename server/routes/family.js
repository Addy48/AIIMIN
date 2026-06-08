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
  const { name, relation, dob, phone, email, blood_group, profile_note, avatar_color } = await c.req.json();
  if (!name?.trim()) return c.json({ error: 'name required' }, 400);
  const { rows } = await pool.query(
    `INSERT INTO family_members (user_id,name,relation,dob,phone,email,blood_group,profile_note,avatar_color)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
    [uid, name.trim(), relation||null, dob||null, phone||null, email||null, blood_group||null, profile_note||null, avatar_color||'#3B82F6']
  );
  return c.json(rows[0], 201);
});

app.put('/members/:id', requireAuth, async (c) => {
  const uid = c.get('userId'); const id = c.req.param('id');
  const fields = await c.req.json();
  const cols = ['name','relation','dob','phone','email','blood_group','profile_note','avatar_color'];
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
        `INSERT INTO family_reminders (user_id,title,reminder_type,due_date,linked_member_id,linked_doc_id,notes)
         VALUES ($1,$2,'doc_expiry',$3,$4,$5,$6)
         ON CONFLICT DO NOTHING`,
        [uid, `${doc_type.toUpperCase()} expiry`, expiry_date, member_id, rows[0].id, `Document expires on ${expiry_date}`]
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
    `SELECT i.*, m.name as nominee_name
     FROM family_insurance i
     LEFT JOIN family_members m ON m.id = i.nominee_member_id
     WHERE i.user_id=$1 ORDER BY i.created_at DESC`, [uid]
  );
  return c.json(rows);
});

app.post('/insurance', requireAuth, async (c) => {
  const uid = c.get('userId');
  const { policy_name, insurer, policy_type, policy_number, sum_insured, premium_amount,
          premium_freq, next_premium_date, maturity_date, nominee_member_id, agent_name, agent_phone, notes } = await c.req.json();
  if (!policy_name?.trim()) return c.json({ error: 'policy_name required' }, 400);
  const { rows } = await pool.query(
    `INSERT INTO family_insurance
       (user_id,policy_name,insurer,policy_type,policy_number,sum_insured,premium_amount,
        premium_freq,next_premium_date,maturity_date,nominee_member_id,agent_name,agent_phone,notes)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *`,
    [uid, policy_name.trim(), insurer||null, policy_type||'life', policy_number||null,
     sum_insured||null, premium_amount||null, premium_freq||'annual', next_premium_date||null,
     maturity_date||null, nominee_member_id||null, agent_name||null, agent_phone||null, notes||null]
  );
  // Auto-reminder for premium
  if (next_premium_date) {
    const daysUntil = Math.ceil((new Date(next_premium_date) - new Date()) / 86400000);
    if (daysUntil > 0 && daysUntil <= 60) {
      await pool.query(
        `INSERT INTO family_reminders (user_id,title,reminder_type,due_date,linked_policy_id,notes)
         VALUES ($1,$2,'premium_due',$3,$4,$5)
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
  const cols = ['policy_name','insurer','policy_type','policy_number','sum_insured','premium_amount',
                'premium_freq','next_premium_date','maturity_date','nominee_member_id','agent_name','agent_phone','notes'];
  const sets = ['updated_at=NOW()']; const params = [];
  cols.forEach(col => { if (fields[col] !== undefined) { params.push(fields[col]); sets.push(`${col}=$${params.length}`); } });
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
  const { member_id, allergies, chronic_conditions, medications, blood_group, doctor_name, doctor_phone, hospital_name, health_notes } = await c.req.json();
  if (!member_id) return c.json({ error: 'member_id required' }, 400);
  const { rows } = await pool.query(
    `INSERT INTO family_health (user_id,member_id,allergies,chronic_conditions,medications,blood_group,doctor_name,doctor_phone,hospital_name,health_notes)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
     ON CONFLICT (user_id, member_id) DO UPDATE
       SET allergies=$3,chronic_conditions=$4,medications=$5,blood_group=$6,
           doctor_name=$7,doctor_phone=$8,hospital_name=$9,health_notes=$10,updated_at=NOW()
     RETURNING *`,
    [uid, member_id, allergies||[], chronic_conditions||[], medications||[], blood_group||null,
     doctor_name||null, doctor_phone||null, hospital_name||null, health_notes||null]
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
    `SELECT r.*, m.name as member_name
     FROM family_reminders r
     LEFT JOIN family_members m ON m.id = r.linked_member_id
     WHERE r.user_id=$1 AND r.is_done=$2
     ORDER BY r.due_date ASC`,
    [uid, done === 'true']
  );
  return c.json(rows);
});

app.post('/reminders', requireAuth, async (c) => {
  const uid = c.get('userId');
  const { title, reminder_type, due_date, linked_member_id, notes } = await c.req.json();
  if (!title?.trim() || !due_date) return c.json({ error: 'title and due_date required' }, 400);
  const { rows } = await pool.query(
    `INSERT INTO family_reminders (user_id,title,reminder_type,due_date,linked_member_id,notes)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [uid, title.trim(), reminder_type||'custom', due_date, linked_member_id||null, notes||null]
  );
  return c.json(rows[0], 201);
});

app.patch('/reminders/:id/done', requireAuth, async (c) => {
  const uid = c.get('userId'); const id = c.req.param('id');
  const { is_done } = await c.req.json();
  const { rows } = await pool.query(
    `UPDATE family_reminders SET is_done=$1 WHERE id=$2 AND user_id=$3 RETURNING *`,
    [!!is_done, id, uid]
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
  const { name, relation, phone, alt_phone, is_pinned, notes } = await c.req.json();
  if (!name?.trim() || !phone?.trim()) return c.json({ error: 'name and phone required' }, 400);
  const { rows } = await pool.query(
    `INSERT INTO family_emergency_contacts (user_id,name,relation,phone,alt_phone,is_pinned,notes)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [uid, name.trim(), relation||null, phone.trim(), alt_phone||null, !!is_pinned, notes||null]
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
