import React, { useState } from 'react';
import supabase from '../utils/supabase';
import { useAuth } from '../hooks/useAuth';

export default function SeedData() {
    const { session, user } = useAuth();
    const [status, setStatus] = useState('Idle');
    const [progress, setProgress] = useState(0);

    const handleSeed = async () => {
        if (!session || !user) {
            setStatus('Error: Not logged in. Please log in first.');
            return;
        }

        const userId = user.id;
        
        try {
            setStatus('Wiping old data (if any)...');
            // Deletions
            const tables = [
                'daily_logs', 'pomodoro_sessions', 'dsa_problems', 'journal_entries',
                'family_members', 'goals', 'habits', 'job_applications', 'resumes',
                'wealth_assets', 'accounts', 'money_transactions', 'tasks'
            ];
            for (const table of tables) {
                await supabase.from(table).delete().eq('user_id', userId);
            }

            setStatus('Generating 90 days of data...');
            const today = new Date();
            
            // 1. Static Entities
            
            // Goals
            const goals = [
                { user_id: userId, title: 'Get a Software Engineering Job', category: 'Career', status: 'in-progress', progress: 65, meta: { target_date: '2026-12-01' } },
                { user_id: userId, title: 'Reach 15% Body Fat', category: 'Health', status: 'in-progress', progress: 40, meta: { target_weight: 75 } },
                { user_id: userId, title: 'Read 12 Books', category: 'Personal', status: 'in-progress', progress: 75, meta: { current: 9, total: 12 } },
                { user_id: userId, title: 'Save $10,000 Emergency Fund', category: 'Finance', status: 'in-progress', progress: 85, meta: { amount: 8500 } }
            ];
            await supabase.from('goals').insert(goals);

            // Habits
            const habits = [
                { user_id: userId, name: 'Morning Workout', emoji: '🏋️', category: 'Health', frequency: 'daily', meta: {} },
                { user_id: userId, name: 'Read 20 pages', emoji: '📚', category: 'Mind', frequency: 'daily', meta: {} },
                { user_id: userId, name: 'Code 2 hours', emoji: '💻', category: 'Career', frequency: 'daily', meta: {} },
                { user_id: userId, name: 'Meditation', emoji: '🧘', category: 'Spirit', frequency: 'daily', meta: {} }
            ];
            await supabase.from('habits').insert(habits);

            // Family Members
            const familyMembers = [
                { user_id: userId, name: 'Robert (Dad)', relation: 'Father', dob: '1965-04-12', phone: '555-0101', email: 'robert@example.com', blood_group: 'O+', avatar_color: '#3B82F6' },
                { user_id: userId, name: 'Martha (Mom)', relation: 'Mother', dob: '1968-08-22', phone: '555-0102', email: 'martha@example.com', blood_group: 'A+', avatar_color: '#EC4899' },
                { user_id: userId, name: 'Sarah (Sister)', relation: 'Sister', dob: '1995-11-30', phone: '555-0103', email: 'sarah@example.com', blood_group: 'O-', avatar_color: '#8B5CF6' }
            ];
            const { data: insertedFamily } = await supabase.from('family_members').insert(familyMembers).select();

            // Placements (Resumes & Applications)
            const { data: resume } = await supabase.from('resumes').insert({ user_id: userId, title: 'Software Engineer Resume', target_role: 'SDE 1', link_url: 'https://example.com/resume.pdf' }).select().single();
            const jobApps = [];
            const companies = ['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Netflix', 'Stripe', 'Uber', 'Airbnb', 'Spotify'];
            const statuses = ['applied', 'screening', 'interviewing', 'rejected', 'offer'];
            for(let i=0; i<15; i++) {
                const appDate = new Date(today);
                appDate.setDate(appDate.getDate() - Math.floor(Math.random() * 80));
                jobApps.push({
                    user_id: userId, company_name: companies[i % companies.length], role_title: 'Software Engineer',
                    status: statuses[Math.floor(Math.random() * statuses.length)], resume_id: resume?.id || null,
                    applied_at: appDate.toISOString()
                });
            }
            await supabase.from('job_applications').insert(jobApps);

            // Wealth (Accounts & Assets)
            const accounts = [
                { user_id: userId, name: 'Main Checking', type: 'Checking', balance: 4500.50, icon: '🏦', color: '#3B82F6', is_default: true },
                { user_id: userId, name: 'High Yield Savings', type: 'Savings', balance: 15200.00, icon: '💰', color: '#10B981', is_default: false },
                { user_id: userId, name: 'Credit Card', type: 'Credit Card', balance: -1250.75, icon: '💳', color: '#EF4444', is_default: false }
            ];
            const { data: insertedAccounts } = await supabase.from('accounts').insert(accounts).select();
            const checkingId = insertedAccounts?.find(a => a.type === 'Checking')?.id;

            const assets = [
                { user_id: userId, asset_name: 'S&P 500 Index (VOO)', asset_type: 'Stock', units: 45.5, current_value: 22000, invested_value: 18000 },
                { user_id: userId, asset_name: 'Bitcoin (BTC)', asset_type: 'Crypto', units: 0.15, current_value: 9500, invested_value: 6000 },
                { user_id: userId, asset_name: 'Company RSUs', asset_type: 'Stock', units: 100, current_value: 15000, invested_value: 12000 }
            ];
            await supabase.from('wealth_assets').insert(assets);

            // 2. 90-Day Loop (Time Series Data)
            const logs = [];
            const pomodoros = [];
            const dsa = [];
            const journals = [];
            const transactions = [];
            const tasks = [];

            for (let i = 90; i >= 0; i--) {
                const date = new Date(today);
                date.setDate(date.getDate() - i);
                const dateStr = date.toISOString().split('T')[0];
                const isWeekend = date.getDay() === 0 || date.getDay() === 6;

                // Logs
                const baseScore = isWeekend ? 65 : 85;
                const dayScore = Math.min(100, Math.max(0, baseScore + (Math.floor(Math.random() * 20) - 10)));
                
                logs.push({
                    user_id: userId, date: dateStr, systems_score: dayScore,
                    metrics: {
                        physical: Math.min(100, dayScore + (Math.random() * 10 - 5)),
                        cognitive: Math.min(100, dayScore + (Math.random() * 10 - 5)),
                        behavior: Math.min(100, dayScore + (Math.random() * 10 - 5)),
                        reflection: Math.min(100, dayScore + (Math.random() * 10 - 5))
                    },
                    mood: dayScore > 80 ? 'Excellent' : dayScore > 60 ? 'Good' : 'Okay',
                    energy_level: dayScore > 70 ? 'High' : 'Medium',
                    focus_rating: Math.floor(dayScore / 10),
                    tags: isWeekend ? ['rest', 'family'] : ['work', 'deep-work', 'workout'],
                    notes: `Autogenerated log for ${dateStr}. Score: ${dayScore}`
                });

                // Pomodoros
                const numPomos = isWeekend ? Math.floor(Math.random() * 2) : Math.floor(Math.random() * 4) + 2;
                for (let j = 0; j < numPomos; j++) {
                    const pomoDate = new Date(date);
                    pomoDate.setHours(9 + j * 2);
                    pomodoros.push({
                        user_id: userId, task_id: `task-${j}`, duration: 25 * 60, completed: true,
                        started_at: pomoDate.toISOString(), completed_at: new Date(pomoDate.getTime() + 25 * 60000).toISOString(),
                        metadata: { project: 'Work' }
                    });
                }

                // DSA
                if (Math.random() > 0.4) {
                    dsa.push({
                        user_id: userId, problem_id: `prob-${i}`, title: `LeetCode #${Math.floor(Math.random() * 500)}`,
                        difficulty: Math.random() > 0.7 ? 'Hard' : Math.random() > 0.3 ? 'Medium' : 'Easy',
                        status: 'solved', time_spent: Math.floor(Math.random() * 45) + 15, language: 'python',
                        solved_at: date.toISOString()
                    });
                }

                // Journal
                if (Math.random() > 0.5) {
                    journals.push({
                        user_id: userId, content: `Journal entry for ${dateStr}. Feeling ${dayScore > 70 ? 'productive and focused' : 'a bit tired but pushing through'}. Made progress on my key goals.`,
                        mood: dayScore > 80 ? 'Excellent' : 'Okay', tags: ['daily'],
                        created_at: date.toISOString(), updated_at: date.toISOString()
                    });
                }

                // Tasks
                tasks.push({
                    user_id: userId, title: `Daily task ${dateStr}`, due_date: dateStr, 
                    source: 'manual', completed: true
                });

                // Finance Transactions (Expenses & Income)
                if (checkingId && Math.random() > 0.3) {
                    // Random Expense
                    transactions.push({
                        user_id: userId, date: dateStr, category: 'Food & Dining', 
                        description: 'Lunch / Coffee', amount: Math.floor(Math.random() * 25) + 5,
                        currency: 'USD', source: 'manual', account_id: checkingId, type: 'expense'
                    });
                }
                if (checkingId && date.getDate() === 1) {
                    // Monthly Salary
                    transactions.push({
                        user_id: userId, date: dateStr, category: 'Income', 
                        description: 'Monthly Salary', amount: 5500,
                        currency: 'USD', source: 'manual', account_id: checkingId, type: 'income'
                    });
                }

                setProgress(Math.round(((90 - i) / 90) * 100));
            }

            // Insert Time Series in Batches
            setStatus('Inserting Daily Logs...');
            for (let i = 0; i < logs.length; i += 50) await supabase.from('daily_logs').insert(logs.slice(i, i + 50));
            
            setStatus('Inserting Pomodoro Sessions...');
            for (let i = 0; i < pomodoros.length; i += 50) await supabase.from('pomodoro_sessions').insert(pomodoros.slice(i, i + 50));
            
            setStatus('Inserting DSA & Journals...');
            for (let i = 0; i < dsa.length; i += 50) await supabase.from('dsa_problems').insert(dsa.slice(i, i + 50));
            for (let i = 0; i < journals.length; i += 50) await supabase.from('journal_entries').insert(journals.slice(i, i + 50));
            
            setStatus('Inserting Transactions & Tasks...');
            for (let i = 0; i < transactions.length; i += 50) await supabase.from('money_transactions').insert(transactions.slice(i, i + 50));
            for (let i = 0; i < tasks.length; i += 50) await supabase.from('tasks').insert(tasks.slice(i, i + 50));

            // Set LocalStorage for Discipline
            setStatus('Setting LocalStorage (Discipline)...');
            const relapseDate = new Date(today);
            relapseDate.setDate(relapseDate.getDate() - 45);
            const disciplineState = {
                startDate: relapseDate.toISOString(), pledge: 'I will remain disciplined and focused on my goals.',
                graceRemaining: 2, lastRefresh: today.toISOString(), streakDays: 45
            };
            localStorage.setItem('aiimin_discipline_v3', JSON.stringify(disciplineState));

            const historicalLogs = [];
            for(let i=0; i<8; i++) {
                const urgeDate = new Date(today);
                urgeDate.setDate(urgeDate.getDate() - Math.floor(Math.random() * 40));
                historicalLogs.push({ id: 'urge-' + i, type: 'urge_surfed', timestamp: urgeDate.toISOString(), note: 'Successfully surfed an urge.', severity: Math.floor(Math.random() * 5) + 1 });
            }
            localStorage.setItem('aiimin_discipline_log_v3', JSON.stringify(historicalLogs));
            window.dispatchEvent(new Event('storage'));

            setStatus('Done! Dashboard is now seeded with comprehensive 90-day test data.');
            setProgress(100);

        } catch (err) {
            console.error(err);
            setStatus(`Error: ${err.message}`);
        }
    };

    return (
        <div style={{ padding: '100px 40px', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
            <h1>Comprehensive 90-Day Data Seeder</h1>
            <p>This script deletes existing data for the test account and inserts exactly 90 days of synthetic usage across all OS modules: Family, Finance, Goals, Habits, Journals, Placements, and more. Because it interacts directly with your production Supabase database via the authenticated user token, <strong>this data will be immediately visible on both localhost and the live deployed website.</strong></p>
            
            <div style={{ marginBottom: '20px', marginTop: '30px' }}>
                <button 
                    onClick={handleSeed}
                    disabled={status.includes('Inserting') || status.includes('Generating') || status.includes('Wiping')}
                    style={{
                        padding: '14px 28px',
                        background: '#10B981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        boxShadow: '0 4px 6px rgba(16, 185, 129, 0.2)'
                    }}
                >
                    Inject 90 Days of Data
                </button>
            </div>

            <div style={{ background: '#f4f4f5', padding: '20px', borderRadius: '8px', border: '1px solid #e4e4e7' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>Status: {status}</div>
                <div style={{ width: '100%', height: '20px', background: '#e4e4e7', borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{ width: `${progress}%`, height: '100%', background: '#3b82f6', transition: 'width 0.2s' }} />
                </div>
                <div style={{ textAlign: 'right', fontSize: '12px', marginTop: '5px', color: '#666' }}>{progress}%</div>
            </div>
            
            <div style={{ marginTop: '30px' }}>
                <a href="/overview" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 'bold' }}>← Return to Dashboard</a>
            </div>
        </div>
    );
}
