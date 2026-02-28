import React from 'react';
import Navbar from '../components/Navbar';
import DailyLogForm from '../components/DailyLogForm';

const Dashboard = () => {
    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <Navbar />

            <main className="max-w-3xl mx-auto px-6 pt-20 pb-16 flex flex-col gap-8">
                {/* Daily Log Section */}
                <section>
                    <DailyLogForm />
                </section>

                {/* Monthly Grid Section */}
                <section>
                    <div className="mb-4">
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-2">Monthly Grid</h2>
                    </div>
                    <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 border-dashed flex items-center justify-center h-32 text-gray-600 text-sm">
                        Coming in next build
                    </div>
                </section>

                {/* Weekly Charts Section */}
                <section>
                    <div className="mb-4">
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-2">Weekly Charts</h2>
                    </div>
                    <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 border-dashed flex items-center justify-center h-32 text-gray-600 text-sm">
                        Coming in next build
                    </div>
                </section>

                {/* Pomodoro Timer Section */}
                <section>
                    <div className="mb-4">
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-2">Pomodoro Timer</h2>
                    </div>
                    <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 border-dashed flex items-center justify-center h-32 text-gray-600 text-sm">
                        Coming in next build
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Dashboard;
