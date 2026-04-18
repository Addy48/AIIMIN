import { Hono } from 'hono';
import { getPool } from '../lib/db.js';

const placementsRoutes = new Hono();

// ==========================================
// RESUMES
// ==========================================

placementsRoutes.get('/resumes', async (c) => {
    const user = c.get('user');
    const pool = getPool();
    try {
        const { rows } = await pool.query(
            'SELECT * FROM public.resumes WHERE user_id = $1 ORDER BY created_at DESC',
            [user.id]
        );
        return c.json(rows);
    } catch (err) {
        console.error('Error fetching resumes:', err);
        return c.json({ error: 'Failed to fetch resumes' }, 500);
    }
});

placementsRoutes.post('/resumes', async (c) => {
    const user = c.get('user');
    const pool = getPool();
    try {
        const { title, target_role, link_url } = await c.req.json();
        const { rows } = await pool.query(
            `INSERT INTO public.resumes (user_id, title, target_role, link_url)
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [user.id, title, target_role, link_url]
        );
        return c.json(rows[0]);
    } catch (err) {
        console.error('Error creating resume:', err);
        return c.json({ error: 'Failed to create resume' }, 500);
    }
});

placementsRoutes.delete('/resumes/:id', async (c) => {
    const user = c.get('user');
    const id = c.req.param('id');
    const pool = getPool();
    try {
        await pool.query('DELETE FROM public.resumes WHERE id = $1 AND user_id = $2', [id, user.id]);
        return c.json({ success: true });
    } catch (err) {
        console.error('Error deleting resume:', err);
        return c.json({ error: 'Failed to delete resume' }, 500);
    }
});

// ==========================================
// JOB APPLICATIONS
// ==========================================

placementsRoutes.get('/applications', async (c) => {
    const user = c.get('user');
    const pool = getPool();
    try {
        const { rows } = await pool.query(
            `SELECT a.*, r.title as resume_title 
             FROM public.job_applications a
             LEFT JOIN public.resumes r ON a.resume_id = r.id
             WHERE a.user_id = $1 ORDER BY a.updated_at DESC`,
            [user.id]
        );
        return c.json(rows);
    } catch (err) {
        console.error('Error fetching applications:', err);
        return c.json({ error: 'Failed to fetch applications' }, 500);
    }
});

placementsRoutes.post('/applications', async (c) => {
    const user = c.get('user');
    const pool = getPool();
    try {
        const { company_name, role_title, status, resume_id, linkedin_url, job_post_url, notes, applied_at } = await c.req.json();
        const { rows } = await pool.query(
            `INSERT INTO public.job_applications 
             (user_id, company_name, role_title, status, resume_id, linkedin_url, job_post_url, notes, applied_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
            [user.id, company_name, role_title, status || 'wishlist', resume_id, linkedin_url, job_post_url, notes, applied_at]
        );
        return c.json(rows[0]);
    } catch (err) {
        console.error('Error creating application:', err);
        return c.json({ error: 'Failed to create application' }, 500);
    }
});

placementsRoutes.put('/applications/:id', async (c) => {
    const user = c.get('user');
    const id = c.req.param('id');
    const pool = getPool();
    try {
        const updates = await c.req.json();
        const { company_name, role_title, status, resume_id, linkedin_url, job_post_url, notes, applied_at } = updates;
        
        const { rows } = await pool.query(
            `UPDATE public.job_applications 
             SET company_name = COALESCE($1, company_name),
                 role_title = COALESCE($2, role_title),
                 status = COALESCE($3, status),
                 resume_id = COALESCE($4, resume_id),
                 linkedin_url = COALESCE($5, linkedin_url),
                 job_post_url = COALESCE($6, job_post_url),
                 notes = COALESCE($7, notes),
                 applied_at = COALESCE($8, applied_at),
                 updated_at = NOW()
             WHERE id = $9 AND user_id = $10 RETURNING *`,
            [company_name, role_title, status, resume_id, linkedin_url, job_post_url, notes, applied_at, id, user.id]
        );
        return c.json(rows[0]);
    } catch (err) {
        console.error('Error updating application:', err);
        return c.json({ error: 'Failed to update application' }, 500);
    }
});

placementsRoutes.delete('/applications/:id', async (c) => {
    const user = c.get('user');
    const id = c.req.param('id');
    const pool = getPool();
    try {
        await pool.query('DELETE FROM public.job_applications WHERE id = $1 AND user_id = $2', [id, user.id]);
        return c.json({ success: true });
    } catch (err) {
        console.error('Error deleting application:', err);
        return c.json({ error: 'Failed to delete application' }, 500);
    }
});

export default placementsRoutes;
