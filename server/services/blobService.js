import { Hono } from 'hono';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const blobService = new Hono();

// Initialize Supabase Client with Service Role Key for full admin control
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

blobService.post('/upload', async (c) => {
    try {
        const body = await c.req.parseBody();
        const file = body['file'];
        
        if (!file) {
            return c.json({ error: 'No file provided' }, 400);
        }

        // Generate unique filename to avoid collisions
        const uniqueId = crypto.randomUUID();
        const originalName = file.name || 'file';
        const ext = originalName.includes('.') ? originalName.split('.').pop() : '';
        const filePath = ext ? `${uniqueId}.${ext}` : uniqueId;

        // Convert the File object to a Buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload to Supabase Storage
        const { data, error } = await supabase
            .storage
            .from('dashboard-uploads')
            .upload(filePath, buffer, {
                contentType: file.type || 'application/octet-stream',
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

        console.log(`[Storage] Uploaded: ${filePath} -> ${publicUrl}`);

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
        const { url } = await c.req.json();
        if (!url) {
            return c.json({ error: 'URL is required' }, 400);
        }

        // Robustly parse the unique filename from the Supabase public URL
        // Example: https://yubxgftugxbwtywyhcsv.supabase.co/storage/v1/object/public/dashboard-uploads/filename.ext
        let filePath = url;
        if (url.includes('/dashboard-uploads/')) {
            filePath = url.split('/dashboard-uploads/').pop();
        }

        const { data, error } = await supabase
            .storage
            .from('dashboard-uploads')
            .remove([filePath]);

        if (error) {
            throw error;
        }

        console.log(`[Storage] Deleted: ${filePath}`);

        return c.json({ success: true });
    } catch (err) {
        console.error('Supabase Storage delete error:', err);
        return c.json({ error: 'Failed to delete file from Supabase Storage', message: err.message }, 500);
    }
});

export default blobService;
