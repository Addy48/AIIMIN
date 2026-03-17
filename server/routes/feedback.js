import { Hono } from 'hono';
import { requireAuth } from '../middleware/auth.js';
import nodemailer from 'nodemailer';

const app = new Hono();

app.post('/', requireAuth, async (c) => {
    try {
        const userId = c.get('userId');
        const user = c.get('user');
        const body = await c.req.json();
        
        const { type, message } = body;
        
        if (!message) {
            return c.json({ error: 'Message is required' }, 400);
        }

        // Send email via Gmail if app password is set
        if (process.env.GMAIL_APP_PASSWORD) {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.DEV_EMAIL || 'aadityaupadhyay10@gmail.com',
                    pass: process.env.GMAIL_APP_PASSWORD
                }
            });

            const mailOptions = {
                from: process.env.DEV_EMAIL || 'aadityaupadhyay10@gmail.com',
                to: process.env.DEV_EMAIL || 'aadityaupadhyay10@gmail.com',
                subject: `AIIMIN Feedback [${(type || 'general').toUpperCase()}] from ${user?.email || 'Unknown User'}`,
                text: `User ID: ${userId}\nUser Email: ${user?.email || 'Unknown'}\nType: ${type}\n\nMessage:\n${message}`,
            };

            await transporter.sendMail(mailOptions);
            console.log('[Feedback] Email sent successfully.');
        } else {
            console.warn('[Feedback] GMAIL_APP_PASSWORD not set in environment variables. Logging feedback to console instead.');
            console.log(`\n--- NEW FEEDBACK ---\nType: ${type}\nUser: ${user?.email}\nMessage: ${message}\n--------------------\n`);
        }

        return c.json({ success: true, message: 'Feedback processed successfully' });
    } catch (err) {
        console.error('[Feedback] Error sending email:', err);
        return c.json({ error: 'Failed to submit feedback' }, 500);
    }
});

export default app;
