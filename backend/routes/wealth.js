import { Hono } from 'hono';
import { supabase } from '../lib/db.js';
import { requireAuth } from '../middleware/auth.js';

const wealthRoutes = new Hono();

// Get all assets
wealthRoutes.get('/assets', requireAuth, async (c) => {
    const userId = c.get('userId');
    try {
        const { data, error } = await supabase
            .from('wealth_assets')
            .select('*')
            .eq('user_id', userId)
            .order('current_value', { ascending: false });
        
        if (error) throw error;
        return c.json(data);
    } catch (err) {
        console.error('Error fetching wealth assets:', err);
        return c.json({ error: 'Failed to fetch assets' }, 500);
    }
});

// Add new asset
wealthRoutes.post('/assets', requireAuth, async (c) => {
    const userId = c.get('userId');
    try {
        const { asset_name, asset_type, units, current_value, invested_value } = await c.req.json();
        const { data, error } = await supabase
            .from('wealth_assets')
            .insert({
                user_id: userId,
                asset_name,
                asset_type,
                units: units || 0,
                current_value: current_value || 0,
                invested_value: invested_value || 0
            })
            .select()
            .single();
            
        if (error) throw error;
        return c.json(data);
    } catch (err) {
        console.error('Error creating wealth asset:', err);
        return c.json({ error: 'Failed to create asset' }, 500);
    }
});

// Update asset
wealthRoutes.put('/assets/:id', requireAuth, async (c) => {
    const userId = c.get('userId');
    const id = c.req.param('id');
    try {
        const updates = await c.req.json();
        const { asset_name, asset_type, units, current_value, invested_value } = updates;
        
        const { data, error } = await supabase
            .from('wealth_assets')
            .update({
                asset_name,
                asset_type,
                units,
                current_value,
                invested_value,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .eq('user_id', userId)
            .select()
            .single();
            
        if (error) throw error;
        return c.json(data);
    } catch (err) {
        console.error('Error updating wealth asset:', err);
        return c.json({ error: 'Failed to update asset' }, 500);
    }
});

// Delete asset
wealthRoutes.delete('/assets/:id', requireAuth, async (c) => {
    const userId = c.get('userId');
    const id = c.req.param('id');
    try {
        const { error } = await supabase
            .from('wealth_assets')
            .delete()
            .eq('id', id)
            .eq('user_id', userId);
            
        if (error) throw error;
        return c.json({ success: true });
    } catch (err) {
        console.error('Error deleting wealth asset:', err);
        return c.json({ error: 'Failed to delete asset' }, 500);
    }
});

export default wealthRoutes;
