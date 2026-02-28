import React, { useState } from 'react';
import supabase from '../utils/supabase';

const DailyLogForm = ({ user }) => {
    const [formData, setFormData] = useState({
        sleepStart: '',
        sleepEnd: '',
        gymDone: false,
        gymDuration: 0,
        breakfastDone: false,
        steps: 0,
        proteinGrams: 0,
        learningDone: false,
        learningTopic: '',
        masturbationCount: 0,
        journalEntry: ''
    });

    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: '' });

    const showToast = (message, type) => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
    };

    const calculateSleepHours = () => {
        if (!formData.sleepStart || !formData.sleepEnd) return 0;

        const start = formData.sleepStart.split(':').map(Number);
        const end = formData.sleepEnd.split(':').map(Number);

        let startMins = start[0] * 60 + start[1];
        let endMins = end[0] * 60 + end[1];

        if (endMins <= startMins) {
            endMins += 24 * 60; // Next day
        }

        return Number(((endMins - startMins) / 60).toFixed(1));
    };

    const sleepHours = calculateSleepHours();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : (type === 'number' ? (value ? Number(value) : '') : value)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const today = new Date().toISOString().split('T')[0];
            const userId = user?.id || 'demo-user-id'; // Fallback for testing

            const payload = {
                user_id: userId,
                date: today,
                sleep_start: formData.sleepStart || null,
                sleep_end: formData.sleepEnd || null,
                sleep_hours: sleepHours || null,
                masturbation_count: typeof formData.masturbationCount === 'number' ? formData.masturbationCount : 0,
                gym_done: formData.gymDone || false,
                gym_duration: typeof formData.gymDuration === 'number' ? formData.gymDuration : null,
                breakfast_done: formData.breakfastDone || false,
                steps: typeof formData.steps === 'number' ? formData.steps : 0,
                protein_grams: typeof formData.proteinGrams === 'number' ? formData.proteinGrams : 0,
                learning_done: formData.learningDone || false,
                learning_topic: formData.learningTopic || null,
                journal_entry: formData.journalEntry || null
            };

            const { error } = await supabase
                .from('daily_logs')
                .upsert(payload, { onConflict: 'user_id,date' })
                .select();

            if (error) throw error;

            showToast('Log saved for today', 'success');

            // Optionally clear form or keep it populated for today
            setTimeout(() => {
                setFormData({
                    sleepStart: '',
                    sleepEnd: '',
                    gymDone: false,
                    gymDuration: 0,
                    breakfastDone: false,
                    steps: 0,
                    proteinGrams: 0,
                    learningDone: false,
                    learningTopic: '',
                    masturbationCount: 0,
                    journalEntry: ''
                });
            }, 500);
        } catch (error) {
            console.error(error);
            showToast('Failed to save log. Try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const todayDisplay = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

    return (
        <form onSubmit={handleSubmit} className="w-full bg-[var(--bg-card)] rounded-[var(--radius-lg)] p-8 border border-[var(--border)] shadow-[var(--shadow)] relative">

            <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold text-[var(--text-1)] tracking-tight">Today's Log</h3>
                <span className="text-sm text-[var(--text-2)] font-medium">{todayDisplay}</span>
            </div>

            {/* SLEEP SECTION */}
            <div className="mb-0">
                <div className="text-xs font-semibold uppercase tracking-widest text-[var(--text-3)] mb-4">Sleep</div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-[var(--text-2)] text-xs font-medium mb-1.5 block">Bedtime</label>
                        <input
                            type="time"
                            name="sleepStart"
                            value={formData.sleepStart}
                            onChange={handleChange}
                            className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[var(--radius-sm)] px-4 py-2.5 text-[var(--text-1)] text-sm focus:outline-none hover:border-[var(--border-hover)] focus:border-[var(--accent)] transition-all duration-200"
                        />
                    </div>
                    <div>
                        <label className="text-[var(--text-2)] text-xs font-medium mb-1.5 block">Wake Time</label>
                        <input
                            type="time"
                            name="sleepEnd"
                            value={formData.sleepEnd}
                            onChange={handleChange}
                            className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[var(--radius-sm)] px-4 py-2.5 text-[var(--text-1)] text-sm focus:outline-none hover:border-[var(--border-hover)] focus:border-[var(--accent)] transition-all duration-200"
                        />
                    </div>
                </div>
                {formData.sleepStart && formData.sleepEnd && (
                    <div className="mt-4">
                        {sleepHours >= 7 && <span className="inline-flex items-center px-2.5 py-1 rounded-[var(--radius-sm)] text-xs font-medium border border-[#10b98140] bg-[#10b98115] text-[var(--success)] shadow-sm">✓ {sleepHours} hrs — Good sleep</span>}
                        {sleepHours >= 5 && sleepHours < 7 && <span className="inline-flex items-center px-2.5 py-1 rounded-[var(--radius-sm)] text-xs font-medium border border-[#f59e0b40] bg-[#f59e0b15] text-[var(--warning)] shadow-sm">⚠ {sleepHours} hrs — Below target</span>}
                        {sleepHours < 5 && <span className="inline-flex items-center px-2.5 py-1 rounded-[var(--radius-sm)] text-xs font-medium border border-[#ef444440] bg-[#ef444415] text-[var(--danger)] shadow-sm">✗ {sleepHours} hrs — Poor sleep</span>}
                    </div>
                )}
            </div>

            <div className="border-t border-[var(--border)] mt-8 mb-8"></div>

            {/* BODY SECTION */}
            <div className="mb-0">
                <div className="text-xs font-semibold uppercase tracking-widest text-[var(--text-3)] mb-4">Body</div>

                <div className="grid grid-cols-1 gap-6">
                    <div className="grid grid-cols-2 gap-4">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                name="gymDone"
                                checked={formData.gymDone}
                                onChange={handleChange}
                                className="w-4 h-4 rounded border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--accent)] focus:ring-[var(--accent)] cursor-pointer"
                            />
                            <span className="text-[var(--text-1)] text-sm group-hover:text-[var(--accent)] transition-colors">Gym today?</span>
                        </label>

                        {formData.gymDone && (
                            <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                                <label className="text-[var(--text-2)] text-xs font-medium mb-1.5 block">Duration (min)</label>
                                <input
                                    type="number"
                                    name="gymDuration"
                                    value={formData.gymDuration}
                                    onChange={handleChange}
                                    placeholder="0"
                                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[var(--radius-sm)] px-4 py-2 text-[var(--text-1)] text-sm focus:outline-none hover:border-[var(--border-hover)] focus:border-[var(--accent)] transition-all duration-200"
                                />
                            </div>
                        )}
                    </div>

                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                            type="checkbox"
                            name="breakfastDone"
                            checked={formData.breakfastDone}
                            onChange={handleChange}
                            className="w-4 h-4 rounded border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--accent)] focus:ring-[var(--accent)] cursor-pointer"
                        />
                        <span className="text-[var(--text-1)] text-sm group-hover:text-[var(--accent)] transition-colors">Had breakfast?</span>
                    </label>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[var(--text-2)] text-xs font-medium mb-1.5 block">Steps</label>
                            <input
                                type="number"
                                name="steps"
                                value={formData.steps}
                                onChange={handleChange}
                                placeholder="0"
                                className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[var(--radius-sm)] px-4 py-2.5 text-[var(--text-1)] text-sm focus:outline-none hover:border-[var(--border-hover)] focus:border-[var(--accent)] transition-all duration-200"
                            />
                        </div>
                        <div>
                            <label className="text-[var(--text-2)] text-xs font-medium mb-1.5 block">Protein (g)</label>
                            <input
                                type="number"
                                name="proteinGrams"
                                value={formData.proteinGrams}
                                onChange={handleChange}
                                placeholder="0"
                                className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[var(--radius-sm)] px-4 py-2.5 text-[var(--text-1)] text-sm focus:outline-none hover:border-[var(--border-hover)] focus:border-[var(--accent)] transition-all duration-200"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t border-[var(--border)] mt-8 mb-8"></div>

            {/* FOCUS SECTION */}
            <div className="mb-0">
                <div className="text-xs font-semibold uppercase tracking-widest text-[var(--text-3)] mb-4">Focus</div>

                <div className="grid grid-cols-1 gap-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                name="learningDone"
                                checked={formData.learningDone}
                                onChange={handleChange}
                                className="w-4 h-4 rounded border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--accent)] focus:ring-[var(--accent)] cursor-pointer"
                            />
                            <span className="text-[var(--text-1)] text-sm group-hover:text-[var(--accent)] transition-colors">Learned something?</span>
                        </label>

                        {formData.learningDone && (
                            <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                                <label className="text-[var(--text-2)] text-xs font-medium mb-1.5 block">Topic</label>
                                <input
                                    type="text"
                                    name="learningTopic"
                                    value={formData.learningTopic}
                                    onChange={handleChange}
                                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[var(--radius-sm)] px-4 py-2 text-[var(--text-1)] text-sm focus:outline-none hover:border-[var(--border-hover)] focus:border-[var(--accent)] transition-all duration-200"
                                />
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[var(--text-2)] text-xs font-medium mb-1.5 block">Urges count</label>
                            <input
                                type="number"
                                name="masturbationCount"
                                min="0"
                                value={formData.masturbationCount}
                                onChange={handleChange}
                                placeholder="0"
                                className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[var(--radius-sm)] px-4 py-2.5 text-[var(--text-1)] text-sm focus:outline-none hover:border-[var(--border-hover)] focus:border-[var(--accent)] transition-all duration-200"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t border-[var(--border)] mt-8 mb-8"></div>

            {/* JOURNAL SECTION */}
            <div className="mb-0">
                <div className="text-xs font-semibold uppercase tracking-widest text-[var(--text-3)] mb-4">Journal</div>
                <textarea
                    name="journalEntry"
                    rows="4"
                    value={formData.journalEntry}
                    onChange={handleChange}
                    placeholder="Wins, struggles, thoughts..."
                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[var(--radius-sm)] px-4 py-3 text-[var(--text-1)] text-sm placeholder-[var(--text-3)] focus:outline-none hover:border-[var(--border-hover)] focus:border-[var(--accent)] transition-all duration-200 resize-none"
                />
            </div>

            <div className="mt-8 flex items-center justify-between gap-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-medium rounded-[var(--radius-md)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
                >
                    {loading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Saving...
                        </>
                    ) : 'Submit Log'}
                </button>
            </div>

            {/* Toast Notification */}
            {toast.show && (
                <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2.5 rounded-[var(--radius-full)] text-sm font-medium flex items-center gap-2 shadow-[var(--shadow)] animate-in fade-in slide-in-from-bottom-4 duration-300 border backdrop-blur-md z-10 ${toast.type === 'success' ? 'bg-[#10b98120] text-[var(--success)] border-[#10b98140]' : 'bg-[#ef444420] text-[var(--danger)] border-[#ef444440]'
                    }`}>
                    {toast.type === 'success' ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    )}
                    {toast.message}
                </div>
            )}
        </form>
    );
};

export default DailyLogForm;
