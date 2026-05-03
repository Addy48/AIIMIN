import { Hono } from 'hono';
import { supabase } from '../lib/db.js';
import { requireAuth } from '../middleware/auth.js';

const placementsRoutes = new Hono();

// ==========================================
// RESUMES
// ==========================================

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

export default placementsRoutes;
