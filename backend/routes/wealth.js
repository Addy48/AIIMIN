import { Hono } from 'hono';
import { getPool } from '../lib/db.js';

const wealthRoutes = new Hono();

// Get all assets
wealthRoutes.get('/assets', async (c) => {
    const user = c.get('user');
    const pool = getPool();
    try {
        const { rows } = await pool.query(
            'SELECT * FROM public.wealth_assets WHERE user_id = $1 ORDER BY current_value DESC',
            [user.id]
        );
        return c.json(rows);
    } catch (err) {
        console.error('Error fetching wealth assets:', err);
        return c.json({ error: 'Failed to fetch assets' }, 500);
    }
});

// Add new asset
wealthRoutes.post('/assets', async (c) => {
    const user = c.get('user');
    const pool = getPool();
    try {
        const { asset_name, asset_type, units, current_value, invested_value } = await c.req.json();
        const { rows } = await pool.query(
            `INSERT INTO public.wealth_assets 
             (user_id, asset_name, asset_type, units, current_value, invested_value)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [user.id, asset_name, asset_type, units, current_value, invested_value]
        );
        return c.json(rows[0]);
    } catch (err) {
        console.error('Error creating wealth asset:', err);
        return c.json({ error: 'Failed to create asset' }, 500);
    }
});

// Update asset
wealthRoutes.put('/assets/:id', async (c) => {
    const user = c.get('user');
    const id = c.req.param('id');
    const pool = getPool();
    try {
        const { asset_name, asset_type, units, current_value, invested_value } = await c.req.json();
        const { rows } = await pool.query(
            `UPDATE public.wealth_assets 
             SET asset_name = COALESCE($1, asset_name),
                 asset_type = COALESCE($2, asset_type),
                 units = COALESCE($3, units),
                 current_value = COALESCE($4, current_value),
                 invested_value = COALESCE($5, invested_value),
                 updated_at = NOW()
             WHERE id = $6 AND user_id = $7 RETURNING *`,
            [asset_name, asset_type, units, current_value, invested_value, id, user.id]
        );
        return c.json(rows[0]);
    } catch (err) {
        console.error('Error updating wealth asset:', err);
        return c.json({ error: 'Failed to update asset' }, 500);
    }
});

// Delete asset
wealthRoutes.delete('/assets/:id', async (c) => {
    const user = c.get('user');
    const id = c.req.param('id');
    const pool = getPool();
    try {
        await pool.query('DELETE FROM public.wealth_assets WHERE id = $1 AND user_id = $2', [id, user.id]);
        return c.json({ success: true });
    } catch (err) {
        console.error('Error deleting wealth asset:', err);
        return c.json({ error: 'Failed to delete asset' }, 500);
    }
});

export default wealthRoutes;
