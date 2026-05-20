import { Hono } from 'hono';
import { supabase } from '../lib/db.js';
import { requireAuth } from '../middleware/auth.js';
import { getUploadPresignedUrl } from '../services/s3Service.js';

const placementsRoutes = new Hono();

// ==========================================
// RESUMES
// ==========================================

placementsRoutes.get('/resumes/upload-ticket', requireAuth, async (c) => {
    const userId = c.get('userId');
    const fileKey = c.req.query('filename') || 'resume.pdf';
    const contentType = c.req.query('contentType') || 'application/pdf';
    
    try {
        const ticket = await getUploadPresignedUrl(userId, fileKey, contentType);
        return c.json(ticket);
    } catch (err) {
        console.error('Error generating upload ticket:', err);
        return c.json({ error: 'Failed to generate upload ticket', message: err.message }, 500);
    }
});

placementsRoutes.get('/resumes', requireAuth, async (c) => {
    const userId = c.get('userId');
    try {
        const { data, error } = await supabase
            .from('resumes')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        return c.json(data);
    } catch (err) {
        console.error('Error fetching resumes:', err);
        return c.json({ error: 'Failed to fetch resumes' }, 500);
    }
});

placementsRoutes.post('/resumes', requireAuth, async (c) => {
    const userId = c.get('userId');
    try {
        const { title, target_role, link_url } = await c.req.json();
        const { data, error } = await supabase
            .from('resumes')
            .insert({
                user_id: userId,
                title,
                target_role,
                link_url
            })
            .select()
            .single();
            
        if (error) throw error;
        return c.json(data);
    } catch (err) {
        console.error('Error creating resume:', err);
        return c.json({ error: 'Failed to create resume' }, 500);
    }
});

placementsRoutes.delete('/resumes/:id', requireAuth, async (c) => {
    const userId = c.get('userId');
    const id = c.req.param('id');
    try {
        const { error } = await supabase
            .from('resumes')
            .delete()
            .eq('id', id)
            .eq('user_id', userId);
            
        if (error) throw error;
        return c.json({ success: true });
    } catch (err) {
        console.error('Error deleting resume:', err);
        return c.json({ error: 'Failed to delete resume' }, 500);
    }
});

// ==========================================
// JOB APPLICATIONS
// ==========================================

placementsRoutes.get('/applications', requireAuth, async (c) => {
    const userId = c.get('userId');
    try {
        const { data, error } = await supabase
            .from('job_applications')
            .select(`
                *,
                resume:resumes(title)
            `)
            .eq('user_id', userId)
            .order('updated_at', { ascending: false });
            
        if (error) throw error;
        
        // Transform resume object to resume_title to maintain compatibility with frontend
        const transformedData = data.map(app => ({
            ...app,
            resume_title: app.resume?.title || null
        }));
        
        return c.json(transformedData);
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
        
        const { data, error } = await supabase
            .from('job_applications')
            .insert({
                user_id: userId,
                company_name,
                role_title,
                status: status || 'wishlist',
                resume_id,
                linkedin_url,
                job_post_url,
                notes,
                applied_at
            })
            .select()
            .single();
            
        if (error) throw error;
        return c.json(data);
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
        
        const { data, error } = await supabase
            .from('job_applications')
            .update({
                company_name,
                role_title,
                status,
                resume_id,
                linkedin_url,
                job_post_url,
                notes,
                applied_at,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .eq('user_id', userId)
            .select()
            .single();
            
        if (error) throw error;
        return c.json(data);
    } catch (err) {
        console.error('Error updating application:', err);
        return c.json({ error: 'Failed to update application' }, 500);
    }
});

placementsRoutes.delete('/applications/:id', requireAuth, async (c) => {
    const userId = c.get('userId');
    const id = c.req.param('id');
    try {
        const { error } = await supabase
            .from('job_applications')
            .delete()
            .eq('id', id)
            .eq('user_id', userId);
            
        if (error) throw error;
        return c.json({ success: true });
    } catch (err) {
        console.error('Error deleting application:', err);
        return c.json({ error: 'Failed to delete application' }, 500);
    }
});

placementsRoutes.get('/readiness', requireAuth, async (c) => {
    const userId = c.get('userId');
    try {
        const [dsaRes, speakingRes, resumesRes] = await Promise.all([
            supabase.from('dsa_logs').select('id').eq('user_id', userId),
            supabase.from('lab_speaking_logs').select('confidence_score, clarity_score, pace_score').eq('user_id', userId),
            supabase.from('resumes').select('id').eq('user_id', userId)
        ]);

        const dsaCount = dsaRes.data ? dsaRes.data.length : 0;
        const speakingLogs = speakingRes.data || [];
        const resumeCount = resumesRes.data ? resumesRes.data.length : 0;

        // Calculate DSA score
        const dsaScore = Math.min(100, Math.max(35, 35 + dsaCount * 5));
        const dsaDesc = dsaCount > 0 ? `${dsaCount} problems solved this period` : 'No solved problems logged yet';

        // Calculate speaking/communication score
        let communicationScore = 60; // baseline
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

        // Calculate System Design score
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
