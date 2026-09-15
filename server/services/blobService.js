import { Hono } from 'hono';
import { createClient } from '@supabase/supabase-js';
import { requireAuth } from '../middleware/auth.js';
import { validateUploadBuffer, safeUploadFilename } from '../lib/uploadValidate.js';

const blobService = new Hono();

// Enforce authentication on all blob storage routes
blobService.use('*', requireAuth);

// Initialize Supabase Client with Service Role Key for full admin control
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

blobService.post('/upload', async (c) => {
    try {
        const userId = c.get('userId');
        const body = await c.req.parseBody();
        const file = body['file'];
        
        if (!file) {
            return c.json({ error: 'No file provided' }, 400);
        }

        // Convert the File object to a Buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Validate buffer size, allowed MIME types, and magic bytes
        const validation = validateUploadBuffer(buffer, file.type);
        if (!validation.ok) {
            return c.json({ error: validation.error }, 400);
        }

        // Generate safe unique filename partitioned by authenticated user ID
        const safeName = safeUploadFilename(file.name || 'upload');
        const filePath = `${userId}/${safeName}`;

        // Upload to Supabase Storage
        const { data, error } = await supabase
            .storage
            .from('dashboard-uploads')
            .upload(filePath, buffer, {
                contentType: validation.mime,
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

        console.log(`[Storage] Uploaded for user ${userId}: ${filePath} -> ${publicUrl}`);

        return c.json({
            url: publicUrl,
            pathname: filePath
        });
    } catch (err) {
        console.error('Supabase Storage upload error:', err);
        return c.json({ error: 'Failed to upload file to Supabase Storage', message: err.message }, 500);
    }
});

blobService.delete('/delete', async (c) => {
    try {
        const userId = c.get('userId');
        const { url } = await c.req.json();
        if (!url) {
            return c.json({ error: 'URL is required' }, 400);
        }

        // Parse the filename/path from the URL or pathname
        let filePath = String(url).trim();
        if (filePath.includes('/dashboard-uploads/')) {
            filePath = filePath.split('/dashboard-uploads/').pop();
        }
        filePath = filePath.replace(/^\/+/, '');

        // Security check: ensure user cannot delete files belonging to other users or root bucket files
        if (!filePath.startsWith(`${userId}/`)) {
            return c.json({ error: 'Forbidden: cannot delete files belonging to another user' }, 403);
        }

        const { data, error } = await supabase
            .storage
            .from('dashboard-uploads')
            .remove([filePath]);

        if (error) {
            throw error;
        }

        console.log(`[Storage] Deleted by user ${userId}: ${filePath}`);

        return c.json({ success: true });
    } catch (err) {
        console.error('Supabase Storage delete error:', err);
        return c.json({ error: 'Failed to delete file from Supabase Storage', message: err.message }, 500);
    }
});

export default blobService;
