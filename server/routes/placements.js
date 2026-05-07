import { Hono } from 'hono';
import { pool } from '../lib/db.js';
import { requireAuth } from '../middleware/auth.js';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Client for storage operations
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);


const placementsRoutes = new Hono();

// ==========================================
// RESUMES
// ==========================================

placementsRoutes.post('/resumes/upload', requireAuth, async (c) => {
    try {
        const body = await c.req.parseBody();
        const file = body['file'];
        
        if (!file) {
            return c.json({ error: 'No file provided' }, 400);
        }

        // Convert the File object to a Buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Generate unique filename to avoid collisions
        const uniqueId = crypto.randomUUID();
        const ext = file.name.split('.').pop() || 'pdf';
        const filePath = `resumes/${uniqueId}.${ext}`;

        // Upload to Supabase Storage
        const { data, error } = await supabase
            .storage
            .from('dashboard-uploads')
            .upload(filePath, buffer, {
                contentType: file.type || 'application/pdf',
                upsert: true
            });

        if (error) {
            throw error;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase
            .storage
            .from('dashboard-uploads')
            .getPublicUrl(filePath);

        return c.json({
            url: publicUrl,
            key: publicUrl // For compatibility with the frontend's expected key
        });
    } catch (err) {
        console.error('Error uploading resume:', err);
        return c.json({ error: 'Failed to upload resume', message: err.message }, 500);
    }
});


placementsRoutes.get('/resumes', requireAuth, async (c) => {
    const userId = c.get('userId');
    try {
        const res = await pool.query(
            'SELECT * FROM resumes WHERE user_id = $1 ORDER BY created_at DESC',
            [userId]
        );
        
        // Vercel blob URLs are public, so view_url is just the link_url
        const resumesWithUrls = res.rows.map((resume) => ({
            ...resume,
            view_url: resume.link_url
        }));
        
        return c.json(resumesWithUrls);
    } catch (err) {
        console.error('Error fetching resumes:', err);
        return c.json({ error: 'Failed to fetch resumes' }, 500);
    }
});

placementsRoutes.post('/resumes/confirm', requireAuth, async (c) => {
    const userId = c.get('userId');
    try {
        const { title, target_role, key } = await c.req.json();
        
        if (!key) {
            return c.json({ error: 'Key is required' }, 400);
        }

        const res = await pool.query(
            `INSERT INTO resumes (user_id, title, target_role, link_url) 
             VALUES ($1, $2, $3, $4) 
             RETURNING *`,
            [userId, title, target_role || 'General', key]
        );
        
        return c.json({
            ...res.rows[0],
            view_url: key
        });
    } catch (err) {
        console.error('Error confirming resume:', err);
        return c.json({ error: 'Failed to confirm resume' }, 500);
    }
});

placementsRoutes.get('/resumes/:id/view-url', requireAuth, async (c) => {
    const userId = c.get('userId');
    const id = c.req.param('id');
    try {
        const res = await pool.query(
            'SELECT link_url FROM resumes WHERE id = $1 AND user_id = $2',
            [id, userId]
        );
        if (res.rows.length === 0) {
            return c.json({ error: 'Resume not found' }, 404);
        }
        
        return c.json({ viewUrl: res.rows[0].link_url });
    } catch (err) {
        console.error('Error generating view url:', err);
        return c.json({ error: 'Failed to generate view url' }, 500);
    }
});

placementsRoutes.delete('/resumes/:id', requireAuth, async (c) => {
    const userId = c.get('userId');
    const id = c.req.param('id');
    try {
        const fetchRes = await pool.query(
            'SELECT link_url FROM resumes WHERE id = $1 AND user_id = $2',
            [id, userId]
        );
        if (fetchRes.rows.length === 0) {
            return c.json({ error: 'Resume not found' }, 404);
        }
        
        const fileKey = fetchRes.rows[0].link_url;
        
        // Delete from Storage
        if (fileKey) {
            try {
                let filePath = fileKey;
                if (fileKey.includes('/dashboard-uploads/')) {
                    filePath = fileKey.split('/dashboard-uploads/').pop();
                    await supabase.storage.from('dashboard-uploads').remove([filePath]);
                }
            } catch (blobErr) {
                console.error(`Blob clean-up failed for key ${fileKey}:`, blobErr);
            }
        }

        
        await pool.query(
            'DELETE FROM resumes WHERE id = $1 AND user_id = $2',
            [id, userId]
        );
        
        return c.json({ success: true });
    } catch (err) {
        console.error('Error deleting resume:', err);
        return c.json({ error: 'Failed to delete resume', message: err.message }, 500);
    }
});

// ==========================================
// JOB APPLICATIONS
// ==========================================

placementsRoutes.get('/applications', requireAuth, async (c) => {
    const userId = c.get('userId');
    try {
        const res = await pool.query(
            `SELECT ja.*, r.title AS resume_title
             FROM job_applications ja
             LEFT JOIN resumes r ON ja.resume_id = r.id
             WHERE ja.user_id = $1
             ORDER BY ja.updated_at DESC`,
            [userId]
        );
        return c.json(res.rows);
    } catch (err) {
        console.error('Error fetching applications:', err);
        return c.json({ error: 'Failed to fetch applications' }, 500);
    }
});

placementsRoutes.post('/applications', requireAuth, async (c) => {
    const userId = c.get('userId');
    try {
        const body = await c.req.json();
        const { company_name, role_title, status, resume_id, linkedin_url, job_post_url, notes, applied_at } = body;
        
        const res = await pool.query(
            `INSERT INTO job_applications (
                user_id, company_name, role_title, status, resume_id, linkedin_url, job_post_url, notes, applied_at
             ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
             RETURNING *`,
            [
                userId,
                company_name,
                role_title,
                status || 'wishlist',
                resume_id || null,
                linkedin_url || null,
                job_post_url || null,
                notes || null,
                applied_at || null
            ]
        );
        
        return c.json(res.rows[0]);
    } catch (err) {
        console.error('Error creating application:', err);
        return c.json({ error: 'Failed to create application' }, 500);
    }
});

placementsRoutes.put('/applications/:id', requireAuth, async (c) => {
    const userId = c.get('userId');
    const id = c.req.param('id');
    try {
        const updates = await c.req.json();
        const { company_name, role_title, status, resume_id, linkedin_url, job_post_url, notes, applied_at } = updates;
        
        const res = await pool.query(
            `UPDATE job_applications
             SET company_name = $1,
                 role_title = $2,
                 status = $3,
                 resume_id = $4,
                 linkedin_url = $5,
                 job_post_url = $6,
                 notes = $7,
                 applied_at = $8,
                 updated_at = NOW()
             WHERE id = $9 AND user_id = $10
             RETURNING *`,
            [
                company_name,
                role_title,
                status,
                resume_id || null,
                linkedin_url || null,
                job_post_url || null,
                notes || null,
                applied_at || null,
                id,
                userId
            ]
        );
        
        if (res.rows.length === 0) {
            return c.json({ error: 'Application not found' }, 404);
        }
        
        return c.json(res.rows[0]);
    } catch (err) {
        console.error('Error updating application:', err);
        return c.json({ error: 'Failed to update application' }, 500);
    }
});

placementsRoutes.delete('/applications/:id', requireAuth, async (c) => {
    const userId = c.get('userId');
    const id = c.req.param('id');
    try {
        const res = await pool.query(
            'DELETE FROM job_applications WHERE id = $1 AND user_id = $2 RETURNING *',
            [id, userId]
        );
        if (res.rows.length === 0) {
            return c.json({ error: 'Application not found or unauthorized' }, 404);
        }
        return c.json({ success: true });
    } catch (err) {
        console.error('Error deleting application:', err);
        return c.json({ error: 'Failed to delete application' }, 500);
    }
});

// ==========================================
// HABIT LOGS & READINESS
// ==========================================

placementsRoutes.get('/habit-logs', requireAuth, async (c) => {
    const userId = c.get('userId');
    try {
        const res = await pool.query(
            "SELECT id, completed_at, created_at, status FROM habit_logs WHERE user_id = $1 AND created_at >= NOW() - INTERVAL '14 days'",
            [userId]
        );
        return c.json(res.rows);
    } catch (err) {
        console.error('Error fetching habit logs:', err);
        return c.json({ error: 'Failed to fetch habit logs', message: err.message }, 500);
    }
});

placementsRoutes.get('/readiness', requireAuth, async (c) => {
    const userId = c.get('userId');
    try {
        const [dsaRes, speakingRes, resumesRes] = await Promise.all([
            pool.query('SELECT COUNT(*) as count FROM dsa_logs WHERE user_id = $1', [userId]),
            pool.query('SELECT confidence_score, clarity_score, pace_score FROM lab_speaking_logs WHERE user_id = $1', [userId]),
            pool.query('SELECT COUNT(*) as count FROM resumes WHERE user_id = $1', [userId])
        ]);

        const dsaCount = parseInt(dsaRes.rows[0].count, 10);
        const speakingLogs = speakingRes.rows;
        const resumeCount = parseInt(resumesRes.rows[0].count, 10);

        const dsaScore = Math.min(100, Math.max(35, 35 + dsaCount * 5));
        const dsaDesc = dsaCount > 0 ? `${dsaCount} problems solved this period` : 'No solved problems logged yet';

        let communicationScore = 60;
        if (speakingLogs.length > 0) {
            const totalSum = speakingLogs.reduce((acc, log) => {
                const conf = Number(log.confidence_score || 0);
                const clar = Number(log.clarity_score || 0);
                const pace = Number(log.pace_score || 0);
                return acc + (conf + clar + pace) / 3;
            }, 0);
            const rawAvg = totalSum / speakingLogs.length;
            communicationScore = rawAvg <= 10 ? Math.round(rawAvg * 10) : Math.round(rawAvg);
            communicationScore = Math.min(100, Math.max(0, communicationScore));
        }
        const communicationDesc = speakingLogs.length > 0 
            ? `Based on ${speakingLogs.length} speech logs` 
            : 'Record speaking logs to benchmark';

        const systemDesignScore = Math.min(100, Math.max(40, 40 + resumeCount * 15));
        const systemDesignDesc = resumeCount > 0 
            ? `${resumeCount} active resumes mapped` 
            : 'Target key systems in resumes';

        return c.json({
            dsa: { score: dsaScore, desc: dsaDesc },
            communication: { score: communicationScore, desc: communicationDesc },
            systemDesign: { score: systemDesignScore, desc: systemDesignDesc }
        });
    } catch (err) {
        console.error('Error fetching readiness metrics:', err);
        return c.json({ error: 'Failed to fetch readiness metrics', message: err.message }, 500);
    }
});

export default placementsRoutes;
