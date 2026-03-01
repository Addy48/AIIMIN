import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import dailyLogsRoutes from './routes/dailyLogs.js';
import goalsRoutes from './routes/goals.js';
import pomodoroRoutes from './routes/pomodoro.js';
import moneyRoutes from './routes/money.js';
import winsRoutes from './routes/wins.js';
import dashboardRoutes from './routes/dashboard.js';
import youtubeRoutes from './routes/youtube.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ status: 'ok' });
});

app.use('/auth', authRoutes);
app.use('/daily-logs', dailyLogsRoutes);
app.use('/goals', goalsRoutes);
app.use('/pomodoro-sessions', pomodoroRoutes);
app.use('/money', moneyRoutes);
app.use('/wins', winsRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/youtube', youtubeRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
