import { Hono } from 'hono';
import { put, del } from '@vercel/blob';

const blobService = new Hono();

blobService.post('/upload', async (c) => {
    try {
        const body = await c.req.parseBody();
        const file = body['file'];
        
        if (!file) {
            return c.json({ error: 'No file provided' }, 400);
        }

        const blob = await put(file.name, file, { access: 'public' });

        return c.json({
            url: blob.url,
            pathname: blob.pathname
        });
    } catch (err) {
        console.error('Blob upload error:', err);
        return c.json({ error: 'Failed to upload file to Vercel Blob' }, 500);
    }
});

blobService.delete('/delete', async (c) => {
    try {
        const { url } = await c.req.json();
        if (!url) {
            return c.json({ error: 'URL is required' }, 400);
        }

        await del(url);
        return c.json({ success: true });
    } catch (err) {
        console.error('Blob delete error:', err);
        return c.json({ error: 'Failed to delete file from Vercel Blob' }, 500);
    }
});

export default blobService;
