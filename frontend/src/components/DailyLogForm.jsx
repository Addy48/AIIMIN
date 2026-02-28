import React, { useState } from 'react';
import supabase from '../utils/supabase';

const DailyLogForm = () => {
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
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

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
        setSuccessMessage('');
        setErrorMessage('');

        try {
            const today = new Date().toISOString().split('T')[0];
            const payload = {
                user_id: 'demo-user-id',
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

            const { data, error } = await supabase
                .from('daily_logs')
                .upsert(payload, { onConflict: 'user_id,date' })
                .select();

            if (error) throw error;

            setSuccessMessage('Log saved for today');
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
                setSuccessMessage('');
            }, 3000);
        } catch (error) {
            console.error(error);
            setErrorMessage('Failed to save log. Try again.');
        } finally {
            setLoading(false);
        }
    };

    const todayDisplay = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

    return (
        <form onSubmit={handleSubmit} className="w-full bg-gray-900 rounded-2xl p-8 border border-gray-800">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold text-white">Today's Log</h3>
                <span className="text-sm text-gray-500">{todayDisplay}</span>
            </div>

            {/* SLEEP SECTION */}
            <div className="mb-0">
                <div className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">Sleep</div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-gray-400 text-xs font-medium mb-1.5 block">Bedtime</label>
                        <input
                            type="time"
                            name="sleepStart"
                            value={formData.sleepStart}
                            onChange={handleChange}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all duration-200"
                        />
                    </div>
                    <div>
                        <label className="text-gray-400 text-xs font-medium mb-1.5 block">Wake Time</label>
                        <input
                            type="time"
                            name="sleepEnd"
                            value={formData.sleepEnd}
                            onChange={handleChange}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all duration-200"
                        />
                    </div>
                </div>
                {formData.sleepStart && formData.sleepEnd && (
                    <div className={`mt-2 text-sm ${sleepHours >= 7 ? 'text-green-400' : (sleepHours >= 5 ? 'text-yellow-400' : 'text-red-400')}`}>
                        {sleepHours >= 7 && `✓ ${sleepHours} hrs — Good sleep`}
                        {sleepHours >= 5 && sleepHours < 7 && `⚠ ${sleepHours} hrs — Below target`}
                        {sleepHours < 5 && `✗ ${sleepHours} hrs — Poor sleep`}
                    </div>
                )}
            </div>

            <div className="border-t border-gray-800 mt-6 mb-6"></div>

            {/* BODY SECTION */}
            <div className="mb-0">
                <div className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">Body</div>

                <label className="flex items-center gap-3 cursor-pointer mb-3">
                    <input
                        type="checkbox"
                        name="gymDone"
                        checked={formData.gymDone}
                        onChange={handleChange}
                        className="w-4 h-4 accent-orange-500"
                    />
                    <span className="text-gray-300 text-sm">Gym today?</span>
                </label>

                {formData.gymDone && (
                    <div className="mb-3">
                        <label className="text-gray-400 text-xs font-medium mb-1.5 block">Duration (min)</label>
                        <input
                            type="number"
                            name="gymDuration"
                            value={formData.gymDuration}
                            onChange={handleChange}
                            placeholder="0"
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all duration-200"
                        />
                    </div>
                )}

                <label className="flex items-center gap-3 cursor-pointer mb-3">
                    <input
                        type="checkbox"
                        name="breakfastDone"
                        checked={formData.breakfastDone}
                        onChange={handleChange}
                        className="w-4 h-4 accent-orange-500"
                    />
                    <span className="text-gray-300 text-sm">Had breakfast?</span>
                </label>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-gray-400 text-xs font-medium mb-1.5 block">Steps</label>
                        <input
                            type="number"
                            name="steps"
                            value={formData.steps}
                            onChange={handleChange}
                            placeholder="0"
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all duration-200"
                        />
                    </div>
                    <div>
                        <label className="text-gray-400 text-xs font-medium mb-1.5 block">Protein (g)</label>
                        <input
                            type="number"
                            name="proteinGrams"
                            value={formData.proteinGrams}
                            onChange={handleChange}
                            placeholder="0"
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all duration-200"
                        />
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-800 mt-6 mb-6"></div>

            {/* FOCUS SECTION */}
            <div className="mb-0">
                <div className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">Focus</div>

                <label className="flex items-center gap-3 cursor-pointer mb-3">
                    <input
                        type="checkbox"
                        name="learningDone"
                        checked={formData.learningDone}
                        onChange={handleChange}
                        className="w-4 h-4 accent-orange-500"
                    />
                    <span className="text-gray-300 text-sm">Learned something today?</span>
                </label>

                {formData.learningDone && (
                    <div className="mb-3">
                        <label className="text-gray-400 text-xs font-medium mb-1.5 block">What did you learn?</label>
                        <input
                            type="text"
                            name="learningTopic"
                            value={formData.learningTopic}
                            onChange={handleChange}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all duration-200"
                        />
                    </div>
                )}

                <div>
                    <label className="text-gray-400 text-xs font-medium mb-1.5 block">Urges count</label>
                    <input
                        type="number"
                        name="masturbationCount"
                        min="0"
                        value={formData.masturbationCount}
                        onChange={handleChange}
                        placeholder="0"
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all duration-200"
                    />
                </div>
            </div>

            <div className="border-t border-gray-800 mt-6 mb-6"></div>

            {/* JOURNAL SECTION */}
            <div className="mb-0">
                <div className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">Journal</div>
                <textarea
                    name="journalEntry"
                    rows="4"
                    value={formData.journalEntry}
                    onChange={handleChange}
                    placeholder="What happened today? Wins, struggles, thoughts..."
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all duration-200 resize-none"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full mt-8 py-3 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm tracking-wide"
            >
                {loading ? 'Saving...' : 'Submit'}
            </button>

            {successMessage && (
                <div className="flex items-center gap-2 text-green-400 text-sm mt-3">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    {successMessage}
                </div>
            )}

            {errorMessage && <div className="text-red-400 text-sm mt-3">{errorMessage}</div>}
        </form>
    );
};

export default DailyLogForm;
